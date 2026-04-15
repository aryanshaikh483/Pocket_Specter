

// const axios = require("axios");
// const { buildLawyerSuggestionBlock } = require("./lawyerConnect");

// // ─── Domain Definitions ───────────────────────────────────────────────────────

// const LEGAL_DOMAINS = {
//   criminal_law: {
//     label: "Criminal Law",
//     keywords: [
//       "fir", "police", "arrest", "crime", "murder", "theft", "assault",
//       "bail", "custody", "prison", "jail", "bns", "ipc", "bnss", "crpc",
//       "cognizable", "warrant", "chargesheet", "accused", "offence", "criminal"
//     ],
//     context: "Criminal Law → BNS 2023 (replaces IPC), BNSS 2023 (replaces CrPC). Consider FIR, bail, and trial remedies.",
//   },

//   corporate_law: {
//     label: "Corporate & Commercial Law",
//     keywords: [
//       "company", "business", "fraud", "contract", "agreement", "invoice",
//       "payment", "money", "loan", "debt", "cheque", "bounce", "partner",
//       "startup", "shares", "directors", "incorporation", "gst", "tax",
//       "mou", "vendor", "client", "breach", "refund", "consumer"
//     ],
//     context: "Corporate/Commercial Law → Companies Act 2013, Contract Act 1872, Consumer Protection Act 2019, Negotiable Instruments Act (cheque bounce → Section 138 NIA).",
//   },

//   family_law: {
//     label: "Family Law",
//     keywords: [
//       "marriage", "divorce", "husband", "wife", "spouse", "alimony",
//       "maintenance", "matrimonial", "separation", "annulment", "restitution",
//       "conjugal", "in-laws", "wedding", "nikah", "talaq", "mutual consent"
//     ],
//     context: "Family Law → Hindu Marriage Act / Muslim Personal Law / Special Marriage Act. Consider divorce grounds, maintenance under Section 125 CrPC / BNSS, and matrimonial home rights.",
//   },

//   womens_law: {
//     label: "Women's Rights & Protection Law",
//     keywords: [
//       "harassment", "sexual harassment", "posh", "domestic violence",
//       "dowry", "dowry death", "stalking", "eve teasing", "rape",
//       "molestation", "acid attack", "women", "woman", "female",
//       "modesty", "outraging", "workplace harassment", "metoo"
//     ],
//     context: "Women's Law → Protection of Women from Domestic Violence Act 2005, Dowry Prohibition Act 1961, POSH Act 2013, BNS 2023 (sexual offences). Consider protection orders and compensation.",
//   },

//   childrens_law: {
//     label: "Children's Rights & Juvenile Law",
//     keywords: [
//       "child", "minor", "juvenile", "custody", "guardianship", "adoption",
//       "pocso", "child abuse", "child labour", "jjb", "juvenile justice",
//       "child support", "cruelty to child", "trafficking", "orphan", "foster"
//     ],
//     context: "Children's Law → POCSO Act 2012, Juvenile Justice Act 2015, Guardian and Wards Act 1890, Child Labour (Prohibition) Act. Consider child's best interest principle.",
//   },

//   employment_law: {
//     label: "Employment & Labour Law",
//     keywords: [
//       "job", "salary", "employer", "employee", "fired", "termination",
//       "notice period", "pf", "provident fund", "esi", "gratuity",
//       "workplace", "labour", "labor", "overtime", "leave", "resignation",
//       "wrongful termination", "offer letter", "appointment", "payslip",
//       "bonus", "retrenchment", "layoff", "hr", "increment"
//     ],
//     context: "Employment Law → Industrial Disputes Act 1947, Payment of Wages Act, Shops & Establishments Act, Code on Wages 2019, PF & ESI Acts. Consider labour court remedies.",
//   },

//   property_law: {
//     label: "Property & Real Estate Law",
//     keywords: [
//       "property", "land", "plot", "flat", "house", "rent", "tenant",
//       "landlord", "ownership", "title", "registry", "encroachment",
//       "trespass", "eviction", "lease", "possession", "builder", "rera",
//       "benami", "inheritance", "will", "succession", "mutation", "stamp duty"
//     ],
//     context: "Property Law → Transfer of Property Act 1882, RERA 2016, Rent Control Acts (state-specific), Registration Act 1908, Succession Act. Consider civil suit for possession/injunction.",
//   },

