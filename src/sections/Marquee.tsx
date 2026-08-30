import { useLang } from '@/contexts/LanguageContext';

export function Marquee() {
  const { t } = useLang();
  const items = t.marquee.items;

  const track = (key: string) => (
    <div key={key} className="flex gap-11 pr-11 items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-11 shrink-0">
          <span className="font-display font-semibold text-[15px] tracking-[.02em] text-psi-dim whitespace-nowrap">
            {item}
          </span>
          <span className="text-psi-orangeLite">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="bg-psi-bgAlt border-y border-psi-hairline py-7 overflow-hidden">
      <div className="flex w-max animate-psi-marquee">
        {track('a')}
        {track('b')}
      </div>
    </section>
  );
}
