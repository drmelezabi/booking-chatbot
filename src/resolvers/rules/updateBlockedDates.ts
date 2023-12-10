import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import updateChatData from "../../controllers/chat/updateChatDate";
import createChatDate from "../../controllers/chat/createChatDate";
import getBlockedDates from "../../controllers/rules/read/getBlockedDates";
import detectDateFromString from "../../controllers/date/detectDateFromString";
import starkString from "starkstring";
import localDb, { chat } from "../../config/localDb";
import deleteChatData from "../../controllers/chat/deleteChatData";

const updateBlockedDatesResolve = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number,
  collectingData: { [key: string]: unknown }
) => {
  await localDb.reload();
  await chat.reload();

  const chatId = message.from;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------
  const isExist = await getAccountByChatId(message.from);
  if (isExist === null) {
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

  // ------------------------------------------
  if (counter === 5) {
    if (/نعم|[أاإآ]جل|yes|Yes|Y|y|موافق/.test(message.body)) {
      await localDb.push("/rules/blockedDates[]", collectingData, true);
      await localDb.save();
      await localDb.reload();
      await deleteChatData(isExist.studentId);

      const blockedDates = await getBlockedDates();
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
            .join("\n------------\n")
        : "لا يوجد أي تواريخ محجوبة عن المذاكرة";

      client.sendMessage(
        message.from,
        "🚫 *القائمة الحالية للتواريخ المحجوبة* 🚫\n".concat(array)
      );
    } else if (
      /لا|لأ|كلا|No|no|N|n|غير موافق|غير موافق|[اآإأ]رفض|رافض|/.test(
        message.body
      )
    ) {
      const msg = "تم التراجع عن إضافة التاريخ إلى قائمة الحجب";
      client.sendMessage(message.from, msg);
      await deleteChatData(isExist.studentId);
      return;
    }
  }
  //
  //
  else if (counter === 4) {
    const collectedDate = collectingData["date"] as Date;

    await updateChatData(isExist.studentId, {
      counter: 5,
      lastMessage: new Date(),
      data: {
        reason: message.body
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[\d]/g, (match) =>
            starkString(match).englishNumber().toString()
          ),
      },
    });

    const blockedDates = (await getBlockedDates()).filter((dt) => {
      const dtP = new Date(dt.date);
      return (
        collectedDate.getFullYear() === dtP.getFullYear() &&
        collectedDate.getMonth() === dtP.getMonth() &&
        collectedDate.getDate() === dtP.getDate()
      );
    });

    if (blockedDates.length) {
      client.sendMessage(
        message.from,
        "التاريخ المطلوب إضافته لقائمة الحجب موجود بالفعل"
      );
      return;
    }

    client.sendMessage(
      message.from,
      `راجع البيانات لبيانات التالي المطلوبة\n${dateAnnually.format(
        new Date(collectedDate)
      )}\n\n هل ترغب حقا في إضافة التاريخ لقائمة الحجب؟ \n\n    ◈ *نعم* \n    ◈ *لا*`
    );
    return;
  }
  //
  //
  else if (counter === 3) {
    const collectedDate = new Date(collectingData["date"] as Date);
    if (collectingData["status"] === "add") {
      if (/نعم|[أاإآ]جل|yes|Yes|Y|y|موافق/.test(message.body)) {
        await updateChatData(isExist.studentId, {
          counter: 4,
          lastMessage: new Date(),
          data: { annually: true },
        });
      } else if (
        /لا|لأ|كلا|No|no|N|n|غير موافق|غير موافق|[اآإأ]رفض|رافض|/.test(
          message.body
        )
      ) {
        await updateChatData(isExist.studentId, {
          counter: 4,
          lastMessage: new Date(),
          data: { annually: false },
        });
      }

      const msg = `ما هو السبب المعلن عن حجب المذاكرة\n\nمثال :\n    - اجازة رسمية - انتصارات اكتوبر \n    - قرار إداري`;
      client.sendMessage(message.from, msg);
      return;
    }
    /// حذف
    else {
      const blockedDates = (await getBlockedDates()).filter((dt) => {
        const dtP = new Date(dt.date);
        return !(
          collectedDate.getFullYear() === dtP.getFullYear() &&
          collectedDate.getMonth() === dtP.getMonth() &&
          collectedDate.getDate() === dtP.getDate()
        );
      });

      await localDb.push("/rules/blockedDates", blockedDates, true);
      await localDb.save();
      await localDb.reload();

      await deleteChatData(isExist.studentId);

      client.sendMessage(message.from, `تم حذف التاريخ من قائمة الحجب`);
      return;
    }
  }
  //
  //
  else if (counter === 2) {
    const rePhrase = message.body.replace(
      /[\u0660-\u0669\u06F0-\u06F9]/g,
      (match) => starkString(match).englishNumber().toString()
    );
    const getDate = detectDateFromString(rePhrase);
    if (!getDate) {
      client.sendMessage(
        message.from,
        `عذرا التاريخ المطلوب غير واضح رجاء إعادة المحاولة`
      );
      return;
    }
    if (collectingData["status"] === "add") {
      const blockedDates = (await getBlockedDates()).filter((dt) => {
        return !(
          getDate?.getFullYear() === dt.date.getFullYear() &&
          getDate?.getMonth() === dt.date.getMonth() &&
          getDate?.getDate() === dt.date.getDate()
        );
      });
      await localDb.push("/rules/blockedDates", blockedDates, true);

      await updateChatData(isExist.studentId, {
        counter: 3,
        lastMessage: new Date(),
        data: { date: getDate },
      });

      client.sendMessage(
        message.from,
        `هل ترغب بحجب التاريخ سنوياً\n\n    ◈ *نعم* \n    ◈ *لا*`
      );
      return;
    } else {
      const blockedDates = await getBlockedDates();

      const isExistedDate = blockedDates.filter((dt) => {
        return (
          getDate.getFullYear() === dt.date.getFullYear() &&
          getDate.getMonth() === dt.date.getMonth() &&
          getDate.getDate() === dt.date.getDate()
        );
      });

      await localDb.push("/rules/blockedDates", blockedDates, true);

      await updateChatData(isExist.studentId, {
        counter: 3,
        lastMessage: new Date(),
        data: { date: getDate },
      });

      if (isExistedDate.length) {
        client.sendMessage(
          message.from,
          `هل ترغب حقا في حذف التاريخ : ${dateAnnually.format(
            getDate
          )}\n\n    ◈ *نعم* \n    ◈ *لا*`
        );
      } else {
        client.sendMessage(
          message.from,
          `التاريخ المطلوب حذفه ${dateAnnually.format(
            getDate
          )} غير موجود بقائمة التواريخ المحجوبة\n\nرجاء مراجعة القائمة للتأكد من التاريخ المطلوب حذفه أو التأكد من كتابة التاريخ بصورة سليمة`
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
              .join("\n------------\n")
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
  //
  else if (counter === 1) {
    const query = message.body.trim();
    if (/[اأإآ]ضاف[ةه]/.test(query)) {
      await updateChatData(isExist.studentId, {
        counter: 2,
        lastMessage: new Date(),

        data: { status: "add" },
      });
      client.sendMessage(message.from, `اخبرنا ما هو التاريخ المطلوب`);
      return;
    } else if (/حذف/.test(query)) {
      await updateChatData(isExist.studentId, {
        counter: 2,
        lastMessage: new Date(),

        data: { status: "remove" },
      });
      client.sendMessage(message.from, `اخبرنا ما هو التاريخ المطلوب`);
      return;
    } else {
      client.sendMessage(message.from, `لم نتمكن من الحصول على إجابة واضحة`);
      return;
    }
  }
  //
  //
  else {
    await createChatDate(isExist.studentId, {
      counter: 1,
      data: {},
      lastMessage: new Date(),
      taskSyntax: "!حجب تاريخ",
    });
    const blockedDates = await getBlockedDates();
    const array = blockedDates.length
      ? blockedDates
          .map((dateCase) => {
            return `    - *التاريخ* : ${
              dateCase.annually
                ? `${dateAnnually.format(new Date(dateCase.date))} من كل عام`
                : date.format(new Date(dateCase.date))
            }\n    - *السبب* : ${dateCase.reason}`;
          })
          .join("\n------------\n")
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
