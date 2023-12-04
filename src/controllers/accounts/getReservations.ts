import WAWebJS from "whatsapp-web.js";
import { getRoomsBookedByDay } from "../rooms/getRoomsBookedByDay";
const week = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "السبت"];
const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Sat"];

const reservationsTracking = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  query: string
) => {
  if (query === "اليوم") {
    client.sendMessage(message.from, query);
  } else if (query === "المتبقى من اليوم") {
    client.sendMessage(message.from, query);
  } else if (query === "المتبقى من الاسبوع") {
    client.sendMessage(message.from, query);
  } else if (week.includes(query)) {
    const dayNumber = week.findIndex((element) => element === query);
    const res = await getRoomsBookedByDay(names[dayNumber]);
    if (res.length) {
      const title = `*${query} ${res[0].Date}*\n`;
      const messages = res.map((reser) => {
        return `*القــــــاعة* :  ${reser.Room}\n*التوقيــت* :  ${reser.Time}\n*الطـالــب* :  ${reser.Student}\n*الحـــــــالة* :  ${reser.Case}`;
      });
      const join = `\n`;
      const finalMessage = `${title}${join}${messages.join(
        "\n--------------------\n"
      )}${`\n`}`;
      client.sendMessage(message.from, finalMessage);
    } else {
      client.sendMessage(message.from, `🟢 *لا يوجد أي حجز ليوم ${query}*`);
    }
  } else {
    client.sendMessage(message.from, "🔍 أمر متابعة غير صحيح");
  }
};

export default reservationsTracking;
