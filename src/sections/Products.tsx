import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';
import { useLang } from '@/contexts/LanguageContext';

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const { t } = useLang();

  return (
    <section id="products" className="relative px-6 py-[120px] overflow-hidden">
      <div
        data-depth="0.09"
        className="absolute rounded-full pointer-events-none"
        style={{
          top: 0, left: '50%', marginLeft: '-560px', width: 1120, height: 600,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.08) 0%, rgba(255,163,26,0) 70%)',
        }}
      />

      <div className="relative max-w-[1240px] mx-auto">
        <div className="max-w-[660px] psi-reveal">
          <p className="font-mono text-psi-eyebrow font-bold uppercase tracking-[.16em] text-psi-orangeLite">
            {t.products.eyebrow}
          </p>
          <h2 className="mt-4 font-display font-bold text-psi-h2 text-psi-ink">{t.products.h2}</h2>
        </div>

        <div
          className="mt-[52px] grid gap-[18px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))' }}
        >
          {products.map((product) => (
            <div key={product.id} className="psi-reveal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
