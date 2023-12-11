import localDb from "../../config/localDb";

export interface ISuspendedStudent {
  accountId: string;
  ViolationCounter: number;
  suspensionCase: Boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
}

const getStudentsSuspension = async (): Promise<ISuspendedStudent[]> => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData =
        localDb.getObject<ISuspendedStudent[]>("/suspendedStudent");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getStudentsSuspension;
