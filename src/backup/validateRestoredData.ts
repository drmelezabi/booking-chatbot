import { IRegisteredPhone } from "../database/RegisteredPhone";
import { IActivationPin } from "../database/activationPin";
import { IAvail } from "../database/avail";
import { IBlockedDates } from "../database/blockedDates";
import { IChat } from "../database/chat";
import { IReservation } from "../database/reservation";
import { ISuspendedStudent } from "../database/suspendedStudent";

export function isReservationArray(obj: unknown): obj is IActivationPin[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      typeof item.reservationId !== "string" ||
      typeof item.pin !== "number" ||
      !(item.creationDate instanceof Date) ||
      typeof item.name !== "string"
    ) {
      return false;
    }
  }

  return true;
}

export function isIAvailArray(obj: unknown): obj is IAvail[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      typeof item.hostId !== "string" ||
      typeof item.pin !== "number" ||
      typeof item.reservationId !== "string" ||
      typeof item.host !== "boolean" ||
      !(item.reservationDate instanceof Date) ||
      !(item.availCreatedDate instanceof Date)
    ) {
      return false;
    }
  }

  return true;
}

export function isBlockedDateArray(obj: unknown): obj is IBlockedDates[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      !(item.date instanceof Date) ||
      typeof item.reason !== "string" ||
      typeof item.annually !== "boolean"
    ) {
      return false;
    }
  }

  return true;
}

export function isIChatArray(obj: unknown): obj is IChat[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      typeof item.id !== "string" ||
      !(item.lastMessage instanceof Date) ||
      typeof item.taskSyntax !== "string" ||
      typeof item.counter !== "number" ||
      typeof item.data !== "object"
    ) {
      return false;
    }
  }

  return true;
}

export function isIRegisteredPhoneArray(
  obj: unknown
): obj is IRegisteredPhone[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
}

export function isIReservationArray(obj: unknown): obj is IReservation[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      typeof item.accountId !== "string" ||
      typeof item.reservationId !== "string" ||
      typeof item.Date !== "object"
    ) {
      return false;
    }
  }

  return true;
}

export function isISuspendedStudentArray(
  obj: unknown
): obj is ISuspendedStudent[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (let item of obj) {
    if (
      typeof item.accountId !== "string" ||
      typeof item.ViolationCounter !== "number" ||
      typeof item.suspensionCase !== "boolean" ||
      !(item.BookingAvailabilityDate instanceof Date) ||
      !Array.isArray(item.violations)
    ) {
      return false;
    }
  }

  return true;
}
