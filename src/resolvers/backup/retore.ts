import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import restore from "../../backup/restore";
import restoreFromReceiveFile from "../../backup/restoreFromReceiveFile";
import ErrorHandler from "../../config/errorhandler";
import isSuperAdmin from "../../controllers/rules/isSuperAdmin";
import Chat from "../../database/chat";
import RegisteredPhone from "../../database/RegisteredPhone";

const restoreLocalDB = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number,
  collectingData: { [key: string]: unknown }
) => {
  try {
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
      const sticker = MessageMedia.fromFilePath("./src/imgs/warning.png");
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
      const msg = `⚠️ *تنبيه هام* ⚠️\nيجب أن تكون حذر بشأن التعامل مع النسخ الاحطياطية والاسترجاع لما من شأنه احتمالية إحداث خلل بالمنظومة\n\n لذا يجب اللجوء لها في الحالات الضرورية فقط`;
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
        const msg = `اختر وسيلة الاستعادة\n\n ☁️ السحابة\n    - يتطلب وجود نسخة على السحابة .. يستهلك قدر كبير من القراءة المجانية\n 📱 الهاتف                      ☞ _موصى به_\n -    يتطلب وجود نسخة تم استلامها على الهاتف تحمل اسم Restore.json`;
        client.sendMessage(message.from, msg);
      } else if (
        /لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|بلاش/.test(message.body)
      ) {
        Chat.remove((c) => c.id === isExist.accountId);
        Chat.save();
        const msg = `🔄 **تم التراجع عن إنشاء نسخة احتياطية** 🔄`;
        client.sendMessage(message.from, msg);
        return;
      } else {
        const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
        client.sendMessage(message.from, msg);
        return;
      }
    }

    if (counter === 2) {
      const sticker = MessageMedia.fromFilePath("./src/imgs/data-recovery.png");
      if (/السحاب[ةه]/.test(message.body)) {
        if (await restore()) {
          Chat.remove((c) => c.id === isExist.accountId);
          Chat.save();
          client.sendMessage(
            message.from,
            `✅ **تمت عملية الاستعادة بنجاح** ✅`
          );
          client.sendMessage(message.from, sticker, {
            sendMediaAsSticker: true,
          });
          return;
        } else {
          client.sendMessage(
            message.from,
            "❌ **فشلت عملية الاستعادة.. إذا استمرت المشكلة، رجاءً التواصل مع الإدارة** ❌"
          );
          return;
        }
      } else if (/الهاتف/.test(message.body)) {
        const msg = "قم بإرسال ملف الاستعادة";
        client.sendMessage(message.from, msg);
        Chat.update((chat) => {
          if (chat.id === isExist.accountId) {
            chat.counter = 3;
            chat.data.waitFile = true;
          }
        });
        Chat.save();
        return;
      } else {
        const msg2 = "❓ **إجابة غير واضحة** ❓";
        client.sendMessage(message.from, msg2);
        const msg = `⚠️ *تنبيه هام* ⚠️\nيجب أن تكون حذر بشأن التعامل مع النسخ الاحطياطية والاسترجاع لما من شأنه احتمالية إحداث خلل بالمنظومة\n\n لذا يجب اللجوء لها في الحالات الضرورية فقط`;
        client.sendMessage(message.from, msg);
        return;
      }
    }

    if (counter === 3) {
      const sticker = MessageMedia.fromFilePath("./src/imgs/data-recovery.png");
      if (collectingData.waitFile) {
        if (message.hasMedia) {
          const media = await message.downloadMedia();

          if (media.mimetype === "application/json") {
            if (media.filename === "Restore") {
              const decodedData = Buffer.from(media.data, "base64").toString(
                "utf-8"
              );
              const obj = JSON.parse(decodedData);

              let valid = true;

              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  if (
                    ![
                      "database",
                      "activationPin",
                      "avail",
                      "blockedDates",
                      "chat",
                      "reservation",
                      "suspendedStudent",
                      "registeredPhone",
                    ].includes(key)
                  ) {
                    valid = false;
                  }
                  if (
                    [
                      "activationPin",
                      "avail",
                      "blockedDates",
                      "chat",
                      "reservation",
                      "suspendedStudent",
                      "registeredPhone",
                    ].includes(key) &&
                    !Array.isArray(obj[key])
                  ) {
                    valid = false;
                  } else if (typeof obj["database"] != "object") {
                    valid = false;
                  }
                }
              }
              if (valid) {
                if (await restoreFromReceiveFile(obj)) {
                  client.sendMessage(
                    message.from,
                    `✅ **تمت عملية الاستعادة بنجاح** ✅`
                  );
                  client.sendMessage(message.from, sticker, {
                    sendMediaAsSticker: true,
                  });
                  return;
                } else {
                  client.sendMessage(
                    message.from,
                    `فشلت عملية الاستعادة .. اذا استمرت المشكلة رجاء التواصل مع الإدارة`
                  );
                  return;
                }
              } else {
                client.sendMessage(message.from, "❌ **ملف غير مدعوم** ❌");
                return;
              }
            } else {
              client.sendMessage(message.from, "❌ **ملف غير مدعوم** ❌");
              message.delete(true);
              return;
            }
          } else {
            client.sendMessage(message.from, "❌ **ملف غير مدعوم** ❌");
            message.delete(true);
            return;
          }
        } else {
          client.sendMessage(
            message.from,
            "❗ **لم نتسلم ملف النسخة الاحتياطية** ❗"
          );
          return;
        }
      }
    } else {
      if (message.hasMedia) {
        message.delete(true);
        client.sendMessage(message.from, "📭 **لسنا في انتظار أي ملفات** 📭");
      }
      return;
    }
  } catch (error) {
    throw ErrorHandler(error, "restoreLocalDB");
  }
};

export default restoreLocalDB;
