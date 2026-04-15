import { Scale, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start", alignItems:"flex-start", marginBottom:20, gap:10 }}>
      {!isUser && (
        <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(59,130,246,0.3)" }}>
          <Scale size={16} color="#fff" strokeWidth={2.5} />
        </div>
      )}
      <div style={{
        maxWidth:"65%", padding:"14px 18px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        background: isUser ? "var(--accent)" : "#fff",
        color: isUser ? "#fff" : "var(--text-h)",
        fontSize:14, lineHeight:1.7, wordBreak:"break-word",
        boxShadow: isUser ? "0 2px 12px rgba(59,130,246,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
        border: isUser ? "none" : "1px solid var(--border)",
      }}>
        {isUser ? content : (
          <ReactMarkdown components={{
            h1:({children})=><div style={{fontSize:20,fontWeight:800,marginBottom:8,color:"var(--text-h)"}}>{children}</div>,
            h2:({children})=><div style={{fontSize:16,fontWeight:700,marginTop:14,marginBottom:6,color:"var(--text-h)"}}>{children}</div>,
            p:({children})=><p style={{marginBottom:8,color:"var(--text-body)",lineHeight:1.7}}>{children}</p>,
            strong:({children})=><span style={{fontWeight:700,color:"var(--text-h)"}}>{children}</span>,
            ol:({children})=><ol style={{paddingLeft:18,marginBottom:8}}>{children}</ol>,
            ul:({children})=><ul style={{paddingLeft:18,marginBottom:8}}>{children}</ul>,
            li:({children})=><li style={{marginBottom:4,lineHeight:1.7,color:"var(--text-body)"}}>{children}</li>,
          }}>{content}</ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:"#e5e7eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <User size={16} color="var(--text-muted)" strokeWidth={2} />
        </div>
      )}
    </div>
  );
}
