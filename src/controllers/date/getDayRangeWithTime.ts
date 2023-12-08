import getRules from "../rules/getRules";

export const getDayRangeWithTime = async (day: string, time: string) => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const { bookingOpen, bookingClose } = await getRules();

  const now = new Date(); //"December 7, 2023  19:00:00"
  const dayName = names[now.getDay()];
  const currentHour = now.getHours();

  const timeArray = time.split(":");

  const hour = +timeArray[0];
  const minuet = +timeArray[1];

  if (hour < bookingOpen) {
    return 1;
  } else {
    if (dayName === "Fri") {
      const dayNumber = number.findIndex((element) => element === day) + 1;
      const start = new Date(now);
      start.setDate(start.getDate() + dayNumber);
      start.setHours(hour, minuet, 0, 0);
      const end: Date = new Date(start.getTime() + 29 * 60000);
      return { start, end };
    } else if (dayName === "Thu" && currentHour >= bookingClose) {
      const dayNumber = number.findIndex((element) => element === day) + 1;
      const start = new Date(now);
      start.setDate(start.getDate() + dayNumber);
      start.setHours(hour, minuet, 0, 0);
      const end: Date = new Date(start.getTime() + 29 * 60000);
      return { start, end };
    } else if (dayName === "Thu") {
      if (day !== "Thu") return 2;
      const start = new Date(now);
      start.setDate(start.getDate());
      start.setHours(hour, minuet, 0, 0);
      const end: Date = new Date(start.getTime() + 29 * 60000);
      return { start, end };
    } else if (dayName === day && currentHour < bookingClose) {
      const start = new Date(now);
      start.setDate(start.getDate());
      start.setHours(hour, minuet, 0, 0);
      const end: Date = new Date(start.getTime() + 29 * 60000);
      return { start, end };
    } else {
      const todayDayName = names[now.getDay()];
      const todayDayNumber =
        number.findIndex((element) => element === todayDayName) + 1;
      const requestDayNumber =
        number.findIndex((element) => element === day) + 1;
      const daySteps = requestDayNumber - todayDayNumber;
      if (daySteps < 0) return 2;
      const start = new Date(now);
      start.setDate(start.getDate() + daySteps);
      start.setHours(hour, minuet, 0, 0);
      const end: Date = new Date(start.getTime() + 29 * 60000);
      return { start, end };
    }
  }
};
