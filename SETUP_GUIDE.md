# Ethiopian Navigator MVP - Complete Setup Guide

This guide will help you set up the Ethiopian Navigator MVP project on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/) OR Docker
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional, recommended) - [Download](https://www.docker.com/)

## Quick Start (Automated Setup)

### Linux/macOS

\`\`\`bash
chmod +x scripts/setup-local-dev.sh
./scripts/setup-local-dev.sh
\`\`\`

### Windows

\`\`\`powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-local-dev.ps1
\`\`\`

The automated setup script will:
1. Create environment files from examples
2. Install all dependencies
3. Set up PostgreSQL (via Docker if available)
4. Run database migrations and seed data
5. Set up Python virtual environment for AI chatbot

## Manual Setup

If you prefer to set up manually or the automated script fails:

### 1. Clone and Install Dependencies

\`\`\`bash
# Clone the repository (if not already done)
git clone <repository-url>
cd ethiopiannavigatormvpmain

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
\`\`\`

### 2. Set Up Environment Variables

Create `.env` files from the examples:

\`\`\`bash
# Backend
cp backend/.env.example backend/.env

# AI Chatbot
cp ai-chatbot/.env.example ai-chatbot/.env
\`\`\`

Edit these files with your actual credentials:

**backend/.env:**
\`\`\`env
PORT=5000
NODE_ENV=development
POSTGRES_CONN_STRING=postgresql://postgres:postgres@localhost:5432/ethiopian_navigator
JWT_SECRET=your-secret-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
\`\`\`

**ai-chatbot/.env:**
\`\`\`env
FLASK_ENV=development
AZURE_OPENAI_ENDPOINT=your-azure-endpoint
AZURE_OPENAI_API_KEY=your-api-key
# ... add other Azure credentials
\`\`\`

### 3. Set Up Database

**Option A: Using Docker (Recommended)**

\`\`\`bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for it to be ready (5-10 seconds)

# Run migrations
cd backend
npm run migrate

# Set up database and seed data
node scripts/setup-db.js
cd ..
\`\`\`

**Option B: Using Local PostgreSQL**

\`\`\`bash
# Create database
createdb ethiopian_navigator

# Update backend/.env with your PostgreSQL credentials

# Run migrations
cd backend
npm run migrate

# Set up database and seed data
node scripts/setup-db.js
cd ..
\`\`\`

### 4. Test Database Connection

\`\`\`bash
cd backend
node scripts/test-db.js
\`\`\`

You should see confirmation that tables were created and data was seeded.

### 5. Set Up Python AI Chatbot

\`\`\`bash
cd ai-chatbot

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

cd ..
\`\`\`

## Running the Application

You need to run three separate servers:

### Terminal 1: Frontend (Next.js)

\`\`\`bash
npm run dev
\`\`\`

Runs at: http://localhost:3000

### Terminal 2: Backend API

\`\`\`bash
cd backend
npm run dev
\`\`\`

Runs at: http://localhost:5000

### Terminal 3: AI Chatbot

\`\`\`bash
cd ai-chatbot
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
\`\`\`

Runs at: http://localhost:5001

## Default Login Credentials

After running the setup script, you can log in with:

- **Email:** admin@ethiopiannavigator.gov.et
- **Password:** Admin123!
- **Role:** Admin

## Verifying the Setup

1. Open http://localhost:3000 in your browser
2. You should see the landing page with portal selection
3. Click "Login" and use the default credentials
4. Navigate through the different portals

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test the connection
cd backend
node scripts/test-db.js

# If it fails, check:
# 1. PostgreSQL is running: pg_isready
# 2. Database exists: psql -l
# 3. Connection string in backend/.env is correct
\`\`\`

### Port Already in Use

If you get "port already in use" errors:

\`\`\`bash
# Find and kill the process using the port (example for port 3000)
# On Linux/macOS:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Python Dependencies Issues

\`\`\`bash
# Upgrade pip first
pip install --upgrade pip

# Then retry installing dependencies
pip install -r requirements.txt
\`\`\`

### npm/Node Version Issues

\`\`\`bash
# Check versions
node --version  # Should be 18+
npm --version

# If using nvm (recommended):
nvm install 18
nvm use 18
\`\`\`

## Next Steps

After successful setup:

1. Review the [README.md](./README.md) for API documentation
2. Check [QUICK_START.md](./QUICK_START.md) for usage examples
3. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. Review [AZURE_KEYVAULT_SETUP.md](./AZURE_KEYVAULT_SETUP.md) for Azure integration

## Getting Help

If you encounter issues not covered here:

1. Check the logs in each terminal for error messages
2. Review the documentation files
3. Check the GitHub issues
4. Contact the development team

## Development Tools (Optional)

Recommended tools for development:

- **VS Code** with extensions: ESLint, Prettier, Python
- **Postman** or **Insomnia** for API testing
- **pgAdmin** or **DBeaver** for database management
- **Azure Storage Explorer** for Azure resources
