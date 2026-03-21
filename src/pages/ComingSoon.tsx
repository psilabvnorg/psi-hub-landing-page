import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

interface ComingSoonProps {
  prefix: string;
  suffix: string;
}

export function ComingSoon({ prefix, suffix }: ComingSoonProps) {
  const { config } = useProducts();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1b1b1b]">

        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:text-[#ffa31a] transition-colors duration-150 text-2xl font-bold"
            >
              <ArrowLeft className="w-7 h-7" />
              Quay Lại
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <PhLogo prefix={prefix} suffix={suffix} size="md" />
          </div>
        </div>

        {/* Coming Soon body */}
        <div className="flex flex-col items-center justify-center py-32 px-4 gap-10">
          <div className="text-center space-y-4">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <PhLogo prefix={prefix} suffix={suffix} size="xl" />
            <p className="text-[#808080] text-xl mt-6 tracking-widest uppercase font-bold">
              Hướng dẫn đang được cập nhật
            </p>
            <p className="text-[#505050] text-base">Coming Soon</p>
          </div>

          <style>{`
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.05); opacity: 1; }
            }
          `}</style>
          <div className="w-full max-w-lg rounded-xl overflow-hidden border border-[#222222]">
            <img
              src="/assets/top.jpg"
              alt=""
              className="w-full object-cover"
              style={{ animation: 'breathe 3s ease-in-out infinite' }}
            />
          </div>
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
