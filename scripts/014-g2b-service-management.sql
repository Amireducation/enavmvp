-- Ethiopian Navigator Phase 5: G2B (Government-to-Business) Service Management
-- Based on ENav Developer Guide v2, UX Specification, and Data Dictionary
-- Date: 2026-03-03

-- ============================================================================
-- BUSINESS ENTITY TYPES: Types of businesses that can apply for services
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_entity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,             -- 'sole_proprietorship', 'plc', 'share_company', 'partnership'
  name VARCHAR(200) NOT NULL,
  name_am VARCHAR(200),
  name_or VARCHAR(200),
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  requirements_json JSONB,                       -- Required documents/conditions for this type
  min_capital DECIMAL(15,2),                     -- Minimum capital requirement
  max_shareholders INT,
  min_shareholders INT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BUSINESS SECTORS: Industry sectors for service classification
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,             -- 'agriculture', 'manufacturing', 'trade', 'services', 'construction'
  name VARCHAR(200) NOT NULL,
  name_am VARCHAR(200),
  name_or VARCHAR(200),
  parent_sector_id UUID REFERENCES business_sectors(id),
  description TEXT,
  description_am TEXT,
  icon VARCHAR(100),
  regulatory_body VARCHAR(200),                  -- Which agency regulates this sector
  special_requirements_json JSONB,               -- Sector-specific requirements
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sectors_parent ON business_sectors(parent_sector_id);
CREATE INDEX idx_sectors_code ON business_sectors(code);

-- ============================================================================
-- BUSINESS PROFILES: Business applicant information
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(300) NOT NULL,
  business_name_am VARCHAR(300),
  trade_name VARCHAR(300),
  trade_name_am VARCHAR(300),
  entity_type_id UUID REFERENCES business_entity_types(id),
  sector_id UUID REFERENCES business_sectors(id),
  tin_number VARCHAR(50) UNIQUE,                 -- Tax Identification Number
  registration_number VARCHAR(100),
  registration_date DATE,
  capital_amount DECIMAL(15,2),
  employee_count INT,
  annual_revenue DECIMAL(15,2),
  address_json JSONB,                            -- { region, zone, woreda, kebele, house_no, po_box }
  contact_json JSONB,                            -- { phone, email, fax, website }
  legal_representative_json JSONB,               -- { name, position, id_type, id_number }
  shareholders_json JSONB,                       -- Array of shareholder info
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'suspended'
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_profiles_user ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_tin ON business_profiles(tin_number);
CREATE INDEX idx_business_profiles_sector ON business_profiles(sector_id);
CREATE INDEX idx_business_profiles_verification ON business_profiles(verification_status);

-- ============================================================================
-- SERVICE REQUEST DOCUMENTS: Documents attached to service requests
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES service_requirements(id),
  document_type VARCHAR(100) NOT NULL,           -- 'id_card', 'business_license', 'tax_clearance', 'photo', etc.
  document_name VARCHAR(300) NOT NULL,
  original_filename VARCHAR(500),
  file_path VARCHAR(1000) NOT NULL,
  file_size_bytes BIGINT,
  mime_type VARCHAR(100),
  upload_status VARCHAR(50) DEFAULT 'uploaded',  -- 'uploaded', 'verified', 'rejected', 'expired'
  verification_notes TEXT,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  version INT DEFAULT 1,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_request_docs_request ON service_request_documents(request_id);
CREATE INDEX idx_request_docs_type ON service_request_documents(document_type);
CREATE INDEX idx_request_docs_status ON service_request_documents(upload_status);

-- ============================================================================
-- SERVICE REQUEST WORKFLOW HISTORY: Audit trail of status changes
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_request_workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  from_state VARCHAR(100),
  to_state VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,                  -- 'submit', 'assign', 'review', 'approve', 'reject', 'request_info', 'escalate'
  action_by UUID REFERENCES users(id),
  action_by_role VARCHAR(50),
  notes TEXT,
  notes_am TEXT,
  internal_notes TEXT,                           -- For staff only
  metadata_json JSONB,                           -- Additional context
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_history_request ON service_request_workflow_history(request_id);
CREATE INDEX idx_workflow_history_action ON service_request_workflow_history(action);
CREATE INDEX idx_workflow_history_created ON service_request_workflow_history(created_at);

