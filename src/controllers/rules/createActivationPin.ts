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

export default createActivationPin;
