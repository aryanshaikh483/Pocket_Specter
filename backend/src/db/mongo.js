const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Chat message schema
const chatSchema = new mongoose.Schema({
  user_id:      { type: String, required: true, index: true },
  chat_session: { type: Number, required: true, index: true },
  role:         { type: String, enum: ["user", "assistant"], required: true },
  content:      { type: String, required: true },
  created_at:   { type: Date, default: Date.now },
});

chatSchema.index({ user_id: 1, chat_session: 1, created_at: 1 });

// Memory schema
const memorySchema = new mongoose.Schema({
  user_id:    { type: String, required: true, unique: true },
  memory:     { type: String, default: "" },
  updated_at: { type: Date, default: Date.now },
});

const Chat   = mongoose.model("Chat", chatSchema);
const Memory = mongoose.model("Memory", memorySchema);

module.exports = { connectDB: connectDB, Chat, Memory };
