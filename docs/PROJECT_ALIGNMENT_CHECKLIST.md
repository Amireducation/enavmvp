# Ethiopian Navigator MVP - Project Alignment Checklist

**Date:** February 20, 2026  
**Status:** IN PROGRESS  
**Lead:** Development Team  

---

## Overview

This document tracks all requirements from the three specification documents and their implementation status in the codebase:
1. **Service Catalogue Blueprint** - Defines 32 government services across 12 categories
2. **MVP Single Source of Truth** - Overall architecture and project structure
3. **Workflow Documentation** - Complete process flows for all user roles

---

## Section 1: Core Database Schema Implementation

### 1.1 Service Entity
- [x] Create users table
- [x] Create services table with all required fields
- [x] Add service_id, category, name, description, responsible_agency
- [x] Add estimated_processing_time, service_fee, is_archived flags
- [x] Create service_requirements table
- [x] Create service_process_steps table
- [ ] **PENDING:** Add source_request_id field to link services to requests
- [ ] **PENDING:** Add approval_history JSON field for audit trails
- [ ] **PENDING:** Add last_review_date timestamp

**Status:** 70% Complete  
**Action:** Update migration scripts to add missing fields

### 1.2 Service Request System (NEW)
- [ ] Create service_requests table
- [ ] Add request_id, user_id, service_name, description
- [ ] Add category_suggestion, justification fields
- [ ] Add status enum: submitted, under_review, approved, rejected
- [ ] Add priority enum: low, medium, high, critical
- [ ] Add assigned_to UUID for admin assignment
- [ ] Create service_request_workflow_logs table for audit trail
- [ ] Add action, performed_by, comments, timestamp fields

**Status:** 0% Complete  
**Priority:** CRITICAL  
**Timeline:** Week 1

### 1.3 User Management
- [x] Create users table with email and password
- [ ] **PENDING:** Add role enum: citizen, employee, admin, partner
- [ ] **PENDING:** Add user_profile table with phone, address, preferences
- [ ] **PENDING:** Add user_preferences table for multilingual settings
- [ ] **PENDING:** Add last_login, is_active flags
- [ ] **PENDING:** Add notification_preferences JSON field

**Status:** 25% Complete  
**Action:** Extend users table with role and profile fields

### 1.4 Feedback and Ratings System
- [ ] Create feedback table with service_id, user_id, rating
- [ ] Add comment, status (published, under_review, deleted)
- [ ] Add created_at, updated_at, helpful_count fields
- [ ] Create rating_aggregation table for dashboard statistics

**Status:** 0% Complete  
**Timeline:** Week 2

### 1.5 Notifications System
- [ ] Create notifications table
- [ ] Add user_id, title, message, type enum
- [ ] Add is_read, read_at, channel (email, in-app, sms)
- [ ] Add related_entity_id and related_entity_type for linking

**Status:** 0% Complete  
**Timeline:** Week 2

### 1.6 Chatbot and AI Data
- [ ] Create chatbot_conversations table (Cosmos DB)
- [ ] Add session_id, messages array, language, intent
- [ ] Add response_confidence, feedback_score fields
- [ ] Create training_data table for ML model improvement

**Status:** 0% Complete  
**Timeline:** Week 3

---

## Section 2: API Endpoints Implementation

### 2.1 Public Service Endpoints
- [ ] GET `/api/services` - List services with pagination and filters
- [ ] GET `/api/services/{id}` - Get full service details
- [ ] GET `/api/services/search` - Search services by keyword
- [ ] GET `/api/services/category/{category}` - Filter by category
- [ ] GET `/api/services/{id}/requirements` - Get service requirements
- [ ] GET `/api/services/{id}/process` - Get service process steps

**Status:** 0% Complete  
**Priority:** HIGH  
**Timeline:** Week 1-2

### 2.2 Service Request Endpoints (NEW)
- [ ] POST `/api/service-requests` - Submit new service request
- [ ] GET `/api/service-requests` - List requests (admin only)
- [ ] GET `/api/service-requests/{id}` - Get request details
- [ ] PUT `/api/service-requests/{id}` - Update request (assign, request info)
- [ ] POST `/api/service-requests/{id}/convert-to-service` - Convert to service
- [ ] GET `/api/service-requests/{id}/workflow-log` - Audit trail

