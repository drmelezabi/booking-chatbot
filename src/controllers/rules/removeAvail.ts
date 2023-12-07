import localDb from "../../config/localDb";
import { IAvail } from "./getAvail";

const removeAvail = async (pin: number) => {
  try {
    const avail = await localDb.getObject<IAvail[]>("/avail");

    const filteredAvail = avail.filter((av) => av.pin != pin);
    await localDb.push("/avail", filteredAvail, true);
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

export default removeAvail;
