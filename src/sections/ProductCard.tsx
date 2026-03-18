import { useState } from 'react';
import { ExternalLink, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';
import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

/** Split "ContentHub" → ["Content", "Hub"], "Psi69" → ["Psi", "69"] */
function splitName(name: string): [string, string] {
  const suffixes = ['Hub', 'Bot'];
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) return [name.slice(0, -suffix.length), suffix];
  }
  const numMatch = name.match(/^([A-Za-z]+?)(\d+.*)$/);
  if (numMatch) return [numMatch[1], numMatch[2]];
  const capMatch = name.match(/^([A-Z][a-z]+)([A-Z].*)$/);
  if (capMatch) return [capMatch[1], capMatch[2]];
  return [name, ''];
}

export function ProductCard({ product }: ProductCardProps) {
  const [current, setCurrent] = useState(0);
  const total = product.screenshots.length;
  const [prefix, suffix] = splitName(product.name);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);
  const { t } = useLang();

  return (
    <div className="group bg-[#111111] border border-[#222222] hover:border-[#FF9000]/40 transition-colors duration-200 overflow-hidden rounded-sm">

      {/* Top orange accent line */}
      <div className="h-[3px] bg-[#FF9000]" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        {/* PH-style logo */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <PhLogo prefix={prefix} suffix={suffix} size="md" />
          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-[0.15em] uppercase rounded-sm ${
            product.status === 'Ready'
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-[#FF9000]/15 text-[#FF9000] border border-[#FF9000]/40'
          }`}>
            {product.status === 'Ready' ? t.ready : 'Beta'}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#808080] text-sm leading-relaxed max-w-lg">
          {product.description}
        </p>
      </div>

      {/* Screenshot */}
      <div className="relative bg-[#0a0a0a] border-t border-b border-[#222222]">
        <div className="aspect-video relative overflow-hidden">
          {product.screenshots.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${product.name} screenshot ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gradient-to-r from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 hover:text-[#FF9000] transition-all duration-150"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gradient-to-l from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 hover:text-[#FF9000] transition-all duration-150"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 right-4 text-xs font-bold text-white/60 bg-black/60 px-2 py-0.5 rounded-sm">
                {current + 1} / {total}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex gap-3">
        <a
          href={product.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 border border-[#333333] text-[#808080] font-bold text-sm tracking-wide hover:border-[#FF9000]/50 hover:text-[#FF9000] transition-all duration-150 rounded-sm"
        >
          <Play className="w-4 h-4" />
          {t.liveDemo}
        </a>
        <a
          href={product.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#FF9000] text-black font-black text-sm tracking-widest uppercase hover:bg-white transition-colors duration-150 rounded-sm"
        >
          <ExternalLink className="w-4 h-4" />
          {t.visitSite}
        </a>
      </div>
    </div>
  );
}
