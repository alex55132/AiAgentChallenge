import { Reservation } from '@models/Reservation';
import { Injectable } from '@nestjs/common';
import { ReservationNotFoundError } from '@Types/Errors/ReservationNotFoundError';

@Injectable()
export class FindReservationService {
  async findLastReservation(phoneNumber: string, isCancelled?: boolean): Promise<Reservation> {
    const foundReservation: Reservation | undefined =
      (await Reservation.findOne({
        where: {
          clientNumber: phoneNumber,
          ...(isCancelled !== undefined && { isCancelled }), //Sequelize don't like undefined for ignoring fields so we have to manually check before adding it to the object
        },
        order: [['createdAt', 'DESC']], //We want to find the last reservation made
        limit: 1,
      })) ?? undefined;

    if (!foundReservation) {
      throw new ReservationNotFoundError();
    }

    return foundReservation;
  }
}
