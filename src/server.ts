import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import logger from './utils/logger';
import webhookRoutes from './routes/webhook';
import discordBot from './services/discordBot';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize Discord bot
async function initializeBot(): Promise<void> {
  try {
    // Check if Discord credentials are properly configured
    if (!process.env['DISCORD_BOT_TOKEN'] || process.env['DISCORD_BOT_TOKEN'] === 'your_discord_bot_token_here') {
      logger.warn('Discord bot token not configured. Discord functionality will be disabled.');
      logger.info('To enable Discord integration, set DISCORD_BOT_TOKEN in your .env file');
      return;
    }
    
    if (!process.env['DISCORD_CHANNEL_ID'] || process.env['DISCORD_CHANNEL_ID'] === 'your_discord_channel_id_here') {
      logger.warn('Discord channel ID not configured. Discord functionality will be disabled.');
      logger.info('To enable Discord integration, set DISCORD_CHANNEL_ID in your .env file');
      return;
    }

    try {
      await discordBot.initialize();
      logger.info('Discord bot initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Discord bot:', (error as Error).message);
      logger.info('Server will continue running without Discord functionality');
    }
  } catch (error) {
    logger.error('Discord bot initialization error:', (error as Error).message);
    logger.info('Server will continue running without Discord functionality');
  }
}

initializeBot().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Webhook URL: http://localhost:${PORT}/webhook/tradingview`);
  });
});

export default app; 