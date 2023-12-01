import { customAlphabet, nanoid } from "nanoid";
export const genId = () => nanoid(16);

export default genId;
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@";
const code = customAlphabet(alphabet, 12);
export const recoveryCodeGen = () => code();
