export default function manipulatePhone(input: string): string {
  if (input.startsWith("00")) {
    return input.slice(2);
  } else if (input.startsWith("01")) {
    return `2${input}`;
  }
  return input;
}
