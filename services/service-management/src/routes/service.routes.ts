// File: services/service-management/src/routes/service.routes.ts
// Purpose: Public service catalog routes

import { Router, Request, Response } from 'express';
import { logger } from '../../../libs/logging/logger';
import serviceMgmtService from '../service/service.service';
import { ServiceFilter } from '../models/service.model';

const router = Router();

// GET /api/services - List services
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: ServiceFilter = {
      category_id: req.query.category as string,
      sector_id: req.query.sector as string,
      search: req.query.search as string,
      online_only: req.query.online_only === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const services = await serviceMgmtService.listServices(filter);
    res.json({ services, total: services.length });
  } catch (error) {
    logger.error('Failed to list services', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/services/:id - Get service details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await serviceMgmtService.getService(req.params.id);
    res.json(service);
  } catch (error) {
    logger.error('Failed to get service', error as Error);
    res.status(404).json({ error: 'Service not found' });
  }
});

// GET /api/services/categories - List categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await serviceMgmtService.getCategories();
    res.json(categories);
  } catch (error) {
    logger.error('Failed to get categories', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
