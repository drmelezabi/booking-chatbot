import WAWebJS from "whatsapp-web.js";
import isSuperAdmin from "../../controllers/rules/isSuperAdmin";
import RegisteredPhone from "../../database/RegisteredPhone";
import Chat from "../../database/chat";
import restore from "../../backup/restore";

const restoreLocal = async (
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
      taskSyntax: "!استعادة نسخة",
    });
    Chat.save();
    const msg = `🛑 *تنبيه هام* 🛑\nيجب أن تكون حذر بشأن التعامل مع النسخ الاحطياطية والاسترجاع لما من شأنه احتمالية إحداث خلل بالمظومة\n\n لذا يجب اللجوء لها في الحالات الضرورية فقط`;
    const msg2 = `هل ترغب في الاستمرار`;
    client.sendMessage(message.from, msg);
    client.sendMessage(message.from, msg2);
    return;
  }

  if (counter === 1) {
    if (
      /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا/.test(
        message.body
      )
    ) {
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      await restore();
      const msg = `تمت عملية الاستعادة بنجاح`;
      client.sendMessage(message.from, msg);
      return;
    } else if (/لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|/.test(message.body)) {
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = `تم التراجع عن انشاء نسخة احتياطية`;
      client.sendMessage(message.from, msg);
      return;
    } else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
    }
  }
};

export default restoreLocal;
