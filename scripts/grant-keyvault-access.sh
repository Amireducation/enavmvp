#!/bin/bash

# Grant Azure resources access to Key Vault
# Usage: ./scripts/grant-keyvault-access.sh [vault-name] [resource-group]

set -e

VAULT_NAME="${1:-ethionav-kv-3192}"
RESOURCE_GROUP="${2:-ethiopian-navigator-rg}"
PRINCIPAL_ID="${3}"

if [ -z "$PRINCIPAL_ID" ]; then
  echo "Usage: $0 <vault-name> <resource-group> <principal-id>"
  echo ""
  echo "Principal ID can be:"
  echo "  - Service Principal Object ID"
  echo "  - Managed Identity Object ID"
  echo "  - User Object ID (from 'az ad signed-in-user show --query id')"
  exit 1
fi

echo "[Grant] Configuring Key Vault access for: $PRINCIPAL_ID"

az keyvault set-policy \
  --name "$VAULT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --object-id "$PRINCIPAL_ID" \
  --secret-permissions get list \
  --key-permissions get list \
  --certificate-permissions get list

echo "[Success] Access granted to Key Vault"
