import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

export const getTodayRange = () => {
  const now = new Date("December 3, 2023  07:00:00"); //"December 7, 2023  19:00:00"
  const currentHour = now.getHours();

  try {
    const bookingOpen = db.get<number>("bookingOpen");
    const bookingClose = db.get<number>("bookingClose");

    if (currentHour < bookingClose) {
      const start = new Date(now);
      start.setDate(start.getDate());
      start.setHours(bookingOpen, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate());
      end.setHours(bookingClose, 0, 0, 0);
      return { start, end };
    } else return null;
  } catch (error) {
    throw ErrorHandler(error, "getTodayRange");
  }
};