**Status:** 0% Complete  
**Priority:** CRITICAL  
**Timeline:** Week 1

### 2.3 Application/Submission Endpoints
- [ ] POST `/api/applications` - Submit service application
- [ ] GET `/api/applications` - List user applications
- [ ] GET `/api/applications/{id}` - Get application status
- [ ] PUT `/api/applications/{id}` - Update application
- [ ] POST `/api/applications/{id}/documents` - Upload documents
- [ ] GET `/api/applications/{id}/tracking` - Track application progress

**Status:** 0% Complete  
**Timeline:** Week 2

### 2.4 Feedback Endpoints
- [ ] POST `/api/feedback` - Submit feedback on service
- [ ] GET `/api/services/{id}/feedback` - Get service reviews
- [ ] PUT `/api/feedback/{id}` - Update own feedback
- [ ] DELETE `/api/feedback/{id}` - Delete own feedback
- [ ] POST `/api/feedback/{id}/helpful` - Mark feedback as helpful

**Status:** 0% Complete  
**Timeline:** Week 2

### 2.5 Admin/Employee Endpoints
- [ ] GET `/api/admin/dashboard` - Admin dashboard metrics
- [ ] GET `/api/admin/users` - List users with pagination
- [ ] POST `/api/admin/services` - Create new service
- [ ] PUT `/api/admin/services/{id}` - Update service
- [ ] DELETE `/api/admin/services/{id}` - Archive service
- [ ] GET `/api/admin/analytics` - Service analytics and trends

**Status:** 0% Complete  
**Priority:** HIGH  
**Timeline:** Week 2-3

### 2.6 Chatbot Endpoints
- [ ] POST `/api/chatbot/query` - Submit chatbot query
- [ ] POST `/api/chatbot/session` - Create chat session
- [ ] GET `/api/chatbot/session/{id}` - Get conversation history
- [ ] POST `/api/chatbot/feedback` - Rate chatbot response

**Status:** 0% Complete  
**Timeline:** Week 3

---

## Section 3: Frontend Components and Pages

### 3.1 Citizen Portal
- [x] Create /citizen route with dashboard
- [ ] **PENDING:** Service Browse Page (/citizen/services/browse)
  - [ ] Service list with filters by category
  - [ ] Search functionality
  - [ ] Service detail modal or page
  - [ ] Requirements checklist
  - [ ] Apply button and form
- [ ] **PENDING:** Service Request Page (/citizen/services/request)
  - [ ] Service request form
  - [ ] Justification textarea
  - [ ] Category suggestion dropdown
  - [ ] Submit and confirmation
- [ ] **PENDING:** Applications Page (/citizen/applications)
  - [ ] List submitted applications
  - [ ] Status badges (pending, under_review, approved, rejected)
  - [ ] Application tracking timeline
  - [ ] Document upload capability
- [ ] **PENDING:** Chatbot Widget
  - [ ] Floating chatbot button
  - [ ] Chat interface
  - [ ] Message history
  - [ ] Language selector (Amharic, Oromo, English)
- [ ] **PENDING:** Notifications Page
  - [ ] List all notifications
  - [ ] Mark as read
  - [ ] Filter by type

**Status:** 15% Complete  
**Priority:** HIGH  
**Timeline:** Week 2-3

### 3.2 Government Employee Portal
- [x] Create /employee route with dashboard
- [ ] **PENDING:** Applications to Review
  - [ ] Queue of submitted applications
  - [ ] Status update buttons (approve, reject, request info)
  - [ ] Comments section
  - [ ] Document viewer
- [ ] **PENDING:** Service Management
  - [ ] List services managed by employee
  - [ ] Update service information
  - [ ] View service metrics
  - [ ] Manage requirements and process steps
