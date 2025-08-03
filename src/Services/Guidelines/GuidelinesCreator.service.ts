import { Guidelines } from '@models/Guidelines';
import { Injectable } from '@nestjs/common';
import { EmbeddingsGeneratorService } from '@services/Embeddings/EmbeddingsGenerator.service';

@Injectable()
export class GuidelinesCreatorService {
  constructor(private readonly embeddingsGeneratorService: EmbeddingsGeneratorService) {}

  async createGuideline(content: string) {
    const embedding = await this.embeddingsGeneratorService.generateEmbeddingBasedOnText(content);

    const guideline = new Guidelines({
      content,
      embeddings: JSON.stringify(embedding),
    });

    await guideline.save();
  }
}
