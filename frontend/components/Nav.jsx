"use client";
import Link from "next/link";
import { Scale, Sparkles, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`nav-wrap${scrolled ? " scrolled" : ""}`}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 48px" }}>
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Scale size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight:800, fontSize:17, color:"var(--text-h)" }}>Pocket Specter</span>
      </Link>
      <div className="nav-pill">
        {[["Home","/"],["Features","/#features"],["Chatbot","/chat"],["Lawyers","/lawyers"],["Contact Us","/contactus"]].map(([l,h])=>(
          <Link key={l} href={h} className="nav-link">{l}</Link>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {isSignedIn ? (
          <>
            <Link href="/chat" className="btn-blue" style={{ padding:"9px 20px", fontSize:14 }}>
              <Sparkles size={14} strokeWidth={2.5} />Try for Free
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link href="/sign-in" className="btn-outline" style={{ padding:"9px 20px", fontSize:14 }}>Sign In</Link>
            <Link href="/sign-up" className="btn-blue" style={{ padding:"9px 20px", fontSize:14 }}>
              <User size={14} />Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
