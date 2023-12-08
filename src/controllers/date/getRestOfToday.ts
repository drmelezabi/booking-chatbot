import getRules from "../rules/getRules";

export const getRestOfToday = async () => {
  const now = new Date(); //"December 7, 2023  19:00:00"
  const currentHour = now.getHours();
  const { bookingClose } = await getRules();

  if (currentHour < bookingClose) {
    const start = new Date(now);
    start.setDate(start.getDate());
    start.setHours(currentHour, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate());
    end.setHours(bookingClose, 0, 0, 0);
    return { start, end };
  } else return null;
};
