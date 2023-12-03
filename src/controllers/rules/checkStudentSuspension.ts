import localDb from "../../config/localDb";
import getStudentsSuspension from "./getStudentsSuspension";

const checkStudentSuspension = async (studentId: string) => {
  let suspensionCase = true;
  let message = "";

  const suspendedStudent = await getStudentsSuspension();

  const studentCases = suspendedStudent.filter(
    (studentCase) =>
      studentCase.studentId === studentId && studentCase.suspensionCase
  );

  if (!studentCases.length) suspensionCase = false;

  const studentCase = studentCases[0];

  if (new Date(studentCase.BookingAvailabilityDate) > new Date()) {
    suspensionCase = true;
    var dateString = studentCase.BookingAvailabilityDate.toLocaleDateString(
      "ar-EG-u-nu-latn",
      { weekday: "long", year: "numeric", month: "short", day: "numeric" }
    );
    message = `عذرا وفقاً لمخالفاتك السابقة فالحجز معلق حتى ${dateString}`;
  } else {
    const EditedArray = suspendedStudent.map((studentCase) => {
      if (studentCase.studentId === studentId) {
        return {
          ...studentCase,
          suspensionCase: false,
        };
      }
    });
    await localDb.push("/suspendedStudent", EditedArray);
    suspensionCase = false;
  }

  if (suspensionCase) {
    return message;
  }
  return false;
};

export default checkStudentSuspension;
