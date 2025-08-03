import { Injectable } from '@nestjs/common';
import { FindReservationService } from './FindReservation.service';

interface UpdateReservationData {
  date: Date;
  people: number;
  additionalInfo: string;
}

@Injectable()
export class UpdateReservationService {
  constructor(private readonly findReservationService: FindReservationService) {}

  async updateReservation(phoneNumber: string, reservationData: UpdateReservationData) {
    const foundReservation = await this.findReservationService.findLastReservation(phoneNumber);

    foundReservation.date = reservationData.date;
    foundReservation.people = reservationData.people;
    foundReservation.additionalInfo = reservationData.additionalInfo;

    await foundReservation.save();
  }
}
