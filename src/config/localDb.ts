import { JsonDB, Config } from "node-json-db";

const localDb = new JsonDB(new Config("src/config/localDb", true, false, "/"));

export default localDb;
