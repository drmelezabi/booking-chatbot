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
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeLocalReservations;
