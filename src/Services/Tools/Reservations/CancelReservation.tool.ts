import { Injectable, Logger } from '@nestjs/common';
import { CancelReservationService } from '@services/Reservations/CancelReservation.service';
import { tool } from 'ai';
import z from 'zod';

@Injectable()
export class CancelReservationTool {
  private readonly logger = new Logger(CancelReservationTool.name);
  constructor(private readonly cancelReservationService: CancelReservationService) {}

  getTool(phoneNumber: string) {
    return tool({
      id: 'aiagentproject.cancelReservation',
      description: 'Cancel the reservation for the restaurant',
      inputSchema: z.object({}),
      outputSchema: z.void().or(z.string()),
      execute: async () => {
        try {
          await this.cancelReservationService.cancelReservation(phoneNumber);
        } catch (e) {
          this.logger.error(e);
          return 'An error ocurred cancelling the reservation';
        }
      },
    });
  }
}
