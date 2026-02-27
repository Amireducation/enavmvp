-- Phase 3: Performance Optimization - Strategic Database Indexes
-- Optimize query performance with composite and single-column indexes
-- Date: 2026-02-27

-- ============================================================================
-- CRITICAL PERFORMANCE INDEXES
-- ============================================================================

-- Service Requests: Most commonly filtered by status and date
CREATE INDEX IF NOT EXISTS idx_service_requests_status_created 
ON service_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_requests_user_status 
ON service_requests(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_requests_service_status 
ON service_requests(service_id, status, created_at DESC);

-- Services: Quick lookups by category and status
CREATE INDEX IF NOT EXISTS idx_services_category_status 
ON services(category_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_services_status 
ON services(status, created_at DESC);

-- Notifications: User-specific queries are very common
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON notifications(user_id, is_read, created_at DESC);

-- Notification Queue: Processing queue lookups
CREATE INDEX IF NOT EXISTS idx_notification_queue_status 
ON notification_queue(status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_notification_queue_user_status 
ON notification_queue(user_id, status, created_at DESC);

-- Users: Login and activity tracking
CREATE INDEX IF NOT EXISTS idx_users_email_status 
ON users(email, status);

CREATE INDEX IF NOT EXISTS idx_users_last_login 
ON users(last_login_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_region 
ON users(region, status);

-- Feedback: Service ratings and reviews
CREATE INDEX IF NOT EXISTS idx_feedback_service_created 
ON feedback(service_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_user_service 
ON feedback(user_id, service_id, created_at DESC);

-- Chat Sessions: Session lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_created 
ON chat_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created 
ON chat_messages(session_id, created_at DESC);

-- Documents: File lookup and cleanup
CREATE INDEX IF NOT EXISTS idx_documents_user_created 
ON documents(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documents_application 
ON documents(application_id);

-- Service Expansion: Voting and trending
CREATE INDEX IF NOT EXISTS idx_service_expansion_requests_status_created 
ON service_expansion_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_expansion_requests_user 
ON service_expansion_requests(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_expansion_votes_expansion 
ON service_expansion_votes(expansion_id);

-- Audit Log: Historical queries
CREATE INDEX IF NOT EXISTS idx_audit_log_user_created 
ON audit_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity 
ON audit_log(entity_type, entity_id, created_at DESC);

-- Login History: Security audits
CREATE INDEX IF NOT EXISTS idx_login_history_user_created 
ON login_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_history_email_created 
ON login_history(email, created_at DESC);

-- ============================================================================
-- OPTIONAL: FULL-TEXT SEARCH INDEXES (comment out if not using PostgreSQL FTS)
-- ============================================================================

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_services_fulltext 
ON services USING GIN(to_tsvector('english', name || ' ' || description));

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_search 
ON knowledge_articles USING GIN(search_vector);

-- ============================================================================
-- STATISTICS AND ANALYSIS
-- ============================================================================

-- Analyze all tables to update query planner statistics
ANALYZE services;
ANALYZE service_requests;
ANALYZE notifications;
ANALYZE notification_queue;
ANALYZE users;
ANALYZE feedback;
ANALYZE chat_sessions;
ANALYZE documents;
ANALYZE service_expansion_requests;
ANALYZE audit_log;
ANALYZE login_history;

-- ============================================================================
-- PERFORMANCE MONITORING QUERIES (for reference)
-- ============================================================================
-- Run these manually to monitor index effectiveness:
-- 
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;
--
-- SELECT query, calls, mean_time FROM pg_stat_statements
-- WHERE query NOT LIKE '%pg_stat%'
-- ORDER BY mean_time DESC LIMIT 20;
