import os
import logging
from typing import Optional, Dict
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

logger = logging.getLogger(__name__)

class KeyVaultSecretsManager:
    """Manages secrets from Azure Key Vault with fallback to environment variables."""
    
    def __init__(self, vault_uri: Optional[str] = None):
        """
        Initialize Key Vault client.
        
        Args:
            vault_uri: Azure Key Vault URI. If not provided, uses AZURE_KEYVAULT_URI env var.
        """
        self.vault_uri = vault_uri or os.getenv("AZURE_KEYVAULT_URI")
        self.client = None
        self._cache: Dict[str, str] = {}
        self._initialized = False
        
        if self.vault_uri:
            self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize Azure Key Vault client with DefaultAzureCredential."""
        try:
            credential = DefaultAzureCredential()
            self.client = SecretClient(vault_url=self.vault_uri, credential=credential)
            self._initialized = True
            logger.info(f"[KeyVault] Initialized with URI: {self.vault_uri}")
        except Exception as e:
            logger.warning(f"[KeyVault] Failed to initialize: {e}")
            logger.info("[KeyVault] Falling back to environment variables")
            self.client = None
    
    def get_secret(self, secret_name: str) -> Optional[str]:
        """
        Get a secret from Key Vault with fallback to environment variables.
        
        Args:
            secret_name: Name of the secret (with hyphens, e.g., "AZURE-OPENAI-API-KEY")
        
        Returns:
            Secret value or None if not found
        """
        # Check cache first
        if secret_name in self._cache:
            logger.debug(f"[KeyVault] Cache hit for {secret_name}")
            return self._cache[secret_name]
        
        secret_value = None
        
        # Try Key Vault
        if self.client and self._initialized:
            try:
                secret = self.client.get_secret(secret_name)
                secret_value = secret.value
                logger.info(f"[KeyVault] Retrieved {secret_name} from Key Vault")
            except Exception as e:
                logger.warning(f"[KeyVault] Failed to retrieve {secret_name}: {e}")
        
        # Fallback to environment variable
        if not secret_value:
            env_name = secret_name.replace("-", "_")
            secret_value = os.getenv(env_name)
            if secret_value:
                logger.info(f"[KeyVault] Using environment variable for {secret_name}")
        
        # Cache the result
        if secret_value:
            self._cache[secret_name] = secret_value
        
        return secret_value
    
    def get_all_secrets(self, secret_names: list) -> Dict[str, str]:
        """
        Get multiple secrets at once.
        
        Args:
            secret_names: List of secret names to retrieve
        
        Returns:
            Dictionary of secret names to values
        """
        return {name: self.get_secret(name) for name in secret_names}

# Global instance
_secrets_manager: Optional[KeyVaultSecretsManager] = None

def initialize_secrets(vault_uri: Optional[str] = None) -> KeyVaultSecretsManager:
    """Initialize the global secrets manager."""
    global _secrets_manager
    _secrets_manager = KeyVaultSecretsManager(vault_uri)
    return _secrets_manager

def get_secrets_manager() -> KeyVaultSecretsManager:
    """Get the global secrets manager instance."""
    global _secrets_manager
    if _secrets_manager is None:
        _secrets_manager = KeyVaultSecretsManager()
    return _secrets_manager

def get_secret(secret_name: str) -> Optional[str]:
    """Convenience function to get a secret."""
    return get_secrets_manager().get_secret(secret_name)
