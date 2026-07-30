// File: backend/config/environment.ts
// Purpose: Centralized environment configuration for all services
// Ensures consistent configuration across the microservices architecture

import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  url: string;
  poolMin: number;
  poolMax: number;
  idleTimeout: number;
  connectionTimeout: number;
  ssl: boolean;
}

interface ServiceConfig {
  name: string;
  url: string;
  port: number;
  version: string;
  timeout: number;
}

interface MonitoringConfig {
  datadog: {
    enabled: boolean;
    apiKey: string;
    site: string;
  };
  sentry: {
    enabled: boolean;
    dsn: string;
    environment: string;
  };
  prometheus: {
    enabled: boolean;
    port: number;
  };
}

interface AIConfig {
  groq: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  embedding: {
    provider: string;
    model: string;
    batchSize: number;
  };
}

export const environmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NODE_ENV === 'staging',

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || '',
    poolMin: parseInt(process.env.DB_POOL_MIN || '10'),
    poolMax: parseInt(process.env.DB_POOL_MAX || '30'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
    ssl: process.env.DB_SSL === 'true',
  } as DatabaseConfig,

  // Service Configuration
  services: {
    userService: {
      name: 'user-service',
      url: process.env.USER_SERVICE_URL || 'http://user-service:3001',
      port: parseInt(process.env.USER_SERVICE_PORT || '3001'),
      version: 'v1',
      timeout: 10000,
    },
    serviceManagement: {
      name: 'service-management',
      url: process.env.SERVICE_MGMT_URL || 'http://service-management:3002',
      port: parseInt(process.env.SERVICE_MGMT_PORT || '3002'),
      version: 'v1',
      timeout: 15000,
    },
    contentService: {
      name: 'content-service',
      url: process.env.CONTENT_SERVICE_URL || 'http://content-service:3003',
      port: parseInt(process.env.CONTENT_SERVICE_PORT || '3003'),
      version: 'v1',
      timeout: 10000,
    },
    paymentService: {
      name: 'payment-service',
      url: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004',
      port: parseInt(process.env.PAYMENT_SERVICE_PORT || '3004'),
      version: 'v1',
      timeout: 30000,
    },
    aiOrchestration: {
      name: 'ai-orchestration',
      url: process.env.AI_SERVICE_URL || 'http://ai-service:3005',
      port: parseInt(process.env.AI_SERVICE_PORT || '3005'),
      version: 'v1',
      timeout: 60000,
    },
    notificationService: {
      name: 'notification-service',
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006',
      port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '3006'),
      version: 'v1',
      timeout: 10000,
    },
    analyticsService: {
      name: 'analytics-service',
      url: process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:3007',
      port: parseInt(process.env.ANALYTICS_SERVICE_PORT || '3007'),
      version: 'v1',
      timeout: 60000,
    },
    partnershipService: {
      name: 'partnership-service',
      url: process.env.PARTNERSHIP_SERVICE_URL || 'http://partnership-service:3008',
      port: parseInt(process.env.PARTNERSHIP_SERVICE_PORT || '3008'),
      version: 'v1',
      timeout: 15000,
    },
    g2gService: {
      name: 'g2g-service',
      url: process.env.G2G_SERVICE_URL || 'http://g2g-service:3009',
      port: parseInt(process.env.G2G_SERVICE_PORT || '3009'),
      version: 'v1',
      timeout: 15000,
    },
    b2bService: {
      name: 'b2b-service',
      url: process.env.B2B_SERVICE_URL || 'http://b2b-service:3010',
      port: parseInt(process.env.B2B_SERVICE_PORT || '3010'),
      version: 'v1',
      timeout: 20000,
    },
  } as Record<string, ServiceConfig>,

  // API Gateway Configuration
  apiGateway: {
    port: parseInt(process.env.API_GATEWAY_PORT || '8080'),
    prefix: process.env.API_PREFIX || '/api/v1',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
  },

  // Monitoring Configuration
  monitoring: {
    datadog: {
      enabled: process.env.DATADOG_ENABLED === 'true',
      apiKey: process.env.DATADOG_API_KEY || '',
      site: process.env.DATADOG_SITE || 'datadoghq.com',
    },
    sentry: {
      enabled: process.env.SENTRY_ENABLED === 'true',
      dsn: process.env.SENTRY_DSN || '',
      environment: process.env.NODE_ENV || 'development',
    },
    prometheus: {
      enabled: process.env.PROMETHEUS_ENABLED !== 'false',
      port: parseInt(process.env.PROMETHEUS_PORT || '9090'),
    },
  } as MonitoringConfig,

  // AI Configuration
  ai: {
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
      timeout: parseInt(process.env.GROQ_TIMEOUT || '30000'),
    },
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'groq',
      model: process.env.EMBEDDING_MODEL || 'nomic-embed-text-v1.5',
      batchSize: parseInt(process.env.EMBEDDING_BATCH_SIZE || '10'),
    },
  } as AIConfig,

  // Storage Configuration
  storage: {
    blob: {
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    prettyPrint: process.env.LOG_PRETTY_PRINT === 'true' && !this.isProduction,
  },

  // Application Configuration
  app: {
    name: 'ethiopian-navigator',
    version: process.env.APP_VERSION || '2.0.0',
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
  },
};

// Validate critical configuration
export function validateConfiguration(): string[] {
  const errors: string[] = [];

  if (!environmentConfig.database.url) {
    errors.push('DATABASE_URL is not set');
  }

  if (!environmentConfig.auth.jwtSecret && environmentConfig.isProduction) {
    errors.push('JWT_SECRET must be set in production');
  }

  if (environmentConfig.monitoring.sentry.enabled && !environmentConfig.monitoring.sentry.dsn) {
    errors.push('SENTRY_DSN is required when Sentry monitoring is enabled');
  }

  if (environmentConfig.ai.groq.apiKey && !environmentConfig.ai.groq.apiKey) {
    errors.push('GROQ_API_KEY must be set for AI features');
  }

  return errors;
}

export default environmentConfig;