- [ ] **PENDING:** Feedback Management
  - [ ] View citizen feedback
  - [ ] Respond to feedback
  - [ ] Mark feedback as addressed
- [ ] **PENDING:** Reports Page
  - [ ] Application statistics
  - [ ] Service performance metrics
  - [ ] Export reports (PDF/CSV)

**Status:** 10% Complete  
**Timeline:** Week 3

### 3.3 Admin Portal
- [x] Create /admin route with dashboard
- [ ] **PENDING:** User Management
  - [ ] List all users with roles
  - [ ] Create/edit/deactivate users
  - [ ] Assign employees to services
  - [ ] View user activity logs
- [ ] **PENDING:** Service Management
  - [ ] Full CRUD for services
  - [ ] Batch import services
  - [ ] Category management
  - [ ] Service visibility and archiving
- [ ] **PENDING:** Service Request Review
  - [ ] Queue of citizen requests
  - [ ] Priority assignment
  - [ ] Assign to employees for review
  - [ ] Approve/reject with feedback
  - [ ] Convert approved requests to services
- [ ] **PENDING:** Feedback Dashboard
  - [ ] Aggregated ratings by service
  - [ ] Trending issues
  - [ ] Response metrics
  - [ ] Feedback trends chart
- [ ] **PENDING:** System Analytics
  - [ ] User growth trends
  - [ ] Service utilization metrics
  - [ ] Application completion rates
  - [ ] Performance dashboards

**Status:** 10% Complete  
**Priority:** HIGH  
**Timeline:** Week 3-4

### 3.4 Partner Portal
- [x] Create /partner route with dashboard
- [ ] **PENDING:** Partnership Management
  - [ ] View partnerships
  - [ ] Partnership metrics
  - [ ] Co-branded services
- [ ] **PENDING:** Impact Reporting
  - [ ] Citizens served statistics
  - [ ] Service performance data
  - [ ] Export impact reports

**Status:** 10% Complete  
**Timeline:** Week 4

---

## Section 4: Authentication and Authorization

- [x] Basic authentication system in place
- [ ] **PENDING:** JWT implementation for API authentication
- [ ] **PENDING:** Role-based access control (RBAC)
  - [ ] Citizen: Can only access own applications
  - [ ] Employee: Can access assigned services
  - [ ] Admin: Can access all data
  - [ ] Partner: Can access partnership data
- [ ] **PENDING:** Protected routes middleware
- [ ] **PENDING:** Token refresh mechanism
- [ ] **PENDING:** Logout and session management
- [ ] **PENDING:** Password reset functionality
- [ ] **PENDING:** Email verification for new registrations

**Status:** 20% Complete  
**Priority:** HIGH  
**Timeline:** Week 1

---

## Section 5: Multilingual Support

According to specifications, must support:
- English (primary)
- Amharic
- Oromo

### 5.1 Backend Multilingual
- [ ] Create translations table in database
- [ ] Service names and descriptions in 3 languages
- [ ] API responses with language parameter
- [ ] Fallback to English if language not available

**Status:** 0% Complete  
**Timeline:** Week 2

### 5.2 Frontend Multilingual
- [ ] i18n setup with next-i18next or similar
- [ ] Language selector component
- [ ] All UI text in 3 languages
- [ ] RTL support for Amharic
- [ ] Language persistence in localStorage

**Status:** 0% Complete  
**Timeline:** Week 2

### 5.3 AI Chatbot Multilingual
- [ ] Implement language detection
- [ ] Translate queries to English for processing
- [ ] Translate responses back to original language
- [ ] Support Amharic-BERT for language understanding

**Status:** 0% Complete  
**Timeline:** Week 3

---

## Section 6: AI Chatbot Integration

### 6.1 Chatbot Setup
- [ ] Integrate with Azure OpenAI (GPT-4)
- [ ] Set up Amharic-BERT for language understanding
- [ ] Create knowledge base from service catalog
- [ ] Implement RAG (Retrieval-Augmented Generation)

**Status:** 0% Complete  
**Priority:** HIGH  
**Timeline:** Week 3

