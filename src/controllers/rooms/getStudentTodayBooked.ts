import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";
import formatTimestamp from "../date/formateFirebaseTimestamp";
import { getTodayRange } from "../date/getTodayRange";
import { caseType } from "../../config/diff";

export const getStudentTodayBooked = async (studentId: string) => {
  const range = getTodayRange();
  console.log(range);
  if (!range) return [];

  try {
    const finalData: DocumentData[] = [];

    const q = query(
      collection(firestoreDb, "appointment"),
      where("start", ">=", range.start),
      where("start", "<", range.end)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.data());
    });
    console.log(finalData);
    return finalData
      .filter((filter) => filter.stdId === studentId)
      .map((booked) => {
        return {
          Date: formatTimestamp(booked.start).Date,
          Time: formatTimestamp(booked.start).Time,
          Student: booked.student,
          Room: booked.room,
          Case: caseType[booked.case],
        };
      });
  } catch (error) {
    console.log("get", error);
    return [];
  }
};
