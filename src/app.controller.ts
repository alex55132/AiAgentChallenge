import { ChatInputDto, ChatOutputDto } from '@Dto/Chat.dto';
import { GenerateAndSaveEmbeddingDto } from '@Dto/GenerateAndSaveEmbedding.dto';
import { Body, Controller, Post, Put } from '@nestjs/common';
import { ChatService } from '@services/Chat/Chat.service';
import { GuidelinesCreatorService } from '@services/Guidelines/GuidelinesCreator.service';

@Controller()
export class AppController {
  constructor(
    private readonly guidelinesCreatorService: GuidelinesCreatorService,
    private readonly chatService: ChatService
  ) {}

  @Put('guideline')
  async generateAndSaveEmbedding(@Body() data: GenerateAndSaveEmbeddingDto) {
    await this.guidelinesCreatorService.createGuideline(data.guideline);
  }

  @Post('chat')
  async chat(@Body() data: ChatInputDto): Promise<ChatOutputDto> {
    const answer = await this.chatService.manageMessage(data.userInput, data.phoneNumber);
    answer.replaceAll('\\n', '\n');
    return {
      answer,
    };
  }
}
