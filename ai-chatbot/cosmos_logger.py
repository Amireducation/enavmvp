from pymongo import MongoClient
from config import COSMOS_CONNECTION_STRING, COSMOS_DATABASE
from datetime import datetime
import logging
import json

logger = logging.getLogger(__name__)

class CosmosLogger:
    def __init__(self):
        try:
            if COSMOS_CONNECTION_STRING:
                self.client = MongoClient(COSMOS_CONNECTION_STRING)
                self.db = self.client[COSMOS_DATABASE]
                self.interactions = self.db["chatbot_interactions"]
                self.interactions.create_index("timestamp")
                logger.info("Connected to Cosmos DB")
            else:
                self.interactions = None
                logger.warning("Cosmos DB connection string not configured")
        except Exception as e:
            logger.error(f"Cosmos DB initialization error: {e}")
            self.interactions = None
    
    def log_interaction(self, user_input: str, response: str, user_id: str = None, language: str = "en", metadata: dict = None) -> bool:
        """Log chatbot interaction."""
        if not self.interactions:
            return False
        
        try:
            document = {
                "user_input": user_input,
                "response": response,
                "user_id": user_id,
                "language": language,
                "timestamp": datetime.utcnow(),
                "metadata": metadata or {}
            }
            result = self.interactions.insert_one(document)
            return result.inserted_id is not None
        except Exception as e:
            logger.error(f"Logging error: {e}")
            return False
    
    def get_conversation_history(self, user_id: str, limit: int = 10) -> list:
        """Retrieve conversation history for a user."""
        if not self.interactions:
            return []
        
        try:
            history = list(self.interactions.find(
                {"user_id": user_id},
                {"_id": 0}
            ).sort("timestamp", -1).limit(limit))
            return history
        except Exception as e:
            logger.error(f"History retrieval error: {e}")
            return []

# Global logger instance
cosmos_logger = CosmosLogger()
