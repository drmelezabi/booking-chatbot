import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { caseTypeAR } from "../../../config/diff";
import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";
import formatTimestamp from "../../date/formateFirebaseTimestamp";
import { getTodayRange } from "../../date/getTodayRange";

export const getStudentTodayBooked = async (studentId: string) => {
  try {
    const range = getTodayRange();
    if (!range) return [];

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
    return finalData
      .filter((filter) => filter.stdId === studentId)
      .map((booked) => {
        return {
          Date: formatTimestamp(booked.start).Date,
          Time: formatTimestamp(booked.start).Time,
          Student: booked.student,
          Room: booked.room,
          Case: caseTypeAR[booked.case],
        };
      });
  } catch (error) {
    throw ErrorHandler(error, "getStudentTodayBooked");
  }
};
