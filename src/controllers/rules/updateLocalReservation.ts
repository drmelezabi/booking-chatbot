import localDb from "../../config/localDb";
import Reservation from "../../database/reservation";

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
    const reservations = Reservation.fetchAll();

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

    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateLocalReservation;
