// File: backend/libs/logging/logger.ts
// Purpose: Centralized logging system with structured logging support
// Supports Winston logger with multiple transports for production-grade observability

import winston, { Logger, format, transports } from 'winston';
import { environmentConfig } from '../../config/environment';

export interface LogContext {
  userId?: string;
  requestId?: string;
  service?: string;
  sessionId?: string;
  [key: string]: any;
}

class LoggerService {
  private logger: Logger;
  private context: LogContext = {};

  constructor() {
    const isDevelopment = environmentConfig.isDevelopment;
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.metadata(),
      format.errors({ stack: true }),
      format.json()
    );

    const transportsList: any[] = [
      new transports.Console({
        format: isDevelopment
          ? format.combine(
              format.colorize(),
              format.printf(({ level, message, timestamp, ...meta }) => {
                return `${timestamp} [${level}]: ${message} ${
                  Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
                }`;
              })
            )
          : logFormat,
      }),
    ];

    // Add file transports in production
    if (!isDevelopment) {
      transportsList.push(
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: logFormat,
        })
      );
      transportsList.push(
        new transports.File({
          filename: 'logs/combined.log',
          format: logFormat,
        })
      );
    }

    this.logger = winston.createLogger({
      level: environmentConfig.logging.level,
      format: logFormat,
      transports: transportsList,
    });
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private enrichLog(message: string, meta?: any): any {
    return {
      message,
      ...this.context,
      ...meta,
    };
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, this.enrichLog(message, meta));
  }

  error(message: string, error?: Error | any, meta?: any): void {
    const errorMeta = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...meta,
    };
    this.logger.error(message, this.enrichLog(message, errorMeta));
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, this.enrichLog(message, meta));
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, this.enrichLog(message, meta));
  }

  trace(message: string, meta?: any): void {
    this.logger.debug(message, this.enrichLog(message, meta));
  }
}

export const logger = new LoggerService();
export default logger;
