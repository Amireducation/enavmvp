from openai import AzureOpenAI
from config import (
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_DEPLOYMENT,
    AZURE_OPENAI_API_VERSION
)
import logging

logger = logging.getLogger(__name__)

class AzureOpenAIClient:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=AZURE_OPENAI_API_KEY,
            api_version=AZURE_OPENAI_API_VERSION,
            azure_endpoint=AZURE_OPENAI_ENDPOINT
        )
        self.deployment = AZURE_OPENAI_DEPLOYMENT
        self.model = "gpt-4"
    
    def generate_response(self, messages: list, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Generate response using Azure OpenAI."""
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=0.95
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return "I apologize, I'm unable to process your request at this moment. Please try again later."
    
    def generate_answer_with_context(self, question: str, context: str, language: str = "en") -> str:
        """Generate answer based on context from search."""
        system_prompt = f"""You are a helpful government service assistant for Ethiopian Navigator.
You speak {language} fluently. 
Provide clear, concise answers about government services in Ethiopia.
Use the provided context to answer questions accurately.
If you don't know something based on the context, say so honestly."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
        ]
        
        return self.generate_response(messages)

# Global client instance
openai_client = AzureOpenAIClient()
