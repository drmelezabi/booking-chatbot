import WAWebJS from "whatsapp-web.js";
import RegisteredPhone from "../../database/RegisteredPhone";
import isAdmin from "../../controllers/accounts/isAdmin";
import Chat from "../../database/chat";
import db from "../../database/setup";

const remove = (accountId: string) =>
  Chat.fetchAll()
    .map((c) => c.id === accountId)
    .map(() => {
      Chat.remove((c) => c.id === accountId);
      Chat.save();
    });

const EditBookingRules = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number
) => {
  console.log({ message: message.body, counter });
  const registeredData = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!registeredData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }
  const { from: chatId } = message;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }

  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (counter === 0) {
    Chat.create({
      id: isExist.accountId,
      counter: 1,
      data: {},
      lastMessage: new Date(),
      taskSyntax: "!قواعد الحجز",
    });
    Chat.save();
    const msg = `ما هو الإجراء المطلوب تطبيقه قواعد الحجز\n    ◈ *حذف قبل البدء [القيمة بالساعات]*\n    - الحد الأقصى للسماح بحزف موعد قبل بدءه\n    ◈ *حجز بعد البدء [القيمة بالدقائق]*\n    - الحد الأقصى لحجز موعد بعد بدءه\n    ◈ *بداية المذاكرة [الساعة بنظام 24]*\n    - الحد الأدنى لبدء المذاكرة\n    ◈ *نهاية المذاكرة [الساعة بنظام 24]*\n    - الحد الأقصى لإنتهاء المذاكرة\n    ◈ *أيام الجزاءات [القيمة بالأيام]*\n    - أياء المجزاء (تضرب في عدد مرات الإيقاف)`;
    client.sendMessage(message.from, msg);
    return;
  }

  if (counter === 1) {
    if (/^حذف قبل البدء/.test(message.body)) {
      const num = message.body.replace(/^حذف قبل البدء/, "");
      db.set<number>("maxTimeBeforeDelete", parseInt(num, 10));
      db.save();
      client.sendMessage(message.from, "تم التعديل بنجاح");
      return;
    }

    if (/^حجز بعد البدء/.test(message.body)) {
      const num = message.body.replace(/^ّحجز بعد البدء/, "");
      db.set<number>("maxTimeToBookAfterItsStartInMin", parseInt(num, 10));
      db.save();
      remove(isExist.accountId);
      client.sendMessage(message.from, "تم التعديل بنجاح");
      return;
    }

    if (/^بداية المذاكرة/.test(message.body)) {
      const num = message.body.replace(/^بداية المذاكرة/, "");
      db.set<number>("bookingOpen", parseInt(num, 10));
      db.save();
      remove(isExist.accountId);
      const msg = `حجز مواعيد أصبح متاح من الآن وصاعدا`;
      client.sendMessage(message.from, msg);
      return;
    }

    if (/^نهاية المذاكرة/.test(message.body)) {
      const num = message.body.replace(/^نهاية المذاكرة/, "");
      db.set<number>("bookingClose", parseInt(num, 10));
      db.save();
      remove(isExist.accountId);
      const msg = `حجز مواعيد أصبح متاح من الآن وصاعدا`;
      client.sendMessage(message.from, msg);
      return;
    }

    if (/^[اإآأ]يام الجزاءات/.test(message.body)) {
      const num = message.body.replace(/^نهاية المذاكرة/, "");
      db.set<number>("punishmentUnit", parseInt(num, 10));
      db.save();
      remove(isExist.accountId);
      const msg = `حجز مواعيد أصبح متاح من الآن وصاعدا`;
      client.sendMessage(message.from, msg);
      return;
    }
  }
};

export default EditBookingRules;
