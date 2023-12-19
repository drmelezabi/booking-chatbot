import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import ActivationPin from "../../database/activationPin";
import RegisteredPhone from "../../database/RegisteredPhone";

const supervisorVerify = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  try {
    const account = RegisteredPhone.fetch((acc) => acc.chatId === message.from);

    if (!account) throw new Error("account should not be nullable");

    const isExist = ActivationPin.getAll();
    const { gender } = account;
    const isMale = gender === "male";

    console.log(gender);

    if (!isExist.length) {
      client.sendMessage(
        message.from,
        `🕒 **حاليا لا يوجد حجز ينتظر التنشيط** 🕒\n         ${
          isMale ? "استمتع" : "استمتعي"
        } بوقتك 😅`
      );

      const sticker = MessageMedia.fromFilePath(
        `./src/imgs/${isMale ? "relaxM" : "relaxF"}.png`
      );
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
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
  } catch (error) {
    throw ErrorHandler(error, "supervisorVerify");
  }
};

export default supervisorVerify;
