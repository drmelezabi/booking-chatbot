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
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeActivationPin;
