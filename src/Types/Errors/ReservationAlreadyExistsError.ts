export class ReservationAlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ReservationAlreadyExistsError';
  }
}
