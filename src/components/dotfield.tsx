'use client'

import { useEffect, useRef } from "react";

/**
 * a barely-there dot grid that quietly reacts to the cursor.
 * dark dots on dark bg — you only really notice it when you move.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // tuning — all deliberately quiet
    const DOT_R = 0.9;
    const SPACING = 26;
    const CURSOR_R = 220;
    const BULGE = 26;
    const BASE_ALPHA = 0.04;   // rest state — almost invisible
    const PEAK_ALPHA = 0.18;   // near cursor
    const RESTORE = 0.08;      // how fast dots settle back

    const mouse = { x: -9999, y: -9999, active: 0 };
    let dots: { ax: number; ay: number; sx: number; sy: number }[] = [];
    let w = 0, h = 0;
    let raf = 0;

    function build() {
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ax = c * SPACING;
          const ay = r * SPACING;
          dots.push({ ax, ay, sx: ax, sy: ay });
        }
      }
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = 1;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = 0;
    }

    function tick() {
      // engagement eases toward whether the cursor is around
      const target = mouse.active;
      const eng = Number((canvas as any).__eng ?? 0);
      const next = eng + (target - eng) * 0.06;
      (canvas as any).__eng = next;

      ctx.clearRect(0, 0, w, h);
      const crSq = CURSOR_R * CURSOR_R;
      const rad = DOT_R;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = mouse.x - d.ax;
        const dy = mouse.y - d.ay;
        const distSq = dx * dx + dy * dy;

        let alpha = BASE_ALPHA;

        if (distSq < crSq && next > 0.01) {
          const dist = Math.sqrt(distSq);
          const tf = 1 - dist / CURSOR_R;
          const push = tf * tf * BULGE * next;
          const angle = Math.atan2(dy, dx);
          d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.18;
          d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.18;
          alpha = BASE_ALPHA + (PEAK_ALPHA - BASE_ALPHA) * tf * next;
        } else {
          d.sx += (d.ax - d.sx) * RESTORE;
          d.sy += (d.ay - d.sy) * RESTORE;
        }

        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.arc(d.sx, d.sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
