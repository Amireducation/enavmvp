# Ethiopian Navigator - Authentication Flow Guide

## Database Seeding Complete ✅

All demo users have been successfully seeded into the database:

### Demo Credentials
- **Citizen User**: citizen@demo.enav / citizen123
- **Employee User**: employee@demo.enav / employee123
- **Partner User**: partner@demo.enav / partner123
- **Admin User**: admin@demo.enav / admin123

## Authentication Flow Verification

The authentication system implements the following flow:

### 1. Login Process
1. User submits email and password on `/app/auth/login`
2. Frontend calls `/api/auth/login` with credentials
3. Backend validates credentials against hashed passwords in database
4. On success:
   - Generates JWT token
   - Sets HTTP-only cookies: `auth_token`, `userRole`, `userId`
   - Returns token and user data to frontend
5. Frontend stores token in localStorage and cookies
6. Small 100ms delay before redirect to allow cookies to be set
7. User redirected to role-based dashboard:
   - Admin → `/admin`
   - Employee → `/employee`
   - Partner → `/partner`
   - Citizen → `/citizen`

### 2. Middleware Route Protection
The `middleware.ts` file protects all routes:
- Checks for `auth_token` and `userRole` cookies
- Validates role-based access to protected routes
- Redirects unauthenticated users to `/auth/login`
- Redirects users to appropriate dashboards if accessing auth pages

### 3. Session Management
- Session API endpoints available at `/api/auth/session`
- Session refresh endpoint at `/api/auth/session/refresh`
- Session expiry warning component alerts users 5 minutes before expiry
- Automatic logout on session expiry

### 4. Logout Process
POST to `/api/auth/logout` which:
- Clears auth cookies
- Invalidates session
- Redirects to login page

## Testing the Authentication

### Using the Demo Credentials

1. **Navigate to Login**: Go to `https://your-app.com/auth/login`
2. **Enter Credentials**: Use any of the demo email/password combinations above
3. **Submit**: Click "Sign In"
4. **Verify Redirect**: Should redirect to appropriate portal:
   - Citizen → Service discovery and application dashboard
   - Employee → Request management and approvals
   - Partner → Business management dashboard
   - Admin → Analytics and system management

### Troubleshooting

If login doesn't redirect:
1. Check browser console for errors
2. Verify cookies are being set (DevTools → Application → Cookies)
3. Check middleware.ts is properly configured
4. Ensure database has demo users (check `SELECT * FROM users WHERE email LIKE '%@demo.enav'`)
5. Verify password hashing is working (crypt function in database)

## Cookie Configuration

### HTTP-Only Cookies Set
```
auth_token: JWT token for API authentication
userRole: User's role (admin/employee/partner/citizen)
userId: User's ID for quick reference
```

### Cookie Settings
- **httpOnly**: true (for security)
- **secure**: true (only in production)
- **sameSite**: lax
- **maxAge**: 86400 seconds (24 hours)
- **path**: /

## Next Steps

After verifying authentication works:
1. Test each role's portal access
2. Verify session timeout and refresh
3. Test logout functionality
4. Build G2G Workspace Portal (Step 3)
5. Enhance B2B Marketplace (Step 4)
