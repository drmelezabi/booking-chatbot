import { arabicName } from "../../../config/diff";
import localDb from "../../../config/localDb";
import getBlockedDays from "../read/getBlockedDays";

type blockedDays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

const updateBlockedDate = async (
  add: Date[],
  remove: Date[]
): Promise<string | null> => {
  try {
    const originalBlockedDays = await getBlockedDays();
    const Filtered: Set<blockedDays> = new Set();
    originalBlockedDays.map((day) => Filtered.add(day));

    const newArray = [...Filtered];

    await localDb.push("/rules/blockedDays", newArray, true);

    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();

    const arArray = newArray.map((day) => arabicName[day]);

    const msg =
      newArray.length > 0
        ? `الأيام المحجوبه الحالية هي \n${
            arArray.length ? "     - " : ""
          }${arArray.join("\n     - ")}`
        : "لايوجد أي يوم محجوبة عن المذاكرة";

    return msg;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export default updateBlockedDate;
