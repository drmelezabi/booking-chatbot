import { customAlphabet, nanoid } from "nanoid";
export const genId = () => nanoid(20);

export default genId;
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const num = "0123456789";
const code = customAlphabet(num, 8);
const pin = customAlphabet(num, 6);

export const recoveryCodeGen = () => code();
export const activatingPin = () => pin();

const code20 = customAlphabet(alphabet, 20);
export const genId20 = () => code20();
