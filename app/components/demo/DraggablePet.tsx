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

export default function DraggablePet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [petState, setPetState] = useState<AnimState>("idle");
  const [isDragging, setIsDragging] = useState(false);

  const dragging = useRef(false);
  const pos = useRef({ x: 80, y: 400 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastClientX = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const randomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkRafRef = useRef<number | null>(null);
  const scheduleRef = useRef<() => void>(() => {});

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
    if (Math.abs(targetX - startX) < 8) {
      scheduleRef.current();
      return;
    }

    const finalDir = targetX > startX ? 1 : -1;
    setPetState(finalDir > 0 ? "runLeft" : "runRight");

    const SPEED = 85; // px/second — a relaxed pace
    let last = 0;
    const step = (now: number) => {
      if (dragging.current || !containerRef.current) return; // drag takes over
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;

      // Re-check the edge each frame so a resize can't strand us off-screen.
      const edge = Math.max(0, window.innerWidth - PET_W);
      let nextX = pos.current.x + finalDir * SPEED * dt;
      let arrived = finalDir > 0 ? nextX >= targetX : nextX <= targetX;
      if (nextX <= 0) { nextX = 0; arrived = true; }
      else if (nextX >= edge) { nextX = edge; arrived = true; }
      else if (arrived) nextX = targetX;

      pos.current.x = nextX;
      containerRef.current.style.left = `${nextX}px`;

      if (arrived) {
        walkRafRef.current = null;
        setPetState("idle");
        scheduleRef.current();
        return;
      }
      walkRafRef.current = requestAnimationFrame(step);
    };
    walkRafRef.current = requestAnimationFrame(step);
  }, []);

  const scheduleNextRandom = useCallback(() => {
    if (randomTimerRef.current) clearTimeout(randomTimerRef.current);
    randomTimerRef.current = setTimeout(() => {
      if (dragging.current) return;
      // Every now and then, stroll a few paces instead of an in-place anim.
      if (Math.random() < 0.4) {
        startWalk();
      } else {
        setPetState(RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]);
        scheduleNextRandom();
      }
    }, 3000 + Math.random() * 4000);
  }, [startWalk]);

  useEffect(() => {
    scheduleRef.current = scheduleNextRandom;
  }, [scheduleNextRandom]);

  useEffect(() => {
    scheduleNextRandom();
    return () => {
      if (randomTimerRef.current) clearTimeout(randomTimerRef.current);
      if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    };
  }, [scheduleNextRandom]);

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
      if (randomTimerRef.current) clearTimeout(randomTimerRef.current);
      if (walkRafRef.current) {
        cancelAnimationFrame(walkRafRef.current);
        walkRafRef.current = null;
      }
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || !containerRef.current) return;

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
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);

      const moved = Math.hypot(
        e.clientX - pointerDownPos.current.x,
        e.clientY - pointerDownPos.current.y,
      );
      if (moved < 6) {
        setPetState("wave");
        // wave is a ~400ms one-shot; resume random cycling after it completes
        randomTimerRef.current = setTimeout(scheduleNextRandom, 500);
      } else {
        setPetState("idle");
        scheduleNextRandom();
      }
    },
    [scheduleNextRandom],
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: pos.current.x,
        top: pos.current.y,
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
