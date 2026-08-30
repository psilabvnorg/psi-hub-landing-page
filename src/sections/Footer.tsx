import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t-4 border-[#ffa31a] bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8"
      style={{ boxShadow: '0 -12px 40px rgba(255,163,26,.12)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
          <PhLogo prefix="Psi" suffix="Hub" size="md" showImage glow />
        </Link>
        <p className="text-[#808080] text-sm [text-shadow:0_1px_3px_rgba(0,0,0,.6)]">
          &copy; {currentYear} {brandName}. {t.footer.allRights}
        </p>
        <p className="text-[#808080] text-sm">
          {t.footer.madeIn}{' '}
          <span className="text-[#ffa31a] font-bold drop-shadow-[0_0_6px_rgba(255,163,26,.5)]">Vietnam</span>
        </p>
      </div>
    </footer>
  );
}
