import localDb from "../../config/localDb";
import getLocalReservations from "./getLocalReservations";

interface IReservation {
  studentId?: string;
  reservationId?: string;
  Date?: Date;
}

const updateLocalReservation = async (
  reservationId: string,
  reservation: IReservation
) => {
  try {
    const reservations = await getLocalReservations();

    if (!reservations.length) return false;

    const isExisted = reservations.filter(
      (reservation) => reservation.reservationId === reservationId
    );

    if (!isExisted.length) return false;

    const oldReservation = isExisted[0];

    const omitReservations = reservations.filter(
      (reservation) => reservation.reservationId != reservationId
    );

    const newObj = [...omitReservations, { ...oldReservation, ...reservation }];

    await localDb.push("/reservation", newObj, false);
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateLocalReservation;
