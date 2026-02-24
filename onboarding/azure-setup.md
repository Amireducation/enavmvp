# Azure Infrastructure Setup Guide

## Prerequisites

- Azure CLI
- Contributor rights on subscription
- Bicep/ARM (Bicep recommended)

## Steps

1. **Login to Azure**
   \`\`\`bash
   az login
   \`\`\`

2. **Set subscription**
   \`\`\`bash
   az account set --subscription "<your-subscription-id>"
   \`\`\`

3. **Create resource group**
   \`\`\`bash
   az group create --name ethiopian-navigator-rg --location "Central US"
   \`\`\`

4. **Deploy all resources**
   \`\`\`bash
   cd infrastructure
   az deployment group create \
     --resource-group ethiopian-navigator-rg \
     --template-file main.bicep \
     --parameters prefix=ethionav
   \`\`\`

5. **Check resources in Azure Portal**

6. **Store secrets in Key Vault**
