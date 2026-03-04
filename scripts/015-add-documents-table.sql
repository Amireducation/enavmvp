-- Phase 2: Feature 1 - Documents/File Upload System
-- Adds support for document storage and tracking for service applications

-- ============================================================================
-- CREATE DOCUMENTS TABLE: Track uploaded files for applications
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  blob_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  document_type VARCHAR(100),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  is_required BOOLEAN DEFAULT FALSE,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_documents_application ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_verified ON documents(verified);
