"use client";
import { useState } from "react";

interface Homework {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  due_date: string;
  file_url: string | null;
  color?: string | null;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  subject: string;
  level: string;
  chapter: string;
  file_url: string | null;
  color?: string | null;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  level: string;
  subject: string;
  type: string;
  file_url: string | null;
  color?: string | null;
}

const SUBJECTS = ["Tous", "Français", "Mathématiques", "Sciences", "Histoire-Géo"];
const LEVELS = ["Tous", "CE1", "CE2", "CM1", "CM2"];

const subjectColors: Record<string, string> = {
  Français: "#3B82F6",
  Mathématiques: "#F97316",
  Sciences: "#22C55E",
  "Histoire-Géo": "#A855F7",
  default: "#6B7280",
};

const typeIcons: Record<string, string> = {
  fiche: "📄",
  exercice: "✏️",
  leçon: "📚",
  audio: "🎧",
  correction: "✅",
  planification: "📅",
  default: "📁",
};

const tabs = [
  { id: "devoirs", label: "📝 Devoirs à Faire", color: "#F97316" },
  { id: "lecons", label: "📚 Mes Leçons", color: "#3B82F6" },
  { id: "ressources", label: "📂 Ressources", color: "#22C55E" },
  { id: "dictees", label: "🎧 Dictées Audio", color: "#A855F7" },
];

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
}
function isAudio(url: string) {
  return /\.(mp3|ogg|wav|m4a)$/i.test(url);
}

function FileAttachment({ url, color }: { url: string; color: string }) {
  if (!url) return null;
  if (isImage(url)) {
    return (
      <div style={{ marginTop: "1rem" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color, marginBottom: "0.4rem" }}>📎 Fichier joint</p>
        <img src={url} alt="Fichier joint" style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "0.75rem", border: `2px solid ${color}33`, objectFit: "contain" }} />
      </div>
    );
  }
  if (isAudio(url)) {
    return (
      <div style={{ marginTop: "1rem" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color, marginBottom: "0.4rem" }}>🎧 Fichier audio</p>
        <audio controls src={url} style={{ width: "100%" }} />
      </div>
    );
  }
  return (
    <div style={{ marginTop: "1rem" }}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        background: color, color: "white", borderRadius: "0.6rem",
        padding: "0.5rem 1rem", fontWeight: 700, fontSize: "0.85rem",
        textDecoration: "none",
      }}>
        📎 Ouvrir le fichier joint
      </a>
    </div>
  );
}

