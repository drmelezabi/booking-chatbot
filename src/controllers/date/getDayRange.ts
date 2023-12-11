import db from "../../database/setup";

export const getDayRange = (day: string) => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const now = new Date(); //"December 7, 2023  19:00:00"
  const dayName = names[now.getDay()];
  const currentHour = now.getHours();

  const bookingOpen = db.get<number>("bookingOpen");
  const bookingClose = db.get<number>("bookingClose");

  if (dayName === "Fri") {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    if (day === "Fri") return null;
    const start = new Date(now);
    start.setDate(start.getDate() + dayNumber);
    start.setHours(bookingOpen, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + dayNumber);
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu" && currentHour >= bookingClose) {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    const start = new Date(now);
    start.setDate(start.getDate() + dayNumber);
    start.setHours(bookingOpen, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + dayNumber);
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu") {
    if (day !== "Thu") return null;
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  } else if (dayName === day && currentHour < bookingClose) {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  } else {
    const todayDayName = names[now.getDay()];
    const todayDayNumber =
      number.findIndex((element) => element === todayDayName) + 1;
    const requestDayNumber = number.findIndex((element) => element === day) + 1;
    const daySteps = requestDayNumber - todayDayNumber;
    if (daySteps < 0) return null;
    const start = new Date(now);
    start.setDate(start.getDate() + daySteps);
    start.setHours(bookingOpen, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + daySteps);
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  }
};
