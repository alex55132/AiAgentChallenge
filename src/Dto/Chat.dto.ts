import { IsNumberString, IsString } from 'class-validator';

export class ChatInputDto {
  @IsString()
  userInput: string;

  @IsNumberString()
  phoneNumber: string;
}

export class ChatOutputDto {
  @IsString()
  answer: string;
}
