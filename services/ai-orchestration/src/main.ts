// File: services/ai-orchestration/src/main.ts
// Purpose: AI Orchestration Service - Central AI intelligence hub

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from '../../libs/logging/logger';
import { connectionPool } from '../../libs/database/connection-pool';
import { environmentConfig, validateConfiguration } from '../../config/environment';
import { chatRoutes } from './routes/chat.routes';
import { aiRoutes } from './routes/ai.routes';
import { authMiddleware } from '../../services/user-service/src/middleware/auth.middleware';

class AIOrchestrationService {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = environmentConfig.services.aiOrchestration?.port || 3003;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] || `req-${Date.now()}`;
      logger.setContext({
        requestId: String(requestId),
        service: 'ai-orchestration',
        path: req.path,
        method: req.method,
      });
      next();
    });

    this.app.use(cors(environmentConfig.apiGateway.cors));
    this.app.use(express.json());
    this.app.use(express.urlencoding({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        service: 'ai-orchestration',
        timestamp: new Date().toISOString(),
        models: {
          groq: 'operational',
          embeddings: 'operational',
          knowledgeGraph: 'operational',
        },
      });
    });

    // Public routes
    this.app.use('/api/ai', aiRoutes);

    // Protected routes
    this.app.use('/api/chat', authMiddleware, chatRoutes);

    // 404
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Not found' });
    });
  }

  private setupErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.error('Unhandled error', err);
      const status = err.status || 500;
      const message = err.message || 'Internal server error';

      res.status(status).json({
        error: message,
        requestId: req.headers['x-request-id'],
      });
    });
  }

  async start(): Promise<void> {
    try {
      const configErrors = validateConfiguration();
      if (configErrors.length > 0) {
        throw new Error(`Configuration errors: ${configErrors.join(', ')}`);
      }

      const isHealthy = await connectionPool.healthCheck('ai-orchestration');
      if (!isHealthy) {
        throw new Error('Database connection failed');
      }

      logger.info('Database connection verified', { service: 'ai-orchestration' });

      this.app.listen(this.port, environmentConfig.app.host, () => {
        logger.info('AI Orchestration Service started', {
          port: this.port,
          host: environmentConfig.app.host,
        });
      });
    } catch (error) {
      logger.error('Failed to start AI Orchestration Service', error as Error);
      process.exit(1);
    }
  }
}

const aiService = new AIOrchestrationService();
aiService.start();

export default aiService;
