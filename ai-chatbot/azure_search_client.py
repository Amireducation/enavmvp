from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from config import AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_API_KEY, AZURE_SEARCH_INDEX
import logging

logger = logging.getLogger(__name__)

class AzureSearchClient:
    def __init__(self):
        try:
            self.search_client = SearchClient(
                endpoint=AZURE_SEARCH_ENDPOINT,
                index_name=AZURE_SEARCH_INDEX,
                credential=AzureKeyCredential(AZURE_SEARCH_API_KEY)
            )
        except Exception as e:
            logger.error(f"Azure Search initialization error: {e}")
            self.search_client = None
    
    def search_services(self, query: str, top: int = 5) -> list:
        """Search for relevant services in the index."""
        if not self.search_client:
            return []
        
        try:
            results = self.search_client.search(
                search_text=query,
                select=["service_id", "name", "category", "description", "responsible_agency"],
                top=top,
                include_total_count=True
            )
            
            services = []
            for result in results:
                services.append({
                    "service_id": result.get("service_id"),
                    "name": result.get("name"),
                    "category": result.get("category"),
                    "description": result.get("description"),
                    "agency": result.get("responsible_agency"),
                    "score": result.get("@search.score", 0)
                })
            return services
        except Exception as e:
            logger.error(f"Search error: {e}")
            return []
    
    def index_service(self, service_doc: dict) -> bool:
        """Add or update a service in the search index."""
        if not self.search_client:
            return False
        
        try:
            self.search_client.upload_documents(documents=[service_doc])
            return True
        except Exception as e:
            logger.error(f"Indexing error: {e}")
            return False

# Global search client instance
search_client = AzureSearchClient()
