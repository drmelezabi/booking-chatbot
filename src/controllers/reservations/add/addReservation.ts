import addLocalReservations from "./addLocalReservation";
import ErrorHandler from "../../../config/errorhandler";
import { genId20 } from "../../../config/IDs";
import addDocument from "../../addCloudDoc";

interface IReservation {
  case: number;
  room: string;
  start: Date;
  stdId: string;
  student: string;
  supervisor?: string;
}

const createNewReservation = async (reservation: IReservation) => {
  try {
    const reservationId = genId20();
    await addDocument("reservation", reservationId, reservation);
    await addLocalReservations({
      accountId: reservation.stdId,
      reservationId: reservationId,
      Date: reservation.start,
    });
  } catch (error) {
    throw ErrorHandler(error, "createNewReservation");
  }
};

export default createNewReservation;
