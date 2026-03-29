"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
}

const W = 156;
const H = 32;
const OFFSCREEN_SCALE = 2;
const GAP = 3;
const MOUSE_RADIUS = 10;
const MOUSE_STRENGTH = 5.5;
const RETURN_SPEED = 0.1;
const DAMPING = 0.82;

export default function LogoParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const colorRef = useRef("#0a0a0a");
  const { resolvedTheme } = useTheme();

  const buildParticles = useCallback((color: string) => {
    const ow = W * OFFSCREEN_SCALE;
    const oh = H * OFFSCREEN_SCALE;
    const offscreen = document.createElement("canvas");
    offscreen.width = ow;
    offscreen.height = oh;
    const ctx = offscreen.getContext("2d")!;
    ctx.scale(OFFSCREEN_SCALE, OFFSCREEN_SCALE);
    ctx.fillStyle = "white";
    ctx.font = `bold 21px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("Ascii", 4, H / 2);

    const imageData = ctx.getImageData(0, 0, ow, oh);
    const particles: Particle[] = [];

    for (let y = 0; y < oh; y += GAP) {
      for (let x = 0; x < ow; x += GAP) {
        const i = (y * ow + x) * 4;
        if (imageData.data[i + 3] > 128) {
          const px = x / OFFSCREEN_SCALE;
          const py = y / OFFSCREEN_SCALE;
          particles.push({
            x: px + (Math.random() - 0.5) * 16,
            y: py + (Math.random() - 0.5) * 16,
            homeX: px,
            homeY: py,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    colorRef.current = color;
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const color = resolvedTheme === "dark" ? "#e0e0da" : "#0a0a0a";
    buildParticles(color);

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const c = colorRef.current;

      for (const p of particlesRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
          const dist = Math.sqrt(distSq) || 0.001;
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += (p.homeX - p.x) * RETURN_SPEED;
        p.vy += (p.homeY - p.y) * RETURN_SPEED;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = c;
        ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, [resolvedTheme, buildParticles]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer block"
      style={{ width: W, height: H }}
      aria-label="ascii"
    />
  );
}
