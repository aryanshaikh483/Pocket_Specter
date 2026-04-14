const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const router   = express.Router();

const { requireUserId }  = require("../middleware/auth");
const { queryGroqWithContext } = require("../services/groq");
const {
  extractText, chunkText, retrieveChunks,
  saveChunks, loadChunks, deleteChunks,
} = require("../services/documentService");

// ─── Multer setup ─────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/octet-stream", // some browsers send this for any file
    ];
    const allowedExts = [".pdf", ".docx", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    const ok  = allowedMimes.includes(file.mimetype) || allowedExts.includes(ext);
    cb(null, ok);
  },
});

// POST /api/documents/upload
// Body: multipart — user_id, chat_session, file
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("[upload] body:", req.body);
  console.log("[upload] file:", req.file);

  const userId = req.body?.user_id;
  if (!userId) return res.status(400).json({ error: "user_id is required" });
  if (!req.file) return res.status(400).json({ error: "No valid file uploaded. Accepted: pdf, docx, txt" });

  const { chat_session = 0 } = req.body;
  // Use originalname extension to determine type when mime is unreliable
  const ext      = path.extname(req.file.originalname).toLowerCase();
  const mimeType = req.file.mimetype === "application/octet-stream"
    ? (ext === ".pdf" ? "application/pdf"
      : ext === ".docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "text/plain")
    : req.file.mimetype;

  const { path: tmpPath, originalname } = req.file;

  try {
    const text   = await extractText(tmpPath, mimeType);
    const chunks = chunkText(text, originalname);
    saveChunks(userId, chat_session, chunks, originalname);
    console.log(`[upload] OK — ${originalname}, ${chunks.length} chunks`);
    return res.json({ status: "ok", filename: originalname, chunks: chunks.length });
  } catch (err) {
    console.error("[upload] ERROR:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    fs.unlink(tmpPath, () => {});
  }
});

// POST /api/documents/query
// Body: { user_id, chat_session, question }
router.post("/query", requireUserId, async (req, res) => {
  const { chat_session = 0, question } = req.body;
  if (!question) return res.status(400).json({ error: "question is required" });

  const { chunks } = loadChunks(req.userId, chat_session);
  if (!chunks.length) return res.status(404).json({ error: "No documents uploaded for this session" });

  const topChunks = retrieveChunks(question, chunks);

  try {
    const result = await queryGroqWithContext(question, topChunks);
    return res.json({
      answer:      result.answer,
      rag_used:    result.rag_used,
      chunks_used: result.chunks_used,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/documents/list?user_id=&chat_session=
router.get("/list", async (req, res) => {
  const { user_id, chat_session = 0 } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id is required" });
  const { files } = loadChunks(user_id, chat_session);
  return res.json({ files });
});

// DELETE /api/documents
// Body: { user_id, chat_session }
router.delete("/", requireUserId, (req, res) => {
  const { chat_session = 0 } = req.body;
  deleteChunks(req.userId, chat_session);
  return res.json({ status: "ok" });
});

module.exports = router;
