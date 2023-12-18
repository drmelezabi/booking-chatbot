import starkString from "starkstring";

import getDictionary from "./getExpected";
import db from "../../database/setup";

const preparationHumanType = async (inp: string) => {
  let str = starkString(` ${inp} `).toString(); //returns: 345 45
  const today = new Date();
  const tomorrowD = new Date(today);
  tomorrowD.setDate(today.getDate() + 1);
  const twoDaysAfterTomorrow = new Date(today);
  twoDaysAfterTomorrow.setDate(today.getDate() + 2);
  const threeDaysAfterTomorrow = new Date(today);
  threeDaysAfterTomorrow.setDate(today.getDate() + 3);

  const todayName = today.toLocaleDateString("en-US", { weekday: "short" });
  const tomorrowName = tomorrowD.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const twoAfterTomorrow = twoDaysAfterTomorrow.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const theeAfterTomorrow = threeDaysAfterTomorrow.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const rephrase = getDictionary();

  const tomorrow = /(?<!بعد\s)(بكر[ةه]|غد(اً?|ا)?|الغد(اً?)?)/g;
  const tdy = /ال(?:نهاردة|يوم|نهارده)/g;
  const afterTomorrow = /بعد\s+(بكره|بكرة|الغداً?|الغد|غداً?|غد)/;
  const twoDaysAfter = /بعد\s+(يومين|بعد\s+بكرة|إتنين\s+يوم)/g;
  const threeDayAfter = /بعد بعد (بكر[ةه]|غد(اً?|ا)|الغد(اً?|ا)?)/;
  const regex = new RegExp(Object.keys(rephrase).join("|"), "g");
  const letterBeforeNumberArabic = /(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})/gu;

  str = str
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (match) =>
      starkString(match).englishNumber().toString()
    )
    // .replace(/و\s+نص/g, "ونص")
    .replace(letterBeforeNumberArabic, " ")
    .replace(tdy, todayName)
    .replace(threeDayAfter, theeAfterTomorrow)
    .replace(afterTomorrow, twoAfterTomorrow)
    .replace(twoDaysAfter, twoAfterTomorrow)
    .replace(tomorrow, tomorrowName)
    .replace(/^(\d+|[a-zA-Z]+|[^\w\s]+)$/g, (str) => ` ${str} `)
    .replace(letterBeforeNumberArabic, " ")
    .replace(regex, (matched) => rephrase[matched])
    .replace(letterBeforeNumberArabic, " ")
    .replace(regex, (matched) => rephrase[matched])
    .replace(/\s+/g, " ")
    .trim();

  return str;
};

type dayType = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

type TimeDetails = {
  time: string | null;
  day: dayType | null;
  room: string | null;
};

async function extractTimeDetails(input: string): Promise<TimeDetails> {
  const roomsArray = db.get<string[]>("rooms");

  const timeRegex = /\b\d{2}:\d{2}\b/;
  const dayRegex = /\bSun\b|\bMon\b|\bTue\b|\bWed\b|\bThu\b|\bFri\b|\bSat\b/;

  const timeMatch = input.match(timeRegex);
  const dayMatch = input.match(dayRegex);

  let room: string | null = null;
  let time: string | null = null;
  let day: string | null = null;

  room = roomsArray.find((room) => input.includes(room)) || null;

  if (dayMatch) {
    day = dayMatch[0];
  }

  if (timeMatch) {
    const parsedTime = timeMatch[0];
    const isAM = input.toLowerCase().includes("am");
    const isPM = input.toLowerCase().includes("pm");

    if (isAM || isPM) {
      const [hours, minutes] = parsedTime.split(":").map(Number);
      let hour = hours;

      if (isPM && hour < 12) {
        hour += 12;
      } else if (isAM && hour === 12) {
        hour = 0;
      }

      time = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00.000`;
    } else {
      const [hours, minutes] = parsedTime.split(":").map(Number);
      let hour = hours;

      if (hour < 7) {
        hour += 12;
      }

      time = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00.000`;
    }
  }

  return { time, day: day as dayType | null, room };
}
const prepareBookingMessage = async (str: string): Promise<TimeDetails> => {
  const prepared = await preparationHumanType(str);
  return await extractTimeDetails(prepared);
};

export default prepareBookingMessage;
