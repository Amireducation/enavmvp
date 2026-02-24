-- Migration: Add Service Requests System
-- Purpose: Implement user-driven service request workflow
-- Date: 2026-02-20

-- Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT NOT NULL,
  category_suggestion VARCHAR(100) NOT NULL,
  justification TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted' 
    CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'archived')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  estimated_impact TEXT,
  similar_requests_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT service_requests_user_id CHECK (user_id IS NOT NULL)
);

-- Service Request Workflow Logs Table
CREATE TABLE IF NOT EXISTS service_request_workflow_logs (
  workflow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(request_id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL 
    CHECK (action IN ('submitted', 'assigned', 'info_requested', 'approved', 'rejected', 'published')),
  performed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  comments TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Update Services Table to link to requests
ALTER TABLE services ADD COLUMN IF NOT EXISTS source_request_id UUID REFERENCES service_requests(request_id) ON DELETE SET NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS approval_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS last_review_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_requested BOOLEAN DEFAULT FALSE;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_to ON service_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category_suggestion);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_request_id ON service_request_workflow_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_performed_by ON service_request_workflow_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_services_source_request_id ON services(source_request_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_service_requests_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_service_requests_timestamp();

-- Feedback and Ratings System
CREATE TABLE IF NOT EXISTS service_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(application_id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'published' 
    CHECK (status IN ('published', 'under_review', 'rejected', 'archived')),
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Rating Aggregation (for dashboard)
CREATE TABLE IF NOT EXISTS service_rating_aggregation (
  aggregation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL UNIQUE REFERENCES services(service_id) ON DELETE CASCADE,
  total_ratings INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  rating_distribution JSONB DEFAULT '{
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notification System
CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL 
    CHECK (type IN ('service_approved', 'application_status', 'request_update', 'feedback_response', 'general')),
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  channel VARCHAR(50) NOT NULL DEFAULT 'in-app'
    CHECK (channel IN ('in-app', 'email', 'sms')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Feedback and Notifications
CREATE INDEX IF NOT EXISTS idx_feedback_service_id ON service_feedback(service_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON service_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON service_feedback(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Add triggers for feedback
CREATE OR REPLACE FUNCTION update_service_feedback_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_feedback_updated_at
  BEFORE UPDATE ON service_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_service_feedback_timestamp();

-- Function to auto-calculate service ratings
CREATE OR REPLACE FUNCTION update_service_rating_aggregation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE service_rating_aggregation
    SET total_ratings = (SELECT COUNT(*) FROM service_feedback WHERE service_id = OLD.service_id AND status = 'published'),
        average_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM service_feedback WHERE service_id = OLD.service_id AND status = 'published'), 0),
        rating_distribution = (
          SELECT jsonb_object_agg(rating::text, count) FROM (
            SELECT rating, COUNT(*) as count FROM service_feedback 
            WHERE service_id = OLD.service_id AND status = 'published'
            GROUP BY rating
          ) ratings
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE service_id = OLD.service_id;
  ELSE
    INSERT INTO service_rating_aggregation (service_id)
    VALUES (NEW.service_id)
    ON CONFLICT (service_id) DO UPDATE SET
      total_ratings = (SELECT COUNT(*) FROM service_feedback WHERE service_id = NEW.service_id AND status = 'published'),
      average_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM service_feedback WHERE service_id = NEW.service_id AND status = 'published'), 0),
      updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating_aggregation
  AFTER INSERT OR UPDATE OR DELETE ON service_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating_aggregation();
