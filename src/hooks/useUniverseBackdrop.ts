import { useEffect } from 'react';

interface Star { ang: number; rad: number; r: number; a: number; tw: number; ph: number; }
interface Orbit { cx: number; cy: number; rx: number; ry: number; period: number; dotR: number; phase: number; }
interface Drone { x: number; y: number; vx: number; vy: number; size: number; bob: number; }
interface Plane { trail: [number, number][]; period: number; }

/**
 * Full-page animated <canvas> backdrop: a slowly rotating starfield (200
 * stars), five orbit rings each carrying a large orange "planet" dot, nine
 * drifting drone glyphs, and two flight paths with fading trails. Purely
 * decorative (pointer-events: none, aria-hidden) — see UniverseBackdrop.tsx.
 *
 * Theme-aware without any React state: reads the `dark` class on <html>
 * fresh every frame (same source of truth ThemeContext toggles), so it
 * follows the theme switch with no re-render or prop plumbing.
 *
 * Ported from design_handoff_landing_redesign/THEME_AND_BACKDROP.md.
 */
export function useUniverseBackdrop(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDark = () => document.documentElement.classList.contains('dark');

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      ang: Math.random() * Math.PI * 2, rad: Math.random() * 0.8 + 0.1,
      r: Math.random() * 2 + 0.6, a: Math.random() * 0.5 + 0.2,
      tw: Math.random() * 0.002 + 0.0006, ph: Math.random() * Math.PI * 2,
    }));
    const orbits: Orbit[] = [
      { cx: .18, cy: .28, rx: 170, ry: 100, period: 26000, dotR: 18, phase: 0 },
      { cx: .82, cy: .6, rx: 210, ry: 135, period: 34000, dotR: 15, phase: 2 },
      { cx: .55, cy: .14, rx: 130, ry: 72, period: 19000, dotR: 12, phase: 4 },
      { cx: .08, cy: .78, rx: 150, ry: 90, period: 29000, dotR: 14, phase: 1.4 },
      { cx: .94, cy: .18, rx: 120, ry: 68, period: 22000, dotR: 11, phase: 3.2 },
    ];
    const drones: Drone[] = Array.from({ length: 9 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00006, vy: (Math.random() - 0.5) * 0.00004,
      size: Math.random() * 8 + 9, bob: Math.random() * Math.PI * 2,
    }));
    const plane: Plane = { trail: [], period: 42000 };
    const plane2: Plane = { trail: [], period: 55000 };

    const flyPath = (frac: number, yBase: number, amp: number, freq: number): [number, number] => {
      const px = w * (0.1 + 0.8 * frac);
      const py = h * yBase + Math.sin(frac * Math.PI * 2 * freq) * h * amp + h * 0.05;
      return [px, py];
    };

    const drawPlane = (t: number, dark: boolean, p: Plane, yBase: number, amp: number, freq: number, size: number) => {
      const pt = (t % p.period) / p.period;
      const [px, py] = flyPath(pt, yBase, amp, freq);
      p.trail.push([px, py]);
      if (p.trail.length > 40) p.trail.shift();
      ctx.beginPath();
      p.trail.forEach((pp, i) => {
        const a = (i / p.trail.length) * (dark ? .32 : .65);
        ctx.strokeStyle = dark ? `rgba(255,163,26,${a})` : `rgba(140,56,0,${a})`;
        if (i === 0) ctx.moveTo(pp[0], pp[1]); else ctx.lineTo(pp[0], pp[1]);
      });
      ctx.lineWidth = 1.2;
      ctx.stroke();
      const [nx, ny] = flyPath(((t + 16) % p.period) / p.period, yBase, amp, freq);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(Math.atan2(ny - py, nx - px));
      ctx.fillStyle = dark ? 'rgba(255,163,26,.8)' : 'rgba(120,48,0,1)';
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * .85, -size * .6);
      ctx.lineTo(-size * .85, size * .6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      // Flat brand orange (or white/dark-ink) at low alpha is invisible
      // against the light cream page — light mode needs a different, deeper
      // hue and a much higher opacity floor, not a dimmed copy of the dark
      // palette: stars/drones go deep indigo, orbit dots + flight paths go
      // near-opaque burnt-orange.
      const dotColor = dark ? '255,255,255' : '32,24,84'; // stars + drones

      // rotating starfield
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((t / 720000) * Math.PI * 2); // one full turn every 12 minutes
      const maxR = Math.max(w, h) * 0.65;
      stars.forEach((s) => {
        const rr = s.rad * maxR;
        const x = Math.cos(s.ang) * rr;
        const y = Math.sin(s.ang) * rr;
        const base = dark ? s.a : s.a * 0.95;
        const alpha = Math.max(0, base + Math.sin(t * s.tw + s.ph) * 0.15);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${dotColor},${alpha})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // orbit rings + "planet" dots
      orbits.forEach((o) => {
        const cx = o.cx * w;
        const cy = o.cy * h;
        ctx.beginPath();
        ctx.strokeStyle = dark ? 'rgba(255,255,255,.06)' : `rgba(${dotColor},.4)`;
        ctx.lineWidth = dark ? 1 : 1.6;
        ctx.ellipse(cx, cy, o.rx, o.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        const ang = (t / o.period) * Math.PI * 2 + o.phase;
        ctx.beginPath();
        ctx.fillStyle = dark ? 'rgba(255,163,26,.55)' : 'rgba(140,56,0,.95)';
        ctx.arc(cx + Math.cos(ang) * o.rx, cy + Math.sin(ang) * o.ry, o.dotR, 0, Math.PI * 2);
        ctx.fill();
      });

      // drifting drones (diamond glyph + wing ticks), wrap at edges
      drones.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -.05;
        if (d.y < -.05) d.y = 1.05;
        if (d.y > 1.05) d.y = -.05;
        const x = d.x * w;
        const y = d.y * h + Math.sin(t * 0.0006 + d.bob) * 8;
        const s = d.size;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = dark ? 'rgba(255,255,255,.22)' : `rgba(${dotColor},.45)`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(0, -s * .55);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s * .55);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 1.6, 0);
        ctx.lineTo(-s, 0);
        ctx.moveTo(s, 0);
        ctx.lineTo(s * 1.6, 0);
        ctx.stroke();
        ctx.restore();
      });

      // two flight paths: fading trail + heading-aligned plane marker each
      drawPlane(t, dark, plane, 0.2, 0.12, 1.3, 7);
      drawPlane(t, dark, plane2, 0.75, 0.1, 1.7, 6);
    };

    let raf: number | null = null;
    const loop = (t: number) => {
      if (!document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
