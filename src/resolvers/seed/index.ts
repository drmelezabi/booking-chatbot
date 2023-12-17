import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import Chat from "../../database/chat";
import RegisteredPhone from "../../database/RegisteredPhone";
import isSuperAdmin from "../../controllers/rules/isSuperAdmin";
import studentDataHandlers from "../../controllers/sheet/DatabaseSeed";
import SuspendedStudent from "../../database/suspendedStudent";
import ActivationPin from "../../database/activationPin";
import Reservation from "../../database/reservation";

const seed = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number
) => {
  const registeredData = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!registeredData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }
  const { from: chatId } = message;
  // ---------------- Is Admin ----------------
  const errorMessage = await isSuperAdmin(chatId);
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
      taskSyntax: "!بناء",
    });
    Chat.save();
    const sticker = MessageMedia.fromFilePath("./src/imgs/build.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    const msg = `⚠️ *تنبيه هام* ⚠️\كن حذرًا أثناء استخدام قائمة البناء لتجنب حدوث مشاكل في المنظومة\n\nاستخدمها فقط في الحالات الضرورية`;
    const msg2 = `💭 *هل ترغب في الاستمرار؟* 💭`;
    client.sendMessage(message.from, msg);
    client.sendMessage(message.from, msg2);
    return;
  }

  if (counter === 1) {
    if (
      /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا|تمام/.test(
        message.body
      )
    ) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 2;
        }
      });
      Chat.save();
      const msg = `اختر وسيلة الاستعادة\n\n 🎰 انشاء\n    - حذف كافة البيانات من قواعد البيانات الداخلية والخارجية وإعادة بناء القوائم من واجهة google sheet\n 🔂 تحديث\n - تحديث الحسابات بإضافة الحسبات الجديدة مع عدم التأثير على الحسابات الموجودة بالفعل`;
      client.sendMessage(message.from, msg);
    } else if (
      /لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|بلاش/.test(message.body)
    ) {
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = `🔄 **تم التراجع عن بناء الحسابات** 🔄`;
      client.sendMessage(message.from, msg);
      return;
    } else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
      return;
    }
  }

  if (counter === 1) {
    if (/[إأآا]نشاء/.test(message.body)) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 2;
        }
      });
      Chat.save();
      const msg = `اختر وسيلة الاستعادة\n\n 🎰 انشاء\n    - حذف كافة البيانات من قواعد البيانات الداخلية والخارجية وإعادة بناء القوائم من واجهة google sheet\n 🔂 تحديث\n - تحديث الحسابات بإضافة الحسبات الجديدة مع عدم التأثير على الحسابات الموجودة بالفعل`;
      client.sendMessage(message.from, msg);
    } else if (/تحديث/.test(message.body)) {
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = `🔄 **تم التراجع عن بناء الحسابات** 🔄`;
      client.sendMessage(message.from, msg);
      return;
    } else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
      return;
    }
  }

  if (counter === 2) {
    if (/[إأآا]نشاء/.test(message.body)) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 3;
        }
      });
      Chat.save();
      const msg = `حدد الفئةالمستهدفة بالإنشاء\n\n 🙋‍♂️ طالب\n 👨‍🏫 مدرس\n 👨‍⚖️ إدارة\n 👩‍✈️ أمن\n 🏢 الجميع`;
      client.sendMessage(message.from, msg);
    }
    //
    else if (/تحديث/.test(message.body)) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 4;
        }
      });
      Chat.save();
      const msg = `حدد الفئةالمستهدفة بالتحديث\n\n 🙋‍♂️ طالب\n 👨‍🏫 مدرس\n 👨‍⚖️ إدارة\n 👩‍✈️ أمن\n 🏢 الجميع`;
      client.sendMessage(message.from, msg);
    } //
    else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *إنشاء* \n    ◈ *تحديث*`;
      client.sendMessage(message.from, msg);
      return;
    }
  }

  if (counter === 3) {
    await studentDataHandlers.loadInfo();
    let uploadStatus = false;
    if (/طلاب/.test(message.body)) {
      await studentDataHandlers.deleteAllStudents();
      RegisteredPhone.remove((account) => account.type === "student");
      SuspendedStudent.remove();
      ActivationPin.remove();
      Reservation.remove();
      uploadStatus = await studentDataHandlers.uploadStudentsToFirebase();
    }
    //
    else if (/مدرس/.test(message.body)) {
      await studentDataHandlers.deleteAllTeachers();
      RegisteredPhone.remove((account) => account.type === "teacher");
      uploadStatus = await studentDataHandlers.uploadTeachersToFirebase();
    }
    //
    else if (/[إأآا]دار[ةه]/.test(message.body)) {
      await studentDataHandlers.deleteAllManagers();
      RegisteredPhone.remove((account) => account.type === "manager");
      uploadStatus = await studentDataHandlers.uploadManagersToFirebase();
    }
    //
    else if (/[إأآا]من/.test(message.body)) {
      await studentDataHandlers.deleteAllSecurities();
      RegisteredPhone.remove((account) => account.type === "security");
      uploadStatus = await studentDataHandlers.uploadSecuritiesToFirebase();
    }
    //
    else if (/الجميع/.test(message.body)) {
      await studentDataHandlers.deleteAllAccounts();
      RegisteredPhone.remove();
      SuspendedStudent.remove();
      ActivationPin.remove();
      Reservation.remove();
      uploadStatus = await studentDataHandlers.uploadAllAccounts();
    }
    //
    else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n🙋‍♂️ طالب\n 👨‍🏫 مدرس\n 👨‍⚖️ إدارة\n 👩‍✈️ أمن\n 🏢 الجميع`;
      client.sendMessage(message.from, msg);
      return;
    }
    //
    if (uploadStatus) {
      const msg = `تمت عملية الإنشاء بنجاح`;
      client.sendMessage(message.from, msg);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }
    const msg = `فشلت عملية الإنشاء - رجاء إعادة المحاولة`;
    client.sendMessage(message.from, msg);
    return;
  }

  if (counter === 4) {
    await studentDataHandlers.loadInfo();
    let updateStatus = false;
    if (/طلاب/.test(message.body)) {
      await studentDataHandlers.updateStudentsInFirebase();
    }
    //
    else if (/مدرس/.test(message.body)) {
      await studentDataHandlers.updateTeachersInFirebase();
    }
    //
    else if (/[إأآا]دار[ةه]/.test(message.body)) {
      await studentDataHandlers.updateManagersInFirebase();
    }
    //
    else if (/[إأآا]من/.test(message.body)) {
      await studentDataHandlers.updateSecuritiesInFirebase();
    }
    //
    else if (/الجميع/.test(message.body)) {
      await studentDataHandlers.updateAllAccountsInFirebase();
    }
    //
    else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n🙋‍♂️ طالب\n 👨‍🏫 مدرس\n 👨‍⚖️ إدارة\n 👩‍✈️ أمن\n 🏢 الجميع`;
      client.sendMessage(message.from, msg);
      return;
    }
    //
    if (updateStatus) {
      const msg = `تمت عملية ألتحديث بنجاح`;
      client.sendMessage(message.from, msg);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }
    const msg = `فشلت عملية الإنشاء - رجاء إعادة المحاولة`;
    client.sendMessage(message.from, msg);
    return;
  }
};

export default seed;
