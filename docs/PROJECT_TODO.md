# Ethiopian Navigator - Complete Project Analysis & TODO List

## PROJECT STATUS OVERVIEW

### What's Working
- Database: 12 tables deployed to Neon with 4 users, 8 categories, 8 services, 5 FAQs, 3 articles, 4 notifications
- Frontend: 17 pages built (landing, auth, citizen, employee, admin, partner portals)
- Package.json: Cleaned of backend-only packages - installation should work
- CSS: Fixed hsl/oklch color mismatch
- Auth: Demo token validation fixed in lib/auth.ts

### What's Broken (Critical Blockers)
1. NO API ROUTES - Frontend pages call `apiClient.get("/services")` etc. but there are ZERO Next.js API routes (`app/api/**/route.ts`). All data fetches fail silently.
2. LOGIN uses mock credentials from `lib/mock-data.ts` instead of real database authentication
3. ALL data pages (services browse, notifications, settings, applications) call a non-existent Express backend at `http://localhost:5000/api`
4. Backend folder contains a separate Express.js server that cannot run in this Next.js environment

---

## DETAILED TODO LIST (Priority Order)

### PHASE 1: CRITICAL - Connect Frontend to Database (Must Fix First)

#### 1.1 Create Database Connection Utility
- File: `lib/db.ts`
- Use `@neondatabase/serverless` with the existing `DATABASE_URL` env var
- Create a reusable `sql` tagged template for queries

#### 1.2 Create Next.js API Routes for Authentication
- `app/api/auth/login/route.ts` - Validate email/password against `users` table using bcrypt, return JWT token
- `app/api/auth/register/route.ts` - Create new user with hashed password
- `app/api/auth/me/route.ts` - Get current user from JWT token
- Update `lib/auth.ts` to point to `/api/auth` instead of `http://localhost:5000/api`

#### 1.3 Create Next.js API Routes for Services
- `app/api/services/route.ts` - GET: List services with search/filter from `services` table
- `app/api/services/categories/route.ts` - GET: List categories from `service_categories` table
- `app/api/services/[id]/route.ts` - GET: Single service details

#### 1.4 Create Next.js API Routes for Service Requests
- `app/api/service-requests/route.ts` - GET: User's requests, POST: Submit new request
- `app/api/service-requests/[id]/route.ts` - GET: Single request, PATCH: Update status

#### 1.5 Create Next.js API Routes for Notifications
- `app/api/notifications/route.ts` - GET: User notifications, PATCH: Mark as read
- `app/api/notifications/preferences/route.ts` - GET/PUT: Notification preferences

#### 1.6 Create Next.js API Routes for Knowledge/FAQ
- `app/api/knowledge/route.ts` - GET: Search articles
- `app/api/faqs/route.ts` - GET: List FAQs by category

#### 1.7 Create Next.js API Routes for Admin
- `app/api/admin/users/route.ts` - GET: List users, PATCH: Update user status/role
- `app/api/admin/services/route.ts` - POST: Create service, PATCH: Update service
- `app/api/admin/analytics/route.ts` - GET: Dashboard statistics
- `app/api/admin/feedback/route.ts` - GET: Feedback list, PATCH: Respond to feedback

#### 1.8 Create Next.js API Routes for User Profile
- `app/api/profile/route.ts` - GET/PUT: User profile management
- `app/api/profile/password/route.ts` - PUT: Change password

#### 1.9 Update API Client
- Update `lib/api-client.ts` to use relative `/api` paths instead of external backend URL
- Update `lib/auth.ts` AUTH_API_BASE to `/api`

### PHASE 2: Fix Login to Use Real Database Auth

#### 2.1 Update Login Page
- Replace mock credential checking with real API call to `/api/auth/login`
- Handle real JWT tokens from the server
- Show proper error messages from the API

#### 2.2 Update Register Page
- Connect registration form to `/api/auth/register`
- Add proper validation (email format, password strength)

#### 2.3 Update Auth Provider
- Fetch user profile from `/api/auth/me` on mount instead of localStorage only
- Handle token refresh/expiry properly

### PHASE 3: Connect All Frontend Pages to Real Data

#### 3.1 Citizen Portal
- `app/citizen/page.tsx` - Load real stats (my requests count, notifications count) from API
- `app/citizen/services/browse/page.tsx` - Already calls API, will work once routes exist
- `app/citizen/services/request/page.tsx` - Connect form submission to real API
- `app/citizen/applications/page.tsx` - Load real service requests from API
- `app/citizen/chatbot/page.tsx` - Connect to AI chatbot or knowledge base API

