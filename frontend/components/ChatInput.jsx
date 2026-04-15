"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, FileText, Loader2, X, Mic, MicOff } from "lucide-react";

const EXT = name => name.split(".").pop().toUpperCase() || "FILE";

export default function ChatInput({ onSend, onUpload, onRemoveFile, disabled, uploadedFiles=[] }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [hasSR, setHasSR] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setHasSR(true);
    const rec = new SR(); rec.lang="en-IN"; rec.continuous=false; rec.interimResults=false;
    rec.onresult = e => setText(p => p ? p+" "+e.results[0][0].transcript : e.results[0][0].transcript);
    rec.onend = () => setListening(false); rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, []);

  const toggleVoice = () => { const r=recRef.current; if(!r) return; if(listening){r.stop();setListening(false);}else{r.start();setListening(true);} };
  const canSend = mounted && !disabled && text.trim();
  const hasDoc  = uploadedFiles.length > 0;

  const handleSend = () => { if(!canSend) return; onSend(text.trim()); setText(""); if(textareaRef.current) textareaRef.current.style.height="auto"; };
  const handleKey  = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} };
  const handleInput= e => { setText(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; };
  const handleFile = e => { const f=e.target.files?.[0]; if(f) onUpload?.(f); e.target.value=""; };

  return (
    <div style={{ padding:"0 10% 18px", background:"transparent" }}>
      {hasDoc && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
          {uploadedFiles.map(name=>(
            <div key={name} style={{ display:"flex", alignItems:"center", gap:12, background:"#fff", border:"1px solid var(--border)", borderRadius:12, padding:"10px 14px", boxShadow:"var(--shadow-sm)" }}>
              <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText size={20} color="#ef4444" strokeWidth={2} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"var(--text-h)", fontSize:14, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</div>
                <div style={{ color:"var(--text-muted)", fontSize:12, marginTop:2 }}>{EXT(name)}</div>
              </div>
              <button onClick={()=>onRemoveFile?.(name)} style={{ width:28, height:28, borderRadius:"50%", border:"none", background:"#f3f4f6", color:"var(--text-muted)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#fee2e2";e.currentTarget.style.color="#ef4444";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.color="var(--text-muted)";}}
              ><X size={14} strokeWidth={2.5}/></button>
            </div>
          ))}
        </div>
      )}
      <div className="chat-input-box">
        <textarea ref={textareaRef} value={text} onChange={handleInput} onKeyDown={handleKey}
          placeholder={hasDoc?"Ask about your document...":"Ask Pocket Specter Legal AI..."}
          disabled={disabled} rows={1}
          style={{ width:"100%", background:"transparent", border:"none", outline:"none", color:"var(--text-h)", fontSize:15, resize:"none", lineHeight:1.6, maxHeight:120, fontFamily:"var(--font)", padding:"16px 20px 6px", boxSizing:"border-box" }}
        />
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 16px 12px" }}>
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display:"none" }} onChange={handleFile}/>
          <button onClick={()=>fileInputRef.current?.click()} disabled={disabled} title="Upload PDF, DOCX or TXT"
            style={{ background:"none", border:"none", cursor:disabled?"not-allowed":"pointer", color:hasDoc?"var(--accent)":"var(--text-muted)", display:"flex", alignItems:"center", padding:4, borderRadius:6, transition:"color 0.15s" }}
            onMouseEnter={e=>{if(!disabled)e.currentTarget.style.color="var(--accent)";}}
            onMouseLeave={e=>{e.currentTarget.style.color=hasDoc?"var(--accent)":"var(--text-muted)";}}
          ><Paperclip size={18} strokeWidth={1.8}/></button>
          <div style={{ flex:1 }}/>
          {hasSR && (
            <button onClick={toggleVoice} disabled={disabled}
              style={{ width:36, height:36, borderRadius:"50%", border:"none", background:listening?"#fee2e2":"#f3f4f6", color:listening?"#ef4444":"var(--text-muted)", cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s", boxShadow:listening?"0 0 0 3px rgba(239,68,68,0.15)":"none" }}>
              {listening?<MicOff size={15} strokeWidth={2}/>:<Mic size={15} strokeWidth={2}/>}
            </button>
          )}
          <button onClick={handleSend} disabled={!canSend} aria-label="Send" className="send-btn"
            style={{ width:38, height:38, borderRadius:"50%", border:"none", background:canSend?"var(--accent)":"#e5e7eb", color:canSend?"#fff":"var(--text-muted)", cursor:canSend?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s", boxShadow:canSend?"0 2px 12px rgba(59,130,246,0.3)":"none" }}>
            {disabled?<Loader2 size={15} strokeWidth={2} style={{animation:"spin 1s linear infinite"}}/>:<Send size={14} strokeWidth={2}/>}
          </button>
        </div>
      </div>
      <p style={{ fontSize:12, color:"var(--text-muted)", textAlign:"center", marginTop:10, opacity:0.7 }}>
        Pocket Specter can make mistakes. Always consult a licensed attorney for legal advice.
      </p>
    </div>
  );
}
