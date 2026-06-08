"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const FONT_SIZE = 13;
const COLUMN_WIDTH = 12;
const GRAVITY_RADIUS = 200;
const GLOW_RADIUS = 200;
const REPEL_STRENGTH = 720;
const DIRECT_PUSH = 110;
const MAX_DISPLACE = 56;
const SPRING_STRENGTH = 2;
const DAMPING = 1.1;
const MIN_SPEED = 80;
const MAX_SPEED = 280;
const CANVAS_OPACITY = 0.55;

const NEUTRAL_RGB: [number, number, number] = [58, 62, 58];
const DIM_RGB: [number, number, number] = [42, 46, 42];

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
  highlight: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

function useDesktopMatrixEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const update = () => {
      setEnabled(media.matches);
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return enabled;
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
  const cols = Math.ceil(width / COLUMN_WIDTH) + 2;
  const symbols: MatrixSymbol[] = [];
  const gap = FONT_SIZE * 1.05;

  for (let col = 0; col < cols; col++) {
    const x = col * COLUMN_WIDTH + COLUMN_WIDTH * 0.5;
    const columnSpeed = randomSpeed();
    const trailLength = 12 + (col % 5) + Math.floor(Math.random() * 14);

    for (let trail = 0; trail < trailLength; trail++) {
      symbols.push({
        x,
        y: Math.random() * height * 1.1 - trail * gap,
        char: randomChar(),
        speed: columnSpeed + (Math.random() - 0.5) * 30,
        trailAlpha: Math.max(0.08, 1 - trail / trailLength),
        offsetX: 0,
        offsetY: 0,
        offsetVX: 0,
        offsetVY: 0,
        highlight: 0,
      });
    }
  }

  return symbols;
}

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const symbolsRef = useRef<MatrixSymbol[]>([]);
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const limeRgbRef = useRef<[number, number, number]>([184, 255, 0]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;

      if (logicalWidth <= 0 || logicalHeight <= 0) return;

      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      symbolsRef.current = createSymbols(logicalWidth, logicalHeight);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const inViewport =
        clientX >= 0 &&
        clientY >= 0 &&
        clientX <= window.innerWidth &&
        clientY <= window.innerHeight;

      pointerRef.current = {
        x: clientX,
        y: clientY,
        active: inViewport,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      updatePointer(event.clientX, event.clientY);
    };

    const onMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const resetSymbol = (symbol: MatrixSymbol) => {
      symbol.y = Math.random() * 40;
      symbol.char = randomChar();
      symbol.speed = randomSpeed();
      symbol.offsetX = 0;
      symbol.offsetY = 0;
      symbol.offsetVX = 0;
      symbol.offsetVY = 0;
      symbol.highlight = 0;
    };

    const applyPointerRepel = (symbol: MatrixSymbol, dt: number) => {
      const pointer = pointerRef.current;
      if (!pointer.active) return;

      const sx = symbol.x + symbol.offsetX;
      const sy = symbol.y + symbol.offsetY;
      const dx = sx - pointer.x;
      const dy = sy - pointer.y;
      const dist = Math.hypot(dx, dy);

      if (dist < GLOW_RADIUS) {
        const glow = 1 - dist / GLOW_RADIUS;
        symbol.highlight = Math.max(symbol.highlight, glow * glow);
      }

      if (dist < GRAVITY_RADIUS && dist > 0.5) {
        const falloff = 1 - dist / GRAVITY_RADIUS;
        const falloffCubed = falloff * falloff * falloff;
        const nx = dx / dist;
        const ny = dy / dist;
        const force = falloffCubed * REPEL_STRENGTH;

        symbol.offsetVX += nx * force * dt;
        symbol.offsetVY += ny * force * 0.75 * dt;

        const direct = falloffCubed * DIRECT_PUSH * dt;
        symbol.offsetX += nx * direct;
        symbol.offsetY += ny * direct * 0.75;

        symbol.highlight = Math.max(symbol.highlight, falloff * 0.95);

        const displace = Math.hypot(symbol.offsetX, symbol.offsetY);
        if (displace > MAX_DISPLACE) {
          const scale = MAX_DISPLACE / displace;
          symbol.offsetX *= scale;
          symbol.offsetY *= scale;
        }
      }
    };

    const drawFrame = (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.033);
      lastFrameRef.current = now;
      const motionScale = reducedMotionRef.current ? 0 : 1;

      if (logicalWidth <= 0 || logicalHeight <= 0) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      if (motionScale === 0) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.font = `${FONT_SIZE}px var(--font-body), "DM Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lime = limeRgbRef.current;
      const white: [number, number, number] = [240, 255, 220];
      const highlightDecay = dt * 3.5;
      const displaceGlowThreshold = 6;

      for (const symbol of symbolsRef.current) {
        symbol.y += symbol.speed * dt * motionScale;

        applyPointerRepel(symbol, dt);

        symbol.offsetVX += -symbol.offsetX * SPRING_STRENGTH * dt;
        symbol.offsetVY += -symbol.offsetY * SPRING_STRENGTH * dt;
        symbol.offsetVX *= 1 - DAMPING * dt;
        symbol.offsetVY *= 1 - DAMPING * dt;
        symbol.offsetX += symbol.offsetVX * dt;
        symbol.offsetY += symbol.offsetVY * dt;

        const displace = Math.hypot(symbol.offsetX, symbol.offsetY);
        if (displace > displaceGlowThreshold) {
          const displaceGlow = Math.min(1, (displace - displaceGlowThreshold) / 28);
          symbol.highlight = Math.max(symbol.highlight, displaceGlow * 0.85);
        }

        symbol.highlight = Math.max(0, symbol.highlight - highlightDecay);

        if (symbol.y > logicalHeight + 20) {
          resetSymbol(symbol);
        }

        const drawX = symbol.x + symbol.offsetX;
        const drawY = symbol.y + symbol.offsetY;

        if (symbol.highlight > 0.04) {
          const t = Math.min(1, symbol.highlight);
          ctx.shadowColor = "#b8ff00";
          ctx.shadowBlur = 6 + t * 28;
          ctx.fillStyle = lerpRgb(
            lime,
            white,
            t,
            0.45 + t * 0.55,
          );
        } else {
          ctx.shadowBlur = 0;
          const baseAlpha = 0.04 + symbol.trailAlpha * 0.1;
          ctx.fillStyle = lerpRgb(DIM_RGB, NEUTRAL_RGB, symbol.trailAlpha, baseAlpha);
        }

        ctx.fillText(symbol.char, drawX, drawY);

        if (Math.random() < 0.0012) {
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

    window.addEventListener("resize", resize);
    document.addEventListener("pointermove", onPointerMove, {
      passive: true,
      capture: true,
    });
    document.addEventListener("mousemove", onMouseMove, {
      passive: true,
      capture: true,
    });
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("mousemove", onMouseMove, { capture: true });
      motionQuery.removeEventListener("change", onMotionChange);
      pointerRef.current.active = false;
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-background__canvas"
      style={{ opacity: CANVAS_OPACITY }}
      aria-hidden="true"
    />
  );
}

export function MatrixRainBackground() {
  const enabled = useDesktopMatrixEnabled();

  if (!enabled) return null;

  return (
    <div className="matrix-rain-background" aria-hidden="true">
      <MatrixRainCanvas />
    </div>
  );
}
