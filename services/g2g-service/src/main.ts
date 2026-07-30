import express, { Express, Request, Response } from 'express';
import { Logger } from '@shared/logging';
import { G2GCollaborationService } from './service/g2g.service';
import { WorkflowEngine } from './service/workflow.engine';

const app: Express = express();
const logger = new Logger('G2GService');

app.use(express.json());

const g2gService = new G2GCollaborationService();
const workflowEngine = new WorkflowEngine();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'g2g-service' });
});

// Create G2G request
app.post('/requests', async (req: Request, res: Response) => {
  try {
    const { requestingAgencyId, receivingAgencyId, serviceId, requestType } = req.body;
    
    logger.info('Creating G2G request', { requestingAgencyId, receivingAgencyId, serviceId });
    
    const request = await g2gService.createRequest({
      requestingAgencyId,
      receivingAgencyId,
      serviceId,
      requestType,
    });
    
    res.status(201).json(request);
  } catch (error) {
    logger.error('Failed to create G2G request', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get G2G request
app.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const request = await g2gService.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    logger.error('Failed to fetch G2G request', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Update request status
app.patch('/requests/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const request = await g2gService.updateRequestStatus(req.params.id, status);
    res.json(request);
  } catch (error) {
    logger.error('Failed to update request status', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// List G2G requests
app.get('/requests', async (req: Request, res: Response) => {
  try {
    const { agencyId, status, limit = 20, offset = 0 } = req.query;
    
    const requests = await g2gService.listRequests({
      agencyId: agencyId as string,
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
    
    res.json(requests);
  } catch (error) {
    logger.error('Failed to list requests', error);
    res.status(500).json({ error: 'Failed to list requests' });
  }
});

// Create workflow
app.post('/workflows', async (req: Request, res: Response) => {
  try {
    const { name, description, steps } = req.body;
    
    const workflow = await workflowEngine.createWorkflow({
      name,
      description,
      steps,
    });
    
    res.status(201).json(workflow);
  } catch (error) {
    logger.error('Failed to create workflow', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Execute workflow
app.post('/workflows/:id/execute', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;
    
    const execution = await workflowEngine.executeWorkflow(req.params.id, requestId);
    res.json(execution);
  } catch (error) {
    logger.error('Failed to execute workflow', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
});

const PORT = process.env.G2G_SERVICE_PORT || 3005;
app.listen(PORT, () => {
  logger.info(`G2G Service listening on port ${PORT}`);
});
