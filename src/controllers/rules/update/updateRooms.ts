import ErrorHandler from "../../../config/errorhandler";
import db from "../../../database/setup";

const updateRooms = async (
  add: string[],
  remove: string[]
): Promise<string | null> => {
  try {
    const originalBlockedDays = db.get<string[]>("rooms");

    add.map((day) => {
      if (!originalBlockedDays.includes(day)) {
        db.push<string>("rooms", day);
        db.save();
      }
    });
    remove.map((day) => {
      if (originalBlockedDays.includes(day)) {
        db.pull<string>("rooms", day);
        db.save();
      }
    });

    const newArray = db.get<string[]>("rooms");

    const msg =
      newArray.length > 0
        ? `الغرف المتاحة هي \n${
            newArray.length ? "     - " : ""
          }${newArray.join("\n     - ")}`
        : "لايوجد قاعات للمذاكرة";

    return msg;
  } catch (error) {
    throw ErrorHandler(error, "updateRooms");
  }
};

export default updateRooms;
