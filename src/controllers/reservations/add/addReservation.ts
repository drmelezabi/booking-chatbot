import { genId20 } from "../../../config/IDs";
import addDocument from "../../addCloudDoc";
import addLocalReservations from "./addLocalReservation";

interface IReservation {
  case: number;
  room: string;
  start: Date;
  stdId: string;
  student: string;
  supervisor?: string;
}

const createNewReservation = async (reservation: IReservation) => {
  const reservationId = genId20();
  try {
    await addDocument("reservation", reservationId, reservation);
    await addLocalReservations({
      accountId: reservation.stdId,
      reservationId: reservationId,
      Date: reservation.start,
    });
  } catch (error) {
    console.log("CreateNewReservation", error);
  }
};

export default createNewReservation;
