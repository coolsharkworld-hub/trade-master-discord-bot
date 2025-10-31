import { Request, Response, NextFunction } from 'express';

export interface TradingAlert {
  secret: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  rsi?: number;
  macd?: number;
  volume?: number;
  timestamp?: string;
  message?: string;
}

export interface DiscordBotConfig {
  token: string;
  channelId: string;
}

export interface ServerConfig {
  port: number;
  webhookSecret: string;
}

export interface CustomRequest extends Request {
  body: TradingAlert;
}

export interface CustomResponse extends Response {
  // Add any custom response properties if needed
}

export interface CustomNextFunction extends NextFunction {
  // Add any custom next function properties if needed
}

export interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  add(transport: any): void;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  timestamp?: Date;
  footer?: {
    text: string;
  };
} 