#!/bin/bash

# Azure Key Vault Setup Script for Ethiopian Navigator MVP
# This script helps populate your Key Vault with required secrets

set -e

# Configuration
VAULT_NAME="${1:-ethionav-kv-3192}"
RESOURCE_GROUP="${2:-ethiopian-navigator-rg}"

echo "[Setup] Configuring Azure Key Vault: $VAULT_NAME"
echo "[Setup] Resource Group: $RESOURCE_GROUP"

# Check if vault exists
echo "[Check] Verifying Key Vault exists..."
if ! az keyvault show --name "$VAULT_NAME" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  echo "[Error] Key Vault not found: $VAULT_NAME"
  exit 1
fi

echo "[Success] Key Vault found"

# Function to read secret from user
read_secret() {
  local secret_name=$1
  local prompt=$2
  
  read -sp "[Input] $prompt: " secret_value
  echo ""
  
  if [ -z "$secret_value" ]; then
    echo "[Skip] Skipping $secret_name (empty value)"
    return 1
  fi
  
  return 0
}

# Function to set secret in Key Vault
set_secret() {
  local secret_name=$1
  local secret_value=$2
  
  echo "[Setting] $secret_name..."
  az keyvault secret set \
    --vault-name "$VAULT_NAME" \
    --name "$secret_name" \
    --value "$secret_value" \
    --output none
  echo "[Success] $secret_name set in Key Vault"
}

# Collect secrets from user
echo ""
echo "[Collecting Secrets]"
echo "======================================"

if read_secret "POSTGRES-CONN-STRING" "PostgreSQL Connection String"; then
  set_secret "POSTGRES-CONN-STRING" "$secret_value"
fi

if read_secret "JWT-SECRET" "JWT Secret (min 32 characters)"; then
  set_secret "JWT-SECRET" "$secret_value"
fi

if read_secret "AZURE-OPENAI-API-KEY" "Azure OpenAI API Key"; then
  set_secret "AZURE-OPENAI-API-KEY" "$secret_value"
fi

if read_secret "AZURE-SEARCH-API-KEY" "Azure Search API Key"; then
  set_secret "AZURE-SEARCH-API-KEY" "$secret_value"
fi

if read_secret "COSMOS-CONNECTION-STRING" "Cosmos DB Connection String (optional)"; then
  set_secret "COSMOS-CONNECTION-STRING" "$secret_value"
fi

echo ""
echo "[Complete] Key Vault setup finished!"
echo ""
echo "[Verify] Listing all secrets:"
az keyvault secret list \
  --vault-name "$VAULT_NAME" \
  --query "[].name" \
  --output table
