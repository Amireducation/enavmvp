-- Phase 1: Database Schema Optimization & Microservices Isolation
-- File: 001_create_microservice_schemas.sql
-- Purpose: Create separate schemas for each microservice with proper isolation

-- Create microservice-specific schemas
CREATE SCHEMA IF NOT EXISTS user_service;
CREATE SCHEMA IF NOT EXISTS service_management;
CREATE SCHEMA IF NOT EXISTS content_service;
CREATE SCHEMA IF NOT EXISTS payment_service;
CREATE SCHEMA IF NOT EXISTS ai_service;
CREATE SCHEMA IF NOT EXISTS notification_service;
CREATE SCHEMA IF NOT EXISTS analytics_service;
CREATE SCHEMA IF NOT EXISTS partnership_service;
CREATE SCHEMA IF NOT EXISTS g2g_service;
CREATE SCHEMA IF NOT EXISTS b2b_service;
CREATE SCHEMA IF NOT EXISTS shared_infrastructure;

-- Create service-specific database roles
CREATE ROLE user_service_role WITH LOGIN;
CREATE ROLE service_management_role WITH LOGIN;
CREATE ROLE content_service_role WITH LOGIN;
CREATE ROLE payment_service_role WITH LOGIN;
CREATE ROLE ai_service_role WITH LOGIN;
CREATE ROLE notification_service_role WITH LOGIN;
CREATE ROLE analytics_service_role WITH LOGIN;
CREATE ROLE partnership_service_role WITH LOGIN;
CREATE ROLE g2g_service_role WITH LOGIN;
CREATE ROLE b2b_service_role WITH LOGIN;
CREATE ROLE api_gateway_role WITH LOGIN;

-- Grant schema access to roles
GRANT USAGE, CREATE ON SCHEMA user_service TO user_service_role;
GRANT USAGE, CREATE ON SCHEMA service_management TO service_management_role;
GRANT USAGE, CREATE ON SCHEMA content_service TO content_service_role;
GRANT USAGE, CREATE ON SCHEMA payment_service TO payment_service_role;
GRANT USAGE, CREATE ON SCHEMA ai_service TO ai_service_role;
GRANT USAGE, CREATE ON SCHEMA notification_service TO notification_service_role;
GRANT USAGE, CREATE ON SCHEMA analytics_service TO analytics_service_role;
GRANT USAGE, CREATE ON SCHEMA partnership_service TO partnership_service_role;
GRANT USAGE, CREATE ON SCHEMA g2g_service TO g2g_service_role;
GRANT USAGE, CREATE ON SCHEMA b2b_service TO b2b_service_role;

-- API Gateway needs read/write to all schemas for routing
GRANT USAGE ON SCHEMA user_service TO api_gateway_role;
GRANT USAGE ON SCHEMA service_management TO api_gateway_role;
GRANT USAGE ON SCHEMA content_service TO api_gateway_role;
GRANT USAGE ON SCHEMA payment_service TO api_gateway_role;
GRANT USAGE ON SCHEMA ai_service TO api_gateway_role;
GRANT USAGE ON SCHEMA notification_service TO api_gateway_role;
GRANT USAGE ON SCHEMA analytics_service TO api_gateway_role;
GRANT USAGE ON SCHEMA partnership_service TO api_gateway_role;
GRANT USAGE ON SCHEMA g2g_service TO api_gateway_role;
GRANT USAGE ON SCHEMA b2b_service TO api_gateway_role;

-- Shared infrastructure tables (for cross-service data)
CREATE TABLE IF NOT EXISTS shared_infrastructure.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_service ON shared_infrastructure.audit_log(service_name);
CREATE INDEX idx_audit_log_entity ON shared_infrastructure.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON shared_infrastructure.audit_log(user_id);
CREATE INDEX idx_audit_log_created ON shared_infrastructure.audit_log(created_at);

-- Service health check table
CREATE TABLE IF NOT EXISTS shared_infrastructure.service_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR NOT NULL UNIQUE,
  status VARCHAR NOT NULL DEFAULT 'healthy',
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT,
  version VARCHAR,
  instance_count INT DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service discovery table
CREATE TABLE IF NOT EXISTS shared_infrastructure.service_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR NOT NULL,
  instance_id VARCHAR NOT NULL,
  base_url VARCHAR NOT NULL,
  health_check_url VARCHAR,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_name, instance_id)
);

CREATE INDEX idx_service_registry_active ON shared_infrastructure.service_registry(service_name, is_active);

-- Event sourcing table for cross-service communication
CREATE TABLE IF NOT EXISTS shared_infrastructure.event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL,
  aggregate_id UUID NOT NULL,
  aggregate_type VARCHAR NOT NULL,
  source_service VARCHAR NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_event_log_aggregate ON shared_infrastructure.event_log(aggregate_type, aggregate_id);
CREATE INDEX idx_event_log_type ON shared_infrastructure.event_log(event_type);
CREATE INDEX idx_event_log_source ON shared_infrastructure.event_log(source_service);
CREATE INDEX idx_event_log_created ON shared_infrastructure.event_log(created_at);

-- Distributed lock table for inter-service coordination
CREATE TABLE IF NOT EXISTS shared_infrastructure.distributed_locks (
  resource_name VARCHAR PRIMARY KEY,
  lock_owner VARCHAR NOT NULL,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB
);

-- Grant shared infrastructure access
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO user_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO service_management_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO content_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO payment_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO ai_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO notification_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO analytics_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO partnership_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO g2g_service_role;
GRANT SELECT, INSERT, UPDATE ON shared_infrastructure.audit_log TO b2b_service_role;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set search path for each role
ALTER ROLE user_service_role SET search_path = user_service, shared_infrastructure, public;
ALTER ROLE service_management_role SET search_path = service_management, shared_infrastructure, public;
ALTER ROLE content_service_role SET search_path = content_service, shared_infrastructure, public;
ALTER ROLE payment_service_role SET search_path = payment_service, shared_infrastructure, public;
ALTER ROLE ai_service_role SET search_path = ai_service, shared_infrastructure, public;
ALTER ROLE notification_service_role SET search_path = notification_service, shared_infrastructure, public;
ALTER ROLE analytics_service_role SET search_path = analytics_service, shared_infrastructure, public;
ALTER ROLE partnership_service_role SET search_path = partnership_service, shared_infrastructure, public;
ALTER ROLE g2g_service_role SET search_path = g2g_service, shared_infrastructure, public;
ALTER ROLE b2b_service_role SET search_path = b2b_service, shared_infrastructure, public;
