import localDb from "../../config/localDb";
import checkRegisteredPhones from "./getRegisteredPhones";

interface registeredData {
  studentId?: string;
  chatId?: string;
  recoveryId?: string;
  type?: string;
  admin?: boolean;
}
const updateRegisteredPhone = async (
  studentId: string,
  reg: registeredData
) => {
  try {
    const registeredD = await checkRegisteredPhones();

    if (!registeredD.length) return false;

    const isExisted = registeredD.filter(
      (reservation) => reservation.studentId === studentId
    );

    if (!isExisted.length) return false;

    const oldReservation = isExisted[0];

    const omitReservations = registeredD.filter(
      (reservation) => reservation.studentId != studentId
    );

    const newObj = [...omitReservations, { ...oldReservation, ...reg }];

    await localDb.push("/registeredPhone", newObj, true);
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateRegisteredPhone;
