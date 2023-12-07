import localDb from "../../config/localDb";
import getAvail from "./getAvail";

interface IAvail {
  id?: string;
  reservationId?: string;
  pin?: number;
  host?: boolean;
  availId?: string;
  date?: Date;
  availName?: string;
}

const updateLocalAvailObj = async (pin: number, Avail: IAvail) => {
  try {
    const avails = await getAvail();

    if (!avails.length) return false;

    const isExisted = avails.filter((AvailObj) => Avail.pin === pin);

    if (!isExisted.length) return false;

    const oldAvailObj = isExisted[0];

    const omitAvails = avails.filter((AvailObj) => Avail.pin != pin);

    const newObj = [...omitAvails, { ...oldAvailObj, ...Avail }];

    await localDb.push("/avail", newObj, false);
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateLocalAvailObj;
