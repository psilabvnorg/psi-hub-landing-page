import { useProducts } from '@/hooks/useProducts';
import { useParallax } from '@/hooks/useParallax';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';
import { useLang } from '@/contexts/LanguageContext';
import { Nav } from '@/sections/Nav';
import { PageIndex } from '@/sections/PageIndex';
import { Marquee } from '@/sections/Marquee';
import { Intro } from '@/sections/Intro';
import { ScreensStack } from '@/sections/ScreensStack';
import { Features } from '@/sections/Features';
import { InstallGuide } from '@/sections/InstallGuide';
import { Demo } from '@/sections/Demo';
import { Testimonial } from '@/sections/Testimonial';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Loader2 } from 'lucide-react';
import type { ProductsConfig } from '@/types/product';
import './App.css';

// Split out from App so useParallax/useReveal/useTilt (each a one-time,
// scan-the-DOM-on-mount effect) only run once the real sections — not the
// loading spinner — are what's actually in the DOM on first mount.
function HomeContent({ config }: { config: ProductsConfig }) {
  useParallax();
  useReveal();
  useTilt();
  const { t } = useLang();

  const indexItems = [
    { id: 'intro', label: t.pageIndex.intro },
    { id: 'screens', label: t.pageIndex.screens },
    { id: 'features', label: t.features.eyebrow },
    { id: 'guide', label: t.guide.eyebrow },
    { id: 'demo', label: t.demo.eyebrow },
    { id: 'testimonial', label: t.testimonial.eyebrow },
    { id: 'contact', label: t.nav.links.contact },
  ];

  return (
    // No bg here on purpose — <body> (bg-psi-bg) is the solid base color;
    // leaving this transparent lets <UniverseBackdrop />'s starfield show
    // through wherever a section doesn't paint its own background.
    <div className="min-h-screen font-body pt-[70px]">
      <Nav />
      <PageIndex items={indexItems} />
      <Marquee />
      <Intro />
      <ScreensStack />
      <Features />
      <InstallGuide />
      <Demo />
      <Testimonial />
      <Contact contact={config.contact} />
      <Footer brandName={config.brand.name} />
    </div>
  );
}

function App() {
  const { config, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-psi-orangeLite animate-spin mx-auto mb-4" />
          <p className="text-psi-muted3">Loading PsiHub...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-psi-ink mb-2">Failed to Load</h2>
          <p className="text-psi-muted3">{error || 'Configuration not found'}</p>
        </div>
      </div>
    );
  }

  return <HomeContent config={config} />;
}

export default App;
