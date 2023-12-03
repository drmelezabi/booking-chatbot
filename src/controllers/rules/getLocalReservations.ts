import localDb from "../../config/localDb";

interface IReservations {
  studentId: string;
  reservationId: string;
  Date: Date;
}

const getLocalReservations = async (): Promise<IReservations[]> => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.getObject<IReservations[]>("/reservation");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getLocalReservations;
