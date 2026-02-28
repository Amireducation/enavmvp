-- Ethiopian Navigator Phase 4: Service Management Catalog Extensions
-- PRSD-aligned service taxonomy, variations, eligibility rules, and SLA configurations
-- Date: 2026-02-28

-- ============================================================================
-- SERVICE TAXONOMY: Core Type -> Type -> Subtype -> Variation hierarchy
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  core_type VARCHAR(100) NOT NULL,           -- 'Registration', 'Licensing', 'Certification', 'Permit', 'Utility'
  type VARCHAR(150) NOT NULL,                -- 'Business Registration', 'Professional License', etc.
  subtype VARCHAR(150),                      -- 'Sole Proprietorship', 'Partnership', etc.
  variation VARCHAR(150),                    -- 'Online', 'Physical', 'Hybrid'
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  icon VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(core_type, type, subtype, variation)
);

CREATE INDEX idx_taxonomy_core_type ON service_taxonomy(core_type);
CREATE INDEX idx_taxonomy_type ON service_taxonomy(type);
CREATE INDEX idx_taxonomy_active ON service_taxonomy(is_active);

-- ============================================================================
-- SERVICE VARIATIONS: Different versions of the same service
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  variation_type VARCHAR(100) NOT NULL,     -- 'expedited', 'standard', 'online', 'physical'
  variation_name VARCHAR(200) NOT NULL,
  variation_name_am VARCHAR(200),
  variation_name_or VARCHAR(200),
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  processing_days_min INT,
  processing_days_max INT,
  fee_adjustment_percentage DECIMAL(5,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  delivery_method VARCHAR(100),              -- 'online', 'in_person', 'mail', 'hybrid'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variations_service_id ON service_variations(service_id);
CREATE INDEX idx_variations_type ON service_variations(variation_type);

-- ============================================================================
-- ELIGIBILITY RULES: Conditions that must be met to apply
-- ============================================================================

CREATE TABLE IF NOT EXISTS eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  rule_type VARCHAR(100) NOT NULL,          -- 'age', 'citizenship', 'location', 'previous_status', 'income', 'education'
  rule_name VARCHAR(200) NOT NULL,
  rule_name_am VARCHAR(200),
  rule_name_or VARCHAR(200),
  condition_type VARCHAR(50),                -- 'required', 'recommended', 'disqualifying'
  operator VARCHAR(20),                      -- 'equals', 'greater_than', 'less_than', 'between', 'in_list', 'matches_pattern'
  value_json JSONB,                          -- { "min": 18, "max": 65 } or { "list": ["citizen", "permanent_resident"] }
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_eligibility_service_id ON eligibility_rules(service_id);
CREATE INDEX idx_eligibility_type ON eligibility_rules(rule_type);

-- ============================================================================
-- SERVICE CONDITIONS: Dynamic conditions affecting service availability
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  condition_name VARCHAR(200) NOT NULL,
  condition_name_am VARCHAR(200),
  condition_name_or VARCHAR(200),
  condition_type VARCHAR(50),                -- 'temporal', 'regional', 'quota', 'prerequisite', 'seasonal'
  operator VARCHAR(50),                      -- 'active_between', 'available_in', 'limit_to', 'requires_completion', 'available_during'
  value_json JSONB,                          -- { "start_date": "2024-01-01", "end_date": "2024-12-31" }
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conditions_service_id ON service_conditions(service_id);
CREATE INDEX idx_conditions_type ON service_conditions(condition_type);

-- ============================================================================
-- SERVICE RELATIONS: Dependencies and relationships between services
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  target_service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL,       -- 'requires', 'enables', 'related', 'parent', 'child', 'alternative'
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_service_id, target_service_id, relation_type)
);

CREATE INDEX idx_relations_source ON service_relations(source_service_id);
CREATE INDEX idx_relations_target ON service_relations(target_service_id);
CREATE INDEX idx_relations_type ON service_relations(relation_type);

-- ============================================================================
-- SERVICE DELIVERY OPTIONS: How citizens can apply/receive service
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_delivery_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  delivery_method VARCHAR(100) NOT NULL,    -- 'online', 'in_person', 'mail', 'hybrid', 'phone', 'mobile_unit'
  delivery_name VARCHAR(200),
  delivery_name_am VARCHAR(200),
  delivery_name_or VARCHAR(200),
  availability_hours VARCHAR(100),           -- '09:00-17:00', '24/7', '9am-5pm Mon-Fri'
  processing_days INT,
  location_address TEXT,
  location_coordinates POINT,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_service_id ON service_delivery_options(service_id);
CREATE INDEX idx_delivery_method ON service_delivery_options(delivery_method);

-- ============================================================================
-- SERVICE FEES: Tiered pricing and payment options
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_variation_id UUID REFERENCES service_variations(id) ON DELETE SET NULL,
  fee_type VARCHAR(100) NOT NULL,           -- 'application', 'processing', 'issuance', 'renewal', 'express', 'return'
  fee_name VARCHAR(200),
  fee_name_am VARCHAR(200),
  fee_name_or VARCHAR(200),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ETB',
  waivable BOOLEAN DEFAULT FALSE,
  waiver_criteria TEXT,
  payment_methods JSONB,                     -- { "methods": ["cash", "bank_transfer", "card"] }
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fees_service_id ON service_fees(service_id);
CREATE INDEX idx_fees_variation_id ON service_fees(service_variation_id);

-- ============================================================================
-- SERVICE SLA: Service Level Agreements and performance targets
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_sla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  sla_type VARCHAR(100) NOT NULL,           -- 'standard', 'expedited', 'premium'
  sla_name VARCHAR(200),
  sla_name_am VARCHAR(200),
  sla_name_or VARCHAR(200),
  target_processing_days INT,
  target_processing_hours INT,
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sla_service_id ON service_sla(service_id);

