import db from "./setup";

export type ISuspendedStudent = {
  accountId: string; // studentId
  ViolationCounter: number;
  suspensionCase: boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
};

const SuspendedStudent =
  db.createCollection<ISuspendedStudent>("suspendedStudent");

export default SuspendedStudent;
