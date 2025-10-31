import { Client, GatewayIntentBits, EmbedBuilder, TextChannel } from 'discord.js';
import logger from '../utils/logger';
import { TradingAlert } from '../types';

class TradingDiscordBot {
  private client: Client;
  private isReady: boolean;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
      ]
    });
    this.isReady = false;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.once('ready', () => {
        logger.info(`Discord bot logged in as ${this.client.user?.tag}`);
        this.isReady = true;
        resolve();
      });

      this.client.on('error', (error: Error) => {
        logger.error('Discord client error:', error);
      });

      this.client.login(process.env['DISCORD_BOT_TOKEN'])
        .catch(reject);
    });
  }

  async sendTradingAlert(alertData: TradingAlert): Promise<void> {
    if (!this.isReady) {
      logger.warn('Discord bot is not ready. Alert will not be sent to Discord.');
      return;
    }

    try {
      const channel = await this.client.channels.fetch(process.env['DISCORD_CHANNEL_ID']!);
      if (!channel || !channel.isTextBased()) {
        logger.error('Discord channel not found or not a text channel');
        return;
      }

      const textChannel = channel as TextChannel;
      const embed = this.createAlertEmbed(alertData);
      await textChannel.send({ embeds: [embed] });
      logger.info(`Trading alert sent to Discord for ${alertData.symbol}`);
    } catch (error) {
      logger.error('Failed to send Discord message:', (error as Error).message);
    }
  }

  private createAlertEmbed(data: TradingAlert): EmbedBuilder {
    const colors: Record<string, number> = {
      BUY: 0x00FF00,  // Green
      SELL: 0xFF0000, // Red
      HOLD: 0xFFFF00  // Yellow
    };

    const embed = new EmbedBuilder()
      .setTitle(`📈 Trading Signal: ${data.symbol}`)
      .setColor(colors[data.action] || 0x0099FF)
      .addFields(
        { name: '📊 Action', value: data.action, inline: true },
        { name: '💰 Price', value: `$${data.price.toFixed(2)}`, inline: true },
        { name: '⏰ Time', value: new Date().toLocaleString(), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'TradingView Alert' });

    // Add optional technical indicators
    if (data.rsi) {
      embed.addFields({ name: '📈 RSI', value: data.rsi.toString(), inline: true });
    }
    if (data.macd) {
      embed.addFields({ name: '📊 MACD', value: data.macd.toFixed(4), inline: true });
    }
    if (data.volume) {
      embed.addFields({ name: '📦 Volume', value: data.volume.toLocaleString(), inline: true });
    }

    // Add custom message if provided
    if (data.message) {
      embed.setDescription(data.message);
    }

    return embed;
  }
}

const bot = new TradingDiscordBot();
export default bot; 