-- ============================================================================
-- UPDATE SERVICES TABLE: Add workflow configuration and taxonomy linking
-- ============================================================================

ALTER TABLE services ADD COLUMN IF NOT EXISTS taxonomy_id UUID REFERENCES service_taxonomy(id) ON DELETE SET NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS workflow_config JSONB DEFAULT '{"states": ["draft", "submitted", "approved", "issued", "rejected"], "transitions": []}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS sector VARCHAR(100);                  -- 'government', 'social', 'economic', 'health', 'education'
ALTER TABLE services ADD COLUMN IF NOT EXISTS core_type VARCHAR(100);               -- References service_taxonomy.core_type
ALTER TABLE services ADD COLUMN IF NOT EXISTS default_variation_id UUID REFERENCES service_variations(id) ON DELETE SET NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS has_variations BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS requires_eligibility_check BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS default_sla_id UUID REFERENCES service_sla(id) ON DELETE SET NULL;

CREATE INDEX idx_services_sector ON services(sector);
CREATE INDEX idx_services_core_type ON services(core_type);

-- ============================================================================
-- UPDATE SERVICE_REQUESTS TABLE: Add workflow and variation tracking
-- ============================================================================

ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS variation_id UUID REFERENCES service_variations(id) ON DELETE SET NULL;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS selected_delivery_option_id UUID REFERENCES service_delivery_options(id) ON DELETE SET NULL;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS workflow_state VARCHAR(100) DEFAULT 'submitted';  -- submitted, under_review, clarification_needed, approved, issued, rejected, completed
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS workflow_state_history JSONB DEFAULT '[]';        -- Array of {state, timestamp, actor, reason}
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS sla_id UUID REFERENCES service_sla(id) ON DELETE SET NULL;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMP;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS eligibility_check_status VARCHAR(50);             -- passed, failed, pending, waived
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS eligibility_check_details JSONB;                 -- { "rules": [{ "rule_id": "...", "passed": true }] }
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS clarification_request_details JSONB;             -- { "fields": ["field1", "field2"], "message": "..." }

CREATE INDEX idx_requests_workflow_state ON service_requests(workflow_state);
CREATE INDEX idx_requests_variation_id ON service_requests(variation_id);
CREATE INDEX idx_requests_sla_deadline ON service_requests(sla_deadline);

-- ============================================================================
-- REQUIREMENTS MANAGEMENT: Document and field requirements
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES service_variations(id) ON DELETE SET NULL,
  requirement_type VARCHAR(100) NOT NULL,   -- 'document', 'declaration', 'photo', 'biometric', 'information', 'form'
  requirement_name VARCHAR(200) NOT NULL,
  requirement_name_am VARCHAR(200),
  requirement_name_or VARCHAR(200),
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE,
  is_conditional BOOLEAN DEFAULT FALSE,
  conditional_on_field VARCHAR(200),        -- Field name if requirement is conditional
  conditional_value VARCHAR(500),           -- Value that triggers this requirement
  accepted_formats JSONB,                   -- { "formats": ["pdf", "jpg", "png"], "max_size_mb": 5 }
  display_order INT DEFAULT 0,
  instructions TEXT,
  instructions_am TEXT,
  instructions_or TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requirements_service_id ON service_requirements(service_id);
CREATE INDEX idx_requirements_variation_id ON service_requirements(variation_id);

-- ============================================================================
-- WORKFLOW CONFIGURATION: Service-specific workflow states and transitions
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  workflow_name VARCHAR(200),
  workflow_name_am VARCHAR(200),
  workflow_name_or VARCHAR(200),
  states JSONB NOT NULL,                    -- Array: [{ "name": "submitted", "label": "Submitted", "actions": [...] }]
  transitions JSONB NOT NULL,               -- Array: [{ "from": "submitted", "to": "approved", "action": "approve", "requires_role": "officer" }]
  initial_state VARCHAR(100) NOT NULL DEFAULT 'submitted',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflows_service_id ON service_workflows(service_id);

-- ============================================================================
-- Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_service ON service_requests(user_id, service_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status_created ON service_requests(status, created_at);

-- ============================================================================
-- Create views for catalog discovery
-- ============================================================================

CREATE OR REPLACE VIEW v_service_catalog AS
SELECT 
  s.id,
  s.name,
  s.name_am,
  s.name_or,
  s.description,
    sc.name as category,
  st.core_type,
  st.type,
  st.subtype,
  s.sector,
  s.service_fee,
  s.estimated_processing_days,
  s.online_available,
  sc.name as category_name,
  COUNT(DISTINCT sv.id) as variation_count,
  COUNT(DISTINCT er.id) as eligibility_rules_count,
  COUNT(DISTINCT sr.id) as recent_applications
FROM services s
LEFT JOIN service_categories sc ON s.category_id = sc.id
LEFT JOIN service_taxonomy st ON s.taxonomy_id = st.id
LEFT JOIN service_variations sv ON s.id = sv.service_id AND sv.is_available = TRUE
LEFT JOIN eligibility_rules er ON s.id = er.service_id AND er.is_active = TRUE
LEFT JOIN service_requests sr ON s.id = sr.service_id AND sr.created_at > NOW() - INTERVAL '30 days'
WHERE s.status = 'active'
  GROUP BY s.id, s.name, s.name_am, s.name_or, s.description, sc.name, st.core_type, st.type, st.subtype, s.sector, s.service_fee, s.estimated_processing_days, s.online_available;

-- Note: Indexes cannot be created on materialized views, only on tables
-- The v_service_catalog view provides fast discovery queries via table indexes
