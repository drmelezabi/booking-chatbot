import db from "./setup";

export type ISuspendedStudent = {
  accountId: string; // studentId
  ViolationCounter: number;
  suspensionCase: Boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
};

const SuspendedStudent =
  db.createCollection<ISuspendedStudent>("suspendedStudent");

export default SuspendedStudent;
