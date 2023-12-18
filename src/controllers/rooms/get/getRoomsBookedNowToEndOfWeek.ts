import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { caseTypeAR } from "../../../config/diff";
import { firestoreDb } from "../../../config/firebase";
import formatTimestamp from "../../date/formateFirebaseTimestamp";
import { geRestOfWeek } from "../../date/getRestOfWeek";

export const getRoomsBookedNowToEndOfWeek = async () => {
  const range = geRestOfWeek();
  if (!range) return [];

  try {
    const finalData: DocumentData[] = [];

    const q = query(
      collection(firestoreDb, "reservation"),
      where("start", ">=", range.start),
      where("start", "<", range.end)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.data());
    });
    return finalData.map((booked) => {
      const dt = formatTimestamp(booked.start);
      return {
        Day: dt.Day,
        Date: dt.Date,
        Time: dt.Time,
        Student: booked.student,
        Room: booked.room,
        Case: caseTypeAR[booked.case],
      };
    });
  } catch (error) {
    console.log("get", error);
    return [];
  }
};
