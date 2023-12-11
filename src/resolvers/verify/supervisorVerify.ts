import WAWebJS from "whatsapp-web.js";

import ActivationPin from "../../database/activationPin";

const supervisorVerify = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = ActivationPin.getAll();

  if (!isExist.length) {
    client.sendMessage(
      message.from,
      "🕒 **حاليا لا يوجد حجز ينتظر التنشيط** 🕒\n\nاستمتع بوقتك 😅"
    );
    return;
  }

  const toDeletePin: string[] = [];

  const list: string[] = [];

  isExist.map((res) => {
    const oneMinute = 1 * 60 * 1000; // Convert 1 minute to milliseconds

    const resDate = new Date(res.creationDate);

    // Calculate the range
    const upperBound = new Date(resDate.getTime() + oneMinute);

    // Check if dateA is within the range
    if (!(new Date() <= upperBound)) toDeletePin.push(res.reservationId);

    if (new Date() <= upperBound)
      list.push(`*الطالب* : ${res.name}\n*رمز التنشيط* : ${res.pin}`);
  });

  if (!list.length) {
    toDeletePin.map((reservationId) => {
      ActivationPin.remove(
        (activationObj) => activationObj.reservationId === reservationId
      );
      ActivationPin.save();
    });

    client.sendMessage(
      message.from,
      "🕒 **حاليا لا يوجد حجز ينتظر التنشيط** 🕒\n\nاستمتع بوقتك 😅"
    );
    return;
  }

  const msg = `🔔 **طلبات التنشيط** 🔔\n\n${list.concat(
    "\n-------------\n"
  )}\n\nشارك الرمز الخاص مع كل طالب على حدى`;

  client.sendMessage(message.from, msg);
};

export default supervisorVerify;
