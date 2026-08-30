import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';
import { useLang } from '@/contexts/LanguageContext';
import { getProductScreenshots } from '@/utils/productImages';

interface ProductCardProps {
  product: Product;
}

// Products with a dedicated in-site page link there instead of straight to
// their external site/download. ContentHub is filtered out of every grid
// that renders this card (it's the site's home page now, not a listed
// product), so this mapping is currently unreachable — kept for correctness
// in case that ever changes.
const INTERNAL_ROUTES: Record<string, string> = {
  contenthub: '/',
};

const AUTOPLAY_MS = 4500;

function CardShots({ shots }: { shots: string[] }) {
  const [current, setCurrent] = useState(0);
  const total = shots.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total]);

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + dir + total) % total);
  };

  return (
    <div className="relative shrink-0 aspect-video overflow-hidden rounded-t-[18px] bg-black" style={{ perspective: '800px' }}>
      {shots.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-psi group-hover:[transform:rotateX(3deg)_scale(1.06)]"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Bottom fade into the card body */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-psi-surface to-transparent pointer-events-none" />

      {total > 1 && (
        <>
          <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white/90 font-mono text-[10.5px] px-2 py-0.5 rounded-full">
            {current + 1}/{total}
          </span>
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={(e) => go(e, -1)}
            className="absolute top-1/2 left-2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-opacity duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={(e) => go(e, 1)}
            className="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-opacity duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2.5 inset-x-0 flex gap-1 justify-center">
            {shots.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                style={{ background: i === current ? '#ffa31a' : 'rgba(255,255,255,.35)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLang();
  const isComingSoon = product.status === 'Coming Soon';
  const description = lang === 'vi' ? product.description_vi : product.description;
  const shots = isComingSoon ? [] : getProductScreenshots(product.id);

  const statusLabel =
    product.status === 'Ready' ? t.productStatus.ready
    : product.status === 'Beta' ? t.productStatus.beta
    : t.productStatus.comingSoon;

  const pill = (
    <span
      className={`inline-flex items-center rounded-full px-[9px] py-1 font-mono text-psi-pill font-bold uppercase border ${
        isComingSoon
          ? 'text-psi-muted5 border-psi-borderDashed'
          : product.status === 'Ready'
          ? 'bg-[rgba(34,197,94,.15)] text-psi-ok border-[rgba(34,197,94,.3)]'
          : 'bg-[rgba(255,163,26,.15)] text-psi-orangeLite border-[rgba(255,163,26,.3)]'
      }`}
    >
      {statusLabel}
    </span>
  );

  const header = (
    <div className="flex items-center justify-between gap-3">
      <span className={`font-display font-bold text-xl ${isComingSoon ? 'text-psi-muted4' : 'text-psi-ink'}`}>
        {product.name}
      </span>
      {pill}
    </div>
  );

  const body = (
    <p className={`mt-3 text-[15px] leading-[1.6] line-clamp-3 ${isComingSoon ? 'text-psi-muted5' : 'text-psi-muted3'}`}>
      {description}
    </p>
  );

  // Fixed height (not driven by description length) so every card in the
  // grid — Ready, Beta, or Coming Soon, with or without a screenshot — lines
  // up the same. Long descriptions clamp to 3 lines with an ellipsis instead
  // of stretching the card.
  if (isComingSoon) {
    return (
      <div className="h-[460px] flex flex-col justify-center bg-psi-surface3 border border-dashed border-psi-borderDashed rounded-psi-md px-6 py-[26px]">
        {header}
        {body}
      </div>
    );
  }

  const cardClassName =
    'group flex flex-col h-[460px] bg-psi-surface border border-psi-border rounded-psi-md overflow-hidden ' +
    'transition-all duration-500 ease-psi hover:-translate-y-2 hover:border-[rgba(255,163,26,.42)] hover:shadow-psi-card-3d';
  const content = (
    <>
      {shots.length > 0 && <CardShots shots={shots} />}
      <div className="flex flex-col flex-1 min-h-0 px-6 py-[22px]">
        {header}
        {body}
      </div>
    </>
  );
  const internalRoute = INTERNAL_ROUTES[product.id];

  if (internalRoute) {
    return (
      <Link to={internalRoute} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={product.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      {content}
    </a>
  );
}
