"use client";
import { useEffect, useRef } from "react";
import { Scale } from "lucide-react";
import MessageBubble from "./MessageBubble";

const suggestions = [
  "What are tenant rights in India?",
  "How to file a consumer complaint?",
  "Explain Domestic Violence Act",
  "What is bail process in India?",
];

export default function ChatWindow({ messages, loading, onSuggestion }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  const isEmpty = messages.length === 0 && !loading;

  return (
    <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", padding: isEmpty ? "0" : "28px 15% 12px" }}>
      {isEmpty && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px 32px", textAlign:"center" }}>
          <div style={{ width:68, height:68, borderRadius:20, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:"0 4px 20px rgba(59,130,246,0.3)" }}>
            <Scale size={34} color="#fff" strokeWidth={2} />
          </div>
          <h2 style={{ fontSize:28, fontWeight:800, color:"var(--text-h)", margin:"0 0 10px", letterSpacing:"-0.5px" }}>Hello, how can I help you today?</h2>
          <p style={{ fontSize:15, color:"var(--text-muted)", margin:"0 0 36px" }}>Ask me about Indian law, case citations, or legal guidance</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", maxWidth:560 }}>
            {suggestions.map(s=>(
              <button key={s} onClick={()=>onSuggestion?.(s)} className="suggestion-chip" style={{ padding:"11px 20px" }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {messages.map((msg,i)=>(
        <div key={i} className="message-enter" style={{ animationDelay:`${Math.min(i*0.03,0.1)}s` }}>
          <MessageBubble role={msg.role} content={msg.content} />
        </div>
      ))}
      {loading && (
        <div className="message-enter" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Scale size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ padding:"12px 16px", borderRadius:"4px 16px 16px 16px", background:"#fff", border:"1px solid var(--border)", display:"flex", gap:5, alignItems:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            {[0,1,2].map(i=><span key={i} style={{ width:7, height:7, borderRadius:"50%", background:"var(--accent)", display:"inline-block", animation:"bounce 1.2s ease-in-out infinite", animationDelay:`${i*0.2}s` }}/>)}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
