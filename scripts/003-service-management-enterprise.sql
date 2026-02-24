-- Migration: Enterprise Service Management System
-- Purpose: Comprehensive service catalog, lifecycle, and management
-- Date: 2026-02-22

-- Enhanced Services Table
CREATE TABLE IF NOT EXISTS services_enhanced (
  service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  agency_name VARCHAR(255) NOT NULL,
  agency_id UUID REFERENCES agencies(agency_id) ON DELETE RESTRICT,
  
  -- Service Details
  service_fee DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'ETB',
  processing_time_days INTEGER,
  processing_time_range VARCHAR(100),
  
  -- Requirements
  requirements JSONB DEFAULT '[]'::jsonb,
  required_documents JSONB DEFAULT '[]'::jsonb,
  optional_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Eligibility
  min_age INTEGER,
  max_age INTEGER,
  gender_requirement VARCHAR(50),
  citizenship_required BOOLEAN DEFAULT TRUE,
  
  -- Availability
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'discontinued')),
  availability_status VARCHAR(50) DEFAULT 'available' CHECK (availability_status IN ('available', 'temporarily_unavailable', 'on_hold')),
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Contact Information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_office VARCHAR(255),
  office_address VARCHAR(500),
  office_coordinates JSONB,
  website_url VARCHAR(500),
  
  -- Language Support
  supported_languages JSONB DEFAULT '["amharic", "english"]'::jsonb,
  
  -- Metadata
  service_image_url VARCHAR(500),
  service_icon VARCHAR(100),
  meta_keywords VARCHAR(500),
  meta_description TEXT,
  
  -- Tracking
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Service Stats
  total_requests INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  -- Version Control
  version_number INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES services_enhanced(service_id) ON DELETE SET NULL
);

-- Service Categories Lookup Table
CREATE TABLE IF NOT EXISTS service_categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Availability Schedule
CREATE TABLE IF NOT EXISTS service_availability_schedule (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL,
  opens_at TIME,
  closes_at TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  notes VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Change Log (Audit Trail)
CREATE TABLE IF NOT EXISTS service_change_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  change_type VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  reason_for_change VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Performance Metrics
CREATE TABLE IF NOT EXISTS service_performance_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL UNIQUE REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  total_applications INTEGER DEFAULT 0,
  approved_applications INTEGER DEFAULT 0,
  rejected_applications INTEGER DEFAULT 0,
  avg_processing_time_days NUMERIC(5, 2) DEFAULT 0,
  approval_rate NUMERIC(5, 2) DEFAULT 0,
  customer_satisfaction_score NUMERIC(5, 2) DEFAULT 0,
  citizen_feedback_count INTEGER DEFAULT 0,
  first_time_approval_rate NUMERIC(5, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Dependencies (Service can depend on another service)
CREATE TABLE IF NOT EXISTS service_dependencies (
  dependency_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  depends_on_service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  dependency_type VARCHAR(50) NOT NULL DEFAULT 'required',
  order_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_id, depends_on_service_id)
);

-- Service Notifications/Announcements
CREATE TABLE IF NOT EXISTS service_announcements (
  announcement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (announcement_type IN ('info', 'warning', 'alert', 'maintenance')),
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Reviews/Ratings
CREATE TABLE IF NOT EXISTS service_reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services_enhanced(service_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  would_recommend BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  moderation_comment VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_services_enhanced_category ON services_enhanced(category);
CREATE INDEX IF NOT EXISTS idx_services_enhanced_agency_id ON services_enhanced(agency_id);
CREATE INDEX IF NOT EXISTS idx_services_enhanced_status ON services_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_services_enhanced_created_at ON services_enhanced(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_enhanced_name ON services_enhanced(name);
CREATE INDEX IF NOT EXISTS idx_service_change_logs_service_id ON service_change_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_service_change_logs_changed_by ON service_change_logs(changed_by);
CREATE INDEX IF NOT EXISTS idx_service_announcements_active ON service_announcements(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_service_reviews_service_id ON service_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_status ON service_reviews(status);
CREATE INDEX IF NOT EXISTS idx_service_performance_metrics_service_id ON service_performance_metrics(service_id);

-- Agencies Table
CREATE TABLE IF NOT EXISTS agencies (
  agency_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  headquarters_address VARCHAR(500),
  website_url VARCHAR(500),
  established_year INTEGER,
  employee_count INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_services_enhanced_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_services_enhanced_updated_at
  BEFORE UPDATE ON services_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_services_enhanced_timestamp();

-- Populate Categories
INSERT INTO service_categories (name, description, icon, display_order) VALUES
  ('Healthcare', 'Health insurance and medical services', 'heart', 1),
  ('Commerce', 'Business and trade services', 'briefcase', 2),
  ('Civil Status', 'Vital statistics and citizenship', 'id-card', 3),
  ('Property', 'Land and property management', 'home', 4),
  ('Education', 'Educational enrollment services', 'book', 5),
  ('Finance', 'Tax and financial services', 'dollar', 6),
  ('Transportation', 'Vehicle and travel services', 'car', 7),
  ('Justice', 'Legal and justice services', 'gavel', 8)
ON CONFLICT (name) DO NOTHING;
