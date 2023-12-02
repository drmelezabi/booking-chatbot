import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";
import { caseType } from "../../config/rules";
import formatTimestamp from "../date/formateFirebaseTimestamp";
import { getTodayRange } from "../date/getTodayRange";

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