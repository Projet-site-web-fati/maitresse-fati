"use client";
import { useState } from "react";
import EnseignantDashboard from "./EnseignantDashboard";

export default function EnseignantPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setError("Mot de passe incorrect. Veuillez réessayer.");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
    setLoading(false);
  };

  if (authenticated) {
    return <EnseignantDashboard onLogout={() => setAuthenticated(false)} />;
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 16px 48px rgba(37,99,235,0.15)",
          border: "3px solid #BFDBFE",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>👩‍🏫</div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "1.5rem",
              color: "#1D4ED8",
              margin: "0 0 0.25rem",
            }}
          >
            Espace Enseignant
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem" }}>
            🔒 Accès réservé à Maitresse FATI
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#374151", marginBottom: "0.4rem" }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: error ? "2px solid #EF4444" : "2px solid #E2E8F0",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "'Nunito', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = "#3B82F6"; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = "#E2E8F0"; }}
            />
            {error && (
              <p style={{ color: "#EF4444", fontSize: "0.82rem", marginTop: "0.4rem", fontWeight: 600 }}>
                ❌ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.85rem",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Vérification..." : "🔐 Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