#### 3.2 Employee Portal
- `app/employee/page.tsx` - Load assigned requests, pending reviews from API
- Add request review/approval workflow pages

#### 3.3 Admin Portal
- `app/admin/page.tsx` - Load real dashboard statistics from API
- `app/admin/users/page.tsx` - Load users from database, enable CRUD operations
- `app/admin/services/page.tsx` - Load services from database, enable management
- `app/admin/analytics/page.tsx` - Load real analytics from audit_log and metrics
- `app/admin/feedback/page.tsx` - Load feedback from database

#### 3.4 Partner Portal
- `app/partner/page.tsx` - Load partner-specific data from API

#### 3.5 Settings Page
- `app/settings/page.tsx` - Connect profile form to `/api/profile`
- Connect password change to `/api/profile/password`
- Connect notification preferences to `/api/notifications/preferences`

#### 3.6 Notifications Page
- `app/notifications/page.tsx` - Load real notifications from `/api/notifications`
- Connect mark-as-read to real API

### PHASE 4: Enhanced Features

#### 4.1 Feedback System
- Create feedback submission form for citizens after service completion
- Create admin feedback management interface
- `app/api/feedback/route.ts` - POST: Submit feedback, GET: List feedback

#### 4.2 Audit Logging
- Add audit trail logging to all API routes (create, update, delete operations)
- Create admin audit log viewer page

#### 4.3 Search & Knowledge Base UI
- Create knowledge base browse page for citizens
- Create FAQ page with category filtering
- Connect chatbot to knowledge articles for intelligent responses

#### 4.4 Multi-Language Support
- Connect `lib/i18n.ts` and `lib/language.ts` to actual UI translations
- Load translated content (name_am, name_or) based on user language preference
- Add language switcher to all pages

#### 4.5 File Upload for Documents
- Add document upload capability to service request forms
- Store document references in service_requests.documents JSONB field

### PHASE 5: Security Hardening

#### 5.1 Authentication Security
- Implement proper JWT signing with secret key (env var)
- Add token expiry and refresh mechanism
- Implement account lockout after failed attempts (use `failed_login_attempts` column)
- Log all login attempts to `login_history` table

#### 5.2 Authorization Middleware
- Create middleware to verify JWT on all `/api/*` routes
- Implement role-based access control (admin-only routes, employee-only routes)
- Validate user role matches required access level

#### 5.3 Input Validation
- Add zod schema validation to all API route inputs
- Sanitize all user inputs before database queries
- Rate limiting on auth endpoints

### PHASE 6: Testing & Polish

#### 6.1 Error Handling
- Add proper error states to all pages (not just silent console.error)
- Add loading skeletons for better UX
- Add empty state messages when no data exists

#### 6.2 Responsive Design Verification
- Test all 17 pages on mobile, tablet, desktop
- Fix any layout issues

#### 6.3 Accessibility
- Verify ARIA labels on all interactive elements
- Test keyboard navigation through all forms
- Verify screen reader compatibility

---

## DATABASE STATUS (Verified)

| Table | Rows | Status |
|-------|------|--------|
| users | 4 | Seeded with demo users |
| user_sessions | 0 | Ready for auth |
| login_history | 0 | Ready for auth |
| service_categories | 8 | Seeded with categories |
| services | 8 | Seeded with services |
| service_requests | 0 | Ready for applications |
| notifications | 4 | Seeded with welcome notifications |
| notification_preferences | 0 | Ready for user prefs |
| knowledge_articles | 3 | Seeded with articles |
| faqs | 5 | Seeded with FAQs |
| feedback | 0 | Ready for feedback |
| audit_log | 0 | Ready for logging |

## DEMO CREDENTIALS (Database)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ethionavigator.gov.et | Demo@123 |
| Employee | employee@ethionavigator.gov.et | Demo@123 |
| Citizen | citizen@ethionavigator.gov.et | Demo@123 |
| Partner | partner@ethionavigator.gov.et | Demo@123 |

## FILES TO CLEAN UP

- `backend/` folder - Entire Express.js backend that cannot run in this env. Keep as reference but it's not functional here.
- `lib/mock-data.ts` - Replace with real API calls (keep as fallback until Phase 2 complete)
- Duplicate service SQL scripts in `/scripts/` (001, 002, 003, 004, 005) - consolidate
