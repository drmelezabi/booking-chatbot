import WAWebJS from "whatsapp-web.js";
import { menu, verification } from "./menu";
import phoneVerification from "./PhoneVerification";

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  if (message.body === "مساعده") {
    await menu(client, message);
  }

  if (message.body === "توثيق") {
    await verification(client, message);
  }

  if (/^رمز\s*(\d+)$/.test(message.body)) {
    await phoneVerification(client, message);
  }
};

export default router;
