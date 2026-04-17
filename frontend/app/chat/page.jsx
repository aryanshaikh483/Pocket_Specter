"use client";
import { Menu, MessageSquare, FileText, X, Upload } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import { sendMessage, newChat, loadChat, deleteChat, getUserChats, uploadDocument, queryDocument } from "../../lib/api";

export default function ChatPage() {
  const { userId: clerkUserId } = useAuth();
  const userId = clerkUserId;

  // ── Chat mode state ──
  const [sessions, setSessions]    = useState([]);
  const [activeSession, setActive] = useState(null);
  const [messages, setMessages]    = useState([]);
  const [loading, setLoading]      = useState(false);
  const [sidebarOpen, setSidebar]  = useState(true);
  const [chatTitles, setTitles]    = useState({});

  // ── Mode ──
  const [mode, setMode] = useState("chat"); // "chat" | "document"

  // ── Document mode state ──
  const [docMessages, setDocMessages]   = useState([]);
  const [docLoading, setDocLoading]     = useState(false);
  const [docFile, setDocFile]           = useState(null);   // { name, url, type }
  const [docUploaded, setDocUploaded]   = useState(false);
  const [docSession]                    = useState("doc_temp"); // ephemeral session key
  const fileInputRef                    = useRef(null);

  useEffect(() => {
    if (!userId) return;
    try { const s = localStorage.getItem(`ps_titles_${userId}`); if (s) setTitles(JSON.parse(s)); } catch {}
  }, [userId]);

  const saveTitle = (session, text) => setTitles(prev => {
    if (prev[session]) return prev;
    const next = { ...prev, [session]: text.slice(0, 50) };
    try { localStorage.setItem(`ps_titles_${userId}`, JSON.stringify(next)); } catch {}
    return next;
  });

  const refresh = useCallback(async () => {
    if (!userId) return [];
    const data = await getUserChats(userId);
    const list = data.chat_sessions || [];
    setSessions(list); return list;
  }, [userId]);

  useEffect(() => {
    if (userId) refresh().then(list => { if (list.length > 0) selectSession(list[list.length - 1]); });
  }, [userId]); // eslint-disable-line

  const selectSession = async session => {
    setActive(session); setMessages([]);
    const data = await loadChat(userId, session);
    setMessages(data.chat || []);
  };

  const handleNew = async () => {
    if (!userId) return;
    const data = await newChat(userId); const s = data.chat_session;
    setSessions(p => [...p.filter(x => x !== s), s]); setActive(s); setMessages([]);
  };

  const handleDelete = async session => {
    if (!userId) return;
    await deleteChat(userId, session);
    const updated = sessions.filter(s => s !== session); setSessions(updated);
    setTitles(p => { const n = { ...p }; delete n[session]; try { localStorage.setItem(`ps_titles_${userId}`, JSON.stringify(n)); } catch {} return n; });
    if (activeSession === session) {
      if (updated.length > 0) selectSession(updated[updated.length - 1]);
      else { setActive(null); setMessages([]); }
    }
  };

  // ── Chat mode send ──
  const handleSend = async text => {
    if (!userId) return;
    let s = activeSession;
    if (!s) { const d = await newChat(userId); s = d.chat_session; setSessions(p => [...p.filter(x => x !== s), s]); setActive(s); }
    setMessages(p => [...p, { role: "user", content: text }]); setLoading(true);
    try {
      const data = await sendMessage(userId, s, text);
      const reply = data.reply ?? data.answer ?? data.error ?? "No response.";
      setMessages(p => [...p, { role: "assistant", content: reply }]); saveTitle(s, text);
    } catch (e) { setMessages(p => [...p, { role: "assistant", content: `Error: ${e.message}` }]); }
    finally { setLoading(false); refresh(); }
  };

  // ── Document mode: file pick ──
  const handleDocFilePick = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    setDocFile({ name: file.name, url, type: file.type });
    setDocMessages([]);
    setDocUploaded(false);
    setDocLoading(true);
    try {
      const res = await uploadDocument(userId, docSession, file);
      if (res.error) throw new Error(res.error);
      setDocUploaded(true);
      setDocMessages([{ role: "assistant", content: `📎 **${file.name}** uploaded. Ask me anything about this document.` }]);
    } catch (err) {
      setDocMessages([{ role: "assistant", content: `Upload failed: ${err.message}` }]);
    } finally { setDocLoading(false); }
    e.target.value = "";
  };

  // ── Document mode send ──
  const handleDocSend = async text => {
    if (!userId || !docUploaded) return;
    setDocMessages(p => [...p, { role: "user", content: text }]); setDocLoading(true);
    try {
      const data = await queryDocument(userId, docSession, text);
      const reply = data.answer ?? data.reply ?? data.error ?? "No response.";
      setDocMessages(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) { setDocMessages(p => [...p, { role: "assistant", content: `Error: ${e.message}` }]); }
    finally { setDocLoading(false); }
  };

  const clearDoc = () => {
    if (docFile?.url) URL.revokeObjectURL(docFile.url);
    setDocFile(null); setDocMessages([]); setDocUploaded(false);
  };

  const switchMode = m => {
    setMode(m);
    if (m === "chat") clearDoc();
  };

  return (
    <div className="chat-root">
      {/* Sidebar — only in chat mode */}
      {mode === "chat" && sidebarOpen && (
        <Sidebar sessions={sessions} activeSession={activeSession} onSelect={selectSession} onNew={handleNew} onDelete={handleDelete} chatTitles={chatTitles} />
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", flexShrink: 0 }}>
          {mode === "chat" && (
            <button onClick={() => setSidebar(v => !v)} aria-label="Toggle sidebar"
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "var(--text-h)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}
            ><Menu size={18} /></button>
          )}

          {/* Mode toggle */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 2 }}>
            {[["chat", <MessageSquare size={14} />, "Chat"], ["document", <FileText size={14} />, "Document"]].map(([m, icon, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "var(--accent)" : "var(--text-muted)",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}>
                {icon}{label}
              </button>
            ))}
          </div>

          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-h)", flex: 1 }}>
            {mode === "chat" ? (activeSession !== null ? `Chat ${activeSession}` : "Pocket Specter") : "Document Analysis"}
          </span>

          {[["Home", "/"], ["Lawyers", "/lawyers"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13, textDecoration: "none", padding: "6px 12px", borderRadius: 8, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "var(--text-h)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >{label}</Link>
          ))}
          <UserButton appearance={{ elements: { avatarBox: { width: 42, height: 42 } } }} />
        </div>

        {/* ── CHAT MODE ── */}
        {mode === "chat" && (
          <>
            <ChatWindow messages={messages} loading={loading} onSuggestion={handleSend} />
            <ChatInput onSend={handleSend} disabled={loading} uploadedFiles={[]} hideAttach />
          </>
        )}

        {/* ── DOCUMENT MODE ── */}
        {mode === "document" && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

            {/* Left: document viewer */}
            <div style={{ width: "50%", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "#f8f9fa", overflow: "hidden" }}>
              {!docFile ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={36} color="var(--accent)" strokeWidth={1.5} />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-h)", margin: 0 }}>Upload a document to analyse</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>PDF, DOCX, or TXT — up to 20MB</p>
                  <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={handleDocFilePick} />
                  <button onClick={() => fileInputRef.current?.click()} className="btn-blue" style={{ padding: "10px 24px", fontSize: 14 }}>
                    <Upload size={15} /> Choose File
                  </button>
                </div>
              ) : (
                <>
                  {/* File header */}
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "#fff", flexShrink: 0 }}>
                    <FileText size={16} color="var(--accent)" />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{docFile.name}</span>
                    <button onClick={clearDoc} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4, borderRadius: 6 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                    ><X size={15} /></button>
                  </div>
                  {/* Viewer */}
                  <div style={{ flex: 1, overflow: "auto" }}>
                    {docFile.type === "application/pdf" || docFile.name.endsWith(".pdf") ? (
                      <iframe src={docFile.url} style={{ width: "100%", height: "100%", border: "none" }} title="Document preview" />
                    ) : (
                      <div style={{ padding: 24, fontSize: 14, color: "var(--text-muted)", textAlign: "center", marginTop: 40 }}>
                        <FileText size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <p>Preview not available for this file type.</p>
                        <p style={{ marginTop: 6 }}>You can still ask questions about it in the chat.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right: chat */}
            <div style={{ width: "50%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <ChatWindow messages={docMessages} loading={docLoading} onSuggestion={docUploaded ? handleDocSend : undefined} />
              <ChatInput
                onSend={handleDocSend}
                disabled={docLoading || !docUploaded}
                uploadedFiles={docFile ? [docFile.name] : []}
                onRemoveFile={clearDoc}
                hideAttach
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
