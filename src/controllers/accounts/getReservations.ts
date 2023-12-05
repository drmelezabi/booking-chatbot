import WAWebJS from "whatsapp-web.js";
import { getRoomsBookedByDay } from "../rooms/getRoomsBookedByDay";
import { getRoomsBookedRestOfToday } from "../rooms/getRoomsBookedRestOfToday";
import { getRoomsBookedNowToEndOfWeek } from "../rooms/getRoomsBookedNowToEndOfWeek";
const week = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "السبت"];
const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Sat"];

const reservationsTracking = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  query: string
) => {
  if (["المتبقى من اليوم", "المتبقي من اليوم"].includes(query)) {
    const restOfToday = await getRoomsBookedRestOfToday();
    if (restOfToday.length) {
      const title = `*مواعيد المذاكرة المحجوزة للفترة المتبقية من اليوم*\n`;
      const messages = restOfToday.map((reser) => {
        return `*القــــــاعة* :  ${reser.Room}\n*التوقيــت* :  ${reser.Time}\n*الطـالــب* :  ${reser.Student}\n*الحـــــــالة* :  ${reser.Case}`;
      });
      const join = `\n`;
      const finalMessage = `${title}${join}${messages.join(
        "\n--------------------\n"
      )}${`\n`}`;
      client.sendMessage(message.from, finalMessage);
    } else {
      client.sendMessage(
        message.from,
        `🟢 *لا يوجد أي حجز خلال المتبقي من اليوم*`
      );
    }
  } else if (
    [
      "المتبقي من الأسبوع",
      "المتبقي من الاسبوع",
      "المتبقى من الأسبوع",
      "المتبقى من الاسبوع",
    ].includes(query)
  ) {
    const restOfToday = await getRoomsBookedNowToEndOfWeek();
    if (restOfToday.length) {
      const title = `*مواعيد المذاكرة المحجوزة للفترة المتبقية من الأسبوع*\n`;
      const messages = restOfToday.map((reser) => {
        return `*اليـــــــوم* :  ${reser.Day}\n*التـــــاريخ* :  ${reser.Date}\n*القــــــاعة* :  ${reser.Room}\n*التوقيــت* :  ${reser.Time}\n*الطـالــب* :  ${reser.Student}\n*الحـــــــالة* :  ${reser.Case}`;
      });
      const join = `\n`;
      const finalMessage = `${title}${join}${messages.join(
        "\n--------------------\n"
      )}${`\n`}`;
      client.sendMessage(message.from, finalMessage);
    } else {
      client.sendMessage(
        message.from,
        `🟢 *لا يوجد أي حجز خلال المتبقي من الأسبوع حتى الآن*`
      );
    }
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
