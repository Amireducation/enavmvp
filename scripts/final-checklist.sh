#!/bin/bash

echo "======================================="
echo "Ethiopian Navigator - Final Deployment Checklist"
echo "======================================="
echo ""

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo "✓ $1"
    PASS=$((PASS + 1))
}

check_fail() {
    echo "✗ $1"
    FAIL=$((FAIL + 1))
}

check_warn() {
    echo "⚠ $1"
    WARN=$((WARN + 1))
}

echo "1. Environment Configuration"
echo "----------------------------"

# Check .env files
if [ -f "backend/.env" ]; then
    check_pass "Backend .env exists"
else
    check_fail "Backend .env missing"
fi

if [ -f "ai-chatbot/.env" ]; then
    check_pass "AI Chatbot .env exists"
else
    check_fail "AI Chatbot .env missing"
fi

echo ""
echo "2. Dependencies"
echo "---------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    check_pass "Python installed: $PYTHON_VERSION"
else
    check_fail "Python 3 not installed"
fi

# Check PostgreSQL or Docker
if command -v psql &> /dev/null; then
    check_pass "PostgreSQL installed"
elif command -v docker &> /dev/null; then
    check_pass "Docker available (can run PostgreSQL)"
else
    check_fail "Neither PostgreSQL nor Docker found"
fi

echo ""
echo "3. Database"
echo "-----------"

# Check if database is accessible
if [ -f "backend/.env" ]; then
    cd backend
    if node scripts/test-db.js &> /dev/null; then
        check_pass "Database connection successful"
    else
        check_fail "Cannot connect to database"
    fi
    cd ..
fi

echo ""
echo "4. Security"
echo "-----------"

# Check for hardcoded secrets
if grep -r "password.*=" --include="*.js" --include="*.ts" backend/ | grep -v "bcrypt" | grep -v ".env" | grep -v "Password" > /dev/null; then
    check_warn "Potential hardcoded passwords found"
else
    check_pass "No obvious hardcoded passwords"
fi

# Check JWT secret
if grep -q "JWT_SECRET=your-secret-key" backend/.env 2>/dev/null; then
    check_fail "Default JWT_SECRET still in use - CHANGE THIS!"
else
    check_pass "JWT_SECRET appears customized"
fi

echo ""
echo "5. Azure Configuration"
echo "----------------------"

# Check Azure CLI
if command -v az &> /dev/null; then
    check_pass "Azure CLI installed"
else
    check_warn "Azure CLI not installed (needed for deployment)"
fi

# Check for Azure credentials in .env
if grep -q "AZURE_KEYVAULT_URL" backend/.env 2>/dev/null; then
    check_pass "Azure Key Vault configured"
else
    check_warn "Azure Key Vault not configured"
fi

echo ""
echo "6. Documentation"
echo "----------------"

DOCS=("README.md" "DEPLOYMENT.md" "TESTING.md" "QUICK_START.md" "DATABASE.md" "SETUP_GUIDE.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc missing"
    fi
done

echo ""
echo "7. Code Quality"
echo "---------------"

# Check for npm audit issues
cd backend
AUDIT_OUTPUT=$(npm audit --json 2>/dev/null | grep -o '"high":[0-9]*' | cut -d':' -f2)
if [ -z "$AUDIT_OUTPUT" ] || [ "$AUDIT_OUTPUT" = "0" ]; then
    check_pass "No high severity npm vulnerabilities"
else
    check_fail "High severity npm vulnerabilities found: $AUDIT_OUTPUT"
fi
cd ..

echo ""
echo "======================================="
echo "Summary"
echo "======================================="
echo "Passed:   $PASS"
echo "Failed:   $FAIL"
echo "Warnings: $WARN"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo "🎉 All checks passed! Ready for deployment."
    exit 0
elif [ $FAIL -eq 0 ]; then
    echo "⚠️  Some warnings found. Review before deployment."
    exit 0
else
    echo "❌ Failed checks found. Fix issues before deployment."
    exit 1
fi
