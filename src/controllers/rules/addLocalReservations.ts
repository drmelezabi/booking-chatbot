import localDb from "../../config/localDb";

export interface IReservation {
  studentId: string;
  reservationId: string;
  Date: Date;
}

const addLocalReservations = async (reservation: IReservation) => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.push("/reservation[]", reservation, true);
      resolve(rulesData);
      return;
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default addLocalReservations;
