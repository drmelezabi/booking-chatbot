import localDb from "../../config/localDb";
import Reservation from "../../database/reservation";

export interface IReservation {
  accountId: string;
  reservationId: string;
  Date: Date;
}

const addLocalReservations = async (reservation: IReservation) => {
  try {
    Reservation.create(reservation);
    Reservation.save();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default addLocalReservations;
