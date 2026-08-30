import { useEffect, useState } from 'react';

interface IndexItem {
  id: string;
  label: string;
}

/**
 * Sticky "on this page" quick-jump bar. Sits right under the fixed Nav so
 * visitors landing on a long page (ContentHub) can see every section at a
 * glance and jump straight to one. Highlights whichever section is currently
 * in view via IntersectionObserver — falls back to no highlight if that API
 * or a reduced-motion-style preference isn't available, which still leaves a
 * fully working set of anchor links.
 */
export function PageIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(topMost.target.id);
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <div className="sticky top-[70px] z-40 bg-[var(--psi-pageindex-bg)] backdrop-blur-[14px] border-b border-psi-hairline">
      <div className="max-w-[1240px] mx-auto px-6 flex items-center gap-1.5 overflow-x-auto h-[52px]">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 px-4 py-1.5 rounded-full font-mono text-[12px] font-bold uppercase tracking-[.06em] whitespace-nowrap transition-colors duration-150 ${
              active === item.id
                ? 'bg-psi-orange text-psi-ink'
                : 'text-psi-muted2 hover:text-psi-ink'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
