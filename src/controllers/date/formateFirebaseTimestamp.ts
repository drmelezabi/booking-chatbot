import { Timestamp } from "firebase/firestore";

const formatTimestamp = (time: any) => {
  const optionsDay: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    weekday: "long",
    hour12: true,
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

  const dateFormat = (time as Timestamp).toDate();

  const day = new Intl.DateTimeFormat("ar-EG", optionsDay);
  const date = new Intl.DateTimeFormat("ar-EG", optionsDate);
  const dayTime = new Intl.DateTimeFormat("ar-EG", optionsTime);

  return {
    Day: day.format(dateFormat),
    Date: date.format(dateFormat),
    Time: dayTime.format(dateFormat),
  };
};

export default formatTimestamp;
