"use client";
import Link from "next/link";
import NavCard from "@/components/NavCard";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  audience: string;
  created_at: string;
}

interface Homework {
  id: number;
  title: string;
  subject: string;
  level: string;
  due_date: string;
}

const categoryColors: Record<string, string> = {
  info: "#3B82F6",
  devoir: "#F97316",
  sortie: "#22C55E",
  reunion: "#A855F7",
};

const categoryLabels: Record<string, string> = {
  info: "ℹ️ Info",
  devoir: "📝 Devoir",
  sortie: "🚌 Sortie",
  reunion: "👥 Réunion",
};

const subjectColors: Record<string, string> = {
  Français: "#3B82F6",
  Mathématiques: "#F97316",
  Sciences: "#22C55E",
  Histoire: "#A855F7",
  default: "#6B7280",
};

export default function HomeClient({
  announcements,
  homeworks,
}: {
  announcements: Announcement[];
  homeworks: Homework[];
}) {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Welcome Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          marginBottom: "2rem",
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
        }}
      >
        {/* Background decorations */}
        <div style={{ position: "absolute", top: "10px", left: "20px", fontSize: "3rem", opacity: 0.45 }}>⭐</div>
        <div style={{ position: "absolute", top: "20px", right: "30px", fontSize: "2.5rem", opacity: 0.45 }}>🌟</div>
        <div style={{ position: "absolute", bottom: "10px", left: "40px", fontSize: "2rem", opacity: 0.35 }}>📚</div>
        <div style={{ position: "absolute", bottom: "20px", right: "20px", fontSize: "2.5rem", opacity: 0.35 }}>✏️</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>🏫</p>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              color: "#FEF08A",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            Bienvenue sur le site de la classe !
          </h2>
          <p style={{ color: "#BFDBFE", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 1.25rem" }}>
            Retrouvez ici tous vos devoirs, leçons, ressources pédagogiques et les informations
            importantes. Bonne visite ! 🎒
          </p>

          {/* Live date pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              borderRadius: "2rem", padding: "0.45rem 1.1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}>
              <span style={{ fontSize: "1.1rem" }}>📅</span>
              <div style={{ textAlign: "left", lineHeight: 1.25 }}>
                <span style={{ display: "block", fontWeight: 900, fontSize: "0.95rem", color: "#FEF08A", textTransform: "capitalize" }}>
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long" })}
                </span>
                <span style={{ display: "block", fontWeight: 600, fontSize: "0.78rem", color: "#BFDBFE" }}>
                  {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/eleves"
              style={{
                background: "#FEF08A",
                color: "#1D4ED8",
                padding: "0.65rem 1.5rem",
                borderRadius: "2rem",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              🎒 Espace Élèves
            </Link>
            <Link
              href="/parents"
              style={{
                background: "#F97316",
                color: "white",
                padding: "0.65rem 1.5rem",
                borderRadius: "2rem",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              👨‍👩‍👧 Espace Parents
            </Link>
          </div>
        </div>
      </div>

      {/* Nav cards grid (like the design) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
          alignItems: "stretch",
        }}
      >
        <NavCard
          href="/"
          emoji="🏠"
          title="Accueil"
          subtitle="Actualités & Calendrier"
          bgColor="linear-gradient(135deg, #F97316, #EA580C)"
          borderColor="#F97316"
        />
        <NavCard
          href="/eleves"
          emoji="🎒"
          title="Espace Élèves"
          subtitle="Devoirs à Faire & Leçons"
          bgColor="linear-gradient(135deg, #F97316, #EA580C)"
          borderColor="#F97316"
        />
        <NavCard
          href="/parents"
          emoji="👨‍👩‍👧"
          title="Espace Parents"
          subtitle="Infos & Suivi"
          bgColor="linear-gradient(135deg, #2563EB, #1D4ED8)"
          borderColor="#2563EB"
        />
        <NavCard
          href="/enseignant"
          emoji="👩‍🏫"
          title="Espace Enseignant"
          subtitle="Planification & Corrections"
          bgColor="linear-gradient(135deg, #2563EB, #1D4ED8)"
          borderColor="#2563EB"
        />
        <NavCard
          href="/galerie"
          emoji="📸"
          title="Galerie Photos"
          subtitle="Albums de la Classe"
          bgColor="linear-gradient(135deg, #F97316, #EA580C)"
          borderColor="#F97316"
        />
        <NavCard
          href="/contact"
          emoji="✉️"
          title="Contact"
          subtitle="Nous Contacter"
          bgColor="linear-gradient(135deg, #2563EB, #1D4ED8)"
          borderColor="#2563EB"
        />
      </div>

      {/* Two column section: public + private */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Espace Public */}
        <div
          style={{
            border: "2px dashed #93C5FD",
            borderRadius: "1rem",
            background: "white",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #2563EB, #3B82F6)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.6rem",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            🌐 Espace Public ⭐⭐
          </div>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { href: "/", label: "🏠 Accueil" },
              { href: "/eleves", label: "🎒 Espace Élèves" },
              { href: "/parents", label: "👨‍👩‍👧 Espace Parents" },
              { href: "/galerie", label: "📸 Galerie Photos" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    color: "#2563EB",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.3rem",
                  }}
                >
                  <span style={{ color: "#93C5FD", minWidth: "16px" }}>▪</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Espace Privé Enseignant */}
        <div
          style={{
            border: "2px dashed #FED7AA",
            borderRadius: "1rem",
            background: "#FFF7ED",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #F97316, #EA580C)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.6rem",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            🔒 Espace Privé Enseignant ✉️ ⭐
          </div>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              "📊 Tableau de Bord",
              "📅 Programmations & Ressources",
              "✅ Corrections & Évaluations",
              "📄 Documents Confidentiels",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="/enseignant"
                  style={{
                    color: "#9A3412",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.3rem",
                  }}
                >
                  <span style={{ color: "#FDBA74", minWidth: "16px" }}>▪</span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>


      {/* Latest Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "#1D4ED8",
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            📢 Actualités Récentes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  border: `2px solid ${categoryColors[ann.category] || "#93C5FD"}`,
                  padding: "1rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      background: categoryColors[ann.category] || "#3B82F6",
                      color: "white",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {categoryLabels[ann.category] || ann.category}
                  </span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E293B", marginBottom: "0.4rem" }}>
                  {ann.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Homework */}
      {homeworks.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "#F97316",
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            📝 Devoirs à Venir
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {homeworks.map((hw) => (
              <div
                key={hw.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  border: `2px solid ${subjectColors[hw.subject] || subjectColors.default}`,
                  padding: "1rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    background: subjectColors[hw.subject] || subjectColors.default,
                    color: "white",
                    borderRadius: "0.5rem",
                    padding: "0.4rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    minWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  {hw.subject}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1E293B", marginBottom: "0.2rem" }}>
                    {hw.title}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>
                    📅 {new Date(hw.due_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    {" · "}
                    <span style={{ color: "#2563EB", fontWeight: 600 }}>{hw.level}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
