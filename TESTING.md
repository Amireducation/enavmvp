# Ethiopian Navigator MVP - Testing Guide

## Overview
Comprehensive testing strategy covering unit, integration, E2E, and performance testing.

## Unit Tests

### Backend
\`\`\`bash
cd backend
npm test -- --coverage
\`\`\`

**Coverage Targets:**
- Controllers: 80%+
- Models: 90%+
- Middleware: 85%+
- Utilities: 90%+

### Frontend
\`\`\`bash
npm test -- --coverage
\`\`\`

### Chatbot
\`\`\`bash
cd ai-chatbot
python -m pytest --cov=. --cov-report=html
\`\`\`

## Integration Tests

### Backend API
\`\`\`bash
npm run test:integration
\`\`\`

Tests authentication, services, applications, feedback flows.

### Chatbot Integration
\`\`\`bash
python -m pytest tests/integration/ -v
\`\`\`

Tests Azure OpenAI, search, translation services.

## End-to-End Tests

### User Flows
\`\`\`bash
# Citizen registration → service discovery → application submission
npm run test:e2e -- citizen-flow

# Employee dashboard → application review
npm run test:e2e -- employee-flow

# Admin → user management
npm run test:e2e -- admin-flow
\`\`\`

## Performance Testing

### Load Testing with k6
\`\`\`bash
k6 run scripts/load-test.js --vus 100 --duration 5m
\`\`\`

**Target Metrics:**
- API response time: < 2s (p95)
- Chatbot response time: < 3s (p95)
- Frontend load time: < 3s
- Concurrent users: 10,000+

## Security Testing

### OWASP Top 10
\`\`\`bash
# SQL injection tests
# XSS vulnerability tests
# CSRF token validation
# Authentication bypass attempts
npm run test:security
\`\`\`

### Dependency Scanning
\`\`\`bash
npm audit
npm audit --production
python -m pip-audit
\`\`\`

## Browser Compatibility

Testing Matrix:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

\`\`\`
