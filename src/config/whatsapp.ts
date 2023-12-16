import qrcode from "qrcode-terminal";
import router from "../router";
import RegisteredPhone from "../database/RegisteredPhone";
import groupCreations from "../controllers/GroupManager/groupCreations";
import configGroup from "../controllers/GroupManager/configureGroup";
import onJoin from "../controllers/GroupManager/newGroupJoin";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import StudentDataHandler from "../controllers/sheet/DatabaseSeed";
import isSuperAdmin from "../controllers/rules/isSuperAdmin";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const newGroupCreated = await groupCreations(client);
  if (newGroupCreated) {
    setTimeout(async () => {
      await configGroup(client);
    }, 5000);
    console.log("Group created & configured!");
  }

  // const handler = new StudentDataHandler();
  // await handler.loadInfo();
  // await handler.loadAllAccounts();
  // await handler.uploadAllAccounts();

  console.log("Client is ready!");
});

// Save session values to the file upon successful auth
client.on("authenticated", () => {
  console.log("authenticated succeed");
});

client.on("message", async (message) => {
  if (!(await isSuperAdmin(message.from))) {
    if (message.hasMedia) {
      message.delete();
      client.sendMessage(message.from, "غير مسموج باستقبال وسائط");
      return;
    }
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

client.on("auth_failure", () => {
  console.log("fail to authenticate");
});

client.on("disconnected", () => {
  console.log("connection isn't work");
});

client.on(
  "contact_changed",
  async (
    _message: WAWebJS.Message,
    oldId: String,
    _newId: String,
    _isContact: Boolean
  ) => {
    RegisteredPhone.remove((account) => account.chatId === oldId);
  }
);

export default client;
