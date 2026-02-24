# Notification Management Module - Enterprise Edition

## Overview

The Notification Management Module is a comprehensive, multi-channel notification system designed for the Ethiopian Navigator platform. It provides robust infrastructure for managing user notifications across email, SMS, push notifications, and in-app channels with enterprise-grade reliability and scalability.

## Architecture

### Core Components

1. **Notifications Table** - Central notification repository
2. **Multi-Channel Queues** - Separate queues for email, SMS, and push
3. **User Preferences** - Per-user channel and timing preferences
4. **Audit Trail** - Complete notification history and logging
5. **Batch Processing** - Efficient queue management for sending

## Database Schema

### Tables

#### notifications
- `notification_id` (UUID) - Primary key
- `user_id` (UUID) - Recipient user
- `type_id` (INT) - Notification type reference
- `title` (VARCHAR) - Notification title
- `message` (TEXT) - Full message content
- `priority` (VARCHAR) - low, normal, high, critical
- `related_entity_id` (UUID) - Link to related resource
- `is_read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

#### push_notifications
- `push_id` (UUID) - Primary key
- `notification_id` (UUID) - FK to notifications
- `device_token` (VARCHAR) - Device token for delivery
- `platform` (VARCHAR) - iOS, Android, Web
- `delivery_status` (VARCHAR) - pending, delivered, failed, expired
- `sent_at` (TIMESTAMP) - When sent
- `retry_count` (INT) - Retry attempt count

#### email_queue
- `email_id` (UUID) - Primary key
- `notification_id` (UUID) - FK to notifications
- `recipient_email` (VARCHAR) - Email address
- `subject` (VARCHAR) - Email subject
- `html_content` (TEXT) - HTML body
- `delivery_status` (VARCHAR) - pending, sent, failed, bounced
- `retry_count` (INT) - Current retries (max 3)

#### sms_queue
- `sms_id` (UUID) - Primary key
- `notification_id` (UUID) - FK to notifications
- `phone_number` (VARCHAR) - Recipient phone
- `message_content` (VARCHAR) - SMS text (max 160 chars)
- `delivery_status` (VARCHAR) - pending, sent, failed, undelivered

#### notification_preferences
- `preference_id` (UUID) - Primary key
- `user_id` (UUID) - User reference (unique)
- `email_enabled` (BOOLEAN) - Default: true
- `sms_enabled` (BOOLEAN) - Default: false
- `push_enabled` (BOOLEAN) - Default: true
- `in_app_enabled` (BOOLEAN) - Default: true
- `quiet_hours_start` (TIME) - No notifications before
- `quiet_hours_end` (TIME) - No notifications after
- `timezone` (VARCHAR) - User's timezone
- `language` (VARCHAR) - Preferred language

#### notification_history
- `history_id` (UUID) - Primary key
- `notification_id` (UUID) - FK to notifications
- `action` (VARCHAR) - created, read, delivered, failed
- `details` (JSONB) - Full before/after snapshot
- `created_by` (UUID) - User who triggered action
- `created_at` (TIMESTAMP) - When action occurred

## Notification Types

Pre-configured notification types:
- **service_approved** - Service application approved (email, critical)
- **service_rejected** - Service application rejected (email, critical)
- **service_pending** - Pending service review (in-app)
- **payment_received** - Payment confirmation (email, critical)
- **appointment_reminder** - Upcoming appointment (SMS)
- **status_update** - General status update (in-app)
- **system_alert** - Critical system alerts (push, critical)
- **feedback_requested** - Feedback request (in-app)
- **document_required** - Missing documents (email, critical)
- **announcement** - System announcements (in-app)

## API Endpoints

### User Endpoints

#### Get Notifications
```
GET /api/notifications?limit=20&offset=0&unreadOnly=false
Headers: Authorization: Bearer {token}
Response: { notifications: [...], counts: {...}, pagination: {...} }
```

#### Get Notification Counts
```
GET /api/notifications/counts
Response: { total, unread, critical }
```

#### Mark as Read
```
PATCH /api/notifications/:id/read
Response: { notification: {...} }
```

#### Mark All as Read
```
PATCH /api/notifications/mark-all/read
Response: { message: "All marked as read" }
```

#### Search Notifications
```
GET /api/notifications/search?q=payment&limit=20&offset=0
Response: { results: [...] }
```

#### Get Preferences
```
GET /api/notifications/preferences
Response: { preferences: {...} }
```

#### Update Preferences
```
PUT /api/notifications/preferences
Body: {
  email_enabled: true,
  sms_enabled: false,
  push_enabled: true,
  quiet_hours_start: "22:00",
  quiet_hours_end: "06:00"
}
Response: { preferences: {...} }
```

#### Get Analytics
```
GET /api/notifications/analytics?range=30
Response: {
  total_notifications: 150,
  read_count: 145,
  critical_count: 5,
  avg_read_time_hours: 2.5
}
```

### Admin Endpoints

#### Get Pending Emails
```
GET /api/notifications/admin/pending-emails?limit=100
Response: { emails: [...], count: 47 }
```

#### Update Email Status
```
PATCH /api/notifications/admin/emails/:id/status
Body: { status: "sent", error: null }
Response: { email: {...} }
```

#### Get Statistics
```
GET /api/notifications/admin/statistics
Response: {
  total_notifications: 5000,
  unread_count: 320,
  critical_count: 45,
  total_users: 1200,
  last_24h: 450
}
```

## Security Features

1. **Authentication** - JWT token required for all endpoints
2. **Authorization** - Role-based access control (admin-only endpoints)
3. **Data Validation** - Input sanitization and validation
4. **SQL Injection Prevention** - Parameterized queries
5. **Audit Logging** - Complete history of all notification actions
6. **User Privacy** - Preferences isolation per user
7. **Rate Limiting** - Prevent abuse (recommended)

## Key Features

### Multi-Channel Support
- **In-App**: Instant notifications in user dashboard
- **Email**: HTML-formatted emails with templates
- **SMS**: Compact messages (max 160 chars)
- **Push**: Native device push notifications

### Smart Delivery
- User preference-based routing
- Quiet hours respecting user timezone
- Automatic retry logic (3 attempts)
- Delivery status tracking

### User Control
- Per-channel preferences
- Quiet hours configuration
- Language selection
- Timezone awareness

### Analytics
- Read rates and engagement
- Delivery success metrics
- Critical notification tracking
- User engagement over time

## Implementation Checklist

- [x] Database schema with 6 tables
- [x] Notification service (15+ methods)
- [x] API routes (12+ endpoints)
- [x] User preferences management
- [x] Multi-channel queue system
- [x] Audit trail logging
- [x] Batch processing ready
- [x] Admin analytics dashboard
- [ ] Email template system
- [ ] SMS provider integration
- [ ] Push notification service integration
- [ ] Frontend notification UI components

## Performance Optimizations

- 11 strategic indexes for fast queries
- Pagination support for large datasets
- Batch query execution
- Connection pooling
- Archive old notifications (>90 days)

## Deployment Instructions

1. Run SQL migration: `psql -U postgres -d navigator -f scripts/004-notification-management-enterprise.sql`
2. Deploy notification service
3. Configure external providers (SendGrid, Twilio, Firebase)
4. Set up batch processing workers
5. Configure email templates
6. Test notification flows

## Testing Scenarios

1. Create notification with all channels
2. Mark notifications as read
3. Search notifications by keyword
4. Test quiet hours enforcement
5. Verify email queue processing
6. Check notification history
7. Test analytics calculations
8. Verify RBAC on admin endpoints

## Future Enhancements

- Template system with variables
- Scheduled notifications
- Notification grouping/batching
- Rich notification formats
- Multi-language support
- Notification rules engine
- A/B testing framework
- Delivery analytics dashboard
