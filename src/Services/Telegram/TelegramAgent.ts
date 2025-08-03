import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { ChatService } from 'src/Services/Chat/Chat.service';

@Injectable()
export class TelegramAgent {
  private botInstance: Bot;
  private readonly logger = new Logger(TelegramAgent.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly chatService: ChatService
  ) {
    const token = this.configService.get<string>('TELEGRAM_KEY') ?? undefined;
    if (token) {
      this.botInstance = new Bot(token);

      this.botInstance.on('message', async (ctx) => {
        const message = ctx.message; // the message object
        //Telegram does not show the phone number in the message object, so we will use the user id as such
        const userId = message.from.id;
        const chatId = message.chat.id;

        const responseMessage = await this.chatService.manageMessage(message.text, userId.toString());

        await this.botInstance.api.sendMessage(chatId, responseMessage);
      });

      this.botInstance.start().catch((e) => {
        this.logger.error('An error ocurred in the telegram integration');
        this.logger.error(e);
      });
    } else {
      this.logger.warn('No telegram token was provided, integration will be disabled');
    }
  }
}
