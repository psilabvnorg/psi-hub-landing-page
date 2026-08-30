import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BookOpen, LayoutGrid, Sun, Moon } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const DOC_LINKS = [
  { label: 'ContentHub', path: '/#guide' },
  { label: 'ContentHub API', path: '/contenthub/huong-dan-api' },
  { label: 'Psi69', path: '/psi69/huong-dan' },
  { label: 'JobHub', path: '/jobhub/huong-dan' },
  { label: 'LifeHub', path: '/lifehub/huong-dan' },
];

export function Nav() {
  const { lang, toggle, t } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
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
    <header className="fixed inset-x-0 top-0 z-[100] h-[70px] bg-[var(--psi-nav-bg)] backdrop-blur-[18px] border-b border-[rgba(255,163,26,.22)]">
      <div className="max-w-[1240px] mx-auto h-[70px] px-6 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center justify-center h-[34px] w-[34px] rounded-[9px] bg-black p-[6px] animate-breathe">
            <img
              src="/logo.png"
              alt="PsiHub"
              className="h-full w-full object-contain transition-transform duration-500 ease-out hover:rotate-[360deg]"
            />
          </span>
          <span className="font-display font-bold text-[21px] tracking-[-.01em] leading-none">
            <span className="text-psi-ink">Psi</span>
            <span className="text-psi-orangeLite">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-[30px] text-sm font-semibold text-psi-muted2">
            <Link to="/others-product" className="hover:text-psi-ink transition-colors duration-150">{t.nav.links.products}</Link>
            <Link to="/#contact" className="hover:text-psi-ink transition-colors duration-150">{t.nav.links.contact}</Link>
          </nav>

          {/* Docs dropdown (per-product guides) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDocsOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-semibold text-psi-muted2 hover:text-psi-ink transition-colors duration-150"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t.Guide}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${docsOpen ? 'rotate-180' : ''}`} />
            </button>

            {docsOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-psi-surface border border-psi-border rounded-psi-sm shadow-psi-window py-1">
                {DOC_LINKS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setDocsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-psi-muted2 hover:text-psi-ink hover:bg-[var(--psi-glass-hover)] transition-colors duration-100"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Site preview link */}
          <Link
            to="/preview"
            className="hidden sm:flex items-center justify-center text-psi-muted3 hover:text-psi-orangeLite transition-colors duration-150"
          >
            <LayoutGrid className="w-4 h-4" />
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="flex items-center justify-center text-psi-muted3 hover:text-psi-orangeLite transition-colors duration-150"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1 font-mono text-[11px] font-bold tracking-[.08em] border border-psi-borderStrong rounded-full px-[13px] py-[7px]"
          >
            <span className={lang === 'en' ? 'text-psi-orangeLite' : 'text-psi-muted2'}>EN</span>
            <span className="text-psi-dim">/</span>
            <span className={lang === 'vi' ? 'text-psi-orangeLite' : 'text-psi-muted2'}>VI</span>
          </button>

          {/* CTA */}
          <Link
            to="/#guide"
            className="bg-psi-orange text-psi-ink font-extrabold text-sm px-5 py-[11px] rounded-[10px] shadow-psi-cta-sm whitespace-nowrap"
          >
            {t.nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
