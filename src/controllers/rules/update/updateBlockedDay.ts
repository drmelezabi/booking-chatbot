import { arabicName } from "../../../config/diff";
import db from "../../../database/setup";

type blockedDays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

const updateBlockedDays = async (
  add: blockedDays[],
  remove: blockedDays[]
): Promise<string | null> => {
  try {
    const originalBlockedDays = db.get<blockedDays[]>("blockedDays");

    const Filtered: Set<blockedDays> = new Set();
    originalBlockedDays.map((day) => Filtered.add(day));
    add.map((day) => {
      Filtered.add(day);
    });
    remove.map((day) => {
      if (Filtered.has(day)) {
        Filtered.delete(day);
      }
    });

    const newArray = [...Filtered];

    db.set("blockedDays", newArray);
    db.save();

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

export default updateBlockedDays;
