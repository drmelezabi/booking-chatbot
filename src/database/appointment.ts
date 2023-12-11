import db from "./setup";

type appointment = {
  case: number;
  room: string;
  start: Date;
  stdId: string;
  student: string;
  supervisor?: string;
};

const Appointment = db.createCollection<appointment>("appointment");

export default Appointment;
