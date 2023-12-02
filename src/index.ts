import { geRestOfToday } from "./controllers/date/getRestOfToday";
import { geRestOfWeek } from "./controllers/date/getRestOfWeek";
import { getTodayRange } from "./controllers/date/getTodayRange";
import { getWeekRange } from "./controllers/date/getWeekRange";
import { cancelAllPreviousBooked } from "./controllers/rooms/cancelAllPreviousBooked";
import { getRoomsBookedByDay } from "./controllers/rooms/getRoomsBookedByDay";
import { getRoomsBookedNowToEndOfWeek } from "./controllers/rooms/getRoomsBookedNowToEndOfWeek";
import { getRoomsBookedRestOfToday } from "./controllers/rooms/getRoomsBookedRestOfToday";
import { getStudentTodayBooked } from "./controllers/rooms/getStudentTodayBooked";
import { getStudentWeekBooked } from "./controllers/rooms/getStudentWeekBooked";

(async () => {
  // const initializeFirebaseApp = () => {
  //   try {
  //     firebaseApp;
  //     firestoreDb;
  //     return firebaseApp;
  //   } catch (error) {
  //     console.log("initializeFirebaseApp", error);
  //   }
  // };
  // initializeFirebaseApp();
  // console.log(await add("rooms", data));
  // console.log(await getRoomsAvailable());
  // console.log(await getStudentTodayBooked("1020205252"));
  console.log(await cancelAllPreviousBooked());
})();
