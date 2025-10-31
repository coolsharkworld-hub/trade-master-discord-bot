# TradingView Discord Bot

A TypeScript-based Discord bot that receives TradingView Pine Script alerts via webhooks and forwards them to Discord channels.

## Features

- **TypeScript**: Full TypeScript implementation with strict type checking
- **Webhook Integration**: Receives alerts from TradingView Pine Script
- **Discord Integration**: Sends formatted trading alerts to Discord channels
- **Security**: Rate limiting, CORS, and helmet security middleware
- **Logging**: Comprehensive logging with Winston
- **Validation**: Request validation using Joi
- **Error Handling**: Robust error handling and graceful degradation

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Discord Bot Token
- Discord Channel ID

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tradingview-discord-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here

# Webhook Security
WEBHOOK_SECRET=your_webhook_secret_here
```

## Development

### Development Mode
```bash
npm run dev
```
This starts the server with hot reload using `ts-node-dev`.

### Build for Production
```bash
npm run build
```
This compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server
```bash
npm start
```
This runs the compiled JavaScript from the `dist/` directory.

### Clean Build
```bash
npm run clean
```
This removes the `dist/` directory.

## Project Structure

```
src/
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── utils/
│   └── logger.ts         # Winston logger configuration
├── services/
│   └── discordBot.ts     # Discord bot service
├── routes/
│   └── webhook.ts        # Webhook routes
└── server.ts             # Main server file

dist/                     # Compiled JavaScript (generated)
logs/                     # Application logs
```

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Webhook
- **POST** `/webhook/tradingview` - TradingView alert webhook

#### Webhook Request Format
```json
{
  "secret": "your_webhook_secret",
  "symbol": "BTCUSD",
  "action": "BUY",
  "price": 50000.00,
  "rsi": 30.5,
  "macd": 0.0025,
  "volume": 1000000,
  "message": "RSI oversold, potential reversal"
}
```

## Discord Integration

The bot creates rich embeds with:
- Trading action (BUY/SELL/HOLD) with color coding
- Current price
- Technical indicators (RSI, MACD, Volume)
- Timestamp
- Custom messages

## TradingView Pine Script Integration

Add this to your Pine Script strategy:

```pinescript
// Webhook alert
if strategy.position_size > 0
    alert("BUY", alert.freq_once_per_bar_close)
else if strategy.position_size < 0
    alert("SELL", alert.freq_once_per_bar_close)
```

Configure the webhook URL in TradingView:
```
http://your-server:3000/webhook/tradingview
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `DISCORD_BOT_TOKEN` | Discord bot token | Yes |
| `DISCORD_CHANNEL_ID` | Discord channel ID | Yes |
| `WEBHOOK_SECRET` | Webhook security secret | Yes |

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers middleware
- **Input Validation**: Joi schema validation
- **Webhook Secret**: Authentication for webhook requests

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

In development mode, logs are also output to the console.

## TypeScript Features

- **Strict Mode**: Full type safety with strict TypeScript configuration
- **Interfaces**: Well-defined interfaces for all data structures
- **Type Guards**: Proper type checking and validation
- **ES2020**: Modern JavaScript features
- **Source Maps**: For debugging compiled code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure TypeScript compilation passes: `npm run build`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.