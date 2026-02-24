# Ethiopian Navigator - Database Setup Guide

## Overview

The Ethiopian Navigator project uses **Neon PostgreSQL** as its database backend. Neon is a serverless PostgreSQL platform that provides excellent performance, scalability, and developer experience.

## Database Architecture

### Tables

The database consists of 13 main tables organized by function:

#### Core User Management
- **users**: Primary user table with authentication and role management
- **user_profiles**: Extended user profile information and preferences
- **password_reset_tokens**: Password reset functionality

#### Service Management
- **services**: Government services catalog
- **applications**: Citizen applications for services
- **service_requests**: Citizen requests for new services

#### Feedback & Engagement
- **feedback**: User ratings and feedback on services
- **notifications**: User notifications for application updates

#### Partner Management
- **partnerships**: Partnership and collaboration records

#### Auditing & Analytics
- **activity_logs**: User activity tracking
- **audit_logs**: Database change auditing
- **statistics**: Platform metrics and analytics
- **system_settings**: Configuration settings

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

```bash
# Install dependencies if not already done
npm install pg

# Set up environment variables
cp .env.example .env

# Edit .env and add your Neon database credentials
# DATABASE_URL=postgresql://user:password@host/database

# Run the setup script
node scripts/setup-neon-db.js
```

### Option 2: Manual Setup

1. **Create a Neon Project**
   - Go to https://console.neon.tech
   - Create a new project
   - Copy the database connection string

2. **Add Environment Variables**
   ```env
   DATABASE_URL=postgresql://username:password@host/database_name
   ```

3. **Connect and Run SQL**
   ```bash
   psql postgresql://username:password@host/database_name
   ```

4. **Execute the initialization script**
   ```sql
   \i scripts/init-database.sql
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Full PostgreSQL connection string | Yes |
| `NEON_DATABASE_HOST` | Database host (used if DATABASE_URL not set) | No |
| `NEON_DATABASE_PORT` | Database port (default: 5432) | No |
| `NEON_DATABASE_NAME` | Database name (default: ethiopian_navigator) | No |
| `NEON_DATABASE_USER` | Database user | No |
| `NEON_DATABASE_PASSWORD` | Database password | No |

## Schema Details

### Users Table
```sql
-- Primary user authentication and role management
-- Roles: citizen, employee, admin, partner
-- Indexes on email, role, and is_active for fast lookups
```

### Applications Table
```sql
-- Tracks citizen applications for government services
-- Status flow: pending → in_progress → approved/rejected → completed
-- Reference number for citizen lookup
-- Priority tracking for service officer workflow
```

### Services Table
```sql
-- Catalog of available government services
-- Includes ratings, requirements, and processing times
-- Featured services for homepage display
```

### Notifications Table
```sql
-- Push notifications for application updates
-- Types: application_update, service_update, system, reminder
-- Tracks read/unread status
```

### Feedback Table
```sql
-- Ratings and comments on services and applications
-- Anonymous feedback support
-- Status tracking: received → read → addressed
```

## Migrations

All database changes are managed through SQL migration files in `/backend/migrations/`:

1. **20251013_create_users.sql** - Initial user table setup
2. **20251014_complete_schema.sql** - Main schema with all tables
3. **20251015_add_password_reset.sql** - Password reset functionality
4. **20251016_add_partnerships.sql** - Partnership management

To apply new migrations:
```bash
psql $DATABASE_URL < backend/migrations/[filename].sql
```

## Performance Considerations

### Indexes
All tables have appropriate indexes on:
- Primary keys
- Foreign keys
- Frequently queried columns (email, role, status)
- Timestamp columns for range queries

### Query Optimization
- Use parameterized queries to prevent SQL injection
- Leverage indexes for WHERE and JOIN conditions
- Paginate large result sets
- Use JSONB columns for flexible data storage

### Connection Pooling
Use PgBouncer or similar for production connection pooling:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

## Backup & Recovery

### Automated Backups
Neon provides automatic daily backups. Access them through the Neon console.

### Manual Backup
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
psql $DATABASE_URL < backup_20240115.sql
```

## Security Best Practices

1. **Never commit .env files** - Use `.env.example` template
2. **Use SSL connections** - `sslmode=require` in connection string
3. **Rotate passwords regularly** - Use Neon console
4. **Implement RLS** - Row Level Security for multi-tenant safety
5. **Audit sensitive operations** - Monitor activity_logs table
6. **Hash passwords** - Use bcrypt before storing
7. **Validate input** - Prevent SQL injection with parameterized queries

## Development Workflow

### Local Development
```bash
# Use a local PostgreSQL instance or Neon's connection string
npm run db:setup    # Initialize schema
npm run db:seed     # Add sample data
npm run db:reset    # Reset to clean state
```

### Testing
```bash
# Use a separate test database
TEST_DATABASE_URL=... npm test
```

### Production
```bash
# Use Neon's production database
NODE_ENV=production npm start
```

## Monitoring

### Check Database Health
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check disk usage
SELECT pg_size_pretty(pg_database_size('ethiopian_navigator'));

-- Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) 
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```

### Performance
Monitor through Neon dashboard:
- Query logs
- Performance insights
- Connection metrics
- Storage usage

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection string format
# Should be: postgresql://user:password@host:port/database
```

### Slow Queries
1. Check EXPLAIN plans
2. Verify indexes exist
3. Analyze table statistics: `ANALYZE table_name;`
4. Monitor slow query log in Neon console

### Data Integrity
```sql
-- Check foreign key constraints
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
ORDER BY table_name;
```

## Support & Resources

- **Neon Documentation**: https://neon.tech/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Project Issues**: Check GitHub issues for database-related problems

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run the database initialization script
3. ✅ Verify all tables are created
4. ✅ Insert initial seed data
5. ✅ Test application connections
6. ✅ Set up automated backups
7. ✅ Monitor database performance
