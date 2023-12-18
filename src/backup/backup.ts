import fs from "fs";
import path from "path";

import { MessageMedia } from "whatsapp-web.js";

import Sendmail from "../config/email";
import { levels } from "../config/enums";
import client from "../config/whatsapp";
import addDocument from "../controllers/addCloudDoc";
import backupMessageTemplate from "../Email/backupTemplate";


const backup = async (
  type: "FireBase" | "whatsapp" | "Email",
  chatId?: string
) => {
  try {
    const database = JSON.parse(
      fs.readFileSync("./src/database/store/database.json", "utf8")
    );

    const activationPin = JSON.parse(
      fs.readFileSync(
        "./src/database/store/collections/activationPin.json",
        "utf8"
      )
    );

    const avail = JSON.parse(
      fs.readFileSync("./src/database/store/collections/avail.json", "utf8")
    );

    const blockedDates = JSON.parse(
      fs.readFileSync(
        "./src/database/store/collections/blockedDates.json",
        "utf8"
      )
    );

    const chat = JSON.parse(
      fs.readFileSync("./src/database/store/collections/chat.json", "utf8")
    );

    const reservation = JSON.parse(
      fs.readFileSync(
        "./src/database/store/collections/reservation.json",
        "utf8"
      )
    );

    const suspendedStudent = JSON.parse(
      fs.readFileSync(
        "./src/database/store/collections/suspendedStudent.json",
        "utf8"
      )
    );

    const registeredPhone = JSON.parse(
      fs.readFileSync(
        "./src/database/store/collections/registeredPhone.json",
        "utf8"
      )
    );

    const JSONs = {
      database,
      activationPin,
      avail,
      blockedDates,
      chat,
      reservation,
      suspendedStudent,
      registeredPhone,
    };

    const backupObject = {
      ...JSONs,
      backup: new Date(),
    };

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const dateArray = now
      .toLocaleDateString("en-EG", options)
      .replace(/\//g, "-")
      .split("-");

    const dateString = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
    if (type === "FireBase") {
      await addDocument("backup", dateString, backupObject);
      return;
    } else if (type === "Email") {
      const messageTemplate = backupMessageTemplate(
        levels.info,
        `${dateString} backup`
      );

      const files: { filename: string; path: string }[] = [];

      for await (const [key, value] of Object.entries({
        ...JSONs,
        Restore: JSONs,
      })) {
        const dirPath: string = path.join(process.cwd(), "src", "backup");
        const attachmentPath = path.join(dirPath, `${key}.json`);

        files.push({ filename: `${key}.json`, path: attachmentPath });

        const jsonString = JSON.stringify(value);

        fs.writeFile(attachmentPath, jsonString, (err) => {
          if (err) {
            console.log("Error writing file:", err);
            return false;
          }
        });
      }
      Sendmail(
        undefined,
        `backup-${dateString}`,
        messageTemplate,
        true,
        undefined,
        undefined,
        files
      );
      return;
    } else if (type === "whatsapp" && chatId) {
      await client.sendMessage(chatId, "↻ جاري اعداد النسخة الاحطياطية");

      for await (const [key, value] of Object.entries({
        ...JSONs,
        Restore: JSONs,
      })) {
        const jsonString = JSON.stringify(value);

        // Encode the file contents as Base64
        const base64Data = Buffer.from(jsonString).toString("base64");

        const media = new MessageMedia(
          "application/json",
          base64Data,
          `${key}`
        );
        await client.sendMessage(chatId, media);
      }
      return;
    }

    return true;
  } catch (error) {
    console.log("backup", error);
    return false;
  }
};

export default backup;
