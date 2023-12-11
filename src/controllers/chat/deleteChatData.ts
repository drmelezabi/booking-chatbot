import { chat } from "../../config/localDb";

const deleteChatData = async (accountId: string) => {
  try {
    // Save the data (useful if you disable the saveOnPush)
    await chat.save();

    // In case you have a exterior change to the databse file and want to reload it
    // use this method
    await chat.reload();

    // Deleting data
    if (await chat.exists(`/${accountId}`)) {
      await chat.delete(`/${accountId}`);
    }

    // Save the data (useful if you disable the saveOnPush)
    await chat.save();

    // In case you have a exterior change to the databse file and want to reload it
    // use this method
    await chat.reload();
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default deleteChatData;
