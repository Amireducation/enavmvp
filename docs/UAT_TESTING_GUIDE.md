# Ethiopian Navigator MVP - UAT Testing Guide

## Overview
This document provides comprehensive testing procedures for the Ethiopian Navigator platform. All features are tested across 4 user roles: Citizen, Employee, Admin, and Partner.

## Pre-Testing Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] All dependencies installed: `npm install`
- [ ] `.env.local` configured with API endpoints
- [ ] Database migrations executed: `npm run db:init`
- [ ] Backend server running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:3000`

### Test Account Credentials

#### Citizen Account
- Email: `citizen@ethiopia.gov.et`
- Password: `TestPass@123`
- Role: Citizen

#### Employee Account
- Email: `employee@ethiopia.gov.et`
- Password: `TestPass@123`
- Role: Employee

#### Admin Account
- Email: `admin@ethiopia.gov.et`
- Password: `TestPass@123`
- Role: Admin

#### Partner Account
- Email: `partner@ethiopia.gov.et`
- Password: `TestPass@123`
- Role: Partner

## Module 1: Authentication & User Management

### Test 1.1: User Registration
1. Navigate to `/auth/register`
2. Fill in form with:
   - Full Name: "John Test"
   - Email: "test.user@example.com"
   - Phone: "+251911234567"
   - Role: "Citizen"
   - Password: "SecurePass@123"
3. **Expected**: Account created, redirected to login
4. **Verify**: New user can login with credentials

### Test 1.2: User Login
1. Navigate to `/auth/login`
2. Enter citizen credentials
3. **Expected**: Redirected to citizen portal
4. **Verify**: Session token stored, user profile visible

### Test 1.3: Profile Settings
1. Login as citizen
2. Navigate to `/settings`
3. **Verify** following sections visible:
   - Profile Information
   - Password Management
   - Notification Preferences
   - Language Settings
4. Update profile picture
5. **Expected**: Changes saved with success message

### Test 1.4: Password Reset
1. Login as citizen
2. Go to Settings > Password Management
3. Change password: "NewSecurePass@456"
4. Logout
5. Login with new password
6. **Expected**: Login successful with new password

## Module 2: Service Management

### Test 2.1: Browse Services (Citizen)
1. Login as citizen
2. Navigate to `/citizen/services/browse`
3. **Verify** elements:
   - [ ] Service grid displays 10+ services
   - [ ] Category filter tabs work (Healthcare, Commerce, etc.)
   - [ ] Search functionality filters services
   - [ ] Sort options (name, price, processing time) work
   - [ ] Service details modal opens on click

### Test 2.2: Request New Service (Citizen)
1. From services page, click "Request Service"
2. Navigate to `/citizen/services/request`
3. Fill form:
   - Service Name: "New Digital ID Service"
   - Description: "Online digital identity verification"
   - Requirements: List key documents
   - Estimated Cost: "500 ETB"
4. **Expected**: Service request created successfully

### Test 2.3: Manage Services (Admin)
1. Login as admin
2. Navigate to `/admin/services`
3. **Verify** CRUD operations:
   - [ ] View all services in table
   - [ ] Create new service with form
   - [ ] Edit service details
   - [ ] Disable/enable service
   - [ ] Bulk actions (delete multiple)
   - [ ] Export service list

### Test 2.4: Service Performance Metrics (Admin)
1. Navigate to `/admin/services`
2. **Verify** visible metrics:
   - [ ] Total services count
   - [ ] Active services count
   - [ ] Services created this month
   - [ ] Average processing time
   - [ ] Service utilization chart

## Module 3: Service Applications

### Test 3.1: Submit Application (Citizen)
1. Login as citizen
2. From service details, click "Apply for Service"
3. Fill application form:
   - Select required documents to upload
   - Upload PDF/images
   - Accept terms
4. **Expected**: Application submitted, reference number provided

### Test 3.2: Track Applications (Citizen)
1. Navigate to `/citizen/applications`
2. **Verify** viewing:
   - [ ] All submitted applications listed
   - [ ] Status displayed (Pending, In Review, Approved, Completed)
   - [ ] Timeline showing milestones
   - [ ] Documents visible
   - [ ] Status history available
3. Test filters by status and date range

### Test 3.3: Review Applications (Employee)
1. Login as employee
2. Navigate to `/employee` dashboard
3. **Verify** viewing:
   - [ ] "Pending Review" applications shown
   - [ ] Application details accessible
   - [ ] Document preview works
   - [ ] Status update options available
4. Update application status to "In Progress"
5. Add internal note
6. **Expected**: Changes saved, timeline updated

### Test 3.4: Complete Application (Employee)
1. From pending application
2. Review all requirements
3. Approve application
4. **Expected**: 
   - Status changed to "Approved"
   - Citizen receives notification
   - Application marked complete in system

## Module 4: Feedback & Ratings

### Test 4.1: Submit Feedback (Citizen)
1. Login as citizen
2. After completing a service, navigate to `/citizen/services/feedback`
3. Fill feedback form:
   - Select completed service
   - Rate 1-5 stars
   - Write comment
   - Specify improvement areas
4. **Expected**: Feedback submitted, success confirmation

### Test 4.2: View Feedback (Admin)
1. Login as admin
2. Navigate to `/admin/feedback`
3. **Verify**:
   - [ ] All feedback displayed in table
   - [ ] Filter by service, date range, rating
   - [ ] Detailed feedback view available
   - [ ] Response template options shown
4. Respond to selected feedback
5. **Expected**: Response saved, citizen notified

### Test 4.3: Feedback Analytics (Admin)
1. On feedback page, view analytics section
2. **Verify** displayed:
   - [ ] Average rating by service
   - [ ] Rating distribution chart
   - [ ] Most common feedback categories
   - [ ] Sentiment analysis

## Module 5: Notifications

### Test 5.1: Configure Notifications (Citizen)
1. Login as citizen
2. Navigate to Settings > Notification Preferences
3. **Verify** notification options:
   - [ ] Email notifications toggle
   - [ ] SMS notifications toggle
   - [ ] Application status updates
   - [ ] Service announcements
   - [ ] Feedback responses
4. Configure preferences
5. **Expected**: Settings saved

### Test 5.2: Receive Notifications
1. With notifications configured
2. Have employee approve a pending application
3. **Expected**: Citizen receives notification
4. Check notification center at `/notifications`
5. **Verify**: Notification listed with timestamp

## Module 6: Multilingual Support

### Test 6.1: Language Switching (All Users)
1. Login as any user role
2. Locate language selector (top right)
3. Switch between: English → Amharic → Oromo
4. **Verify** for each language:
   - [ ] All UI text translated correctly
   - [ ] Form labels translated
   - [ ] Error messages translated
   - [ ] Success messages translated
5. Refresh page
6. **Expected**: Language preference persists

### Test 6.2: Date & Currency Localization
1. View service pricing with different languages
2. **Verify**:
   - [ ] Currency formatted to locale (ETB)
   - [ ] Dates formatted to locale
   - [ ] Numbers formatted correctly (decimal separators)

## Module 7: AI Chatbot

### Test 7.1: Chatbot Interaction (Citizen)
1. Login as citizen
2. Locate chatbot icon (bottom right)
3. Click to open chat interface
4. Test queries:
   - "How do I apply for a digital ID?"
   - "What documents do I need?"
   - "How long does the process take?"
5. **Verify**:
   - [ ] Chatbot responds appropriately
   - [ ] Suggested questions visible
   - [ ] Conversation history shown
   - [ ] Can share results

### Test 7.2: Chatbot Language Support
1. Open chatbot
2. Change language to Amharic
3. Ask query in Amharic
4. **Expected**: Response in Amharic

## Module 8: Admin Dashboard & Analytics

### Test 8.1: Dashboard Overview
1. Login as admin
2. Navigate to `/admin` dashboard
3. **Verify** displayed sections:
   - [ ] Total applications (count card)
   - [ ] Pending applications (count card)
   - [ ] Average processing time (count card)
   - [ ] User statistics (pie chart)
   - [ ] Application trend (line chart)
   - [ ] Service popularity (bar chart)

### Test 8.2: Analytics Reports
1. Navigate to `/admin/analytics`
2. **Verify** sections:
   - [ ] Application statistics by service
   - [ ] Processing time analytics
   - [ ] User demographics
   - [ ] Feedback ratings distribution
3. Test date range filters
4. **Expected**: Data updates based on selection

### Test 8.3: System Health
1. On analytics page
2. View system health section
3. **Verify**:
   - [ ] API response times shown
   - [ ] Database connection status
   - [ ] Last backup timestamp
   - [ ] Error logs accessible

## Module 9: Role-Based Access Control

### Test 9.1: Citizen Restrictions
1. Login as citizen
2. **Verify** cannot access:
   - `/admin/*` (redirects to citizen portal)
   - `/employee/*` (redirects to citizen portal)
   - `/partner/*` (redirects to citizen portal)
3. **Verify** can access:
   - `/citizen/*`
   - `/notifications`
   - `/settings`

### Test 9.2: Employee Permissions
1. Login as employee
2. **Verify** cannot access:
   - `/admin/*` (no admin features)
   - `/partner/*`
   - Submit new service requests
3. **Verify** can:
   - Review applications
   - Update application status
   - View assigned cases

### Test 9.3: Admin Access
1. Login as admin
2. **Verify** can access:
   - All `/admin/*` routes
   - User management
   - Service management
   - Analytics and reports
   - System settings

## Module 10: Performance & Load Testing

### Test 10.1: Page Load Times
1. Using browser DevTools
2. Measure load times for:
   - [ ] Login page < 2s
   - [ ] Citizen portal < 3s
   - [ ] Service browse page < 3s
   - [ ] Admin dashboard < 4s
3. **Expected**: All pages load within targets

### Test 10.2: Responsiveness
1. Test on different screen sizes:
   - [ ] Mobile (375px width)
   - [ ] Tablet (768px width)
   - [ ] Desktop (1920px width)
2. **Verify**:
   - [ ] Layout adapts correctly
   - [ ] Touch targets are 44px+
   - [ ] No horizontal scroll on mobile

## Module 11: Security Testing

### Test 11.1: Session Security
1. Login as citizen
2. Open DevTools Network tab
3. **Verify** JWT token present in Authorization header
4. Logout
5. **Verify** Token removed from storage

### Test 11.2: HTTPS/TLS
1. Check browser address bar
2. **Verify**: Connection is secure (HTTPS)
3. Click certificate icon
4. **Verify**: Valid SSL certificate

### Test 11.3: CSRF Protection
1. Submit a form
2. Check request headers
3. **Verify**: CSRF token present in POST requests

## Test Summary Report

After completing all tests, fill out:

| Module | Status | Issues | Notes |
|--------|--------|--------|-------|
| Authentication | ✓/✗ | | |
| Services | ✓/✗ | | |
| Applications | ✓/✗ | | |
| Feedback | ✓/✗ | | |
| Notifications | ✓/✗ | | |
| Multilingual | ✓/✗ | | |
| Chatbot | ✓/✗ | | |
| Analytics | ✓/✗ | | |
| RBAC | ✓/✗ | | |
| Performance | ✓/✗ | | |
| Security | ✓/✗ | | |

## Bug Reporting

For any issues found:

1. Note the exact steps to reproduce
2. Include screenshot/video
3. Note browser and OS version
4. Report priority (Critical/High/Medium/Low)
5. Expected vs actual behavior

## Sign-Off

- QA Lead: _________________ Date: _______
- Project Manager: _________________ Date: _______
- Client: _________________ Date: _______
