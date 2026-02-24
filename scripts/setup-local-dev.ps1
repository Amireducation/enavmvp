# PowerShell version of setup script for Windows users

Write-Host "=== Ethiopian Navigator - Local Development Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "Error: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green

# Check for npm
$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "Error: npm is not installed." -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green

# Check for Docker
$dockerVersion = docker --version 2>$null
if ($dockerVersion) {
    Write-Host "✓ Docker version: $dockerVersion" -ForegroundColor Green
    $dockerAvailable = $true
} else {
    Write-Host "⚠ Docker not found. You'll need to install PostgreSQL manually." -ForegroundColor Yellow
    $dockerAvailable = $false
}

Write-Host ""
Write-Host "Step 1: Creating environment files..." -ForegroundColor Cyan

# Backend .env
if (-not (Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✓ Created backend/.env (please update with your credentials)" -ForegroundColor Green
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

# AI Chatbot .env
if (-not (Test-Path "ai-chatbot/.env")) {
    Copy-Item "ai-chatbot/.env.example" "ai-chatbot/.env"
    Write-Host "✓ Created ai-chatbot/.env (please update with your Azure credentials)" -ForegroundColor Green
} else {
    Write-Host "✓ ai-chatbot/.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan

Write-Host "Installing frontend dependencies..."
npm install

Write-Host "Installing backend dependencies..."
Set-Location backend
npm install
Set-Location ..

Write-Host ""
Write-Host "Step 3: Database setup..." -ForegroundColor Cyan

if ($dockerAvailable) {
    Write-Host "Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    
    Write-Host "Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 5
    
    Write-Host "Running database migrations..."
    Set-Location backend
    npm run migrate
    
    Write-Host "Setting up database and seeding data..."
    node scripts/setup-db.js
    Set-Location ..
} else {
    Write-Host "⚠ Please ensure PostgreSQL is installed and running." -ForegroundColor Yellow
    Write-Host "  Then run: cd backend; npm run migrate; node scripts/setup-db.js"
}

Write-Host ""
Write-Host "Step 4: Python AI Chatbot setup..." -ForegroundColor Cyan

$pythonVersion = python --version 2>$null
if ($pythonVersion) {
    Write-Host "✓ Python version: $pythonVersion" -ForegroundColor Green
    
    Set-Location ai-chatbot
    
    if (-not (Test-Path "venv")) {
        Write-Host "Creating Python virtual environment..."
        python -m venv venv
    }
    
    Write-Host "Installing Python dependencies..."
    & venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    deactivate
    
    Set-Location ..
} else {
    Write-Host "⚠ Python 3 not found. Please install Python 3.8+ to use the AI chatbot." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update backend/.env with your database credentials"
Write-Host "2. Update ai-chatbot/.env with your Azure credentials"
Write-Host "3. Start the development servers:"
Write-Host ""
Write-Host "   Terminal 1 (Frontend): npm run dev"
Write-Host "   Terminal 2 (Backend):  cd backend; npm run dev"
Write-Host "   Terminal 3 (Chatbot):  cd ai-chatbot; venv\Scripts\Activate.ps1; python app.py"
Write-Host ""
Write-Host "Access the application at: http://localhost:3000"
Write-Host "Backend API at: http://localhost:5000"
Write-Host "AI Chatbot at: http://localhost:5001"
