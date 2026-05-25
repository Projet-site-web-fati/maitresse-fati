"use client";
import { useState } from "react";
import Link from "next/link";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  color?: string | null;
}

interface Homework {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  due_date: string;
}

interface CalEvent {
  id: number;
  title: string;
  event_date: string;
  event_type: string;
}

interface Document {
  id: number;
  title: string;
  file_url: string | null;
  icon: string;
}

const categoryColors: Record<string, string> = {
  info: "#3B82F6",
  devoir: "#F97316",
  sortie: "#22C55E",
  reunion: "#A855F7",
};
const categoryIcons: Record<string, string> = {
  info: "ℹ️",
  devoir: "📝",
  sortie: "🚌",
  reunion: "👥",
};

const eventTypeColors: Record<string, string> = {
  info: "#3B82F6",
  devoir: "#F97316",
  sortie: "#22C55E",
  eval: "#EF4444",
  reunion: "#A855F7",
  fete: "#EC4899",
};

const tabs = [
  { id: "annonces", label: "📢 Annonces", color: "#2563EB" },
  { id: "devoirs", label: "📝 Suivi Devoirs", color: "#F97316" },
  { id: "planning", label: "📅 Calendrier", color: "#22C55E" },
  { id: "docs", label: "📄 Documents", color: "#A855F7" },
  { id: "conseils", label: "💡 Conseils", color: "#0891B2" },
];

const conseils = [
  {
    title: "🕒 L'organisation au quotidien",
    content:
      "Aidez votre enfant à préparer son cartable le soir. Réservez un moment calme et régulier pour les devoirs, idéalement après un temps de pause et un goûter.",
  },
  {
    title: "📖 La lecture, clé de la réussite",
    content:
      "15 minutes de lecture quotidienne font une grande différence. Choisissez des livres adaptés à l'âge de votre enfant et échangez avec lui sur ce qu'il a lu.",
  },
  {
    title: "✏️ L'écriture et les révisions",
    content:
      "Faites réviser les leçons à voix haute. La répétition espacée est une méthode efficace : revoir le lendemain, puis une semaine après.",
  },
  {
    title: "💬 La communication avec l'enseignant",
    content:
      "N'hésitez pas à me contacter si vous avez des questions ou des préoccupations. Le cahier de liaison est consulté chaque matin.",
  },
];

