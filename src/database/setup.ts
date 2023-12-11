import SimplDB, { Database } from "simpl.db";

const config: SimplDB.DBConfig = {
  dataFile: "./src/database/store/database.json",
  collectionsFolder: "./src/database/store/collections",
  autoSave: true,
  // encryptionKey: "6C2385BDB03849AE7FD0CBE748B2874D",
};

const db = new Database(config);

export default db;
