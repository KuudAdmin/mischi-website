"use client";

import { useState, useCallback } from "react";
import PetCanvas from "./PetCanvas";
import MacWindow from "../hero/MacWindow";

type AnimState =
  | "idle"
  | "runRight"
  | "runLeft"
  | "wave"
  | "jump"
  | "tired"
  | "waiting"
  | "dancing"
  | "review";

const STATES_LIST: { state: AnimState; label: string; hint: string }[] = [
  { state: "idle", label: "Idle", hint: "default" },
  { state: "wave", label: "Wave", hint: "click pet" },
  { state: "jump", label: "Jump", hint: "double-click" },
  { state: "runRight", label: "Run →", hint: "button" },
  { state: "runLeft", label: "Run ←", hint: "button" },
  { state: "dancing", label: "Dance", hint: "button" },
  { state: "waiting", label: "Waiting", hint: "button" },
  { state: "tired", label: "Tired", hint: "auto after idle" },
  { state: "review", label: "Review", hint: "button" },
];

export default function PetDemo() {
  const [petState, setPetState] = useState<AnimState>("idle");

  const trigger = useCallback((s: AnimState) => setPetState(s), []);

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="section-pad"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingInline: "24px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, oklch(74% 0.16 78 / 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
            Live Demo
          </p>
          <h2
            id="demo-heading"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--color-text)",
              marginBottom: "14px",
            }}
          >
            Meet your new companion
          </h2>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-muted)",
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Click, double-click, or trigger states below.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "36px",
            alignItems: "center",
          }}
        >
          {/* Window */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MacWindow
              title="Mischi.app"
              width={360}
              statusBar={
                <>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        petState === "tired"
                          ? "var(--color-text-dim)"
                          : "var(--color-mac-green)",
                      display: "inline-block",
                      transition: "background 0.3s",
                    }}
                  />
                  <span>Active</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--color-text-dim)",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "0.6875rem",
                    }}
                  >
                    {petState === "runRight"
                      ? "run →"
                      : petState === "runLeft"
                        ? "run ←"
                        : petState}
                  </span>
                </>
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "450px",
                  padding: "24px",
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 75%, oklch(74% 0.16 78 / 0.07) 0%, transparent 70%)",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.08,
                    background: `
                      repeating-linear-gradient(0deg, transparent, transparent 47px, oklch(100% 0 0 / 0.1) 47px, oklch(100% 0 0 / 0.1) 48px),
                      repeating-linear-gradient(90deg, transparent, transparent 47px, oklch(100% 0 0 / 0.1) 47px, oklch(100% 0 0 / 0.1) 48px)
                    `,
                  }}
                />
                <PetCanvas
                  state={petState}
                  onStateChange={(s) => setPetState(s as AnimState)}
                  interactive
                  scale={0.8}
                  spritesheet="/spritesheet_cat.webp"
                  repeatShortAnims
                  style={{ position: "relative", zIndex: 1 }}
                />
              </div>
            </MacWindow>
          </div>

          {/* Controls */}
          <div>
            <p
              style={{
                fontSize: "0.71875rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "16px",
              }}
            >
              Trigger states
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {STATES_LIST.map(({ state, label, hint }) => (
                <button
                  key={state}
                  onClick={() => trigger(state)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 16px",
                    borderRadius: "var(--radius-md)",
                    background:
                      petState === state
                        ? "var(--color-accent-dim)"
                        : "oklch(100% 0 0 / 0.03)",
                    border: `1px solid ${petState === state ? "oklch(74% 0.16 78 / 0.3)" : "var(--color-border)"}`,
                    cursor: "pointer",
                    transition: "all var(--dur-fast)",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color:
                        petState === state
                          ? "var(--color-accent)"
                          : "var(--color-text)",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.71875rem",
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {hint}
                  </span>
                </button>
              ))}
            </div>

            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-dim)",
                marginTop: "18px",
                lineHeight: 1.55,
              }}
            >
              More interactions coming — drag, throw toys, and sound reactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
