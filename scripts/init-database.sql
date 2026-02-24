-- Ethiopian Navigator MVP Database Schema
-- Complete initialization script for Neon PostgreSQL

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'employee', 'admin', 'partner')),
  full_name TEXT NOT NULL,
  phone TEXT,
  profile_picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'am', 'om')),
  notifications_enabled BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  organization TEXT,
  department TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Ethiopia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_language ON user_profiles(preferred_language);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  requirements TEXT,
  processing_time TEXT,
  is_active BOOLEAN DEFAULT true,
  icon_url TEXT,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'completed')),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  rejection_reason TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  reference_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_service_id ON applications(service_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_reference ON applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- ============================================================================
-- SERVICE REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'planning', 'in_progress', 'completed', 'closed')),
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estimated_completion_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);

-- ============================================================================
-- FEEDBACK TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('service', 'application', 'general')),
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'read', 'addressed')),
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_service_id ON feedback(service_id);
CREATE INDEX IF NOT EXISTS idx_feedback_application_id ON feedback(application_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('application_update', 'service_update', 'system', 'reminder')),
  related_application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- PARTNERSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS partnerships (
  id SERIAL PRIMARY KEY,
  partner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_description TEXT,
  website TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  services_offered TEXT,
  impact_metrics TEXT,
  agreement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partnerships_partner_user_id ON partnerships(partner_user_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON partnerships(status);

-- ============================================================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id INTEGER,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- STATISTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS statistics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT UNIQUE NOT NULL,
  metric_value JSONB,
  period_start DATE,
  period_end DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_statistics_metric_name ON statistics(metric_name);

-- ============================================================================
-- SYSTEM SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- ============================================================================
-- INITIAL DATA SEED
-- ============================================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('platform_name', 'Ethiopian Navigator', 'Platform name'),
  ('support_email', 'support@ethiopiannavigator.gov.et', 'Support email'),
  ('max_upload_size', '10485760', 'Max upload size in bytes'),
  ('session_timeout', '3600', 'Session timeout in seconds')
ON CONFLICT (setting_key) DO NOTHING;

-- Create sample admin user (password should be hashed in production)
INSERT INTO users (email, password, role, full_name, phone, is_active)
VALUES ('admin@ethiopiannavigator.gov.et', 'hashed_password_here', 'admin', 'System Administrator', '+251-911-000-001', true)
ON CONFLICT (email) DO NOTHING;

-- Create sample employee user
INSERT INTO users (email, password, role, full_name, phone, is_active)
VALUES ('employee@ethiopiannavigator.gov.et', 'hashed_password_here', 'employee', 'Service Officer', '+251-911-000-002', true)
ON CONFLICT (email) DO NOTHING;

-- Create sample citizen user
INSERT INTO users (email, password, role, full_name, phone, is_active)
VALUES ('citizen@ethiopiannavigator.gov.et', 'hashed_password_here', 'citizen', 'Citizen User', '+251-911-000-003', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample government services
INSERT INTO services (name, description, category, requirements, processing_time, icon_url, featured, rating)
VALUES
  ('National ID Card', 'Apply for or renew your Ethiopian National ID', 'Identity', 'Valid birth certificate or passport', '2-3 weeks', '/services/national-id.png', true, 4.5),
  ('Passport Application', 'Apply for a new Ethiopian passport', 'Travel', 'National ID, 4 photos, birth certificate', '4-6 weeks', '/services/passport.png', true, 4.3),
  ('Business License', 'Register a new business', 'Business', 'Business plan, identification, property proof', '2-4 weeks', '/services/business-license.png', true, 4.2),
  ('Property Registration', 'Register residential or commercial property', 'Property', 'Deed, identification, survey report', '6-8 weeks', '/services/property.png', false, 4.0),
  ('Tax ID Registration', 'Register for tax identification number', 'Tax', 'National ID, business documents', '1 week', '/services/tax-id.png', false, 4.1),
  ('Birth Certificate', 'Register or obtain birth certificate', 'Civil Registry', 'Hospital discharge card, parents ID', '1-2 weeks', '/services/birth-cert.png', true, 4.6),
  ('Marriage Certificate', 'Register marriage', 'Civil Registry', 'Identification, witnesses', '2-3 weeks', '/services/marriage-cert.png', false, 4.4),
  ('Driver License', 'Apply for driver license', 'Transportation', 'National ID, medical certificate, training certificate', '2-3 weeks', '/services/driver-license.png', true, 4.2)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- GRANT PERMISSIONS (if needed)
-- ============================================================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
