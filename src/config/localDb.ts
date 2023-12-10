import { JsonDB, Config } from "node-json-db";

const localDb = new JsonDB(new Config("src/config/localDb", true, false, "/"));
export const chatCash = new JsonDB(
  new Config("src/config/chatCash", true, false, "/")
);

export const expected = new JsonDB(
  new Config("src/config/expected", true, false, "/")
);

export const chat = new JsonDB(new Config("src/config/chat", true, false, "/"));
export const menu = new JsonDB(new Config("src/config/menu", true, false, "/"));

export default localDb;
