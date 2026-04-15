"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, Twitter, Linkedin, Github } from "lucide-react";
import Nav from "../../components/Nav";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    // Replace with your actual form submission logic
    setSent(true);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", fontFamily:"var(--font)" }}>
      <Nav />
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"110px 24px 64px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <span className="label-pill" style={{ marginBottom:14, display:"inline-flex" }}>Contact Us</span>
          <h1 style={{ fontSize:42, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"16px 0 12px" }}>Get in Touch</h1>
          <p style={{ color:"var(--text-muted)", fontSize:15, maxWidth:460, margin:"0 auto" }}>
            Have a question, feedback, or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:28 }}>

          {/* Left — info */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon:<Mail size={18}/>,    color:"#3b82f6", bg:"rgba(59,130,246,0.08)",  label:"Email",    value:"pocketspecter8@gmail.com",  href:"mailto:pocketspecter8@gmail.com" },
              { icon:<Phone size={18}/>,   color:"#10b981", bg:"rgba(16,185,129,0.08)",  label:"Phone",    value:"+91-9370779887",            href:"tel:+919820000000" },
              { icon:<MapPin size={18}/>,  color:"#f59e0b", bg:"rgba(245,158,11,0.08)",  label:"Location", value:"Mumbai, Maharashtra, India", href:null },
              { icon:<MessageSquare size={18}/>, color:"#8b5cf6", bg:"rgba(139,92,246,0.08)", label:"Response Time", value:"Within 24 hours", href:null },
            ].map(({ icon, color, bg, label, value, href }) => (
              <div key={label} className="card" style={{ padding:"20px", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{label}</div>
                  {href
                    ? <a href={href} style={{ fontSize:14, color:"var(--accent)", textDecoration:"none", fontWeight:500 }}>{value}</a>
                    : <div style={{ fontSize:14, color:"var(--text-body)", fontWeight:500 }}>{value}</div>
                  }
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="card" style={{ padding:"20px" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:14 }}>Follow Us</div>
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { icon:<Twitter size={16}/>,  href:"https://twitter.com",   label:"Twitter" },
                  { icon:<Linkedin size={16}/>, href:"https://linkedin.com",  label:"LinkedIn" },
                ].map(({ icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    style={{ width:38, height:38, borderRadius:10, background:"#f3f4f6", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-muted)", textDecoration:"none", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--accent)";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="var(--accent)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.color="var(--text-muted)";e.currentTarget.style.borderColor="var(--border)";}}
                  >{icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="card" style={{ padding:"32px" }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <Send size={22} color="#059669" />
                </div>
                <h3 style={{ fontSize:20, fontWeight:700, color:"var(--text-h)", margin:"0 0 8px" }}>Message Sent!</h3>
                <p style={{ color:"var(--text-muted)", fontSize:14 }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => { setForm({ name:"", email:"", subject:"", message:"" }); setSent(false); }}
                  style={{ marginTop:20, padding:"10px 24px", borderRadius:999, border:"none", background:"var(--accent)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:"var(--text-h)", margin:"0 0 4px" }}>Send a Message</h2>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Field label="Your Name" name="name" value={form.name} onChange={handle} placeholder="John Doe" required />
                  <Field label="Email Address" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
                </div>
                <Field label="Subject" name="subject" value={form.subject} onChange={handle} placeholder="How can we help?" required />
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"var(--text-body)" }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell us more..."
                    style={{ padding:"10px 14px", borderRadius:10, border:"1px solid var(--border)", fontSize:14, color:"var(--text-h)", fontFamily:"var(--font)", resize:"vertical", outline:"none", transition:"border-color 0.2s" }}
                    onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"}
                    onBlur={e=>e.target.style.borderColor="var(--border)"}
                  />
                </div>
                <button type="submit" className="btn-blue" style={{ alignSelf:"flex-start", padding:"11px 28px", fontSize:14 }}>
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type="text", value, onChange, placeholder, required }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:13, fontWeight:600, color:"var(--text-body)" }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        style={{ padding:"10px 14px", borderRadius:10, border:"1px solid var(--border)", fontSize:14, color:"var(--text-h)", fontFamily:"var(--font)", outline:"none", transition:"border-color 0.2s", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"}
        onBlur={e=>e.target.style.borderColor="var(--border)"}
      />
    </div>
  );
}
