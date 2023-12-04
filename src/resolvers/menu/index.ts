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

  const chatId = message.from;
  await client.sendMessage(chatId, messageBody);
};

export const AdvancedMenu = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `*مرحبا بك في الظام الإداري*
    أرسل أحد الكلمات التالية
        
      1- استعادة رمز الاستعادة`;

  const chatId = message.from;
  await client.sendMessage(chatId, messageBody);
};

export const verification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const messageBody = `لتوثيق رقم هاتفك
      أرسل كلمة "رمز" متبوعة بالرقم الشخصي
      
      مثال: 
      رمز 12345`;

  const chatId = message.from;
  await client.sendMessage(chatId, messageBody);
};
