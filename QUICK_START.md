# Quick Start Guide

## 5-Minute Setup

### Option 1: Docker (Recommended)

\`\`\`bash
# Clone repository
git clone <repository>
cd ethiopian-navigator

# Start all services
docker-compose up -d

# Wait for services to start (2-3 minutes)
docker-compose logs -f

# Access at http://localhost:3000
\`\`\`

### Option 2: Local Development

\`\`\`bash
# Terminal 1: Backend
cd backend
cp .env.example .env
pnpm install
pnpm dev

# Terminal 2: Frontend
cd ..
pnpm install
pnpm dev

# Terminal 3: AI Chatbot (Optional)
cd ai-chatbot
pip install -r requirements.txt
python app.py
\`\`\`

## Test Accounts

Use these credentials to test different portals:

**Citizen Account**
- Email: citizen@example.com
- Password: password123
- Role: Citizen

**Employee Account**
- Email: employee@example.com
- Password: password123
- Role: Employee

**Admin Account**
- Email: admin@example.com
- Password: password123
- Role: Admin

## First Steps

1. Go to http://localhost:3000
2. Click on desired portal
3. Login with test account credentials
4. Explore the features

## Key Features to Try

- **Citizen Portal**: Browse services, submit applications, provide feedback
- **Employee Portal**: Review applications, update statuses, view analytics
- **Admin Dashboard**: Monitor system, manage users, view metrics
- **AI Chatbot**: Ask questions about services in Amharic, Oromo, or English

## Troubleshooting

Still having issues? See `README.md` Troubleshooting section or check logs:

\`\`\`bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ai-chatbot
