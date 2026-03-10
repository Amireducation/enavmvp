// File: services/service-management/src/main.ts
// Purpose: Service Management Service entry point
// Handles service catalog, requests, and workflows

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from '../../libs/logging/logger';
import { connectionPool } from '../../libs/database/connection-pool';
import { environmentConfig, validateConfiguration } from '../../config/environment';
import serviceRoutes from './routes/service.routes';
import requestRoutes from './routes/request.routes';
import { authMiddleware } from '../../services/user-service/src/middleware/auth.middleware';

class ServiceManagementService {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = environmentConfig.services.serviceManagement.port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] || `req-${Date.now()}`;
      logger.setContext({
        requestId: String(requestId),
        service: 'service-management',
        path: req.path,
        method: req.method,
      });
      next();
    });

    // CORS
    this.app.use(cors(environmentConfig.apiGateway.cors));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        service: 'service-management',
        timestamp: new Date().toISOString(),
      });
    });

    // Public routes
    this.app.use('/api/services', serviceRoutes);

    // Protected routes
    this.app.use('/api/requests', authMiddleware, requestRoutes);

    // 404 handler
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
      // Validate configuration
      const configErrors = validateConfiguration();
      if (configErrors.length > 0) {
        throw new Error(`Configuration errors: ${configErrors.join(', ')}`);
      }

      // Test database connection
      const isHealthy = await connectionPool.healthCheck('service-management');
      if (!isHealthy) {
        throw new Error('Database connection failed');
      }

      logger.info('Database connection verified', { service: 'service-management' });

      // Start server
      this.app.listen(this.port, environmentConfig.app.host, () => {
        logger.info('Service Management Service started', {
          port: this.port,
          host: environmentConfig.app.host,
        });
      });
    } catch (error) {
      logger.error('Failed to start Service Management Service', error as Error);
      process.exit(1);
    }
  }
}

// Start service
const serviceMgmtService = new ServiceManagementService();
serviceMgmtService.start();

export default serviceMgmtService;
