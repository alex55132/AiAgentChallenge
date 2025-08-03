import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from 'src/Models/Reservation';
import { ReservationAlreadyExistsError } from 'src/Types/Errors/ReservationAlreadyExistsError';
import { ReservationNotFoundError } from 'src/Types/Errors/ReservationNotFoundError';
import { FindReservationService } from './FindReservation.service';

interface ReservationData {
  clientNumber: string;
  date: Date;
  people: number;
  additionalInfo: string;
}

@Injectable()
export class CreateReservationService {
  private readonly logger = new Logger(CreateReservationService.name);

  constructor(private readonly findReservationService: FindReservationService) {}

  async createReservation(reservationData: ReservationData) {
    const { clientNumber, date, people, additionalInfo } = reservationData;

    try {
      //Check no reservation exists yet
      const existingReservation: Reservation | undefined = await this.findReservationService.findLastReservation(
        clientNumber,
        false
      );

      if (existingReservation) {
        throw new ReservationAlreadyExistsError();
      }
    } catch (e) {
      if (e instanceof ReservationNotFoundError) {
        const reservation = new Reservation({
          clientNumber,
          date,
          people,
          additionalInfo,
        });

        await reservation.save();
      } else {
        this.logger.error(e);
        //In case we have any other error than ReservationNotFoundError we just throw
        throw e;
      }
    }
  }
}
