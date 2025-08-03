import { IsString } from 'class-validator';

export class GenerateAndSaveEmbeddingDto {
  @IsString()
  guideline: string;
}
