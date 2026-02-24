# Ethiopian Navigator MVP

A multilingual, AI-powered government service portal designed to improve access to government services for Ethiopian citizens.

## Features

- **4 Role-Based Portals**: Citizen, Employee, Admin, Partner
- **Multilingual Support**: Amharic, Oromo, English with automatic detection
- **AI-Powered Chatbot**: GPT-4 backed service recommendations
- **Service Catalog**: Browse and apply for government services
- **Application Tracking**: Real-time status updates
- **Admin Dashboard**: System monitoring and user management

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **AI**: Azure OpenAI GPT-4, Azure Search
- **Deployment**: Docker, GitHub Actions, Azure

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 14+
- Docker (for containerized deployment)
- Azure account (for AI services)

### Local Development

1. **Clone and Install**
   \`\`\`bash
   git clone <repository>
   cd ethiopian-navigator
   pnpm install
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   pnpm install
   pnpm dev
   \`\`\`

3. **Setup Frontend**
   \`\`\`bash
   # In root directory
   pnpm dev
   \`\`\`

4. **Setup AI Chatbot** (Optional)
   \`\`\`bash
   cd ai-chatbot
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   python app.py
   \`\`\`

The frontend will be available at `http://localhost:3000`

## Project Structure

\`\`\`
ethiopian-navigator/
├── app/                 # Next.js app directory
│   ├── citizen/        # Citizen portal pages
│   ├── employee/       # Employee portal pages
│   ├── admin/          # Admin dashboard pages
│   ├── partner/        # Partner portal pages
│   └── auth/           # Authentication pages
├── backend/            # Node.js Express server
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   ├── middleware/     # Express middleware
│   └── config/         # Configuration files
├── ai-chatbot/         # Python Flask chatbot service
├── components/         # Reusable React components
├── lib/               # Utility functions and helpers
└── public/            # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id` - Update service (admin)

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications` - Get user applications
- `GET /api/applications/:id` - Get application details
- `PATCH /api/applications/:id/status` - Update status (employee/admin)

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - List feedback (admin)

### User Management
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user details (admin)
- `GET /api/profile` - Get current user profile

## Deployment

### Docker Deployment

1. **Build Images**
   \`\`\`bash
   docker-compose build
   \`\`\`

2. **Run Services**
   \`\`\`bash
   docker-compose up
   \`\`\`

### Azure Deployment

See `DEPLOYMENT.md` for comprehensive Azure deployment instructions.

## Testing

### Run Tests
\`\`\`bash
# Backend tests
cd backend
pnpm test

# Frontend tests
pnpm test:frontend
\`\`\`

See `TESTING.md` for detailed testing documentation.

## Troubleshooting

### Common Issues

**Port already in use**
\`\`\`bash
# Find and kill process on port 5000 (backend) or 3000 (frontend)
lsof -ti:5000 | xargs kill -9
\`\`\`

**Database connection failed**
- Ensure PostgreSQL is running
- Check connection string in `.env`
- Verify database exists

**AI Chatbot not responding**
- Ensure Python service is running on port 8000
- Check Azure credentials in `ai-chatbot/.env`
- Review logs: `docker logs ai-chatbot`

## Contributing

Please see `CONTRIBUTING.md` for guidelines.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
