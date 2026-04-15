"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import { sendMessage, newChat, loadChat, deleteChat, getUserChats, uploadDocument, queryDocument } from "../../lib/api";

export default function ChatPage() {
  const { userId: clerkUserId } = useAuth();
  const userId = clerkUserId; // use Clerk's real user ID
  const [sessions, setSessions]       = useState([]);
  const [activeSession, setActive]    = useState(null);
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [sidebarOpen, setSidebar]     = useState(true);
  const [uploadedFiles, setFiles]     = useState([]);
  const [chatTitles, setTitles]       = useState({});

  useEffect(() => {
    if (!userId) return;
    try { const s = localStorage.getItem(`ps_titles_${userId}`); if(s) setTitles(JSON.parse(s)); } catch {}
  }, [userId]);

  const saveTitle = (session, text) => setTitles(prev => {
    if (prev[session]) return prev;
    const next = { ...prev, [session]: text.slice(0,50) };
    try { localStorage.setItem(`ps_titles_${userId}`, JSON.stringify(next)); } catch {}
    return next;
  });

  const refresh = useCallback(async () => {
    if (!userId) return [];
    const data = await getUserChats(userId);
    const list = data.chat_sessions || [];
    setSessions(list); return list;
  }, [userId]);

  useEffect(() => { if(userId) refresh().then(list => { if(list.length>0) selectSession(list[list.length-1]); }); }, [userId]); // eslint-disable-line

  const selectSession = async session => {
    setActive(session); setMessages([]); setFiles([]);
    const data = await loadChat(userId, session);
    setMessages(data.chat || []);
  };

  const handleNew = async () => {
    if (!userId) return;
    const data = await newChat(userId); const s = data.chat_session;
    setSessions(p => [...p.filter(x=>x!==s), s]); setActive(s); setMessages([]); setFiles([]);
  };

  const handleDelete = async session => {
    if (!userId) return;
    await deleteChat(userId, session);
    const updated = sessions.filter(s=>s!==session); setSessions(updated);
    setTitles(p => { const n={...p}; delete n[session]; try{localStorage.setItem(`ps_titles_${userId}`,JSON.stringify(n));}catch{} return n; });
    if (activeSession===session) { if(updated.length>0) selectSession(updated[updated.length-1]); else { setActive(null); setMessages([]); } }
  };

  const handleUpload = async file => {
    if (!userId) return;
    let s = activeSession;
    if (!s) { const d=await newChat(userId); s=d.chat_session; setSessions(p=>[...p.filter(x=>x!==s),s]); setActive(s); }
    setLoading(true);
    try { const res=await uploadDocument(uid,s,file); if(res.error) throw new Error(res.error); setFiles(p=>[...p,file.name]); saveTitle(s,`📎 ${file.name}`); }
    catch(err) { setMessages(p=>[...p,{role:"assistant",content:`Upload failed: ${err.message}`}]); }
    finally { setLoading(false); }
  };

  const handleSend = async text => {
    if (!userId) return;
    let s = activeSession;
    if (!s) { const d=await newChat(userId); s=d.chat_session; setSessions(p=>[...p.filter(x=>x!==s),s]); setActive(s); }
    setMessages(p=>[...p,{role:"user",content:text}]); setLoading(true);
    try {
      const data = uploadedFiles.length>0 ? await queryDocument(userId,s,text) : await sendMessage(userId,s,text);
      const reply = data.reply ?? data.answer ?? data.error ?? "No response.";
      setMessages(p=>[...p,{role:"assistant",content:reply}]); saveTitle(s,text);
    } catch(e) { setMessages(p=>[...p,{role:"assistant",content:`Error: ${e.message}`}]); }
    finally { setLoading(false); refresh(); }
  };

  return (
    <div className="chat-root">
      {sidebarOpen && <Sidebar sessions={sessions} activeSession={activeSession} onSelect={selectSession} onNew={handleNew} onDelete={handleDelete} chatTitles={chatTitles}/>}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.9)", backdropFilter:"blur(16px)" }}>
          <button onClick={()=>setSidebar(v=>!v)} aria-label="Toggle sidebar"
            style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", padding:6, borderRadius:8, display:"flex", alignItems:"center", transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.color="var(--text-h)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--text-muted)";}}
          ><Menu size={18}/></button>
          <span style={{ fontWeight:700, fontSize:15, color:"var(--text-h)", flex:1 }}>
            {activeSession!==null ? `Chat ${activeSession}` : "Pocket Specter"}
          </span>
          {[["Home", "/"], ["Lawyers", "/lawyers"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ display:"flex", alignItems:"center", gap:6, color:"var(--text-muted)", fontSize:13, textDecoration:"none", padding:"6px 12px", borderRadius:8, transition:"all 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.color="var(--text-h)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-muted)";}}
            >{label}</Link>
          ))}
          <UserButton />
        </div>
        <ChatWindow messages={messages} loading={loading} onSuggestion={handleSend}/>
        <ChatInput onSend={handleSend} onUpload={handleUpload} onRemoveFile={name=>setFiles(p=>p.filter(f=>f!==name))} disabled={loading} uploadedFiles={uploadedFiles}/>
      </main>
    </div>
  );
}
