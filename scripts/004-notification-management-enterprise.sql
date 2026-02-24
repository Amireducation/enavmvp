-- Enterprise Notification Management System
-- Comprehensive multi-channel notification infrastructure

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notification_history CASCADE;
DROP TABLE IF EXISTS email_queue CASCADE;
DROP TABLE IF EXISTS sms_queue CASCADE;
DROP TABLE IF EXISTS push_notifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_types CASCADE;

-- Notification Types Lookup
CREATE TABLE notification_types (
  type_id SERIAL PRIMARY KEY,
  type_code VARCHAR(50) UNIQUE NOT NULL,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  default_channel VARCHAR(50) DEFAULT 'in_app',
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Notifications Table
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type_id INTEGER REFERENCES notification_types(type_id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, critical
  related_entity_id UUID,
  related_entity_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Push Notifications Channel
CREATE TABLE push_notifications (
  push_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
  device_token VARCHAR(500),
  platform VARCHAR(50), -- ios, android, web
  delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, delivered, failed, expired
  sent_at TIMESTAMP,
  delivery_response TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Queue for Batch Processing
CREATE TABLE email_queue (
  email_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT,
  plain_text TEXT,
  delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, bounced
  sent_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS Queue for Batch Processing
CREATE TABLE sms_queue (
  sms_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_content VARCHAR(160) NOT NULL,
  delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, undelivered
  sent_at TIMESTAMP,
  carrier_id VARCHAR(100),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Preferences by User
CREATE TABLE notification_preferences (
  preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification History and Audit Trail
CREATE TABLE notification_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
  action VARCHAR(50), -- created, read, delivered, failed
  details JSONB,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_push_notifications_status ON push_notifications(delivery_status);
CREATE INDEX idx_push_notifications_created_at ON push_notifications(created_at);
CREATE INDEX idx_email_queue_status ON email_queue(delivery_status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);
CREATE INDEX idx_sms_queue_status ON sms_queue(delivery_status);
CREATE INDEX idx_sms_queue_created_at ON sms_queue(created_at);
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);
CREATE INDEX idx_notification_history_notification ON notification_history(notification_id);

-- Insert Default Notification Types
INSERT INTO notification_types (type_code, type_name, description, default_channel, is_critical) VALUES
  ('service_approved', 'Service Approved', 'Notification when a service application is approved', 'email', true),
  ('service_rejected', 'Service Rejected', 'Notification when a service application is rejected', 'email', true),
  ('service_pending', 'Service Pending', 'Notification for pending service applications', 'in_app', false),
  ('payment_received', 'Payment Received', 'Notification when payment is received', 'email', true),
  ('appointment_reminder', 'Appointment Reminder', 'Reminder for upcoming appointments', 'sms', false),
  ('status_update', 'Status Update', 'General status update notification', 'in_app', false),
  ('system_alert', 'System Alert', 'Critical system alerts', 'push', true),
  ('feedback_requested', 'Feedback Requested', 'Request for user feedback', 'in_app', false),
  ('document_required', 'Document Required', 'Request for missing documents', 'email', true),
  ('announcement', 'Announcement', 'General system announcements', 'in_app', false)
ON CONFLICT DO NOTHING;

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_updated_at_trigger
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_notification_updated_at();

-- Trigger to log notification changes
CREATE OR REPLACE FUNCTION log_notification_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_history (notification_id, action, details, created_by)
  VALUES (
    NEW.notification_id,
    CASE WHEN TG_OP = 'INSERT' THEN 'created'
         WHEN TG_OP = 'UPDATE' AND NEW.is_read AND NOT OLD.is_read THEN 'read'
         ELSE 'updated' END,
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_history_trigger
AFTER INSERT OR UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION log_notification_change();
