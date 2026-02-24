# Ethiopian Navigator MVP: Service Catalogue Blueprint (Enhanced)

**Version:** 2.0  
**Status:** Enhanced Draft  
**Last Updated:** September 13, 2025  
**Author:** Technology Development Team

---

## 1.0 Introduction

### 1.1 Purpose
This document defines the Ethiopian Navigator MVP **Service Catalogue** and the **user-driven service request enhancement**. It serves product, engineering, and government stakeholders by specifying data models, taxonomy, APIs, workflows, and integrations.

### 1.2 Scope
- 32 government services across 12 categories (English-language MVP)
- Core service data model and related entities
- User-driven service request system (submission, review, conversion to service)
- Public and administrative APIs
- Integration patterns (agency systems, payments)
- Implementation, versioning, and performance guidelines

### 1.3 Relationship to Other Documents
- **PRD:** Source of functional requirements for services and requests
- **Technical Architecture:** Alignment with system components and data stores
- **API Documentation:** Endpoints and contracts for catalogue operations

---

## 2.0 Data Model

### 2.1 Core Service Entity

| Field | Type | Required | Description | Example |
|---|---|:---:|---|---|
| service_id | UUID | ✓ | Unique service identifier | `srv_001` |
| category | String | ✓ | Service category | `Administrative Services` |
| name | String | ✓ | Service name (English) | `Birth Certificate Application` |
| description | String | ✓ | Short description | `Apply for a birth certificate...` |
| responsible_agency | String | ✓ | Owning agency | `Vital Events Registration Agency` |
| estimated_processing_time | String |  | Expected duration | `3–5 business days` |
| service_fee | Number |  | Fee in ETB (if applicable) | `50` |
| is_archived | Boolean | ✓ | Active flag | `false` |
| created_at | Timestamp | ✓ | Creation datetime (UTC) | `2025-09-01T00:00:00Z` |
| updated_at | Timestamp | ✓ | Last update (UTC) | `2025-09-10T12:30:00Z` |

### 2.2 Service Requirements Model

| Field | Type | Required | Description |
|---|---|:---:|---|
| requirement_id | UUID | ✓ | Unique requirement identifier |
| service_id | UUID | ✓ | Parent service reference |
| type | String | ✓ | `document`, `eligibility`, or `prerequisite` |
| title | String | ✓ | Requirement title |
| description | String |  | Detail/notes |
| is_mandatory | Boolean | ✓ | Mandatory flag |
| validation_rules | Object |  | File rules (for documents) |
| order_index | Number | ✓ | Display ordering |

### 2.3 Service Process Model

| Field | Type | Required | Description |
|---|---|:---:|---|
| step_id | UUID | ✓ | Unique step identifier |
| service_id | UUID | ✓ | Parent service reference |
| step_number | Number | ✓ | Sequence number |
| title | String | ✓ | Step title |
| description | String |  | Step instructions |
| estimated_time | String |  | Time estimate |
| is_interactive | Boolean | ✓ | User interaction required? |
| interaction_type | String |  | `form`, `upload`, `payment`, `review` |

### 2.4 **New:** Service Request Entity (Enhancement)

| Field | Type | Required | Description | Example |
|---|---|:---:|---|---|
| request_id | UUID | ✓ | Unique request identifier | `req_001` |
| user_id | UUID | ✓ | Requesting user | `usr_123` |
| service_name | String | ✓ | Proposed service name | `Agricultural Subsidy for Small Farmers` |
| service_description | String | ✓ | Description | `Financial support for small-scale farmers...` |
| category_suggestion | String | ✓ | Suggested category | `Agriculture` |
| justification | String | ✓ | Reason/impact | `Small farmers cannot afford inputs` |
| status | String | ✓ | `submitted`, `under_review`, `approved`, `rejected` | `submitted` |
| priority | String | ✓ | `low`, `medium`, `high`, `critical` | `high` |
| assigned_to | UUID |  | Admin/agency assignee | `admin_456` |
| created_at | Timestamp | ✓ | Created (UTC) | `2025-09-10T10:30:00Z` |
| updated_at | Timestamp | ✓ | Updated (UTC) | `2025-09-10T14:45:00Z` |

