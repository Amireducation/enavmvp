# API Gateway Setup Guide
## Kong Configuration for Ethiopian Navigator

**Status:** Ready to Deploy  
**Services:** 2 microservices routing configured  
**Rate Limiting:** Yes (per-service)  
**Health Checks:** Yes  

---

## Quick Start

### 1. Start All Services
```bash
cd infrastructure/kong
docker-compose up -d
```

### 2. Configure Routes
```bash
bash configure-routes.sh
```

### 3. Verify Gateway
```bash
# Health check
curl http://localhost:8000/api/services

# Check Kong admin
curl http://localhost:8001/services

# Access Konga UI
open http://localhost:1337
```

---

## Architecture

```
┌─────────────────┐
│   Client Apps   │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │  Kong   │ (API Gateway)
    │ :8000   │
    └────┬────┘
         │
    ┌────┴─────────────────────┐
    │                           │
    ▼                           ▼
┌──────────┐            ┌─────────────────┐
│  User    │            │  Service Mgmt   │
│ Service  │            │   Service       │
│ :3001    │            │    :3002        │
└──────────┘            └─────────────────┘
```

---

## Service Configuration

### User Service
- **URL:** http://user-service:3001
- **Routes:** 
  - `/api/auth` - Authentication endpoints
  - `/api/users` - User management
  - `/api/profile` - Profile operations
- **Rate Limit:** 200 requests/minute

### Service Management Service
- **URL:** http://service-management:3002
- **Routes:**
  - `/api/services` - Service catalog
  - `/api/requests` - Request management
- **Rate Limit:** 150 requests/minute

---

## Adding New Services

When you add Phase 3, 4, 5, or 6 services:

```bash
# Add to docker-compose.yml under services:
  ai-service:
    build: ../services/ai-service
    environment:
      DATABASE_URL: ${DATABASE_URL}
      GROQ_API_KEY: ${GROQ_API_KEY}
    networks:
      - enav-network

# Then run configure-routes.sh to update Kong
```

---

## Monitoring

### Kong Metrics
```bash
# Check service status
curl http://localhost:8001/services

# Check routes
curl http://localhost:8001/routes

# Check plugins
curl http://localhost:8001/plugins
```

### Service Health
```bash
# User Service
curl http://user-service:3001/health

# Service Management
curl http://service-management:3002/health
```

---

## Troubleshooting

### Service Not Reachable
```bash
# Check service is running
docker ps | grep -E "user-service|service-management"

# Check Kong routing
curl http://localhost:8001/services/user-service

# Check network
docker network ls
docker network inspect kong_enav-network
```

### Rate Limiting Issues
```bash
# Check rate limiting config
curl http://localhost:8001/services/user-service/plugins

# Temporarily increase limit (during load test)
curl -X PATCH http://localhost:8001/services/user-service/plugins/{plugin_id} \
  -d "config.minute=500"
```

### Database Connection Error
```bash
# Verify Kong DB
docker exec kong-db psql -U kong -d kong -c "SELECT * FROM services;"
```

---

## Production Considerations

### For Production Deployment:
1. Use Kubernetes instead of Docker Compose
2. Configure HTTPS/mTLS between services
3. Add circuit breakers and timeouts
4. Enable request logging and tracing
5. Set up alerting on rate limits
6. Use managed Kong service or self-hosted cluster
7. Configure backup and disaster recovery

### Environment Variables Needed
```bash
KONG_ADMIN_URL=http://localhost:8001
USER_SERVICE_URL=http://user-service:3001
SERVICE_MGMT_URL=http://service-management:3002
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

---

## API Gateway Features

✅ Request routing  
✅ Rate limiting  
✅ Health checks  
✅ Request logging  
✅ Admin UI (Konga)  
✅ Service discovery  
✅ Load balancing  
✅ Plugin ecosystem  

---

**Status:** Phase 2 API Gateway Ready  
**Next:** Deploy services and test routing
