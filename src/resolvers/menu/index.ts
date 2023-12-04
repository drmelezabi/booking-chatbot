import WAWebJS from "whatsapp-web.js";

export const menu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `*مرحبا بك في منظومة المذاكرة*
    أرسل أحد الكلمات التالية
        
      1- حجز
      2- متابعة
      3- الغاء
      4- تنشيط
      5- توثيق`;

  await client.sendMessage(message.from, messageBody);
};

export const trackingInfo = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `*لمتابعة جدول المذاكرة*
  أرسل أحد الخبارات التالية
      ◻ *!متابعه اليوم*
      --- _وذلك لعرض جدول المذاكرة خلال اليوم_

      ◻ *!متابعة المتبقى من اليوم*
      --- _لعرض المتبقي من حجوزات اليوم_ 

      ◻ *!متابعه المتبقى من الاسبوع*
      --- _لعرض جدول المذاكرة خلال الأسبوع_

      ◻ *!متابعه [يوم]*
      --- _للحصول على جدول المذاكرة الخاصة بيوم محدد_
      --- _مثال: متابعه الخميس_`;

  await client.sendMessage(message.from, messageBody);
};

export const AdvancedMenu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `*مرحبا بك في النظام الإداري*
أرسل أحد الكلمات التالية

  1- طلب رمز استعاره`;

  await client.sendMessage(message.from, messageBody);
};

export const getRec = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `للحصول على رمز استعادة حساب من خلال رقم هاتفه
أرسل كلمة "رمز استعاده" متبوعة برقم الهاتف
      
*مثال:*
_ إذا كان رقم الهاتف مصري_
يمكنك استخدام الرقم بالطريقة الشائعة مثل 01022222222 أو مسبوقا برقم 2 مثل 20102020202020 أو مسبوقا ب 002 مثل 00201020202020
لتكون الرسالة "رمز استعاده 01020202020"

_ إذا كان رقم الهاتف غير مصري_
يجب كتابتها مسبوقة بمفتاح الدولة بدون كتابة 00 أو + في البداية
كمثال دولة عمان هو 968 ورقم الهاتف 93565656 يكتب رقم الهاتف 96893565656
لتكون الرسالة "رمز استعاده 96893565656"

`;

  await client.sendMessage(message.from, messageBody);
};

export const verification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `لتوثيق رقم هاتفك
      أرسل كلمة "رمز" متبوعة بالرقم الشخصي
      
      مثال: 
      رمز 12345`;

  await client.sendMessage(message.from, messageBody);
};
