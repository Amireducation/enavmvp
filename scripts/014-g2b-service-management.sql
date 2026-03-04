-- Ethiopian Navigator Phase 5: G2B Service Management Module
-- Database schema updates based on ENav Developer Guide v2 and UX Specification
-- Created: 2026-03-04

-- ============================================================================
-- 1. BUSINESS ENTITY TYPES
-- ============================================================================
CREATE TABLE IF NOT EXISTS business_entity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_am VARCHAR(200),
  name_or VARCHAR(200),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entity_types_code ON business_entity_types(code);

-- ============================================================================
-- 2. BUSINESS SECTORS
-- ============================================================================
CREATE TABLE IF NOT EXISTS business_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_am VARCHAR(200),
  name_or VARCHAR(200),
  description TEXT,
  icon VARCHAR(100),
  naics_code VARCHAR(20),
  parent_sector_id UUID REFERENCES business_sectors(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sectors_code ON business_sectors(code);
CREATE INDEX IF NOT EXISTS idx_sectors_parent ON business_sectors(parent_sector_id);

-- ============================================================================
-- 3. BUSINESS PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type_id UUID REFERENCES business_entity_types(id),
  sector_id UUID REFERENCES business_sectors(id),
  business_name VARCHAR(300) NOT NULL,
  business_name_am VARCHAR(300),
  registration_number VARCHAR(100) UNIQUE,
  tin VARCHAR(20) UNIQUE,
  trade_license_number VARCHAR(100),
  trade_license_expiry DATE,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(255),
  business_type VARCHAR(50),
  number_of_employees INT,
  annual_revenue DECIMAL(15,2),
  business_description TEXT,
  logo_url VARCHAR(500),
  certificate_url VARCHAR(500),
  registration_document_url VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP,
  verified_by_user_id UUID REFERENCES users(id),
  rejection_reason TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_user ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tin ON business_profiles(tin);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON business_profiles(verification_status);

-- ============================================================================
-- 4. SERVICE FEES (already partially exists, adding enhancements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  fee_type VARCHAR(100) NOT NULL,
  fee_name VARCHAR(200) NOT NULL,
  fee_name_am VARCHAR(200),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  is_refundable BOOLEAN DEFAULT FALSE,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_fees_service ON service_fees(service_id);

-- ============================================================================
-- 5. PAYMENT RECORDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  payment_reference VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  payment_method VARCHAR(100),
  payment_provider VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP,
  receipt_number VARCHAR(100),
  receipt_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_request ON payment_records(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_records(payment_status);

-- ============================================================================
-- 6. SERVICE REQUEST DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'submitted',
  review_notes TEXT,
  reviewed_at TIMESTAMP,
  reviewed_by_user_id UUID REFERENCES users(id),
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_docs_request ON service_request_documents(request_id);
CREATE INDEX IF NOT EXISTS idx_request_docs_status ON service_request_documents(status);

-- ============================================================================
-- 7. SERVICE REQUEST WORKFLOW HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_request_workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  from_state VARCHAR(50) NOT NULL,
  to_state VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  performed_by_user_id UUID REFERENCES users(id),
  notes TEXT,
  notes_am TEXT,
  metadata_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_history_request ON service_request_workflow_history(request_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_state ON service_request_workflow_history(to_state);

-- ============================================================================
-- 8. SERVICE REQUEST COMMUNICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_request_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  communication_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  message_am TEXT,
  attachment_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_communications_request ON service_request_communications(request_id);
CREATE INDEX IF NOT EXISTS idx_communications_unread ON service_request_communications(to_user_id, is_read);

-- ============================================================================
-- 9. SERVICE REQUEST ASSIGNMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_request_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  assigned_to_user_id UUID NOT NULL REFERENCES users(id),
  assigned_by_user_id UUID NOT NULL REFERENCES users(id),
  assignment_role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  completion_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_assignments_request ON service_request_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user ON service_request_assignments(assigned_to_user_id);

-- ============================================================================
-- 10. ISSUED DOCUMENTS (Certificates, Licenses, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS issued_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  document_number VARCHAR(100) UNIQUE NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  document_title VARCHAR(255) NOT NULL,
  document_title_am VARCHAR(255),
  document_url VARCHAR(500) NOT NULL,
  qr_code_url VARCHAR(500),
  validity_start_date DATE NOT NULL,
  validity_end_date DATE,
  issuing_authority VARCHAR(200),
  issuing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  issue_notes TEXT,
  is_digital_signed BOOLEAN DEFAULT FALSE,
  digital_signature VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  revocation_reason TEXT,
  revoked_at TIMESTAMP,
  revoked_by_user_id UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_issued_docs_request ON issued_documents(request_id);
CREATE INDEX IF NOT EXISTS idx_issued_docs_number ON issued_documents(document_number);
CREATE INDEX IF NOT EXISTS idx_issued_docs_type ON issued_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_issued_docs_validity ON issued_documents(validity_end_date);

-- ============================================================================
-- 11. ENHANCE EXISTING TABLES
-- ============================================================================

-- Add G2B columns to services table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'target_audience') THEN
    ALTER TABLE services ADD COLUMN target_audience VARCHAR(50) DEFAULT 'citizen';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'sector_id') THEN
    ALTER TABLE services ADD COLUMN sector_id UUID REFERENCES business_sectors(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'min_processing_days') THEN
    ALTER TABLE services ADD COLUMN min_processing_days INT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'max_processing_days') THEN
    ALTER TABLE services ADD COLUMN max_processing_days INT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'is_renewable') THEN
    ALTER TABLE services ADD COLUMN is_renewable BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'renewal_period_months') THEN
    ALTER TABLE services ADD COLUMN renewal_period_months INT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'validity_period_months') THEN
    ALTER TABLE services ADD COLUMN validity_period_months INT;
  END IF;
