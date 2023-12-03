import { customAlphabet, nanoid } from "nanoid";
export const genId = () => nanoid(20);

export default genId;
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const code = customAlphabet(alphabet, 12);
export const recoveryCodeGen = () => code();

const code20 = customAlphabet(alphabet, 20);
export const genId20 = () => code20();
