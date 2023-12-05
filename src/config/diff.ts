export enum daysName {
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
}

export const caseType = ["booked", "active", "late", "fail"];
export const caseTypeAR = ["محجوز", "نشط", "ملغى", "مهدر"];

export function convertArToEnDigits(text: string): string {
  const arabicToEnglishMap: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return text.replace(/[٠-٩]/g, (match) => arabicToEnglishMap[match]);
}
