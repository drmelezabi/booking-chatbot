import WAWebJS from "whatsapp-web.js";
import db from "../../database/setup";
import RegisteredPhone from "../../database/RegisteredPhone";

export default async function groupCreations(client: WAWebJS.Client) {
  const checkGroupCreated = db.get<string>("groupId");
  if (checkGroupCreated) return false;
  else {
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
    return true;
  }
}
