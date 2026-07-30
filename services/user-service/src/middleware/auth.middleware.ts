// File: services/user-service/src/middleware/auth.middleware.ts
// Purpose: JWT authentication middleware for protected routes

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../libs/logging/logger';
import userService from '../service/user.service';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: Missing token' });
      return;
    }

    const decoded = await userService.validateToken(token);

    req.user = decoded;
    req.userId = decoded.userId;

    logger.setContext({
      userId: decoded.userId,
      userRole: decoded.role,
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message });
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
}
