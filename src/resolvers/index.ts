import WAWebJS from "whatsapp-web.js";
import { menu, verification, AdvancedMenu, getRec, trackingInfo } from "./menu";
import phoneVerification from "./PhoneVerification";
import getRecovery from "./advanced/getRecovery";
import isAdmin from "../controllers/accounts/isAdmin";
import getReservations from "./advanced/getReservations";

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  if (["مساعدة", "مساعده"].includes(message.body)) {
    await menu(client, message);
    //
  } else if (message.body === "توثيق") {
    await verification(client, message);
    //
  } else if (/^رمز\s*(\d+)$/.test(message.body)) {
    await phoneVerification(client, message);
    //
  } else if (
    [
      "ادارة المنظومه",
      "إدارة المنظومة",
      "ادارة المنظومة",
      "إدارة المنظومه",
    ].includes(message.body)
  ) {
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await AdvancedMenu(client, message);
    //
  } else if (["متابعة", "متابعه"].includes(message.body)) {
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await trackingInfo(client, message);
    //
  } else if (message.body === "طلب رمز استعاده") {
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await getRec(client, message);
    //
  } else if (/^رمز استعاده\s*(\d+)$/.test(message.body)) {
    await getRecovery(client, message);
    //
  } else if (/^!متابعه\s/.test(message.body)) {
    await getReservations(client, message);
  }
};
export default router;