### 6.2 Chatbot Features
- [ ] Answer service-related questions
- [ ] Guide users through application process
- [ ] Provide multilingual responses
- [ ] Handle escalations to human support
- [ ] Log conversations for improvement

**Status:** 0% Complete  
**Timeline:** Week 3-4

---

## Section 7: Data and Analytics

### 7.1 Dashboard Metrics
- [ ] Total registered citizens
- [ ] Applications submitted this month
- [ ] Average application completion time
- [ ] Services by category utilization
- [ ] Most requested new services
- [ ] Citizen satisfaction scores
- [ ] System uptime percentage

**Status:** 0% Complete  
**Timeline:** Week 3

### 7.2 Service Metrics
- [ ] Applications per service
- [ ] Average processing time per service
- [ ] Approval rate per service
- [ ] Citizen ratings per service
- [ ] Trending services

**Status:** 0% Complete  
**Timeline:** Week 3

### 7.3 Feedback Analytics
- [ ] Average rating by service
- [ ] Most common feedback themes
- [ ] Response time to feedback
- [ ] Feedback resolution rate

**Status:** 0% Complete  
**Timeline:** Week 3

---

## Section 8: Service Catalog Data

### 8.1 Required Services (32 total across 12 categories)

**Administrative Services (5)**
- [x] Birth Certificate Application (defined)
- [x] National ID Application (defined)
- [x] Residency Confirmation (defined)
- [x] Police Clearance (defined)
- [x] Marriage Registration (defined)

**Business & Investment (4)**
- [x] Investment Permit Application (defined)
- [x] Commercial Registration (defined)
- [x] TIN Registration (defined)
- [x] License Renewal (defined)

**Licensing & Permits (3)**
- [ ] Tourism License (needs details)
- [ ] Driver's License Renewal (needs details)
- [ ] Medical License Renewal (needs details)

**Social Services (2)**
- [ ] Social Welfare Assistance (needs details)
- [ ] Family Benefits (needs details)

**Healthcare (2)**
- [ ] Health Insurance Registration (needs details)
- [ ] Vaccination Records (needs details)

**Education (2)**
- [ ] Student Enrollment (needs details)
- [ ] Certificate Verification (needs details)

**Employment & Labor (2)**
- [ ] Job Registration (needs details)
- [ ] Labor Dispute Resolution (needs details)

**Transportation (2)**
- [ ] Vehicle Registration (needs details)
- [ ] Driving Test Scheduling (needs details)

**Utilities (2)**
- [ ] Electricity Connection (needs details)
- [ ] Water Service Application (needs details)

**Agriculture (2)**
- [ ] Agricultural Subsidy (needs details)
- [ ] Land Lease Application (needs details)

**Legal & Judicial (3)**
- [ ] Case Filing (needs details)
- [ ] Document Notarization (needs details)
- [ ] Legal Aid Request (needs details)

**Tourism & Culture (3)**
- [ ] Cultural Heritage Permit (needs details)
- [ ] Tourism Site Access (needs details)
- [ ] Cultural Event Registration (needs details)

**Status:** 35% Complete  
**Action:** Complete service details for remaining 21 services

---

## Section 9: Infrastructure and Deployment

### 9.1 Database Setup
- [x] Neon PostgreSQL connected
- [x] Basic tables created
- [ ] **PENDING:** Complete schema with all required tables
- [ ] **PENDING:** Create indexes for performance
- [ ] **PENDING:** Set up automated backups
- [ ] **PENDING:** Configure connection pooling

**Status:** 40% Complete

### 9.2 Storage
- [ ] Configure Azure Blob Storage for document uploads
- [ ] Implement file size limits
- [ ] Set up virus scanning
- [ ] Configure retention policies

**Status:** 0% Complete  
**Timeline:** Week 2

### 9.3 Monitoring and Logging
- [ ] Set up Application Insights
- [ ] Configure logging for all services
- [ ] Create alerts for critical errors
- [ ] Set up performance monitoring

**Status:** 0% Complete  
**Timeline:** Week 3

