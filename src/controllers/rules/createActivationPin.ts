import localDb from "../../config/localDb";

export interface IActivationObject {
  reservationId: string;
  pin: number;
  creationDate: Date;
  name: string;
}

const createActivationPin = async (activationObject: IActivationObject) => {
  try {
    await localDb.push("/activationPin[]", activationObject, true);
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default createActivationPin;
