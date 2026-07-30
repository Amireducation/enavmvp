import express, { Express, Request, Response } from 'express';
import { Logger } from '@shared/logging';
import { PaymentProcessor } from './service/payment.service';

const app: Express = express();
const logger = new Logger('PaymentService');

app.use(express.json());

const paymentProcessor = new PaymentProcessor();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

// Create invoice
app.post('/invoices', async (req: Request, res: Response) => {
  try {
    const { businessId, serviceId, amount, currency } = req.body;
    
    logger.info('Creating invoice', { businessId, serviceId, amount, currency });
    
    const invoice = await paymentProcessor.createInvoice({
      businessId,
      serviceId,
      amount,
      currency,
    });
    
    res.status(201).json(invoice);
  } catch (error) {
    logger.error('Failed to create invoice', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Get invoice
app.get('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const invoice = await paymentProcessor.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    logger.error('Failed to fetch invoice', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Process payment
app.post('/process', async (req: Request, res: Response) => {
  try {
    const { invoiceId, paymentMethod, amount } = req.body;
    
    logger.info('Processing payment', { invoiceId, paymentMethod, amount });
    
    const payment = await paymentProcessor.processPayment({
      invoiceId,
      paymentMethod,
      amount,
    });
    
    res.json(payment);
  } catch (error) {
    logger.error('Payment processing failed', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment history
app.get('/history', async (req: Request, res: Response) => {
  try {
    const { businessId, limit = 10, offset = 0 } = req.query;
    
    const history = await paymentProcessor.getPaymentHistory(
      businessId as string,
      parseInt(limit as string),
      parseInt(offset as string)
    );
    
    res.json(history);
  } catch (error) {
    logger.error('Failed to fetch payment history', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

const PORT = process.env.PAYMENT_SERVICE_PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Payment Service listening on port ${PORT}`);
});
