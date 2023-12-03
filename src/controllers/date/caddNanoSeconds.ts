function addNanosecondsToDate(date: Date, nanoseconds: number): Date {
  const milliseconds = nanoseconds / 1e6; // Convert nanoseconds to milliseconds
  const currentMilliseconds = date.getMilliseconds();
  const newMilliseconds = currentMilliseconds + milliseconds;
  date.setMilliseconds(newMilliseconds);
  return date;
}

export default addNanosecondsToDate;