//   general_law: {
//     label: "General Legal Issue",
//     keywords: [],
//     context: "General legal issue — apply broad Indian legal principles. Identify if civil or criminal in nature before advising.",
//   },
// };

// // ─── Domain Classifier ────────────────────────────────────────────────────────

// const detectLegalDomains = (message) => {
//   const text = message.toLowerCase();

//   const scores = Object.entries(LEGAL_DOMAINS)
//     .filter(([key]) => key !== "general_law")
//     .map(([key, domain]) => ({
//       key,
//       label:   domain.label,
//       context: domain.context,
//       score:   domain.keywords.filter((kw) => text.includes(kw)).length,
//     }))
//     .filter((d) => d.score > 0)
//     .sort((a, b) => b.score - a.score);

//   if (scores.length === 0) {
//     return [{ key: "general_law", ...LEGAL_DOMAINS.general_law, score: 0 }];
//   }

//   return scores;
// };

// const buildDomainContext = (domains) => {
//   if (domains.length === 1) {
//     return `Detected Legal Domain: ${domains[0].label}\nContext: ${domains[0].context}`;
//   }

//   const primary   = domains[0];
//   const secondary = domains.slice(1).map((d) => `  • ${d.label}`).join("\n");

//   return [
//     `Primary Legal Domain: ${primary.label}`,
//     `Context: ${primary.context}`,
//     `Also touches on:`,
//     secondary,
//   ].join("\n");
// };

// // ─── System Prompt ────────────────────────────────────────────────────────────

// const BASE_PERSONALITY_PROMPT = `
// You are Pocket Specter, an AI legal assistant for Indian law.

// Your job is to give clear, accurate, practical, and complete legal guidance.

// ========================
// 🧠 THINKING RULES (IMPORTANT)
// ========================
// Before answering, internally determine:
// - Type of issue (civil / criminal / constitutional / mixed)
// - All possible legal remedies (not just one)

// Apply MULTI-ANGLE reasoning:
// - Money disputes → Civil recovery + possible criminal cheating
// - Harassment → Criminal law + IT Act
// - Employment → Labour law + contract law
// - Property → Civil + criminal trespass (if applicable)

// ========================
// ⚖️ LAW PRIORITY (CRITICAL)
// ========================
// Always prioritize the latest Indian laws:

// - Bharatiya Nyaya Sanhita (BNS 2023)
// - Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)

// Mapping:
// - IPC → BNS
// - CrPC → BNSS

// Do not treat every dispute as a criminal offence.

// Clearly distinguish:
// - Civil wrong (default)
// - Criminal offence (only if intent or fraud exists)

// ========================
// 📌 SECTION CITATION RULE
// ========================
// - Include section numbers ONLY if highly confident
// - Format: "Section X, BNS 2023"
// - If NOT sure → say "relevant provisions under BNS 2023"
// - You may optionally mention "(earlier IPC Section 420)" if helpful

// Golden Rule: Wrong section ❌ > No section ✅

// ========================
// 🚫 SAFETY RULES
// ========================
// - Do NOT assist with illegal activities
// - Do NOT hallucinate laws
// - If unsure → say "This depends on specific facts"

// ========================
// ⚖️ RESPONSE STRUCTURE (MARKDOWN FORMAT — STRICTLY FOLLOW)
// ========================
// Always format your response using proper markdown:

// ## ⚡ Direct Answer
// Short, plain-language answer in 1–2 sentences.

// ## ⚖️ Legal Explanation
// Detailed legal reasoning with relevant acts and sections.

// ## 📌 Practical Meaning
// What this means in real life for the user.

// ## ⚠️ Risks & Warnings
// Consequences, risks, or things to watch out for.

// ## ✅ Advice
// Actionable steps the user should take. Use a numbered list.

// Rules:
// - Use ## for all section headings (never ** for headings)
// - Use **bold** only for key legal terms or act names within paragraphs
// - Use numbered lists for steps
// - Never collapse all sections into one paragraph
// ========================
// `;

// // ─── Intent Detection (Main Chat) ─────────────────────────────────────────────

// const GREETING_KEYWORDS = ["hi", "hello", "hey", "hii", "heyy"];
// const THANKS_KEYWORDS   = ["thanks", "thank you", "thx"];

// const checkQuickResponse = (message) => {
//   const text = message.trim().toLowerCase();

