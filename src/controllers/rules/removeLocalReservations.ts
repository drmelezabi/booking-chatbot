import localDb from "../../config/localDb";

interface IReservations {
  studentId: string;
  reservationId: string;
  Date: Date;
}

const removeLocalReservations = async (reservationId: string) => {
  try {
    const reservations =
      await localDb.getObject<IReservations[]>("/reservation");

    const filteredReservations = reservations.filter(
      (reservation) => reservation.reservationId != reservationId
    );
    await localDb.push("/reservation", filteredReservations, true);
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeLocalReservations;
