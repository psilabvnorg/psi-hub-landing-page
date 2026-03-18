import { useProducts } from '@/hooks/useProducts';
import { Hero } from '@/sections/Hero';
import { Products } from '@/sections/Products';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const { config, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ffa31a] animate-spin mx-auto mb-4" />
          <p className="text-[#808080]">Loading PsiHub...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load</h2>
          <p className="text-[#808080]">{error || 'Configuration not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b]">
      <Hero brand={config.brand} />
      <Products products={config.products} />
      <Contact contact={config.contact} />
      <Footer brandName={config.brand.name} />
    </div>
  );
}

export default App;
