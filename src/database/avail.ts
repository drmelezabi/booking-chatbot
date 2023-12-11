import db from "./setup";

export interface IAvail {
  hostId: string;
  pin: number;
  reservationId: string;
  host: boolean;
  availId?: string;
  reservationDate: Date;
  availCreatedDate: Date;
  availName?: string;
}

const Avail = db.createCollection<IAvail>("avail");

export default Avail;
