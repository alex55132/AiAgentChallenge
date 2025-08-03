import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import { QueryInterface } from 'sequelize';

import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
dotenv.config();

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      let values = [
        'If the reservation date is on tuesday, let the customer know that the restaurant is closed and it does not take reservations that day',
        "If the customer decides to not make a reservation or to cancel an existing one because of an allergy, let them know that you're very sorry and offer them any food that does not contain the allergen",
        "When making a reservation, if the client doesn't provide how many people are for the reservation or the time and day or the reservation, politely ask them for it",
        'When client is allergic then call the tool getAllergensInfo and compare them with what the user said. If there is any allergen present let the customer know with a joke about that food',
        'When the client tells you the name then in next conversations you call them by that name',
        'When the client request to be seated near the window, tell them we have no windows',
        'When the client request to cancel a reservation then check if the reservation is already cancelled and let them know',
        'When the client request a reservation then make sure he does not have one already',
        'When the client request a reservation, check the conversation to see if he has cancelled one in the last 5 minutes then do not allow him if it has. Only ignore this if the mobile number is 123121312',
        'If the client already has one reservation booked do not allow him to create another',
      ];

      const { embeddings } = await embedMany({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        values,
      });

      const guidelines = [];

      for (const [index, currentEmbedding] of embeddings.entries()) {
        const currentGuideline = {
          content: values[index],
          embeddings: `${JSON.stringify(currentEmbedding)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        guidelines.push(currentGuideline);
      }

      return await queryInterface.bulkInsert('Guidelines', guidelines);
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      //your code here
      return await queryInterface.bulkDelete('Guidelines', null);
    });
  },
};
