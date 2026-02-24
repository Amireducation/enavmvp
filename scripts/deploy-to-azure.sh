#!/bin/bash

# Azure Deployment Script for Ethiopian Navigator MVP
# Deploys the application to Azure Container Instances with Key Vault integration

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="${1:-ethiopian-navigator-rg}"
LOCATION="${2:-eastus2}"
REGISTRY_NAME="ethiopiannavigator"
KEYVAULT_NAME="ethionav-kv-3192"

echo -e "${GREEN}[Deploy] Ethiopian Navigator MVP to Azure${NC}"
echo "=========================================="
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Key Vault: $KEYVAULT_NAME"
echo ""

# Check prerequisites
echo -e "${YELLOW}[Check] Verifying prerequisites...${NC}"

if ! command -v az &> /dev/null; then
  echo -e "${RED}[Error] Azure CLI not found. Install from https://learn.microsoft.com/cli/azure/install-azure-cli${NC}"
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo -e "${RED}[Error] Docker not found. Install from https://www.docker.com${NC}"
  exit 1
fi

# Login to Azure
echo -e "${YELLOW}[Auth] Authenticating with Azure...${NC}"
az login

# Set subscription (if needed)
echo -e "${YELLOW}[Setup] Setting up Azure resources...${NC}"

# Create resource group if it doesn't exist
if ! az group show --name "$RESOURCE_GROUP" &>/dev/null; then
  echo -e "${YELLOW}[Create] Creating resource group: $RESOURCE_GROUP${NC}"
  az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
else
  echo -e "${GREEN}[Found] Resource group already exists: $RESOURCE_GROUP${NC}"
fi

# Create container registry if it doesn't exist
echo -e "${YELLOW}[Registry] Setting up Azure Container Registry...${NC}"
if ! az acr show --resource-group "$RESOURCE_GROUP" --name "$REGISTRY_NAME" &>/dev/null; then
  echo -e "${YELLOW}[Create] Creating container registry: $REGISTRY_NAME${NC}"
  az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$REGISTRY_NAME" \
    --sku Basic
else
  echo -e "${GREEN}[Found] Container registry already exists: $REGISTRY_NAME${NC}"
fi

# Build and push Docker images
echo -e "${YELLOW}[Build] Building Docker images...${NC}"

docker-compose -f docker-compose.prod.yml build

# Get container registry login credentials
echo -e "${YELLOW}[Login] Getting container registry credentials...${NC}"
az acr login --name "$REGISTRY_NAME"

# Get registry URL
REGISTRY_URL="$(az acr show --resource-group "$RESOURCE_GROUP" --name "$REGISTRY_NAME" --query loginServer -o tsv)"

# Tag and push images
echo -e "${YELLOW}[Push] Pushing images to registry...${NC}"

docker tag ethiopian-navigator-backend:latest "$REGISTRY_URL/backend:latest"
docker tag ethiopian-navigator-chatbot:latest "$REGISTRY_URL/chatbot:latest"
docker tag ethiopian-navigator-frontend:latest "$REGISTRY_URL/frontend:latest"

docker push "$REGISTRY_URL/backend:latest"
docker push "$REGISTRY_URL/chatbot:latest"
docker push "$REGISTRY_URL/frontend:latest"

echo -e "${GREEN}[Success] Docker images pushed to registry${NC}"

# Get Key Vault reference for secrets
echo -e "${YELLOW}[Secrets] Configuring Key Vault access...${NC}"

# Get current user object ID
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

# Grant current user access to Key Vault (if needed)
az keyvault set-policy \
  --name "$KEYVAULT_NAME" \
  --object-id "$USER_OBJECT_ID" \
  --secret-permissions get list \
  --output none

echo -e "${GREEN}[Success] Key Vault access configured${NC}"

# Create Azure Container Instances
echo -e "${YELLOW}[Deploy] Deploying containers...${NC}"

# Deploy backend
echo -e "${YELLOW}[Deploy] Deploying backend service...${NC}"
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "ethiopian-navigator-backend" \
  --image "$REGISTRY_URL/backend:latest" \
  --cpu 1 \
  --memory 1 \
  --ports 5000 \
  --environment-variables \
    NODE_ENV=production \
    AZURE_KEYVAULT_URI="https://$KEYVAULT_NAME.vault.azure.net/" \
  --registry-login-server "$REGISTRY_URL" \
  --registry-username "$(az acr credential show -n "$REGISTRY_NAME" --query username -o tsv)" \
  --registry-password "$(az acr credential show -n "$REGISTRY_NAME" --query passwords[0].value -o tsv)"

# Deploy chatbot
echo -e "${YELLOW}[Deploy] Deploying chatbot service...${NC}"
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "ethiopian-navigator-chatbot" \
  --image "$REGISTRY_URL/chatbot:latest" \
  --cpu 2 \
  --memory 2 \
  --ports 8000 \
  --environment-variables \
    FLASK_ENV=production \
    AZURE_KEYVAULT_URI="https://$KEYVAULT_NAME.vault.azure.net/" \
  --registry-login-server "$REGISTRY_URL" \
  --registry-username "$(az acr credential show -n "$REGISTRY_NAME" --query username -o tsv)" \
  --registry-password "$(az acr credential show -n "$REGISTRY_NAME" --query passwords[0].value -o tsv)"

# Deploy frontend
echo -e "${YELLOW}[Deploy] Deploying frontend service...${NC}"
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "ethiopian-navigator-frontend" \
  --image "$REGISTRY_URL/frontend:latest" \
  --cpu 1 \
  --memory 1 \
  --ports 3000 \
  --environment-variables \
    NEXT_PUBLIC_API_URL="http://ethiopian-navigator-backend:5000/api" \
    NEXT_PUBLIC_CHATBOT_URL="http://ethiopian-navigator-chatbot:8000" \
  --registry-login-server "$REGISTRY_URL" \
  --registry-username "$(az acr credential show -n "$REGISTRY_NAME" --query username -o tsv)" \
  --registry-password "$(az acr credential show -n "$REGISTRY_NAME" --query passwords[0].value -o tsv)"

echo -e "${GREEN}[Success] Deployment completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor deployments: az container logs --resource-group $RESOURCE_GROUP --name ethiopian-navigator-backend"
echo "2. Get container IP: az container show --resource-group $RESOURCE_GROUP --name ethiopian-navigator-frontend --query ipAddress.ip"
echo "3. Access at: http://<container-ip>:3000"