### 9.4 CI/CD Pipeline
- [ ] GitHub Actions workflows
- [ ] Automated testing
- [ ] Build and deploy automation
- [ ] Staging environment
- [ ] Production deployment

**Status:** 0% Complete  
**Timeline:** Week 4

---

## Section 10: Security and Compliance

- [ ] **PENDING:** HTTPS everywhere
- [ ] **PENDING:** Data encryption at rest
- [ ] **PENDING:** Secure password hashing (bcrypt)
- [ ] **PENDING:** SQL injection prevention (parameterized queries)
- [ ] **PENDING:** XSS protection
- [ ] **PENDING:** CSRF tokens
- [ ] **PENDING:** Rate limiting on APIs
- [ ] **PENDING:** Input validation and sanitization
- [ ] **PENDING:** Session timeout
- [ ] **PENDING:** Audit logging for sensitive operations
- [ ] **PENDING:** GDPR compliance for data handling
- [ ] **PENDING:** Privacy policy and terms of service

**Status:** 10% Complete  
**Priority:** CRITICAL

---

## Section 11: Testing

### 11.1 Unit Tests
- [ ] Authentication tests
- [ ] API endpoint tests
- [ ] Service logic tests
- [ ] Database query tests

**Status:** 0% Complete  
**Coverage Target:** > 80%

### 11.2 Integration Tests
- [ ] End-to-end application workflow
- [ ] API integration tests
- [ ] Database integration tests
- [ ] External service integration (if any)

**Status:** 0% Complete

### 11.3 User Acceptance Testing (UAT)
- [ ] Citizen workflow testing
- [ ] Employee workflow testing
- [ ] Admin workflow testing
- [ ] Accessibility testing
- [ ] Performance testing

**Status:** 0% Complete  
**Timeline:** Week 4

---

## Section 12: Documentation

- [x] Database schema documentation
- [x] API specifications created
- [ ] **PENDING:** Complete API documentation with examples
- [ ] **PENDING:** Postman collection for API testing
- [ ] **PENDING:** Frontend component documentation
- [ ] **PENDING:** Developer setup guide
- [ ] **PENDING:** Deployment guide
- [ ] **PENDING:** User manuals for each portal
- [ ] **PENDING:** Admin guide
- [ ] **PENDING:** Changelog

**Status:** 20% Complete

---

## Summary by Priority

### CRITICAL (Must Complete for MVP)
1. Fix CSS error - **DONE**
2. Service Request System database and API
3. User role and authorization system
4. Core service catalog population (20+ services)
5. Citizen portal service browsing and application
6. Employee application review workflow
7. Admin service management
8. Basic security measures

### HIGH (Should have for MVP)
1. Multilingual support (3 languages)
2. Feedback and ratings system
3. Notifications system
4. Analytics dashboard
5. Chatbot integration
6. Document upload capability
7. Complete API documentation

### MEDIUM (Nice to have for MVP)
1. Advanced analytics
2. Reporting features
3. Partner portal
4. Advanced search filters
5. AI-powered recommendations

### LOW (Post-MVP)
1. Mobile app
2. Advanced integrations
3. Blockchain for document verification
4. SMS notifications
5. Video tutorials

---

## Progress Tracking

**Week 1 Target:**
- [ ] Fix all build errors - **DONE**
- [ ] Complete service request database schema
- [ ] Implement service request APIs
- [ ] Add role-based access control
- [ ] Create 10+ complete service definitions

**Week 2 Target:**
- [ ] Complete citizen portal components
- [ ] Implement feedback system
- [ ] Add multilingual support
- [ ] Set up document upload
- [ ] Complete remaining service definitions

**Week 3 Target:**
- [ ] Employee portal functionality
- [ ] Chatbot integration
- [ ] Admin dashboard
- [ ] Analytics setup
- [ ] UAT preparation

**Week 4 Target:**
- [ ] Full UAT cycle
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Documentation completion
- [ ] Deployment preparation

---

## Sign-off

**Lead Developer:** _______________________________  
**Product Owner:** _______________________________  
**QA Lead:** _______________________________  
**Date:** _______________________________