//   if (GREETING_KEYWORDS.some((w) => text.includes(w)) && text.length <= 20) {
//     return "Hello. How can I help you with Indian law?";
//   }

//   if (THANKS_KEYWORDS.some((w) => text.includes(w))) {
//     return "You're welcome. Let me know if you need anything else.";
//   }

//   return null;
// };

// // ─── Intent Detection (Document Q&A) ─────────────────────────────────────────

// const DOC_GREETINGS = ["hi", "hello", "hey", "hii", "heyy"];
// const DOC_THANKS    = ["thanks", "thank you", "thx"];
// const DOC_META      = [
//   "what is this", "what document", "what file",
//   "what did i upload", "what's in this", "whats in this",
//   "what have i uploaded", "which file", "which document"
// ];

// const checkDocQuickResponse = (message, uploadedFiles = []) => {
//   const text = message.trim().toLowerCase();

//   // Greeting
//   if (DOC_GREETINGS.some((w) => text.includes(w)) && text.length <= 20) {
//     return "Hello! I have access to your uploaded document. Ask me anything about it.";
//   }

//   // Thanks
//   if (DOC_THANKS.some((w) => text.includes(w))) {
//     return "You're welcome! Feel free to ask more questions about the document.";
//   }

//   // Meta — "what did I upload?"
//   if (DOC_META.some((w) => text.includes(w))) {
//     if (uploadedFiles.length > 0) {
//       const fileList = uploadedFiles.map((f, i) => `${i + 1}. ${f}`).join("\n");
//       return `You have uploaded the following document(s):\n\n${fileList}\n\nAsk me any questions about them.`;
//     }
//     return "You haven't uploaded any documents yet. Please upload a PDF, DOCX, or TXT file to get started.";
//   }

//   return null; // not a quick response — proceed to RAG
// };

// // ─── Safety Filter ────────────────────────────────────────────────────────────

// const ILLEGAL_KEYWORDS = [
//   "escape police", "avoid law", "how to hack",
//   "kill", "drugs", "bypass law", "illegal way",
// ];

// const isIllegalQuery = (msg) =>
//   ILLEGAL_KEYWORDS.some((k) => msg.toLowerCase().includes(k));

// // ─── Latest Law Enforcement ───────────────────────────────────────────────────

// const enforceLatestLawContext = (msg) => `${msg}

// IMPORTANT:
// - Use BNS 2023 instead of IPC
// - Use BNSS 2023 instead of CrPC
// - Mention section numbers ONLY if certain
// `;

// // ─── Main Chat Query ──────────────────────────────────────────────────────────

// const queryGroq = async (conversation, userMessage, memoryText = "", ragContext = "") => {
//   if (isIllegalQuery(userMessage)) {
//     return "I cannot assist with illegal activities. I can help you understand legal consequences or lawful alternatives.";
//   }

//   const domains       = detectLegalDomains(userMessage);
//   const domainContext = buildDomainContext(domains);

//   const systemPrompt = [
//     BASE_PERSONALITY_PROMPT,
//     domainContext,
//     memoryText ? `User memory:\n${memoryText}` : "",
//     ragContext  ? ragContext                     : "",
//   ]
//     .filter(Boolean)
//     .join("\n\n");

//   const messages = [
//     { role: "system", content: systemPrompt },
//     ...conversation,
//     { role: "user", content: enforceLatestLawContext(userMessage) },
//   ];

//   try {
//     const response = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model:       "llama-3.3-70b-versatile",
//         messages,
//         temperature: 0.2,
//         max_tokens:  1024,
//       },
//       {
//         headers: {
//           Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("❌ Groq API error:", err.message);
//     throw new Error(`Groq API error: ${err.message}`);
//   }
// };

// // ─── Document Q&A (Context + Knowledge Hybrid) ───────────────────────────────

// const queryGroqWithContext = async (question, contextChunks) => {
//   const hasContext = contextChunks.length > 0;

//   const context = hasContext
//     ? contextChunks
//         .map((c, i) => `[Source ${i + 1} | ${c.source}]:\n${c.text}`)
//         .join("\n\n")
//     : null;

//   console.log(`📄 RAG mode: ${hasContext ? `${contextChunks.length} chunks found` : "no chunks — falling back to general law"}`);
//   if (hasContext) console.log("Context preview:", context.slice(0, 300));

