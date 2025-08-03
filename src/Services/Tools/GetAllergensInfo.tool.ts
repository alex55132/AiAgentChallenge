import { Injectable } from '@nestjs/common';
import { tool } from 'ai';
import z from 'zod';

@Injectable()
export class GetAllergensInfoTool {
  getTool() {
    return tool({
      id: 'aiagentproject.getAllergensInfo',
      description: 'Get the allergens list for the restaurant',
      inputSchema: z.object(),
      outputSchema: z.array(z.string()),
      execute: () => {
        return ['Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 'Peanuts', 'Wheat', 'Soybeans', 'Sesame'];
      },
    });
  }
}
