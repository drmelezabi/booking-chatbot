import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/rules/isAdmin";

export const menu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `🌟 *مرحبا بك في منظومة المذاكرة* 🌟

  أرسل أحد الكلمات التالية للحصول على معلومات عن كيفية استخدام المنظومة:
  
  📱 توثيق
  --- _لتوثيق هاتفك وربطه بحسابك الشخصي_

  👤 ملفي
  --- _لمتابعة الملف الشخصي_
  
  🔘 حجز
  --- _لحجز موعد للمذاكرة_
  
  🔳 الغاء
  --- _لإلغاء حجز مسبق_
  
  🔆 تنشيط
  --- _لتنشيط حجز مع المشرف_
  
  🔹 متابعة
  --- _لمتابعة مواعيد المذاكرة_  

  🔀 *تمرير*`;
  await client.sendMessage(message.from, messageBody);
};

export const trackingInfo = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const errMs = await isAdmin(message.from);
  if (typeof errMs === "string") {
    await client.sendMessage(message.from, errMs);
    return;
  }
  const messageBody = `📅 *لمتابعة جدول المذاكرة* 📅

  أرسل أحد الخبارات التالية:
  
  🔲 *!متابعة المتبقى من اليوم*
  --- _لعرض المتبقي من حجوزات اليوم_ 
  
  🔘 *!متابعه المتبقى من الاسبوع*
  --- _لعرض جدول المذاكرة خلال الأسبوع_
  
  🔳 *!متابعه [يوم]*
  --- _للحصول على جدول المذاكرة الخاصة بيوم محدد_
  --- _مثال: متابعه الخميس_
  `;

  await client.sendMessage(message.from, messageBody);
};

export const personalInfo = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `👤 *الملف الشخصي* 👤

  أرسل أحد الخبارات التالية:
  
  🔲 *!مواعيدي*
  --- _لعرض حجوزات الأسبوع_ 
      
  🔘 *!مخالفات*
  --- _لعرض جدول المذاكرة خلال الأسبوع_`;

  await client.sendMessage(message.from, messageBody);
};

export const AdvancedMenu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const errMs = await isAdmin(message.from);
  if (typeof errMs === "string") {
    await client.sendMessage(message.from, errMs);
    return;
  }

  const menuMessage = `*مرحبا بك في النظام الإداري*
أرسل أحد الكلمات التالية

✅ *تنشيط*
--  لتنشيط حجز تم مسبقا من قبل الطالب
🔍 *متابعة*

🔁 *استعاده*
🏢 *غرف*
🚫 *حجب*
📅 *حجب تاريخ*
📋 *عرض القواعد*
💼 *قواعد الحجز*
🔐 *صلاحيات*
📊 *حالة المنظومة*
💾 *نسخة احتياطية*
🔙 *استعادة نسخة*
🏗️ *بناء*`;

  await client.sendMessage(message.from, menuMessage);
};

export const getRec = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const errMs = await isAdmin(message.from);
  if (typeof errMs === "string") {
    await client.sendMessage(message.from, errMs);
    return;
  }

  const messageBody = `🔐 *للحصول على رمز استعادة حساب من خلال رقم هاتفك* 🔐

أرسل كلمة "!استعادة" متبوعة برقم الهاتف.

*مثال:*
_إذا كان رقم الهاتف مصري_
*مثال:* "!توثيق 01020202020"
⚠ يمكنك كتابة الرقم بالطريقة الشائعة مثل 
الطريقة التقليدية 01022222222
أو مسبوقا برقم 2 مثل 20102020202020 
أو مسبوقا ب 002 مثل 00201020202020

_إذا كان رقم الهاتف غير مصري_
يجب كتابتها مسبوقة بمفتاح الدولة بدون كتابة 00 أو + في البداية.
كمثال، إذا كانت دولة عمان هي 968 ورقم الهاتف 93565656، يُكتب رقم الهاتف 96893565656.
لتكون الرسالة "!توثيق 96893565656"  
`;

  await client.sendMessage(message.from, messageBody);
};

export const verification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `📱 *لتوثيق رقم هاتفك* 📱\nأرسل كلمة " *!توثيق* " متبوعة بالرقم الشخصي\n⚠ ملحوظة هامة: الأرقام يجب أن تكون بالأنجليزية\n\n*مثال*:\n\`\`\`!توثيق 12345\`\`\``;

  await client.sendMessage(message.from, messageBody);
};
