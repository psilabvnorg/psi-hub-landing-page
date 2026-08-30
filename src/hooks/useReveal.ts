import { useEffect } from 'react';

/**
 * Reveal-on-scroll with sibling stagger.
 *
 * Mark elements with the `psi-reveal` class (from index.css). When one enters
 * the viewport it gains `is-in`, delayed by its index among its siblings so a
 * card grid cascades rather than popping in as a block.
 */
const STAGGER_MS = 70;
const MAX_STEPS = 6;

export function useReveal(scope?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root: ParentNode = scope?.current ?? document;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.psi-reveal'));
    if (!els.length) return;

    const reveal = (el: HTMLElement) => el.classList.add('is-in');

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      els.forEach(reveal);
      return;
    }

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const sibs = Array.from(el.parentElement?.children ?? []);
          const delay = Math.min(sibs.indexOf(el), MAX_STEPS) * STAGGER_MS;
          timers.push(window.setTimeout(() => reveal(el), delay));
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [scope]);
}
