import localDb from "../../config/localDb";
import getAvail from "./getAvail";

interface IAvail {
  id?: string;
  reservationId?: string;
  pin?: number;
  host?: boolean;
  availId?: string;
  date?: Date;
}

const updateLocalAvailObj = async (pin: number, AvailObj: IAvail) => {
  try {
    const avails = await getAvail();

    if (!avails.length) return false;

    const isExisted = avails.filter((AvailObj) => AvailObj.pin === pin);

    if (!isExisted.length) return false;

    const oldAvailObj = isExisted[0];

    const omitAvails = avails.filter((AvailObj) => AvailObj.pin != pin);

    const newObj = [...omitAvails, { ...oldAvailObj, ...AvailObj }];

    await localDb.push("/AvailObj", newObj, false);
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateLocalAvailObj;
