"use client";

import { useEffect, useRef, type RefObject } from "react";

const FONT_SIZE = 14;
const COLUMN_WIDTH = 18;
const GRAVITY_RADIUS = 150;
const HIGHLIGHT_RADIUS = 24;
const HIGHLIGHT_DURATION_MS = 200;
const REPEL_STRENGTH = 140;
const SHOCK_BLAST_RADIUS = 130;
const SHOCK_WAVE_MAX_RADIUS = 280;
const SHOCK_DURATION_MS = 750;
const SHOCK_BOOST = 14;
const MAX_SHOCKS = 6;
const MIN_SPEED = 90;
const MAX_SPEED = 320;

type MatrixChar = "0" | "1";

type MatrixSymbol = {
  x: number;
  y: number;
  char: MatrixChar;
  speed: number;
  trailAlpha: number;
  offsetX: number;
  offsetY: number;
  offsetVX: number;
  offsetVY: number;
  speedMultiplier: number;
  highlight: number;
};

type ShockWave = {
  x: number;
  y: number;
  born: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

interface MatrixDataStreamProps {
  containerRef: RefObject<HTMLElement | null>;
  opacity?: number;
}

function randomChar(): MatrixChar {
  return Math.random() > 0.5 ? "1" : "0";
}

function randomSpeed(): number {
  return MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
}

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length !== 6) return [184, 255, 0];
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
  alpha: number,
): string {
  const mix = Math.min(1, Math.max(0, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * mix);
  const g = Math.round(a[1] + (b[1] - a[1]) * mix);
  const bl = Math.round(a[2] + (b[2] - a[2]) * mix);
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}

function createSymbols(width: number, height: number): MatrixSymbol[] {
  const cols = Math.ceil(width / COLUMN_WIDTH) + 1;
  const symbols: MatrixSymbol[] = [];
  const gap = FONT_SIZE * 1.2;

  for (let col = 0; col < cols; col++) {
    const x = col * COLUMN_WIDTH + COLUMN_WIDTH * 0.5;
    const columnSpeed = randomSpeed();
    const trailLength = 8 + (col % 5) + Math.floor(Math.random() * 10);

    for (let trail = 0; trail < trailLength; trail++) {
      symbols.push({
        x,
        y: Math.random() * height * 0.9 - trail * gap,
        char: randomChar(),
        speed: columnSpeed + (Math.random() - 0.5) * 40,
        trailAlpha: Math.max(0.08, 1 - trail / trailLength),
        offsetX: 0,
        offsetY: 0,
        offsetVX: 0,
        offsetVY: 0,
        speedMultiplier: 1,
        highlight: 0,
      });
    }
  }

  return symbols;
}

export function MatrixDataStream({
  containerRef,
  opacity = 0.45,
}: MatrixDataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const symbolsRef = useRef<MatrixSymbol[]>([]);
  const shocksRef = useRef<ShockWave[]>([]);
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const limeRgbRef = useRef<[number, number, number]>([184, 255, 0]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    const readThemeColors = () => {
      const lime =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent-lime")
          .trim() || "#b8ff00";
      limeRgbRef.current = parseHex(lime);
    };

    readThemeColors();

    let logicalWidth = 0;
    let logicalHeight = 0;
    let dpr = 1;

    const resize = () => {
      const el = containerRef.current;
      if (!el) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      logicalWidth = el.clientWidth;
      logicalHeight = el.clientHeight;

      if (logicalWidth <= 0 || logicalHeight <= 0) return;

      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      symbolsRef.current = createSymbols(logicalWidth, logicalHeight);
    };

    const toCanvasCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const { x, y } = toCanvasCoords(event.clientX, event.clientY);
      pointerRef.current = { x, y, active: true };
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      const { x, y } = toCanvasCoords(event.clientX, event.clientY);
      shocksRef.current.push({ x, y, born: performance.now() });
      if (shocksRef.current.length > MAX_SHOCKS) {
        shocksRef.current = shocksRef.current.slice(-MAX_SHOCKS);
      }
    };

    const resetSymbol = (symbol: MatrixSymbol) => {
      symbol.y = Math.random() * 48;
      symbol.char = randomChar();
      symbol.speed = randomSpeed();
      symbol.offsetX = 0;
      symbol.offsetY = 0;
      symbol.offsetVX = 0;
      symbol.offsetVY = 0;
      symbol.speedMultiplier = 1;
      symbol.highlight = 0;
    };

    const applyShockWaves = (symbol: MatrixSymbol, now: number, dt: number) => {
      let boost = 1;

      for (const shock of shocksRef.current) {
        const age = now - shock.born;
        if (age > SHOCK_DURATION_MS) continue;

        const sx = symbol.x + symbol.offsetX;
        const sy = symbol.y + symbol.offsetY;
        const dx = sx - shock.x;
        const dy = sy - shock.y;
        const dist = Math.hypot(dx, dy);
        const progress = age / SHOCK_DURATION_MS;
        const waveFront = progress * SHOCK_WAVE_MAX_RADIUS;

        if (age < 120 && dist < SHOCK_BLAST_RADIUS) {
          const blast = (1 - dist / SHOCK_BLAST_RADIUS) * (1 - age / 120);
          boost = Math.max(boost, 1 + blast * SHOCK_BOOST);
        }

        const ringWidth = 42;
        const ringDelta = Math.abs(dist - waveFront);
        if (ringDelta < ringWidth) {
          const ringStrength =
            (1 - ringDelta / ringWidth) * (1 - progress) * 0.9;
          boost = Math.max(boost, 1 + ringStrength * (SHOCK_BOOST * 0.75));

          if (dist > 1) {
            const push = ringStrength * 260 * dt;
            symbol.offsetVX += (dx / dist) * push;
            symbol.offsetVY += (dy / dist) * push * 0.55;
          }
        }
      }

      symbol.speedMultiplier += (boost - symbol.speedMultiplier) * Math.min(1, dt * 18);
      symbol.speedMultiplier += (1 - symbol.speedMultiplier) * dt * 1.6;
    };

    const applyPointerForces = (symbol: MatrixSymbol, dt: number) => {
      const pointer = pointerRef.current;
      if (!pointer.active) return;

      const sx = symbol.x + symbol.offsetX;
      const sy = symbol.y + symbol.offsetY;
      const dx = sx - pointer.x;
      const dy = sy - pointer.y;
      const dist = Math.hypot(dx, dy);

      if (dist < HIGHLIGHT_RADIUS) {
        symbol.highlight = 1;
      }

      if (dist < GRAVITY_RADIUS && dist > 0.5) {
        const falloff = 1 - dist / GRAVITY_RADIUS;
        const force = falloff * falloff * REPEL_STRENGTH;
        symbol.offsetVX += (dx / dist) * force * dt;
        symbol.offsetVY += (dy / dist) * force * 0.45 * dt;
      }
    };

    const drawFrame = (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.033);
      lastFrameRef.current = now;
      const motionScale = reducedMotionRef.current ? 0.35 : 1;

      if (logicalWidth <= 0 || logicalHeight <= 0) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      ctx.font = `${FONT_SIZE}px var(--font-body), "DM Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      shocksRef.current = shocksRef.current.filter(
        (shock) => now - shock.born <= SHOCK_DURATION_MS,
      );

      const lime = limeRgbRef.current;
      const white: [number, number, number] = [255, 255, 255];
      const highlightDecay = dt / (HIGHLIGHT_DURATION_MS / 1000);

      for (const symbol of symbolsRef.current) {
        applyShockWaves(symbol, now, dt);

        symbol.y += symbol.speed * symbol.speedMultiplier * dt * motionScale;

        applyPointerForces(symbol, dt);

        symbol.offsetVX += -symbol.offsetX * 10 * dt;
        symbol.offsetVY += -symbol.offsetY * 10 * dt;
        symbol.offsetVX *= 1 - 5 * dt;
        symbol.offsetVY *= 1 - 5 * dt;
        symbol.offsetX += symbol.offsetVX * dt;
        symbol.offsetY += symbol.offsetVY * dt;

        symbol.highlight = Math.max(0, symbol.highlight - highlightDecay);

        if (symbol.y > logicalHeight) {
          resetSymbol(symbol);
        }

        const drawX = symbol.x + symbol.offsetX;
        const drawY = symbol.y + symbol.offsetY;

        if (symbol.highlight > 0.02) {
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 6 + symbol.highlight * 16;
          ctx.fillStyle = lerpRgb(
            lime,
            white,
            symbol.highlight,
            0.55 + symbol.highlight * 0.45,
          );
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = lerpRgb(lime, lime, 0, 0.12 + symbol.trailAlpha * 0.38);
        }

        ctx.fillText(symbol.char, drawX, drawY);

        if (Math.random() < 0.0015) {
          symbol.char = symbol.char === "0" ? "1" : "0";
        }
      }

      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      lastFrameRef.current = performance.now();
    };

    resize();
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(drawFrame);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerleave", onPointerLeave);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerleave", onPointerLeave);
      motionQuery.removeEventListener("change", onMotionChange);
      pointerRef.current.active = false;
    };
  }, [containerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ opacity }}
      />
    </div>
  );
}
