const fs   = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data/documents");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/* ───────────────── STOPWORDS ───────────────── */

const STOPWORDS = new Set([
  "the","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","shall",
  "a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","up","about","into","through","during","before","after","above",
  "below","between","out","off","over","under","again","then","once","that",
  "this","these","those","it","its","as","if","so","than","too","very",
  "just","not","no","nor","yet","both","either","each","few","more","most",
  "other","some","such","only","own","same","also","i","you","he","she",
  "we","they","what","which","who","whom","how","when","where","why",
]);

/* ───────────────── OCR FALLBACK ───────────────── */

async function extractWithOCR(filePath) {
  try {
    console.log("🔍 Running OCR on:", filePath);
    const Tesseract = require("tesseract.js");
    const result    = await Tesseract.recognize(filePath, "eng");
    console.log("OCR text length:", result.data.text.length);
    return result.data.text;
  } catch (err) {
    console.error("OCR failed:", err.message);
    return "";
  }
}

/* ───────────────── PDF EXTRACTION ───────────────── */

async function extractPDFText(filePath) {
  try {
    const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";

    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf  = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;

    console.log("📄 PDF pages:", pdf.numPages);

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    console.log("PDF text length:", text.trim().length);

    if (text.trim().length < 50) {
      console.log("⚠️ Empty PDF text, switching to OCR...");
      return await extractWithOCR(filePath);
    }

    return text;
  } catch (err) {
    console.log("⚠️ PDF parse failed, using OCR:", err.message);
    return await extractWithOCR(filePath);
  }
}

/* ───────────────── TEXT EXTRACTION ───────────────── */

async function extractText(filePath, mimeType) {
  console.log(`[extract] path=${filePath} mime=${mimeType} exists=${fs.existsSync(filePath)}`);

  const isPdf  = mimeType === "application/pdf" || filePath.endsWith(".pdf");
  const isDocx = mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              || filePath.endsWith(".docx");

  if (isPdf) {
    return await extractPDFText(filePath);
  }

  if (isDocx) {
    const mammoth = require("mammoth");
    const result  = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  return fs.readFileSync(filePath, "utf-8");
}

/* ───────────────── CHUNKING ───────────────── */

function chunkText(text, source = "unknown", chunkSize = 1000, overlap = 150) {
  const sentences = text
    .replace(/\r\n/g, "\n")
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const chunks = [];
  let buffer = [];
  let wordCount = 0;
  let chunkIdx = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    buffer.push(sentence);
    wordCount += words.length;

    if (wordCount >= chunkSize) {
      chunks.push({
        text: buffer.join(" "),
        source,
        chunkId: `${source}_chunk_${chunkIdx++}`,
        createdAt: Date.now(),
      });

      // overlap logic
      let overlapWords = [];
      let overlapCount = 0;

      for (let i = buffer.length - 1; i >= 0 && overlapCount < overlap; i--) {
        overlapWords.unshift(buffer[i]);
        overlapCount += buffer[i].split(/\s+/).length;
      }

      buffer = overlapWords;
      wordCount = overlapCount;
    }
  }

  if (buffer.length) {
    chunks.push({
      text: buffer.join(" "),
      source,
      chunkId: `${source}_chunk_${chunkIdx}`,
      createdAt: Date.now(),
    });
  }

  console.log("🧩 Chunks created:", chunks.length);

  return chunks;
}

/* ───────────────── TOKENIZATION ───────────────── */

function tokenize(text) {
  return (text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [])
    .filter(t => !STOPWORDS.has(t));
}

/* ───────────────── TF-IDF ───────────────── */

function buildTfVector(tokens) {
  const freq = {};
  const total = tokens.length || 1;

  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;

  Object.keys(freq).forEach(k => freq[k] /= total);
  return freq;
}

function computeIDF(chunks) {
  const docCount = chunks.length || 1;
  const df = {};

  chunks.forEach(chunk => {
    const tokens = new Set(tokenize(chunk.text));
    tokens.forEach(t => df[t] = (df[t] || 0) + 1);
  });

  const idf = {};
  Object.keys(df).forEach(t => {
    idf[t] = Math.log((docCount + 1) / (df[t] + 1)) + 1;
  });

  return idf;
}

function buildTfIdfVector(tokens, idf) {
  const tf = buildTfVector(tokens);
  const tfidf = {};

  Object.keys(tf).forEach(k => {
    tfidf[k] = tf[k] * (idf[k] || 0);
  });

  return tfidf;
}

/* ───────────────── COSINE SIMILARITY ───────────────── */

function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;

  for (const k of keys) {
    const a = vecA[k] || 0;
    const b = vecB[k] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

/* ───────────────── RETRIEVAL (HYBRID) ───────────────── */

function retrieveChunks(query, chunks, topK = 5) {
  if (!chunks.length) return [];

  const idf = computeIDF(chunks);
  const qTokens = tokenize(query);
  const qVec = buildTfIdfVector(qTokens, idf);
  const qKeywords = new Set(qTokens);

  const scored = chunks.map(chunk => {
    const cTokens = tokenize(chunk.text);
    const cVec = buildTfIdfVector(cTokens, idf);

    const semantic = cosineSimilarity(qVec, cVec);

    const cSet = new Set(cTokens);
    const boost = qKeywords.size
      ? [...qKeywords].filter(t => cSet.has(t)).length / qKeywords.size
      : 0;

    return { chunk, score: semantic * 0.7 + boost * 0.3 };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(r => r.score > 0)
    .map(r => ({
      text: r.chunk.text,
      source: r.chunk.source,
      id: r.chunk.chunkId,
    }));
}

/* ───────────────── STORAGE ───────────────── */

function docKey(userId, chatSession) {
  return path.join(DATA_DIR, `${userId}_${chatSession}.json`);
}

function saveChunks(userId, chatSession, chunks, filename) {
  const existing = loadChunks(userId, chatSession);

  const updated = {
    files: [...new Set([...(existing.files || []), filename])],
    chunks: [...(existing.chunks || []), ...chunks],
  };

  fs.writeFileSync(docKey(userId, chatSession), JSON.stringify(updated));
}

function loadChunks(userId, chatSession) {
  const file = docKey(userId, chatSession);

  if (!fs.existsSync(file)) return { files: [], chunks: [] };

  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return { files: [], chunks: [] };
  }
}

function deleteChunks(userId, chatSession) {
  const file = docKey(userId, chatSession);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

/* ───────────────── EXPORTS ───────────────── */

module.exports = {
  extractText,
  chunkText,
  retrieveChunks,
  saveChunks,
  loadChunks,
  deleteChunks,
};