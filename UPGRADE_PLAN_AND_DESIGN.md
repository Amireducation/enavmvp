# Ethiopian Navigator System - MVP to Production Upgrade Plan
## Comprehensive Product Design & Development Document

**Document Version:** 1.0  
**Date:** March 10, 2026  
**Status:** Ready for Development  
**Prepared by:** Full-Stack Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Target Architecture](#target-architecture)
4. [Phased Upgrade Roadmap](#phased-upgrade-roadmap)
5. [Core Infrastructure Enhancements](#core-infrastructure-enhancements)
6. [Microservices Architecture Migration](#microservices-architecture-migration)
7. [Data Platform & Central Repository](#data-platform--central-repository)
8. [Technical Implementation Details](#technical-implementation-details)
9. [Development Priorities & Timeline](#development-priorities--timeline)
10. [Risk Assessment & Mitigation](#risk-assessment--mitigation)

---

## Executive Summary

The Ethiopian Navigator MVP has successfully demonstrated core G2B (Government-to-Business) capabilities including user authentication, service browsing, request submission, and basic admin functionality. The MVP currently serves as a monolithic Next.js application with a Python AI chatbot backend.

**Upgrade Objective:** Transform the MVP into a production-grade, enterprise-scale platform that supports:
- **Four interaction models:** G2B, B2G, G2G, B2B
- **Multiple specialized portals:** User, Admin, Partner, G2G Workspace
- **Advanced AI capabilities:** Context-aware chatbot, knowledge graph, recommendations
- **Central data repository:** Real-time data integration from government sources
- **Microservices architecture:** Independent, scalable service components
- **99.9% uptime SLA** with comprehensive monitoring

**Key Transformations Required:**
1. Decompose monolith into 10 specialized microservices
2. Build central data repository with data mesh patterns
3. Implement comprehensive API gateway and event-driven architecture
4. Enhance AI/ML capabilities (chatbot, knowledge graph, recommendations)
5. Add B2B marketplace, partnership integrations, and G2G collaboration
6. Implement enterprise-grade security, compliance, and audit trails

---

## Current State Analysis

### MVP Architecture

**Frontend:**
- Next.js 16 application
- React 19.2 with TypeScript
- shadcn/ui component library
- Multi-portal structure (Citizen, Admin, Employee, Partner)
- Responsive design with Tailwind CSS

**Backend:**
- Node.js Express server (legacy)
- Direct database connections (Neon PostgreSQL)
- Basic REST APIs
- JWT-based authentication

**AI/ML:**
- Python-based chatbot service
- Azure OpenAI integration
- Azure Cognitive Search for knowledge retrieval
- BERT-based intent classification
- i18n translation service

**Database:**
- Neon PostgreSQL (primary)
- Basic schema for users, services, requests, applications
- No data mesh or central repository

**Current Capabilities:**
✅ User registration and authentication  
✅ Service browsing and request submission  
✅ Admin dashboard for request management  
✅ Basic notifications  
✅ AI chatbot with FAQ assistance  
✅ Analytics dashboard  
✅ Multi-language support (Amharic, English, Oromo)

**Current Limitations:**
❌ Monolithic frontend (needs service-based portals)  
❌ No microservices (all services mixed)  
❌ No real-time data sync from government sources  
❌ Limited AI capabilities (no knowledge graph, recommendations)  
❌ No B2B marketplace or partnerships  
❌ No G2G collaboration tools  
❌ Minimal audit trails and compliance features  
❌ No event-driven architecture  
❌ Scaling challenges (single instance bottleneck)

---

## Target Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN & Edge Layer                        │
│                    (CloudFront, DDoS Protection)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      API Gateway Layer                       │
│              (Kong/AWS API Gateway - Request Routing,        │
│               Auth, Rate Limiting, CORS, Caching)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼────┐      ┌─────▼────┐      ┌─────▼────┐
  │ Frontend  │      │ Frontend  │      │ Frontend │
  │ Portal:   │      │ Portal:   │      │ Portal:  │
  │ User      │      │ Admin     │      │ Partner  │
  │ (Next.js) │      │ (Next.js) │      │ (Next.js)│
  └───────────┘      └───────────┘      └──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼──────────┐  ┌─────▼────┐  ┌────▼─────┐
  │ Microservices  │  │ Message  │  │ Cache &  │
  │ Layer          │  │ Queue    │  │ Session  │
  │                │  │ (Kafka)  │  │ (Redis)  │
  │ • User Svc     │  │          │  │          │
  │ • Service Mgmt │  │  Events: │  │ Real-time│
  │ • Content      │  │  • user. │  │ Data     │
  │ • Partnership  │  │  • req.  │  │          │
  │ • Payment      │  │  • pmt.  │  │          │
  │ • Analytics    │  │  • etc.  │  │          │
  │ • AI Orch      │  │          │  │          │
  │ • Notification │  │          │  │          │
  │ • G2G          │  │          │  │          │
  │ • B2B          │  │          │  │          │
  └────────┬───────┘  └──────────┘  └──────────┘
           │
        ┌──▼──────────────────────────────────┐
        │   Central Repository Layer          │
        │   (Data Mesh + Lakehouse)           │
        │                                      │
        │  ┌─ Ingestion ──────────────────┐  │
        │  │ • CDC (Debezium)              │  │
        │  │ • Batch ETL (Spark)           │  │
        │  │ • Stream Processing (Kafka)   │  │
        │  └───────────────────────────────┘  │
        │                                      │
        │  ┌─ Storage Zones ───────────────┐  │
        │  │ • Bronze (Raw)                │  │
        │  │ • Silver (Cleaned)            │  │
        │  │ • Gold (Curated)              │  │
        │  └───────────────────────────────┘  │
        │                                      │
        │  ┌─ Query Engines ───────────────┐  │
        │  │ • Neo4j (Knowledge Graph)     │  │
        │  │ • Elasticsearch (Search)      │  │
        │  │ • TimescaleDB (Time-Series)   │  │
        │  │ • MongoDB (Documents)         │  │
        │  │ • PostgreSQL (Metadata)       │  │
        │  │ • Presto/Trino (Federated SQL)│ │
        │  └───────────────────────────────┘  │
        │                                      │
        │  ┌─ Data Services ───────────────┐  │
        │  │ • Unified Catalog             │  │
        │  │ • API Marketplace             │  │
        │  │ • Feature Store               │  │
        │  │ • Self-Service Analytics      │  │
        │  └───────────────────────────────┘  │
        └──────────────────────────────────────┘
           │
        ┌──▼──────────────────────────────────┐
        │    External Integrations            │
        │                                      │
        │ • Legacy Systems (CDC, REST APIs)  │
        │ • Payment Gateways (Chapa, Telr)   │
        │ • Communication (SMS, Email)       │
        │ • Partner Systems (REST APIs)      │
        │ • External Data Sources (APIs)     │
        └──────────────────────────────────────┘
```

### Deployment Architecture

**Multi-Environment Strategy:**
- **Development:** Docker Compose on local machines
- **Staging:** Kubernetes cluster on AWS (EKS)
- **Production:** Highly available EKS cluster across multiple AZs with auto-scaling

**Infrastructure Components:**
- AWS EKS (Kubernetes)
- RDS PostgreSQL (Primary data store)
- MongoDB Atlas (Documents)
- Neo4j Aura (Knowledge Graph)
- AWS OpenSearch (Search)
- ElastiCache Redis (Cache & Sessions)
- S3 Data Lake (Bronze/Silver/Gold zones)
- CloudFront CDN
- AWS API Gateway or Kong
- Neon for serverless PostgreSQL option

---

## Phased Upgrade Roadmap

### Phase 1: Foundation & Infrastructure (Months 1-2)

**Focus:** Establish scalable infrastructure and modernize core services

**Deliverables:**
1. **Infrastructure Setup**
   - Provision EKS cluster with auto-scaling
   - Set up RDS PostgreSQL with read replicas
   - Configure CloudFront CDN and WAF
   - Implement VPC with private subnets
   - Set up CI/CD pipelines (GitLab CI)

2. **API Gateway Implementation**
   - Deploy Kong or AWS API Gateway
   - Implement request routing, rate limiting, caching
   - Set up centralized authentication
   - Enable CORS and request/response transformation

3. **User Service Microservice**
   - Extract user management from monolith
   - Implement NestJS/FastAPI service
   - Containerize and deploy to Kubernetes
   - Database schema migration
   - JWT token management

4. **Enhanced Authentication**
   - Multi-factor authentication (MFA)
   - OAuth2 support for partnerships
   - Session management with Redis
   - Account lockout and security policies

**Success Metrics:**
- ✅ Kubernetes cluster operational with auto-scaling
- ✅ CI/CD pipeline running automated tests
- ✅ User Service independently deployable
- ✅ 99.9% uptime achieved in staging

**Team:** DevOps (3), Backend (2), Frontend (1), Security (1)

---

### Phase 2: Core Service Microservices (Months 2-4)

**Focus:** Migrate core business logic to microservices

**Deliverables:**
1. **Service Management Microservice**
   - Service catalog management
   - Request workflow engine
   - Status tracking and notifications
   - Document attachment handling

2. **Content Management Service**
   - FAQ management
   - Policy/guide publishing
   - Announcement system
   - MongoDB integration for unstructured content

3. **Notification Service**
   - Email, SMS, push notifications
   - Queue-based processing (Kafka)
   - Template management
   - Delivery tracking

4. **Analytics Service**
   - TimescaleDB integration
   - Metrics collection and aggregation
   - Dashboard data APIs
   - Performance KPI tracking

5. **Payment Service**
   - Payment gateway integration (Chapa, Telr)
   - Invoice generation
   - Transaction logging
   - Payment status tracking

**Architectural Patterns:**
- Event-driven async processing
- Database per service principle
- Circuit breakers for resilience
- Centralized logging (ELK stack)

**Success Metrics:**
- ✅ All services independently deployable
- ✅ Event bus operational with Kafka
- ✅ Zero downtime migration from monolith
- ✅ API response time < 500ms (95th percentile)

**Team:** Backend (4), QA (2), DevOps (1)

---

### Phase 3: AI & Intelligence Layer (Months 4-6)

**Focus:** Build advanced AI capabilities and knowledge management

**Deliverables:**
1. **Central Repository Foundation**
   - Bronze, Silver, Gold zones implemented
   - Change Data Capture (CDC) from legacy systems
   - Batch ETL pipelines (Apache Spark)
   - Initial data ingestion

2. **Knowledge Graph (Neo4j)**
   - Entity modeling (businesses, services, policies)
   - Relationship graphs
   - Knowledge enrichment pipelines
   - Graph query APIs

3. **Search Infrastructure (Elasticsearch)**
   - Policy, FAQ, service indexing
   - Full-text search implementation
   - Faceted search and filtering
   - Search result ranking

4. **AI Orchestration Service Enhancement**
   - Context-aware chatbot with knowledge graph
   - Intent recognition (Amharic, English, Oromo)
   - Entity extraction from requests
   - Escalation to human support
   - Conversation history management

5. **Recommendation Engine**
   - Personalized service recommendations
   - Collaborative filtering
   - Content-based recommendations
   - A/B testing framework

**Technical Stack:**
- Apache Spark for data processing
- Debezium for CDC
- Neo4j for knowledge graph
- LangChain for AI orchestration
- Hugging Face transformers for NLP
- Feature Store for ML

**Success Metrics:**
- ✅ Chatbot resolves 70% of queries without escalation
- ✅ Search queries return relevant results in < 1 second
- ✅ Knowledge graph contains 10,000+ entities
- ✅ Real-time data sync from legacy systems (< 1 min latency)

**Team:** Data Engineers (2), ML Engineers (2), Backend (1), Frontend (1)

---

### Phase 4: B2B & Partnership Ecosystem (Months 6-8)

**Focus:** Launch B2B marketplace and partner integration capabilities

**Deliverables:**
1. **Partnership Service Microservice**
   - Partner registration and onboarding
   - API key and credential management
   - Service integration workflow
   - Partner approval process

2. **B2B Service Microservice**
   - Business directory
   - Service marketplace
   - Business-to-business connections
   - RFQ (Request for Quote) system
   - Reviews and ratings

3. **Partner Portal**
   - Partner dashboard
   - Service management interface
   - Integration documentation
   - API credential management
   - Analytics for partner services

4. **API Marketplace**
   - Developer documentation
   - API versioning and lifecycle
   - Rate limiting per partner
   - Usage analytics
   - Webhook support

5. **B2B UI Components**
   - Business directory search
   - Service comparison
   - Inquiry/contact system
   - Partnership requests

**Integration Patterns:**
- OAuth2 for partner authentication
- REST APIs with OpenAPI documentation
- Webhook notifications
- Rate limiting per partner

**Success Metrics:**
- ✅ 50+ partners registered and activated
- ✅ API marketplace with documented endpoints
- ✅ 1,000+ businesses in directory
- ✅ Partner API integration tests automated

**Team:** Backend (3), Frontend (2), DevOps (1), QA (1)

---

### Phase 5: G2G Collaboration & Advanced Features (Months 8-10)

**Focus:** Enable inter-government collaboration and advanced analytics

**Deliverables:**
1. **G2G Service Microservice**
   - Project workspace creation
   - Task management and assignment
   - Document sharing with versioning
   - Real-time collaboration features
   - Data sharing agreements
   - Cross-ministry data requests

2. **G2G Workspace Portal**
   - Project dashboard
   - Task tracking (Kanban view)
   - Document management
   - Timeline/Gantt charts
   - Team messaging
   - Permission management

3. **Advanced Analytics**
   - Custom dashboard builder
   - Pre-built government dashboards
   - Performance KPIs
   - Inter-agency reports
   - Data quality monitoring
   - Predictive analytics

4. **Full Multilingual AI**
   - Amharic NLP models
   - Oromo NLP models
   - Character encoding support
   - Translation pipelines
   - Cultural context awareness

5. **Compliance & Audit**
   - Complete audit trail logging
   - Data lineage tracking
   - Access control enforcement
   - Regulatory compliance dashboards
   - Data retention policies

**Technical Implementation:**
- GraphQL APIs for flexible querying
- Real-time WebSocket connections
- CRDT for collaborative editing
- Audit log immutability (blockchain optional)

**Success Metrics:**
- ✅ All 10+ ministries onboarded
- ✅ 100+ inter-ministry projects active
- ✅ Chatbot supports all three languages fluently
- ✅ 99.95% uptime achieved

**Team:** Backend (2), Frontend (2), Data Engineers (1), ML Engineers (1), QA (1)

---

### Phase 6: Optimization, Scale & Launch (Months 10-12)

**Focus:** Performance tuning, security hardening, production launch

**Deliverables:**
1. **Performance Optimization**
   - Load testing (k6 - 10,000+ concurrent users)
   - Database query optimization
   - Caching strategy refinement
   - CDN configuration optimization
   - API response time optimization (target: < 300ms p99)

2. **Security Hardening**
   - Penetration testing
   - Vulnerability scanning (OWASP ZAP, Snyk)
   - Security audit completion
   - Data encryption (TLS, at-rest)
   - Secrets management (HashiCorp Vault)
   - WAF rules configuration

3. **Compliance & Governance**
   - GDPR compliance verification
   - Ethiopian Data Protection compliance
   - PCI DSS for payments
   - ISO 27001 certification
   - Data retention policies enforcement

4. **User Acceptance Testing**
   - Pilot user onboarding (100+ users)
   - Feedback collection and iteration
   - Documentation finalization
   - Training materials creation
   - Support team training

5. **Production Launch**
   - Blue/green deployment strategy
   - Canary release (10% → 50% → 100%)
   - Monitoring and alerting active
   - Incident response procedures ready
   - Rollback procedures tested

**Success Metrics:**
- ✅ Zero critical vulnerabilities
- ✅ 99.9% uptime SLA achieved
- ✅ > 90% user satisfaction
- ✅ All performance targets met
- ✅ Full regulatory compliance

**Team:** All teams, External Security Auditors, External Compliance Consultants

---

## Core Infrastructure Enhancements

### 1. Cloud Infrastructure & Kubernetes

**Current State:** MVP running on Vercel (Next.js) + Python backend

**Target State:** AWS EKS with multi-AZ deployment

**Implementation Plan:**

```yaml
EKS Cluster:
  - 3+ nodes across multiple AZs
  - Auto-scaling based on CPU/memory
  - Network policies for pod communication
  - Pod Disruption Budgets for availability
  
Load Balancing:
  - AWS NLB (Network Load Balancer) for TCP/UDP
  - ALB (Application Load Balancer) for HTTP/HTTPS
  - Service mesh (Istio) for microservice routing
  
Storage:
  - EBS for persistent volumes
  - S3 for object storage (data lake)
  - EFS for shared file systems
  
Networking:
  - VPC with private/public subnets
  - NAT Gateway for egress
  - Security groups and NACLs
  - VPN for secure admin access
```

**Migration Path:**
1. Provision EKS cluster in parallel with Vercel
2. Migrate User Service first (lowest risk)
3. Gradually migrate other microservices
4. Cut over DNS to EKS (blue/green)
5. Decommission Vercel environment

### 2. API Gateway & Service Mesh

**Kong Configuration:**
```yaml
API Gateway:
  - Request routing to microservices
  - Rate limiting (per user, per endpoint, global)
  - Authentication (JWT, OAuth2, API keys)
  - Response caching (Redis-backed)
  - Request/response transformation
  - Logging and monitoring
  - CORS management
  
Service Mesh (Istio):
  - Traffic management (routing, load balancing)
  - Security (mTLS, authorization policies)
  - Observability (tracing, metrics)
  - Circuit breaking and retries
  - Canary deployments
```

### 3. Database Strategy (Polyglot Persistence)

**PostgreSQL (RDS)**
```sql
-- Primary transactional data
Users, UserProfiles, RefreshTokens
Services, ServiceRequests, Workflows
Payments, Invoices, Transactions
G2GProjects, G2GTasks, Collaborations
PartnerApplications, PartnerServices
Audit Logs, Compliance Records
```

**MongoDB Atlas**
```json
{
  "collections": [
    "policies",
    "faqs",
    "guides",
    "announcements",
    "service_specifications",
    "document_metadata"
  ]
}
```

**Neo4j Aura**
```cypher
// Entities: Business, Service, Policy, Person
// Relationships: provides, requires, implements, owns, requests, approves
MATCH (b:Business)-[rel:PROVIDES]->(s:Service) 
WHERE (b)-[:COMPLIES_WITH]->(p:Policy)
RETURN b, rel, s, p
```

**Elasticsearch**
```json
{
  "indices": [
    "services",
    "policies",
    "faqs",
    "businesses",
    "news"
  ]
}
```

**TimescaleDB**
```sql
-- Time-series metrics
CREATE TABLE metrics (
  time TIMESTAMPTZ NOT NULL,
  metric_name TEXT NOT NULL,
  value FLOAT8 NOT NULL,
  labels JSONB
);
```

**Redis (ElastiCache)**
```
- Session storage
- Cache layer (query results, business data)
- Rate limiting counters
- Real-time data (active users, notifications)
- Message queue (Kafka-backed)
```

### 4. Data Platform - Central Repository

**Architecture:**

```
Data Sources (CDC)
    ↓
Debezium (CDC Connector)
    ↓
Kafka Topics
    ├─→ Bronze Zone (S3 Raw Layer)
    │       ↓
    │   Data Validation
    │       ↓
    ├─→ Silver Zone (Cleaned & Masked)
    │       ↓
    │   Business Logic Transformations
    │       ↓
    └─→ Gold Zone (Curated & Business-Ready)
            ↓
        ┌───┴───┬────────────┬────────────┐
        ↓       ↓            ↓            ↓
      Neo4j  Elasticsearch  MongoDB   TimescaleDB
        ↓       ↓            ↓            ↓
        └───┬───┴────────────┴────────────┘
            ↓
    Unified Data Catalog
            ↓
    ┌───────┴───────┬──────────┬─────────────┐
    ↓               ↓          ↓             ↓
API Marketplace  Feature    Analytics   Consumers
                 Store      Engine
```

**Key Components:**

1. **Debezium CDC Setup**
   - Real-time change capture from legacy systems
   - Initial snapshot + incremental changes
   - Exactly-once delivery semantics

2. **Apache Spark Pipelines**
   - Bronze → Silver transformation
   - Data quality checks
   - PII masking
   - Aggregate calculations

3. **Data Catalog**
   - Dataset discovery
   - Data lineage tracking
   - Quality metrics
   - Access control policies

### 5. Event-Driven Architecture (Kafka)

**Core Events:**
```
user.registered → Notification, Analytics, OnboardingService
request.submitted → Notification, Analytics, WorkflowEngine
request.approved → Notification, DocumentGeneration, Analytics
payment.completed → ServiceManagement, Notification, Analytics
partner.approved → Notification, PartnerService, Analytics
data.updated → CacheInvalidation, RealtimeUpdates
```

**Event Schema:**
```typescript
interface DomainEvent {
  eventId: UUID;
  eventType: string;
  source: string;
  timestamp: ISO8601;
  data: Record<string, any>;
  version: "1.0";
  correlationId: UUID;
}
```

**Kafka Configuration:**
- 3-node broker cluster
- Replication factor: 3
- Retention: 7 days
- Partitioning: By user_id/entity_id for ordering

---

## Microservices Architecture Migration

### Service Decomposition

**10 Core Microservices:**

| Service | Responsibility | Tech Stack | Database | Async |
|---------|-----------------|-----------|----------|-------|
| User Service | Authentication, user profiles, roles | NestJS | PostgreSQL | Events |
| Service Management | Service catalog, requests, workflows | NestJS | PostgreSQL | Events, Tasks |
| Content Service | Policies, FAQs, guides | FastAPI | MongoDB | Events |
| Partnership Service | Partner registration, API mgmt | NestJS | PostgreSQL | Events |
| Payment Service | Payment processing, invoicing | NestJS | PostgreSQL | Webhook, Events |
| Analytics Service | Metrics, reporting, dashboards | FastAPI | TimescaleDB | Background Jobs |
| AI Orchestration | Chatbot, NLP, recommendations | FastAPI+LLM | Neo4j, ES, Redis | Background Jobs |
| Notification Service | Email, SMS, push notifications | NestJS | Redis | Kafka, Queue |
| G2G Service | Inter-ministry collaboration | NestJS | PostgreSQL | Events |
| B2B Service | Business directory, marketplace | NestJS | PostgreSQL, ES | Events |

### Service Contract & API Standards

**API Versioning:**
```
/api/v1/services      # Current version
/api/v2/services      # Future version
```

**Request Format:**
```typescript
interface ApiRequest {
  headers: {
    'Authorization': 'Bearer <JWT>',
    'X-Request-ID': UUID,
    'X-Correlation-ID': UUID,
    'Content-Type': 'application/json'
  },
  body: {
    // Service-specific
  }
}
```

**Response Format:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: ISO8601;
    requestId: UUID;
  };
}
```

**Error Codes:**
```
400 - BadRequest
401 - Unauthorized
403 - Forbidden
404 - NotFound
409 - Conflict
429 - TooManyRequests
500 - InternalServerError
503 - ServiceUnavailable
```

### Deployment Model

**Container Strategy:**
```dockerfile
# Base image
FROM node:20-alpine
# Single container per microservice
# Environment: dev, staging, production
# Version tags: semver (1.2.3)
```

**Kubernetes Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3  # Auto-scale 1-10 based on load
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:1.2.3
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
```

---

## Technical Implementation Details

### Frontend Architecture Refactoring

**Current State:** Monolithic Next.js

**Target State:** Multiple Next.js applications (portals) sharing common components

**Portal Structure:**
```
/apps/
├── user-portal/           # Citizens & businesses
│   ├── app/
│   │   ├── services/
│   │   ├── applications/
│   │   ├── chatbot/
│   │   └── profile/
│   └── package.json
├── admin-portal/          # Government officials
│   ├── app/
│   │   ├── dashboard/
│   │   ├── requests/
│   │   ├── users/
│   │   └── analytics/
│   └── package.json
├── partner-portal/        # Business partners
│   ├── app/
│   │   ├── services/
│   │   ├── integrations/
│   │   └── analytics/
│   └── package.json
├── g2g-workspace/         # Inter-ministry
│   ├── app/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── collaboration/
│   └── package.json
└── shared-components/    # Shared UI components
    ├── components/
    ├── utils/
    ├── hooks/
    ├── types/
    └── package.json
```

### Backend Migration Path

**Phase 1: Extract User Service**
```typescript
// Old: app/api/auth/login/route.ts
// New: microservices/user-service/src/auth/login.ts

// Both serve same API endpoint during transition
// API Gateway routes requests to new service
// Gradual traffic migration (10% → 50% → 100%)
```

**Phase 2: Service Isolation**
```typescript
// Database separation
// Old DB: All services in one schema
// New DB: Each service has own PostgreSQL database
// Migration: Data duplication during transition

// Async event propagation
// Old: Direct database queries across services
// New: Event-driven updates
// Example: payment.completed → Service Management updates request status
```

### Security Implementation

**Authentication Flow:**
```
User Login
    ↓
User Service validates credentials
    ↓
JWT token generated (30 min expiry)
    ↓
Refresh token stored in Redis (30 days expiry)
    ↓
API Gateway validates JWT on each request
    ↓
User roles/permissions from User Service
    ↓
Authorization checks in each microservice
```

**Data Protection:**
```
- At Rest: AES-256 encryption in RDS
- In Transit: TLS 1.3
- PII Masking: In Silver zone, shown only to authorized
- Audit Logging: All access to sensitive data logged
- Secrets: HashiCorp Vault for API keys, passwords
```

---

## Development Priorities & Timeline

### Sprint Planning (2-Week Sprints)

**Critical Path (Must-Have):**
1. Infrastructure (EKS, RDS, basic networking)
2. User Service microservice
3. Service Management microservice
4. API Gateway implementation
5. Central Repository foundation

**High Priority (Should-Have):**
6. Payment Service
7. Notification Service
8. G2G Service basic features
9. Analytics dashboard

**Medium Priority (Nice-to-Have):**
10. B2B Service marketplace
11. Advanced AI features
12. Recommendation engine
13. Partner integrations

### Team Structure

**DevOps Team (3)**
- Infrastructure as Code (Terraform)
- Kubernetes cluster management
- CI/CD pipeline maintenance
- Monitoring and alerting setup

**Backend Team (5)**
- Microservice development (NestJS/FastAPI)
- Database schema design and migration
- API design and documentation
- Event-driven system implementation

**Frontend Team (3)**
- Portal UI development (Next.js, React)
- Component library management
- Performance optimization
- Accessibility compliance

**Data & AI Team (3)**
- Central Repository setup (Spark, Kafka)
- Data pipeline development
- Knowledge graph construction
- Chatbot and NLP implementation

**QA Team (2)**
- Automated testing (unit, integration, E2E)
- Performance testing
- Security testing
- Accessibility testing

**Product & Documentation (1)**
- Requirements clarification
- API documentation
- Release notes
- User documentation

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Legacy system integration complexity** | High | High | Start CDC PoC early; work with IT teams; have REST API fallback |
| **Data quality from government sources** | High | Medium | Implement data quality checks; work with ministries on data standards |
| **Amharic NLP model performance** | Medium | High | Use transfer learning; collect training data early; community support |
| **Real-time performance under peak load** | Medium | High | Load test with k6; implement aggressive caching; database optimization |
| **Security vulnerabilities in microservices** | Low | Critical | Regular security reviews; penetration testing; bug bounty program |
| **Breaking changes in third-party APIs** | Low | Medium | Version dependencies strictly; maintain compatibility layer |

### Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | Medium | High | Strict change control board; MVP focus; phased approach |
| **Stakeholder misalignment** | Medium | High | Weekly demos; steering committee meetings; clear communication |
| **Timeline delays** | Medium | Medium | Agile planning with buffers; continuous re-planning; early risk identification |
| **Talent shortage** | Low | High | Competitive compensation; training programs; remote hiring |
| **Regulatory changes** | Low | Medium | Legal team engagement; architecture flexibility; compliance buffer |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Incident response delays** | Low | High | 24/7 on-call rotation; runbooks prepared; incident drills |
| **Data breach exposure** | Low | Critical | SOC 2 compliance; DLP implementation; insurance coverage |
| **Service degradation** | Medium | High | Monitoring and alerting; auto-scaling; circuit breakers |
| **Cost overruns** | Medium | High | Budget tracking; vendor negotiations; cost optimization |

---

## Success Criteria

### MVP Phase Success (Current)
- ✅ Basic G2B flow operational
- ✅ User authentication working
- ✅ Chatbot responding to queries
- ✅ Admin dashboard functional

### Production Phase Success (Target)
- ✅ **Availability:** 99.9% uptime SLA
- ✅ **Performance:** API p95 response time < 500ms, p99 < 2 seconds
- ✅ **Scalability:** Support 10,000+ concurrent users
- ✅ **Feature Completeness:** All 4 interaction models (G2B, B2G, G2G, B2B) operational
- ✅ **User Satisfaction:** > 90% positive feedback
- ✅ **Security:** Zero critical vulnerabilities, 100% compliance
- ✅ **Adoption:** 50,000+ registered users, 10,000+ businesses
- ✅ **Partnerships:** 100+ active API partners
- ✅ **Government Integration:** All 10+ key ministries onboarded

---

## Next Immediate Steps

### Week 1-2: Planning & Preparation
- [ ] Establish project governance and steering committee
- [ ] Finalize budget allocation per phase
- [ ] Recruit core team members
- [ ] Set up development environment templates
- [ ] Create detailed architectural diagrams and documentation

### Week 3-4: Phase 1 Kickoff
- [ ] Provision EKS cluster
- [ ] Set up Terraform IaC
- [ ] Configure CI/CD pipelines
- [ ] Begin User Service extraction
- [ ] Plan database migration strategy

### Ongoing: Communication
- Weekly standups with technical team
- Bi-weekly demos to stakeholders
- Monthly steering committee meetings
- Public progress updates

---

## Document Ownership & Maintenance

- **Document Owner:** Lead Full-Stack Developer
- **Last Updated:** March 10, 2026
- **Next Review:** April 10, 2026 (Post-Phase 1)
- **Approval Status:** Ready for Development Team Review

---

**END OF UPGRADE PLAN DOCUMENT**

*This document serves as the authoritative guide for upgrading the Ethiopian Navigator MVP to a production-grade, enterprise-scale platform. All technical and product decisions should reference this document to ensure consistency and alignment.*
