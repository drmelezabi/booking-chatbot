import starkString from "starkstring";

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

export const dtOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour12: true,
};

export const arabicName: { [key: string]: string } = {
  Sat: "السبت",
  Sun: "الأحد",
  Mon: "الإثنين",
  Tue: "الثلاثاء",
  Wed: "الأربعاء",
  Thu: "الخميس",
  Fri: "الجمعة",
};

export const arabicHours = (h: number) => {
  const hour = starkString(`${h}`).arabicNumber().toString(); //returns: 345 45
  if (h === 1) return "ساعة واحدة";
  else if (h === 2) return "ساعتان";
  else if ([3, 4, 5, 6, 7, 8, 9, 10].includes(h))
    return `${enToAr(hour)} ساعات`;
  else return `${enToAr(hour)} ساعة`;
};

export const arabicMinuets = (m: number) => {
  const minuet = starkString(`${m}`).arabicNumber().toString(); //returns: 345 45
  if (m === 1) return "دقيقة واحدة";
  else if (m === 2) return "دقيقتان";
  else if ([3, 4, 5, 6, 7, 8, 9, 10].includes(m))
    return `${enToAr(minuet)} دقائق`;
  else return `${enToAr(minuet)} دقيقة`;
};

export const arabicDays = (d: number) => {
  const minuet = starkString(`${d}`).arabicNumber().toString(); //returns: 345 45
  if (d === 1) return "يوم واحد";
  else if (d === 2) return "يومان";
  else if ([3, 4, 5, 6, 7, 8, 9, 10].includes(d))
    return `${enToAr(minuet)} ايام`;
  else return `${enToAr(minuet)} يوم`;
};

export const enToAr = (inp: string) => {
  let str = starkString(` ${inp} `).toString();
  const letterBeforeNumberArabic = /(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})/gu;
  return str
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (match) =>
      starkString(match).arabicNumber().toString()
    )
    .replace(letterBeforeNumberArabic, " ")
    .trim();
};

