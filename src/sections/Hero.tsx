import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BookOpen, LayoutGrid } from 'lucide-react';
import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

const DOC_LINKS = [
  { label: 'ContentHub', path: '/contenthub/huong-dan' },
  { label: 'ContentHub API', path: '/contenthub/huong-dan-api' },
  { label: 'Psi69', path: '/psi69/huong-dan' },
  { label: 'JobHub', path: '/jobhub/huong-dan' },
  { label: 'LifeHub', path: '/lifehub/huong-dan' },
];

export function Hero() {
  const { lang, toggle } = useLang();
  const [docsOpen, setDocsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDocsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b-[3px] border-[#ffa31a] px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">

        {/* Logo — shrinks on mobile */}
        <div className="flex-shrink-0">
          <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">

          {/* Docs dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDocsOpen(o => !o)}
              className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-black tracking-wide sm:tracking-widest uppercase text-[#ffa31a] hover:text-white transition-colors duration-150 px-2 sm:px-3 py-1"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Hướng Dẫn</span>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-150 ${docsOpen ? 'rotate-180' : ''}`} />
            </button>

            {docsOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-[#111111] border border-[#2a2a2a] rounded-sm shadow-xl py-1">
                {DOC_LINKS.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setDocsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-black tracking-wide text-[#ffa31a] hover:text-white hover:bg-[#1a1a1a] transition-colors duration-100"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Site preview link */}
          <Link
            to="/preview"
            className="flex items-center justify-center text-[#606060] hover:text-[#ffa31a] transition-colors duration-150 p-1.5 sm:px-3 sm:py-1"
          >
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1 text-sm sm:text-base font-black tracking-wide sm:tracking-widest uppercase px-1.5 sm:px-3 py-1"
          >
            <span className={lang === 'en' ? 'text-[#ffa31a]' : 'text-[#808080]'}>EN</span>
            <span className="text-[#808080]">/</span>
            <span className={lang === 'vi' ? 'text-[#ffa31a]' : 'text-[#808080]'}>VI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
