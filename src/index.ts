import { firebaseApp } from "./config/firebase";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import router from "./resolvers";
import { updateCloudAccount } from "./controllers/accounts/updateCloudAccount";
import getStudentIdByPass from "./controllers/accounts/getStudentPass";

(async () => {
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
  console.log("Client is ready!");
});

// Save session values to the file upon successful auth
client.on("authenticated", () => {
  console.log("authenticated succeed");
});

client.on("message", async (message) => {
  await router(client, message);
});

client.initialize();
