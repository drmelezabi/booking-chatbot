import db from "./setup";

type suspendedStudent = {
  accountId: string; // studentId
  ViolationCounter: number;
  suspensionCase: Boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
};

const SuspendedStudent =
  db.createCollection<suspendedStudent>("suspendedStudent");

export default SuspendedStudent;
