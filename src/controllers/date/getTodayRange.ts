export const getTodayRange = () => {
  const now = new Date("December 3, 2023  07:00:00"); //"December 7, 2023  19:00:00"
  const currentHour = now.getHours();
  const sRange = 7;
  const eRange = 17;

  if (currentHour < eRange) {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(sRange, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else return null;
};