export const dict = {
  الاثنين: "Mon",
  الاتنين: "Mon",
  الثلاثاء: "Tue",
  الثلاث: "Tue",
  التلات: "Tue",
  ثلاث: "Tue",
  تلاتث: "Tue",
  الأربعاء: "Wed",
  الاربعاء: "Wed",
  الأربع: "Wed",
  الاربع: "Wed",
  أربع: "Wed",
  اربع: "Wed",
  الخميس: "Thu",
  خميس: "Thu",
  جمعه: "Fri",
  جمعة: "Fri",
  الجمعة: "Fri",
  الجمعه: "Fri",
  السبت: "Sat",
  سبت: "Sat",
  الأحد: "Sun",
  الاحد: "Sun",
  أحد: "Sun",
  احد: "Sun",
  ظهر: "pm",
  الظهر: "pm",
  الضهر: "pm",
  الصبح: "am",
  "بعد الظهر": "pm",
  "بعد الضهر": "pm",
  "بعد ظهر اليوم": "pm",
  مساء: "pm",
  مسا: "pm",
  صباح: "am",
  مساءً: "pm",
  صباحاً: "am",
  الصباح: "am",
  المساء: "pm",
  " م ": " pm ",
  " ص ": " am ",
  " 1 ونص ": "01:30",
  " 1 ونصف ": "01:30",
  " 2 ونص ": "02:30",
  " 2 ونصف ": "02:30",
  " 3 ونص ": "03:30",
  " 3 ونصف ": "03:30",
  " 4 ونص ": "04:30",
  " 4 ونصف ": "04:30",
  " 5 ونص ": "05:30",
  " 5 ونصف ": "05:30",
  " 6 ونص ": "06:30",
  " 6 ونصف ": "06:30",
  " 7 ونص ": "07:30",
  " 7 ونصف ": "07:30",
  " 8 ونص ": "08:30",
  " 8 ونصف ": "08:30",
  " 9 ونص ": "09:30",
  " 9 ونصف ": "09:30",
  " 10 ونص ": "10:30",
  " 10 ونصف ": "10:30",
  " 11 ونص ": "11:30",
  " 11 ونصف ": "11:30",
  " 12 ونص ": "12:30",
  " 12 ونصف ": "12:30",
  " 1 و نص ": "01:30",
  " 1 و نصف ": "01:30",
  " 2 و نص ": "02:30",
  " 2 و نصف ": "02:30",
  " 3 و نص ": "03:30",
  " 3 و نصف ": "03:30",
  " 4 و نص ": "04:30",
  " 4 و نصف ": "04:30",
  " 5 و نص ": "05:30",
  " 5 و نصف ": "05:30",
  " 6 و نص ": "06:30",
  " 6 و نصف ": "06:30",
  " 7 و نص ": "07:30",
  " 7 و نصف ": "07:30",
  " 8 و نص ": "08:30",
  " 8 و نصف ": "08:30",
  " 9 و نص ": "09:30",
  " 9 و نصف ": "09:30",
  " 10 و نص ": "10:30",
  " 10 و نصف ": "10:30",
  " 11 و نص ": "11:30",
  " 11 و نصف ": "11:30",
  " 12 و نص ": "12:30",
  " 12 و نصف ": "12:30",
  " 1 30 ": "01:30",
  " 2 30 ": "02:30",
  " 3 30 ": "03:30",
  " 4 30 ": "04:30",
  " 5 30 ": "05:30",
  " 6 30 ": "06:30",
  " 7 30 ": "07:30",
  " 8 30 ": "08:30",
  " 9 30 ": "09:30",
  " 10 30 ": "10:30",
  " 11 30 ": "11:30",
  " 12 30 ": "12:30",
  " 1 00 ": "01:00",
  " 2 00 ": "02:00",
  " 3 00 ": "03:00",
  " 4 00 ": "04:00",
  " 5 00 ": "05:00",
  " 6 00 ": "06:00",
  " 7 00 ": "07:00",
  " 8 00 ": "08:00",
  " 9 00 ": "09:00",
  " 10 00 ": "10:00",
  " 11 00 ": "11:00",
  " 12 00 ": "12:00",
  الساعة: "",
  الساعه: "",
  التوقيت: "",
  توقيت: "",
  موعد: "",
  الموعد: "",
  ساعة: "",
  ساعه: "",
  في: "",
  فى: "",
  غرفه: "",
  غرفة: "",
  بغرفة: "",
  بغرفه: "",
  قاعه: "",
  قاعة: "",
  بقاعة: "",
  بقاعه: "",
  أوضة: "",
  اوضه: "",
  اوضة: "",
  أوضه: "",
  بأوضة: "",
  باوضه: "",
  باوضة: "",
  بأوضه: "",
  ميعاد: "",
  " واحدة ونص ": " 01:30 ",
  " وحدة ونص ": " 01:30 ",
  " وحده ونص ": " 01:30 ",
  " الواحدة ونص ": " 01:30 ",
  " واحده ونص ": " 01:30 ",
  " الواحده ونص ": " 01:30 ",
  " اثنين ونص ": " 02:30 ",
  " اتنين ونص ": " 02:30 ",
  " الاثنين ونص ": " 02:30 ",
  " إثنين ونص ": " 02:30 ",
  " الإثنين ونص ": " 02:30 ",
  " ثلاثة ونص ": " 03:30 ",
  " تلاتة ونص ": " 03:30 ",
  " الثلاثة ونص ": " 03:30 ",
  " الثالثة ونص ": " 03:30 ",
  " ثلاثه ونص ": " 03:30 ",
  " تلاته ونص ": " 03:30 ",
  " التلاته ونص ": " 03:30 ",
  " الثلاثه ونص ": " 03:30 ",
  " الثالثه ونص ": " 03:30 ",
  " أربعة ونص ": " 04:30 ",
  " الأربعة ونص ": " 04:30 ",
  " الرابعة ونص ": " 04:30 ",
  " اربعة ونص ": " 04:30 ",
  " الاربعة ونص ": " 04:30 ",
  " الرابعه ونص ": " 04:30 ",
  " اربعه ونص ": " 04:30 ",
  " الاربعه ونص ": " 04:30 ",
  " أربعه ونص ": " 04:30 ",
  " الأربعه ونص ": " 04:30 ",
  " خمسة ونص ": " 05:30 ",
  " الخمسة ونص ": " 05:30 ",
  " خمسه ونص ": " 05:30 ",
  " الخمسه ونص ": " 05:30 ",
  " السادسة ونص ": " 06:30 ",
  " السادسه ونص ": " 06:30 ",
  " ستة ونص ": " 06:30 ",
  " سته ونص ": " 06:30 ",
  " السابعة ونص ": " 07:30 ",
  " السابعه ونص ": " 07:30 ",
  " سبعة ونص ": " 07:30 ",
  " سبعه ونص ": " 07:30 ",
  " سابعه ونص ": " 07:30 ",
  " سابعة ونص ": " 07:30 ",
  " تمانية ونص ": " 08:30 ",
  " الثامنة ونص ": " 08:30 ",
  " الثامنه ونص ": " 08:30 ",
  " ثامنة ونص ": " 08:30 ",
  " ثانية ونص ": " 08:30 ",
  " ثانيه ونص ": " 08:30 ",
  " تمانيه ونص ": " 08:30 ",
  " التاسعة ونص ": " 09:30 ",
  " التاسعه ونص ": " 09:30 ",
  " تسعة ونص ": " 09:30 ",
  " تسعه ونص ": " 09:30 ",
  " العاشرة ونص ": " 10:30 ",
  " العاشره ونص ": " 10:30 ",
  " عشرة ونص ": " 10:30 ",
  " عشره ونص ": " 10:30 ",
  " حداشر ونص ": " 11:30 ",
  " الحادية عشر ونص ": " 11:30 ",
  " الحاديه عشر ونص ": " 11:30 ",
  " اتناشر ونص ": " 12:30 ",
  " الثانية ونص ": " 12:30 ",
  " التانية ونص ": " 12:30 ",
  " واحدة ونصف ": " 01:30 ",
  " وحدة ونصف ": " 01:30 ",
  " وحده ونصف ": " 01:30 ",
  " الواحدة ونصف ": " 01:30 ",
  " واحده ونصف ": " 01:30 ",
  " الواحده ونصف ": " 01:30 ",
  " اثنين ونصف ": " 02:30 ",
  " اتنين ونصف ": " 02:30 ",
  " الاثنين ونصف ": " 02:30 ",
  " إثنين ونصف ": " 02:30 ",
  " الإثنين ونصف ": " 02:30 ",
  " ثلاثة ونصف ": " 03:30 ",
  " تلاتة ونصف ": " 03:30 ",
  " تلاته ونصف ": " 03:30 ",
  " التلاتة ونصف ": " 03:30 ",
  " التلاته ونصف ": " 03:30 ",
  " الثلاثة ونصف ": " 03:30 ",
  " الثالثة ونصف ": " 03:30 ",
  " ثلاثه ونصف ": " 03:30 ",
  " الثلاثه ونصف ": " 03:30 ",
  " الثالثه ونصف ": " 03:30 ",
  " أربعة ونصف ": " 04:30 ",
  " الأربعة ونصف ": " 04:30 ",
  " الرابعة ونصف ": " 04:30 ",
  " اربعة ونصف ": " 04:30 ",
  " الاربعة ونصف ": " 04:30 ",
  " الرابعه ونصف ": " 04:30 ",
  " اربعه ونصف ": " 04:30 ",
  " الاربعه ونصف ": " 04:30 ",
  " أربعه ونصف ": " 04:30 ",
  " الأربعه ونصف ": " 04:30 ",
  " خمسة ونصف ": " 05:30 ",
  " الخمسة ونصف ": " 05:30 ",
  " خمسه ونصف ": " 05:30 ",
  " الخمسه ونصف ": " 05:30 ",
  " السادسة ونصف ": " 06:30 ",
  " السادسه ونصف ": " 06:30 ",
  " ستة ونصف ": " 06:30 ",
  " سته ونصف ": " 06:30 ",
  " السابعة ونصف ": " 07:30 ",
  " السابعه ونصف ": " 07:30 ",
  " سبعة ونصف ": " 07:30 ",
  " سبعه ونصف ": " 07:30 ",
  " سابعه ونصف ": " 07:30 ",
  " سابعة ونصف ": " 07:30 ",
  " تمانية ونصف ": " 08:30 ",
  " الثامنة ونصف ": " 08:30 ",
  " الثامنه ونصف ": " 08:30 ",
  " ثامنة ونصف ": " 08:30 ",
  " ثانية ونصف ": " 08:30 ",
  " ثانيه ونصف ": " 08:30 ",
  " تمانيه ونصف ": " 08:30 ",
  " التاسعة ونصف ": " 09:30 ",
  " التاسعه ونصف ": " 09:30 ",
  " تسعة ونصف ": " 09:30 ",
  " تسعه ونصف ": " 09:30 ",
  " العاشرة ونصف ": " 10:30 ",
  " العاشره ونصف ": " 10:30 ",
  " عشرة ونصف ": " 10:30 ",
  " عشره ونصف ": " 10:30 ",
  " حداشر ونصف ": " 11:30 ",
  " الحادية عشر ونصف ": " 11:30 ",
  " الحاديه عشر ونصف ": " 11:30 ",
  " اتناشر ونصف ": " 12:30 ",
  " الثانية ونصف ": " 12:30 ",
  " التانية ونصف ": " 12:30 ",
  " واحدة والنصف ": " 01:30 ",
  " وحدة والنصف ": " 01:30 ",
  " وحده والنصف ": " 01:30 ",
  " الواحدة والنصف ": " 01:30 ",
  " واحده والنصف ": " 01:30 ",
  " الواحده والنصف ": " 01:30 ",
  " اثنين والنصف ": " 02:30 ",
  " اتنين والنصف ": " 02:30 ",
  " الاثنين والنصف ": " 02:30 ",
  " إثنين والنصف ": " 02:30 ",
  " الإثنين والنصف ": " 02:30 ",
  " ثلاثة والنصف ": " 03:30 ",
  " تلاتة والنصف ": " 03:30 ",
  " الثلاثة والنصف ": " 03:30 ",
  " الثالثة والنصف ": " 03:30 ",
  " ثلاثه والنصف ": " 03:30 ",
  " الثلاثه والنصف ": " 03:30 ",
  " الثالثه والنصف ": " 03:30 ",
  " أربعة والنصف ": " 04:30 ",
  " الأربعة والنصف ": " 04:30 ",
  " الرابعة والنصف ": " 04:30 ",
  " اربعة والنصف ": " 04:30 ",
  " الاربعة والنصف ": " 04:30 ",
  " الرابعه والنصف ": " 04:30 ",
  " اربعه والنصف ": " 04:30 ",
  " الاربعه والنصف ": " 04:30 ",
  " أربعه والنصف ": " 04:30 ",
  " الأربعه والنصف ": " 04:30 ",
  " خمسة والنصف ": " 05:30 ",
  " الخمسة والنصف ": " 05:30 ",
  " خمسه والنصف ": " 05:30 ",
  " الخمسه والنصف ": " 05:30 ",
  " السادسة والنصف ": " 06:30 ",
  " السادسه والنصف ": " 06:30 ",
  " ستة والنصف ": " 06:30 ",
  " سته والنصف ": " 06:30 ",
  " السابعة والنصف ": " 07:30 ",
  " السابعه والنصف ": " 07:30 ",
  " سبعة والنصف ": " 07:30 ",
  " سبعه والنصف ": " 07:30 ",
  " سابعه والنصف ": " 07:30 ",
  " سابعة والنصف ": " 07:30 ",
  " تمانية والنصف ": " 08:30 ",
  " الثامنة والنصف ": " 08:30 ",
  " الثامنه والنصف ": " 08:30 ",
  " ثامنة والنصف ": " 08:30 ",
  " ثانية والنصف ": " 08:30 ",
  " ثانيه والنصف ": " 08:30 ",
  " تمانيه والنصف ": " 08:30 ",
  " التاسعة والنصف ": " 09:30 ",
  " التاسعه والنصف ": " 09:30 ",
  " تسعة والنصف ": " 09:30 ",
  " تسعه والنصف ": " 09:30 ",
  " العاشرة والنصف ": " 10:30 ",
  " العاشره والنصف ": " 10:30 ",
  " عشرة والنصف ": " 10:30 ",
  " عشره والنصف ": " 10:30 ",
  " حداشر والنصف ": " 11:30 ",
  " الحادية عشر والنصف ": " 11:30 ",
  " الحاديه عشر والنصف ": " 11:30 ",
  " اتناشر والنصف ": " 12:30 ",
  " الثانية والنصف ": " 12:30 ",
  " التانية والنصف ": " 12:30 ",
  " 1 ": " 01:00 ",
  " 1:30 ": " 01:30 ",
  " 2 ": " 02:00 ",
  " 2:30 ": " 02:30 ",
  " 3 ": " 03:00 ",
  " 3:30 ": " 03:30 ",
  " 4 ": " 04:00 ",
  " 4:30 ": " 04:30 ",
  " 5 ": " 05:00 ",
  " 5:30 ": " 05:30 ",
  " 6 ": " 06:00 ",
  " 6:30 ": " 06:30 ",
  " 7 ": " 07:00 ",
  " 7:30 ": " 07:30 ",
  " 8 ": " 08:00 ",
  " 8:30 ": " 08:30 ",
  " 9 ": " 09:00 ",
  " 9:30 ": " 09:30 ",
  " 10 ": " 10:00 ",
  " 10:30 ": " 10:30 ",
  " 11 ": " 11:00 ",
  " 11:30 ": " 11:30 ",
  " 12 ": " 12:00 ",
  " 12:30 ": " 12:30 ",
  واحدة: "01:00",
  وحده: "01:00",
  وحدة: "01:00",
  واحده: "01:00",
  إثنين: "02:00",
  اثنين: "02:00",
  ثلاثة: "03:00",
  تلاتة: "03:00",
  ثلاثه: "03:00",
  تلاته: "03:00",
  اربعه: "04:00",
  اربعة: "04:00",
  أربعه: "04:00",
  خمسة: "05:00",
  خمسه: "05:00",
  سته: "06:00",
  ستة: "06:00",
  سبعة: "07:00",
  سبعه: "07:00",
  ثمانية: "08:00",
  ثمانيه: "08:00",
  تمانيه: "08:00",
  تمانية: "08:00",
  تسعة: "09:00",
  تسعه: "09:00",
  عشره: "10:00",
  عشرة: "10:00",
  حداشر: "11:00",
  "أحد عشر": "11:00",
  "احد عشر": "11:00",
  "الحادية عشر": "11:00",
  "الحاديه عشر": "11:00",
  الحداشر: "11:00",
  اتناشر: "12:00",
  إتناشر: "12:00",
  "الثانية عشر": "12:00",
  "الثانيه عشر": "12:00",
  "107": " 107 ",
  "105": " 105 ",
  "معمل أ": " معمل أ ",
  "معمل ب": " معمل ب ",
  "109": " 109 ",
  "106 أ": " 106 أ ",
  "106 ب": " 106 ب ",
};
