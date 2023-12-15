import db from "./setup";

export type IReservation = {
  accountId: string; // studentId
  reservationId: string;
  Date: Date;
};

const Reservation = db.createCollection<IReservation>("reservation");

export default Reservation;
