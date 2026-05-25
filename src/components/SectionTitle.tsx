interface SectionTitleProps {
  children: React.ReactNode;
  color?: "blue" | "orange" | "green" | "purple";
  icon?: string;
}

const colorMap = {
  blue: "linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)",
  orange: "linear-gradient(90deg, #F97316 0%, #FB923C 100%)",
  green: "linear-gradient(90deg, #16A34A 0%, #22C55E 100%)",
  purple: "linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)",
};

export default function SectionTitle({ children, color = "blue", icon }: SectionTitleProps) {
  return (
    <div
      style={{
        background: colorMap[color],
        color: "white",
        padding: "0.5rem 1.25rem",
        borderRadius: "0.75rem",
        fontWeight: 800,
        fontSize: "1.05rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}
