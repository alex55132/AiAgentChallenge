import { Injectable, Logger } from '@nestjs/common';
import { tool } from 'ai';
import z from 'zod';
import { UpdateReservationService } from '../../Reservations/UpdateReservation.service';

@Injectable()
export class UpdateReservationTool {
  private readonly logger = new Logger(UpdateReservationTool.name);
  constructor(private readonly updateReservationService: UpdateReservationService) {}

  getTool(phoneNumber: string) {
    return tool({
      id: 'aiagentproject.updateReservation',
      description: 'Update the reservation for the restaurant given a date, amount of people and additional data',
      inputSchema: z.object({
        date: z.iso.datetime().refine((date) => new Date(date) > new Date(), {
          message: 'Date must be in the future',
        }),
        people: z.number(),
        additionalInfo: z.string(),
      }),
      outputSchema: z.void().or(z.string()),
      execute: async ({ date: dateObj, people, additionalInfo }) => {
        try {
          await this.updateReservationService.updateReservation(phoneNumber, {
            date: new Date(dateObj),
            people,
            additionalInfo,
          });
        } catch (e) {
          this.logger.error(e);
          return 'An error ocurred updating the reservation';
        }
      },
    });
  }
}
