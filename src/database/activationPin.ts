import db from "./setup";

type activationPin = {
  reservationId: string;
  pin: number;
  creationDate: Date;
  name: string;
};

const ActivationPin = db.createCollection<activationPin>("activationPin");

export default ActivationPin;