//   const messages = hasContext
//     ? [
//         {
//           role: "system",
//           content: `You are Pocket Specter, an AI legal assistant for Indian law.

// You have been given excerpts from a document uploaded by the user.

// ## Your job:
// 1. First answer using the document context (cite [Source N] where relevant)
// 2. Then add relevant general Indian legal explanation if it adds value

// ## Format your response as:

// ## 📄 From the Document
// What the document says about this topic (cite sources).

// ## ⚖️ Legal Perspective
// General Indian law that applies — acts, remedies, implications.

// ## ✅ What You Can Do
// Practical actionable steps the user can take.

// ## Rules:
// - Use ## for all section headings
// - Use **bold** for key legal terms and act names
// - Use numbered or bullet lists for steps
// - If the document does not mention the topic, say so briefly, then proceed to legal explanation
// - Never make up facts from the document
// - Use BNS 2023 instead of IPC, BNSS 2023 instead of CrPC`,
//         },
//         {
//           role: "user",
//           content: `Document Context:\n${context}\n\nQuestion: ${question}`,
//         },
//       ]
//     : [
//         {
//           role: "system",
//           content: `You are Pocket Specter, an AI legal assistant for Indian law.

// The uploaded document does not contain information relevant to this question.
// Provide a helpful general legal answer based on Indian law.

// ## Format your response as:

// ## 📋 General Legal Answer
// Clear explanation of the relevant law.

// ## ⚖️ Applicable Laws & Acts
// List the relevant Indian acts, sections, or remedies.

// ## ✅ What You Can Do
// Practical steps the user can take.

// ## Rules:
// - Use ## for all section headings
// - Use **bold** for key legal terms and act names
// - Use BNS 2023 instead of IPC, BNSS 2023 instead of CrPC
// - Mention section numbers ONLY if highly confident
// - Never say "I couldn't find information" — always provide value`,
//         },
//         {
//           role: "user",
//           content: question,
//         },
//       ];

//   try {
//     const response = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model:       "llama-3.3-70b-versatile",
//         messages,
//         temperature: 0.2,
//         max_tokens:  1024,
//       },
//       {
//         headers: {
//           Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       answer:      response.data.choices[0].message.content.trim(),
//       rag_used:    hasContext,
//       chunks_used: contextChunks.length,
//     };
//   } catch (err) {
//     console.error("❌ Groq Document QA error:", err.message);
//     throw new Error(`Groq API error: ${err.message}`);
//   }
// };

// // ─── Exports ──────────────────────────────────────────────────────────────────

// module.exports = {
//   checkQuickResponse,
//   checkDocQuickResponse,
//   queryGroq,
//   queryGroqWithContext,
//   detectLegalDomains,
// };

const axios = require("axios");
const { buildLawyerSuggestionBlock } = require("./lawyerConnect");

// ─── Domain Definitions ───────────────────────────────────────────────────────

