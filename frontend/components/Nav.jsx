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
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 56px" }}>
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Scale size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight:800, fontSize:19, color:"var(--text-h)" }}>Pocket Specter</span>
      </Link>
      <div className="nav-pill">
        {[["Home","/"],["Features","/#features"],["Chatbot","/chat"],["Lawyers","/lawyers"],["Contact Us","/contactus"]].map(([l,h])=>(
          <Link key={l} href={h} className="nav-link">{l}</Link>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {isSignedIn ? (
          <>
            <Link href="/chat" className="btn-blue" style={{ padding:"11px 24px", fontSize:15 }}>
              <Sparkles size={15} strokeWidth={2.5} />Try for Free
            </Link>
            <UserButton appearance={{ elements: { avatarBox: { width: 42, height: 42 } } }} />
          </>
        ) : (
          <>
            <Link href="/sign-in" className="btn-outline" style={{ padding:"11px 24px", fontSize:15 }}>Sign In</Link>
            <Link href="/sign-up" className="btn-blue" style={{ padding:"11px 24px", fontSize:15 }}>
              <User size={15} />Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
