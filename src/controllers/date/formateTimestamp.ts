const formatDateTime = (time: Date) => {
  const optionsDay: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    weekday: "long",
  };

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const day = new Intl.DateTimeFormat("ar-EG", optionsDay);
  const date = new Intl.DateTimeFormat("ar-EG", optionsDate);
  const dayTime = new Intl.DateTimeFormat("ar-EG", optionsTime);

  return {
    Day: day.format(time),
    Date: date.format(time),
    Time: dayTime.format(time),
  };
};

export default formatDateTime;
