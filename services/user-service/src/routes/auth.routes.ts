// File: services/user-service/src/routes/auth.routes.ts
// Purpose: Public authentication routes (register, login)

import { Router, Request, Response } from 'express';
import { logger } from '../../../libs/logging/logger';
import userService from '../service/user.service';
import { AuthRequest, RegisterRequest } from '../models/user.model';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data: RegisterRequest = req.body;

    // Validate input
    if (!data.email || !data.password || !data.full_name) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await userService.register(data);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Registration failed', error as Error);
    res.status(400).json({ error: (error as Error).message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data: AuthRequest = req.body;

    if (!data.email || !data.password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    const result = await userService.login(data);
    res.json(result);
  } catch (error) {
    logger.error('Login failed', error as Error);
    res.status(401).json({ error: (error as Error).message });
  }
});

// POST /api/auth/validate
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(400).json({ error: 'Token required' });
      return;
    }

    const decoded = await userService.validateToken(token);
    res.json({ valid: true, payload: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: (error as Error).message });
  }
});

export default router;
