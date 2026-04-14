const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");

const { checkQuickResponse, checkDocQuickResponse, queryGroq, queryGroqWithContext } = require("../services/groq");
const { getUserMemory, updateUserMemory } = require("../services/memory");
const {
  getUserChats,
  loadChatSession,
  saveMessage,
  deleteChatSession,
} = require("../utils/helpers");
const { requireUserId } = require("../middleware/auth");
const {
  extractText,
  chunkText,
  retrieveChunks,
  saveChunks,
  loadChunks,
  deleteChunks,
} = require("../services/documentService");

// ─── Multer Setup ─────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename:    (_, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_, file, cb) => {
    const allowed = [".pdf", ".txt", ".docx", ".md"];
    const ext     = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext)
      ? cb(null, true)
      : cb(new Error(`Unsupported file type: ${ext}`));
  },
});

// ─── POST /api/upload_document ────────────────────────────────────────────────

router.post(
  "/upload_document",
  requireUserId,
  upload.single("document"),
  async (req, res) => {
    try {
      const { chat_session = 0 } = req.body;
      const userId = req.userId;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { path: filePath, mimetype, originalname } = req.file;

      // Extract → chunk → index
      const rawText = await extractText(filePath, mimetype);
      if (!rawText.trim()) {
        fs.unlinkSync(filePath);
        return res.status(422).json({ error: "Could not extract text from file" });
      }

      const chunks = chunkText(rawText, 500, 50);
      saveChunks(userId, chat_session, chunks, originalname);

      // Clean up the temp upload
      fs.unlinkSync(filePath);

      return res.json({
        status:       "ok",
        filename:     originalname,
        chunks_added: chunks.length,
        message:      `Document indexed — ${chunks.length} chunks stored. You can now ask questions about it.`,
      });
    } catch (err) {
      console.error("❌ /api/upload_document error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

// ─── GET /api/session_documents ───────────────────────────────────────────────

router.get("/session_documents", requireUserId, async (req, res) => {
  try {
    const { chat_session = 0 } = req.query;
    const { files } = loadChunks(req.userId, chat_session);
    return res.json({ status: "ok", documents: files });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/chat ───────────────────────────────────────────────────────────

router.post("/chat", requireUserId, async (req, res) => {
  try {
    const { chat_session = 0, message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // Quick intent check
    const quick = checkQuickResponse(message);
    if (quick) {
      await saveMessage(userId, chat_session, "user", message);
      await saveMessage(userId, chat_session, "assistant", quick);
      return res.json({ reply: quick, chat_session });
    }

    await saveMessage(userId, chat_session, "user", message);

    const conversation = await loadChatSession(userId, chat_session);
    const memoryText   = await getUserMemory(userId);

    // ── RAG: inject relevant document chunks if any exist ──
    const { chunks, files } = loadChunks(userId, chat_session);

    if (chunks.length > 0) {
      // Quick response for greetings/meta questions about the doc
      const docQuick = checkDocQuickResponse(message, files);
      if (docQuick) {
        await saveMessage(userId, chat_session, "assistant", docQuick);
        return res.json({ reply: docQuick, chat_session, rag_used: false });
      }

      const relevant = retrieveChunks(message, chunks, 4);
      const result   = await queryGroqWithContext(message, relevant);
      await saveMessage(userId, chat_session, "assistant", result.answer);
      updateUserMemory(userId, [
        ...conversation,
        { role: "user", content: message },
        { role: "assistant", content: result.answer },
      ]);
      return res.json({ reply: result.answer, chat_session, rag_used: result.rag_used });
    }

    // ── Normal chat (no documents) ──
    const answer = await queryGroq(conversation, message, memoryText);

    await saveMessage(userId, chat_session, "assistant", answer);

    const fullConversation = [
      ...conversation,
      { role: "user",      content: message },
      { role: "assistant", content: answer  },
    ];
    updateUserMemory(userId, fullConversation);

    return res.json({
      reply:        answer,
      chat_session,
      rag_used:     false,
    });
  } catch (err) {
    console.error("❌ /api/chat error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/delete_chat  (extended to clean up docs too) ───────────────────

router.post("/delete_chat", requireUserId, async (req, res) => {
  try {
    const { chat_session } = req.body;
    await deleteChatSession(req.userId, chat_session);
    deleteChunks(req.userId, chat_session);      // ← also wipe indexed docs
    return res.json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── Remaining unchanged routes ───────────────────────────────────────────────

router.post("/new_chat", requireUserId, async (req, res) => {
  try {
    const sessions   = await getUserChats(req.userId);
    const newSession = sessions.length > 0 ? Math.max(...sessions) + 1 : 1;
    return res.json({ status: "ok", chat_session: newSession });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/load_chat", requireUserId, async (req, res) => {
  try {
    const { chat_session } = req.body;
    const chat = await loadChatSession(req.userId, chat_session);
    return res.json({ status: "ok", chat });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/user_chats/:user_id", async (req, res) => {
  try {
    const sessions = await getUserChats(req.params.user_id);
    return res.json({ status: "ok", chat_sessions: sessions });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;