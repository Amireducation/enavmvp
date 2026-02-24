import os
from dotenv import load_dotenv
from keyvault_secrets import initialize_secrets, get_secret

load_dotenv()

initialize_secrets()

# Azure Configuration
AZURE_OPENAI_ENDPOINT = get_secret("AZURE-OPENAI-ENDPOINT") or os.getenv("AZURE_OPENAI_ENDPOINT", "")
AZURE_OPENAI_API_KEY = get_secret("AZURE-OPENAI-API-KEY") or os.getenv("AZURE_OPENAI_API_KEY", "")
AZURE_OPENAI_DEPLOYMENT = get_secret("AZURE-OPENAI-DEPLOYMENT") or os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")
AZURE_OPENAI_API_VERSION = "2024-02-15-preview"

# Azure Search Configuration
AZURE_SEARCH_ENDPOINT = get_secret("AZURE-SEARCH-ENDPOINT") or os.getenv("AZURE_SEARCH_ENDPOINT", "")
AZURE_SEARCH_API_KEY = get_secret("AZURE-SEARCH-API-KEY") or os.getenv("AZURE_SEARCH_API_KEY", "")
AZURE_SEARCH_INDEX = os.getenv("AZURE_SEARCH_INDEX", "ethiopian-services")

# Cosmos DB Configuration
COSMOS_CONNECTION_STRING = get_secret("COSMOS-CONNECTION-STRING") or os.getenv("COSMOS_CONNECTION_STRING", "")
COSMOS_DATABASE = os.getenv("COSMOS_DATABASE", "navigator")

# Translation & NLP
SUPPORTED_LANGUAGES = {
    "am": "Amharic",
    "or": "Oromo",
    "en": "English"
}

# Flask Configuration
FLASK_ENV = os.getenv("FLASK_ENV", "development")
DEBUG = FLASK_ENV == "development"
