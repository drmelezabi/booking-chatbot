function getDaySchedule(dayName: string): { start: Date; end: Date } | null {
  const now = new Date();
  const today = now.getDay();
  const currentHour = now.getHours();
  const nextWeek = now.setDate(now.getDate() + ((6 - today + 1) % 7));

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const requestedDayIndex = daysOfWeek.indexOf(dayName);

  if (requestedDayIndex === -1 || requestedDayIndex >= 5) {
    // Invalid day or weekend
    return null;
  }

  if (today === requestedDayIndex && currentHour >= 7) {
    // If it's today and after 7 am, adjust start time to now
    const start = new Date(now);
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setHours(17, 0, 0, 0);
    return { start, end };
  }

  if (today < requestedDayIndex || (today === 5 && currentHour < 17)) {
    // If the requested day is later in the week or it's Friday before 5 pm
    const start = new Date(now);
    start.setDate(now.getDate() + (requestedDayIndex - today));
    start.setHours(7, 0, 0, 0);
    const end = new Date(start);
    end.setHours(17, 0, 0, 0);
    return { start, end };
  }

  if (today === requestedDayIndex && currentHour < 17) {
    // If it's today and before 5 pm
    const start = new Date(now);
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setHours(17, 0, 0, 0);
    return { start, end };
  }

  // If the requested day is today after 5 pm or earlier in the week
  return null;
}
export default getDaySchedule;
