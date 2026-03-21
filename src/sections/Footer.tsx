import { useLang } from '@/contexts/LanguageContext';

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[#ffa31a] bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-black tracking-widest uppercase text-[#ffa31a]">
          {brandName}
        </span>
        <p className="text-[#808080] text-sm">
          &copy; {currentYear} {brandName}. {t.allRights}
        </p>
        <p className="text-[#808080] text-sm">
          {t.madeIn} <span className="text-[#ffa31a] font-bold">Vietnam</span>
        </p>
      </div>
    </footer>
  );
}
