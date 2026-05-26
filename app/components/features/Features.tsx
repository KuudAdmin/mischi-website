"use client";

type Variant = "banner" | "tall" | "wide" | "normal";

interface Feature {
  id: string;
  title: string;
  body: string;
  icon: string;
  col: string;
  row: string;
  variant: Variant;
  accent?: boolean;
}

// 3-col × 5-row explicit bento layout
// Row 1: [offline    3×1    ]
// Row 2: [transp 1×2][ontop ][menubar]
// Row 3: [transp     ][modes 2×1    ]
// Row 4: [import 2×1 ][notelemetry 1×2]
// Row 5: [silicon 2×1][notelemetry  ]
const FEATURES: Feature[] = [
  {
    id: "offline",
    title: "Offline-first",
    body: "Everything runs locally. No server calls, no cloud, no internet required. Your pets work at 35,000 ft.",
    icon: "⚡",
    col: "1 / 4",
    row: "1",
    variant: "banner",
  },
  {
    id: "transparent",
    title: "Transparent rendering",
    body: "Pets render on a transparent window layer — they live on your actual desktop, not inside a box.",
    icon: "✦",
    col: "1",
    row: "2 / 4",
    variant: "tall",
    accent: true,
  },
  {
    id: "ontop",
    title: "Always-on-top",
    body: "Stays visible across all Spaces and full-screen apps without blocking anything.",
    icon: "◈",
    col: "2",
    row: "2",
    variant: "normal",
  },
  {
    id: "menubar",
    title: "Menu bar controls",
    body: "Pause, hide, or switch behavior modes from the macOS menu bar.",
    icon: "≡",
    col: "3",
    row: "2",
    variant: "normal",
  },
  {
    id: "modes",
    title: "Behavior modes",
    body: "Focus, idle wandering, reactive — your pet adapts to how you work.",
    icon: "◎",
    col: "2 / 4",
    row: "3",
    variant: "wide",
    accent: true,
  },
  {
    id: "import",
    title: "Import any format",
    body: "Drag in a folder, .zip, or individual files. Supports PNG spritesheets and Codex packs.",
    icon: "↓",
    col: "1 / 3",
    row: "4",
    variant: "wide",
  },
  {
    id: "notelemetry",
    title: "No telemetry",
    body: "Zero analytics, zero tracking. What runs on your Mac stays on your Mac.",
    icon: "☽",
    col: "3",
    row: "4 / 6",
    variant: "tall",
  },
  {
    id: "silicon",
    title: "Apple Silicon native",
    body: "Built for M-series. Runs smooth on Intel too. macOS 13+.",
    icon: "◆",
    col: "1 / 3",
    row: "5",
    variant: "wide",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="section-pad"
      style={{
        paddingInline: "24px",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            style={{
              fontSize: "0.71875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "12px",
            }}
          >
            Features
          </p>
          <h2
            id="features-heading"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--color-text)",
            }}
          >
            Built for your desktop
          </h2>
        </div>

        <div
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "minmax(152px, auto)",
            gap: "10px",
          }}
        >
          {FEATURES.map((feat) => (
            <FeatureCard key={feat.id} {...feat} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: minmax(140px, auto) !important;
          }
          .bento-grid > * {
            grid-column: auto !important;
            grid-row: auto !important;
          }
        }
        @media (max-width: 440px) {
          .bento-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function getBg(variant: Variant, accent?: boolean): string {
  if (variant === "banner")
    return "linear-gradient(130deg, oklch(12% 0.018 65) 0%, oklch(8% 0.01 50) 100%)";
  if (variant === "tall" && accent)
    return "linear-gradient(160deg, oklch(13% 0.016 78) 0%, oklch(9% 0.01 60) 100%)";
  if (variant === "tall")
    return "linear-gradient(160deg, oklch(11% 0.006 240) 0%, oklch(8% 0.004 220) 100%)";
  if (variant === "wide" && accent)
    return "linear-gradient(105deg, oklch(14% 0.016 78) 0%, oklch(11% 0.01 60) 100%)";
  return "oklch(100% 0 0 / 0.025)";
}

function FeatureCard({
  title,
  body,
  icon,
  col,
  row,
  variant,
  accent,
}: Feature) {
  const isBanner = variant === "banner";
  const isTall = variant === "tall";
  const isWide = variant === "wide";
  const isDark = isBanner || isTall || (isWide && accent);
  const isCool = isTall && !accent;

  const borderColor = isCool
    ? "oklch(60% 0.08 240 / 0.18)"
    : isDark
      ? "oklch(74% 0.16 78 / 0.15)"
      : "var(--color-border)";

  const borderHover = isCool
    ? "oklch(60% 0.08 240 / 0.35)"
    : isDark
      ? "oklch(74% 0.16 78 / 0.32)"
      : "oklch(74% 0.16 78 / 0.2)";

  const glowColor = isCool
    ? "oklch(60% 0.12 240 / 0.12)"
    : "oklch(74% 0.16 78 / 0.14)";

  const iconColor = isCool
    ? "oklch(72% 0.08 240)"
    : isDark
      ? "var(--color-accent)"
      : "var(--color-text-muted)";

  const iconBorder = isCool
    ? "oklch(60% 0.08 240 / 0.25)"
    : isDark
      ? "oklch(74% 0.16 78 / 0.24)"
      : "var(--color-border)";

  const titleColor = isCool
    ? "oklch(92% 0.005 220)"
    : isDark
      ? "oklch(94% 0.012 78)"
      : "var(--color-text)";

  const bodyColor = isCool
    ? "oklch(62% 0.01 220)"
    : isDark
      ? "oklch(66% 0.02 78)"
      : "var(--color-text-muted)";

  const iconSize = isBanner
    ? "1.625rem"
    : isTall
      ? "1.25rem"
      : isWide
        ? "1.125rem"
        : "1rem";
  const boxSize = isBanner ? 56 : isTall ? 44 : isWide ? 40 : 36;

  return (
    <div
      style={{
        gridColumn: col,
        gridRow: row,
        padding: isBanner
          ? "24px 32px"
          : isTall
            ? "28px 24px"
            : isWide
              ? "24px 28px"
              : "22px",
        borderRadius: "var(--radius-lg)",
        background: getBg(variant, accent),
        border: `1px solid ${borderColor}`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: isBanner || isWide ? "row" : "column",
        alignItems: isBanner || isWide ? "center" : "flex-start",
        justifyContent: isTall ? "space-between" : "flex-start",
        gap: isBanner ? "24px" : isWide ? "20px" : "0",
        transition:
          "border-color var(--dur-normal), transform var(--dur-normal)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = borderHover;
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = borderColor;
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Ambient glow */}
      {isDark && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: isBanner ? "-30px" : isTall ? "0" : "-30px",
            right: "-30px",
            width: isBanner ? "260px" : "180px",
            height: isBanner ? "180px" : "180px",
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Dot-grid for tall cards */}
      {isTall && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle, oklch(100% 0 0) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: boxSize,
          height: boxSize,
          borderRadius: "var(--radius-md)",
          background: isDark
            ? `oklch(74% 0.16 78 / ${isCool ? "0.05" : "0.13"})`
            : "oklch(100% 0 0 / 0.05)",
          border: `1px solid ${iconBorder}`,
          fontSize: iconSize,
          flexShrink: 0,
          marginBottom: isBanner || isWide ? "0" : isTall ? "0" : "16px",
          color: iconColor,
        }}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* Text group */}
      <div style={{ flex: 1, marginTop: isTall ? "12px" : 0 }}>
        <h3
          style={{
            fontSize: isBanner ? "1.0625rem" : "0.9375rem",
            fontWeight: 700,
            color: titleColor,
            marginBottom: "6px",
            letterSpacing: isBanner ? "-0.02em" : "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.8125rem",
            color: bodyColor,
            lineHeight: 1.65,
          }}
        >
          {body}
        </p>
      </div>

      {/* Badge for banner */}
      {isBanner && (
        <div
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "999px",
            background: "oklch(74% 0.16 78 / 0.1)",
            border: "1px solid oklch(74% 0.16 78 / 0.2)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.71875rem",
              color: "var(--color-accent)",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            No internet needed
          </span>
        </div>
      )}
    </div>
  );
}
