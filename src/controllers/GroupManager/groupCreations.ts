import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import RegisteredPhone from "../../database/RegisteredPhone";
import db from "../../database/setup";

export default async function groupCreations(client: WAWebJS.Client) {
  try {
    const checkGroupCreated = db.get<string>("groupId");
    console.log(checkGroupCreated);
    if (checkGroupCreated) return false;

    const contacts: string[] = RegisteredPhone.fetchAll().map(
      (account) => account.chatId
    );

    const groupConfig: WAWebJS.CreateGroupOptions = {
      comment: "روبوت منظومة المذاكرة والمتابعة - من برمجة د.محمد العزبي",
    };

    const group = await client.createGroup(
      "Booking Channel",
      contacts,
      groupConfig
    );

    if (typeof group === "string") {
      db.set<string>("groupId", group) as string;
      db.save();
      return true;
    }

    db.set<string>("groupId", group.gid._serialized) as string;
    db.save();

    console.log(group.gid._serialized);
    return true;
  
  } catch (error) {
    throw ErrorHandler(error, "groupCreations");
  }
}
