export const geRestOfToday = () => {
  const now = new Date(); //"December 7, 2023  19:00:00"
  const currentHour = now.getHours();
  const eRange = 17;

  if (currentHour < eRange) {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(eRange, 0, 0, 0);
    return { start, end };
  } else return null;
};