import { firebaseApp } from "./config/firebase";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import router from "./resolvers";
import db from "./database/setup";
import appSchedule from "./controllers/schedual";
import RegisteredPhone from "./database/RegisteredPhone";
import groupCreations from "./controllers/GroupManager/groupCreations";
import bookingGroup from "./controllers/GroupManager/getGroup";
import configGroup from "./controllers/GroupManager/configuerGroup";
import onJoin from "./controllers/GroupManager/newGroupJoin";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
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

  const newGroupCreated = await groupCreations(client);
  if (newGroupCreated) {
    await configGroup(client);
    console.log("Group created & configured!");
  }
  console.log("Client is ready!");
});

// Save session values to the file upon successful auth
client.on("authenticated", () => {
  console.log("authenticated succeed");
});

client.on("message", async (message) => {
  if (message.hasMedia) {
    message.delete();
    client.sendMessage(message.from, "غير مسموج باستقبال وسائط");
    return;
  }

  await router(client, message);
});

client.on("group_join", async (notification) => {
  await onJoin(notification, client);
});

client.on("message_edit", async (message) => {
  await router(client, message);
});

client.on("call", (message) => {
  message.reject();
});

client.on("change_state", () => {
  client.resetState();
});

client.on(
  "message_edit",
  async (
    _message: WAWebJS.Message,
    oldId: String,
    _newId: String,
    _isContact: Boolean
  ) => {
    RegisteredPhone.remove((account) => account.chatId === oldId);
  }
);
client.initialize();
