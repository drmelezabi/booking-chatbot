import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

export const getRestOfToday = () => {
  const now = new Date(); //"December 7, 2023  19:00:00"
  const currentHour = now.getHours();
  try {
    const bookingClose = db.get<number>("bookingClose");

    if (currentHour < bookingClose) {
      const start = new Date(now);
      start.setDate(start.getDate());
      start.setHours(currentHour, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate());
      end.setHours(bookingClose, 0, 0, 0);
      return { start, end };
    } else return null;
  } catch (error) {
    throw ErrorHandler(error, "getRestOfToday");
  }
};
