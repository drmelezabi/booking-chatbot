import ErrorHandler from "../../../config/errorhandler";
import Reservation from "../../../database/reservation";

interface IReservation {
  accountId: string;
  reservationId: string;
  Date: Date;
}

const addLocalReservations = async (reservation: IReservation) => {
  try {
    Reservation.create(reservation);
    Reservation.save();
    return;
  } catch (error) {
    throw ErrorHandler(error, "addLocalReservations");
  }
};

export default addLocalReservations;
