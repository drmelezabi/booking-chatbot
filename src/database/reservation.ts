import db from "./setup";

type reservation = {
  accountId: string; // studentId
  reservationId: string;
  Date: Date;
};

const Reservation = db.createCollection<reservation>("reservation");

export default Reservation;
