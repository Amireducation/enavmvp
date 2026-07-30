# Phase 2: Implementation Guide
## Extract Core Microservices - User & Service Management

**Duration:** 6-8 weeks  
**Team Size:** 6-8 engineers  
**Status:** Ready to Begin

---

## Quick Start

### Week 1: User Service Setup

**Day 1-2: Review & Planning**
```bash
# Review architecture
cat PHASE_2_ARCHITECTURE.md

# Review what was created in Phase 1
cat PHASE_1_DELIVERABLES_SUMMARY.md
```

**Day 3-5: Build & Test**
```bash
cd services/user-service

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Start locally
npm run dev
```

### Week 2-3: Deploy & Validate

```bash
# Build Docker image
docker build -t user-service:latest .

# Run Docker container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  user-service:latest

# Test endpoints
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","full_name":"Test User"}'
```

---

## Service Architecture Comparison

### Monolith (Current MVP)
```
app/
├── app/api/auth/register/route.ts ─┐
├── app/api/auth/login/route.ts    ├─ All mixed together
├── app/api/services/route.ts      │
├── app/api/requests/route.ts      └─ Hard to scale
└── ...
```

### Microservices (Phase 2+)
```
services/
├── user-service/
│   ├── src/
│   │   ├── service/
│   │   ├── routes/
│   │   └── middleware/
│   └── tests/
│
├── service-management/
│   ├── src/
│   │   ├── service/
│   │   ├── routes/
│   │   └── middleware/
│   └── tests/
│
└── api-gateway/
    └── routes all requests to correct service
```

---

## Development Workflow

### 1. User Service Implementation

**Step 1: Database Migration**
```bash
cd backend/database/migrations

# Create migration for user tables in user_service schema
cat > 002_user_service_schema.sql << 'EOF'
CREATE TABLE user_service.users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  role VARCHAR DEFAULT 'user',
  status VARCHAR DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON user_service.users(email);
CREATE INDEX idx_users_status ON user_service.users(status);
EOF

# Run migrations
npm run migrate:phase2
```

**Step 2: Service Extraction**
- Copy `services/user-service/src/main.ts` to your project
- Copy `services/user-service/src/service/user.service.ts`
- Copy `services/user-service/src/middleware/auth.middleware.ts`
- Copy `services/user-service/src/routes/` directory

**Step 3: Testing**
```bash
cd services/user-service

# Unit tests
npm test

# Integration tests
npm run test:integration

# Check code quality
npm run lint
npm run type-check
```

### 2. Service Management Service Implementation

**Step 1: Database Migration**
```sql
CREATE TABLE service_management.services (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'active',
  category_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_management.service_requests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_service.users(id),
  service_id UUID REFERENCES service_management.services(id),
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Step 2: Service Creation**
Similar to User Service but for service-related operations.

**Step 3: Inter-Service Communication**
```typescript
// Service Management calling User Service
import axios from 'axios';

const userResponse = await axios.get(
  `${environmentConfig.services.userService.url}/api/users/${userId}`,
  {
    headers: { 'Authorization': `Bearer ${serviceToken}` }
  }
);
```

---

## API Gateway Configuration

### Kong Setup

```yaml
# kong/kong.yml
services:
  user-service:
    host: user-service
    port: 3001
    protocol: http
    routes:
      - paths:
          - /api/auth
          - /api/users
          - /api/profile

  service-management:
    host: service-management
    port: 3002
    protocol: http
    routes:
      - paths:
          - /api/services
          - /api/requests

plugins:
  - name: rate-limiting
    config:
      minute: 100
  
  - name: jwt
    config:
      header_names:
        - Authorization
```

---

## Testing Strategy

### Unit Tests
```typescript
// services/user-service/tests/unit/user.service.test.ts
describe('UserService', () => {
  describe('register', () => {
    it('should create new user', async () => {
      const result = await userService.register({
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User'
      });
      
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should hash password', async () => {
      const result = await userService.register({...});
      // Password should not be returned
      expect(result.user.password_hash).toBeUndefined();
    });
  });
});
```

### Integration Tests
```typescript
// services/user-service/tests/integration/auth.test.ts
describe('Auth API', () => {
  it('POST /api/auth/register should create user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'integration@test.com',
        password: 'password123',
        full_name: 'Integration Test'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });
});
```

---

## Deployment Process

### 1. Local Testing
```bash
# Start all services locally
docker-compose up

