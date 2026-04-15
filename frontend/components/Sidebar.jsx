"use client";
import { useState } from "react";
import { Scale, Plus, Search, Trash2, MessageCircle } from "lucide-react";

export default function Sidebar({ sessions, activeSession, onSelect, onNew, onDelete, chatTitles={} }) {
  const [search, setSearch] = useState("");
  const getTitle = s => chatTitles[s] || `Chat ${s}`;
  const filtered = sessions.filter(s => getTitle(s).toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="chat-sidebar" style={{ width:"var(--sidebar-w)", display:"flex", flexDirection:"column", height:"100%", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"20px 18px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--border)" }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Scale size={17} color="#fff" strokeWidth={2.5}/>
        </div>
        <span style={{ fontWeight:800, fontSize:16, color:"var(--text-h)" }}>Pocket Specter</span>
      </div>

      {/* New Chat */}
      <div style={{ padding:"14px 14px 10px" }}>
        <button onClick={onNew} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"none", background:"var(--accent)", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, transition:"background 0.15s", boxShadow:"0 2px 10px rgba(59,130,246,0.25)" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--accent-dark)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--accent)"}
        ><Plus size={15} strokeWidth={2.5}/> New Chat</button>
      </div>

      {/* Search */}
      <div style={{ padding:"0 14px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f3f4f6", borderRadius:8, padding:"8px 12px", border:"1px solid var(--border)" }}>
          <Search size={14} color="var(--text-muted)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chats..."
            style={{ background:"none", border:"none", outline:"none", color:"var(--text-h)", fontSize:13, flex:1, fontFamily:"var(--font)" }}/>
        </div>
      </div>

      {/* Chats */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 14px 14px" }}>
        <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.1em", padding:"8px 10px 6px", textTransform:"uppercase" }}>Your Chats</p>
        {filtered.length===0 && <p style={{ color:"var(--text-muted)", fontSize:13, padding:"6px 10px" }}>No chats yet</p>}
        {filtered.map(s=>(
          <div key={s} onClick={()=>onSelect(s)} className={`chat-item${activeSession===s?" active":""}`}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 10px", cursor:"pointer", marginBottom:2, color:activeSession===s?"var(--accent)":"var(--text-body)", fontWeight:activeSession===s?600:400, fontSize:13 }}>
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:7, flex:1 }}>
              <MessageCircle size={13} style={{ flexShrink:0, opacity:0.6 }}/> {getTitle(s)}
            </span>
            <button onClick={e=>{e.stopPropagation();onDelete(s);}}
              style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:"2px 4px", borderRadius:4, display:"flex", transition:"all 0.15s", opacity:0.5 }}
              onMouseEnter={e=>{e.currentTarget.style.color="#ef4444";e.currentTarget.style.opacity="1";e.currentTarget.style.background="#fee2e2";}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--text-muted)";e.currentTarget.style.opacity="0.5";e.currentTarget.style.background="none";}}
            ><Trash2 size={13}/></button>
          </div>
        ))}
      </div>
    </aside>
  );
}
