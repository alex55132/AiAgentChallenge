import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageRole } from 'src/Models/Message';
import { AgentService } from 'src/Services/Agent/Agent.service';
import { EmbeddingsGeneratorService } from '../Embeddings/EmbeddingsGenerator.service';
import { EmbeddingsSearchService } from '../Embeddings/EmbeddingsSearch.service';

export interface FormattedMessage {
  role: MessageRole;
  content: string;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly agent: AgentService,
    private readonly embeddingsGenerator: EmbeddingsGeneratorService,
    private readonly embeddingSearch: EmbeddingsSearchService
  ) {}

  private readonly logger = new Logger(ChatService.name);

  async manageMessage(prompt: string, phoneNumber: string): Promise<string> {
    const userMessage = new Message({
      clientNumber: phoneNumber,
      role: 'user',
      message: prompt,
    });

    this.logger.debug(`Generating embeddings based on the prompt for number ${phoneNumber}`);
    const promptEmbed = await this.embeddingsGenerator.generateEmbeddingBasedOnText(prompt);
    const embedSearchResult = await this.embeddingSearch.retrieveRelatedEmbeddings(promptEmbed, 0.1, 5);
    this.logger.debug('Embeddings done, saving user message');
    await userMessage.save();

    this.logger.debug('Building messages history');
    const messages = await this.buildPromptMessages(phoneNumber);
    const text = await this.agent.assistUser(messages, embedSearchResult, phoneNumber);
    return text;
  }

  private async buildPromptMessages(phoneNumber: string): Promise<FormattedMessage[]> {
    const historyMessages = await Message.findAll({
      where: {
        clientNumber: phoneNumber,
      },
      order: [['createdAt', 'DESC']],
      limit: 10, //Max 10 messages for the conversation
    });

    const promptMessages = historyMessages
      .map((currentMessage) => {
        return {
          role: currentMessage.role,
          content: currentMessage.message,
        };
      })
      .reverse(); //We need this since we got the data from the db as DESC but the AI requires it as ASC

    return promptMessages;
  }
}
