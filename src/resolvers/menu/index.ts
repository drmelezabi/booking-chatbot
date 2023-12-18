import SimplDB from "simpl.db";
import WAWebJS from "whatsapp-web.js";

import menu from "./menu";
import Chat from "../../database/chat";
import { IRegisteredPhone } from "../../database/RegisteredPhone";

export const mainMenu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number,
  account: SimplDB.Readable<IRegisteredPhone>
) => {
  const { type, permissions } = account;

  if (counter === 0) {
    Chat.create({
      id: account.accountId,
      counter: 1,
      data: {},
      lastMessage: new Date(),
      taskSyntax: "!مساعدة",
    });
    Chat.save();

    const stdMessage = `🌟 *مرحبا بك في منظومة المذاكرة* 🌟\n\nأرسل أحد الكلمات التالية للحصول على معلومات عن كيفية استخدام المنظومة:\n\n  📱 توثيق\n      --- _لتوثيق هاتفك وربطه بحسابك الشخصي_\n\n  🔘 حجز\n      --- _لحجز موعد للمذاكرة_\n\n  🔳 الغاء\n      --- _لإلغاء حجز مسبق_\n\n  🔆 تنشيط\n      --- _لتنشيط حجز مع المشرف_\n\n  🔘 *!مخالفات*\n      --- _لعرض جدول المذاكرة خلال الأسبوع_\n\n  🔹 متابعة\n      --- _لمتابعة مواعيد المذاكرة_\n\n  🔀 *تمرير*\n      --- _لنقل ملكلية حجز إلى زميل_\n\n📋 *عرض القواعد*\n-- لعرض القواعد المسيرة للمنظومة`;
    const teacherSecurityManagerMessage = `*مرحبا بك في النظام الإداري*\nأرسل أحد الكلمات التالية\n\n✅ *تنشيط*\n--  لتنشيط حجز تم مسبقا من قبل الطالب\n\n🔍 *متابعة*\n-- لمتابعة مواعيد المذاكرة\n\n📋 *عرض القواعد*\n-- لعرض القواعد المسيرة للمنظومة`;
    const adminMessage = `*مرحبا بك في النظام الإداري*\nأرسل أحد الكلمات التالية\n\n✅ *تنشيط*\n--  لتنشيط حجز تم مسبقا من قبل الطالب\n\n🔍 *متابعة*\n-- لمتابعة مواعيد المذاكرة\n\n🔁 *استعاده*\n-- لاستعادة رمز التنشيط في حالة فقد الطالب للرمز\n\n🏢 *غرف*\n-- لإضافة أو حجزف غرف المذاكرة\n\n🚫 *حجب*\n-- لحجب يوم أسبوعياً عن المذاكرة\n\n📅 *حجب تاريخ*\n-- لحجب تاريخ محدد عن المذاكرة\n\n📋 *عرض القواعد*\n-- لعرض القواعد المسيرة للمنظومة\n\n💼 *قواعد الحجز*\n-- لتعديل القواعد المسيرة للمنظومة\n\n🔐 *صلاحيات*\n-- لترقية أو تنزيل حساب\n\n📊 *حالة المنظومة*\n-- لإيقاف أو تشغيل المنظومة\n\n💾 *نسخة احتياطية*\n-- لعمل نسخة احتياطية من قواعد البيانات المحلية\n\n🔙 *استعادة نسخة*\n-- لاستعادة النسخة الاحتياطية من قواعد البيانات المحلية\n\n🏗️ *بناء*\n-- لبناء الحسابات من ملف google sheet`;

    if (permissions === "admin" || permissions === "superAdmin")
      client.sendMessage(message.from, adminMessage);
    else if (["teacher", "manager", "security"].includes(type))
      client.sendMessage(message.from, teacherSecurityManagerMessage);
    else client.sendMessage(message.from, stdMessage);

    return;
  }

  if (counter === 1) {
    if (/^توثيق\s*$/.test(message.body)) {
      client.sendMessage(message.from, menu.verify);
      return;
    }
    //
    else if (/^حجز\s*$/.test(message.body)) {
      if (!(type === "student")) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.booking1);
      client.sendMessage(message.from, menu.booking2);
      client.sendMessage(message.from, menu.booking3);
      return;
    }
    //
    else if (/^[اإأآ]لغاء\s*$/.test(message.body)) {
      if (!(type === "student")) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.cancel);
      return;
    }
    //
    else if (/^تنشيط\s*$/.test(message.body)) {
      if (["security", "manager"].includes(type)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.activation);
      return;
    }
    //
    else if (/^مواعيد[ىي]\s*$/.test(message.body)) {
      if (!(type === "student")) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.myScedule);
      return;
    }
    //
    else if (/^مخالفات\s*$/.test(message.body)) {
      if (!(type === "student")) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.myViolations);
      return;
    }
    //
    else if (/^متابع[ةه]\s*$/.test(message.body)) {
      if (type === "student") {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.tracking);
      return;
    }
    //
    else if (/^تمرير\s*$/.test(message.body)) {
      if (["security", "manager"].includes(type)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.throw1);
      client.sendMessage(message.from, menu.throw2);
      client.sendMessage(message.from, menu.throw3);
      client.sendMessage(message.from, menu.throw4);
      client.sendMessage(message.from, menu.throw5);
      return;
    }
    //
    else if (/^عرض القواعد\s*$/.test(message.body)) {
      client.sendMessage(message.from, menu.myScedule);
      return;
    }
    //
    else if (/^[اإأآ]ستعاد[ةه]\s*$/.test(message.body)) {
      client.sendMessage(message.from, menu.restore1);
      client.sendMessage(message.from, menu.restore2);
      client.sendMessage(message.from, menu.restore3);
      return;
    }
    //
    else if (/^غرف\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.Rooms1);
      client.sendMessage(message.from, menu.Rooms2);
      return;
    }
    //
    else if (/^حجب\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.dayBlock);
      return;
    }
    //
    else if (/^حجب تاريخ\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.dateBlock);
      return;
    }
    //
    else if (/^قواعد الحجز\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.RulesEditing);
      return;
    }
    //
    else if (/^صلاحيات\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.permissions);
      return;
    }
    //
    else if (/^!حال[ةه] المنظوم[ةه]\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.permissions);
      return;
    }
    //
    else if (/^!نسخ[ةه] [إأا]حتياطي[ةه]\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.backup);
      return;
    }
    //
    else if (/^!استعاد[ةه] نسخ[ةه]\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.Recovery);
      return;
    }
    //
    else if (/^بناء\s*$/.test(message.body)) {
      if (!["admin", "superAdmin"].includes(permissions)) {
        client.sendMessage(message.from, "لا تملك صلاحية الوصول لهذه القائمة");
        return;
      }
      client.sendMessage(message.from, menu.build);
      return;
    }
    //
    else {
      client.sendMessage(message.from, "لا أفهم ما تحاول البحث عنه");
      return;
    }
  }
};
