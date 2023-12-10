export default function detectDateFromString(dateString: string): Date | null {
  const currentYear = new Date().getFullYear();
  const months: { [key: string]: number } = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

  const arabicMonths: { [key: string]: string } = {
    يناير: "jan",
    فبراير: "feb",
    مارس: "mar",
    إبريل: "apr",
    آبريل: "apr",
    ابريل: "apr",
    أبريل: "apr",
    مايو: "may",
    يونيو: "jun",
    يوليو: "aug",
    أغسطس: "aug",
    اغسطس: "aug",
    إغسطس: "aug",
    آغسطس: "aug",
    سبتمبر: "sep",
    أكتوبر: "oct",
    اكتوبر: "oct",
    إكتوبر: "oct",
    آكتوبر: "oct",
    نوفمبر: "nov",
    ديسمبر: "dec",
  };
  const regex = new RegExp(Object.keys(arabicMonths).join("|"), "g");

  const parts = dateString
    .replace(regex, (matched) => arabicMonths[matched])
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);

  let day: number | undefined;
  let month: number | undefined;
  let year: number | undefined;

  for (const part of parts) {
    if (!isNaN(Number(part))) {
      const num = Number(part);
      if (num >= 1 && num <= 31) {
        if (!day) {
          day = num;
        } else if (!month) {
          month = num - 1;
        } else {
          year = num;
        }
      } else if (num >= 1000 && num <= 9999) {
        year = num;
      } else if (num >= 0 && num <= 99) {
        if (num + 2000 <= currentYear) {
          year = num + 2000;
        } else {
          year = num + 1900;
        }
      }
    } else if (Object.prototype.hasOwnProperty.call(months, part)) {
      month = months[part];
    }
  }

  if (day === undefined || month === undefined) {
    return null;
  }

  if (year === undefined) {
    year = currentYear;
  }

  const date = new Date(year, month, day, 7, 0, 0, 0);
  return date;
}
