import { IActivationPin } from "../database/activationPin";
import { IAvail } from "../database/avail";
import { IBlockedDates } from "../database/blockedDates";
import { IChat } from "../database/chat";
import { IRegisteredPhone } from "../database/RegisteredPhone";
import { IReservation } from "../database/reservation";
import { ISuspendedStudent } from "../database/suspendedStudent";

export function isReservationArray(obj: unknown): obj is IActivationPin[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
}

export function isIAvailArray(obj: unknown): obj is IAvail[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
}

export function isBlockedDateArray(obj: unknown): obj is IBlockedDates[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
}

export function isIChatArray(obj: unknown): obj is IChat[] {
  if (!Array.isArray(obj)) {
    return false;
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

  return true;
}

export function isISuspendedStudentArray(
  obj: unknown
): obj is ISuspendedStudent[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
}
