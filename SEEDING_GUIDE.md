# Database Seeding Guide

## Overview
This guide explains how to seed the Ethiopian Navigator database with demo data and test users for development and testing purposes.

## Demo User Credentials

### Citizen Account
- **Email:** citizen@demo.enav
- **Password:** citizen123
- **Role:** Citizen
- **Access:** Citizen portal

### Employee Account
- **Email:** employee@demo.enav
- **Password:** employee123
- **Role:** Employee
- **Access:** Employee portal

### Partner Account
- **Email:** partner@demo.enav
- **Password:** partner123
- **Role:** Partner
- **Access:** Partner portal

### Admin Account
- **Email:** admin@demo.enav
- **Password:** admin123
- **Role:** Admin
- **Access:** Admin dashboard

## Seeding Methods

### Method 1: Using the API Endpoint (Easiest)

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Call the seed endpoint** using curl or Postman:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed \
     -H "Content-Type: application/json"
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "data": {
       "message": "Database seeded successfully",
       "stats": {
         "demo_users": 4,
         "service_categories": 6,
         "business_sectors": 5,
         "entity_types": 5,
         "services": 6
       },
       "credentials": {
         "citizen": { "email": "citizen@demo.enav", "password": "citizen123" },
         "employee": { "email": "employee@demo.enav", "password": "employee123" },
         "partner": { "email": "partner@demo.enav", "password": "partner123" },
         "admin": { "email": "admin@demo.enav", "password": "admin123" }
       }
     }
   }
   ```

### Method 2: Using SQL Directly

1. **Connect to your Neon PostgreSQL database** using psql or any SQL client:
   ```bash
   psql postgresql://user:password@host:port/database
   ```

2. **Execute the seed SQL script:**
   ```bash
   \i backend/migrations/20251020_seed_demo_data.sql
   ```

3. **Or copy and paste the SQL from the migration file** into your SQL client

### Method 3: Using Vercel PostgreSQL Client (Node.js)

1. **Create a seed runner script** (if needed):
   ```typescript
   import { sql } from "@/lib/db"
   
   async function seedDatabase() {
     try {
       // Insert demo users
       await sql`
         INSERT INTO users (email, full_name, password_hash, role, status, created_at)
         VALUES ('citizen@demo.enav', 'Demo Citizen', crypt('citizen123', gen_salt('bf')), 'citizen', 'active', NOW())
       `
       console.log("Seeding complete!")
     } catch (error) {
       console.error("Seeding failed:", error)
     }
   }
   
   seedDatabase()
   ```

2. **Run with Node.js:**
   ```bash
   node seed-script.js
   ```

## What Gets Seeded

### 1. Demo Users (4 users)
- One user per role (citizen, employee, partner, admin)
- All with email verified status
- English language preference

### 2. Service Categories (6 categories)
- Business Registration
- Licensing & Permits
- Tax Services
- Identity Services
- Education Services
- Health Services

### 3. Business Sectors (5 sectors)
- Technology
- Retail & Commerce
- Manufacturing
- Services
- Agriculture

### 4. Business Entity Types (5 types)
- Sole Proprietorship
- Partnership
- Limited Liability Company (LLC)
- Corporation
- Non-Governmental Organization (NGO)

### 5. Demo Services (6 services)
- Business Registration
- Tax Identification Number (TIN)
- Trade License
- Birth Certificate
- School Enrollment
- Health Insurance

### 6. FAQ Entries (3 entries)
- How do I register a business?
- What is a TIN number?
- How long does processing take?

### 7. Knowledge Articles (2 articles)
- Business Registration Guide
- Tax Filing Requirements

### 8. Notification Preferences
- All demo users get standard notification preferences enabled

## Testing the Login

1. **Navigate to the login page:**
   ```
   http://localhost:3000/auth/login
   ```

2. **Try logging in with one of the demo accounts:**
   - Email: citizen@demo.enav
   - Password: citizen123

3. **Expected behavior:**
   - Login succeeds
   - User is redirected to their role-based portal
   - Citizen → /citizen
   - Employee → /employee
   - Partner → /partner
   - Admin → /admin

## Clearing Demo Data

### To remove all demo data:

```sql
DELETE FROM users WHERE email LIKE '%@demo.enav%';
```

This will cascade delete:
- Login history for demo users
- User sessions
- Service requests
- Notifications
- All related data

## Troubleshooting

### Issue: "Email already exists"
- **Cause:** Demo data already seeded
- **Solution:** Call the endpoint again (it uses `ON CONFLICT DO NOTHING`) or clear data first

### Issue: "Permission denied for schema public"
- **Cause:** User doesn't have proper database permissions
- **Solution:** Verify your database connection and user permissions

### Issue: "pgcrypto extension not installed"
- **Cause:** PostgreSQL extension not enabled
- **Solution:** Run `CREATE EXTENSION IF NOT EXISTS pgcrypto;` first

### Issue: "Category not found for services"
- **Cause:** Categories weren't inserted before services
- **Solution:** Re-run the full seed process

## For Production

**IMPORTANT:** Do NOT use demo accounts in production. This guide is for development only.

1. Remove all `@demo.enav` users before going live
2. Create proper production user accounts with strong passwords
3. Never commit demo data to production databases
4. Use environment variables to control seeding:

```typescript
if (process.env.NODE_ENV === 'development') {
  // Only seed in development
  await seedDatabase()
}
```

## Need Help?

- Check application logs: `npm run dev` shows detailed errors
- Verify database connection in environment variables
- Ensure PostgreSQL pgcrypto extension is installed
- Check that all migrations have run successfully

---

**Generated:** 2025-03-15  
**Last Updated:** 2025-03-15  
**Status:** Production Ready
