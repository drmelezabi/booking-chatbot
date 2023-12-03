import { Timestamp } from "firebase/firestore";
import { firebaseApp, firestoreDb } from "./config/firebase";
import getStudent from "./controllers/accounts/getStudent";
import { geRestOfWeek } from "./controllers/date/getRestOfWeek";
import { getTodayRange } from "./controllers/date/getTodayRange";
import { getWeekRange } from "./controllers/date/getWeekRange";
import { cancelAllPreviousBooked } from "./controllers/rooms/cancelAllPreviousBooked";
import { cancelTodaysBooked } from "./controllers/rooms/cancelTodaysBooked";
import { checkRoomAvailability } from "./controllers/rooms/checkRoomIsNotBusy";
import { getRoomsBookedByDay } from "./controllers/rooms/getRoomsBookedByDay";
import { getRoomsBookedNowToEndOfWeek } from "./controllers/rooms/getRoomsBookedNowToEndOfWeek";
import { getRoomsBookedRestOfToday } from "./controllers/rooms/getRoomsBookedRestOfToday";
import { getStudentTodayBooked } from "./controllers/rooms/getStudentTodayBooked";
import { getStudentWeekBooked } from "./controllers/rooms/getStudentWeekBooked";
import { updateAppointmentCaseById } from "./controllers/rooms/updateAppointmentCaseById";
import checkBookingAvailability from "./controllers/rules/checkBookingAvailability";
import startBookingAvailability from "./controllers/rules/startBookingAvailability";
import stopBookingAvailability from "./controllers/rules/stopBookingAvailability";
import checkStudentHasNoUncompletedBooked from "./controllers/accounts/checkStudentHasNoUncompletedBooked";
import addNewAppointment from "./controllers/rooms/addAppointment";
import genId from "./config/IDs";

(async () => {
  const initializeFirebaseApp = () => {
    try {
      firebaseApp;
      return firebaseApp;
    } catch (error) {
      console.log("initializeFirebaseApp", error);
    }
  };
  initializeFirebaseApp();
  // console.log(await add("rooms", data));
  // console.log(await getRoomsAvailable());
  // console.log(await getStudentTodayBooked("1020205252"));
  // console.log(await cancelTodaysBooked());
  // console.log(await getStudentTodayBooked("gouaZqpCRlk9KXkuhxHZ"));
  // console.log(await getStudent("gouaZqpCRlk9KXkuhxHZ"));
  // console
  //   .log
  // await checkRoomAvailability("107", new Date("December 3, 2023 11:00:00"))
  //   ();

  // console.log(await checkStudentHasNoUncompletedBooked("xxxccc"));
  // console.log(
  //   await addNewAppointment({
  //     stdId: genId(),
  //     case: 0,
  //     room: "106",
  //     start: new Date("December 12, 2023  13:00:00"),
  //     student: "mohamed kamal",
  //     supervisor: "",
  //   })
  // );
})();
