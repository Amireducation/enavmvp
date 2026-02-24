## Contributing to Ethiopian Navigator MVP

Short actionable guide for contributors and automated agents.

### 1. Branching
- Feature branches: `feat/<short-desc>`
- Bug fixes: `fix/<short-desc>`
- Docs: `docs/<short-desc>`
- Example: `feat/multilingual-search` or `fix/auth-token-expiry`

### 2. Local Development
\`\`\`bash
# Start all services
docker-compose up -d

# Verify all services healthy
curl http://localhost:5000/api/status
curl http://localhost:8000/health
curl http://localhost:3000
\`\`\`

### 3. Testing Before PR
\`\`\`bash
# Backend
cd backend && npm test && npm run smoke-test

# Frontend
npm run lint && npm run build

# Chatbot
cd ai-chatbot && python -m pytest
\`\`\`

### 4. Code Quality
- Backend: ESLint + Prettier (auto-format on commit)
- Frontend: TypeScript strict mode + ESLint
- Python: Black + Pylint (flake8 for AI code)

### 5. Commit Messages
Format: `<type>(<scope>): <subject>`
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Example: `feat(auth): add OAuth2 support for citizen login`

### 6. Pull Request Process
1. Update documentation
2. Add/update tests (> 80% coverage)
3. Ensure CI passes
4. Request review from maintainers
5. Address feedback
6. Merge after approval

### 7. New Routes & Models
- Routes: `backend/routes/[feature].js`
- Models: `backend/models/[entity].js`
- Tests: `backend/tests/[feature].test.js`

### 8. Deployment Process
- Commits to `develop` → Staging deploy
- Commits to `main` → Production deploy
- Tags → Docker image release
