import starkString from "starkstring";
import { rephrase } from "../../config/diff";

const preparationHumanType = (inp: string) => {
  let str = starkString(` ${inp} `).toString(); //returns: 345 45
  const today = new Date();
  const tomorrowD = new Date(today);
  tomorrowD.setDate(today.getDate() + 1);
  const twoDaysAfterTomorrow = new Date(today);
  twoDaysAfterTomorrow.setDate(today.getDate() + 2);
  const threeDaysAfterTomorrow = new Date(today);
  threeDaysAfterTomorrow.setDate(today.getDate() + 3);

  const todayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const tomorrowName = tomorrowD.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const twoAfterTomorrow = twoDaysAfterTomorrow.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const theeAfterTomorrow = threeDaysAfterTomorrow.toLocaleDateString("en-US", {
    weekday: "long",
  });

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

type TimeDetails = {
  time: string;
  day: string;
  room: string;
};

function extractTimeDetails(input: string): TimeDetails {
  try {
    const timeRegex = /\b((1[0-2]|0?[1-9]):([0-5][0-9]))\b/g;
    const roomArray = [
      "107",
      "106A",
      "106B",
      "105",
      "معمل أ",
      "معمل ب",
      "109",
      "106 أ",
      "106 ب",
    ]; // Add variations of room numbers

    const match = input.match(timeRegex);
    let time = match ? match[0] : "";

    if (time) {
      if (!time.includes("am") && !time.includes("pm")) {
        // If 'am' or 'pm' is not present, add 'PM' by default
        const [hour, minute] = time.split(":").map(Number);
        const adjustedHour = hour >= 7 && hour < 12 ? hour : (hour + 12) % 24;
        time = `${adjustedHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00.000 PM`;
      } else {
        time = time.replace(/\b(\d{1,2}:\d{2})\b/, "$1:00.000");
      }
    }

    const date = new Date();
    date.setHours(
      parseInt(time.slice(0, 2), 10),
      parseInt(time.slice(3, 5), 10),
      0,
      0
    );

    // Convert time to 24-hour format
    const timeIn24HourFormat = date.toISOString().slice(11, -1);

    const room = roomArray.find((room) => input.includes(room)) || "";

    const dayRegex =
      /\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/g;
    const dayMatch = input.match(dayRegex);
    const day = dayMatch ? dayMatch[0] : "";

    return { time: timeIn24HourFormat, day, room };
  } catch (error) {
    console.warn(error);
    return { time: "", day: "", room: "" };
  }
}
const prepareBookingMessage = (str: string) => {
  const prepared = preparationHumanType(str);
  return extractTimeDetails(prepared);
};

export default prepareBookingMessage;