export default function ParentsClient({
  announcements,
  homeworks,
  events,
  documents,
}: {
  announcements: Announcement[];
  homeworks: Homework[];
  events: CalEvent[];
  documents: Document[];
}) {
  const [activeTab, setActiveTab] = useState("annonces");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextReunion = events.find(
    (e) => e.event_type === "reunion" && new Date(e.event_date + "T12:00:00") >= today
  );
  const reunionText = nextReunion
    ? new Date(nextReunion.event_date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    : "Aucune prévue";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "2rem",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
        }}
      >
        <span style={{ fontSize: "4rem" }}>👨‍👩‍👧</span>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FEF08A", margin: 0 }}>
            ⭐ Espace Parents ⭐
          </h1>
          <p style={{ color: "#BFDBFE", fontSize: "0.95rem", margin: "0.25rem 0 0" }}>
            Informations, suivi scolaire, calendrier et documents importants
          </p>
        </div>
      </div>

      {/* Quick info cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { icon: "🕗", title: "Horaires", value: "Lun-Ven : 8h00 – 16h30" },
          { icon: "📅", title: "Prochaine réunion", value: reunionText },
          { icon: "📝", title: "Devoirs en cours", value: `${homeworks.length} devoir(s)` },
          { icon: "✉️", title: "Nous contacter", value: "Via le formulaire" },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: "2px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.4rem" }}>{card.icon}</span>
            <p style={{ fontWeight: 700, color: "#94A3B8", fontSize: "0.78rem", margin: "0 0 0.2rem" }}>{card.title}</p>
            <p style={{ fontWeight: 800, color: "#1E293B", fontSize: "0.88rem" }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "0.75rem",
              border: "2px solid",
              borderColor: activeTab === tab.id ? tab.color : "#E2E8F0",
              background: activeTab === tab.id ? tab.color : "white",
              color: activeTab === tab.id ? "white" : "#64748B",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}44` : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Annonces */}
      {activeTab === "annonces" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {announcements.length === 0 ? (
            <EmptyState emoji="📢" message="Aucune annonce pour le moment." />
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  border: `2px solid ${ann.color || categoryColors[ann.category] || "#93C5FD"}`,
                  padding: "1.25rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    background: ann.color || categoryColors[ann.category] || "#3B82F6",
                    borderRadius: "0.6rem",
                    padding: "0.6rem",
                    fontSize: "1.4rem",
                    lineHeight: 1,
                  }}
                >
                  {categoryIcons[ann.category] || "📌"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "#1E293B", margin: 0 }}>{ann.title}</h3>
                    <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>
                      {new Date(ann.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </span>
                  </div>
                  <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
                    {ann.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Devoirs */}
      {activeTab === "devoirs" && (
        <div>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Suivez les devoirs de votre enfant et les échéances à venir.
          </p>
          {homeworks.length === 0 ? (
            <EmptyState emoji="🎉" message="Aucun devoir en cours !" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {homeworks.map((hw) => (
                <div
                  key={hw.id}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    border: "2px solid #FED7AA",
                    padding: "1rem 1.25rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#FFF7ED",
                      color: "#F97316",
                      border: "2px solid #FED7AA",
                      borderRadius: "0.5rem",
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hw.subject}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1E293B", margin: 0 }}>{hw.title}</p>
                    {hw.description && (
                      <p style={{ fontSize: "0.82rem", color: "#64748B", marginTop: "0.2rem" }}>{hw.description}</p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0 }}>Niveau : {hw.level}</p>
                    <p style={{ fontSize: "0.8rem", color: "#F97316", fontWeight: 700, margin: 0 }}>
                      📅{" "}
                      {new Date(hw.due_date + "T12:00:00").toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Planning / Calendrier */}
      {activeTab === "planning" && (
        <div>
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              border: "2px solid #BBF7D0",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #16A34A, #22C55E)",
                color: "white",
                padding: "0.75rem 1.25rem",
                fontWeight: 800,
                fontSize: "1rem",
              }}
            >
              📅 Dates &amp; Événements à Venir
            </div>
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {events.length === 0 ? (
                <p style={{ color: "#94A3B8", textAlign: "center", padding: "1.5rem 0", fontWeight: 600 }}>
                  Aucun événement prévu pour le moment.
                </p>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      padding: "0.6rem",
                      borderRadius: "0.6rem",
                      background: "#F8FAFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        background: eventTypeColors[ev.event_type] || "#6B7280",
                        color: "white",
                        borderRadius: "0.5rem",
                        padding: "0.3rem 0.6rem",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(ev.event_date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1E293B", margin: 0 }}>{ev.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "docs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {documents.length === 0 ? (
            <EmptyState emoji="📄" message="Aucun document disponible pour le moment." />
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  border: "2px solid #DDD6FE",
                  padding: "1rem 1.25rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
                className="nav-card"
              >
                <span style={{ fontSize: "2rem" }}>{doc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1E293B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "#A855F7", fontWeight: 600, marginTop: "0.15rem" }}>📄 PDF</p>
                </div>
                {doc.file_url ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#7C3AED",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.4rem 0.75rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ⬇ Ouvrir
                  </a>
                ) : (
                  <span
                    style={{
                      background: "#E2E8F0",
                      color: "#94A3B8",
                      borderRadius: "0.5rem",
                      padding: "0.4rem 0.75rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Bientôt
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Conseils */}
      {activeTab === "conseils" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {conseils.map((c, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "1rem",
                border: "2px solid #BAE6FD",
                padding: "1.25rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0369A1", marginBottom: "0.6rem" }}>
                {c.title}
              </h3>
              <p style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.7 }}>{c.content}</p>
            </div>
          ))}
          <div
            style={{
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              borderRadius: "1rem",
              padding: "1.25rem",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#FEF08A" }}>✉️ Une question ?</h3>
            <p style={{ fontSize: "0.87rem", color: "#BFDBFE", lineHeight: 1.6 }}>
              N&apos;hésitez pas à me contacter via le formulaire de contact ou le cahier de liaison pour tout
              renseignement.
            </p>
            <Link
              href="/contact"
              style={{
                background: "#FEF08A",
                color: "#1D4ED8",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                fontWeight: 800,
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                width: "fit-content",
              }}
            >
              ✉️ Nous contacter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "1rem",
        padding: "3rem",
        textAlign: "center",
        border: "2px dashed #E2E8F0",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{emoji}</div>
      <p style={{ color: "#94A3B8", fontWeight: 600, fontSize: "0.95rem" }}>{message}</p>
    </div>
  );
}