### 2.5 **New:** Service Request Workflow Log

| Field | Type | Required | Description |
|---|---|:---:|---|
| workflow_id | UUID | ✓ | Unique workflow action |
| request_id | UUID | ✓ | Reference to request |
| action | String | ✓ | `submitted`, `assigned`, `info_requested`, `approved`, `rejected` |
| performed_by | UUID | ✓ | Actor user ID |
| comments | String |  | Notes |
| timestamp | Timestamp | ✓ | Action time (UTC) |

### 2.6 **Enhanced:** Service Entity (Additional Fields)

| Field | Type | Required | Description |
|---|---|:---:|---|
| source_request_id | UUID |  | Link to originating request |
| approval_history | Array |  | List of approval actions |
| last_review_date | Timestamp |  | Last business review |

---

## 3.0 Service Taxonomy

### 3.1 Category Hierarchy (12)
1. **Administrative Services** (5)
2. **Business and Investment** (4)
3. **Licensing and Permits** (3)
4. **Social Services** (2)
5. **Healthcare** (2)
6. **Education** (2)
7. **Employment and Labor** (2)
8. **Transportation** (2)
9. **Utilities** (2)
10. **Agriculture** (2)
11. **Legal and Judicial** (3)
12. **Tourism and Culture** (3)

### 3.2 Service Metadata Tags

| Tag | Values | Purpose |
|---|---|---|
| complexity | Simple, Moderate, Complex | Indicates application difficulty |
| digital_maturity | Full Online, Partial Online, In-Person Required | Tech readiness level |
| target_audience | Individual, Business, Both | Primary users |
| frequency_of_use | Daily, Weekly, Monthly, Yearly | Usage pattern |

---

## 4.0 Service Catalogue (Samples)

### 4.1 Administrative Services
**Birth Certificate Application**  
- **Agency:** Vital Events Registration Agency  
- **Processing Time:** 3–5 business days  
- **Fee:** ETB 50  
- **Requirements:** Hospital Birth Record (Doc, Mandatory); Parent Identification (Doc, Mandatory)  
- **Steps:** Form → Upload Documents → Review & Submit → Track Status

**National ID Application**  
- **Agency:** National ID Program  
- **Processing Time:** 10–15 business days  
- **Fee:** ETB 100  
- **Requirements:** Age ≥ 18 (Eligibility); Birth Certificate (Doc)  
- **Steps:** Online Registration → Biometric Appointment → ID Delivery

### 4.2 Business & Investment
**Investment Permit Application**  
- **Agency:** Ethiopian Investment Commission (EIC)  
- **Processing Time:** 7–10 business days  
- **Fee:** Varies by capital  
- **Requirements:** Project Proposal (Doc); Min Capital (Eligibility)  
- **Steps:** Account → Form → Upload → Payment → Submit → Receive Permit

---

## 5.0 Workflows (Mermaid Diagrams)

