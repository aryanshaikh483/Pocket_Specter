"use client";
import { useState, useEffect } from "react";
import { MapPin, Clock, BookOpen, ChevronDown } from "lucide-react";
import Nav from "../../components/Nav";

const DOMAIN_LABELS = {
  criminal_law:   "Criminal Law",
  corporate_law:  "Corporate Law",
  family_law:     "Family Law",
  consumer_law:   "Consumer Law",
  womens_law:     "Women's Rights",
  childrens_law:  "Children's Rights",
  employment_law: "Employment Law",
  property_law:   "Property Law",
  general_law:    "General Practice",
};

const DOMAIN_COLORS = {
  criminal_law:   { bg:"#fee2e2", color:"#dc2626" },
  corporate_law:  { bg:"#dbeafe", color:"#2563eb" },
  family_law:     { bg:"#fce7f3", color:"#db2777" },
  consumer_law:   { bg:"#fef9c3", color:"#ca8a04" },
  womens_law:     { bg:"#ede9fe", color:"#7c3aed" },
  childrens_law:  { bg:"#d1fae5", color:"#059669" },
  employment_law: { bg:"#fef3c7", color:"#d97706" },
  property_law:   { bg:"#e0f2fe", color:"#0284c7" },
  general_law:    { bg:"#f3f4f6", color:"#4b5563" },
};

export default function LawyersPage() {
  const [lawyers, setLawyers]         = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [activeDomain, setDomain]     = useState("all");
  const [showUnavail, setShowUnavail] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/lawyers")
      .then(r => r.json())
      .then(d => { setLawyers(d.lawyers); setFiltered(d.lawyers); });
  }, []);

  useEffect(() => {
    let list = activeDomain === "all"
      ? lawyers
      : lawyers.filter(l => l.domains.includes(activeDomain));
    if (!showUnavail) list = list.filter(l => l.available);
    setFiltered(list);
  }, [activeDomain, showUnavail, lawyers]);

  // Only show domains that exist in the data
  const activeDomains = ["all", ...Object.keys(DOMAIN_LABELS).filter(d =>
    lawyers.some(l => l.domains.includes(d))
  )];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", fontFamily:"var(--font)" }}>
      <Nav />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"110px 24px 48px" }}>
        {/* Title */}
        <div style={{ marginBottom:36 }}>
          <span className="label-pill" style={{ marginBottom:14, display:"inline-flex" }}>Lawyer Connect</span>
          <h1 style={{ fontSize:40, fontWeight:800, color:"var(--text-h)", letterSpacing:"-1px", margin:"0 0 10px" }}>Find a Verified Advocate</h1>
          <p style={{ color:"var(--text-muted)", fontSize:15, margin:0 }}>Browse lawyers by domain. Connect directly via LinkedIn.</p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:32 }}>
          {activeDomains.map(d => (
            <button key={d} onClick={() => setDomain(d)}
              style={{ padding:"8px 18px", borderRadius:999, border:"1.5px solid", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
                borderColor: activeDomain===d ? "var(--accent)" : "var(--border)",
                background:  activeDomain===d ? "var(--accent)" : "#fff",
                color:       activeDomain===d ? "#fff" : "var(--text-muted)",
              }}>
              {d === "all" ? "All Domains" : DOMAIN_LABELS[d]}
            </button>
          ))}
          <label style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text-muted)", cursor:"pointer", userSelect:"none" }}>
            <input type="checkbox" checked={showUnavail} onChange={e => setShowUnavail(e.target.checked)} style={{ accentColor:"var(--accent)", width:15, height:15 }} />
            Show unavailable
          </label>
        </div>

        {/* Count */}
        <p style={{ color:"var(--text-muted)", fontSize:13, marginBottom:20 }}>
          Showing {filtered.length} advocate{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:20 }}>
          {filtered.map(lawyer => <LawyerCard key={lawyer.id} lawyer={lawyer} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"var(--text-muted)" }}>
            <BookOpen size={40} style={{ opacity:0.3, marginBottom:12 }} />
            <p style={{ fontSize:15 }}>No advocates found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LawyerCard({ lawyer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card" style={{ padding:"24px", display:"flex", flexDirection:"column", gap:14, opacity: lawyer.available ? 1 : 0.6 }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"var(--text-h)", marginBottom:3 }}>{lawyer.name}</div>
          <div style={{ fontSize:13, color:"var(--text-muted)" }}>{lawyer.title}</div>
        </div>
        <span style={{ padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, flexShrink:0,
          background: lawyer.available ? "#d1fae5" : "#f3f4f6",
          color:      lawyer.available ? "#059669" : "#9ca3af" }}>
          {lawyer.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"var(--text-muted)" }}>
          <MapPin size={13} /> {lawyer.location}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"var(--text-muted)" }}>
          <Clock size={13} /> {lawyer.experience_years} years experience
        </div>
      </div>

      {/* Domain tags */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {lawyer.domains.map(d => {
          const c = DOMAIN_COLORS[d] || DOMAIN_COLORS.general_law;
          return (
            <span key={d} style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:600, background:c.bg, color:c.color }}>
              {DOMAIN_LABELS[d] || d}
            </span>
          );
        })}
      </div>

      {/* Expand toggle */}
      <button onClick={() => setExpanded(v => !v)}
        style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--text-muted)", padding:0, alignSelf:"flex-start" }}>
        {expanded ? "Hide details" : "Show details"}
        <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "none", transition:"transform 0.2s" }} />
      </button>

      {expanded && (
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:14, display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ fontSize:12, color:"var(--text-muted)" }}>
            Languages: {lawyer.languages.join(", ")}
          </div>
          {lawyer.linkedin && (
            <a href={lawyer.linkedin} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#2563eb", textDecoration:"none", fontWeight:500 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration="underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration="none"}>
              View LinkedIn Profile →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
