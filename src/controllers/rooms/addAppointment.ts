import { genId20 } from "../../config/IDs";
import { addDocument } from "../../config/firebase";
import addLocalReservations from "../rules/addLocalReservations";

interface IAppointment {
  case: number;
  room: string;
  start: Date;
  stdId: string;
  student: string;
  supervisor?: string;
}

const createNewAppointment = async (appointment: IAppointment) => {
  const appointmentId = genId20();
  try {
    await addDocument("appointment", appointmentId, appointment);
    await addLocalReservations({
      studentId: appointment.stdId,
      reservationId: appointmentId,
      Date: appointment.start,
    });
  } catch (error) {
    console.log("CreateNewAppointment", error);
  }
};

export default createNewAppointment;
