import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

export const checkRoomAvailability = async (room: string, start: Date) => {
  try {
    const finalData: DocumentData[] = [];

    const editedDate = new Date(start);
    editedDate.setSeconds(start.getSeconds() + 3);

    const q = query(
      collection(firestoreDb, "reservation"),
      where("start", ">=", start),
      where("start", "<", editedDate)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.data());
    });

    const filtered = finalData.filter(
      (filter) => [0, 1].includes(filter.case) && room === filter.room
    );

    if (filtered.length) return false;
    return true;
  } catch (error) {
    console.log("get", error);
    return null;
  }
};
