# Database Setup Guide

This guide covers database setup, migrations, and seeding for the Ethiopian Navigator MVP.

## Quick Start

\`\`\`bash
# Run all database setup steps
npm run db:setup

# Or run individually:
npm run migrate        # Run migrations
npm run db:seed        # Seed data
npm run db:test        # Test connection
\`\`\`

## Database Schema

The database consists of 7 main tables:

### 1. users
Stores user accounts with authentication credentials.
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (citizen, employee, admin, partner)
- `full_name` - User's full name
- `phone` - Contact phone number

### 2. user_profiles
Extended user information and preferences.
- `user_id` - Foreign key to users
- `full_name`, `phone`, `address`, `city`, `region`
- `language_preference` - Preferred UI language (am, or, en)
- `notification_preferences` - JSON preferences

### 3. services
Government services catalog.
- `service_id` - Unique service identifier
- `category` - Service category
- `name`, `description` - Service details
- `responsible_agency` - Agency handling the service
- `estimated_processing_time` - Processing duration
- `service_fee` - Cost in ETB
- `requirements` - Array of required documents

### 4. applications
Citizen applications for services.
- `application_id` - Unique application ID
- `user_id` - Applicant user
- `service_id` - Service being applied for
- `status` - Application status (submitted, under_review, approved, rejected)
- `submitted_data` - JSON application form data
- `documents` - JSON array of document URLs

### 5. service_requests
Citizen requests for new services not in catalog.
- `request_id` - Unique request ID
- `user_id` - Requesting user
- `service_name`, `service_description` - Requested service details
- `status` - Request status
- `priority` - Priority level

### 6. feedback
User feedback on services and applications.
- `feedback_id` - Unique feedback ID
- `user_id` - User providing feedback
- `service_id` - Related service (optional)
- `application_id` - Related application (optional)
- `rating` - Numeric rating (1-5)
- `comments` - Text feedback

### 7. notifications
System notifications for users.
- `notification_id` - Unique notification ID
- `user_id` - Recipient user
- `type` - Notification type
- `title`, `message` - Notification content
- `is_read` - Read status

## Migrations

Migrations are located in `/backend/migrations/` and are run in alphabetical order.

### Running Migrations

\`\`\`bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:down

# Create new migration
npm run migrate:create <migration_name>
\`\`\`

### Existing Migrations

1. `20251013_create_users.sql` - Creates users table
2. `20251014_complete_schema.sql` - Creates all other tables

## Seeding Data

Seed data populates the database with initial content for development and testing.

### Default Seed Data

The seed script creates:
- **15 government services** across 8 categories
- **4 test users** (admin, employee, partner, citizen)
- **Sample applications** for testing workflows

### Running Seed

\`\`\`bash
npm run db:seed
\`\`\`

### Default User Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ethiopiannavigator.gov.et | Admin123! |
| Employee | employee@ethiopiannavigator.gov.et | Employee123! |
| Partner | partner@ethiopiannavigator.gov.et | Partner123! |
| Citizen | citizen@example.com | Citizen123! |

## Testing Database Connection

\`\`\`bash
npm run db:test
\`\`\`

This command:
- Tests PostgreSQL connection
- Lists all tables
- Shows record counts for each table
- Identifies missing tables or data

## Database Configuration

Configure database connection in `/backend/.env`:

\`\`\`env
POSTGRES_CONN_STRING=postgresql://user:password@host:port/database
\`\`\`

### Local Development

\`\`\`env
POSTGRES_CONN_STRING=postgresql://postgres:postgres@localhost:5432/ethiopian_navigator
\`\`\`

### Docker Compose

\`\`\`env
POSTGRES_CONN_STRING=postgresql://postgres:postgres@postgres:5432/ethiopian_navigator
\`\`\`

### Azure PostgreSQL

\`\`\`env
POSTGRES_CONN_STRING=postgresql://admin@server:password@server.postgres.database.azure.com:5432/ethiopian_navigator?sslmode=require
\`\`\`

## Troubleshooting

### Connection Failed

\`\`\`bash
# Check if PostgreSQL is running
pg_isready

# For Docker:
docker ps | grep postgres

# Test connection manually
psql -h localhost -U postgres -d ethiopian_navigator
\`\`\`

### Database Doesn't Exist

\`\`\`bash
# Create database
createdb ethiopian_navigator

# Or in psql:
CREATE DATABASE ethiopian_navigator;
\`\`\`

### Migrations Failed

\`\`\`bash
# Check migration status
npm run migrate:status

# Rollback and retry
npm run migrate:down
npm run migrate
\`\`\`

### Seed Data Issues

\`\`\`bash
# Clear existing data
psql -d ethiopian_navigator -c "TRUNCATE users, services, applications CASCADE;"

# Re-run seed
npm run db:seed
\`\`\`

## Advanced Operations

### Backup Database

\`\`\`bash
pg_dump ethiopian_navigator > backup.sql
\`\`\`

### Restore Database

\`\`\`bash
psql ethiopian_navigator < backup.sql
\`\`\`

### Reset Database

\`\`\`bash
# Drop and recreate
dropdb ethiopian_navigator
createdb ethiopian_navigator

# Run migrations and seed
npm run db:setup
\`\`\`

## Production Considerations

1. **Use environment variables** for all credentials
2. **Enable SSL** for Azure PostgreSQL connections
3. **Regular backups** using Azure automated backups
4. **Connection pooling** for better performance
5. **Monitoring** database metrics and slow queries
6. **Access control** using Azure AD authentication
