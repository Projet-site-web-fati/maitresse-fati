import Link from "next/link";

interface NavCardProps {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  titleColor?: string;
}

export default function NavCard({
  href,
  emoji,
  title,
  subtitle,
  bgColor,
  borderColor,
  titleColor = "white",
}: NavCardProps) {
  return (
    <Link href={href} className="nav-card" style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "white",
          border: `3px solid ${borderColor}`,
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: bgColor,
            padding: "0.6rem 0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            minHeight: "68px",
          }}
        >
          <span style={{ fontSize: "1rem" }}>⭐</span>
          <span style={{ color: titleColor, fontWeight: 800, fontSize: "0.95rem", flex: 1, textAlign: "center" }}>
            {title}
          </span>
          <span style={{ fontSize: "1rem" }}>⭐</span>
        </div>

        {/* Emoji illustration area */}
        <div
          style={{
            background: "#F8FAFF",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minHeight: "10px",
          }}
        >
          <span style={{ fontSize: "5.5rem", lineHeight: 1 }}>{emoji}</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            padding: "0.6rem 0.8rem",
            textAlign: "center",
            background: "white",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#F97316",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </Link>
  );
}
