from azure_openai_client import openai_client
from azure_search_client import search_client
from translation_service import detect_language, translate_to_english, translate_from_english
from cosmos_logger import cosmos_logger
import logging

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self):
        self.openai = openai_client
        self.search = search_client
    
    def query_rag(self, user_input: str, user_id: str = None) -> dict:
        """Execute RAG pipeline: Search -> Retrieve -> Generate -> Translate."""
        
        # 1. Detect language
        detected_lang = detect_language(user_input)
        
        # 2. Translate to English if needed
        english_input, source_lang = translate_to_english(user_input, detected_lang)
        
        # 3. Search for relevant services
        search_results = self.search.search_services(english_input, top=5)
        
        # 4. Build context from search results
        context = self._build_context(search_results)
        
        # 5. Generate response using GPT-4 with context
        response = self.openai.generate_answer_with_context(
            english_input,
            context,
            detected_lang
        )
        
        # 6. Translate response back to original language if needed
        if detected_lang != "en":
            response = translate_from_english(response, detected_lang)
        
        # 7. Log interaction
        if cosmos_logger:
            cosmos_logger.log_interaction(
                user_input,
                response,
                user_id=user_id,
                language=detected_lang,
                metadata={
                    "search_results_count": len(search_results),
                    "source_language": source_lang
                }
            )
        
        return {
            "response": response,
            "language": detected_lang,
            "search_results": search_results,
            "confidence": self._calculate_confidence(search_results)
        }
    
    def _build_context(self, search_results: list) -> str:
        """Build context string from search results."""
        if not search_results:
            return "No relevant services found in the database."
        
        context_lines = ["Relevant Services:"]
        for result in search_results:
            context_lines.append(
                f"- {result['name']} ({result['category']}): {result['description']} "
                f"(Agency: {result['agency']})"
            )
        
        return "\n".join(context_lines)
    
    def _calculate_confidence(self, search_results: list) -> float:
        """Calculate confidence based on search result scores."""
        if not search_results:
            return 0.0
        
        avg_score = sum(r.get("score", 0) for r in search_results) / len(search_results)
        return min(avg_score / 100, 1.0)  # Normalize to 0-1

# Global RAG pipeline instance
rag_pipeline = RAGPipeline()

def query_rag(text: str, user_id: str = None) -> dict:
    """Main entry point for RAG queries."""
    return rag_pipeline.query_rag(text, user_id)
