import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // The target section usually isn't in the DOM yet — most pages fetch
    // their config before rendering any sections — so poll for it across
    // frames instead of assuming one is enough, and give up after 3s. Once
    // found, keep re-snapping for a short grace period too: images loading
    // in elsewhere on the page (none of which reserve their own size) keep
    // shifting the layout for a bit after the section first appears.
    const id = hash.slice(1);
    const searchDeadline = performance.now() + 3000;
    let settleDeadline: number | null = null;
    let raf: number;

    const tick = () => {
      const now = performance.now();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        settleDeadline ??= now + 1000;
        if (now < settleDeadline) raf = requestAnimationFrame(tick);
        return;
      }
      if (now < searchDeadline) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
