export class ReservationNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ReservationNotFoundError';
  }
}
