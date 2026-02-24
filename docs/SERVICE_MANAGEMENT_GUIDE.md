# Service Management Complete Guide

This guide covers the complete service management functionality in the Ethiopian Navigator MVP.

## Table of Contents
1. [Overview](#overview)
2. [Service Catalog Management](#service-catalog-management)
3. [Service Discovery for Citizens](#service-discovery-for-citizens)
4. [Service Request Workflow](#service-request-workflow)
5. [API Reference](#api-reference)

## Overview

The Service Management module provides complete CRUD operations for government services, advanced search and filtering, category-based browsing, service request workflow, and comprehensive analytics and reporting.

## Service Catalog Management

### Admin Service Management Dashboard

**Location:** `/admin/services`

**Features:**
- Create new services with detailed information
- Edit existing services with real-time statistics
- Archive/unarchive services
- View service analytics (applications, ratings, feedback)
- Search and filter services
- Bulk operations

**Service Fields:**
- **service_id** - Unique identifier (auto-generated)
- **name** - Service name
- **category** - Service category from predefined list
- **description** - Detailed description
- **responsible_agency** - Government agency responsible
- **estimated_processing_time** - Expected processing duration
- **service_fee** - Cost in ETB
- **requirements** - Array of required documents
- **is_archived** - Soft delete flag

### Service Categories

The system supports 12 predefined categories:
1. Identification Documents
2. Business & Commerce
3. Legal & Judicial
4. Property & Land
5. Health & Social Services
6. Transportation
7. Education
8. Utilities
9. Agriculture
10. Social Welfare
11. Licensing
12. Permits & Approvals

## Service Discovery for Citizens

### Browse Services Page

**Location:** `/citizen/services/browse`

**Features:**
- Category-based tabbed navigation
- Advanced search with multiple filters
- Grid and list view modes
- Filter by:
  - Service name/description (text search)
  - Category
  - Price range (min/max fee)
- Apply directly from browse interface

### Quick Actions in Citizen Portal

**Location:** `/citizen`

Citizens have quick access cards to:
- **Browse All Services** - Opens service catalog
- **Request New Service** - Submit service request

## Service Request Workflow

### Citizen Service Request

**Location:** `/citizen/services/request`

**Process:**
1. Citizen fills out request form:
   - Service name
   - Category suggestion
   - Service description
   - Justification for need
2. System creates service_request with status "submitted"
3. Admin reviews request in admin dashboard
4. Admin can:
   - Approve and create new service
   - Reject with reason
   - Update priority (low, medium, high)

### Admin Review Process

**API Endpoints:**
\`\`\`
GET /api/service-requests - List all requests (admin only)
GET /api/service-requests/:id - Get request details
PATCH /api/service-requests/:id - Update request status/priority
POST /api/service-requests/:id/approve - Approve and create service
\`\`\`

**Workflow States:**
- **submitted** - Initial state
- **under_review** - Admin is reviewing
- **approved** - Approved and service created
- **rejected** - Request denied

## API Reference

### Service Endpoints

\`\`\`
GET    /api/services - List services (public)
  Query params:
    - category: Filter by category
    - minFee: Minimum fee
    - maxFee: Maximum fee
    - search: Text search

GET    /api/services/categories - List all categories

POST   /api/services/search - Advanced search
  Body:
    - query: Search text
    - category: Category filter
    - minFee, maxFee: Price range
    - agency: Agency name
    - sortBy: Sort column

GET    /api/services/:id - Get service details

GET    /api/services/:id/stats - Get service statistics (admin/employee)
  Returns:
    - applications: Application count by status
    - avgRating: Average rating
    - totalFeedback: Feedback count

POST   /api/services - Create service (admin only)
PATCH  /api/services/:id - Update service (admin only)
DELETE /api/services/:id - Archive service (admin only)

POST   /api/services/bulk - Bulk operations (admin only)
  Body:
    - action: "archive" | "unarchive"
    - serviceIds: Array of service IDs
\`\`\`

### Application Endpoints

\`\`\`
POST   /api/applications - Submit application
GET    /api/applications - Get user's applications
GET    /api/applications/:id - Get application details
GET    /api/applications/all - List all applications (admin/employee)
  Query params:
    - status: Filter by status
    - service_id: Filter by service
    - startDate, endDate: Date range
    - page, limit: Pagination

PATCH  /api/applications/:id/status - Update status (admin/employee)
\`\`\`

### Service Request Endpoints

\`\`\`
POST   /api/service-requests - Submit request (citizen)
GET    /api/service-requests - List requests (admin/employee)
  Query params:
    - status: Filter by status

GET    /api/service-requests/:id - Get request details
PATCH  /api/service-requests/:id - Update request
POST   /api/service-requests/:id/approve - Approve and create service (admin)
\`\`\`

## Database Schema

### Services Table
\`\`\`sql
CREATE TABLE services (
  service_id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  responsible_agency TEXT,
  estimated_processing_time TEXT,
  service_fee NUMERIC,
  requirements TEXT[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_services_category ON services(category);
\`\`\`

### Applications Table
\`\`\`sql
CREATE TABLE applications (
  application_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_id TEXT NOT NULL,
  status TEXT DEFAULT 'submitted',
  submitted_data JSONB,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
\`\`\`

### Service Requests Table
\`\`\`sql
CREATE TABLE service_requests (
  request_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  category_suggestion TEXT,
  justification TEXT,
  status TEXT DEFAULT 'submitted',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_service_requests_status ON service_requests(status);
\`\`\`

## Best Practices

1. **Service Creation:**
   - Provide clear, detailed descriptions
   - Specify all required documents
   - Set realistic processing times
   - Use appropriate categories

2. **Service Requests:**
   - Review requests within 5 business days
   - Provide clear reasons for rejections
   - Set appropriate priorities

3. **Search & Discovery:**
   - Use descriptive service names
   - Keep descriptions concise but informative
   - Organize services into appropriate categories
   - Update processing times based on actual performance

4. **Analytics:**
   - Monitor service usage via statistics
   - Track feedback and ratings
   - Identify high-demand services
   - Optimize based on citizen needs

## Troubleshooting

**Service not appearing in search:**
- Check if service is archived (is_archived = true)
- Verify category is correct
- Ensure service creation was successful

**Service request not visible:**
- Confirm authentication (must be admin/employee)
- Check request status filter
- Verify database connection

**Application submission failing:**
- Validate service_id exists
- Check authentication token
- Verify all required fields present

---

For additional support, refer to the main documentation or contact the development team.
