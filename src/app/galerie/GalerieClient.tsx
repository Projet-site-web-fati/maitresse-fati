"use client";
import { useState, useEffect, useCallback } from "react";

interface Photo {
  id: number;
  title: string;
  description: string;
  album: string;
  image_url: string;
  created_at: string;
}

const albumColors = ["#F97316","#22C55E","#3B82F6","#A855F7","#EC4899","#0891B2","#EAB308","#DC2626"];

export default function GalerieClient({ photos, albums }: { photos: Photo[]; albums: string[] }) {
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const albumPhotos = openAlbum ? photos.filter(p => p.album === openAlbum) : [];
  const current = albumPhotos[idx] ?? null;

  const prev = useCallback(() => setIdx(i => (i - 1 + albumPhotos.length) % albumPhotos.length), [albumPhotos.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % albumPhotos.length), [albumPhotos.length]);
  const close = useCallback(() => setOpenAlbum(null), []);

  useEffect(() => {
    if (!openAlbum) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAlbum, prev, next, close]);

  function handleAlbum(album: string) {
    setOpenAlbum(album);
    setIdx(0);
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)", borderRadius: "1.5rem", padding: "2rem", marginBottom: "2rem", color: "white", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", boxShadow: "0 8px 32px rgba(168,85,247,0.25)" }}>
        <span style={{ fontSize: "4rem" }}>📸</span>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FEF08A", margin: 0 }}>⭐ Galerie Photos ⭐</h1>
          <p style={{ color: "#E9D5FF", fontSize: "0.95rem", margin: "0.25rem 0 0" }}>Albums de la classe – moments précieux et souvenirs partagés 🌟</p>
        </div>
      </div>

      {/* Albums grid */}
      {albums.length === 0 ? (
        <div style={{ background: "white", borderRadius: "1rem", padding: "4rem", textAlign: "center", border: "2px dashed #DDD6FE" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📷</span>
          <p style={{ color: "#94A3B8", fontWeight: 600 }}>Aucun album pour le moment.</p>
        </div>
      ) : (
        <>
          <p style={{ color: "#64748B", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            {albums.length} album{albums.length > 1 ? "s" : ""} · {photos.length} photo{photos.length > 1 ? "s" : ""}
            <span style={{ color: "#94A3B8", marginLeft: "0.5rem" }}>— Cliquez sur un album pour le parcourir</span>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {albums.map((album, i) => {
              const albumList = photos.filter(p => p.album === album);
              const color = albumColors[i % albumColors.length];
              const thumb = albumList.find(p => p.image_url && !p.image_url.includes("placeholder"));
              return (
                <div key={album} onClick={() => handleAlbum(album)} className="nav-card" style={{ background: "white", borderRadius: "1.25rem", overflow: "hidden", border: `2px solid ${color}33`, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", cursor: "pointer", transition: "all 0.2s" }}>
                  {/* Thumbnail mosaic */}
                  <div style={{ height: "180px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${color}25, ${color}50)` }}>
                    {thumb
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={thumb.image_url} alt={album} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", opacity: 0.6 }}>📸</div>
                    }
                    {/* Count badge */}
                    <div style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", background: "rgba(0,0,0,0.55)", color: "white", borderRadius: "1rem", padding: "0.2rem 0.65rem", fontSize: "0.78rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                      {albumList.length} photo{albumList.length > 1 ? "s" : ""}
                    </div>
                    {/* Mini strip of extra photos */}
                    {albumList.length > 1 && (
                      <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", display: "flex", gap: "3px" }}>
                        {albumList.slice(0, 3).map((p, j) => (
                          p.image_url && !p.image_url.includes("placeholder") && j > 0
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img key={p.id} src={p.image_url} alt="" style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px", border: "2px solid white", opacity: 0.85 }} />
                            : null
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ padding: "0.9rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ fontWeight: 900, fontSize: "1rem", color: "#1E293B", margin: "0 0 0.2rem" }}>📂 {album}</h3>
                        <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0 }}>{albumList.length} photo{albumList.length > 1 ? "s" : ""}</p>
                      </div>
                      <span style={{ background: `${color}20`, color, borderRadius: "0.6rem", padding: "0.3rem 0.7rem", fontWeight: 700, fontSize: "0.8rem" }}>Voir ▶</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Fullscreen album viewer ── */}
      {openAlbum && current && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 1000, display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "rgba(0,0,0,0.5)", flexShrink: 0 }}>
            <div style={{ color: "white" }}>
              <span style={{ fontWeight: 900, fontSize: "1rem" }}>📂 {openAlbum}</span>
              <span style={{ color: "#94A3B8", fontSize: "0.85rem", marginLeft: "0.75rem" }}>{idx + 1} / {albumPhotos.length}</span>
            </div>
            <button onClick={close} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", borderRadius: "0.5rem", padding: "0.4rem 0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Nunito',sans-serif" }}>✕ Fermer</button>
          </div>

          {/* Main image area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0, padding: "0.75rem" }}>
            {/* Prev button */}
            {albumPhotos.length > 1 && (
              <button onClick={prev} style={{ position: "absolute", left: "1rem", zIndex: 10, background: "rgba(255,255,255,0.18)", border: "none", color: "white", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>‹</button>
            )}
            {/* Image */}
            <div style={{ maxWidth: "900px", width: "100%", textAlign: "center" }}>
              {current.image_url && !current.image_url.includes("placeholder")
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={current.image_url} alt={current.title} style={{ maxHeight: "calc(100vh - 220px)", maxWidth: "100%", objectFit: "contain", borderRadius: "0.75rem", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }} />
                : <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem", opacity: 0.5 }}>📸</div>
              }
              {/* Caption */}
              {(current.title !== openAlbum || current.description) && (
                <div style={{ marginTop: "0.75rem", color: "white" }}>
                  {current.title !== openAlbum && <p style={{ fontWeight: 800, fontSize: "1rem", margin: "0 0 0.2rem" }}>{current.title}</p>}
                  {current.description && <p style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: 0 }}>{current.description}</p>}
                </div>
              )}
            </div>
            {/* Next button */}
            {albumPhotos.length > 1 && (
              <button onClick={next} style={{ position: "absolute", right: "1rem", zIndex: 10, background: "rgba(255,255,255,0.18)", border: "none", color: "white", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>›</button>
            )}
          </div>

          {/* Thumbnail strip */}
          {albumPhotos.length > 1 && (
            <div style={{ flexShrink: 0, display: "flex", gap: "0.4rem", overflowX: "auto", padding: "0.6rem 1rem", background: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
              {albumPhotos.map((p, i) => (
                <div key={p.id} onClick={() => setIdx(i)} style={{ flexShrink: 0, width: "60px", height: "60px", borderRadius: "0.4rem", overflow: "hidden", cursor: "pointer", border: i === idx ? "2px solid white" : "2px solid rgba(255,255,255,0.2)", opacity: i === idx ? 1 : 0.55, transition: "all 0.15s" }}>
                  {p.image_url && !p.image_url.includes("placeholder")
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📸</div>
                  }
                </div>
              ))}
            </div>
          )}

          {/* Keyboard hint */}
          {albumPhotos.length > 1 && (
            <div style={{ flexShrink: 0, textAlign: "center", padding: "0.3rem", color: "#475569", fontSize: "0.72rem" }}>← → pour naviguer · Échap pour fermer</div>
          )}
        </div>
      )}
    </div>
  );
}
