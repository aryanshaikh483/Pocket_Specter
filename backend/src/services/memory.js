const { Memory } = require("../db/mongo");
const { queryGroq } = require("./groq");

const getUserMemory = async (userId) => {
  try {
    const doc = await Memory.findOne({ user_id: userId });
    return doc ? doc.memory : "";
  } catch (err) {
    console.error("❌ Error fetching memory:", err.message);
    return "";
  }
};

const updateUserMemory = async (userId, conversation) => {
  try {
    const summaryPrompt =
      "Summarize the following conversation concisely " +
      "so that it can be used as context for future chats:\n" +
      conversation
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

    const summary = await queryGroq([], summaryPrompt);

    await Memory.findOneAndUpdate(
      { user_id: userId },
      { memory: summary, updated_at: new Date() },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("❌ Memory update failed:", err.message);
  }
};

module.exports = { getUserMemory, updateUserMemory };