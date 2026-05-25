"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "info", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "info", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "2rem",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          boxShadow: "0 8px 32px rgba(8,145,178,0.25)",
        }}
      >
        <span style={{ fontSize: "4rem" }}>✉️</span>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FEF08A", margin: 0 }}>
            ⭐ Nous Contacter ⭐
          </h1>
          <p style={{ color: "#CFFAFE", fontSize: "0.95rem", margin: "0.25rem 0 0" }}>
            Une question, une remarque ? Envoyez-nous un message !
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Contact form */}
        <div
          style={{
            background: "white",
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "2px solid #CFFAFE",
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "1.1rem",
              color: "#0891B2",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            📨 Formulaire de Contact
          </h2>

          {status === "success" ? (
            <div
              style={{
                background: "#F0FDF4",
                border: "2px solid #BBF7D0",
                borderRadius: "1rem",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }}>✅</span>
              <h3 style={{ fontWeight: 800, color: "#16A34A", marginBottom: "0.5rem" }}>
                Message envoyé !
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                Merci pour votre message. Je vous répondrai dans les plus brefs délais.
              </p>
              <button
                onClick={() => setStatus("idle")}
                style={{
                  marginTop: "1rem",
                  background: "#16A34A",
                  color: "white",
                  border: "none",
                  borderRadius: "2rem",
                  padding: "0.5rem 1.25rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>👤 Votre nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Prénom NOM"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>📧 Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>📌 Sujet</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={inputStyle}
                >
                  <option value="info">ℹ️ Renseignement général</option>
                  <option value="devoir">📝 Question sur les devoirs</option>
                  <option value="reunion">📅 Demande de rendez-vous</option>
                  <option value="sortie">🚌 Sortie scolaire</option>
                  <option value="autre">💬 Autre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>💬 Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {status === "error" && (
                <p style={{ color: "#EF4444", fontSize: "0.85rem", fontWeight: 600 }}>
                  ❌ Une erreur est survenue. Veuillez réessayer.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  background: status === "loading" ? "#93C5FD" : "linear-gradient(135deg, #0891B2, #0E7490)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.85rem",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {status === "loading" ? "Envoi en cours..." : "📨 Envoyer le message"}
              </button>
            </form>
          )}
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Practical info */}
          <div
            style={{
              background: "white",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "2px solid #BFDBFE",
            }}
          >
            <h3 style={{ fontWeight: 800, color: "#2563EB", marginBottom: "1rem", fontSize: "0.95rem" }}>
              📌 Informations Pratiques
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { icon: "🕗", label: "Horaires de classe", value: "Lundi – Vendredi : 8h00 – 16h30" },
                { icon: "📅", label: "Réponses aux messages", value: "Dans les 24-48h (jours scolaires)" },
                { icon: "📓", label: "Cahier de liaison", value: "Consulté chaque matin" },
                { icon: "🚨", label: "Urgences", value: "Contacter directement l'établissement" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem", lineHeight: 1.2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#94A3B8", margin: 0 }}>{item.label}</p>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1E293B", margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              border: "2px solid #FED7AA",
            }}
          >
            <h3 style={{ fontWeight: 800, color: "#F97316", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
              💡 Bon à savoir
            </h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Pour les absences, contactez l'établissement directement.",
                "Le cahier de liaison est le canal principal de communication quotidienne.",
                "Les devoirs et ressources sont disponibles sur ce site dans l'Espace Élèves.",
                "Pour les urgences médicales, appelez le 15 ou le 112.",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#F97316", fontWeight: 800, minWidth: "16px" }}>•</span>
                  <span style={{ fontSize: "0.84rem", color: "#78350F", fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy notice */}
          <div
            style={{
              background: "#F5F3FF",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              border: "2px solid #DDD6FE",
            }}
          >
            <h3 style={{ fontWeight: 800, color: "#7C3AED", marginBottom: "0.5rem", fontSize: "0.88rem" }}>
              🔒 Protection des données
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748B", lineHeight: 1.6 }}>
              Les informations transmises via ce formulaire sont utilisées uniquement pour répondre à votre
              demande et ne sont pas partagées avec des tiers. Conformément au RGPD, vous disposez d&apos;un droit
              d&apos;accès, de rectification et de suppression de vos données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: "0.85rem",
  color: "#374151",
  marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: "0.65rem",
  border: "2px solid #E2E8F0",
  fontSize: "0.9rem",
  fontFamily: "'Nunito', sans-serif",
  outline: "none",
  transition: "border-color 0.2s",
};
