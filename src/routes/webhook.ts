import { Router, Request, Response } from 'express';
import Joi from 'joi';
import logger from '../utils/logger';
import discordBot from '../services/discordBot';
import { TradingAlert } from '../types';

const router = Router();

// Validation schema for TradingView webhook data
const alertSchema = Joi.object({
  secret: Joi.string().required(),
  symbol: Joi.string().required(),
  action: Joi.string().valid('BUY', 'SELL', 'HOLD').required(),
  price: Joi.number().required(),
  rsi: Joi.number().optional(),
  macd: Joi.number().optional(),
  volume: Joi.number().optional(),
  timestamp: Joi.string().optional(),
  message: Joi.string().optional()
});

// TradingView webhook endpoint
router.post('/tradingview', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Received webhook request:', req.body);

    // Validate the request body
    const { error, value } = alertSchema.validate(req.body);
    if (error) {
      logger.warn('Invalid request data:', error.details);
      res.status(400).json({ error: 'Invalid request data' });
      return;
    }

    // Verify webhook secret
    if (value.secret !== process.env['WEBHOOK_SECRET']) {
      logger.warn('Invalid webhook secret');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Send alert to Discord
    await discordBot.sendTradingAlert(value as TradingAlert);

    logger.info(`Successfully processed alert for ${value.symbol}`);
    res.status(200).json({ success: true, message: 'Alert processed' });

  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process alert' });
  }
});

export default router; 