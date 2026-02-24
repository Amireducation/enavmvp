const { initializeKeyVault, getSecrets } = require("./keyvault")

let secrets = null

/**
 * Load and cache secrets on startup
 */
async function loadSecrets() {
  if (secrets) {
    return secrets
  }

  // Initialize Key Vault
  initializeKeyVault()

  // Fetch all secrets
  const secretsData = await getSecrets()

  // Map secrets to environment variables with underscores
  secrets = {
    postgresConnString: secretsData["POSTGRES-CONN-STRING"],
    jwtSecret: secretsData["JWT-SECRET"],
    azureOpenAIApiKey: secretsData["AZURE-OPENAI-API-KEY"],
    azureSearchApiKey: secretsData["AZURE-SEARCH-API-KEY"],
    cosmosConnectionString: secretsData["COSMOS-CONNECTION-STRING"],
    azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
    azureOpenAIDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
  }

  return secrets
}

/**
 * Get a specific secret value
 */
function getSecret(key) {
  if (!secrets) {
    throw new Error("Secrets not loaded. Call loadSecrets() first.")
  }
  return secrets[key]
}

module.exports = {
  loadSecrets,
  getSecret,
  getSecrets: () => secrets,
}
