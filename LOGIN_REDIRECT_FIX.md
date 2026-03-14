# Login Redirect Fix Documentation

## Problem
Login was not redirecting to user portals after clicking sign in. The issue had multiple causes:

1. **Missing Cookies**: Login API wasn't setting HTTP-only cookies that middleware checks
2. **Middleware Blocking**: Middleware checks for `auth_token` and `userRole` cookies but they weren't being set
3. **Missing Demo Users**: Demo accounts might not exist in the database
4. **Race Condition**: Cookies might not be set before redirect happens

## Solution

### 1. Fixed Login API (`/app/api/auth/login/route.ts`)
- Now sets three essential cookies after successful login:
  - `auth_token`: HTTP-only token for middleware validation
  - `userRole`: User's role for UI logic (not HTTP-only to allow JS access)
  - `userId`: User's ID for tracking
- Cookies are set with proper options (secure, sameSite='lax', 24hr expiry)

### 2. Enhanced Login Page (`/app/auth/login/page.tsx`)
- Added 100ms delay before redirect to ensure cookies are properly set
- Still stores token in localStorage for client-side access
- Properly constructs role-based redirect paths

### 3. Created Logout Endpoint (`/app/api/auth/logout/route.ts`)
- Properly clears all authentication cookies
- Sets maxAge=0 to remove cookies from browser

### 4. Added Demo User Seeding

#### Option A: Using the Seed API Endpoint
```bash
curl -X POST http://localhost:3000/api/admin/seed-demo-users \
  -H "Authorization: Bearer dev-seed-secret"
```

#### Option B: Manual Database Insert
Run this SQL in your Neon database:

```sql
-- Demo Citizen User
INSERT INTO users (email, password_hash, full_name, role, status, email_verified, created_at, updated_at)
VALUES ('citizen@ethionavigator.gov.et', crypt('Demo@123', gen_salt('bf')), 'Demo Citizen', 'citizen', 'active', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Demo Employee User
INSERT INTO users (email, password_hash, full_name, role, status, email_verified, created_at, updated_at)
VALUES ('employee@ethionavigator.gov.et', crypt('Demo@123', gen_salt('bf')), 'Demo Employee', 'employee', 'active', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Demo Admin User
INSERT INTO users (email, password_hash, full_name, role, status, email_verified, created_at, updated_at)
VALUES ('admin@ethionavigator.gov.et', crypt('Demo@123', gen_salt('bf')), 'Demo Admin', 'admin', 'active', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Demo Partner User
INSERT INTO users (email, password_hash, full_name, role, status, email_verified, created_at, updated_at)
VALUES ('partner@ethionavigator.gov.et', crypt('Demo@123', gen_salt('bf')), 'Demo Partner', 'partner', 'active', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
```

## Demo Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@ethionavigator.gov.et | Demo@123 |
| Employee | employee@ethionavigator.gov.et | Demo@123 |
| Admin | admin@ethionavigator.gov.et | Demo@123 |
| Partner | partner@ethionavigator.gov.et | Demo@123 |

## Login Flow (Fixed)

1. User enters email and password on login page
2. Form submits to `/api/auth/login` via POST
3. Server validates credentials against database
4. Server generates JWT token
5. **Server sets cookies** (auth_token, userRole, userId)
6. Server returns token and user data
7. Client stores token in localStorage and auth context
8. Client redirects to appropriate portal (citizen → /citizen, admin → /admin, etc.)
9. Middleware checks cookies and allows access
10. User dashboard loads with their data

## Testing the Fix

1. Seed demo users (using API or SQL above)
2. Navigate to http://localhost:3000/auth/login
3. Click on "Demo Citizen", "Demo Employee", "Demo Admin", or "Demo Partner" button
4. Verify redirect to appropriate portal:
   - Citizen → `/citizen`
   - Employee → `/employee`
   - Admin → `/admin`
   - Partner → `/partner`
5. Verify user menu shows correct name and role
6. Test logout and verify redirect back to login

## Middleware Changes

Enhanced middleware (`/middleware.ts`) now:
- Checks for both `auth_token` and `userRole` cookies
- Allows public routes without authentication
- Protects role-specific routes
- Automatically redirects authenticated users away from auth pages
- Redirects unauthorized users to their default dashboard

## Files Modified

- `/app/api/auth/login/route.ts` - Added cookie setting
- `/app/auth/login/page.tsx` - Added redirect delay
- `/app/api/auth/logout/route.ts` - Created new logout endpoint
- `/lib/seed-demo-users.ts` - Created demo user seeding function
- `/app/api/admin/seed-demo-users/route.ts` - Created seed API endpoint

## Environment Variables

No new environment variables required, but optional:
- `SEED_SECRET`: Secret key for demo seeding endpoint (defaults to "dev-seed-secret")
