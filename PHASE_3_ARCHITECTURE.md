# Phase 3: AI Intelligence Layer
## Complete Architecture & Implementation Plan

**Duration:** 4-6 weeks  
**Team Size:** 4-6 engineers (backend, ML engineers, DevOps)  
**Status:** Design & Scaffold Ready  
**Dependencies:** Phase 1 + Phase 2 Complete

---

## Overview

Phase 3 transforms Ethiopian Navigator into an intelligent platform by:
1. Building AI Orchestration Service
2. Implementing context-aware chatbot with Groq LLM
3. Creating knowledge graph for entity relationships
4. Setting up embeddings pipeline for semantic search
5. Integrating AI across all citizen touchpoints

---

## Phase 3 Architecture

### Services to Create

#### 1. AI Orchestration Service (New)
**Scope:** Centralized AI request routing and workflow  
**Port:** 3003  
**Dependencies:** Groq API, Vector database (Pinecone/Weaviate)

**Key Capabilities:**
- Route requests to appropriate AI models
- Manage conversation context and memory
- Handle knowledge graph queries
- Coordinate embeddings generation
- Rate limiting and quota management

#### 2. Groq Integration (In Orchestration Service)
**Model:** Mixtral 8x7B or Llama 2
**Features:**
- Sub-100ms response times
- Context-aware responses
- Multi-turn conversations
- Temperature control
- Token counting

#### 3. Knowledge Graph Service (New)
**Scope:** Entity relationships and ontology  
**Storage:** Neo4j or Memgraph
**Entities:**
- Services (with relationships)
- Requirements & eligibility
- Documents needed
- Process workflows
- Service dependencies

#### 4. Embeddings Pipeline (New)
**Scope:** Semantic understanding  
**Model:** OpenAI Embeddings or Hugging Face
**Pipeline:**
- Service descriptions → embeddings
- FAQ entries → embeddings
- User queries → embeddings
- Similarity search for recommendations

---

## AI Orchestration Service Scaffold

### Main Service File

```typescript
// services/ai-orchestration/src/main.ts
import express, { Express } from 'express';
import { aiRouter } from './routes/ai.routes';
import { chatRouter } from './routes/chat.routes';
import { logger } from '../../libs/logging/logger';

class AIOrchestrationService {
  private app: Express;
  private port: number = 3003;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // AI endpoints
    this.app.use('/api/ai', aiRouter);
    this.app.use('/api/chat', chatRouter);
    
    // Health
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'ai-orchestration' });
    });
  }

  async start(): Promise<void> {
    this.app.listen(this.port, () => {
      logger.info('AI Orchestration Service started', { port: this.port });
    });
  }
}

new AIOrchestrationService().start();
```

### API Endpoints

**Chat Endpoints:**
- `POST /api/chat/sessions` - Create conversation
- `POST /api/chat/sessions/{id}/messages` - Send message
- `GET /api/chat/sessions/{id}` - Get conversation history

**AI Endpoints:**
- `POST /api/ai/query` - Query knowledge graph
- `POST /api/ai/recommend-services` - Get service recommendations
- `POST /api/ai/analyze-eligibility` - Check eligibility
- `POST /api/ai/generate-summary` - Summarize documents

**Admin Endpoints:**
- `GET /api/ai/models/status` - Model health
- `POST /api/ai/models/reload` - Reload models
- `GET /api/ai/metrics` - Performance metrics

---

## Groq Integration

### Groq Client Setup

```typescript
// services/ai-orchestration/src/integrations/groq.ts
import Groq from 'groq-sdk';

class GroqClient {
  private client: Groq;
  private model = 'mixtral-8x7b-32768';

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async chat(messages: Message[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    return response.choices[0].message.content;
  }

  async streamChat(messages: Message[]): Promise<AsyncIterable<string>> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
      temperature: 0.7,
    });

    return (async function* () {
      for await (const event of stream) {
        const text = event.choices[0]?.delta?.content || '';
        if (text) yield text;
      }
    })();
  }
}
```

### Chat Service

