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

const SCALE = 0.5;
const PET_W = Math.round(192 * SCALE);
const PET_H = Math.round(208 * SCALE);

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

  const dragging = useRef(false);
  const pos = useRef({ ...INITIAL_POS });
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastClientX = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkRafRef = useRef<number | null>(null);

  useEffect(() => {
    const startY = Math.max(window.innerHeight - PET_H - 60, 100);
    pos.current = { x: 80, y: startY };
    if (containerRef.current) {
      containerRef.current.style.left = `${pos.current.x}px`;
      containerRef.current.style.top = `${pos.current.y}px`;
    }
  }, []);

  // Take a short stroll across the screen using the run animation, then settle.
  const startWalk = useCallback(() => {
    if (dragging.current || !containerRef.current) return;
    const maxX = Math.max(0, window.innerWidth - PET_W);
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
      const edge = Math.max(0, window.innerWidth - PET_W);
      let nextX = pos.current.x + finalDir * SPEED * dt;
      let arrived = finalDir > 0 ? nextX >= targetX : nextX <= targetX;
      if (finalDir < 0 && nextX <= 0) { nextX = 0; arrived = true; }
      else if (finalDir > 0 && nextX >= edge) { nextX = edge; arrived = true; }
      else if (arrived) nextX = targetX;

      pos.current.x = nextX;
      containerRef.current.style.left = `${nextX}px`;

      if (arrived) {
        walkRafRef.current = null;
        setPetState("idle");
        return;
      }
      walkRafRef.current = requestAnimationFrame(step);
    };
    walkRafRef.current = requestAnimationFrame(step);
  }, []);

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
        const maxX = Math.max(0, window.innerWidth - PET_W);
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
    },
    [],
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
        Math.min(window.innerWidth - PET_W, e.clientX - dragOffset.current.x),
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - PET_H, e.clientY - dragOffset.current.y),
      );

      pos.current = { x: newX, y: newY };
      containerRef.current.style.left = `${newX}px`;
      containerRef.current.style.top = `${newY}px`;

      const dx = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;
      if (Math.abs(dx) > 1) {
        setPetState(dx > 0 ? "runLeft" : "runRight");
      }
    },
    [handlePointerUp],
  );

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
        filter: isDragging
          ? "drop-shadow(0 12px 24px oklch(0% 0 0 / 0.5))"
          : "drop-shadow(0 4px 12px oklch(0% 0 0 / 0.35))",
        transition: isDragging ? "none" : "filter 0.2s",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
    >
      <PetCanvas
        state={petState}
        onStateChange={(s) => setPetState(s as AnimState)}
        interactive={false}
        scale={SCALE}
      />
    </div>
  );
}
