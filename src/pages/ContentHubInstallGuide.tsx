import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

type Platform = 'windows' | 'mac';

interface StepLink {
  text: string;
  url: string;
}

interface StepData {
  number: number;
  title: string;
  description: string;
  link?: StepLink;
  image?: string;
}

const JSON_URLS: Record<Platform, string> = {
  windows: '/config/install_windows_contenthub.json',
  mac: '/config/install_mac_contenthub.json',
};

function renderDescription(description: string, link?: StepLink) {
  // Convert **bold** markdown to JSX
  const parts = description.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
      {link && (
        <>
          {' '}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffa31a] underline hover:text-white transition-colors duration-150"
          >
            {link.text}
          </a>
        </>
      )}
    </>
  );
}

export function ContentHubInstallGuide() {
  const { config } = useProducts();
  const [platform, setPlatform] = useState<Platform>('windows');
  const [steps, setSteps] = useState<StepData[]>([]);

  useEffect(() => {
    fetch(JSON_URLS[platform])
      .then((r) => r.json())
      .then(setSteps)
      .catch(() => setSteps([]));
  }, [platform]);

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
            <PhLogo prefix="Content" suffix="Hub" size="md" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 text-center">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-3">Hướng Dẫn Cài Đặt</h1>
            <p className="text-[#808080] text-base mb-8">
              Làm theo {steps.length} bước dưới đây để cài đặt và chạy ContentHub trên máy tính.
            </p>

            {/* Platform toggle */}
            <div className="inline-flex rounded-xl overflow-hidden border-2 border-[#ffa31a]">
              <button
                onClick={() => setPlatform('windows')}
                className={`px-8 py-3 text-lg font-bold transition-all duration-200 cursor-pointer ${
                  platform === 'windows'
                    ? 'bg-[#ffa31a] text-black'
                    : 'bg-transparent text-[#ffa31a] hover:bg-[#ffa31a]/10'
                }`}
              >
                🪟 Windows
              </button>
              <button
                onClick={() => setPlatform('mac')}
                className={`px-8 py-3 text-lg font-bold transition-all duration-200 cursor-pointer ${
                  platform === 'mac'
                    ? 'bg-[#ffa31a] text-black'
                    : 'bg-transparent text-[#ffa31a] hover:bg-[#ffa31a]/10'
                }`}
              >
                🍎 macOS
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">
                      Bước {step.number}
                    </p>
                    <h2 className="text-white text-xl font-bold">{step.title}</h2>
                    <p className="text-[#909090] text-base mt-1">
                      {renderDescription(step.description, step.link)}
                    </p>
                  </div>
                </div>

                {step.image && (
                  <div className="rounded-xl overflow-hidden border border-[#2a2a2a] ml-14">
                    <img
                      src={step.image}
                      alt={`Bước ${step.number}`}
                      className="w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
