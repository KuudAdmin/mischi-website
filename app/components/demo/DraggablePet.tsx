"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import PetCanvas from "./PetCanvas";

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

// Sprite frame is 192×208. We render it smaller on phones so the pet isn't
// oversized on a narrow screen; desktop is unchanged.
const SPRITE_W = 192;
const SPRITE_H = 208;
const DESKTOP_SCALE = 0.5;
const MOBILE_SCALE = 0.34;
const MOBILE_BREAKPOINT = 768;
const pickScale = (w: number) => (w < MOBILE_BREAKPOINT ? MOBILE_SCALE : DESKTOP_SCALE);

const RANDOM_POOL: AnimState[] = [
  "idle", "idle",
  "wave", "jump", "dancing", "waiting", "tired", "review",
];

// First-paint position; the mount effect immediately repositions to sit just
// above the bottom of the viewport once we can read its height.
const INITIAL_POS = { x: 80, y: 400 };

export default function DraggablePet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [petState, setPetState] = useState<AnimState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [scale, setScale] = useState(DESKTOP_SCALE);

  const scaleRef = useRef(DESKTOP_SCALE);
  const dimsRef = useRef({
    w: Math.round(SPRITE_W * DESKTOP_SCALE),
    h: Math.round(SPRITE_H * DESKTOP_SCALE),
  });
  const dragging = useRef(false);
  const pos = useRef({ ...INITIAL_POS });
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastClientX = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkRafRef = useRef<number | null>(null);
  const bubbleWrapRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLAnchorElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const bubbleSize = useRef({ w: 0, h: 0 });

  // Keep the bubble fully on-screen: clamp it horizontally against the viewport
  // (sliding the tail back so it keeps pointing at the pet) and flip it below
  // the pet when there's no room above. Driven imperatively so it tracks the
  // pet mid-walk and mid-drag without a React re-render per frame.
  const positionBubble = useCallback((remeasure = false) => {
    const wrap = bubbleWrapRef.current;
    const tail = tailRef.current;
    const bubble = bubbleRef.current;
    if (!wrap || !tail || !bubble) return;

    if (remeasure || bubbleSize.current.w === 0) {
      bubbleSize.current = { w: bubble.offsetWidth, h: bubble.offsetHeight };
    }
    const { w: bw, h: bh } = bubbleSize.current;
    const MARGIN = 10;
    const half = bw / 2;

    // Horizontal: clamp the bubble centre to the viewport.
    const petCenterX = pos.current.x + dimsRef.current.w / 2;
    const clampedCenter = Math.max(
      MARGIN + half,
      Math.min(window.innerWidth - MARGIN - half, petCenterX),
    );
    const shift = clampedCenter - petCenterX;
    wrap.style.transform = `translateX(calc(-50% + ${shift.toFixed(1)}px))`;

    // Vertical: flip below the pet when it sits too close to the top.
    const flip = pos.current.y < bh + 18;
    if (flip) {
      wrap.style.top = "100%";
      wrap.style.bottom = "auto";
      wrap.style.marginTop = "12px";
      wrap.style.marginBottom = "0";
      tail.style.top = "-5px";
      tail.style.bottom = "auto";
      tail.style.transform = "translateX(-50%) rotate(225deg)";
    } else {
      wrap.style.top = "auto";
      wrap.style.bottom = "100%";
      wrap.style.marginTop = "0";
      wrap.style.marginBottom = "12px";
      tail.style.top = "auto";
      tail.style.bottom = "-5px";
      tail.style.transform = "translateX(-50%) rotate(45deg)";
    }

    // Tail follows the pet, but never slides past the bubble's edges.
    const tailMax = Math.max(0, half - 14);
    const tailOffset = Math.max(-tailMax, Math.min(tailMax, -shift));
    tail.style.left = `calc(50% + ${tailOffset.toFixed(1)}px)`;
  }, []);

  // Pick the scale for the current viewport, keep the pet on-screen at its new
  // size, and re-clamp the bubble. Runs on mount and whenever the window resizes
  // (covering phone⇄desktop rotation and breakpoint crossings).
  useEffect(() => {
    const apply = (initial: boolean) => {
      const s = pickScale(window.innerWidth);
      scaleRef.current = s;
      const w = Math.round(SPRITE_W * s);
      const h = Math.round(SPRITE_H * s);
      dimsRef.current = { w, h };
      setScale(s);

      if (initial) {
        pos.current = { x: 80, y: Math.max(window.innerHeight - h - 60, 100) };
      } else {
        pos.current.x = Math.max(0, Math.min(window.innerWidth - w, pos.current.x));
        pos.current.y = Math.max(0, Math.min(window.innerHeight - h, pos.current.y));
      }
      if (containerRef.current) {
        containerRef.current.style.left = `${pos.current.x}px`;
        containerRef.current.style.top = `${pos.current.y}px`;
      }
      positionBubble(true);
    };
    apply(true);
    const onResize = () => apply(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionBubble]);

  // Pop the waitlist bubble in a beat after the pet settles.
  useEffect(() => {
    const t = setTimeout(() => {
      positionBubble(true);
      setBubbleVisible(true);
    }, 900);
    return () => clearTimeout(t);
  }, [positionBubble]);

  // Re-measure the bubble after it resizes with the breakpoint.
  useEffect(() => {
    positionBubble(true);
  }, [scale, positionBubble]);

  // Take a short stroll across the screen using the run animation, then settle.
  const startWalk = useCallback(() => {
    if (dragging.current || !containerRef.current) return;
    const maxX = Math.max(0, window.innerWidth - dimsRef.current.w);
    const startX = pos.current.x;

    // Pick a direction that keeps us on-screen, then a "few paces" distance.
    let dir: 1 | -1;
    if (startX < 48) dir = 1;
    else if (startX > maxX - 48) dir = -1;
    else dir = Math.random() < 0.5 ? 1 : -1;

    const paces = 90 + Math.random() * 170;
    const targetX = Math.max(0, Math.min(maxX, startX + dir * paces));
    // Too short to bother — leave it for the next heartbeat to retry.
    if (Math.abs(targetX - startX) < 8) return;

    const finalDir = targetX > startX ? 1 : -1;
    setPetState(finalDir > 0 ? "runLeft" : "runRight");

    const SPEED = 85; // px/second — a relaxed pace
    let last = 0;
    const step = (now: number) => {
      // Drag takes over — drop the walk; the heartbeat resumes once released.
      if (dragging.current || !containerRef.current) {
        walkRafRef.current = null;
        return;
      }
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;

      // Re-check the edge each frame so a resize can't strand us off-screen.
      // Only the edge we're walking *toward* counts as an arrival — otherwise a
      // walk that starts exactly on an edge (e.g. a corner) would "arrive" on
      // the first, zero-distance frame and never get going.
      const edge = Math.max(0, window.innerWidth - dimsRef.current.w);
      let nextX = pos.current.x + finalDir * SPEED * dt;
      let arrived = finalDir > 0 ? nextX >= targetX : nextX <= targetX;
      if (finalDir < 0 && nextX <= 0) { nextX = 0; arrived = true; }
      else if (finalDir > 0 && nextX >= edge) { nextX = edge; arrived = true; }
      else if (arrived) nextX = targetX;

      pos.current.x = nextX;
      containerRef.current.style.left = `${nextX}px`;
      positionBubble();

      if (arrived) {
        walkRafRef.current = null;
        setPetState("idle");
        return;
      }
      walkRafRef.current = requestAnimationFrame(step);
    };
    walkRafRef.current = requestAnimationFrame(step);
  }, [positionBubble]);

  // A single always-on heartbeat drives the autonomous behaviour. It is never
  // torn down by a drag — it just skips a beat while the pet is being held (or
  // mid-walk) and acts on the next one. This means the pet can never get
  // stranded: even if a pointerup is missed (e.g. released off-screen at the
  // very edge of the window), the loop keeps ticking and resumes on its own.
  useEffect(() => {
    function schedule() {
      heartbeatRef.current = setTimeout(() => {
        schedule(); // re-arm first so the loop survives no matter what
        if (dragging.current || walkRafRef.current) return; // busy — skip beat
        // If we're parked exactly on an edge, always stroll off it rather than
        // risk idling there for several beats; otherwise walk now and then.
        const maxX = Math.max(0, window.innerWidth - dimsRef.current.w);
        const onEdge = pos.current.x <= 0 || pos.current.x >= maxX;
        if (onEdge || Math.random() < 0.4) {
          startWalk();
        } else {
          setPetState(RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]);
        }
      }, 3000 + Math.random() * 4000);
    }
    schedule();
    return () => {
      if (heartbeatRef.current) clearTimeout(heartbeatRef.current);
      if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    };
  }, [startWalk]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
      setIsDragging(true);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      dragOffset.current = {
        x: e.clientX - pos.current.x,
        y: e.clientY - pos.current.y,
      };
      lastClientX.current = e.clientX;
      // Stop any in-flight stroll so the drag controls the position. The
      // heartbeat keeps running and resumes once the pointer is released.
      if (walkRafRef.current) {
        cancelAnimationFrame(walkRafRef.current);
        walkRafRef.current = null;
      }
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);

      // Release capture if we still hold it (e.g. we're ending the drag from a
      // move that found the button already up, not from a real pointerup).
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      const moved = Math.hypot(
        e.clientX - pointerDownPos.current.x,
        e.clientY - pointerDownPos.current.y,
      );
      // A tap waves (PetCanvas returns it to idle); a drag just settles. Either
      // way the always-on heartbeat resumes the autonomous behaviour on its own.
      setPetState(moved < 6 ? "wave" : "idle");
      positionBubble();
    },
    [positionBubble],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || !containerRef.current) return;

      // If no button is pressed we missed the pointerup — most commonly when
      // the release happened off-screen at a corner. End the drag here, before
      // repositioning, so the pet neither teleports to the cursor (a one-frame
      // flicker) nor stays stranded with dragging stuck on.
      if (e.buttons === 0) {
        handlePointerUp(e);
        return;
      }

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - dimsRef.current.w, e.clientX - dragOffset.current.x),
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - dimsRef.current.h, e.clientY - dragOffset.current.y),
      );

      pos.current = { x: newX, y: newY };
      containerRef.current.style.left = `${newX}px`;
      containerRef.current.style.top = `${newY}px`;
      positionBubble();

      const dx = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;
      if (Math.abs(dx) > 1) {
        setPetState(dx > 0 ? "runLeft" : "runRight");
      }
    },
    [handlePointerUp, positionBubble],
  );

  // The bubble shrinks on phones (where the pet itself is smaller).
  const compact = scale < DESKTOP_SCALE;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: INITIAL_POS.x,
        top: INITIAL_POS.y,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
        transition: isDragging ? "none" : "filter 0.2s",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
    >
      {/* Waitlist speech bubble — floats above the pet, scrolls to the
          waitlist on click. stopPropagation on pointerdown so tapping it
          doesn't start a drag; hides itself while the pet is being dragged. */}
      <div
        ref={bubbleWrapRef}
        className="pet-bubble-wrap"
        aria-hidden={!bubbleVisible || isDragging}
        style={{
          position: "absolute",
          left: "50%",
          // top/bottom/transform/margins are set imperatively by positionBubble
          // so React re-renders never clobber the on-screen clamp.
          pointerEvents: "none",
        }}
      >
        <a
          ref={bubbleRef}
          href="#waitlist"
          className="pet-bubble"
          onPointerDown={(e) => e.stopPropagation()}
          tabIndex={bubbleVisible && !isDragging ? 0 : -1}
          style={{
            position: "relative",
            display: "block",
            width: "max-content",
            maxWidth: compact ? "150px" : "190px",
            padding: compact ? "7px 11px" : "9px 13px",
            borderRadius: compact ? "12px" : "14px",
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-strong)",
            boxShadow: "var(--shadow-card)",
            color: "var(--color-text)",
            fontSize: compact ? "0.6875rem" : "0.75rem",
            lineHeight: 1.4,
            fontWeight: 500,
            textAlign: "center",
            textDecoration: "none",
            cursor: "pointer",
            whiteSpace: "normal",
            pointerEvents: bubbleVisible && !isDragging ? "auto" : "none",
            opacity: bubbleVisible && !isDragging ? 1 : 0,
            transition:
              "opacity var(--dur-normal) var(--ease-expo), filter var(--dur-fast)",
            animation:
              bubbleVisible && !isDragging
                ? "pet-bubble-bob 3.2s ease-in-out infinite"
                : "none",
          }}
        >
          <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
            Join the waitlist
          </span>{" "}
          to get me on your desktop!
          {/* tail — position/rotation set imperatively by positionBubble */}
          <span
            ref={tailRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              background: "var(--color-surface-raised)",
              borderRight: "1px solid var(--color-border-strong)",
              borderBottom: "1px solid var(--color-border-strong)",
            }}
          />
        </a>
      </div>

      <PetCanvas
        state={petState}
        onStateChange={(s) => setPetState(s as AnimState)}
        interactive={false}
        scale={scale}
      />

      <style>{`
        .pet-bubble:hover { filter: brightness(0.98); }
        @keyframes pet-bubble-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pet-bubble { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
