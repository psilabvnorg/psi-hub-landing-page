import { useEffect } from 'react';

/**
 * Layered scroll parallax.
 *
 * Mark any element with data-depth="0.12" (positive = background, moves against
 * the scroll; negative = foreground, overshoots). The element's own authored
 * transform is captured once and preserved as a prefix, so 3D transforms like
 * `translateZ(-180px) rotateY(19deg)` keep working.
 *
 * Depth values used by the landing page:
 *   hero glow group   0.06   features glow   0.10
 *   hero grid mesh    0.14   how-it-works    0.12
 *   hero side cards  -0.10   demo glow       0.10
 *   hero main window -0.04   products glow   0.09
 *                            contact glow    0.13
 */
const TRAVEL = 240; // px at depth 1.0

export function useParallax(scope?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root: ParentNode = scope?.current ?? document;
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => {
      el.style.willChange = 'transform';
      return { el, depth: parseFloat(el.dataset.depth || '0'), base: el.style.transform || '' };
    });
    if (!layers.length) return;

    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const vh = window.innerHeight;
      for (const { el, depth, base } of layers) {
        const r = el.getBoundingClientRect();
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        const y = (-progress * depth * TRAVEL).toFixed(1);
        el.style.transform = `${base ? base + ' ' : ''}translate3d(0,${y}px,0)`;
      }
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(apply);
    };

    // Capture phase on `document` so scrolls from an inner scroll container are
    // caught too — element scroll events do not bubble to `window`.
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    apply();

    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [scope]);
}
