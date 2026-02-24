-- Create partnerships and programs tables for partner management

CREATE TABLE IF NOT EXISTS partnerships (
  partnership_id UUID PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  partnership_type VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partnership_programs (
  program_id UUID PRIMARY KEY,
  partnership_id UUID REFERENCES partnerships(partnership_id) ON DELETE CASCADE,
  program_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  participants_count INT DEFAULT 0,
  budget DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partnerships_status ON partnerships(status);
CREATE INDEX IF NOT EXISTS idx_partnership_programs_partnership ON partnership_programs(partnership_id);

-- Seed sample partnerships
INSERT INTO partnerships (partnership_id, organization_name, contact_person, contact_email, partnership_type, description, status)
VALUES 
  (gen_random_uuid(), 'Ethiopian Digital Initiative', 'Abebe Kebede', 'abebe@edi.et', 'Digital Transformation', 'Partnership for digital literacy programs across rural Ethiopia', 'active'),
  (gen_random_uuid(), 'Community Services Network', 'Tigist Alemayehu', 'tigist@csn.et', 'Community Outreach', 'Collaborative community service delivery and support programs', 'active'),
  (gen_random_uuid(), 'Tech Innovation Hub', 'Daniel Teklu', 'daniel@techhub.et', 'Technology Integration', 'Technology integration and innovation in government services', 'active')
ON CONFLICT DO NOTHING;
