import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useLang } from '@/contexts/LanguageContext';

interface BannerProps {
  contentHub: Product | undefined;
}

export function Banner({ contentHub }: BannerProps) {
  const { t } = useLang();
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-[#1b1b1b]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* Box 1: YouTube video autoplay */}
        <div className="flex flex-col">
          <h3 className="text-white text-xl font-bold mb-3">{t.demoGuide}</h3>
          <div className="relative overflow-hidden rounded-sm border border-[#222222] min-h-[350px] flex-1">
            <iframe
              src="https://www.youtube.com/embed/mrKhGq2x9z4?autoplay=1&mute=1&loop=1&playlist=mrKhGq2x9z4"
              title="PsiHub Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Box 2: ContentHub preview card */}
        {contentHub && (
          <div>
            <ProductCard product={contentHub} />
          </div>
        )}
      </div>
    </section>
  );
}
