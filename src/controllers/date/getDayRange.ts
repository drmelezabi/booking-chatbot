export const getDayRange = (day: string) => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const date = new Date();
  const dayName = names[date.getDay()];

  if (dayName === "Fri") {
    const dayNumber = number.findIndex((element) => element === day) + 1;
    if (day === "Fri") {
      return null;
    }
    const start = new Date();
    start.setDate(start.getDate() + dayNumber);
    start.setHours(7, 0, 0, 0);
    const end = new Date();
    end.setDate(end.getDate() + dayNumber);
    end.setHours(17, 0, 0, 0);
    return { start, end };
  } else {
    return "OtherDays";
  }
};
