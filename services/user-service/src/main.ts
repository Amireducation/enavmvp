// File: services/user-service/src/main.ts
// Purpose: User Service entry point
// Handles all user-related operations (auth, profiles, roles)

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from '../../libs/logging/logger';
import { connectionPool } from '../../libs/database/connection-pool';
import { environmentConfig, validateConfiguration } from '../../config/environment';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { authMiddleware } from './middleware/auth.middleware';

class UserService {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = environmentConfig.services.userService.port;
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
        service: 'user-service',
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
        service: 'user-service',
        timestamp: new Date().toISOString(),
      });
    });

    // Public routes (authentication)
    this.app.use('/api/auth', authRoutes);

    // Protected routes (require authentication)
    this.app.use('/api/users', authMiddleware, userRoutes);
    this.app.use('/api/profile', authMiddleware, userRoutes);

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
      const isHealthy = await connectionPool.healthCheck('user-service');
      if (!isHealthy) {
        throw new Error('Database connection failed');
      }

      logger.info('Database connection verified', { service: 'user-service' });

      // Start server
      this.app.listen(this.port, environmentConfig.app.host, () => {
        logger.info('User Service started', {
          port: this.port,
          host: environmentConfig.app.host,
        });
      });
    } catch (error) {
      logger.error('Failed to start User Service', error as Error);
      process.exit(1);
    }
  }
}

// Start service
const userService = new UserService();
userService.start();

export default userService;
