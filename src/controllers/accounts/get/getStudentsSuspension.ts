export interface ISuspendedStudent {
  accountId: string;
  ViolationCounter: number;
  suspensionCase: boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
}
