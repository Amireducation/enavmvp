# Ethiopian Navigator - Enterprise User Management Module

## Overview
The User Management Module is a critical, enterprise-grade system designed with security, scalability, and compliance at its core. This module handles all aspects of user authentication, authorization, profile management, and administration.

## Architecture

### Database Schema (8 Tables)

#### 1. **roles** table
- Defines system roles with granular permissions
- Supports 4 primary roles: citizen, employee, admin, partner
- Permissions stored as JSONB for flexibility
- Enable/disable roles independently

#### 2. **users** table
- Core user information with security features
- Account status tracking: pending, active, suspended, deactivated, archived
- Email verification tracking
- Two-factor authentication support
- Failed login attempt tracking and account lockout (5 attempts = 30 min lock)
- Last login and password change timestamps for security audits

#### 3. **user_profiles** table
- Extended profile information
- Multilingual support (English, Amharic, Oromo)
- Geographic data with latitude/longitude
- Identity verification (national ID, passport, driver's license)
- Preference settings for notifications and communications

#### 4. **user_roles** table
- Many-to-many mapping of users to roles
- Support for role expiration dates
- Track who assigned each role and when
- Allow users to have multiple roles

#### 5. **user_sessions** table
- Secure session management
- Device fingerprinting and tracking
- IP address and user agent logging
- Session expiration and revocation
- Active session querying for security

#### 6. **password_reset_tokens** table
- Secure password reset workflow
- Token expiration (24 hours)
- Maximum attempt limiting (5 attempts)
- IP and user agent tracking for suspicious activity

#### 7. **user_verification** table
- Email verification tokens
- Verification codes (OTP)
- Token expiration
- Attempt tracking to prevent brute force

#### 8. **user_login_history** table
- Complete login audit trail
- Success/failure tracking with reasons
- Device and location information
- Security analysis and anomaly detection

### Security Features

#### Password Security
- **Hashing**: bcryptjs with salt rounds of 12
- **Validation Rules**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)

#### Account Protection
- **Failed Login Lockout**: 5 failed attempts triggers 30-minute account lock
- **Session Management**: Automatic token expiration and revocation
- **Email Verification**: Required before first login
- **Device Tracking**: IP address, user agent, device fingerprinting

#### Authentication Flow
1. User registers with email, password, username
2. Verification email sent with token and OTP
3. User verifies email
4. User can now login
5. JWT token issued with 24-hour expiration
6. Session created and tracked in database
7. All login attempts logged (success or failure)

#### Authorization
- Role-based access control (RBAC)
- Granular permissions stored in roles table
- Middleware-based enforcement
- Role expiration support

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### User Profile
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update current user profile
- `POST /api/auth/change-password` - Change password

#### Admin User Management
- `GET /api/users` - List all users with filtering
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/:id/login-history` - View login history
- `POST /api/users/:id/suspend` - Suspend user
- `POST /api/users/:id/activate` - Activate user
- `GET /api/users/search/:query` - Search users

#### Session Management
- `GET /api/auth/sessions/active` - View active sessions
- `POST /api/auth/sessions/revoke-all` - Revoke all sessions

## User Roles & Permissions

### Citizen
```json
{
  "browse_services": true,
  "submit_requests": true,
  "view_applications": true,
  "provide_feedback": true
}
```

### Employee
```json
{
  "review_applications": true,
  "update_status": true,
  "view_feedback": true,
  "generate_reports": true
}
```

### Admin
```json
{
  "manage_users": true,
  "manage_services": true,
  "manage_employees": true,
  "view_analytics": true,
  "system_config": true
}
```

### Partner
```json
{
  "collaborate": true,
  "view_services": true,
  "report_metrics": true
}
```

## Implementation Details

### UserService Class
Core service with 20+ methods:
- `createUser()` - User registration
- `authenticateUser()` - Login validation
- `changePassword()` - Password change
- `resetPassword()` - Password reset
- `verifyEmail()` - Email verification
- `createSession()` - Session creation
- `revokeSession()` - Session revocation
- `logLoginAttempt()` - Audit logging
- `getUserById()` - Fetch user details
- `getAllUsers()` - List users with filters
- `updateUserProfile()` - Profile update
- Validation methods for emails, passwords, usernames

### Middleware

#### JWT Authentication (`/backend/middleware/jwt-auth.js`)
- Verifies JWT tokens from Authorization header
- Decodes token and extracts user information
- Passes user to downstream handlers
- Returns 401 Unauthorized if invalid

#### RBAC (`/backend/middleware/rbac.js`)
- Checks user roles against required roles
- Supports single role or multiple role checking
- Returns 403 Forbidden if insufficient permissions

## Database Queries

### Performance Optimizations
- Indexes on frequently queried columns: email, username, status, created_at
- Composite indexes for multi-column searches
- View for user_with_roles for efficient role aggregation
- View for active_user_sessions for quick session lookups

### Audit Trails
- All user actions logged in login_history
- Automatic timestamp tracking (created_at, updated_at)
- Soft deletes support with deleted_at column
- Change tracking for admin actions

## Demo Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@demo.com | Demo@123 | Full system access |
| Employee | employee@demo.com | Demo@123 | Service review |
| Citizen | citizen@demo.com | Demo@123 | Service browsing |
| Partner | partner@demo.com | Demo@123 | Collaboration |

## Testing Scenarios

### Registration & Email Verification
1. Register new user with valid credentials
2. Check email verification token generation
3. Verify email with token
4. Attempt login before/after verification
5. Test email uniqueness constraint

### Authentication & Security
1. Successful login creates JWT and session
2. Invalid credentials logged as failed attempt
3. 5 failed attempts trigger 30-minute lockout
4. Logout revokes session
5. Expired tokens rejected

### User Management (Admin)
1. Create user with all roles
2. Update user profile and status
3. Suspend user (blocks login)
4. View login history and patterns
5. Delete user (cascades to related data)

### Password Management
1. Change password with old password verification
2. Request password reset (email token sent)
3. Reset password with token
4. New password meets complexity requirements
5. Old sessions invalidated after password change

### Session Management
1. Multiple concurrent sessions per user
2. Device tracking and identification
3. Session expiration after 24 hours
4. Manual session revocation
5. Revoke all sessions functionality

## Security Checklist

- [x] Passwords hashed with bcryptjs (12 rounds)
- [x] SQL injection prevention (parameterized queries)
- [x] Email verification required
- [x] Account lockout after failed attempts
- [x] Session management and revocation
- [x] Login attempt audit trail
- [x] JWT token expiration
- [x] RBAC with granular permissions
- [x] Device tracking
- [x] Password reset security
- [x] Role-based access enforcement
- [x] Admin self-deletion prevention
- [x] Database constraint validation

## Deployment Checklist

1. Execute `/scripts/002-user-management-schema.sql` against Neon database
2. Set environment variables:
   - `JWT_SECRET` - Strong random string for JWT signing
   - `DATABASE_URL` - Neon PostgreSQL connection string
3. Start backend server with auth routes
4. Verify database indexes and triggers created
5. Test demo user logins
6. Monitor login_history table for anomalies
7. Set up email service for verification/reset emails

## Future Enhancements

1. OAuth/SSO integration (Google, Microsoft)
2. Two-factor authentication (SMS/Email OTP)
3. Biometric login (fingerprint/face recognition)
4. IP geolocation for location-based access control
5. Machine learning for anomaly detection
6. LDAP/Active Directory integration
7. Single sign-on (SSO) across multiple systems
8. Passwordless authentication
9. Risk-based authentication
10. Advanced audit logging and compliance reporting
