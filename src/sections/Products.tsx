import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';
import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const { t } = useLang();
  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1b1b1b]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-16">
          <div className="h-1 w-16 bg-[#FF9000] mb-6" />
          <div className="mb-4">
            <PhLogo prefix={t.productsLogo.prefix} suffix={t.productsLogo.suffix} size="lg" />
          </div>
          <p className="text-[#808080] text-lg max-w-2xl leading-relaxed">{t.productsDesc}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#808080]/20" />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#FF9000] text-[#FF9000] font-bold text-sm tracking-widest uppercase hover:bg-[#FF9000] hover:text-black transition-colors duration-150 rounded-sm"
          >
            {t.getInTouch}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <div className="h-px flex-1 bg-[#808080]/20" />
        </div>
      </div>
    </section>
  );
}
