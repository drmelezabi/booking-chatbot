export interface ISuspendedStudent {
  accountId: string;
  ViolationCounter: number;
  suspensionCase: Boolean;
  BookingAvailabilityDate: Date;
  violations: string[];
}
