import SimplDB, { Database } from "simpl.db";

const config: SimplDB.DBConfig = {
  dataFile: "./src/database/database.json",
  autoSave: true,
  encryptionKey: "HELLO",
};

const db = new Database(config);

export default db;
