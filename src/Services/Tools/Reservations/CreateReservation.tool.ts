import { Injectable, Logger } from '@nestjs/common';
import { tool } from 'ai';
import z from 'zod';
import { CreateReservationService } from '../../Reservations/CreateReservation.service';

@Injectable()
export class CreateReservationTool {
  private readonly logger = new Logger(CreateReservationTool.name);

  constructor(private readonly createReservationService: CreateReservationService) {}

  getTool() {
    return tool({
      id: 'aiagentproject.createReservation',
      description: 'Creates the reservation for the restaurant given a date, amount of people and additional data',
      inputSchema: z.object({
        phoneNumber: z.string(),
        date: z.iso.datetime().refine((date) => new Date(date) > new Date(), {
          message: 'Date must be in the future',
        }),
        people: z.number(),
        additionalInfo: z.string(),
      }),
      outputSchema: z.void().or(z.string()),
      execute: async ({ phoneNumber, date: dateObj, people, additionalInfo }) => {
        try {
          await this.createReservationService.createReservation({
            clientNumber: phoneNumber,
            date: new Date(dateObj),
            people,
            additionalInfo,
          });
        } catch (e) {
          this.logger.error(e);
          return 'An error ocurred creating the reservation';
        }
      },
    });
  }
}
