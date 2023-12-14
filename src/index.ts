import { firebaseApp } from "./config/firebase";
import {
  Client,
  LocalAuth,
  GroupChat,
  InviteV4Data,
  MessageMedia,
} from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import router from "./resolvers";
import db from "./database/setup";
import appSchedule from "./controllers/schedual";
import RegisteredPhone from "./database/RegisteredPhone";
import groupCreations from "./controllers/GroupManager/groupCreations";
import bookingGroup from "./controllers/GroupManager/getGroup";
import configGroup from "./controllers/GroupManager/configuerGroup";
import util from "util";

(async () => {
  appSchedule();

  const initializeFirebaseApp = () => {
    try {
      firebaseApp;
      return firebaseApp;
    } catch (error) {
      console.log("initializeFirebaseApp", error);
    }
  };
  initializeFirebaseApp();
})();

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const NewGroup = await groupCreations(client);
  if (NewGroup) {
    await configGroup(client);
  }
  const group = await bookingGroup(client);

  // client.sendMessage("201020205256@c.us",)
  // const participants = groupChat.participants.map(
  //   (account) => account.id._serialized
  // );
  // const admins = participants.filter((participant) => participant.isAdmin);
  // const isMeAdmin = admins.some((admin) => admin.userId === MY_USER_ID);

  console.log("Client is ready!");
});

// Save session values to the file upon successful auth
client.on("authenticated", () => {
  console.log("authenticated succeed");
});

client.on("message", async (message) => {
  db.save();

  await router(client, message);
});

client.on("group_join", async (notification) => {
  console.log(
    util.inspect(notification, { showHidden: false, depth: null, colors: true })
  );

  const memberChatId = await notification.chatId;
  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === memberChatId
  );

  notification.id.p;

  if (!isExist) {
    const msgToContactWhoJoined =
      "❌ انت تستخدم هاتف خارج المنظومه لا يمكنك الانضمام إلى المجموعة";
    client.sendMessage(memberChatId, msgToContactWhoJoined);
    return;
  }

  const contact = await client.getContactById(memberChatId);
  const group = await bookingGroup(client);
  const account = RegisteredPhone.fetch(
    (account) => account.chatId === memberChatId
  )!;
  console.log({ memberChatId, contact });
  group.sendMessage(`مرحبا ${account.name}`, { mentions: [contact] });
});

client.initialize();
