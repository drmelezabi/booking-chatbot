import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import isSuperAdmin from "../../controllers/rules/isSuperAdmin";
import RegisteredPhone from "../../database/RegisteredPhone";
import Chat from "../../database/chat";
import backup from "../../backup/backup";

const createBackUp = async (
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
      taskSyntax: "!نسخة احتياطية",
    });
    Chat.save();
    const sticker = MessageMedia.fromFilePath("./src/imgs/warning.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    const msg = `⚠️ *تنبيه هام* ⚠️\nيجب أن تكون حذر بشأن التعامل مع النسخ الاحطياطية والاسترجاع لما من شأنه احتمالية إحداث خلل بالمنظومة\n\n لذا يجب اللجوء لها في الحالات الضروريةفقط`;
    const msg3 = `📌 *نصائح هامة:* 📌\nيفضل ايقاف الحجوزات وإلغاء الحجوزات التالي كافة قبل الشروع عمل نسخةاحتياطية لتفادي وقوع مشكلات وقت الاستعادة`;
    const msg2 = `💭 *هل ترغب في الاستمرار؟* 💭`;
    client.sendMessage(message.from, msg);
    client.sendMessage(message.from, msg2);
    client.sendMessage(message.from, msg3);
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
      const msg = `اختر طريقة الحصول على النسخة الاحتياطية الأنسب\n\n📪 البريد\n        - مزاياه\n            - _وصول الملفات بشكها الحقيقي_\n            - _إمكانية مراجعة البيانات_\n            -  _لا يستهلك من مساحة قاعدة البيانات السحابية_\n        - عيوبه\n            - _استعادته تحتاج إلى تدخل يدوي_\n\n☁️ السحابة\n        - مزاياه\n            - امكانية استعادته اوتوماتيكياً_\n        - عيوبه\n            - _الاستهلاك الكبير لقواعد البيانات السحابية_\n\n📱 الهاتف                      ☞ _موصى به_\n        - مزاياه\n            - _وصول الملفات بشكليها الحقيقي وملف الاستعادة_\n            - _إمكانية مراجعة البيانات_\n            -  _لا يستهلك من مساحة قاعدة البيانات السحابية_\n            -  _يمكن عمل استعادة للقواعد البيانات باستخدام ملفالاستعادة Restore.json_`;
      client.sendMessage(message.from, msg);
      return;
    } else if (
      /لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|بلاش/.test(message.body)
    ) {
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

  if (counter === 2) {
    const sticker = MessageMedia.fromFilePath("./src/imgs/backup.png");
    if (/السحاب[ةه]/.test(message.body)) {
      await backup("FireBase");
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = "✨ **تمت عملية إنشاء النسخة الاحتياطية بنجاح** ✨";
      client.sendMessage(message.from, msg);
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
      return;
    }

    if (/الهاتف/.test(message.body)) {
      await backup("whatsapp", message.from);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = "✨ **تمت عملية إنشاء النسخة الاحتياطية بنجاح** ✨";
      client.sendMessage(message.from, msg);
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
      return;
    }

    if (/البريد/.test(message.body)) {
      await backup("Email");
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg =
        "✨ **تمت عملية إنشاء النسخة الاحتياطية بنجاح - راجع البريد الالكتروني ** ✨";
      client.sendMessage(message.from, msg);
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
      return;
    }
    const msg = `إجابة غير واضحة*`;
    client.sendMessage(message.from, msg);

    const msg2 = `اختر طريقة الحصول على النسخة الاحتياطية الأنسب\n\n📪 البريد\n        - مزاياه\n            - _وصول الملفات بشكها الحقيقي_\n            - _إمكانية مراجعة البيانات_\n            -  _لا يستهلك من مساحة قاعدة البيانات السحابية_\n        - عيوبه\n            - _استعادته تحتاج إلى تدخل يدوي_\n\n☁️ السحابة\n        - مزاياه\n            - امكانية استعادته اوتوماتيكياً_\n        - عيوبه\n            - _الاستهلاك الكبير لقواعد البيانات السحابية_\n\n📱 الهاتف                      ☞ _موصى به_\n        - مزاياه\n            - _وصول الملفات بشكليها الحقيقي وملف الاستعادة_\n            - _إمكانية مراجعة البيانات_\n            -  _لا يستهلك من مساحة قاعدة البيانات السحابية_\n            -  _يمكن عمل استعادة للقواعد البيانات باستخدام ملفالاستعادة Restore.json_`;
    client.sendMessage(message.from, msg2);
  }
};

export default createBackUp;
