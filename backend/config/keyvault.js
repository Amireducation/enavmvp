const { SecretClient } = require("@azure/keyvault-secrets")
const { DefaultAzureCredential } = require("@azure/identity")

let secretClient = null
const secretCache = new Map()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour cache

/**
 * Initialize Key Vault client
 */
function initializeKeyVault() {
  const vaultUri = process.env.AZURE_KEYVAULT_URI

  if (!vaultUri) {
    console.warn("[KeyVault] AZURE_KEYVAULT_URI not set. Using environment variables instead.")
    return null
  }

  try {
    const credential = new DefaultAzureCredential()
    secretClient = new SecretClient(vaultUri, credential)
    console.log("[KeyVault] Successfully initialized with URI:", vaultUri)
    return secretClient
  } catch (error) {
    console.error("[KeyVault] Failed to initialize:", error.message)
    console.warn("[KeyVault] Falling back to environment variables")
    return null
  }
}

/**
 * Get secret from Key Vault with caching
 */
async function getSecret(secretName) {
  // Check cache first
  if (secretCache.has(secretName)) {
    const cached = secretCache.get(secretName)
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[KeyVault] Cache hit for ${secretName}`)
      return cached.value
    }
    secretCache.delete(secretName)
  }

  // Try Key Vault first if available
  if (secretClient) {
    try {
      const secret = await secretClient.getSecret(secretName)
      const value = secret.value

      // Cache the value
      secretCache.set(secretName, {
        value,
        timestamp: Date.now(),
      })

      console.log(`[KeyVault] Retrieved ${secretName} from Key Vault`)
      return value
    } catch (error) {
      console.warn(`[KeyVault] Failed to retrieve ${secretName}: ${error.message}`)
    }
  }

  // Fallback to environment variables
  const envValue = process.env[secretName]
  if (envValue) {
    console.log(`[KeyVault] Using environment variable for ${secretName}`)
    return envValue
  }

  throw new Error(`Secret ${secretName} not found in Key Vault or environment variables`)
}

/**
 * Get all required secrets
 */
async function getSecrets() {
  const requiredSecrets = [
    "POSTGRES-CONN-STRING",
    "JWT-SECRET",
    "AZURE-OPENAI-API-KEY",
    "AZURE-SEARCH-API-KEY",
    "COSMOS-CONNECTION-STRING",
  ]

  const secrets = {}

  for (const secretName of requiredSecrets) {
    try {
      secrets[secretName] = await getSecret(secretName)
    } catch (error) {
      console.warn(`[KeyVault] ${error.message}`)
      // Set to env variable or empty string
      secrets[secretName] = process.env[secretName.replace(/-/g, "_")] || ""
    }
  }

  return secrets
}

/**
 * Clear cache
 */
function clearCache() {
  secretCache.clear()
  console.log("[KeyVault] Cache cleared")
}

module.exports = {
  initializeKeyVault,
  getSecret,
  getSecrets,
  clearCache,
}
