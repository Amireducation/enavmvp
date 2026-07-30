import express, { Express, Request, Response } from 'express';
import { Logger } from '@shared/logging';
import { NotificationService } from './service/notification.service';

const app: Express = express();
const logger = new Logger('NotificationService');

app.use(express.json());

const notificationService = new NotificationService();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// Send email notification
app.post('/email', async (req: Request, res: Response) => {
  try {
    const { to, subject, template, data } = req.body;
    
    logger.info('Sending email', { to, subject });
    
    const result = await notificationService.sendEmail({
      to,
      subject,
      template,
      data,
    });
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to send email', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send SMS notification
app.post('/sms', async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;
    
    logger.info('Sending SMS', { phone });
    
    const result = await notificationService.sendSMS({
      phone,
      message,
    });
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to send SMS', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send push notification
app.post('/push', async (req: Request, res: Response) => {
  try {
    const { userId, title, message, data } = req.body;
    
    logger.info('Sending push notification', { userId, title });
    
    const result = await notificationService.sendPush({
      userId,
      title,
      message,
      data,
    });
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to send push notification', error);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

// Get notification preferences
app.get('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const preferences = await notificationService.getPreferences(req.params.userId);
    res.json(preferences);
  } catch (error) {
    logger.error('Failed to get preferences', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

// Update notification preferences
app.patch('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const preferences = await notificationService.updatePreferences(
      req.params.userId,
      req.body
    );
    res.json(preferences);
  } catch (error) {
    logger.error('Failed to update preferences', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3006;
app.listen(PORT, () => {
  logger.info(`Notification Service listening on port ${PORT}`);
});
