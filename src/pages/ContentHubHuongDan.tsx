import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApiDocs } from '@/sections/ApiDocs';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function ContentHubHuongDan() {
  const { config } = useProducts();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1b1b1b]">
        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#606060] hover:text-[#ffa31a] transition-colors duration-150 text-2xl font-bold"
            >
              <ArrowLeft className="w-7 h-7" />
              Quay Lại
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <span className="text-white text-2xl font-bold">ContentHub</span>
            <span className="text-[#606060] text-2xl">/</span>
            <span className="text-[#ffa31a] text-2xl font-mono font-bold">ContentHub API</span>
          </div>
        </div>

        <ApiDocs lang="vi" />

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
