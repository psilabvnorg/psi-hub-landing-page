import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

export function Hero() {
  const { lang, toggle } = useLang();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b-[3px] border-[#FF9000]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />

        <button
          onClick={toggle}
          className="flex items-center gap-2 text-xl font-black tracking-widest uppercase px-3 py-1"
        >
          <span className={lang === 'en' ? 'text-[#FF9000]' : 'text-[#808080]'}>EN</span>
          <span className="text-[#808080]">/</span>
          <span className={lang === 'vi' ? 'text-[#FF9000]' : 'text-[#808080]'}>VI</span>
        </button>
      </div>
    </header>
  );
}
