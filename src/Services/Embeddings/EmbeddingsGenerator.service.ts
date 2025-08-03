import { openai } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { embed } from 'ai';

@Injectable()
export class EmbeddingsGeneratorService {
  async generateEmbeddingBasedOnText(text: string): Promise<number[]> {
    const { embedding } = await embed({
      model: openai.textEmbeddingModel('text-embedding-3-small'),
      value: text,
    });

    return embedding;
  }
}