const LEGAL_DOMAINS = {
  criminal_law: {
    label: "Criminal Law",
    keywords: [
      "fir", "police", "arrest", "crime", "murder", "theft", "assault",
      "bail", "custody", "prison", "jail", "bns", "ipc", "bnss", "crpc",
      "cognizable", "warrant", "chargesheet", "accused", "offence", "criminal"
    ],
    context: "Criminal Law → BNS 2023 (replaces IPC), BNSS 2023 (replaces CrPC). Consider FIR, bail, and trial remedies.",
  },

  corporate_law: {
    label: "Corporate & Commercial Law",
    keywords: [
      "company", "business", "fraud", "contract", "agreement", "invoice",
      "payment", "money", "loan", "debt", "cheque", "bounce", "partner",
      "startup", "shares", "directors", "incorporation", "gst", "tax",
      "mou", "vendor", "client", "breach", "refund", "consumer"
    ],
    context: "Corporate/Commercial Law → Companies Act 2013, Contract Act 1872, Consumer Protection Act 2019, Negotiable Instruments Act (cheque bounce → Section 138 NIA).",
  },

  family_law: {
    label: "Family Law",
    keywords: [
      "marriage", "divorce", "husband", "wife", "spouse", "alimony",
      "maintenance", "matrimonial", "separation", "annulment", "restitution",
      "conjugal", "in-laws", "wedding", "nikah", "talaq", "mutual consent"
    ],
    context: "Family Law → Hindu Marriage Act / Muslim Personal Law / Special Marriage Act. Consider divorce grounds, maintenance under Section 125 CrPC / BNSS, and matrimonial home rights.",
  },

  womens_law: {
    label: "Women's Rights & Protection Law",
    keywords: [
      "harassment", "sexual harassment", "posh", "domestic violence",
      "dowry", "dowry death", "stalking", "eve teasing", "rape",
      "molestation", "acid attack", "women", "woman", "female",
      "modesty", "outraging", "workplace harassment", "metoo"
    ],
    context: "Women's Law → Protection of Women from Domestic Violence Act 2005, Dowry Prohibition Act 1961, POSH Act 2013, BNS 2023 (sexual offences). Consider protection orders and compensation.",
  },

  childrens_law: {
    label: "Children's Rights & Juvenile Law",
    keywords: [
      "child", "minor", "juvenile", "custody", "guardianship", "adoption",
      "pocso", "child abuse", "child labour", "jjb", "juvenile justice",
      "child support", "cruelty to child", "trafficking", "orphan", "foster"
    ],
    context: "Children's Law → POCSO Act 2012, Juvenile Justice Act 2015, Guardian and Wards Act 1890, Child Labour (Prohibition) Act. Consider child's best interest principle.",
  },

  employment_law: {
    label: "Employment & Labour Law",
    keywords: [
      "job", "salary", "employer", "employee", "fired", "termination",
      "notice period", "pf", "provident fund", "esi", "gratuity",
      "workplace", "labour", "labor", "overtime", "leave", "resignation",
      "wrongful termination", "offer letter", "appointment", "payslip",
      "bonus", "retrenchment", "layoff", "hr", "increment"
    ],
    context: "Employment Law → Industrial Disputes Act 1947, Payment of Wages Act, Shops & Establishments Act, Code on Wages 2019, PF & ESI Acts. Consider labour court remedies.",
  },

  property_law: {
    label: "Property & Real Estate Law",
    keywords: [
      "property", "land", "plot", "flat", "house", "rent", "tenant",
      "landlord", "ownership", "title", "registry", "encroachment",
      "trespass", "eviction", "lease", "possession", "builder", "rera",
      "benami", "inheritance", "will", "succession", "mutation", "stamp duty"
    ],
    context: "Property Law → Transfer of Property Act 1882, RERA 2016, Rent Control Acts (state-specific), Registration Act 1908, Succession Act. Consider civil suit for possession/injunction.",
  },

  general_law: {
    label: "General Legal Issue",
    keywords: [],
    context: "General legal issue — apply broad Indian legal principles. Identify if civil or criminal in nature before advising.",
  },
};

// ─── Domain Classifier ────────────────────────────────────────────────────────

