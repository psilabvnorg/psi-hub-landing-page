import { useProducts } from '@/hooks/useProducts';
import { useParallax } from '@/hooks/useParallax';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';
import { Nav } from '@/sections/Nav';
import { Products } from '@/sections/Products';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Loader2 } from 'lucide-react';
import type { ProductsConfig } from '@/types/product';

// The rest of what PsiHub is building, split out from Home now that Home is
// ContentHub's own landing page. ContentHub itself is excluded — it's the
// main app, not one card among the others.
//
// Split out from OthersProduct so useParallax/useReveal/useTilt (each a
// one-time, scan-the-DOM-on-mount effect) only run once the real content —
// not the loading spinner — is what's actually in the DOM on first mount
// (see App.tsx's HomeContent for the same fix, and why it's needed).
function OthersProductContent({ config }: { config: ProductsConfig }) {
  useParallax();
  useReveal();
  useTilt();

  const otherProducts = config.products.filter((p) => p.id !== 'contenthub');

  return (
    <>
      <Nav />
      <Products products={otherProducts} />
      <Contact contact={config.contact} />
      <Footer brandName={config.brand.name} />
    </>
  );
}

export function OthersProduct() {
  const { config, loading, error } = useProducts();

  return (
    // No bg here on purpose — see the matching note in App.tsx's HomeContent.
    <div className="min-h-screen font-body">
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-psi-orangeLite animate-spin" />
        </div>
      )}

      {!loading && (error || !config) && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-psi-muted3">{error || 'Configuration not found'}</p>
        </div>
      )}

      {config && (
        <div className="pt-[70px]">
          <OthersProductContent config={config} />
        </div>
      )}
    </div>
  );
}
