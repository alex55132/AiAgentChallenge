import { Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export interface EmbedSearchQueryResultItem {
  id: number;
  content: string;
  similarity: number;
}

@Injectable()
export class EmbeddingsSearchService {
  constructor(private readonly sequelize: Sequelize) {}

  /**
   * This method uses a custom query since postgresql vector extension doesn't provide a function that fits our requirements.
   * The query generates a table with the id, content and the similarity.
   *
   * The similarity is the result of the cosine distance (<==>) between our text embeddings and the row embeddings. This is because the cosine distance measure
   * the angle of the vectors in a multidimensional space (In this case we have 1532 dimensions for openai models). Depending on how close are the directions of the vectors,
   * more or less similar are the text that represent those vectors. Since 1 is the value result of being exactly the same direction (And thus the same text), we use the
   * cosine distance (g.embeddings <=> :query_embeddings) value for getting the actual similarity of both vectors.
   *
   * After getting the similarity it also uses a threshold for filtering results that are too different for our use case.
   *
   * It laters order the results so we get the most similar result first.
   *
   * Lastly it limit the amount of results that we receive
   *
   * @param queryEmbeddings number array with the text embeddings
   * @param similarity_threshold number threshold for how similar we want the results. The higher the more restrictive the query results are
   * @param match_count number that specifies the amount of results that we want to receive
   * @returns EmbedSearchQueryResultItem Results of the mentioned query
   */
  async retrieveRelatedEmbeddings(
    queryEmbeddings: number[],
    similarity_threshold: number,
    match_count: number
  ): Promise<EmbedSearchQueryResultItem[]> {
    const results: EmbedSearchQueryResultItem[] = await this.sequelize.query(
      `
        select
            g.id,
            g.content,
            1 - (g.embeddings <=> :query_embeddings) as similarity
        from "Guidelines" g
        where (1 - (g.embeddings <=> :query_embeddings)) > :similarity_threshold
        order by g.embeddings <=> :query_embeddings
        limit :match_count;
        `,
      {
        replacements: {
          query_embeddings: JSON.stringify(queryEmbeddings),
          similarity_threshold,
          match_count,
        },
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
    return results;
  }
}
