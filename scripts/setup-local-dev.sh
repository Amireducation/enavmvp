#!/bin/bash

echo "=== Ethiopian Navigator - Local Development Setup ==="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    exit 1
fi

echo "✓ npm version: $(npm --version)"

# Check for Docker (optional but recommended)
if command -v docker &> /dev/null; then
    echo "✓ Docker version: $(docker --version)"
    DOCKER_AVAILABLE=true
else
    echo "⚠ Docker not found. You'll need to install PostgreSQL manually."
    DOCKER_AVAILABLE=false
fi

echo ""
echo "Step 1: Creating environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env (please update with your credentials)"
else
    echo "✓ backend/.env already exists"
fi

# AI Chatbot .env
if [ ! -f ai-chatbot/.env ]; then
    cp ai-chatbot/.env.example ai-chatbot/.env
    echo "✓ Created ai-chatbot/.env (please update with your Azure credentials)"
else
    echo "✓ ai-chatbot/.env already exists"
fi

echo ""
echo "Step 2: Installing dependencies..."

# Install root dependencies (Next.js frontend)
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "Step 3: Database setup..."

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    echo "Running database migrations..."
    cd backend
    npm run migrate
    
    echo "Setting up database and seeding data..."
    node scripts/setup-db.js
    cd ..
else
    echo "⚠ Please ensure PostgreSQL is installed and running."
    echo "  Then run: cd backend && npm run migrate && node scripts/setup-db.js"
fi

echo ""
echo "Step 4: Python AI Chatbot setup..."

if command -v python3 &> /dev/null; then
    echo "✓ Python version: $(python3 --version)"
    
    cd ai-chatbot
    
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Installing Python dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
    deactivate
    
    cd ..
else
    echo "⚠ Python 3 not found. Please install Python 3.8+ to use the AI chatbot."
fi

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Update ai-chatbot/.env with your Azure credentials"
echo "3. Start the development servers:"
echo ""
echo "   Terminal 1 (Frontend): npm run dev"
echo "   Terminal 2 (Backend):  cd backend && npm run dev"
echo "   Terminal 3 (Chatbot):  cd ai-chatbot && source venv/bin/activate && python app.py"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Backend API at: http://localhost:5000"
echo "AI Chatbot at: http://localhost:5001"