END $$;

-- Add G2B columns to service_requests table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'business_profile_id') THEN
    ALTER TABLE service_requests ADD COLUMN business_profile_id UUID REFERENCES business_profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'request_type') THEN
    ALTER TABLE service_requests ADD COLUMN request_type VARCHAR(50) DEFAULT 'new';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'urgency_level') THEN
    ALTER TABLE service_requests ADD COLUMN urgency_level VARCHAR(50) DEFAULT 'normal';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'total_fees') THEN
    ALTER TABLE service_requests ADD COLUMN total_fees DECIMAL(15,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'paid_amount') THEN
    ALTER TABLE service_requests ADD COLUMN paid_amount DECIMAL(15,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'payment_status') THEN
    ALTER TABLE service_requests ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'can_resubmit') THEN
    ALTER TABLE service_requests ADD COLUMN can_resubmit BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'resubmission_deadline') THEN
    ALTER TABLE service_requests ADD COLUMN resubmission_deadline TIMESTAMP;
  END IF;
END $$;

-- ============================================================================
-- 12. HELPER FUNCTIONS
-- ============================================================================

-- Generate unique document number
CREATE OR REPLACE FUNCTION generate_document_number(p_service_code VARCHAR, p_year INT)
RETURNS VARCHAR AS $$
DECLARE
  seq_num INT;
BEGIN
  seq_num := COALESCE((
    SELECT MAX(CAST(SUBSTRING(document_number FROM POSITION('-' IN document_number) + 1) AS INT))
    FROM issued_documents
    WHERE document_number LIKE p_service_code || '-' || p_year || '-%'
  ), 0) + 1;
  RETURN p_service_code || '-' || p_year || '-' || LPAD(seq_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Calculate service fees
CREATE OR REPLACE FUNCTION calculate_service_fees(p_service_id UUID, p_business_profile_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  base_fee DECIMAL(15,2);
  total_fee DECIMAL(15,2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO base_fee
  FROM service_fees
  WHERE service_id = p_service_id AND is_active = TRUE;
  
  total_fee := COALESCE(base_fee, 0);
  RETURN total_fee;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_target_audience ON services(target_audience);
CREATE INDEX IF NOT EXISTS idx_services_sector ON services(sector_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_business ON service_requests(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_payment ON service_requests(payment_status);
