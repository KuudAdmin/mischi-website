"use client";

// Pixels to crop from the top of each 1080-tall gif to hide the macOS menu bar.
const GIF_CROP_TOP = 64;

interface Showcase {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  gif: string;
  points: string[];
}

// Four alternating media ↔ text rows. Each gif is a looping screen
// recording of Mischi, framed like a captured recording.
const SHOWCASES: Showcase[] = [
  {
    id: "conversational",
    eyebrow: "Conversational",
    title: "Talk to it — it talks back",
    body: "Mischi isn't just decoration. Strike up a conversation and your pet answers in its own voice, right there on your desktop. No window to open, no tab to find.",
    gif: "/features/conversational.gif",
    points: ["Lives on your desktop", "Responds in context", "Always within reach"],
  },
  {
    id: "ai",
    eyebrow: "AI-powered · BYOK",
    title: "Bring your own model",
    body: "Plug in any LLM. Drop in your API key, pick a model, and Mischi runs entirely on your terms. Press ⌘K to open chat from anywhere, anytime.",
    gif: "/features/ai-chat.gif",
    points: ["Any provider, your key", "Pick your model", "⌘K to open chat"],
  },
  {
    id: "animations",
    eyebrow: "Animations",
    title: "Every move, yours to script",
    body: "Idle, walk, wave, jump — map each animation to behaviors and chat lines. Tune how your pet reacts until it has a personality that feels genuinely alive.",
    gif: "/features/chatlines.gif",
    points: ["Idle, walk, wave, jump", "Map your own chat lines", "Reactions that fit you"],
  },
  {
    id: "change-pet",
    eyebrow: "Your collection",
    title: "Swap pets whenever",
    body: "Switch between any pet you've imported in a single click. Build a roster and change the vibe of your desktop on a whim — a focused cat now, a playful blob later.",
    gif: "/features/change-pet.gif",
    points: ["One-click switching", "Unlimited roster", "Import any format"],
  },
];

interface Capability {
  title: string;
  body: string;
  icon: string;
}

// Everything else — the platform & privacy story, no recordings needed.
const CAPABILITIES: Capability[] = [
  {
    icon: "⚡",
    title: "Offline-first",
    body: "Everything runs locally. No server calls, no cloud, no internet required.",
  },
  {
    icon: "✦",
    title: "Transparent rendering",
    body: "Pets render on a transparent layer — they live on your desktop, not in a box.",
  },
  {
    icon: "◈",
    title: "Always-on-top",
    body: "Stays visible across every Space and full-screen app without blocking a thing.",
  },
  {
    icon: "≡",
    title: "Menu bar controls",
    body: "Pause, hide, or switch behavior modes straight from the macOS menu bar.",
  },
  {
    icon: "☽",
    title: "No telemetry",
    body: "Zero analytics, zero tracking. What runs on your Mac stays on your Mac.",
  },
  {
    icon: "◆",
    title: "Apple Silicon native",
    body: "Built for M-series, smooth on Intel too. macOS 13 and up.",
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
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
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
            See Mischi in action
          </h2>
        </div>

        {/* Alternating showcase rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(72px, 9vw, 128px)",
          }}
        >
          {SHOWCASES.map((s, i) => (
            <ShowcaseRow key={s.id} {...s} reverse={i % 2 === 1} index={i} />
          ))}
        </div>

        {/* Remaining capabilities — no recordings */}
        <div style={{ marginTop: "clamp(80px, 10vw, 140px)" }}>
          <p
            style={{
              fontSize: "0.71875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-dim)",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            And everything under the hood
          </p>
          <div
            className="cap-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {CAPABILITIES.map((c) => (
              <CapabilityCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .showcase-row { flex-direction: column !important; gap: 28px !important; }
          .showcase-text { text-align: left !important; }
        }
        @media (max-width: 720px) {
          .cap-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 440px) {
          .cap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ShowcaseRow({
  eyebrow,
  title,
  body,
  gif,
  points,
  reverse,
  index,
}: Showcase & { reverse: boolean; index: number }) {
  return (
    <div
      className="showcase-row"
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        alignItems: "center",
        gap: "clamp(32px, 5vw, 64px)",
      }}
    >
      {/* Media — looping recording. The frame is a touch shorter than the
          gif (1664×1080) and the image is bottom-anchored with object-fit
          cover, so the macOS menu bar strip at the top is cropped out. */}
      <div className="showcase-media" style={{ flex: "1.18 1 0", minWidth: 0 }}>
        <div
          style={{
            position: "relative",
            aspectRatio: `1664 / ${1080 - GIF_CROP_TOP}`,
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "1px solid var(--color-border-strong)",
            boxShadow: "var(--shadow-window)",
            background: "var(--color-surface-sunken)",
          }}
        >
          {/* Looping screen recording */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gif}
            alt={`${title} — screen recording of Mischi`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            width={1664}
            height={1080}
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center bottom",
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="showcase-text" style={{ flex: "0.92 1 0", minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.71875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "14px",
          }}
        >
          {eyebrow}
        </p>
        <h3
          style={{
            fontSize: "clamp(1.35rem, 1rem + 1.4vw, 1.85rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.12,
            color: "var(--color-text)",
            marginBottom: "16px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "var(--color-text-muted)",
            marginBottom: "24px",
            maxWidth: "44ch",
          }}
        >
          {body}
        </p>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {points.map((point) => (
            <li
              key={point}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.875rem",
                color: "var(--color-text)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "var(--color-accent-dim)",
                  color: "var(--color-accent)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CapabilityCard({ icon, title, body }: Capability) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        transition: "border-color var(--dur-normal), background var(--dur-normal)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(81, 139, 112, 0.35)";
        el.style.background = "var(--color-surface-raised)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--color-border)";
        el.style.background = "var(--color-surface)";
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-sunken)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-muted)",
          fontSize: "1.125rem",
          marginBottom: "16px",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h4
        style={{
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: "var(--color-text)",
          marginBottom: "6px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>
    </div>
  );
}
