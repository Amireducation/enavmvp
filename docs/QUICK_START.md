# Quick Start Guide - Ethiopian Navigator MVP

## Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon)
- Groq API key (for chatbot)
- Vercel Blob token (for file uploads)

## Installation

### 1. Clone and Setup
```bash
git clone <repo-url>
cd ethiopian-navigator
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your actual values:
# - DATABASE_URL (Neon PostgreSQL)
# - JWT_SECRET
# - GROQ_API_KEY
# - BLOB_READ_WRITE_TOKEN
```

### 3. Database Migration
```bash
npm run db:migrate
```

### 4. Run Development Server
```bash
npm run dev
```

Access the application at `http://localhost:3000`

## Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Configure Production Variables
Set all environment variables in Vercel project settings:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`
3. Deploy

## User Roles & Access

### Citizen Portal
- URL: `/citizen`
- Features: Service discovery, applications, chatbot, feedback
- Credentials: Register via `/auth/register`

### Employee Portal
- URL: `/employee`
- Features: Application queue, status updates
- Credentials: Contact admin for employee account

### Admin Portal
- URL: `/admin`
- Features: Full system management, analytics, user management
- Credentials: Contact system administrator

## Key Features

### Service Discovery
1. Go to Citizen Portal
2. Navigate to "Browse Services"
3. Search or filter by category
4. Click service to view details and requirements

### Submit Application
1. Select a service
2. Click "Apply"
3. Fill out form
4. Upload required documents
5. Submit application
6. Track status in "My Applications"

### Use Chatbot
1. Click "AI Assistant" in sidebar
2. Ask questions about services
3. Get instant answers
4. Conversation history saved

### Admin Dashboard
1. Go to Admin Portal
2. View analytics and metrics
3. Manage user requests
4. Review feedback
5. Configure services

## API Testing

### Get Auth Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### List Services
```bash
curl -X GET http://localhost:3000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Submit Application
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id":"service-uuid",
    "submitted_data":{"field":"value"}
  }'
```

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if database is accessible
- Ensure all migrations have run

### Authentication Issues
- Check JWT_SECRET is set correctly
- Clear browser cookies
- Re-login with valid credentials

### File Upload Fails
- Verify BLOB_READ_WRITE_TOKEN
- Check file size < 10MB
- Ensure file type is supported (PDF, images, Office)

### Chatbot Not Responding
- Verify GROQ_API_KEY
- Check API rate limits
- Ensure model is available

## Performance Tips

1. Enable CDN for static assets
2. Set up database read replicas for analytics
3. Implement Redis caching for sessions
4. Enable compression on API responses
5. Use lazy loading for components

## Security Checklist

- [x] Update JWT_SECRET in production
- [x] Enable HTTPS only
- [x] Configure CORS properly
- [x] Set up database backups
- [x] Enable audit logging
- [x] Configure rate limiting
- [x] Use environment variables for secrets
- [x] Regular security updates

## Support

- Documentation: `/docs`
- Chat: Use AI Assistant in app
- Issues: GitHub issues
- Contact: support@ethiopiannavigator.gov.et

## License

Government of Ethiopia - All Rights Reserved
