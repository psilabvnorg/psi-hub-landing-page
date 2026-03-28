import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

interface StepDetailLink {
  text: string;
  url: string;
  detail: string;
}

interface StepData {
  number: number;
  title: string;
  description: string;
  link?: StepLink;
  links?: StepDetailLink[];
  videoLink?: StepLink;
  image?: string;
  note?: string;
  noteImage?: string;
  noteBeforeImage?: string;
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
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
            >
              <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <PhLogo prefix="Content" suffix="Hub" size="md" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 text-center">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-1">Hướng Dẫn Cài Đặt</h1>
            <p className="text-white text-base font-bold mb-3 underline">KHÔNG TỐN TOKEN, KO CẦN API KEY</p>
            <p className="text-white text-base mb-4">
              Làm theo {steps.length} bước dưới đây để cài đặt và chạy ContentHub trên máy tính.
            </p>
            <p className="text-[#ffa31a] text-lg font-bold mb-8 animate-pulse">
              ⚠ Nhớ chọn đúng file Mac/Windows khi tải về bạn nhé!
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
                    <p className="text-white text-base mt-1">
                      {renderDescription(step.description, step.link)}
                    </p>
                    {step.videoLink && (
                      <a
                        href={step.videoLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[#ffa31a] underline hover:text-white transition-colors font-bold"
                      >
                        {step.videoLink.text}
                      </a>
                    )}
                    {step.links && (
                      <div className="mt-3 flex flex-col gap-3">
                        {step.links.map((l, i) => (
                          <div key={i}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ffa31a] underline hover:text-white transition-colors font-bold"
                            >
                              {l.text}
                            </a>
                            <span className="text-white"> : {l.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {step.noteBeforeImage && (
                  <div className="ml-14 p-4 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
                    <p className="text-[#ffa31a] text-base font-bold mb-1">⚠ Lưu ý</p>
                    <p className="text-white text-base">{step.noteBeforeImage}</p>
                  </div>
                )}

                {step.image && (
                  <div className="rounded-xl overflow-hidden border border-[#2a2a2a] ml-14">
                    <img
                      src={step.image}
                      alt={`Bước ${step.number}`}
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {step.note && (
                  <div className="ml-14 p-4 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
                    <p className="text-[#ffa31a] text-base font-bold mb-1">⚠ Lưu ý</p>
                    <div className="text-white text-base">
                      {step.note.split('\n').map((line, li) => {
                        // Check if line looks like a command (starts with xattr, etc.)
                        const isCommand = line.startsWith('xattr') || line.startsWith('$');
                        if (isCommand) {
                          return (
                            <code key={li} className="block mt-2 bg-[#111] text-[#ffa31a] px-3 py-2 rounded-lg font-mono text-sm">
                              {line}
                            </code>
                          );
                        }
                        return (
                          <p key={li}>
                            {line.split(/(voice clone)/gi).map((part, i) =>
                              part.toLowerCase() === 'voice clone' ? (
                                <strong key={i} className="underline">{part}</strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        );
                      })}
                    </div>
                    {step.noteImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
                        <img src={step.noteImage} alt="Lưu ý" className="w-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Lock note with image */}
            <div className="ml-14 flex flex-col gap-3">
              <p className="text-[#ffa31a] text-lg font-bold animate-pulse">
                ⚠ Khi sử dụng nếu bị lock sau 30p, bạn tắt app đi mở lại là ok, dùng hoàn toàn free full chức năng
              </p>
              <div className="rounded-xl overflow-hidden border border-[#2a2a2a]">
                <img
                  src="/assets/PIN.jpg"
                  alt="Lưu ý khi bị lock"
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Note */}
            <div className="ml-14 p-6 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
              <p className="text-[#ffa31a] text-xl font-bold mb-3">⚠ Lưu ý</p>
              <p className="text-white text-lg">
                1. NodeJS: Trong trường hợp ứng dụng bị lỗi khi render video, có thể thử tải NodeJS về:{' '}
                <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors">https://nodejs.org/en/download</a>
                <br />Sau khi cài đặt NodeJS cần khởi động lại ứng dụng.
              </p>
              <p className="text-white text-lg mt-3">
                2. Nếu lỗi không bật được server, có thể tải Python 3.12.0 về:{' '}
                <a href="https://www.python.org/downloads/release/python-3120/" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors">https://www.python.org/downloads/release/python-3120/</a>
              </p>
            </div>

            {/* Demo video after last step */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                  ▶
                </div>
                <div>
                  <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">
                    Demo
                  </p>
                  <h2 className="text-white text-xl font-bold">Demo và Hướng Dẫn Cài Đặt</h2>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] ml-14" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/IEepEZDoFDI?autoplay=0&mute=0"
                  title="Demo và Hướng Dẫn Cài Đặt"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="text-white text-base font-bold ml-14 mt-4">Demo</p>
              <div className="flex flex-wrap gap-4 ml-14 mt-2">
                <a
                  href="https://www.youtube.com/@psihubvn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF4444] hover:bg-[#FF0000]/20 transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                  YouTube: @psihubvn
                </a>
                <a
                  href="https://www.tiktok.com/@psihub.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f2ea]/10 border border-[#00f2ea]/30 text-[#00f2ea] hover:bg-[#00f2ea]/20 transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z"/></svg>
                  TikTok: @psihub.me
                </a>
              </div>
            </div>
          </div>
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
