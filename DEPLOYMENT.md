# Ethiopian Navigator MVP - Deployment Guide

## Overview
Complete deployment guide for Ethiopian Navigator MVP across local development, staging, and production environments.

## Prerequisites
- Azure subscription with appropriate resources provisioned
- Docker & Docker Compose installed
- Node.js 18+ and Python 3.11+ installed
- Git configured with SSH keys
- Azure CLI authenticated: `az login`

## Local Development Setup

### 1. Clone and Initialize
\`\`\`bash
git clone https://github.com/your-org/ethiopian-navigator.git
cd ethiopian-navigator
\`\`\`

### 2. Start All Services
\`\`\`bash
docker-compose up -d
\`\`\`

This starts:
- PostgreSQL database (port 5432)
- Backend API (port 5000)
- AI Chatbot (port 8000)
- Frontend (port 3000)

### 3. Initialize Database
\`\`\`bash
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
\`\`\`

### 4. Verify Services
\`\`\`bash
# Backend health
curl http://localhost:5000/api/status

# Chatbot health
curl http://localhost:8000/health

# Frontend
open http://localhost:3000
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
POSTGRES_CONN_STRING=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
\`\`\`

### AI Chatbot (.env)
\`\`\`
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_SEARCH_ENDPOINT=https://your-resource.search.windows.net
AZURE_SEARCH_API_KEY=your-key
COSMOS_CONNECTION_STRING=your-connection-string
\`\`\`

## Production Deployment to Azure

### 1. Build and Push Docker Images
\`\`\`bash
az acr build --registry ethiopiannavigator --image backend:latest --file Dockerfile.backend .
az acr build --registry ethiopiannavigator --image chatbot:latest --file Dockerfile.chatbot .
\`\`\`

### 2. Deploy with Azure Container Instances
\`\`\`bash
az container create \
  --resource-group ethiopian-navigator-rg \
  --name navigator-backend \
  --image ethiopiannavigator.azurecr.io/backend:latest \
  --ports 5000 \
  --environment-variables POSTGRES_CONN_STRING=$POSTGRES_CONN_STRING JWT_SECRET=$JWT_SECRET
\`\`\`

### 3. Deploy Frontend to Static Web Apps
\`\`\`bash
npm run build
az staticwebapp create \
  --name navigator-frontend \
  --resource-group ethiopian-navigator-rg \
  --source . \
  --branch main
\`\`\`

## Monitoring & Logging

### Application Insights
- Backend metrics: Application Insights automatic instrumentation
- Frontend errors: Telemetry client integration
- Chatbot interactions: Cosmos DB logging

### View Logs
\`\`\`bash
# Container logs
az container logs --name navigator-backend --resource-group ethiopian-navigator-rg

# Application Insights
az monitor app-insights query --app navigator-insights \
  --analytics-query "requests | where timestamp > ago(1d)"
\`\`\`

## Scaling Configuration

### Auto-scaling Rules
- CPU > 70% → Scale up
- Memory > 80% → Scale up
- Requests/min > 1000 → Scale up

### Database Connection Pooling
- Min connections: 10
- Max connections: 100
- Idle timeout: 30s

## Backup & Disaster Recovery

### Database Backups
\`\`\`bash
# Automated daily backups to 35 days
az postgres flexible-server backup create \
  --resource-group ethiopian-navigator-rg \
  --server-name navigator-db \
  --backup-name manual-backup-1
\`\`\`

### Restore from Backup
\`\`\`bash
az postgres flexible-server restore \
  --resource-group ethiopian-navigator-rg \
  --server-name navigator-db-restored \
  --source-server navigator-db \
  --restore-time "2025-01-20T12:00:00"
\`\`\`

## Troubleshooting

### Backend Connection Issues
\`\`\`bash
# Test database connection
az postgres flexible-server execute \
  --name navigator-db \
  --username navigator \
  --query "SELECT 1"
\`\`\`

### Chatbot API Errors
\`\`\`bash
# Check Azure OpenAI connectivity
curl -X POST https://your-resource.openai.azure.com/openai/deployments/gpt-4/chat/completions \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H "Content-Type: application/json"
\`\`\`

## Maintenance Tasks

### Regular Updates
- Weekly security patches for dependencies
- Monthly Azure service updates
- Quarterly major version upgrades

### Performance Optimization
- Query optimization: Run explain plans on slow queries
- Cache invalidation: Monitor Redis hit rates
- CDN configuration: Cache static assets

## Support & Escalation

For production issues:
1. Check Application Insights dashboard
2. Review container logs
3. Contact Azure support with subscription details
\`\`\`
