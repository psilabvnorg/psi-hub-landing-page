import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';
import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

const READY_IDS = ['contenthub', 'psi69', 'jobhub', 'lifehub'];

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const { t } = useLang();

  const readyProducts = products.filter((p) => READY_IDS.includes(p.id));
  const comingSoonProducts = products.filter((p) => !READY_IDS.includes(p.id));

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1b1b1b]">
      <div className="max-w-[1800px] mx-auto">

        {/* Section Header */}
        <div className="mb-16">
          <div className="h-1 w-16 bg-[#ffa31a] mb-6" />
          <div className="mb-4">
            <PhLogo prefix={t.productsLogo.prefix} suffix={t.productsLogo.suffix} size="lg" />
          </div>
          <p className="text-[#808080] text-lg max-w-2xl leading-relaxed">{t.productsDesc}</p>
        </div>

        {/* Ready Section */}
        <div className="mb-12 flex items-center gap-3">
          <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t.readySection}
          </span>
          <div className="h-px flex-1 bg-[#808080]/20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {readyProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        {comingSoonProducts.length > 0 && (
          <>
            <div className="mt-20 mb-12 flex items-center gap-3">
              <span className="inline-block bg-[#ffa31a] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t.comingSoonSection}
              </span>
              <div className="h-px flex-1 bg-[#808080]/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 opacity-80">
              {comingSoonProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${(readyProducts.length + index) * 0.08}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#808080]/20" />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#ffa31a] text-[#ffa31a] font-bold text-sm tracking-widest uppercase hover:bg-[#ffa31a] hover:text-black transition-colors duration-150 rounded-sm"
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
