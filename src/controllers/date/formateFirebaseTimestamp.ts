import { Timestamp } from "firebase/firestore";

const formatTimestamp = (time: any) => {
  const optionsDay: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour12: true,
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateFormat = (time as Timestamp).toDate();

  const dayName = new Intl.DateTimeFormat("en-US", optionsDay);
  const dayTime = new Intl.DateTimeFormat("en-US", optionsTime);

  return {
    Date: dayName.format(dateFormat),
    Time: dayTime.format(dateFormat),
  };
};

export default formatTimestamp;
