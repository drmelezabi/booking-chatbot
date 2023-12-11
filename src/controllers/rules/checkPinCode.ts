import localDb from "../../config/localDb";
import Reservation from "../../database/reservation";
import getStudentViolations from "../accounts/getStudentViolations";
import { IActivationObject } from "./createActivationPin";
import removeActivationPin from "./removeActivationPin";
import removeLocalReservations from "./removeLocalReservations";

const checkPinCode = async (pin: number): Promise<string | true> => {
  try {
    const isExist = (
      await localDb.getObject<IActivationObject[]>("/activationPin")
    ).filter((activationObj) => activationObj.pin === pin);

    if (!isExist.length) return "رمز التفعيل غير صحيح";

    if (isExist.length > 1) {
      await Promise.all(
        isExist.map(async (activationObj) => {
          await removeActivationPin(activationObj.reservationId);
        })
      );
      return "مشكلة في تفعيل الحجز";
    }

    const valid = isExist.filter((activationObj) => {
      const oneMinutes = 1 * 60 * 1000; // Convert 1 minutes to milliseconds
      const lowerBound = new Date(
        activationObj.creationDate.getTime() + oneMinutes
      );
      return new Date() > lowerBound;
    });

    if (!valid.length) {
      await removeActivationPin(isExist[0].reservationId);
      return "رمز التفعيل انتهى صلاحيته";
    }

    const reservation = Reservation.fetch(
      (reservation) => reservation.reservationId === isExist[0].reservationId
    );

    if (!reservation) {
      await removeActivationPin(isExist[0].reservationId);
      return "حجز غير صحيح";
    }

    const oneHour = 60 * 60 * 1000; // Convert 1 minutes to milliseconds

    const reservationEnded = new Date(reservation.Date.getTime() + oneHour);

    if (new Date() >= reservationEnded) {
      await removeActivationPin(reservation.reservationId);
      await getStudentViolations(reservation.accountId);
      await removeLocalReservations(reservation.reservationId);
      return "انتهت صلاحية الحجز";
    }

    return true;
  } catch (error: any) {
    console.log(error.message);
    return "حدث خطأ";
  }
};

export default checkPinCode;
