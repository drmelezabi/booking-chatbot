import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import {
  isBlockedDateArray,
  isIAvailArray,
  isIChatArray,
  isIRegisteredPhoneArray,
  isIReservationArray,
  isISuspendedStudentArray,
  isReservationArray,
} from "./validateRestoredData";
import { firestoreDb } from "../config/firebase";
import ActivationPin from "../database/activationPin";
import Avail from "../database/avail";
import BlockedDates from "../database/blockedDates";
import Chat from "../database/chat";
import RegisteredPhone from "../database/RegisteredPhone";
import Reservation from "../database/reservation";
import db from "../database/setup";
import SuspendedStudent from "../database/suspendedStudent";

const restore = async () => {
  try {
    const restoredData: unknown[] = [];

    const q = query(
      collection(firestoreDb, "backup"),
      orderBy("backup", "desc"),
      limit(1)
    );

    const docSnap = await getDocs(q);

    docSnap.forEach((doc) => {
      restoredData.push(doc.data());
    });

    if (restoredData.length) {
      const RestoredObject = restoredData[0];

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "activationPin" in RestoredObject &&
        RestoredObject.activationPin
      ) {
        const RESActivationPin = RestoredObject.activationPin;
        if (isReservationArray(RESActivationPin)) {
          ActivationPin.remove();
          ActivationPin.createBulk(RESActivationPin);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "avail" in RestoredObject &&
        RestoredObject.avail
      ) {
        const RESAvail = RestoredObject.avail;
        if (isIAvailArray(RESAvail)) {
          Avail.remove();
          Avail.createBulk(RESAvail);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "blockedDates" in RestoredObject &&
        RestoredObject.blockedDates
      ) {
        const RESBlockedDates = RestoredObject.blockedDates;
        if (isBlockedDateArray(RESBlockedDates)) {
          BlockedDates.remove();
          BlockedDates.createBulk(RESBlockedDates);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "chat" in RestoredObject &&
        RestoredObject.chat
      ) {
        const RESChat = RestoredObject.chat;
        if (isIChatArray(RESChat)) {
          Chat.remove();
          Chat.createBulk(RESChat);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "registeredPhone" in RestoredObject &&
        RestoredObject.registeredPhone
      ) {
        const RESRegisteredPhone = RestoredObject.registeredPhone;
        if (isIRegisteredPhoneArray(RESRegisteredPhone)) {
          RegisteredPhone.remove();
          RegisteredPhone.createBulk(RESRegisteredPhone);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "reservation" in RestoredObject &&
        RestoredObject.reservation
      ) {
        const RESReservation = RestoredObject.reservation;
        if (isIReservationArray(RESReservation)) {
          Reservation.remove();
          Reservation.createBulk(RESReservation);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "reservation" in RestoredObject &&
        RestoredObject.reservation
      ) {
        const RESSuspendedStudent = RestoredObject.reservation;
        if (isISuspendedStudentArray(RESSuspendedStudent)) {
          SuspendedStudent.remove();
          SuspendedStudent.createBulk(RESSuspendedStudent);
        }
      }

      if (
        RestoredObject &&
        typeof RestoredObject === "object" &&
        "database" in RestoredObject &&
        RestoredObject.database &&
        typeof RestoredObject.database === "object" &&
        "BookingAvailability" in RestoredObject.database &&
        RestoredObject.database.BookingAvailability &&
        "maxTimeToBookAfterItsStartInMin" in RestoredObject.database &&
        RestoredObject.database.maxTimeToBookAfterItsStartInMin &&
        "groupId" in RestoredObject.database &&
        RestoredObject.database.groupId &&
        "bookingOpen" in RestoredObject.database &&
        RestoredObject.database.bookingOpen &&
        "bookingClose" in RestoredObject.database &&
        RestoredObject.database.bookingClose &&
        "blockedDays" in RestoredObject.database &&
        RestoredObject.database.blockedDays &&
        "punishmentUnit" in RestoredObject.database &&
        RestoredObject.database.punishmentUnit &&
        "maxTimeBeforeDelete" in RestoredObject.database &&
        RestoredObject.database.maxTimeBeforeDelete &&
        "rooms" in RestoredObject.database &&
        RestoredObject.database.rooms &&
        "dictionary" in RestoredObject.database &&
        RestoredObject.database.dictionary
      ) {
        db.set(
          "BookingAvailability",
          RestoredObject.database.BookingAvailability as any
        );

        db.set(
          "maxTimeToBookAfterItsStartInMin",
          RestoredObject.database.maxTimeToBookAfterItsStartInMin as number
        );

        db.set("groupId", RestoredObject.database.groupId as string);
        db.set("bookingOpen", RestoredObject.database.bookingOpen as number);
        db.set("bookingClose", RestoredObject.database.bookingClose as number);
        db.set("blockedDays", RestoredObject.database.blockedDays as string[]);
        db.set(
          "punishmentUnit",
          RestoredObject.database.punishmentUnit as number
        );

        db.set(
          "maxTimeBeforeDelete",
          RestoredObject.database.maxTimeBeforeDelete as number
        );
        db.set("rooms", RestoredObject.database.rooms as string[]);
        db.set(
          "dictionary",
          RestoredObject.database.dictionary as { [key: string]: string }
        );
      }
    }

    return true;
  } catch (error) {
    console.log("restore", error);
    return false;
  }
};

export default restore;