const detectLegalDomains = (message) => {
  const text = message.toLowerCase();

  const scores = Object.entries(LEGAL_DOMAINS)
    .filter(([key]) => key !== "general_law")
    .map(([key, domain]) => ({
      key,
      label:   domain.label,
      context: domain.context,
      score:   domain.keywords.filter((kw) => text.includes(kw)).length,
    }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scores.length === 0) {
    return [{ key: "general_law", ...LEGAL_DOMAINS.general_law, score: 0 }];
  }

  return scores;
};

const buildDomainContext = (domains) => {
  if (domains.length === 1) {
    return `Detected Legal Domain: ${domains[0].label}\nContext: ${domains[0].context}`;
  }

  const primary   = domains[0];
  const secondary = domains.slice(1).map((d) => `  • ${d.label}`).join("\n");

  return [
    `Primary Legal Domain: ${primary.label}`,
    `Context: ${primary.context}`,
    `Also touches on:`,
    secondary,
  ].join("\n");
};

// ─── System Prompt ────────────────────────────────────────────────────────────

const BASE_PERSONALITY_PROMPT = `
You are Pocket Specter, an AI legal assistant for Indian law.

Your job is to give clear, accurate, practical, and complete legal guidance.

========================
🧠 THINKING RULES (IMPORTANT)
========================
Before answering, internally determine:
- Type of issue (civil / criminal / constitutional / mixed)
- All possible legal remedies (not just one)

Apply MULTI-ANGLE reasoning:
- Money disputes → Civil recovery + possible criminal cheating
- Harassment → Criminal law + IT Act
- Employment → Labour law + contract law
- Property → Civil + criminal trespass (if applicable)

========================
⚖️ LAW PRIORITY (CRITICAL)
========================
Always prioritize the latest Indian laws:

- Bharatiya Nyaya Sanhita (BNS 2023)
- Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)

Mapping:
- IPC → BNS
- CrPC → BNSS

Do not treat every dispute as a criminal offence.

Clearly distinguish:
- Civil wrong (default)
- Criminal offence (only if intent or fraud exists)

========================
📌 SECTION CITATION RULE
========================
- Include section numbers ONLY if highly confident
- Format: "Section X, BNS 2023"
- If NOT sure → say "relevant provisions under BNS 2023"
- You may optionally mention "(earlier IPC Section 420)" if helpful

Golden Rule: Wrong section ❌ > No section ✅

========================
🚫 SAFETY RULES
========================
- Do NOT assist with illegal activities
- Do NOT hallucinate laws
- If unsure → say "This depends on specific facts"

========================
⚖️ RESPONSE STRUCTURE (MARKDOWN FORMAT — STRICTLY FOLLOW)
========================
Always format your response using proper markdown:

## ⚡ Direct Answer
Short, plain-language answer in 1–2 sentences.

## ⚖️ Legal Explanation
Detailed legal reasoning with relevant acts and sections.

## 📌 Practical Meaning
What this means in real life for the user.

## ⚠️ Risks & Warnings
Consequences, risks, or things to watch out for.

## ✅ Advice
Actionable steps the user should take. Use a numbered list.

Rules:
- Use ## for all section headings (never ** for headings)
- Use **bold** only for key legal terms or act names within paragraphs
- Use numbered lists for steps
- Never collapse all sections into one paragraph
========================
`;

// ─── Intent Detection (Main Chat) ─────────────────────────────────────────────

const GREETING_KEYWORDS = ["hi", "hello", "hey", "hii", "heyy"];
const THANKS_KEYWORDS   = ["thanks", "thank you", "thx"];

const checkQuickResponse = (message) => {
  const text = message.trim().toLowerCase();

  if (GREETING_KEYWORDS.some((w) => text.includes(w)) && text.length <= 20) {
    return "Hello. How can I help you with Indian law?";
  }

  if (THANKS_KEYWORDS.some((w) => text.includes(w))) {
    return "You're welcome. Let me know if you need anything else.";
  }

  return null;
};

// ─── Intent Detection (Document Q&A) ─────────────────────────────────────────

const DOC_GREETINGS = ["hi", "hello", "hey", "hii", "heyy"];
const DOC_THANKS    = ["thanks", "thank you", "thx"];
const DOC_META      = [
  "what is this", "what document", "what file",
  "what did i upload", "what's in this", "whats in this",
  "what have i uploaded", "which file", "which document"
];

const checkDocQuickResponse = (message, uploadedFiles = []) => {
  const text = message.trim().toLowerCase();

  if (DOC_GREETINGS.some((w) => text.includes(w)) && text.length <= 20) {
    return "Hello! I have access to your uploaded document. Ask me anything about it.";
  }

  if (DOC_THANKS.some((w) => text.includes(w))) {
    return "You're welcome! Feel free to ask more questions about the document.";
  }

  if (DOC_META.some((w) => text.includes(w))) {
    if (uploadedFiles.length > 0) {
      const fileList = uploadedFiles.map((f, i) => `${i + 1}. ${f}`).join("\n");
      return `You have uploaded the following document(s):\n\n${fileList}\n\nAsk me any questions about them.`;
    }
    return "You haven't uploaded any documents yet. Please upload a PDF, DOCX, or TXT file to get started.";
  }

  return null;
};

// ─── Safety Filter ────────────────────────────────────────────────────────────

const ILLEGAL_KEYWORDS = [
  "escape police", "avoid law", "how to hack",
  "kill", "drugs", "bypass law", "illegal way",
];

const isIllegalQuery = (msg) =>
  ILLEGAL_KEYWORDS.some((k) => msg.toLowerCase().includes(k));

// ─── Latest Law Enforcement ───────────────────────────────────────────────────

const enforceLatestLawContext = (msg) => `${msg}

IMPORTANT:
- Use BNS 2023 instead of IPC
- Use BNSS 2023 instead of CrPC
- Mention section numbers ONLY if certain
`;

// ─── Main Chat Query ──────────────────────────────────────────────────────────

const queryGroq = async (conversation, userMessage, memoryText = "", ragContext = "") => {
  if (isIllegalQuery(userMessage)) {
    return "I cannot assist with illegal activities. I can help you understand legal consequences or lawful alternatives.";
  }

  const domains       = detectLegalDomains(userMessage);
  const domainContext = buildDomainContext(domains);

  const systemPrompt = [
    BASE_PERSONALITY_PROMPT,
    domainContext,
    memoryText ? `User memory:\n${memoryText}` : "",
    ragContext  ? ragContext                     : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversation,
    { role: "user", content: enforceLatestLawContext(userMessage) },
  ];

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:       "llama-3.3-70b-versatile",
        messages,
        temperature: 0.2,
        max_tokens:  1024,
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiAnswer = response.data.choices[0].message.content.trim();

    // ── Lawyer Connect: append matched lawyer suggestions ──────────────────
    const lawyerBlock = buildLawyerSuggestionBlock(domains, 3);
    const finalAnswer = lawyerBlock
      ? `${aiAnswer}\n\n---\n\n${lawyerBlock}`
      : aiAnswer;

    return finalAnswer;

  } catch (err) {
    console.error("❌ Groq API error:", err.message);
    throw new Error(`Groq API error: ${err.message}`);
  }
};

