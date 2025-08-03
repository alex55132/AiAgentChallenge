import { Injectable } from '@nestjs/common';

import { FindReservationService } from './FindReservation.service';

@Injectable()
export class CancelReservationService {
  constructor(private readonly findReservationService: FindReservationService) {}

  async cancelReservation(phoneNumber: string) {
    const foundReservation = await this.findReservationService.findLastReservation(phoneNumber, false);

    foundReservation.isCancelled = true;

    await foundReservation.save();
  }
}
