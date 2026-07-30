# Phase 2: Extract Core Microservices
## Implementation Guide & Architecture

**Duration:** 6-8 weeks  
**Team Size:** 6-8 engineers (Backend, Frontend, DevOps)  
**Status:** Ready to Begin

---

## Overview

Phase 2 focuses on extracting the first two core microservices from the monolith:
1. **User Service** - Authentication, user management, profiles
2. **Service Management Service** - Service catalog, requests, workflows

This phase establishes the microservices pattern that will be replicated in subsequent phases.

---

## Phase 2 Architecture

### Services to Extract

#### 1. User Service (Highest Priority)
**Scope:** All user-related operations  
**API Endpoints:** ~15 endpoints  
**Database:** `user_service` schema (from Phase 1)  
**Dependencies:** None (foundational service)

**Current MVP endpoints to migrate:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info
- `POST /api/auth/change-password` - Password change
- `GET /api/users/[id]` - User details
- `PATCH /api/profile` - Profile update
- `GET /api/profile` - Current profile

**Current MVP endpoints to create:**
- `POST /api/users` - Create user (admin)
- `PATCH /api/users/[id]` - Update user (admin)
- `DELETE /api/users/[id]` - Delete user (admin)
- `GET /api/users` - List users (admin)
- `POST /api/users/[id]/roles` - Assign roles (admin)

#### 2. Service Management Service (Second Priority)
**Scope:** Services, requests, workflows  
**API Endpoints:** ~25 endpoints  
**Database:** `service_management` schema  
**Dependencies:** User Service (for user context)

**Current MVP endpoints to migrate:**
- `GET /api/services` - List services
- `GET /api/services/[id]` - Service details
- `GET /api/services/categories` - Service categories
- `POST /api/service-requests` - Create request
- `GET /api/service-requests` - List requests
- `GET /api/requests/[id]` - Request details
- `POST /api/requests/[id]/actions/[action]` - Request actions

---

## API Gateway Layer

### API Contract Definition

Create service interface contracts:

```typescript
// libs/api-contracts/user-service.ts
export interface UserServiceAPI {
  // Authentication
  register(data: RegisterRequest): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<User>;
  
  // User Management
  getUser(userId: string): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  
  // Roles & Permissions
  getUserRoles(userId: string): Promise<Role[]>;
  assignRole(userId: string, roleId: string): Promise<void>;
}

// libs/api-contracts/service-management.ts
export interface ServiceManagementAPI {
  // Services
  listServices(filter: ServiceFilter): Promise<Service[]>;
  getService(serviceId: string): Promise<ServiceDetail>;
  
  // Requests
  createRequest(data: CreateRequestData): Promise<Request>;
  getRequest(requestId: string): Promise<RequestDetail>;
  listRequests(filter: RequestFilter): Promise<Request[]>;
  
  // Workflows
  transitionRequest(requestId: string, action: string): Promise<Request>;
}
```

### Service Discovery

Updated service registry in shared infrastructure:

```sql
INSERT INTO shared_infrastructure.service_registry 
(service_name, instance_id, base_url, health_check_url, metadata)
VALUES 
('user-service', 'user-1', 'http://user-service:3001', 'http://user-service:3001/health', '{}'),
('service-management', 'svc-mgmt-1', 'http://service-management:3002', 'http://service-management:3002/health', '{}');
```

---

## Microservice Implementation Pattern

Each microservice follows this structure:

```
services/
├── user-service/
│   ├── src/
│   │   ├── controller/          # Request handlers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   ├── middleware/          # Auth, logging
│   │   ├── models/              # Interfaces & types
│   │   ├── routes/              # Route definitions
│   │   └── main.ts              # Service entry point
│   ├── tests/
│   │   ├── unit/                # Unit tests
│   │   ├── integration/         # Integration tests
│   │   └── fixtures/            # Test data
│   ├── Dockerfile               # Container definition
│   ├── docker-compose.yml       # Local development
│   └── package.json
```

---

## Implementation Phases

### Week 1-2: User Service Extraction

#### Tasks:
1. Create User Service repository structure
2. Copy user-related code from monolith
3. Create database migrations for `user_service` schema
4. Implement User Service API controllers
5. Set up authentication middleware
6. Write integration tests

#### Key Files to Create:
- `services/user-service/src/controller/auth.controller.ts`
- `services/user-service/src/service/user.service.ts`
- `services/user-service/src/repository/user.repository.ts`
- `services/user-service/src/routes/auth.routes.ts`
- `services/user-service/Dockerfile`
- `services/user-service/tests/integration/auth.test.ts`

