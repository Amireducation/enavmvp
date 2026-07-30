// File: services/service-management/src/routes/request.routes.ts
// Purpose: Protected service request routes

import { Router, Response } from 'express';
import { logger } from '../../../libs/logging/logger';
import serviceMgmtService from '../service/service.service';
import { AuthenticatedRequest } from '../../../services/user-service/src/middleware/auth.middleware';
import { CreateServiceRequestData } from '../models/service.model';

const router = Router();

// POST /api/requests - Create service request
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data: CreateServiceRequestData = req.body;

    if (!data.service_id || !data.form_data) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const request = await serviceMgmtService.createRequest(req.userId!, data);
    res.status(201).json(request);
  } catch (error) {
    logger.error('Failed to create request', error as Error);
    res.status(400).json({ error: (error as Error).message });
  }
});

// GET /api/requests - List user's requests
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await serviceMgmtService.listRequests(req.userId!, {
      status: req.query.status as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    });

    res.json(requests);
  } catch (error) {
    logger.error('Failed to list requests', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/requests/:id - Get request details
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const request = await serviceMgmtService.getRequest(req.params.id);

    // Verify ownership
    if (request.user_id !== req.userId && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.json(request);
  } catch (error) {
    logger.error('Failed to get request', error as Error);
    res.status(404).json({ error: 'Request not found' });
  }
});

export default router;