export default function ElevesClient({
  homeworks,
  lessons,
  resources,
}: {
  homeworks: Homework[];
  lessons: Lesson[];
  resources: Resource[];
}) {
  const [activeTab, setActiveTab] = useState("devoirs");
  const [filterSubject, setFilterSubject] = useState("Tous");
  const [filterLevel, setFilterLevel] = useState("Tous");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const filteredHomeworks = homeworks.filter(
    (hw) =>
      (filterSubject === "Tous" || hw.subject === filterSubject) &&
      (filterLevel === "Tous" || hw.level === filterLevel)
  );
  const filteredLessons = lessons.filter(
    (l) =>
      (filterSubject === "Tous" || l.subject === filterSubject) &&
      (filterLevel === "Tous" || l.level === filterLevel)
  );
  const filteredResources = resources.filter(
    (r) =>
      (filterSubject === "Tous" || r.subject === filterSubject) &&
      (filterLevel === "Tous" || r.level === filterLevel)
  );
  const audioResources = resources.filter(
    (r) =>
      r.type === "audio" &&
      (filterSubject === "Tous" || r.subject === filterSubject) &&
      (filterLevel === "Tous" || r.level === filterLevel)
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", borderRadius: "1.5rem", padding: "2rem", marginBottom: "2rem", color: "white", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", boxShadow: "0 8px 32px rgba(249,115,22,0.25)" }}>
        <span style={{ fontSize: "4rem" }}>🎒</span>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FEF08A", margin: 0 }}>⭐ Espace Élèves ⭐</h1>
          <p style={{ color: "#FEF3C7", fontSize: "0.95rem", margin: "0.25rem 0 0" }}>Devoirs à faire, leçons, exercices et ressources pédagogiques</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "1rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "#64748B", fontSize: "0.9rem" }}>🔍 Filtrer par :</span>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SUBJECTS.map((s) => (
            <button key={s} onClick={() => setFilterSubject(s)} style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: "2px solid", borderColor: filterSubject === s ? "#F97316" : "#E2E8F0", background: filterSubject === s ? "#FFF7ED" : "white", color: filterSubject === s ? "#F97316" : "#64748B", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setFilterLevel(l)} style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: "2px solid", borderColor: filterLevel === l ? "#3B82F6" : "#E2E8F0", background: filterLevel === l ? "#EFF6FF" : "white", color: filterLevel === l ? "#3B82F6" : "#64748B", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.75rem", border: "2px solid", borderColor: activeTab === tab.id ? tab.color : "#E2E8F0", background: activeTab === tab.id ? tab.color : "white", color: activeTab === tab.id ? "white" : "#64748B", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s", boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}44` : "none", fontFamily: "'Nunito',sans-serif" }}>{tab.label}</button>
        ))}
      </div>

      {/* ── DEVOIRS ── */}
      {activeTab === "devoirs" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#64748B", fontSize: "0.9rem", fontWeight: 600 }}>{filteredHomeworks.length} devoir(s) — <span style={{ color: "#94A3B8" }}>Cliquez sur une carte pour voir le détail</span></span>
          </div>
          {filteredHomeworks.length === 0 ? (
            <EmptyState emoji="🎉" message="Aucun devoir pour ces critères !" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredHomeworks.map((hw) => {
                const key = `hw-${hw.id}`;
                const open = expanded.has(key);
                const color = hw.color || subjectColors[hw.subject] || subjectColors.default;
                return (
                  <div key={hw.id} onClick={() => toggle(key)} style={{ background: "white", borderRadius: "1rem", border: `2px solid ${color}`, boxShadow: open ? `0 6px 24px ${color}22` : "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.2s", overflow: "hidden" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem 1.25rem" }}>
                      <div style={{ background: color, color: "white", borderRadius: "0.6rem", padding: "0.5rem 0.75rem", fontWeight: 800, fontSize: "0.8rem", textAlign: "center", minWidth: "80px", flexShrink: 0 }}>{hw.subject}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                          <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "#1E293B", margin: 0 }}>{hw.title}</h3>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.78rem", fontWeight: 700 }}>{hw.level}</span>
                            <span style={{ background: "#FFF7ED", color: "#F97316", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.78rem", fontWeight: 700 }}>
                              📅 {new Date(hw.due_date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                            </span>
                            {hw.file_url && <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.78rem", fontWeight: 700 }}>📎</span>}
                          </div>
                        </div>
                        {!open && hw.description && (
                          <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px" }} dangerouslySetInnerHTML={{ __html: hw.description }} />
                        )}
                      </div>
                      <span style={{ color: color, fontWeight: 700, fontSize: "1.1rem", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
                    </div>
                    {/* Expanded content */}
                    {open && (
                      <div style={{ padding: "0 1.25rem 1.25rem", borderTop: `2px solid ${color}20` }} onClick={e => e.stopPropagation()}>
                        {hw.description && (
                          <div style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.7, marginTop: "0.75rem" }} dangerouslySetInnerHTML={{ __html: hw.description }} />
                        )}
                        {hw.file_url && <FileAttachment url={hw.file_url} color={color} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── LEÇONS ── */}
      {activeTab === "lecons" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#64748B", fontSize: "0.9rem", fontWeight: 600 }}>{filteredLessons.length} leçon(s) — <span style={{ color: "#94A3B8" }}>Cliquez pour lire la leçon complète</span></span>
          </div>
          {filteredLessons.length === 0 ? (
            <EmptyState emoji="📖" message="Aucune leçon pour ces critères." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {filteredLessons.map((lesson) => {
                const key = `les-${lesson.id}`;
                const open = expanded.has(key);
                const color = lesson.color || subjectColors[lesson.subject] || subjectColors.default;
                return (
                  <div key={lesson.id} onClick={() => toggle(key)} style={{ background: "white", borderRadius: "1rem", border: `2px solid ${color}`, overflow: "hidden", boxShadow: open ? `0 6px 24px ${color}22` : "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.2s", gridColumn: open ? "1 / -1" : undefined }}>
                    <div style={{ background: color, color: "white", padding: "0.6rem 1rem", fontWeight: 800, fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>📚 {lesson.subject} – {lesson.level}</span>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        {lesson.file_url && <span style={{ background: "rgba(255,255,255,0.25)", padding: "0.15rem 0.5rem", borderRadius: "1rem", fontSize: "0.75rem" }}>📎</span>}
                        <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>{open ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      {lesson.chapter && <p style={{ color: "#94A3B8", fontSize: "0.78rem", marginBottom: "0.4rem", fontWeight: 600 }}>{lesson.chapter}</p>}
                      <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E293B", marginBottom: open ? "0.75rem" : "0.4rem" }}>{lesson.title}</h3>
                      {!open && (
                        <div style={{ color: "#94A3B8", fontSize: "0.82rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} dangerouslySetInnerHTML={{ __html: lesson.content }} />
                      )}
                      {open && (
                        <div onClick={e => e.stopPropagation()}>
                          <div style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.8, borderTop: `2px solid ${color}20`, paddingTop: "0.75rem" }} dangerouslySetInnerHTML={{ __html: lesson.content }} />
                          {lesson.file_url && <FileAttachment url={lesson.file_url} color={color} />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── RESSOURCES ── */}
      {activeTab === "ressources" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#64748B", fontSize: "0.9rem", fontWeight: 600 }}>{filteredResources.length} ressource(s) — <span style={{ color: "#94A3B8" }}>Cliquez pour accéder au fichier</span></span>
          </div>
          {filteredResources.length === 0 ? (
            <EmptyState emoji="📂" message="Aucune ressource pour ces critères." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filteredResources.map((res) => {
                const key = `res-${res.id}`;
                const open = expanded.has(key);
                const color = res.color || subjectColors[res.subject] || subjectColors.default;
                return (
                  <div key={res.id} onClick={() => toggle(key)} style={{ background: "white", borderRadius: "1rem", border: open ? `2px solid ${color}` : "2px solid #E2E8F0", padding: "1rem", boxShadow: open ? `0 6px 24px ${color}22` : "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.2s", gridColumn: open ? "1 / -1" : undefined }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "2rem", flexShrink: 0 }}>{typeIcons[res.type] || typeIcons.default}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                          <span style={{ background: `${color}20`, color, padding: "0.15rem 0.5rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700 }}>{res.subject}</span>
                          <span style={{ background: "#EFF6FF", color: "#3B82F6", padding: "0.15rem 0.5rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700 }}>{res.level}</span>
                          {res.file_url && <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "0.15rem 0.5rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700 }}>📎 Fichier</span>}
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1E293B", margin: "0 0 0.3rem" }}>{res.title}</h3>
                        {res.description && <p style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.4, margin: 0 }}>{res.description}</p>}
                      </div>
                      <span style={{ color: open ? color : "#94A3B8", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
                    </div>
                    {open && (
                      <div style={{ marginTop: "1rem", borderTop: "2px solid #F1F5F9", paddingTop: "0.75rem" }} onClick={e => e.stopPropagation()}>
                        {res.description && <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.6, marginBottom: res.file_url ? "0" : "0" }}>{res.description}</p>}
                        {res.file_url
                          ? <FileAttachment url={res.file_url} color={color} />
                          : <p style={{ fontSize: "0.82rem", color: "#94A3B8", fontStyle: "italic", marginTop: "0.5rem" }}>🔒 Fichier non disponible pour le moment.</p>
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── DICTÉES AUDIO ── */}
      {activeTab === "dictees" && (
        <div>
          {audioResources.length === 0 ? (
            <EmptyState emoji="🎧" message="Aucune dictée audio disponible pour le moment." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {audioResources.map((res) => (
                <div key={res.id} style={{ background: "white", borderRadius: "1rem", border: "2px solid #DDD6FE", padding: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "2.5rem" }}>🎧</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E293B", marginBottom: "0.2rem" }}>{res.title}</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748B" }}>{res.level} · {res.subject}</p>
                    {res.description && <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>{res.description}</p>}
                    {res.file_url && isAudio(res.file_url) && (
                      <audio controls src={res.file_url} style={{ width: "100%", marginTop: "0.75rem" }} />
                    )}
                  </div>
                  {res.file_url ? (
                    !isAudio(res.file_url) ? (
                      <a href={res.file_url} target="_blank" rel="noopener noreferrer" style={{ background: "#7C3AED", color: "white", borderRadius: "2rem", padding: "0.5rem 1rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", whiteSpace: "nowrap" }}>▶ Écouter</a>
                    ) : null
                  ) : (
                    <span style={{ background: "#E2E8F0", color: "#94A3B8", borderRadius: "2rem", padding: "0.5rem 1rem", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>🔒 Bientôt disponible</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <div style={{ background: "white", borderRadius: "1rem", padding: "3rem", textAlign: "center", border: "2px dashed #E2E8F0" }}>
      <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{emoji}</div>
      <p style={{ color: "#94A3B8", fontWeight: 600, fontSize: "0.95rem" }}>{message}</p>
    </div>
  );
}
