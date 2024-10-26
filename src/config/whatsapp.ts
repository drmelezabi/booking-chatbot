import path from 'path';

import qrcode from "qrcode-terminal";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";

import configGroup from "../controllers/GroupManager/configureGroup";
import groupCreations from "../controllers/GroupManager/groupCreations";
import onJoin from "../controllers/GroupManager/newGroupJoin";
import isSuperAdmin from "../controllers/rules/isSuperAdmin";
import RegisteredPhone from "../database/RegisteredPhone";
import router from "../router";

// Get the root path of the project
const rootPath = path.resolve(__dirname, '..', '..');

// Add "dirct" to the root path
const authPath = path.join(rootPath, ".wwebjs_auth");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: authPath }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
  const newGroupCreated = await groupCreations(client);
  if (newGroupCreated) {
    setTimeout(async () => {
      await configGroup(client);
    }, 5000);
    console.log("Group created & configured!");
  }
});

client.on("authenticated", () => {
  console.log("Authenticated successfully");
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
});

client.on("disconnected", (reason) => {
  console.log("Client disconnected:", reason);
});

client.on("message", async (message) => {
  try {
    if (!(await isSuperAdmin(message.from))) {
      if (message.hasMedia) {
        message.delete();
        client.sendMessage(message.from, "غير مسموج باستقبال وسائط");
        return;
      }
    }

    await router(client, message);
  } catch (error) {
    console.error("Error handling message:", error);
  }
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
  "contact_changed",
  async (
    _message: WAWebJS.Message,
    oldId: string
    // _newId: string,
    // _isContact: boolean
  ) => {
    RegisteredPhone.remove((account) => account.chatId === oldId);
  }
);

export default client;
