# Azure Key Vault Integration Guide

This guide explains how to set up and use Azure Key Vault with the Ethiopian Navigator MVP project.

## Overview

The project uses Azure Key Vault to securely manage all sensitive configuration secrets including:
- Database connection strings
- JWT secrets
- API keys (OpenAI, Search)
- Cosmos DB connection strings

## Your Key Vault Details

\`\`\`
Vault Name: ethionav-kv-3192
Vault URI: https://ethionav-kv-3192.vault.azure.net/
Location: eastus2
Resource Group: ethiopian-navigator-rg
Subscription: 2e6958fc-bc1f-4a4d-8fdd-5debfbfb8155
\`\`\`

## Setup Instructions

### 1. Store Secrets in Key Vault

Use Azure CLI to add secrets to your vault:

\`\`\`bash
# Database connection string
az keyvault secret set \
  --vault-name ethionav-kv-3192 \
  --name POSTGRES-CONN-STRING \
  --value "postgresql://user:password@server:5432/db"

# JWT Secret
az keyvault secret set \
  --vault-name ethionav-kv-3192 \
  --name JWT-SECRET \
  --value "your-super-secret-jwt-key-min-32-chars-long"

# Azure OpenAI API Key
az keyvault secret set \
  --vault-name ethionav-kv-3192 \
  --name AZURE-OPENAI-API-KEY \
  --value "your-openai-api-key"

# Azure Search API Key
az keyvault secret set \
  --vault-name ethionav-kv-3192 \
  --name AZURE-SEARCH-API-KEY \
  --value "your-search-api-key"

# Cosmos DB Connection String (if using)
az keyvault secret set \
  --vault-name ethionav-kv-3192 \
  --name COSMOS-CONNECTION-STRING \
  --value "your-cosmos-connection-string"
\`\`\`

### 2. Configure Environment Variables

Set the following in your `.env` file or deployment configuration:

\`\`\`env
# Azure Key Vault
AZURE_KEYVAULT_URI=https://ethionav-kv-3192.vault.azure.net/

# Azure SDK Authentication
AZURE_TENANT_ID=7ac5dd8d-35b4-4919-ba86-fb7888a60922
AZURE_CLIENT_ID=your-app-registration-id
AZURE_CLIENT_SECRET=your-app-registration-secret

# Or use Azure CLI authentication for local development
# az login

# Other configuration (fetched from env if not in Key Vault)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_SEARCH_ENDPOINT=https://your-resource.search.windows.net
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
PORT=5000
\`\`\`

### 3. Install Required Packages

\`\`\`bash
npm install @azure/keyvault-secrets @azure/identity
\`\`\`

### 4. Authentication Methods

#### Local Development (Using Azure CLI)

\`\`\`bash
# Login with Azure CLI
az login

# The SDK will automatically use your Azure CLI credentials
\`\`\`

#### Application Authentication (Service Principal)

For production deployments, use a Service Principal:

\`\`\`bash
# Create a service principal
az ad sp create-for-rbac --name ethiopian-navigator-sp

# Grant it access to the Key Vault
az keyvault set-policy --name ethionav-kv-3192 \
  --object-id <service-principal-object-id> \
  --secret-permissions get list
\`\`\`

#### Managed Identity (Azure App Service)

For Azure App Service deployments, enable Managed Identity and grant it access:

\`\`\`bash
# This is done through Azure Portal or ARM templates
# Grant Managed Identity access to Key Vault
az keyvault set-policy --name ethionav-kv-3192 \
  --object-id <managed-identity-object-id> \
  --secret-permissions get list
\`\`\`

## Usage in Code

### Backend (Node.js)

Secrets are automatically loaded on server startup:

\`\`\`javascript
const { getSecret } = require("./config/secrets");

// Use secrets in your code
const dbConnString = getSecret("postgresConnString");
const jwtSecret = getSecret("jwtSecret");
\`\`\`

### Frontend (React/Next.js)

For public configuration (non-sensitive), use environment variables:

\`\`\`typescript
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
\`\`\`

**Never expose API keys or secrets in frontend code or environment variables.**

## Verification

### List All Secrets

\`\`\`bash
az keyvault secret list --vault-name ethionav-kv-3192
\`\`\`

### Retrieve a Specific Secret

\`\`\`bash
az keyvault secret show --vault-name ethionav-kv-3192 --name JWT-SECRET
\`\`\`

### Check Access Policies

\`\`\`bash
az keyvault show --resource-group ethiopian-navigator-rg --name ethionav-kv-3192
\`\`\`

## Troubleshooting

### "Access Denied" Error

Ensure your user or service principal has `get` and `list` permissions on secrets:

\`\`\`bash
az keyvault set-policy --name ethionav-kv-3192 \
  --object-id <your-object-id> \
  --secret-permissions get list
\`\`\`

### "Not authenticated" Error

Make sure you're authenticated with Azure:

\`\`\`bash
# For local development
az login

# Check current authentication
az account show
\`\`\`

### Secrets Not Loading

Check logs for Key Vault initialization errors. The application will fall back to environment variables if Key Vault is unavailable.

## Security Best Practices

1. **Rotation**: Regularly rotate secrets (especially API keys)
2. **Access Control**: Use the principle of least privilege
3. **Monitoring**: Enable Key Vault logging and alerts
4. **Firewall**: Configure network access restrictions if possible
5. **Purge Protection**: Enable purge protection to prevent accidental deletion

\`\`\`bash
# Enable purge protection
az keyvault update --resource-group ethiopian-navigator-rg \
  --name ethionav-kv-3192 \
  --enable-purge-protection
\`\`\`

## Integration with CI/CD

For GitHub Actions, set up federated credentials:

\`\`\`bash
# Create federated credential for GitHub
az identity federated-credential create \
  --resource-group ethiopian-navigator-rg \
  --identity-name ethiopian-navigator-identity \
  --name github-actions \
  --issuer https://token.actions.githubusercontent.com \
  --subject repo:your-org/ethiopian-navigator:ref:refs/heads/main
\`\`\`

Then in your GitHub Actions workflow, use OIDC authentication to access Key Vault without storing credentials.

## Next Steps

1. Add all required secrets to the Key Vault
2. Update your deployment configuration to use Key Vault
3. Test authentication with `az keyvault secret show`
4. Deploy and monitor in production

For more information, see [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/).
\`\`\`

\`\`\`json file="" isHidden
