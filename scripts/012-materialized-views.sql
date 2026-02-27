-- Phase 3: Advanced Analytics - Materialized Views
-- Creates optimized views for expensive aggregations and reporting

-- Service Metrics Materialized View: Tracks service performance indicators
CREATE MATERIALIZED VIEW IF NOT EXISTS service_metrics AS
SELECT 
  s.id as service_id,
  s.name,
  s.category_id,
  sc.name as category_name,
  COUNT(sr.id) as total_applications,
  COUNT(CASE WHEN sr.status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN sr.status = 'rejected' THEN 1 END) as rejected_count,
  COUNT(CASE WHEN sr.status = 'pending' THEN 1 END) as pending_count,
  ROUND(100.0 * COUNT(CASE WHEN sr.status = 'approved' THEN 1 END) / NULLIF(COUNT(sr.id), 0), 2) as approval_rate,
  ROUND(AVG(CAST(sf.rating as FLOAT)), 2) as average_rating,
  COUNT(DISTINCT sf.id) as total_reviews,
  ROUND(AVG(EXTRACT(DAY FROM sr.updated_at - sr.created_at))::NUMERIC, 1) as avg_processing_days,
  MAX(sr.created_at) as last_application_date,
  NOW() as view_last_updated
FROM services s
LEFT JOIN service_categories sc ON s.category_id = sc.id
LEFT JOIN service_requests sr ON s.id = sr.service_id
LEFT JOIN service_feedback sf ON s.id = sf.service_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.category_id, sc.name;

-- Create index on service_metrics for faster queries
CREATE INDEX IF NOT EXISTS idx_service_metrics_approval_rate ON service_metrics(approval_rate DESC);
CREATE INDEX IF NOT EXISTS idx_service_metrics_category ON service_metrics(category_id);

-- User Cohorts Materialized View: Tracks user growth, engagement, and retention
CREATE MATERIALIZED VIEW IF NOT EXISTS user_cohorts AS
SELECT 
  DATE_TRUNC('month', u.created_at) as registration_month,
  COUNT(DISTINCT u.id) as new_users,
  COUNT(DISTINCT CASE WHEN sr.id IS NOT NULL THEN u.id END) as active_users,
  COUNT(DISTINCT sr.id) as total_applications_by_cohort,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN sr.id IS NOT NULL THEN u.id END) / NULLIF(COUNT(DISTINCT u.id), 0), 2) as activation_rate,
  ROUND(AVG(CASE WHEN sr.id IS NOT NULL THEN 1 ELSE 0 END)::NUMERIC, 2) as avg_applications_per_user,
  MAX(CASE WHEN sr.created_at IS NOT NULL THEN sr.created_at ELSE u.created_at END) as last_activity,
  NOW() as view_last_updated
FROM users u
LEFT JOIN service_requests sr ON u.id = sr.user_id
WHERE u.role = 'citizen'
GROUP BY DATE_TRUNC('month', u.created_at)
ORDER BY registration_month DESC;

-- Application Trends Materialized View: Time-series data for applications
CREATE MATERIALIZED VIEW IF NOT EXISTS application_trends AS
SELECT 
  DATE_TRUNC('day', sr.created_at)::DATE as application_date,
  DATE_TRUNC('week', sr.created_at)::DATE as application_week,
  DATE_TRUNC('month', sr.created_at)::DATE as application_month,
  sr.status,
  COUNT(*) as count,
  COUNT(DISTINCT sr.user_id) as unique_users,
  ROUND(AVG(CAST(sf.rating as FLOAT)), 2) as avg_daily_rating,
  NOW() as view_last_updated
FROM service_requests sr
LEFT JOIN service_feedback sf ON sr.id = sf.service_request_id
GROUP BY 
  DATE_TRUNC('day', sr.created_at),
  DATE_TRUNC('week', sr.created_at),
  DATE_TRUNC('month', sr.created_at),
  sr.status
ORDER BY application_date DESC;

