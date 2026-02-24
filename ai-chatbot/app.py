from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_pipeline import query_rag
from config import DEBUG
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Ethiopian Navigator Chatbot"
    }), 200

@app.route("/query", methods=["POST"])
def query():
    """Main chatbot query endpoint."""
    try:
        data = request.json
        user_input = data.get("text", "").strip()
        user_id = data.get("user_id")
        
        if not user_input:
            return jsonify({"error": "Empty query"}), 400
        
        # Execute RAG pipeline
        result = query_rag(user_input, user_id)
        
        return jsonify({
            "response": result["response"],
            "language": result["language"],
            "confidence": result["confidence"],
            "sources": result["search_results"]
        }), 200
    
    except Exception as e:
        logger.error(f"Query error: {e}")
        return jsonify({
            "error": "Unable to process query",
            "details": str(e) if DEBUG else None
        }), 500

@app.route("/history/<user_id>", methods=["GET"])
def get_history(user_id):
    """Retrieve conversation history for a user."""
    try:
        from cosmos_logger import cosmos_logger
        limit = request.args.get("limit", 10, type=int)
        history = cosmos_logger.get_conversation_history(user_id, limit)
        return jsonify({"history": history}), 200
    except Exception as e:
        logger.error(f"History retrieval error: {e}")
        return jsonify({"error": "Unable to retrieve history"}), 500

@app.route("/services/search", methods=["GET"])
def search_services():
    """Search for services by query."""
    try:
        query_param = request.args.get("q", "").strip()
        if not query_param:
            return jsonify({"error": "Missing search query"}), 400
        
        from azure_search_client import search_client
        results = search_client.search_services(query_param, top=10)
        return jsonify({"results": results}), 200
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({"error": "Search failed"}), 500

@app.route("/index/service", methods=["POST"])
def index_service():
    """Index a new service document."""
    try:
        service_doc = request.json
        from azure_search_client import search_client
        success = search_client.index_service(service_doc)
        
        if success:
            return jsonify({"status": "indexed"}), 201
        else:
            return jsonify({"error": "Indexing failed"}), 400
    except Exception as e:
        logger.error(f"Indexing error: {e}")
        return jsonify({"error": "Unable to index service"}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Server error: {e}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    logger.info("Starting Ethiopian Navigator Chatbot...")
    app.run(host="0.0.0.0", port=8000, debug=DEBUG)
