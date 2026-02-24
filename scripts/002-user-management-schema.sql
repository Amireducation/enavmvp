-- =====================================================================
-- ETHIOPIAN NAVIGATOR USER MANAGEMENT DATABASE SCHEMA
-- Enterprise-Grade User Management System
-- =====================================================================

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS user_login_history CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS user_verification CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =====================================================================
-- 1. ROLES TABLE - Define system roles with permissions
-- =====================================================================
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description, permissions) VALUES
('citizen', 'Citizen - Can browse services and submit requests', '{"browse_services":true,"submit_requests":true,"view_applications":true,"provide_feedback":true}'),
('employee', 'Employee - Can review and process service requests', '{"review_applications":true,"update_status":true,"view_feedback":true,"generate_reports":true}'),
('admin', 'Admin - Full system access and management', '{"manage_users":true,"manage_services":true,"manage_employees":true,"view_analytics":true,"system_config":true}'),
('partner', 'Partner - Partner organization representative', '{"collaborate":true,"view_services":true,"report_metrics":true}');

-- =====================================================================
-- 2. USERS TABLE - Core user information with security
-- =====================================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  country_code VARCHAR(5) DEFAULT '+251',
  
  -- Account status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'deactivated', 'archived')),
  is_email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method VARCHAR(50), -- 'sms' or 'email'
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_password_change TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_valid CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =====================================================================
-- 3. USER PROFILES TABLE - Extended profile information
-- =====================================================================
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Profile Information
  profile_picture_url TEXT,
  bio TEXT,
  language_preference VARCHAR(10) DEFAULT 'en' CHECK (language_preference IN ('en', 'am', 'om')),
  time_zone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
  
  -- Address Information
  street_address VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Ethiopia',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Verification Status
  identity_number VARCHAR(50) UNIQUE,
  identity_type VARCHAR(50) CHECK (identity_type IN ('national_id', 'passport', 'drivers_license')),
  identity_verified BOOLEAN DEFAULT false,
  identity_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional Info
  date_of_birth DATE,
  gender VARCHAR(20),
  occupation VARCHAR(100),
  organization_name VARCHAR(255),
  organization_role VARCHAR(100),
  
  -- Preferences
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT true,
  notification_app BOOLEAN DEFAULT true,
  newsletter_subscribed BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_city ON user_profiles(city);
CREATE INDEX idx_user_profiles_identity ON user_profiles(identity_number);

-- =====================================================================
-- 4. USER ROLES MAPPING TABLE - Many-to-many user roles
-- =====================================================================
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- =====================================================================
-- 5. USER SESSIONS TABLE - Session management and security
-- =====================================================================
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  token_type VARCHAR(50) DEFAULT 'access' CHECK (token_type IN ('access', 'refresh')),
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  
  -- Location info
  device_name VARCHAR(255),
  device_os VARCHAR(100),
  device_browser VARCHAR(100),
  
  -- Session validity
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

-- =====================================================================
-- 6. PASSWORD RESET TOKENS TABLE - Secure password reset mechanism
-- =====================================================================
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Token validity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Security
  ip_address INET,
  user_agent TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  is_used BOOLEAN DEFAULT false,
  
  CONSTRAINT attempt_check CHECK (attempts <= max_attempts)
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires_at ON password_reset_tokens(expires_at);

-- =====================================================================
-- 7. EMAIL VERIFICATION TABLE - Email verification tracking
-- =====================================================================
CREATE TABLE user_verification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  verification_token_hash VARCHAR(255) UNIQUE NOT NULL,
  verification_code VARCHAR(6),
  
  -- Token validity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  is_verified BOOLEAN DEFAULT false,
  
  CONSTRAINT verification_attempts CHECK (attempts <= max_attempts)
);

CREATE INDEX idx_user_verification_user_id ON user_verification(user_id);
CREATE INDEX idx_user_verification_token ON user_verification(verification_token_hash);
CREATE INDEX idx_user_verification_code ON user_verification(verification_code);

-- =====================================================================
-- 8. LOGIN HISTORY TABLE - Track all login attempts for security
-- =====================================================================
CREATE TABLE user_login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255),
  
  -- Login details
  login_status VARCHAR(50) CHECK (login_status IN ('success', 'failed', 'locked', 'suspicious')),
  failure_reason VARCHAR(255),
  
  -- Request details
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Additional info
  login_method VARCHAR(50) CHECK (login_method IN ('password', 'oauth', 'sso', 'otp')),
  two_factor_used BOOLEAN DEFAULT false,
  
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX idx_login_history_email ON user_login_history(email);
CREATE INDEX idx_login_history_status ON user_login_history(login_status);
CREATE INDEX idx_login_history_logged_in_at ON user_login_history(logged_in_at DESC);
CREATE INDEX idx_login_history_ip ON user_login_history(ip_address);

-- =====================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================================

-- User with roles view
CREATE OR REPLACE VIEW user_with_roles AS
SELECT 
  u.id,
  u.email,
  u.username,
  u.first_name,
  u.last_name,
  u.status,
  u.is_email_verified,
  u.last_login_at,
  array_agg(r.name) as roles,
  u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.username, u.first_name, u.last_name, u.status, u.is_email_verified, u.last_login_at, u.created_at;

-- Active sessions view
CREATE OR REPLACE VIEW active_user_sessions AS
SELECT 
  us.id,
  us.user_id,
  us.device_name,
  us.device_os,
  us.device_browser,
  us.ip_address,
  us.issued_at,
  us.expires_at,
  us.last_activity
FROM user_sessions us
WHERE us.is_active = true
  AND us.revoked_at IS NULL
  AND us.expires_at > CURRENT_TIMESTAMP;

-- =====================================================================
-- DATA INTEGRITY CONSTRAINTS
-- =====================================================================

-- Ensure at least one admin exists
CREATE OR REPLACE FUNCTION ensure_admin_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE r.name = 'admin') THEN
    RAISE EXCEPTION 'System must have at least one admin user';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- SEED DATA - Demo users for testing
-- =====================================================================
INSERT INTO users (email, password_hash, username, first_name, last_name, phone_number, status, is_email_verified, email_verified_at, last_login_at) VALUES
('admin@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv.2', 'admin', 'Admin', 'User', '+251911111111', 'active', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('employee@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv.2', 'employee', 'Employee', 'Demo', '+251922222222', 'active', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('citizen@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv.2', 'citizen', 'Citizen', 'Demo', '+251933333333', 'active', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('partner@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv.2', 'partner', 'Partner', 'Organization', '+251944444444', 'active', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Assign roles to demo users
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE email = 'admin@demo.com'), (SELECT id FROM roles WHERE name = 'admin')),
((SELECT id FROM users WHERE email = 'employee@demo.com'), (SELECT id FROM roles WHERE name = 'employee')),
((SELECT id FROM users WHERE email = 'citizen@demo.com'), (SELECT id FROM roles WHERE name = 'citizen')),
((SELECT id FROM users WHERE email = 'partner@demo.com'), (SELECT id FROM roles WHERE name = 'partner'));

-- Create user profiles for demo users
INSERT INTO user_profiles (user_id, language_preference, city, region, identity_type) 
SELECT id, 'en', 'Addis Ababa', 'Addis Ababa', 'national_id' FROM users;

-- =====================================================================
-- GRANT PERMISSIONS (uncomment for production)
-- =====================================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
