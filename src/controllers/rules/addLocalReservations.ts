import localDb from "../../config/localDb";

export interface IReservation {
  studentId: string;
  reservationId: string;
  Date: Date;
}

const addLocalReservations = async (reservation: IReservation) => {
  try {
    localDb.push("/reservation[]", reservation, true);
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default addLocalReservations;
