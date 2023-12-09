export default function parseDate(input: string): Date | null {
  const months: { [key: string]: number } = {
    يناير: 0,
    فبراير: 1,
    مارس: 2,
    أبريل: 3,
    مايو: 4,
    يونيو: 5,
    يوليو: 6,
    أغسطس: 7,
    سبتمبر: 8,
    أكتوبر: 9,
    نوفمبر: 10,
    ديسمبر: 11,
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

  const formats: RegExp[] = [
    /\d{1,2}[-/ ]\d{1,2}[-/ ]\d{2,4}/, // Matches formats like 1/1/2024, 01-01-24, etc.
    /\d{1,2} (يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?) \d{2,4}/i,
    /\d{1,2}(?:[-/ ])?(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:[-/ ])?\d{2,4}/i,
  ];

  for (const format of formats) {
    const match = input.match(format);
    if (match) {
      const parts = match[0].split(/[-/ ]+/);
      let day: number, month: number, year: number;

      if (parts.length === 3) {
        day = parseInt(parts[0]);
        month = isNaN(parseInt(parts[1]))
          ? months[parts[1].toLowerCase()]
          : parseInt(parts[1]) - 1;
        year = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2]);
      } else {
        day = parseInt(parts[1]);
        month = isNaN(parseInt(parts[0]))
          ? months[parts[0].toLowerCase()]
          : parseInt(parts[0]) - 1;
        year = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2]);
      }

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }

  return null;
}
