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

  useEffect(() => {
    const startY = Math.max(window.innerHeight - PET_H - 60, 100);
    pos.current = { x: 80, y: startY };
    if (containerRef.current) {
      containerRef.current.style.left = `${pos.current.x}px`;
      containerRef.current.style.top = `${pos.current.y}px`;
    }
  }, []);

  const scheduleNextRandom = useCallback(() => {
    if (randomTimerRef.current) clearTimeout(randomTimerRef.current);
    randomTimerRef.current = setTimeout(() => {
      if (dragging.current) return;
      setPetState(RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]);
      scheduleNextRandom();
    }, 3000 + Math.random() * 4000);
  }, []);

  useEffect(() => {
    scheduleNextRandom();
    return () => {
      if (randomTimerRef.current) clearTimeout(randomTimerRef.current);
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
        setPetState(dx > 0 ? "runRight" : "runLeft");
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
