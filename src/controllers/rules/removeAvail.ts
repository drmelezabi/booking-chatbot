import localDb from "../../config/localDb";
import { IAvail } from "./getAvail";

const removeAvail = async (pin: number) => {
  try {
    const avail = await localDb.getObject<IAvail[]>("/avail");

    const filteredAvail = avail.filter((av) => av.pin != pin);
    await localDb.push("/avail", filteredAvail, true);
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeAvail;
