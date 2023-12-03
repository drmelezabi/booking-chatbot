import localDb from "../../config/localDb";

interface IReservations {
  studentId: string;
  reservationId: string;
  Date: Date;
}

const addLocalReservations = async (reservation: IReservations) => {
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