// ─── Document Q&A (Context + Knowledge Hybrid) ───────────────────────────────

const queryGroqWithContext = async (question, contextChunks) => {
  const hasContext = contextChunks.length > 0;

  const context = hasContext
    ? contextChunks
        .map((c, i) => `[Source ${i + 1} | ${c.source}]:\n${c.text}`)
        .join("\n\n")
    : null;

  console.log(`📄 RAG mode: ${hasContext ? `${contextChunks.length} chunks found` : "no chunks — falling back to general law"}`);
  if (hasContext) console.log("Context preview:", context.slice(0, 300));

  const messages = hasContext
    ? [
        {
          role: "system",
          content: `You are Pocket Specter, an AI legal assistant for Indian law.

You have been given excerpts from a document uploaded by the user.

## Your job:
1. First answer using the document context (cite [Source N] where relevant)
2. Then add relevant general Indian legal explanation if it adds value

## Format your response as:

## 📄 From the Document
What the document says about this topic (cite sources).

## ⚖️ Legal Perspective
General Indian law that applies — acts, remedies, implications.

## ✅ What You Can Do
Practical actionable steps the user can take.

## Rules:
- Use ## for all section headings
- Use **bold** for key legal terms and act names
- Use numbered or bullet lists for steps
- If the document does not mention the topic, say so briefly, then proceed to legal explanation
- Never make up facts from the document
- Use BNS 2023 instead of IPC, BNSS 2023 instead of CrPC`,
        },
        {
          role: "user",
          content: `Document Context:\n${context}\n\nQuestion: ${question}`,
        },
      ]
    : [
        {
          role: "system",
          content: `You are Pocket Specter, an AI legal assistant for Indian law.

The uploaded document does not contain information relevant to this question.
Provide a helpful general legal answer based on Indian law.

## Format your response as:

## 📋 General Legal Answer
Clear explanation of the relevant law.

## ⚖️ Applicable Laws & Acts
List the relevant Indian acts, sections, or remedies.

## ✅ What You Can Do
Practical steps the user can take.

## Rules:
- Use ## for all section headings
- Use **bold** for key legal terms and act names
- Use BNS 2023 instead of IPC, BNSS 2023 instead of CrPC
- Mention section numbers ONLY if highly confident
- Never say "I couldn't find information" — always provide value`,
        },
        {
          role: "user",
          content: question,
        },
      ];

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:       "llama-3.3-70b-versatile",
        messages,
        temperature: 0.2,
        max_tokens:  1024,
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      answer:      response.data.choices[0].message.content.trim(),
      rag_used:    hasContext,
      chunks_used: contextChunks.length,
    };
  } catch (err) {
    console.error("❌ Groq Document QA error:", err.message);
    throw new Error(`Groq API error: ${err.message}`);
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  checkQuickResponse,
  checkDocQuickResponse,
  queryGroq,
  queryGroqWithContext,
  detectLegalDomains,
};