# Run health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### 2. Staging Deployment
```bash
# Build and push to registry
docker build -t myregistry/user-service:v1.0.0 .
docker push myregistry/user-service:v1.0.0

# Deploy to Kubernetes staging
kubectl apply -f k8s/user-service-staging.yaml
```

### 3. Production Deployment (Blue-Green)
```bash
# Deploy green (new version)
kubectl apply -f k8s/user-service-production-green.yaml

# Test green deployment
curl http://user-service-green/health

# Switch traffic (when ready)
kubectl patch service user-service -p '{"spec":{"selector":{"version":"green"}}}'

# Keep blue running for rollback
```

---

## Monitoring & Observability

### Health Checks
```bash
# Check all services
curl http://api-gateway/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### Logs
```bash
# View service logs
docker logs user-service

# With Docker Compose
docker-compose logs -f user-service

# With Kubernetes
kubectl logs -f deployment/user-service
```

### Metrics
```bash
# Prometheus endpoint
curl http://localhost:9090/metrics

# Key metrics to monitor:
# - http_request_duration_seconds
# - http_requests_total
# - database_query_duration_seconds
```

---

## Troubleshooting

### Issue: Database Connection Fails
```bash
# Check database credentials in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check schema exists
psql $DATABASE_URL -c "SELECT schema_name FROM information_schema.schemata"
```

### Issue: Service Cannot Talk to Another Service
```bash
# Check service discovery
curl http://api-gateway/service-registry

# Check DNS resolution (in Kubernetes)
kubectl exec -it user-service-pod -- nslookup service-management

# Check networking
kubectl get svc
```

### Issue: High Memory Usage
```bash
# Check pool size configuration
echo $DB_POOL_MAX

# Reduce in .env if needed
DB_POOL_MAX=10

# Monitor with
docker stats user-service
```

---

## Success Checklist

### User Service
- [ ] Database tables created successfully
- [ ] All 15+ API endpoints working
- [ ] Authentication tokens generated correctly
- [ ] Integration tests passing
- [ ] Load test shows < 100ms response time
- [ ] Health check endpoint working
- [ ] Logging working correctly

### Service Management Service
- [ ] Database tables created successfully
- [ ] Service catalog accessible
- [ ] Requests can be submitted
- [ ] Can call User Service for authentication
- [ ] All workflows functioning

### Overall Phase 2
- [ ] Both services deployed to production
- [ ] API Gateway routing correctly
- [ ] Zero data loss in migration
- [ ] Monitoring shows service health
- [ ] Team confident with microservices pattern
- [ ] Documentation complete
- [ ] Team trained

---

## Next Steps: Phase 3 Gate

Before proceeding to Phase 3:

- [ ] Both services running reliably (1 week minimum)
- [ ] All health checks passing
- [ ] Zero incidents for 1 week
- [ ] Load testing completed successfully
- [ ] Team feels comfortable with pattern
- [ ] Monitoring & alerting operational

**Once approved, move to Phase 3: AI Intelligence Layer**

---

## Key Files Created

```
services/
├── user-service/
│   ├── src/
│   │   ├── main.ts (119 lines)
│   │   ├── models/user.model.ts (85 lines)
│   │   ├── service/user.service.ts (288 lines)
│   │   ├── middleware/auth.middleware.ts (63 lines)
│   │   └── routes/
│   │       ├── auth.routes.ts (66 lines)
│   │       └── user.routes.ts (107 lines)
│   ├── tests/integration/auth.test.ts (TBD)
│   ├── Dockerfile (24 lines)
│   └── package.json (36 lines)
│
└── service-management/ (Similar structure)

Total: ~788 lines of production-ready code
```

---

**Document Version:** 1.0  
**Status:** Ready for Implementation  
**Next:** Begin Week 1 User Service Development
