"use client";
import Link from "next/link";
import { Scale, FileText, BookOpen, MessageSquare, ArrowRight,
         MessageCircle, FileSearch, Mic, History, ShieldCheck,
         User, GraduationCap, Briefcase, Building2, Users,
         Zap, RefreshCw, Shield, Heart, Twitter, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import Nav from "../components/Nav";

/* ── shared ── */
const S = { fontFamily:"var(--font)" };
const BG  = { background:"var(--bg)" };
const BGA = { background:"var(--bg-alt)" };

/* ── Hero ── */
function Hero() {
  const features = [
    { label:"Document Analysis", icon:<FileText size={13}/> },
    { label:"Legal Research",    icon:<BookOpen size={13}/> },
    { label:"AI Chat Support",   icon:<MessageSquare size={13}/> },
  ];
  return (
    <section style={{ ...BG, minHeight:"100vh", display:"flex", alignItems:"center", padding:"100px 48px 60px", gap:48, ...S }}>
      {/* Left */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:22 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, alignSelf:"flex-start", padding:"6px 16px", borderRadius:999, border:"1px solid rgba(59,130,246,0.2)", background:"rgba(59,130,246,0.06)", color:"var(--accent)", fontSize:13, fontWeight:600 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }} />
          AI-Powered Legal Intelligence
        </div>
        <h1 style={{ fontSize:72, fontWeight:900, color:"var(--text-h)", lineHeight:1.0, letterSpacing:"-2px", margin:0 }}>Pocket<br/>Specter</h1>
        <p style={{ color:"var(--text-body)", fontSize:16, lineHeight:1.7, maxWidth:380, margin:0 }}>
          Explore features that boost your productivity. From document analysis to advanced research, we&apos;ve got the hard work covered.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <Link href="/chat" className="btn-blue" style={{ padding:"12px 28px", fontSize:15 }}>Get Started <ArrowRight size={16}/></Link>
          <Link href="/contactus" className="btn-outline" style={{ padding:"12px 28px", fontSize:15 }}>Contact Us</Link>
        </div>
        <div style={{ display:"flex", gap:40, marginTop:8 }}>
          {[["7+","Legal Domains"],["24/7","AI Available"],["Free","To Get Started"]].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontSize:24, fontWeight:800, color:"var(--accent)" }}>{n}</div>
              <div style={{ fontSize:13, color:"var(--text-muted)", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right card */}
      <div className="card" style={{ width:440, padding:"48px 40px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:18, boxShadow:"0 8px 48px rgba(0,0,0,0.1)" }}>
        <div style={{ width:64, height:64, borderRadius:18, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(59,130,246,0.35)" }}>
          <Scale size={32} color="#fff" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize:30, fontWeight:800, color:"var(--text-h)", lineHeight:1.2, margin:0 }}>Your Personal Legal AI Assistant</h2>
        <p style={{ color:"var(--text-muted)", fontSize:15, lineHeight:1.7, margin:0 }}>Say goodbye to expensive legal consultation, long waits for appointments, and confusing legal texts.</p>
        <Link href="/chat" className="btn-blue" style={{ padding:"14px 48px", fontSize:16, borderRadius:999, width:"100%", justifyContent:"center" }}>Try for Free →</Link>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
          {features.map(({label,icon})=>(
            <span key={label} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:999, border:"1px solid var(--border)", background:"#f9fafb", color:"var(--text-body)", fontSize:13, fontWeight:500 }}>{icon}{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Core Capabilities ── */
const caps = [
  { icon:<MessageCircle size={22}/>, color:"#3b82f6", bg:"rgba(59,130,246,0.08)", title:"AI Legal Chat", desc:"Ask anything about Indian law — BNS 2023, BNSS 2023, family, property, labour, consumer law. Get structured answers with citations.", tags:["BNS 2023","BNSS 2023","Multi-domain"] },
  { icon:<FileSearch size={22}/>,    color:"#10b981", bg:"rgba(16,185,129,0.08)", title:"Document Intelligence", desc:"Upload PDF, DOCX, or TXT files. The AI reads, chunks, and answers questions directly from your document using hybrid TF-IDF retrieval.", tags:["PDF & DOCX","OCR Fallback","TF-IDF Search"] },
  { icon:<Mic size={22}/>,           color:"#06b6d4", bg:"rgba(6,182,212,0.08)",  title:"Voice Input", desc:"Speak your legal question instead of typing. Voice recognition is tuned for Indian English and appends directly to your message.", tags:["en-IN","Browser Native","Hands-free"] },
  { icon:<Scale size={22}/>,         color:"#f43f5e", bg:"rgba(244,63,94,0.08)",  title:"Legal Domain Detection", desc:"Automatically detects whether your query is criminal, civil, family, employment, property, or corporate law and applies the right legal context.", tags:["7 Domains","Auto-classify","Smart Routing"] },
  { icon:<History size={22}/>,       color:"#8b5cf6", bg:"rgba(139,92,246,0.08)", title:"Chat History", desc:"All your conversations are saved per session. Switch between chats, search by title, and pick up exactly where you left off.", tags:["Multi-session","Searchable","Persistent"] },
  { icon:<ShieldCheck size={22}/>,   color:"#f59e0b", bg:"rgba(245,158,11,0.08)", title:"Safety & Accuracy", desc:"Illegal queries are blocked. Section numbers are cited only when confident. Responses follow a structured format — answer, explanation, advice.", tags:["Safety Filter","Verified Citations","Structured Output"] },
];

function CoreCapabilities() {
  return (
    <section id="features" style={{ ...BGA, padding:"90px 48px", ...S }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <span className="label-pill" style={{ marginBottom:20, display:"inline-flex" }}>Core Capabilities</span>
        <h2 style={{ fontSize:42, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"16px 0 14px" }}>Everything You Need for Legal Clarity</h2>
        <p style={{ color:"var(--text-muted)", fontSize:15, maxWidth:480, margin:"0 auto" }}>Every feature is built around real legal needs — not just a chatbot.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, maxWidth:1000, margin:"0 auto" }}>
        {caps.map(({icon,color,bg,title,desc,tags})=>(
          <div key={title} className="card" style={{ padding:"28px 24px", display:"flex", flexDirection:"column", gap:14 }}>
            <div className="icon-box" style={{ background:bg, color }}>{icon}</div>
            <h3 style={{ fontSize:17, fontWeight:700, color:"var(--text-h)", margin:0 }}>{title}</h3>
            <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.65, margin:0, flex:1 }}>{desc}</p>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {tags.map(t=><span key={t} style={{ padding:"4px 12px", borderRadius:999, border:"1px solid var(--border)", background:"#f9fafb", color:"var(--text-muted)", fontSize:12, fontWeight:500 }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Built For ── */
const audiences = [
  { icon:<User size={22}/>,        color:"#3b82f6", bg:"rgba(59,130,246,0.08)",  title:"Citizens",     desc:"Understand your rights, file complaints, and navigate legal situations without a lawyer." },
  { icon:<Scale size={22}/>,       color:"#06b6d4", bg:"rgba(6,182,212,0.08)",   title:"Lawyers",      desc:"Speed up research, draft documents, and find relevant case law in seconds." },
  { icon:<GraduationCap size={22}/>,color:"#8b5cf6",bg:"rgba(139,92,246,0.08)", title:"Law Students",  desc:"Revise statutes, understand judgments, and prepare for exams with AI guidance." },
  { icon:<Briefcase size={22}/>,   color:"#10b981", bg:"rgba(16,185,129,0.08)",  title:"Businesses",   desc:"Review contracts, understand compliance requirements, and protect your interests." },
  { icon:<Building2 size={22}/>,   color:"#f59e0b", bg:"rgba(245,158,11,0.08)",  title:"NGOs",         desc:"Empower communities with accessible legal knowledge and rights awareness." },
  { icon:<Users size={22}/>,       color:"#f43f5e", bg:"rgba(244,63,94,0.08)",   title:"Everyone",     desc:"Because legal clarity shouldn't be a privilege — it should be a right." },
];

function BuiltFor() {
  return (
    <section style={{ ...BG, padding:"90px 48px", ...S }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <span className="label-pill" style={{ marginBottom:20, display:"inline-flex" }}>Built For</span>
        <h2 style={{ fontSize:42, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"16px 0 14px" }}>Who Is Pocket Specter For?</h2>
        <p style={{ color:"var(--text-muted)", fontSize:15, maxWidth:460, margin:"0 auto" }}>Whether you&apos;re a first-time user or a legal professional, we&apos;ve built this for you.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, maxWidth:900, margin:"0 auto" }}>
        {audiences.map(({icon,color,bg,title,desc})=>(
          <div key={title} className="card" style={{ padding:"24px 22px", display:"flex", alignItems:"flex-start", gap:18 }}>
            <div className="icon-box" style={{ background:bg, color, flexShrink:0 }}>{icon}</div>
            <div>
              <h3 style={{ fontSize:16, fontWeight:700, color:"var(--text-h)", margin:"0 0 6px" }}>{title}</h3>
              <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.65, margin:0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Why Choose Us ── */
const why = [
  { icon:<Zap size={22}/>,       color:"#3b82f6", bg:"rgba(59,130,246,0.08)",  title:"Answers in Seconds",        desc:"Type your question, get a grounded answer. No appointments, no retainers, no waiting rooms." },
  { icon:<BookOpen size={22}/>,  color:"#06b6d4", bg:"rgba(6,182,212,0.08)",   title:"All Major Indian Laws",     desc:"IPC, BNS, CrPC, CPC, BNSS, family, property, consumer, labour, company law. Plus SC/HC case references." },
  { icon:<Users size={22}/>,     color:"#8b5cf6", bg:"rgba(139,92,246,0.08)",  title:"Built for Everyone",        desc:"Citizens check their rights. Lawyers speed up research. Students revise for exams." },
  { icon:<Heart size={22}/>,     color:"#f43f5e", bg:"rgba(244,63,94,0.08)",   title:"Free to Use",               desc:"100 free queries every month. Paid plans only if you need more volume or professional tools." },
  { icon:<RefreshCw size={22}/>, color:"#10b981", bg:"rgba(16,185,129,0.08)",  title:"Getting Better Every Week", desc:"We ship improvements based on what users actually ask. If something is wrong, we fix it." },
  { icon:<Shield size={22}/>,    color:"#f59e0b", bg:"rgba(245,158,11,0.08)",  title:"Private by Default",        desc:"Your conversations are yours. Not used for AI training. Delete anytime." },
];

function WhyChooseUs() {
  return (
    <section style={{ ...BGA, padding:"90px 48px", ...S }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <span className="label-pill" style={{ marginBottom:20, display:"inline-flex" }}>Why Choose Us</span>
        <h2 style={{ fontSize:42, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"16px 0 14px" }}>Why Pocket Specter?</h2>
        <p style={{ color:"var(--text-muted)", fontSize:15, maxWidth:480, margin:"0 auto" }}>Because understanding the law shouldn&apos;t require a law degree or an expensive consultation.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, maxWidth:1000, margin:"0 auto" }}>
        {why.map(({icon,color,bg,title,desc})=>(
          <div key={title} className="card" style={{ padding:"28px 24px", display:"flex", flexDirection:"column", gap:14 }}>
            <div className="icon-box" style={{ background:bg, color }}>{icon}</div>
            <h3 style={{ fontSize:17, fontWeight:700, color:"var(--text-h)", margin:0 }}>{title}</h3>
            <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.65, margin:0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA Band ── */
function CTABand() {
  return (
    <section style={{ ...BG, padding:"80px 48px", textAlign:"center", ...S }}>
      <h2 style={{ fontSize:42, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"0 0 14px" }}>Get Legal Clarity in Seconds</h2>
      <p style={{ color:"var(--text-muted)", fontSize:16, maxWidth:460, margin:"0 auto 32px", lineHeight:1.7 }}>Ask your legal question, upload a document, or explore Indian law — all for free. No appointments. No waiting rooms.</p>
      <Link href="/chat" className="btn-blue" style={{ padding:"14px 44px", fontSize:16, borderRadius:999 }}>Try Pocket Specter Free</Link>
    </section>
  );
}

/* ── Footer ── */
const footerLinks = {
  Product: [["AI Legal Chat","/chat"],["Document Analysis","/chat"],["Features","#features"]],
  Legal:   [["Privacy Policy","/privacy"],["Disclaimer","/disclaimer"]],
  Company: [["About","/about"],["Contact Us","/contactus"]],
};

function Footer() {
  return (
    <footer style={{ background:"#f1f3f6", borderTop:"1px solid var(--border)", padding:"56px 48px 32px", ...S }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", gap:60, marginBottom:44, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 280px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Scale size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight:800, fontSize:17, color:"var(--text-h)" }}>Pocket Specter</span>
            </div>
            <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.8, margin:"0 0 20px" }}>AI-powered legal assistant for Indian law. Get instant answers, analyse documents, and understand your rights.</p>
            <div style={{ display:"flex", gap:10 }}>
              {[[<Twitter size={16}/>, "https://twitter.com"],[<Linkedin size={16}/>, "https://linkedin.com"]].map(([icon,href],i)=>(
                <a key={i} href={href} target="_blank" rel="noreferrer" style={{ width:36, height:36, borderRadius:8, background:"#fff", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-muted)", textDecoration:"none", transition:"all 0.15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.color="var(--accent)";e.currentTarget.style.borderColor="rgba(59,130,246,0.3)";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="var(--text-muted)";e.currentTarget.style.borderColor="var(--border)";}}
                >{icon}</a>
              ))}
            </div>
          </div>
          <div style={{ flex:1, display:"flex", gap:48, flexWrap:"wrap" }}>
            {Object.entries(footerLinks).map(([section,items])=>(
              <div key={section} style={{ flex:1, minWidth:100 }}>
                <p style={{ color:"var(--text-h)", fontWeight:600, fontSize:14, margin:"0 0 16px" }}>{section}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {items.map(([label,href])=>(
                    <Link key={label} href={href} className="footer-link">{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:20, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <p style={{ color:"var(--text-muted)", fontSize:13 }}>© {new Date().getFullYear()} Pocket Specter. All rights reserved.</p>
          <p style={{ color:"var(--text-muted)", fontSize:13 }}>Not a substitute for professional legal advice.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ── */
export default function Page() {
  return (
    <main style={{ fontFamily:"var(--font)", background:"var(--bg)" }}>
      <Nav />
      <Hero />
      <CoreCapabilities />
      <BuiltFor />
      <WhyChooseUs />
      <CTABand />
      <Footer />
    </main>
  );
}
