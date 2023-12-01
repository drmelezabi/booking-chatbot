export const getDayRange = (day: string) => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const now = new Date(); //"December 7, 2023  19:00:00"
  const dayName = names[now.getDay()];
  const currentHour = now.getHours();
  const sRange = 7;
  const eRange = 17;

  if (dayName === "Fri") {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    if (day === "Fri") return null;
    const start = new Date(now);
    start.setDate(start.getDate() + dayNumber);
    start.setHours(sRange, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + dayNumber);
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu" && currentHour >= eRange) {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    const start = new Date(now);
    start.setDate(start.getDate() + dayNumber + 1);
    start.setHours(sRange, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + dayNumber + 1);
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu") {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    const start = new Date(now);
    start.setDate(start.getDate() + dayNumber + 1);
    start.setHours(sRange, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + dayNumber + 1);
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else if (dayName === day && currentHour < eRange) {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else {
    const todayDayName = names[now.getDay()];
    const todayDayNumber =
      number.findIndex((element) => element === todayDayName) + 1;
    const requestDayNumber = number.findIndex((element) => element === day) + 1;
    const daySteps = requestDayNumber - todayDayNumber;
    if (daySteps < 0) return null;
    const start = new Date(now);
    start.setDate(start.getDate() + daySteps - 1);
    start.setHours(sRange, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + daySteps - 1);
    end.setHours(eRange, 0, 0, 0);

    return { start, end };
  }
};
