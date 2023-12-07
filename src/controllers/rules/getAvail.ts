import localDb from "../../config/localDb";

export interface IAvail {
  hostId: string;
  pin: number;
  reservationId: string;
  host: boolean;
  availId?: string;
  reservationDate: Date;
  availCreatedDate: Date;
  availName?: string;
}

const getAvail = async (): Promise<IAvail[]> => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.getObject<IAvail[]>("/avail");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getAvail;