```typescript
// services/ai-orchestration/src/service/chat.service.ts
import { v4 as uuidv4 } from 'uuid';
import { connectionPool } from '../../../libs/database/connection-pool';
import { GroqClient } from '../integrations/groq';
import { logger } from '../../../libs/logging/logger';

export class ChatService {
  private groq: GroqClient;

  constructor(groqApiKey: string) {
    this.groq = new GroqClient(groqApiKey);
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();

    await connectionPool.executeQuery(
      `INSERT INTO ai_service.chat_sessions 
       (id, user_id, status, created_at)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, userId, 'active', new Date()],
      'ai-orchestration'
    );

    return sessionId;
  }

  async sendMessage(
    sessionId: string,
    userId: string,
    message: string
  ): Promise<{ response: string; tokens: number }> {
    try {
      // Get conversation history
      const history = await this.getConversationHistory(sessionId);

      // Build messages for Groq
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful government service assistant for Ethiopian Navigator.',
        },
        ...history,
        { role: 'user', content: message },
      ];

      // Get AI response
      const response = await this.groq.chat(messages);

      // Save to database
      await connectionPool.executeQuery(
        `INSERT INTO ai_service.chat_messages 
         (session_id, user_id, role, content, created_at)
         VALUES ($1, $2, $3, $4, $5), ($1, $2, $3, $4, $5)`,
        [sessionId, userId, 'user', message, new Date()],
        'ai-orchestration'
      );

      await connectionPool.executeQuery(
        `INSERT INTO ai_service.chat_messages 
         (session_id, user_id, role, content, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, userId, 'assistant', response, new Date()],
        'ai-orchestration'
      );

      logger.info('Chat message processed', { sessionId, userId });

      return { response, tokens: Math.ceil(message.length / 4) + Math.ceil(response.length / 4) };
    } catch (error) {
      logger.error('Failed to send message', error as Error);
      throw error;
    }
  }

  private async getConversationHistory(sessionId: string): Promise<any[]> {
    const messages = await connectionPool.executeQuery<any>(
      `SELECT role, content FROM ai_service.chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC 
       LIMIT 20`,
      [sessionId],
      'ai-orchestration'
    );

    return messages;
  }
}
```

---

## Knowledge Graph Integration

### Knowledge Graph Schema

```cypher
# Neo4j schema for knowledge graph

// Node types
CREATE CONSTRAINT service_id IF NOT EXISTS 
  FOR (s:Service) REQUIRE s.id IS UNIQUE;

CREATE CONSTRAINT citizen_id IF NOT EXISTS 
  FOR (c:Citizen) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT document_id IF NOT EXISTS 
  FOR (d:Document) REQUIRE d.id IS UNIQUE;

// Relationships
(:Service)-[:REQUIRES_DOCUMENT]->(:Document)
(:Service)-[:HAS_ELIGIBILITY_RULE]->(:Rule)
(:Service)-[:BELONGS_TO_CATEGORY]->(:Category)
(:Service)-[:DEPENDS_ON]->(:Service)
(:Service)-[:PROCESSED_BY]->(:Department)
(:Citizen)-[:SUBMITTED_REQUEST_FOR]->(:Service)
(:Citizen)-[:OWNS_DOCUMENT]->(:Document)

// Queries
MATCH (s:Service {name: "National ID"})-[:REQUIRES_DOCUMENT]->(d:Document)
RETURN s, d;

MATCH (s:Service)-[:DEPENDS_ON]->(dep:Service)
RETURN s.name, dep.name;

MATCH (c:Citizen)-[:SUBMITTED_REQUEST_FOR]->(s:Service)
RETURN COUNT(DISTINCT s) as service_count;
```

### Knowledge Graph Service

```typescript
// services/ai-orchestration/src/service/knowledge-graph.service.ts
import neo4j, { Session } from 'neo4j-driver';

export class KnowledgeGraphService {
  private driver: neo4j.Driver;
  private session: Session;

  constructor(uri: string, user: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    this.session = this.driver.session();
  }

  async getServiceRequirements(serviceId: string): Promise<any[]> {
    const result = await this.session.run(
      `MATCH (s:Service {id: $serviceId})-[:REQUIRES_DOCUMENT]->(d:Document)
       RETURN s, d`,
      { serviceId }
    );

    return result.records.map(record => ({
      service: record.get('s').properties,
      documents: record.get('d').properties,
    }));
  }

  async getServiceDependencies(serviceId: string): Promise<string[]> {
    const result = await this.session.run(
      `MATCH (s:Service {id: $serviceId})-[:DEPENDS_ON]->(dep:Service)
       RETURN dep.id as id, dep.name as name`,
      { serviceId }
    );

    return result.records.map(record => record.get('id'));
  }

  async findRelatedServices(serviceId: string): Promise<any[]> {
    const result = await this.session.run(
      `MATCH (s:Service {id: $serviceId})-[:BELONGS_TO_CATEGORY]->(c:Category)
       MATCH (other:Service)-[:BELONGS_TO_CATEGORY]->(c)
       WHERE other.id <> s.id
       RETURN other.id, other.name, COUNT(*) as relevance
       ORDER BY relevance DESC
       LIMIT 5`,
      { serviceId }
    );

    return result.records.map(record => ({
      id: record.get('other.id'),
      name: record.get('other.name'),
      relevance: record.get('relevance'),
    }));
  }

  async close(): Promise<void> {
    await this.session.close();
    await this.driver.close();
  }
}
```

---

## Embeddings Pipeline

### Embeddings Service

```typescript
// services/ai-orchestration/src/service/embeddings.service.ts
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { logger } from '../../../libs/logging/logger';

export class EmbeddingsService {
  private embeddings: OpenAIEmbeddings;
  private pinecone: Pinecone;

  constructor(openaiKey: string, pineconeKey: string, pineconeEnv: string) {
    this.embeddings = new OpenAIEmbeddings({ apiKey: openaiKey });
    this.pinecone = new Pinecone({ apiKey: pineconeKey });
  }

  async indexService(serviceId: string, name: string, description: string): Promise<void> {
    try {
      const vector = await this.embeddings.embedQuery(
        `${name}: ${description}`
      );

      const index = this.pinecone.Index('services');
      await index.upsert([
        {
          id: serviceId,
          values: vector,
          metadata: { name, type: 'service' },
        },
      ]);

      logger.info('Service indexed', { serviceId });
    } catch (error) {
      logger.error('Failed to index service', error as Error);
      throw error;
    }
  }

  async search(query: string, topK: number = 5): Promise<any[]> {
    try {
      const vector = await this.embeddings.embedQuery(query);
      const index = this.pinecone.Index('services');

      const results = await index.query({
        vector,
        topK,
        includeMetadata: true,
      });

      return results.matches.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      }));
    } catch (error) {
      logger.error('Search failed', error as Error);
      throw error;
    }
  }

  async bulkIndex(items: Array<{ id: string; name: string; description: string }>): Promise<void> {
    try {
      const vectors = await Promise.all(
        items.map(item =>
          this.embeddings.embedQuery(`${item.name}: ${item.description}`)
        )
      );

      const index = this.pinecone.Index('services');
      await index.upsert(
        items.map((item, i) => ({
          id: item.id,
          values: vectors[i],
          metadata: { name: item.name, type: 'service' },
        }))
      );

      logger.info('Bulk indexed items', { count: items.length });
    } catch (error) {
      logger.error('Bulk indexing failed', error as Error);
      throw error;
    }
  }
}
```

---

## Database Schema for Phase 3

```sql
-- Chat Sessions & Messages
CREATE TABLE ai_service.chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_service.users(id),
  status VARCHAR DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_service.chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES ai_service.chat_sessions(id),
  user_id UUID REFERENCES user_service.users(id),
  role VARCHAR NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Service Recommendations
CREATE TABLE ai_service.recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_service.users(id),
  service_id UUID,
  reason VARCHAR,
  confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Embeddings Cache
CREATE TABLE ai_service.embeddings_cache (
  id UUID PRIMARY KEY,
  entity_id UUID NOT NULL,
  entity_type VARCHAR NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user ON ai_service.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON ai_service.chat_messages(session_id);
CREATE INDEX idx_recommendations_user ON ai_service.recommendations(user_id);
```

---

## API Examples

### Chat API

```bash
# Create chat session
curl -X POST http://localhost:3003/api/chat/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid"}'

# Send message
curl -X POST http://localhost:3003/api/chat/sessions/session-id/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I get a national ID?"}'

# Response
{
  "response": "To get a national ID in Ethiopia, you need to...",
  "tokens": 156,
  "recommendations": [
    {
      "service_id": "service-123",
      "name": "National ID Service",
      "confidence": 0.95
    }
  ]
}
```

### Knowledge Graph API

```bash
# Get service requirements
curl http://localhost:3003/api/ai/query?service=national-id&query=requirements

# Get related services
curl http://localhost:3003/api/ai/query?service=national-id&query=related

# Analyze eligibility
curl -X POST http://localhost:3003/api/ai/analyze-eligibility \
  -H "Content-Type: application/json" \
  -d '{
    "user_age": 18,
    "citizen_status": "ethiopian",
    "service_id": "national-id"
  }'
```

---

## Success Metrics for Phase 3

✅ Groq integration responding < 200ms  
✅ Chat sessions supporting 10+ turn conversations  
✅ Knowledge graph containing 100+ services & relationships  
✅ Embeddings search returning relevant results > 90% accuracy  
✅ System handling 100 concurrent chat sessions  
✅ AI service supporting 50+ users simultaneously  

---

## Development Timeline

**Week 1-2: AI Orchestration & Groq**
- Set up service structure
- Integrate Groq API
- Implement chat endpoints
- Add conversation memory

**Week 2-3: Knowledge Graph**
- Design Neo4j schema
- Populate initial data
- Query optimization
- Integrate with chat

**Week 3-4: Embeddings Pipeline**
- Set up Pinecone
- Generate embeddings
- Implement semantic search
- Add recommendations

**Week 4-6: Testing & Optimization**
- Load testing
- Performance tuning
- Integration testing
- Deploy to staging

---

## Environment Variables Needed

```bash
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-west1-gcp
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
```

---

**Status:** Phase 3 Design & Scaffold Ready  
**Next:** Team implements Groq integration and chat service  
**Then:** Add knowledge graph and embeddings pipeline
