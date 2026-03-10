#!/usr/bin/env node

// File: backend/scripts/phase1-health-check.ts
// Purpose: Comprehensive health check for Phase 1 infrastructure
// Validates database setup, connection pools, monitoring, and service readiness

import { connectionPool } from '../libs/database/connection-pool';
import { environmentConfig, validateConfiguration } from '../config/environment';
import { logger } from '../libs/logging/logger';

interface HealthCheckResult {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
}

class Phase1HealthCheck {
  private results: HealthCheckResult[] = [];

  async run(): Promise<void> {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   Phase 1 Infrastructure Health Check                    ║');
    console.log('║   Ethiopian Navigator - MVP to Production Upgrade        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    try {
      await this.checkEnvironmentConfiguration();
      await this.checkDatabaseConnection();
      await this.checkMicroserviceSchemas();
      await this.checkConnectionPool();
      await this.checkMonitoringSetup();
      await this.checkLoggingSetup();
      await this.checkAIConfiguration();

      this.printResults();
    } catch (error) {
      logger.error('Health check failed', error as Error);
      process.exit(1);
    } finally {
      await connectionPool.closeAll();
    }
  }

  private async checkEnvironmentConfiguration(): Promise<void> {
    console.log('📋 Checking Environment Configuration...');

    const validationErrors = validateConfiguration();

    if (validationErrors.length === 0) {
      this.results.push({
        component: 'Environment Configuration',
        status: 'healthy',
        message: 'All required environment variables are set',
      });
    } else {
      this.results.push({
        component: 'Environment Configuration',
        status: 'error',
        message: `Configuration errors detected: ${validationErrors.join(', ')}`,
        details: validationErrors,
      });
    }
  }

  private async checkDatabaseConnection(): Promise<void> {
    console.log('🔌 Checking Database Connection...');

    try {
      const isHealthy = await connectionPool.healthCheck();

      if (isHealthy) {
        this.results.push({
          component: 'Database Connection',
          status: 'healthy',
          message: 'Database is reachable and responding',
          details: {
            url: environmentConfig.database.url.substring(0, 50) + '...',
            poolMin: environmentConfig.database.poolMin,
            poolMax: environmentConfig.database.poolMax,
          },
        });
      } else {
        this.results.push({
          component: 'Database Connection',
          status: 'error',
          message: 'Database health check failed',
        });
      }
    } catch (error) {
      this.results.push({
        component: 'Database Connection',
        status: 'error',
        message: 'Failed to connect to database',
        details: { error: (error as Error).message },
      });
    }
  }

  private async checkMicroserviceSchemas(): Promise<void> {
    console.log('📦 Checking Microservice Schemas...');

    try {
      const schemas = [
        'user_service',
        'service_management',
        'content_service',
        'payment_service',
        'ai_service',
        'notification_service',
        'analytics_service',
        'partnership_service',
        'g2g_service',
        'b2b_service',
        'shared_infrastructure',
      ];

      const results = await connectionPool.executeQuery<{ schema_name: string }>(
        `
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = ANY($1)
        `,
        [schemas]
      );

      const createdSchemas = results.map((r) => r.schema_name);
      const missingSchemas = schemas.filter((s) => !createdSchemas.includes(s));

      if (missingSchemas.length === 0) {
        this.results.push({
          component: 'Microservice Schemas',
          status: 'healthy',
          message: 'All microservice schemas exist',
          details: {
            schemasCreated: schemas.length,
          },
        });
      } else {
        this.results.push({
          component: 'Microservice Schemas',
          status: 'warning',
          message: `${missingSchemas.length} schemas are missing`,
          details: { missingSchemas },
        });
      }
    } catch (error) {
      this.results.push({
        component: 'Microservice Schemas',
        status: 'error',
        message: 'Failed to check schemas',
        details: { error: (error as Error).message },
      });
    }
  }

  private async checkConnectionPool(): Promise<void> {
    console.log('🏊 Checking Connection Pool...');

    try {
      // Try to get a client
      const client = await connectionPool.getClient();
      client.release();

      this.results.push({
        component: 'Connection Pool',
        status: 'healthy',
        message: 'Connection pool is functional',
        details: {
          minConnections: environmentConfig.database.poolMin,
          maxConnections: environmentConfig.database.poolMax,
          idleTimeout: environmentConfig.database.idleTimeout,
        },
      });
    } catch (error) {
      this.results.push({
        component: 'Connection Pool',
        status: 'error',
        message: 'Connection pool check failed',
        details: { error: (error as Error).message },
      });
    }
  }

  private async checkMonitoringSetup(): Promise<void> {
    console.log('📊 Checking Monitoring Setup...');

    const monitoring = environmentConfig.monitoring;
    const enabled = [];
    const disabled = [];

    if (monitoring.datadog.enabled) {
      enabled.push('Datadog');
    } else {
      disabled.push('Datadog');
    }

    if (monitoring.sentry.enabled) {
      enabled.push('Sentry');
    } else {
      disabled.push('Sentry');
    }

    if (monitoring.prometheus.enabled) {
      enabled.push('Prometheus');
    } else {
      disabled.push('Prometheus');
    }

    const status = enabled.length > 0 ? 'healthy' : 'warning';
    const message =
      enabled.length > 0
        ? `${enabled.length} monitoring tools configured`
        : 'No monitoring tools configured';

    this.results.push({
      component: 'Monitoring Setup',
      status: status as any,
      message,
      details: {
        enabled,
        disabled,
      },
    });
  }

  private async checkLoggingSetup(): Promise<void> {
    console.log('📝 Checking Logging Setup...');

    const logging = environmentConfig.logging;

    this.results.push({
      component: 'Logging Setup',
      status: 'healthy',
      message: 'Logging is configured',
      details: {
        level: logging.level,
        format: logging.format,
        prettyPrint: logging.prettyPrint,
      },
    });
  }

  private async checkAIConfiguration(): Promise<void> {
    console.log('🤖 Checking AI Configuration...');

    const ai = environmentConfig.ai;
    const hasGroqKey = ai.groq.apiKey.length > 0;

    if (hasGroqKey) {
      this.results.push({
        component: 'AI Configuration',
        status: 'healthy',
        message: 'Groq AI is configured',
        details: {
          model: ai.groq.model,
          embeddingProvider: ai.embedding.provider,
        },
      });
    } else {
      this.results.push({
        component: 'AI Configuration',
        status: 'warning',
        message: 'Groq API key not configured',
        details: {
          message: 'AI features will be limited without Groq API key',
        },
      });
    }
  }

  private printResults(): void {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   Health Check Results                                    ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    for (const result of this.results) {
      const icon =
        result.status === 'healthy'
          ? '✓'
          : result.status === 'warning'
            ? '⚠'
            : '✗';
      const color =
        result.status === 'healthy'
          ? '\x1b[32m'
          : result.status === 'warning'
            ? '\x1b[33m'
            : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(`${color}${icon} ${result.component}${reset}`);
      console.log(`   ${result.message}`);

      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
      console.log();
    }

    // Summary
    const healthy = this.results.filter((r) => r.status === 'healthy').length;
    const warnings = this.results.filter((r) => r.status === 'warning').length;
    const errors = this.results.filter((r) => r.status === 'error').length;

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log(`║  Summary: ${healthy} Healthy | ${warnings} Warnings | ${errors} Errors          ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    if (errors > 0) {
      process.exit(1);
    }
  }
}

// Run health check
const healthCheck = new Phase1HealthCheck();
healthCheck.run();
