import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/rules/isAdmin";
import detectDateFromString from "../../controllers/date/detectDateFromString";
import starkString from "starkstring";
import Chat from "../../database/chat";
import RegisteredPhone from "../../database/RegisteredPhone";
import BlockedDates from "../../database/blockedDates";

const updateBlockedDatesResolve = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number,
  collectingData: { [key: string]: unknown }
) => {
  const chatId = message.from;
  // ~~~~~~~~~~~~~~~~~~~~---- Is Admin ~~~~~~~~~~~~~~~~~~~~----
  const errorMessage = await isAdmin(chatId);
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

  const optionsDateAnnually: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
  };
  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const dateAnnually = new Intl.DateTimeFormat("ar-EG", optionsDateAnnually);
  const date = new Intl.DateTimeFormat("ar-EG", optionsDate);

  const compareDate = (dt1: Date, dt2: Date): boolean => {
    return (
      dt1.getFullYear() === dt2.getFullYear() &&
      dt1.getMonth() === dt2.getMonth() &&
      dt1.getDate() === dt2.getDate()
    );
  };

  //
  // =======================================================================================================================================================
  if (counter === 5) {
    if (
      /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا/.test(
        message.body
      )
    ) {
      delete collectingData.status;
      BlockedDates.create(collectingData);
      BlockedDates.save();

      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();

      const blockedDates = BlockedDates.fetchAll();
      const msg = "تم إضافة التاريخ إلى قائمة الحجب بنجاح";
      client.sendMessage(message.from, msg);
      const array = blockedDates.length
        ? blockedDates
            .map((dateCase) => {
              return `    - *التاريخ* : ${
                dateCase.annually
                  ? `${dateAnnually.format(new Date(dateCase.date))} من كل عام`
                  : date.format(new Date(dateCase.date))
              }\n    - *السبب* : ${dateCase.reason}`;
            })
            .join("\n~~~~~~~~~~~~~~~~~~~~~~~~~\n")
        : "لا يوجد أي تواريخ محجوبة عن المذاكرة";

      const msgx = "🚫 *القائمة الحالية للتواريخ المحجوبة* 🚫\n".concat(array);
      client.sendMessage(message.from, msgx);
    } else if (/لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|/.test(message.body)) {
      const msg = "تم التراجع عن إضافة التاريخ إلى قائمة الحجب";
      client.sendMessage(message.from, msg);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    } else {
      const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
    }
  }

  //
  // =======================================================================================================================================================
  //
  else if (counter === 4) {
    const collectedDate = new Date(collectingData["date"] as Date);

    Chat.update((chat) => {
      if (chat.id === isExist.accountId) {
        chat.counter = 5;
        chat.lastMessage = new Date();
        chat.data.reason = message.body
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[\d]/g, (match) =>
            starkString(match).englishNumber().toString()
          );
      }
    });
    Chat.save();

    client.sendMessage(
      message.from,
      `راجع البيانات لبيانات التالي المطلوبة\n${dateAnnually.format(
        new Date(collectedDate)
      )}\n\n هل ترغب حقا في إضافة التاريخ لقائمة الحجب؟ \n\n    ◈ *نعم* \n    ◈ *لا*`
    );
    return;
  }

  //
  // =======================================================================================================================================================
  //
  else if (counter === 3) {
    const collectedDate = new Date(collectingData["date"] as unknown as Date);
    if (collectingData["status"] === "add") {
      if (
        /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا/.test(
          message.body
        )
      ) {
        Chat.update((chat) => {
          if (chat.id === isExist.accountId) {
            chat.counter = 4;
            chat.lastMessage = new Date();
            chat.data.annually = true;
          }
        });
        Chat.save();
        const msg = `ما هو السبب المعلن عن حجب المذاكرة\n\nمثال :\n    - اجازة رسمية - انتصارات اكتوبر \n    - قرار إداري`;
        client.sendMessage(message.from, msg);
        return;
      } else if (/لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|/.test(message.body)) {
        Chat.update((chat) => {
          if (chat.id === isExist.accountId) {
            chat.counter = 4;
            chat.lastMessage = new Date();
            chat.data.annually = false;
          }
        });
        Chat.save();

        const msg = `ما هو السبب المعلن عن حجب المذاكرة\n\nمثال :\n    - اجازة رسمية - انتصارات اكتوبر \n    - قرار إداري`;
        client.sendMessage(message.from, msg);
        return;
      } else {
        const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
        client.sendMessage(message.from, msg);
      }
    }
    /// حذف
    else {
      if (
        /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا/.test(
          message.body
        )
      ) {
        BlockedDates.remove((dt) => {
          return !compareDate(collectedDate, dt.date);
        });
        BlockedDates.save();

        Chat.remove((c) => c.id === isExist.accountId);
        Chat.save();

        client.sendMessage(message.from, `تم حذف التاريخ من قائمة الحجب`);
        const blockedDates = BlockedDates.fetchAll();
        const array = blockedDates.length
          ? blockedDates
              .map((dateCase) => {
                return `    - *التاريخ* : ${
                  dateCase.annually
                    ? `${dateAnnually.format(
                        new Date(dateCase.date)
                      )} من كل عام`
                    : date.format(new Date(dateCase.date))
                }\n    - *السبب* : ${dateCase.reason}`;
              })
              .join("\n~~~~~~~~~~~~~~~~~~~~~~~~~\n")
          : "لا يوجد أي تواريخ محجوبة عن المذاكرة";

        client.sendMessage(
          message.from,
          "🚫 *القائمة الحالية للتواريخ المحجوبة* 🚫\n".concat(array)
        );
      } else if (/لا|لأ|كلا|No|no|N|n|غير [اآإأ]رفض|رافض|/.test(message.body)) {
        Chat.remove((c) => c.id === isExist.accountId);
        Chat.save();

        client.sendMessage(message.from, `تم التراجع عن الحذف`);
      } else {
        const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
        client.sendMessage(message.from, msg);
      }

      return;
    }
  }
  //
  // =======================================================================================================================================================
  //
  else if (counter === 2) {
    const rePhrase = message.body.replace(
      /[\u0660-\u0669\u06F0-\u06F9]/g,
      (match) => starkString(match).englishNumber().toString()
    );
    const getDate = detectDateFromString(rePhrase);

    if (!getDate) {
      const msg = `عذرا التاريخ المطلوب غير واضح رجاء إعادة المحاولة`;
      client.sendMessage(message.from, msg);
      return;
    }

    if (collectingData["status"] === "add") {
      const blockedDataArray = BlockedDates.fetchAll();
      const isExistedDate = blockedDataArray.filter((dt) => {
        return compareDate(getDate, dt.date);
      });

      if (isExistedDate.length) {
        const msg = "التاريخ المطلوب إضافته لقائمة الحجب موجود بالفعل";
        client.sendMessage(message.from, msg);
        return;
      }

      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 3;
          chat.lastMessage = new Date();
          chat.data.date = getDate;
        }
      });
      Chat.save();

      const msg = `هل ترغب بحجب التاريخ سنوياً\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
      return;
    } else {
      const blockedDates = BlockedDates.fetchAll();

      const isExistedDate = blockedDates.filter((dt) => {
        return compareDate(getDate, dt.date);
      });

      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 3;
          chat.lastMessage = new Date();
          chat.data.date = getDate;
        }
      });
      Chat.save();

      if (isExistedDate.length) {
        const formatedDate = dateAnnually.format(getDate);
        const msg = `هل ترغب حقا في حذف التاريخ : ${formatedDate}\n\n    ◈ *نعم* \n    ◈ *لا*`;
        client.sendMessage(message.from, msg);
      } else {
        client.sendMessage(
          message.from,
          `التاريخ - *${dateAnnually.format(
            getDate
          )}* غير موجود بقائمة التواريخ المحجوبة.\n\nرجاء المراجعة للتأكد من التاريخ المطلوب حذفه أو التأكد من كتابة التاريخ بصورة سليمة`
        );

        const array = blockedDates.length
          ? blockedDates
              .map((dateCase) => {
                return `    - *التاريخ* : ${
                  dateCase.annually
                    ? `${dateAnnually.format(
                        new Date(dateCase.date)
                      )} من كل عام`
                    : date.format(new Date(dateCase.date))
                }\n    - *السبب* : ${dateCase.reason}`;
              })
              .join("\n~~~~~~~~~~~~~~~~~~~~~~~~~\n")
          : "لا يوجد أي تواريخ محجوبة عن المذاكرة";

        client.sendMessage(
          message.from,
          "🚫 *القائمة الحالية للتواريخ المحجوبة* 🚫\n".concat(array)
        );
        return;
      }
    }
  }
  //
  // =======================================================================================================================================================
  //
  else if (counter === 1) {
    const query = message.body.trim();
    if (/[اأإآ]ضاف[ةه]/.test(query)) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 2;
          chat.lastMessage = new Date();
          chat.data.status = "add";
        }
      });
      Chat.save();
      client.sendMessage(message.from, `اخبرنا ما هو التاريخ المطلوب`);
      return;
    } else if (/حذف/.test(query)) {
      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 2;
          chat.lastMessage = new Date();
          chat.data.status = "remove";
        }
      });
      Chat.save();
      client.sendMessage(
        message.from,
        `اخبرنا ما هو التاريخ المطلوب ${
          collectingData["status"] === "add" ? "إضافته" : "حذفه"
        }`
      );
      return;
    } else {
      client.sendMessage(message.from, `لم نتمكن من الحصول على إجابة واضحة`);
      return;
    }
  }
  //
  // =======================================================================================================================================================
  //
  else {
    Chat.create({
      id: isExist.accountId,
      counter: 1,
      data: {},
      lastMessage: new Date(),
      taskSyntax: "!حجب تاريخ",
    });
    Chat.save();
    const blockedDates = BlockedDates.fetchAll();
    const array = blockedDates.length
      ? blockedDates
          .map((dateCase) => {
            return `    - *التاريخ* : ${
              dateCase.annually
                ? `${dateAnnually.format(new Date(dateCase.date))} من كل عام`
                : date.format(new Date(dateCase.date))
            }\n    - *السبب* : ${dateCase.reason}`;
          })
          .join("\n~~~~~~~~~~~~~~~~~~~~~~~~~\n")
      : "لا يوجد أي تواريخ محجوبة عن المذاكرة";

    const msg = `اختر الإجراء المراد تطبيقه على القائمة\n    ◈ *إضافة* \n    ◈ *حذف*`;
    client.sendMessage(
      message.from,
      "🚫 *القائمة الحالية للتواريخ المحجوبة* 🚫\n".concat(array)
    );
    client.sendMessage(message.from, msg);
    return;
  }

  // const chat = await client.getChatById(chatId);
  // const messages = await chat.fetchMessages({ limit: 6, fromMe: true });

  // console.log(util.inspect(messages, { depth: 2, colors: true }));
};

export default updateBlockedDatesResolve;
