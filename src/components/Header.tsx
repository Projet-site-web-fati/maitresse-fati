"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Accueil", emoji: "🏠" },
  { href: "/eleves", label: "Espace Élèves", emoji: "🎒" },
  { href: "/parents", label: "Espace Parents", emoji: "👨‍👩‍👧" },
  { href: "/enseignant", label: "Espace Enseignant", emoji: "👩‍🏫" },
  { href: "/galerie", label: "Galerie Photos", emoji: "📸" },
  { href: "/contact", label: "Contact", emoji: "✉️" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: "white", boxShadow: "0 2px 12px rgba(37,99,235,0.12)" }}>
      {/* Top banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Stars left */}
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {["⭐", "🌟", "⭐"].map((s, i) => (
            <span key={i} style={{ fontSize: "1.4rem" }}>{s}</span>
          ))}
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <svg
            viewBox="0 0 700 80"
            style={{ width: "clamp(280px, 60vw, 650px)", height: "auto", overflow: "visible", display: "block", margin: "0 auto" }}
            aria-label="Les Classes de Maitresse FATI"
          >
            <defs>
              <path id="titleArc" d="M 10,72 Q 350,5 690,72" />
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FF6B6B" />
                <stop offset="20%"  stopColor="#FF8E53" />
                <stop offset="40%"  stopColor="#FFD166" />
                <stop offset="60%"  stopColor="#06D6A0" />
                <stop offset="80%"  stopColor="#4FC3F7" />
                <stop offset="100%" stopColor="#CE93D8" />
              </linearGradient>
            </defs>
            <text
              fontFamily="'Nunito', sans-serif"
              fontWeight="900"
              fontSize="44"
              fill="url(#rainbowGrad)"
              filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.45))"
            >
              <textPath href="#titleArc" startOffset="50%" textAnchor="middle">
                Les Classes de Maitresse FATI
              </textPath>
            </text>
          </svg>
          <p style={{ color: "#BFDBFE", fontSize: "0.85rem", margin: 0, marginTop: "0.15rem" }}>
            Un espace pour apprendre, grandir et s&apos;épanouir
          </p>
        </div>

        {/* Stars right */}
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {["⭐", "🌟", "⭐"].map((s, i) => (
            <span key={i} style={{ fontSize: "1.4rem" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ background: "#1E40AF", padding: "0 1rem" }}>
        {/* Desktop nav */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.25rem",
          }}
          className="hidden md:flex"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "0.6rem 1.1rem",
                  borderRadius: "0.5rem 0.5rem 0 0",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: isActive ? "#1E40AF" : "white",
                  background: isActive ? "#FEF08A" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile nav toggle */}
        <div
          className="flex md:hidden"
          style={{ justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0" }}
        >
          <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
            🏫 Menu
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "0.4rem",
              color: "white",
              padding: "0.4rem 0.7rem",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="flex md:hidden" style={{ flexDirection: "column", paddingBottom: "0.5rem" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "0.6rem 1rem",
                    color: isActive ? "#FEF08A" : "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "0.4rem",
                    background: isActive ? "rgba(254,240,138,0.15)" : "transparent",
                  }}
                >
                  {item.emoji} {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
