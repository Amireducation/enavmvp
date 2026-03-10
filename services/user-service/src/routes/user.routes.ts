// File: services/user-service/src/routes/user.routes.ts
// Purpose: Protected user profile and admin routes

import { Router, Response } from 'express';
import { logger } from '../../../libs/logging/logger';
import userService from '../service/user.service';
import { AuthenticatedRequest, requireRole } from '../middleware/auth.middleware';
import { UpdateUserRequest, CreateUserRequest, ChangePasswordRequest } from '../models/user.model';

const router = Router();

// GET /api/profile - Current user profile
router.get('/profile', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUser(req.userId!);
    res.json(user);
  } catch (error) {
    logger.error('Failed to get profile', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/profile - Update current user profile
router.patch('/profile', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data: Partial<UpdateUserRequest> = req.body;
    const user = await userService.updateProfile(req.userId!, data);
    res.json(user);
  } catch (error) {
    logger.error('Failed to update profile', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data: ChangePasswordRequest = req.body;

    if (!data.currentPassword || !data.newPassword) {
      res.status(400).json({ error: 'Both passwords required' });
      return;
    }

    await userService.changePassword(req.userId!, data);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Failed to change password', error as Error);
    res.status(400).json({ error: (error as Error).message });
  }
});

// Admin Routes
// GET /api/users - List users (admin only)
router.get(
  '/',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      logger.error('Failed to list users', error as Error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// GET /api/users/[id] - Get user (admin only)
router.get(
  '/:id',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await userService.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      logger.error('Failed to get user', error as Error);
      res.status(404).json({ error: 'User not found' });
    }
  }
);

// POST /api/users - Create user (admin only)
router.post(
  '/',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const data: CreateUserRequest = req.body;

      if (!data.email || !data.password || !data.full_name) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const user = await userService.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Failed to create user', error as Error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

export default router;
