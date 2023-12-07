import localDb from "../../config/localDb";
import { IActivationObject } from "./createActivationPin";

const removeActivationPin = async (reservationId: string) => {
  try {
    const reservations =
      await localDb.getObject<IActivationObject[]>("/activationPin");

    const filteredActivation = reservations.filter(
      (activationObj) => activationObj.reservationId != reservationId
    );
    await localDb.push("/activationPin", filteredActivation, true);
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

export default removeActivationPin;