-- Create indexes for trend queries
CREATE INDEX IF NOT EXISTS idx_application_trends_date ON application_trends(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_application_trends_week ON application_trends(application_week DESC);
CREATE INDEX IF NOT EXISTS idx_application_trends_status ON application_trends(status);

-- Category Performance Materialized View: Aggregate performance by category
CREATE MATERIALIZED VIEW IF NOT EXISTS category_performance AS
SELECT 
  sc.id as category_id,
  sc.name as category_name,
  COUNT(DISTINCT s.id) as service_count,
  COUNT(sr.id) as total_applications,
  ROUND(100.0 * COUNT(CASE WHEN sr.status = 'approved' THEN 1 END) / NULLIF(COUNT(sr.id), 0), 2) as category_approval_rate,
  ROUND(AVG(CAST(sf.rating as FLOAT)), 2) as category_avg_rating,
  COUNT(DISTINCT sr.user_id) as unique_users,
  MAX(sr.created_at) as last_application_in_category,
  NOW() as view_last_updated
FROM service_categories sc
LEFT JOIN services s ON sc.id = s.category_id AND s.status = 'active'
LEFT JOIN service_requests sr ON s.id = sr.service_id
LEFT JOIN service_feedback sf ON s.id = sf.service_id
GROUP BY sc.id, sc.name
ORDER BY total_applications DESC;

-- User Engagement Materialized View: Track user activity levels
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  u.created_at as user_registration_date,
  COUNT(sr.id) as applications_count,
  COUNT(DISTINCT sr.service_id) as unique_services_accessed,
  MAX(sr.created_at) as last_application_date,
  COUNT(sf.id) as feedback_submissions,
  ROUND(AVG(CAST(sf.rating as FLOAT)), 2) as user_avg_rating,
  CASE 
    WHEN MAX(sr.created_at) >= CURRENT_DATE - INTERVAL '7 days' THEN 'Very Active'
    WHEN MAX(sr.created_at) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
    WHEN MAX(sr.created_at) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Inactive'
    ELSE 'Dormant'
  END as engagement_level,
  NOW() as view_last_updated
FROM users u
LEFT JOIN service_requests sr ON u.id = sr.user_id
LEFT JOIN service_feedback sf ON u.id = sf.user_id
WHERE u.role = 'citizen'
GROUP BY u.id, u.email, u.full_name, u.created_at;

-- Create indexes for user engagement
CREATE INDEX IF NOT EXISTS idx_user_engagement_activity ON user_engagement(engagement_level);
CREATE INDEX IF NOT EXISTS idx_user_engagement_date ON user_engagement(last_application_date DESC);

-- Satisfaction Metrics Materialized View: Detailed satisfaction tracking
CREATE MATERIALIZED VIEW IF NOT EXISTS satisfaction_metrics AS
SELECT 
  DATE_TRUNC('day', sf.created_at)::DATE as feedback_date,
  sf.rating,
  COUNT(*) as feedback_count,
  COUNT(DISTINCT sf.user_id) as unique_reviewers,
  COUNT(DISTINCT sf.service_id) as unique_services_reviewed,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY DATE_TRUNC('day', sf.created_at))::FLOAT, 2) as percentage_of_daily_feedback,
  NOW() as view_last_updated
FROM service_feedback sf
GROUP BY DATE_TRUNC('day', sf.created_at), sf.rating
ORDER BY feedback_date DESC, rating DESC;

-- Refresh materialized views function (call to update stale data)
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY service_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_cohorts;
  REFRESH MATERIALIZED VIEW CONCURRENTLY application_trends;
  REFRESH MATERIALIZED VIEW CONCURRENTLY category_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_engagement;
  REFRESH MATERIALIZED VIEW CONCURRENTLY satisfaction_metrics;
END;
$$ LANGUAGE plpgsql;

-- Create a table to track refresh schedules
CREATE TABLE IF NOT EXISTS view_refresh_schedule (
  view_name TEXT PRIMARY KEY,
  last_refresh_time TIMESTAMP DEFAULT NOW(),
  refresh_interval INTERVAL DEFAULT '1 hour',
  is_active BOOLEAN DEFAULT true
);

INSERT INTO view_refresh_schedule (view_name, refresh_interval) VALUES
('service_metrics', '1 hour'),
('user_cohorts', '6 hours'),
('application_trends', '30 minutes'),
('category_performance', '2 hours'),
('user_engagement', '4 hours'),
('satisfaction_metrics', '1 hour')
ON CONFLICT (view_name) DO NOTHING;