### 5.1 Service Request Lifecycle
\`\`\`mermaid
flowchart TD
  A[User Submits Request] --> B[Status: submitted]
  B --> C[Auto-Assign Priority]
  C --> D[Notify Admin/Agency]
  D --> E[Status: under_review]
  E --> F{Assessment}
  F -- Needs Info --> G[Request Additional Information]
  G --> H[User Provides Info]
  H --> E
  F -- Approve --> I[Create Service Draft]
  I --> J[Status: approved]
  J --> K[Publish to Catalogue & Index]
  J --> L[Add KB Entry & AI Training Data]
  J --> M[Notify User]
  F -- Reject --> N[Status: rejected]
  N --> O[Notify User with Reason]
\`\`\`

### 5.2 Automatic Priority Assignment
\`\`\`mermaid
flowchart TD
  S[New Service Request] --> C{Contains words "urgent"/"critical"?}
  C -- Yes --> P1[Priority: critical <24h]
  C -- No --> H{Health/Safety/Security related?}
  H -- Yes --> P2[Priority: high <48h]
  H -- No --> M{Many similar requests in 30d?}
  M -- Yes --> P3[Priority: medium <72h]
  M -- No --> P4[Priority: low <5 business days]
\`\`\`

### 5.3 Integration with Catalogue & Knowledge Base
\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant ADM as Admin Reviewer
  participant SVC as Service Catalogue Service
  participant KB as Knowledge Base
  participant AI as AI Training Pipeline
  participant IDX as Search Index

  U->>ADM: Request submitted & assigned
  ADM->>SVC: Approve & create draft service
  SVC->>IDX: Index service (limited visibility)
  SVC->>KB: Create KB entry (draft)
  ADM->>SVC: Finalize & publish service
  SVC->>IDX: Update index (public)
  KB-->>SVC: Publish KB entry
  SVC->>AI: Generate Q&A training data
  AI-->>SVC: Model artifacts updated
  SVC-->>U: Notification of published service
\`\`\`

### 5.4 Admin Dashboard Overview
\`\`\`mermaid
flowchart LR
  A[Dashboard Home] --> B[Summary Metrics]
  A --> C[Action Required]
  A --> D[Assignment Queue]
  A --> E[Trend Analysis]
  B --> B1[Total Requests]
  B --> B2[By Status]
  B --> B3[By Priority]
  C --> C1[Needs Info]
  C --> C2[SLA Breaches]
  D --> D1[Assigned to Me]
  D --> D2[Unassigned]
  E --> E1[Common Types]
  E --> E2[Seasonal Patterns]
\`\`\`

---

## 6.0 API Specifications

### 6.1 Public Endpoints
- **GET `/api/services`** — Paginated service list with filters  
  **Params:** `category` (opt), `search` (opt), `page` (opt), `limit` (opt)  
  **Response:** Array of service objects (basic metadata)
- **GET `/api/services/{id}`** — Full service details (requirements, process)

### 6.2 Administrative Endpoints
- **POST `/api/admin/services`** — Create a new service (Admin; JWT)  
  **Body:** Full service object  
  **Response:** Created service
- **PUT `/api/admin/services/{id}`** — Update existing service (Admin; JWT)  
  **Body:** Partial updates  
  **Response:** Updated service

### 6.3 Service Request Endpoints (Enhancement)
- **POST `/api/service-requests`** — Submit new request (JWT)  
  **Response:** Created request (`status=submitted`)
- **GET `/api/service-requests`** — List/filter requests (Admin/Gov; JWT)  
  **Params:** `status`, `priority`, `assigned_to`
- **PUT `/api/service-requests/{id}`** — Update status/assignment (Admin/Gov; JWT)
- **POST `/api/service-requests/{id}/convert-to-service`** — Convert approved request to service (Admin; JWT)

### 6.4 API Flow Diagrams

#### 6.4.1 Public Catalogue Query (`GET /api/services`)
\`\`\`mermaid
sequenceDiagram
  participant U as User (Web/Mobile)
  participant API as API Gateway
  participant SVC as Services Service
  participant IDX as Search Index (Elasticsearch)
  participant DB as PostgreSQL

  U->>API: GET /api/services?search=&category=
  API->>SVC: Validate & route request
  SVC->>IDX: Query index by search & filters
  IDX-->>SVC: Return matching IDs
  SVC->>DB: Fetch service metadata by IDs
  DB-->>SVC: Records
  SVC-->>API: 200 OK (paginated list)
  API-->>U: JSON response
\`\`\`

#### 6.4.2 Service Details (`GET /api/services/{id}`)
\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant API as API Gateway
  participant SVC as Services Service
  participant DB as PostgreSQL

  U->>API: GET /api/services/{id}
  API->>SVC: Route request
  SVC->>DB: SELECT service, requirements, steps
  DB-->>SVC: Full service object
  SVC-->>API: 200 OK (service details)
  API-->>U: JSON response
\`\`\`

#### 6.4.3 Admin Create Service (`POST /api/admin/services`)
\`\`\`mermaid
sequenceDiagram
  participant A as Admin (Portal)
  participant API as API Gateway
  participant AUTH as Auth Service (JWT)
  participant SVC as Services Service
  participant DB as PostgreSQL
  participant IDX as Search Index
  participant C as Cache (Redis)

  A->>API: POST /api/admin/services {service}
  API->>AUTH: Validate JWT (admin role)
  AUTH-->>API: Token valid
  API->>SVC: Create service
  SVC->>DB: INSERT service
  DB-->>SVC: Service ID
  SVC->>IDX: Index service
  SVC->>C: Warm cache
  SVC-->>API: 201 Created (service object)
  API-->>A: Response
\`\`\`

#### 6.4.4 Service Request Submission (`POST /api/service-requests`)
\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant API as API Gateway
  participant AUTH as Auth Service
  participant RQ as Service Request Service
  participant Q as Notification/Queue
  participant ADM as Admin Portal

  U->>API: POST /api/service-requests {payload}
  API->>AUTH: Validate JWT
  AUTH-->>API: OK
  API->>RQ: Create request (status=submitted)
  RQ->>Q: Publish event request_submitted
  RQ-->>API: 201 Created (ref)
  API-->>U: Ack + reference
  Q-->>ADM: Notify admin team (email/in-app)
\`\`\`

#### 6.4.5 Convert Request to Service (`POST /api/service-requests/{id}/convert-to-service`)
\`\`\`mermaid
sequenceDiagram
  participant ADM as Admin
  participant API as API Gateway
  participant AUTH as Auth Service
  participant RQ as Service Request Service
  participant SVC as Services Service
  participant DB as PostgreSQL
  participant IDX as Search Index

  ADM->>API: POST /api/service-requests/{id}/convert-to-service
  API->>AUTH: Validate JWT (admin)
  AUTH-->>API: OK
  API->>RQ: Validate status approved
  RQ-->>API: OK
  API->>SVC: Create draft service from request
  SVC->>DB: INSERT service (draft)
  DB-->>SVC: Service ID
  SVC->>IDX: Index (limited visibility)
  SVC-->>API: 201 Created (service)
  API-->>ADM: New service reference
\`\`\`

---

## 7.0 Integration Specifications

### 7.1 Agency System Integration Pattern
\`\`\`json
{
  "integration": {
    "agency": "Agency Name",
    "api_endpoint": "https://api.agency.gov.et/service",
    "authentication": "OAuth2.0",
    "data_mapping": {
      "field_mappings": {
        "local_field": "agency_field"
      }
    },
    "supported_operations": ["submit", "status_check", "cancel"]
  }
}
\`\`\`

### 7.2 Payment Integration Pattern
\`\`\`json
{
  "payment": {
    "provider": "Ethiopian Payment System",
    "supported_methods": ["bank_transfer", "mobile_money", "credit_card"],
    "fee_structure": {
      "base_fee": 50,
      "processing_fee": 5
    }
  }
}
\`\`\`

---

## 8.0 Implementation Guidelines

### 8.1 Data Population
1. **Initial Load:** Import services from JSON
2. **Validation:** Enforce schema compliance
3. **Indexing:** Create search indexes (name, description, category)

### 8.2 Version Management
- **Initial Version:** 1.0.0
- **Change Control:** Increment version on modification
- **Audit:** Log all changes to service definitions

### 8.3 Performance Considerations
- **Caching:** Redis for frequently accessed services
- **Pagination:** Cursor-based pagination
- **Search:** Elasticsearch-backed discovery

---

## 9.0 Appendix

### 9.1 Complete Service List (Excerpt)
- Administrative: Birth Certificate, National ID, Residency Confirmation, Police Clearance, Marriage Registration
- Business & Investment: Investment Permit, Commercial Registration, TIN, License Renewal
- Licensing & Permits: Tourism License, Driver's License Renewal, Medical License Renewal

### 9.2 Revision History

| Version | Date | Author | Changes |
|---:|---|---|---|
| 1.0 | 2025-09-09 | Technology Team | Initial service catalogue blueprint |
| 2.0 | 2025-09-13 | Technology Team | Added user-driven service request system, workflows, and API flow diagrams |

### 9.3 Approvals
- **Product Manager:** ___________________________
- **Lead Developer:** ____________________________
- **Head of Operations:** _________________________
