import { useEffect } from 'react';

/**
 * Pointer tilt for the 3D stages (hero screenshot stack, demo frame).
 *
 * Mark the tilting element with data-tilt. Its parent needs
 * `perspective: 1800px` (hero) or `1200px` (demo); the element itself needs
 * `transform-style: preserve-3d` and `transition: transform .35s cubic-bezier(.2,.8,.2,1)`.
 * Resting pose is rotateX(11deg).
 */
const REST_X = 11;
const RANGE_X = 7;
const RANGE_Y = 8;

export function useTilt(scope?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)');
    if (mq.matches) return;

    const root: ParentNode = scope?.current ?? document;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-tilt]'));
    if (!els.length) return;

    const onMove = (e: PointerEvent) => {
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue; // offscreen
        const cx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const cy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform =
          `rotateX(${(REST_X - cy * RANGE_X).toFixed(2)}deg) ` +
          `rotateY(${(cx * RANGE_Y).toFixed(2)}deg)`;
      }
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [scope]);
}
