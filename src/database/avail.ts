import db from "./setup";

type avail = {
  hostId: string;
  pin: number;
  reservationId: string;
  host: boolean;
  availId?: string;
  reservationDate: Date;
  availCreatedDate: Date;
  availName?: string;
};

const Avail = db.createCollection<avail>("avail");

export default Avail;