-- ============================================================================
-- SERVICE REQUEST COMMUNICATIONS: Messages between applicant and staff
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_request_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_type VARCHAR(50) NOT NULL,              -- 'applicant', 'reviewer', 'admin', 'system'
  message_type VARCHAR(50) DEFAULT 'message',    -- 'message', 'clarification_request', 'clarification_response', 'document_request', 'notification'
  subject VARCHAR(300),
  subject_am VARCHAR(300),
  message TEXT NOT NULL,
  message_am TEXT,
  attachments_json JSONB,                        -- Array of attachment references
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_internal BOOLEAN DEFAULT FALSE,             -- Internal staff notes
  parent_message_id UUID REFERENCES service_request_communications(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_communications_request ON service_request_communications(request_id);
CREATE INDEX idx_communications_sender ON service_request_communications(sender_id);
CREATE INDEX idx_communications_unread ON service_request_communications(is_read) WHERE is_read = FALSE;

-- ============================================================================
-- SERVICE FEES: Fee structures for services
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES service_variations(id),
  fee_type VARCHAR(100) NOT NULL,                -- 'application', 'processing', 'certificate', 'expedited', 'renewal'
  fee_name VARCHAR(200) NOT NULL,
  fee_name_am VARCHAR(200),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  is_percentage BOOLEAN DEFAULT FALSE,           -- If true, amount is percentage of base
  percentage_base VARCHAR(100),                  -- 'capital', 'revenue', 'base_fee'
  min_amount DECIMAL(15,2),
  max_amount DECIMAL(15,2),
  is_refundable BOOLEAN DEFAULT FALSE,
  refund_conditions TEXT,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fees_service ON service_fees(service_id);
CREATE INDEX idx_fees_variation ON service_fees(variation_id);
CREATE INDEX idx_fees_type ON service_fees(fee_type);

-- ============================================================================
-- PAYMENT RECORDS: Track payments for service requests
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  fee_id UUID REFERENCES service_fees(id),
  payment_reference VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  payment_method VARCHAR(100),                   -- 'bank_transfer', 'mobile_money', 'card', 'cash'
  payment_provider VARCHAR(100),                 -- 'telebirr', 'cbe_birr', 'cbe', 'awash', etc.
  provider_reference VARCHAR(200),
  payment_status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'completed', 'failed', 'refunded', 'cancelled'
  paid_at TIMESTAMP,
  receipt_number VARCHAR(100),
  receipt_url VARCHAR(500),
  metadata_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_request ON payment_records(request_id);
CREATE INDEX idx_payments_reference ON payment_records(payment_reference);
CREATE INDEX idx_payments_status ON payment_records(payment_status);

-- ============================================================================
-- SERVICE REQUEST ASSIGNMENTS: Staff assignments for processing
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_request_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  assignment_type VARCHAR(50) DEFAULT 'primary', -- 'primary', 'secondary', 'supervisor', 'specialist'
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_request ON service_request_assignments(request_id);
CREATE INDEX idx_assignments_user ON service_request_assignments(assigned_to);
CREATE INDEX idx_assignments_active ON service_request_assignments(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- ISSUED DOCUMENTS: Certificates/licenses issued after approval
-- ============================================================================

CREATE TABLE IF NOT EXISTS issued_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id),
  document_type VARCHAR(100) NOT NULL,           -- 'certificate', 'license', 'permit', 'registration'
  document_number VARCHAR(100) UNIQUE NOT NULL,
  document_title VARCHAR(300) NOT NULL,
  document_title_am VARCHAR(300),
  issued_to_user_id UUID REFERENCES users(id),
  issued_to_business_id UUID REFERENCES business_profiles(id),
  issued_by UUID REFERENCES users(id),
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_from DATE NOT NULL,
  valid_until DATE,
  is_renewable BOOLEAN DEFAULT TRUE,
  renewal_reminder_days INT DEFAULT 30,
  document_url VARCHAR(500),
  qr_code VARCHAR(500),                          -- For verification
  verification_code VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',           -- 'active', 'suspended', 'revoked', 'expired', 'renewed'
  revocation_reason TEXT,
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES users(id),
  metadata_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issued_docs_request ON issued_documents(request_id);
CREATE INDEX idx_issued_docs_number ON issued_documents(document_number);
CREATE INDEX idx_issued_docs_verification ON issued_documents(verification_code);
CREATE INDEX idx_issued_docs_status ON issued_documents(status);
CREATE INDEX idx_issued_docs_expiry ON issued_documents(valid_until) WHERE status = 'active';

-- ============================================================================
-- SEED DATA: Business Entity Types
-- ============================================================================

INSERT INTO business_entity_types (code, name, name_am, description, min_capital, min_shareholders, max_shareholders, sort_order) VALUES
('sole_proprietorship', 'Sole Proprietorship', 'የግል ንግድ', 'Business owned and operated by a single individual', 0, 1, 1, 1),
('partnership', 'General Partnership', 'ሽርክና', 'Business owned by two or more partners with unlimited liability', 0, 2, NULL, 2),
('limited_partnership', 'Limited Partnership', 'ውስን ሽርክና', 'Partnership with both general and limited partners', 0, 2, NULL, 3),
('plc', 'Private Limited Company (PLC)', 'የግል ማህበር (ፒ.ኤል.ሲ)', 'Limited liability company with restricted share transfer', 15000, 2, 50, 4),
('share_company', 'Share Company', 'አክስዮን ማህበር', 'Public company with freely transferable shares', 50000, 5, NULL, 5),
('cooperative', 'Cooperative Society', 'የህብረት ስራ ማህበር', 'Member-owned business organization', 0, 10, NULL, 6),
('ngo', 'Non-Governmental Organization', 'መንግስታዊ ያልሆነ ድርጅት', 'Non-profit organization', 0, 3, NULL, 7),
('branch', 'Branch Office', 'ቅርንጫፍ ጽህፈት ቤት', 'Branch of a foreign company', 0, 1, 1, 8)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SEED DATA: Business Sectors
-- ============================================================================

INSERT INTO business_sectors (code, name, name_am, icon, sort_order) VALUES
('agriculture', 'Agriculture & Agro-processing', 'ግብርና እና ግብርና-ማቀነባበር', 'Leaf', 1),
('manufacturing', 'Manufacturing & Industry', 'ማምረት እና ኢንዱስትሪ', 'Factory', 2),
('construction', 'Construction & Real Estate', 'ግንባታ እና ሪል ስቴት', 'Building', 3),
('trade', 'Trade & Commerce', 'ንግድ እና ኮሜርስ', 'ShoppingCart', 4),
('services', 'Services', 'አገልግሎቶች', 'Briefcase', 5),
('transport', 'Transport & Logistics', 'ትራንስፖርት እና ሎጂስቲክስ', 'Truck', 6),
('tourism', 'Tourism & Hospitality', 'ቱሪዝም እና እንግዳ ተቀባይነት', 'Hotel', 7),
('ict', 'ICT & Digital Services', 'አይሲቲ እና ዲጂታል አገልግሎቶች', 'Laptop', 8),
('finance', 'Financial Services', 'የፋይናንስ አገልግሎቶች', 'Landmark', 9),
('health', 'Healthcare & Pharmaceuticals', 'ጤና እንክብካቤ እና ፋርማሲዩቲካል', 'Heart', 10),
('education', 'Education & Training', 'ትምህርት እና ስልጠና', 'GraduationCap', 11),
('mining', 'Mining & Extractive', 'ማዕድን እና ማውጣት', 'Pickaxe', 12),
('energy', 'Energy & Utilities', 'ኢነርጂ እና መገልገያዎች', 'Zap', 13)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- UPDATE SERVICES TABLE: Add G2B-specific columns
-- ============================================================================

ALTER TABLE services ADD COLUMN IF NOT EXISTS service_code VARCHAR(50);
ALTER TABLE services ADD COLUMN IF NOT EXISTS target_audience VARCHAR(50) DEFAULT 'citizen'; -- 'citizen', 'business', 'both'
ALTER TABLE services ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES business_sectors(id);
ALTER TABLE services ADD COLUMN IF NOT EXISTS entity_types_allowed UUID[];  -- Array of allowed business entity types
ALTER TABLE services ADD COLUMN IF NOT EXISTS min_processing_days INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS max_processing_days INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_renewable BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS renewal_period_months INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS validity_period_months INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS quota_limit INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS current_applications INT DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS form_schema_json JSONB;  -- Dynamic form definition

CREATE INDEX IF NOT EXISTS idx_services_code ON services(service_code);
CREATE INDEX IF NOT EXISTS idx_services_audience ON services(target_audience);
CREATE INDEX IF NOT EXISTS idx_services_sector ON services(sector_id);

-- ============================================================================
-- UPDATE SERVICE REQUESTS TABLE: Add G2B-specific columns
-- ============================================================================

ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS business_profile_id UUID REFERENCES business_profiles(id);
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS application_type VARCHAR(50) DEFAULT 'new'; -- 'new', 'renewal', 'amendment', 'cancellation'
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(50) DEFAULT 'normal'; -- 'normal', 'urgent', 'emergency'
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS estimated_completion_date TIMESTAMP;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS actual_completion_date TIMESTAMP;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS total_fees DECIMAL(15,2);
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid'; -- 'unpaid', 'partial', 'paid', 'refunded'
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS rejection_reason_am TEXT;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS can_resubmit BOOLEAN DEFAULT TRUE;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS resubmission_deadline TIMESTAMP;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS parent_request_id UUID REFERENCES service_requests(id); -- For renewals/amendments
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS issued_document_id UUID;

CREATE INDEX IF NOT EXISTS idx_requests_business ON service_requests(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_requests_payment_status ON service_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_requests_completion ON service_requests(estimated_completion_date);

-- ============================================================================
-- VIEWS: Enhanced service catalog view with G2B info
-- ============================================================================

CREATE OR REPLACE VIEW v_g2b_service_catalog AS
SELECT 
  s.id,
  s.service_code,
  s.name,
  s.name_am,
  s.name_or,
  s.description,
  s.description_am,
  s.description_or,
  s.target_audience,
  sc.name as category_name,
  sc.name_am as category_name_am,
  bs.name as sector_name,
  bs.name_am as sector_name_am,
  bs.icon as sector_icon,
  s.service_fee as base_fee,
  s.min_processing_days,
  s.max_processing_days,
  s.estimated_processing_days,
  s.online_available,
  s.is_renewable,
  s.renewal_period_months,
  s.validity_period_months,
  s.status,
  COALESCE(
    (SELECT json_agg(json_build_object(
      'id', sv.id,
      'type', sv.variation_type,
      'name', sv.variation_name,
      'name_am', sv.variation_name_am,
      'processing_days_min', sv.processing_days_min,
      'processing_days_max', sv.processing_days_max,
      'fee_adjustment', sv.fee_adjustment_percentage,
      'delivery_method', sv.delivery_method
    )) FROM service_variations sv WHERE sv.service_id = s.id AND sv.is_available = TRUE),
    '[]'::json
  ) as variations,
  COALESCE(
    (SELECT json_agg(json_build_object(
      'id', sr.id,
      'name', sr.requirement_name,
      'name_am', sr.requirement_name_am,
      'type', sr.requirement_type,
      'is_mandatory', sr.is_mandatory,
      'description', sr.description
    )) FROM service_requirements sr WHERE sr.service_id = s.id AND sr.is_active = TRUE),
    '[]'::json
  ) as requirements,
  COALESCE(
    (SELECT json_agg(json_build_object(
      'type', sf.fee_type,
      'name', sf.fee_name,
      'amount', sf.amount,
      'currency', sf.currency
    )) FROM service_fees sf WHERE sf.service_id = s.id AND sf.is_active = TRUE),
    '[]'::json
  ) as fees
FROM services s
LEFT JOIN service_categories sc ON s.category_id = sc.id
LEFT JOIN business_sectors bs ON s.sector_id = bs.id
WHERE s.status = 'active';

-- ============================================================================
-- FUNCTIONS: Helper functions for service management
-- ============================================================================

-- Function to calculate total fees for a service request
CREATE OR REPLACE FUNCTION calculate_request_fees(
  p_service_id UUID,
  p_variation_id UUID DEFAULT NULL
) RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL := 0;
  v_base_fee DECIMAL;
  v_adjustment DECIMAL := 0;
BEGIN
  -- Get base service fee
  SELECT COALESCE(service_fee, 0) INTO v_base_fee FROM services WHERE id = p_service_id;
  
  -- Get variation adjustment if specified
  IF p_variation_id IS NOT NULL THEN
    SELECT COALESCE(fee_adjustment_percentage, 0) INTO v_adjustment 
    FROM service_variations WHERE id = p_variation_id;
  END IF;
  
  -- Calculate adjusted base fee
  v_total := v_base_fee * (1 + v_adjustment / 100);
  
  -- Add other fees
  SELECT v_total + COALESCE(SUM(amount), 0) INTO v_total
  FROM service_fees 
  WHERE service_id = p_service_id 
    AND (variation_id IS NULL OR variation_id = p_variation_id)
    AND is_active = TRUE
    AND (effective_to IS NULL OR effective_to >= CURRENT_DATE);
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Function to generate document/certificate number
CREATE OR REPLACE FUNCTION generate_document_number(
  p_document_type VARCHAR,
  p_service_code VARCHAR DEFAULT NULL
) RETURNS VARCHAR AS $$
DECLARE
  v_prefix VARCHAR;
  v_year VARCHAR;
  v_sequence INT;
  v_number VARCHAR;
BEGIN
  v_prefix := UPPER(COALESCE(p_service_code, SUBSTRING(p_document_type FROM 1 FOR 3)));
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get next sequence number for this prefix and year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(document_number FROM LENGTH(v_prefix) + 6 FOR 6) AS INT)
  ), 0) + 1 INTO v_sequence
  FROM issued_documents
  WHERE document_number LIKE v_prefix || '/' || v_year || '/%';
  
  v_number := v_prefix || '/' || v_year || '/' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

COMMIT;
