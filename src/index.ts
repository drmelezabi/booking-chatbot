import { add, firebaseApp, firestoreDb, getAll } from "./config/firebase";
import { getDayRange } from "./controllers/date/getDayRange";
import { getRoomsBookedByDay } from "./controllers/rooms/getRoomsBookedByDay";

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
  console.log(await getRoomsBookedByDay("Mon"));
})();
