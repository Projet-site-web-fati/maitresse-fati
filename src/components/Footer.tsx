"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
        color: "white",
        padding: "2rem 1.5rem 1rem",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              fontWeight: 900,
              fontSize: "1.1rem",
              color: "#FEF08A",
              marginBottom: "0.75rem",
            }}
          >
            🏫 Maitresse FATI
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#BFDBFE", lineHeight: 1.6 }}>
            Un espace pédagogique dédié aux élèves et à leurs familles,
            pour apprendre avec plaisir chaque jour.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontWeight: 800, color: "#FEF08A", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
            ⭐ Accès rapide
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { href: "/eleves", label: "🎒 Espace Élèves" },
              { href: "/parents", label: "👨‍👩‍👧 Espace Parents" },
              { href: "/galerie", label: "📸 Galerie Photos" },
              { href: "/contact", label: "✉️ Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    color: "#BFDBFE",
                    fontSize: "0.85rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#BFDBFE")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Infos */}
        <div>
          <h4 style={{ fontWeight: 800, color: "#FEF08A", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
            📌 Infos pratiques
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#BFDBFE", lineHeight: 1.7 }}>
            📅 Lundi – Vendredi<br />
            🕗 8h00 – 16h30<br />
            📧 Contactez-nous via le formulaire<br />
            🔒 Données sécurisées (RGPD)
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "1.5rem auto 0",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#93C5FD" }}>
          © {new Date().getFullYear()} Les Classes de Maitresse FATI – Tous droits réservés
        </p>
        <p style={{ fontSize: "0.8rem", color: "#93C5FD" }}>
          ❤️ Fait avec amour pour mes élèves
        </p>
      </div>
    </footer>
  );
}
