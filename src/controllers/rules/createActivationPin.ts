import localDb from "../../config/localDb";

export interface IActivationObject {
  reservationId: string;
  pin: number;
  creationDate: Date;
}

const createActivationPin = async (activationObject: IActivationObject) => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.push(
        "/suspendedStudent[]",
        activationObject,
        true
      );
      resolve(rulesData);
      return;
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default createActivationPin;
