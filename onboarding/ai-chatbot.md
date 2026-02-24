# AI Chatbot Onboarding Guide

## Prerequisites

- Python 3.10+
- pip
- `.env` file for chatbot (see `.env.example`)

## Setup Steps

1. **Navigate to ai-chatbot**
   \`\`\`bash
   cd ethiopian-navigator-mvp/ai-chatbot
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. **Run the chatbot locally**
   \`\`\`bash
   python app.py
   \`\`\`

4. **Test endpoint**
   - POST `/query` with JSON `{ "text": "Hello" }`

5. **Integrations**
   - Add Azure AI Search, GPT-4, Amharic-BERT logic in `rag_pipeline.py` and `bert_inference.py`
   - Log chats in `cosmos_logger.py`
