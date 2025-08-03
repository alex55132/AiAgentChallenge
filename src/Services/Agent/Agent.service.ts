import { openai } from '@ai-sdk/openai';
import { Message } from '@models/Message';
import { Injectable, Logger } from '@nestjs/common';
import { FormattedMessage } from '@services/Chat/Chat.service';
import { EmbedSearchQueryResultItem } from '@services/Embeddings/EmbeddingsSearch.service';
import { GetAllergensInfoTool } from '@services/Tools/GetAllergensInfo.tool';
import { CancelReservationTool } from '@services/Tools/Reservations/CancelReservation.tool';
import { CreateReservationTool } from '@services/Tools/Reservations/CreateReservation.tool';
import { FindReservationTool } from '@services/Tools/Reservations/FindReservation.tool';
import { UpdateReservationTool } from '@services/Tools/Reservations/UpdateReservation.tool';
import { generateText, stepCountIs } from 'ai';

@Injectable()
export class AgentService {
  constructor(
    private readonly getAllergensInfoService: GetAllergensInfoTool,
    private readonly createReservationTool: CreateReservationTool,
    private readonly updateReservationTool: UpdateReservationTool,
    private readonly cancelReservationTool: CancelReservationTool,
    private readonly findReservationTool: FindReservationTool
  ) {}

  private readonly logger = new Logger(AgentService.name);

  async assistUser(
    promptMessages: FormattedMessage[],
    additionalInstructions: EmbedSearchQueryResultItem[],
    phoneNumber: string
  ) {
    const additionalConditionals = this.formatConditionals(additionalInstructions);

    const systemCompletePrompt = this.generateSystemPrompt(additionalConditionals, phoneNumber);

    this.logger.debug('System prompt:');
    this.logger.debug(systemCompletePrompt);

    const result = await generateText({
      model: openai('gpt-4.1'),
      tools: {
        getAllergensInfo: this.getAllergensInfoService.getTool(),
        createReservation: this.createReservationTool.getTool(),
        updateReservation: this.updateReservationTool.getTool(phoneNumber),
        cancelReservation: this.cancelReservationTool.getTool(phoneNumber),
        findReservation: this.findReservationTool.getTool(phoneNumber),
      },
      system: systemCompletePrompt,
      stopWhen: stepCountIs(5),
      messages: promptMessages,
    });

    let finalText = result.text;

    const message = new Message({
      clientNumber: phoneNumber,
      role: 'assistant',
      message: finalText,
    });

    await message.save();

    return finalText;
  }

  private generateSystemPrompt(additionalConditionals: string, phoneNumber: string): string {
    const todayDate: string = new Date().toLocaleDateString('en-US');
    const todayDay: string = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(new Date());

    return `You are an agent for managing customers in a restaurant.
    Your job is only to take care of their information requests (Such as timetables, information for allergic people) and manage the reservations that they may do.
    Do not attend other inquiries if not related with the restaurant management.
    
    Be wary of the language, since customers may ask you for reservations using sentences such as "next monday", "2 weeks from now"...
    When assigning the date make sure that the starting date is today, so 2 weeks from today will be 14 days in the future. 
    For reference, today's date is ${todayDate}, and the day is ${todayDay}. This date and day is the one you must use for the calculations.

    Only assign reservation dates that are today or in the future. Never select dates in the past.
    When interpreting expressions like "next Monday" or "in 2 weeks", always calculate the date starting from the current day (i.e., today's actual date).
    If a calculated date ends up being in the past (e.g., "next Monday" resolves to a Monday that has already passed), adjust it to refer to the next upcoming such date. 
    Do not return or suggest any date before today. If uncertain, ask for clarification.
    Do not include the reasoning behind the date you picked in the response.

    In order to do your job, you will have available tools such as findReservation (To find reservation information), createReservation (To create new reservations), 
    updateReservation (To change details about the reservation), cancelReservation (To cancel the reservations) that will allow you to handle reservation requests, 
    but you must only call them when you have all the required details before. 
    Do not cancel any reservation unless explicitely stated by the client in their last message.
    You can read the conversation in case the details are split in multiple messages.

    In case you find any issue performing any of the operations, tell the user that there are technical issues and to try again later.
    
    In case you need the client phone number for any operation you will use the following number: ${phoneNumber}
      
    Additionaly, before giving an answer to the user, consider all of the following guidelines (It is super important that you MUST execute any tool that is mentioned in the list): 
    ${additionalConditionals}`;
  }

  private formatConditionals(additionalInstructions: EmbedSearchQueryResultItem[]): string {
    return additionalInstructions
      .map((item, index) => {
        return `- ${item.content} `;
      })
      .join('\n\n');
  }
}
