import fs from "fs";
import addDocument from "../controllers/addCloudDoc";

const backup = async () => {
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

    const backupObject = {
      database,
      activationPin,
      avail,
      blockedDates,
      chat,
      reservation,
      suspendedStudent,
      registeredPhone,
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

    const dateString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

    await addDocument("backup", dateString, backupObject);

    return true;
  } catch (error) {
    console.log("backup", error);
    return false;
  }
};

export default backup;
