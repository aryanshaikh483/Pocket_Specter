const { Chat } = require("../db/mongo");

const getUserChats = async (userId) => {
  const sessions = await Chat.distinct("chat_session", { user_id: userId });
  return sessions
    .filter((s) => typeof s === "number")
    .sort((a, b) => a - b);
};

const loadChatSession = async (userId, chatSession) => {
  const docs = await Chat.find(
    { user_id: userId, chat_session: Number(chatSession) },
    { _id: 0, role: 1, content: 1 }
  ).sort({ created_at: 1 });

  return docs.map((doc) => ({ role: doc.role, content: doc.content }));
};

const saveMessage = async (userId, chatSession, role, content) => {
  await Chat.create({
    user_id:      userId,
    chat_session: Number(chatSession),
    role,
    content,
    created_at:   new Date(),
  });
};

const deleteChatSession = async (userId, chatSession) => {
  await Chat.deleteMany({
    user_id:      userId,
    chat_session: Number(chatSession),
  });
};

module.exports = { getUserChats, loadChatSession, saveMessage, deleteChatSession };