### Week 3-4: Service Management Extraction

#### Tasks:
1. Create Service Management Service repository
2. Extract service/request related code
3. Create database migrations for `service_management` schema
4. Implement Service API controllers
5. Set up inter-service communication (User Service)
6. Write integration tests

#### Key Files to Create:
- `services/service-management/src/controller/service.controller.ts`
- `services/service-management/src/service/service.service.ts`
- `services/service-management/src/routes/service.routes.ts`
- `services/service-management/Dockerfile`

### Week 5-6: API Gateway & Service Mesh

#### Tasks:
1. Configure Kong API Gateway
2. Set up routing rules
3. Deploy Istio service mesh
4. Configure mTLS between services
5. Set up circuit breakers
6. Performance testing

### Week 7-8: Testing & Migration

#### Tasks:
1. Comprehensive integration testing
2. Load testing for each service
3. Gradual traffic migration from monolith
4. Rollback procedures
5. Team training
6. Documentation

---

## Service Communication Patterns

### Synchronous (REST/gRPC)
For immediate responses (authentication, lookups):

```typescript
// Service Management calling User Service
const userResponse = await axios.get(
  `${environmentConfig.services.userService.url}/api/users/${userId}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

### Asynchronous (Event-Driven)
For eventual consistency (notifications, audit logs):

```typescript
// User Service publishes event
await eventBus.publish('user.created', {
  userId: user.id,
  email: user.email,
  timestamp: new Date()
});

// Other services subscribe
eventBus.subscribe('user.created', async (event) => {
  await notificationService.sendWelcomeEmail(event.email);
});
```

---

## Database Migration Strategy

### User Service Schema
```sql
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

-- Copy existing users from public.users
INSERT INTO user_service.users SELECT * FROM public.users;
```

### Parallel Running
1. Both monolith and User Service running simultaneously
2. Write to both (double-write pattern)
3. Validate data consistency
4. Gradually shift reads to User Service
5. Finally remove from monolith

---

## Testing Strategy

### Unit Tests
```typescript
// tests/unit/user.service.test.ts
describe('UserService', () => {
  describe('register', () => {
    it('should hash password before storing', () => {
      // Test password hashing
    });
    
    it('should prevent duplicate emails', () => {
      // Test email uniqueness
    });
  });
});
```

### Integration Tests
```typescript
// tests/integration/auth.test.ts
describe('Auth API', () => {
  it('POST /api/auth/register should create user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);
  });
});
```

### Load Testing
```
Tools: k6, Apache JMeter, or Locust
Target: 100 concurrent users
Scenarios:
- User login stress test
- Service listing under load
- Concurrent request submissions
```

---

## Deployment Strategy

### Blue-Green Deployment
1. Deploy new service (green) alongside existing (blue)
2. Test new service thoroughly
3. Switch traffic to new service
4. Keep old service running for rollback

### Canary Deployment
1. Deploy to small % of traffic (5%)
2. Monitor error rates
3. Gradually increase to 100%
4. Full rollback capability at each stage

---

## Success Criteria

Phase 2 is successful when:

✅ User Service deployed independently with 99.9% uptime  
✅ Service Management Service deployed independently  
✅ API Gateway routing working correctly  
✅ All 40+ integration tests passing  
✅ Load test shows < 100ms response time  
✅ Zero data loss in migration  
✅ Team confident with microservices pattern  
✅ Monitoring shows service health  

---

## Deliverables

1. ✓ User Service (fully functional, tested, deployed)
2. ✓ Service Management Service (fully functional, tested, deployed)
3. ✓ API Gateway with routing rules
4. ✓ API service contracts & interfaces
5. ✓ Service-to-service communication patterns
6. ✓ Integration test suite (40+ tests)
7. ✓ Deployment procedures & runbooks
8. ✓ Team training & documentation

---

## Phase 3 Gate

Before starting Phase 3 (AI Intelligence), ensure:

- [ ] Both services running reliably in production
- [ ] All health checks passing
- [ ] Zero incidents for 1 week
- [ ] Team comfortable with microservices pattern
- [ ] Database scaling proven
- [ ] Monitoring & alerting operational

---

**Document Version:** 1.0  
**Status:** Ready for Development  
**Next Phase:** Phase 3 (AI Intelligence Layer)
