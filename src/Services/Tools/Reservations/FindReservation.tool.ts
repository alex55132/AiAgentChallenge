import { Injectable, Logger } from '@nestjs/common';
import { FindReservationService } from '@services/Reservations/FindReservation.service';
import { ReservationNotFoundError } from '@Types/Errors/ReservationNotFoundError';
import { tool } from 'ai';
import z from 'zod';

interface FindReservationData {
  phoneNumber: string;
  date: string;
  people: number;
  additionalInfo: string;
  isCancelled: boolean;
}

@Injectable()
export class FindReservationTool {
  private readonly logger = new Logger(FindReservationTool.name);
  constructor(private readonly findReservationService: FindReservationService) {}

  getTool(phoneNumber: string) {
    return tool({
      id: 'aiagentproject.findReservation',
      description: 'Find the reservation for a client at the restaurant',
      inputSchema: z.object({}),
      outputSchema: z
        .object({
          phoneNumber: z.string(),
          date: z.iso.datetime(),
          people: z.number(),
          additionalInfo: z.string(),
          isCancelled: z.boolean(),
        })
        .or(z.string()),
      execute: async (): Promise<FindReservationData | string> => {
        try {
          const reservationData = await this.findReservationService.findLastReservation(phoneNumber);
          return {
            people: reservationData.people,
            additionalInfo: reservationData.additionalInfo,
            date: reservationData.date.toISOString(),
            phoneNumber: reservationData.clientNumber,
            isCancelled: reservationData.isCancelled,
          };
        } catch (e) {
          if (e instanceof ReservationNotFoundError) {
            return 'The reservation was not found';
          }
          this.logger.error(e);
          return 'An error ocurred retrieving the reservation, try again later';
        }
      },
    });
  }
}
