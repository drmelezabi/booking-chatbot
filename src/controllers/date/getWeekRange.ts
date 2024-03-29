import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

export const getWeekRange = () => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const now = new Date(); //"December 7, 2023  19:00:00"
  const dayName = names[now.getDay()];
  const currentHour = now.getHours();
  try {
    const bookingClose = db.get<number>("bookingClose");

    if (dayName === "Fri") {
      const start = new Date(now);
      start.setDate(start.getDate() + 1);
      start.setHours(currentHour, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() + 6);
      end.setHours(bookingClose, 0, 0, 0);
      return { start, end };
    } else if (dayName === "Thu" && currentHour >= bookingClose) {
      const start = new Date(now);
      start.setDate(start.getDate() + 2);
      start.setHours(currentHour, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      end.setHours(bookingClose, 0, 0, 0);
      return { start, end };
    } else {
      const start = new Date(now);
      const dayNumber =
        number.findIndex((element) => element === names[start.getDay()]) + 1;
      start.setDate(start.getDate() - dayNumber + 1);
      start.setHours(currentHour, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() + (6 - dayNumber));
      end.setHours(bookingClose, 0, 0, 0);

      return { start, end };
    }
  } catch (error) {
    throw ErrorHandler(error, "getWeekRange");
  }
};
