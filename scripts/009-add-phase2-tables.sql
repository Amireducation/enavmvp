-- Phase 2 Sprint 1: Add documents and service expansion tables
-- Documents table for file upload tracking
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  blob_url TEXT NOT NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('identity', 'residence_proof', 'business_plan', 'medical_report', 'educational_cert', 'other')),
  upload_status VARCHAR(20) DEFAULT 'uploaded' CHECK (upload_status IN ('uploading', 'uploaded', 'failed', 'scanned')),
  scan_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Service expansion requests table for citizen suggestions
CREATE TABLE IF NOT EXISTS service_expansion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  estimated_demand INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'implemented')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expansion votes table for voting tracking
CREATE TABLE IF NOT EXISTS service_expansion_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expansion_id UUID NOT NULL REFERENCES service_expansion_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(expansion_id, user_id)
);

-- Chat sessions table for AI chatbot
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE,
  topic VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat messages table for conversation history
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  context_used JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notification queue table for async email/SMS delivery
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('application_status', 'service_update', 'expansion_approved', 'feedback_response', 'system_alert')),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient_address VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  template_data JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_application ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_expansion_user ON service_expansion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_expansion_status ON service_expansion_requests(status);
CREATE INDEX IF NOT EXISTS idx_expansion_votes_expansion ON service_expansion_votes(expansion_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_user ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_created ON notification_queue(created_at DESC);
