#!/bin/bash

# Setup Azure Deployment Environment
# Creates necessary Azure resources and configures for deployment

set -e

echo "[Setup] Azure Deployment Environment Configuration"
echo "=================================================="

# Get inputs
RESOURCE_GROUP="${1:-ethiopian-navigator-rg}"
KEYVAULT_NAME="${2:-ethionav-kv-3192}"
LOCATION="${3:-eastus2}"

echo "Resource Group: $RESOURCE_GROUP"
echo "Key Vault: $KEYVAULT_NAME"
echo "Location: $LOCATION"
echo ""

# Verify Resource Group exists
echo "[Check] Verifying Resource Group..."
if ! az group show --name "$RESOURCE_GROUP" &>/dev/null; then
  echo "[Error] Resource group not found: $RESOURCE_GROUP"
  exit 1
fi

# Verify Key Vault exists
echo "[Check] Verifying Key Vault..."
if ! az keyvault show --name "$KEYVAULT_NAME" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  echo "[Error] Key Vault not found: $KEYVAULT_NAME"
  exit 1
fi

# Get current user object ID
echo "[Auth] Getting current user..."
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

# Grant current user access to Key Vault
echo "[Configure] Granting Key Vault access..."
az keyvault set-policy \
  --name "$KEYVAULT_NAME" \
  --object-id "$USER_OBJECT_ID" \
  --secret-permissions get list set \
  --key-permissions get list create \
  --output none

# Create Azure Container Registry
echo "[Create] Setting up Container Registry..."
REGISTRY_NAME="ethiopiannavigator"

if ! az acr show --resource-group "$RESOURCE_GROUP" --name "$REGISTRY_NAME" &>/dev/null; then
  echo "[Create] Creating container registry: $REGISTRY_NAME"
  az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$REGISTRY_NAME" \
    --sku Basic
else
  echo "[Found] Container registry already exists: $REGISTRY_NAME"
fi

# Create Application Insights
echo "[Create] Setting up Application Insights..."
APP_INSIGHTS_NAME="ethiopian-navigator-insights"

if ! az monitor app-insights component show \
  --resource-group "$RESOURCE_GROUP" \
  --app "$APP_INSIGHTS_NAME" &>/dev/null; then
  echo "[Create] Creating Application Insights..."
  az monitor app-insights component create \
    --app "$APP_INSIGHTS_NAME" \
    --location "$LOCATION" \
    --resource-group "$RESOURCE_GROUP" \
    --application-type web
else
  echo "[Found] Application Insights already exists: $APP_INSIGHTS_NAME"
fi

# Create Log Analytics Workspace
echo "[Create] Setting up Log Analytics..."
LOG_ANALYTICS_NAME="ethiopian-navigator-logs"

if ! az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$LOG_ANALYTICS_NAME" &>/dev/null; then
  echo "[Create] Creating Log Analytics Workspace..."
  az monitor log-analytics workspace create \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_NAME" \
    --location "$LOCATION"
else
  echo "[Found] Log Analytics already exists: $LOG_ANALYTICS_NAME"
fi

echo ""
echo "[Success] Azure deployment environment is ready!"
echo ""
echo "Next steps:"
echo "1. Store secrets in Key Vault: ./scripts/setup-keyvault.sh"
echo "2. Deploy to Azure: ./scripts/deploy-to-azure.sh $RESOURCE_GROUP $LOCATION"
