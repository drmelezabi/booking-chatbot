import { add, firebaseApp, firestoreDb, getAll } from "./config/firebase";
import getDaySchedule from "./controllers/date/getDaySchedule";
import { getRoomsAvailable } from "./controllers/rooms/getRooms";

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
  console.log(getDaySchedule("Fri"));
})();
