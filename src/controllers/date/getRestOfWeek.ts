export const geRestOfWeek = () => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const number = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const now = new Date(); //"December 7, 2023  19:00:00"
  const dayName = names[now.getDay()];
  const currentHour = now.getHours();
  const eRange = 17;

  if (dayName === "Fri") {
    const start = new Date(now);
    start.setDate(start.getDate() + 2);
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + 6);
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu" && currentHour >= eRange) {
    const start = new Date(now);
    start.setDate(start.getDate() + 2);
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else if (dayName === "Thu") {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else {
    console.log("hi");
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const dayNumber =
      number.findIndex((element) => element === names[start.getDay()]) + 1;
    const end = new Date(now);
    console.log(dayNumber);
    end.setDate(end.getDate() + (6 - dayNumber));
    end.setHours(eRange, 0, 0, 0);

    return { start, end };
  }
};
