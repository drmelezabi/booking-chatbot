import db from "./setup";

export type IActivationPin = {
  reservationId: string;
  pin: number;
  creationDate: Date;
  name: string;
};

const ActivationPin = db.createCollection<IActivationPin>("activationPin");

export default ActivationPin;
