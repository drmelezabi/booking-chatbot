import { GoogleSpreadsheet } from "google-spreadsheet";
import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import config from "../../config/globalVariables";
import serviceAccountAuth from "../../config/googleSheet";
import isSuperAdmin from "../../controllers/rules/isSuperAdmin";
import Chat from "../../database/chat";
import RegisteredPhone from "../../database/RegisteredPhone";

type emails = {
  id: string;
  displayName: string;
  type: string;
  photoLink: string;
  emailAddress: string;
  role: string;
  deleted: boolean;
};

export default async function addNewShare(
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number
) {
  try {
    const chatId = message.from;
    // ~~~~~~~~~~~~~~~~~~~~---- Is Admin ~~~~~~~~~~~~~~~~~~~~----
    const errorMessage = await isSuperAdmin(chatId);
    if (typeof errorMessage === "string") {
      await client.sendMessage(chatId, errorMessage);
      return;
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~------
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
        taskSyntax: "!صلاحية بريد",
      });
      Chat.save();
      client.sendMessage(
        message.from,
        `📧 *إضافة صلاحية وصول بريد إلكتروني إلة قوائم الحسابات على google sheet* 📧\n`
      );
      client.sendMessage(
        message.from,
        `أرسل عنوان البريد الالكتروني\n🌍 وتأكد من دقة الكتابة حيث أن حذف البريد يحتاج إلى تدخل يدوي`
      );
      return;
    }

    if (counter === 1) {
      const doc = new GoogleSpreadsheet(
        config.accountListsSheets,
        serviceAccountAuth
      );
      doc.loadInfo();

      const ExistedEmails = (await doc.listPermissions()).map(
        (e) => (e as emails).emailAddress
      );

      if (ExistedEmails.includes(message.body)) {
        client.sendMessage(message.from, "بريد مسجل بالفعل");
        return;
      }

      if (
        !/^[a-zA-Z0-9._%+-]+@(gmail\.com|du\.edu\.eg)$/i.test(
          message.body.trim()
        )
      ) {
        client.sendMessage(
          message.from,
          "عنوان بريد غير صالح تأكد من كتابة البريد بشكل سليم"
        );
        return;
      }

      await doc.share(message.body.trim(), {
        role: "writer",
        emailMessage:
          "ندعوك للمشاركة على إدارة قوائم الحسابات المشتركة في منظومة المشاركة",
      });

      const newExistedEmails = (await doc.listPermissions())
        .map((e) => (e as emails).emailAddress)
        .filter((e) => e != config.googleServiceAccountEmail);

      client.sendMessage(message.from, "تمت الدعوة بجاح");
      client.sendMessage(
        message.from,
        `القائمة الحالية\n - ${newExistedEmails.join("\n - ")}`
      );

      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }
  } catch (error) {
    throw ErrorHandler(error, "showRules");
  }
}
