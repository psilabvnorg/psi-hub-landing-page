import { useLang } from '@/contexts/LanguageContext';

export function Features() {
  const { t } = useLang();

  return (
    <section id="features" className="relative px-6 py-[120px] overflow-hidden scroll-mt-[130px]">
      <div
        data-depth="0.10"
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '10%', right: '-10%', width: 700, height: 700,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.09) 0%, rgba(255,163,26,0) 70%)',
        }}
      />

      <div className="relative max-w-[1240px] mx-auto">
        <div className="max-w-[660px] psi-reveal">
          <p className="font-mono text-psi-eyebrow font-bold uppercase tracking-[.16em] text-psi-orangeLite">
            {t.features.eyebrow}
          </p>
          <h2 className="mt-4 font-display font-bold text-psi-h2 text-psi-ink">{t.features.h2}</h2>
          <p className="mt-[18px] font-body text-[17px] leading-[1.65] text-psi-muted2" style={{ textWrap: 'pretty' }}>
            {t.features.sub}
          </p>
        </div>

        <div className="mt-14 grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {t.features.items.map((item, i) => {
            const isAccent = i === 7;
            return (
              <div
                key={i}
                className={`psi-reveal pt-7 px-[26px] pb-[30px] rounded-psi-md border transition-all duration-[350ms] hover:-translate-y-1.5 ${
                  isAccent
                    ? 'border-[rgba(255,163,26,.3)]'
                    : 'border-psi-borderSoft hover:border-[rgba(255,163,26,.42)]'
                }`}
                style={{
                  background: isAccent
                    ? 'linear-gradient(160deg, rgba(255,163,26,.14) 0%, #fff 100%)'
                    : 'var(--psi-surface-grad)',
                }}
              >
                <span className="font-mono text-[12px] font-bold text-psi-orangeLite">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 mb-2.5 font-display font-semibold text-[21px] tracking-[-.015em] text-psi-ink">
                  {item.title}
                </h3>
                <p className={`text-[15px] leading-[1.6] ${isAccent ? 'text-[#9a6a1f]' : 'text-psi-muted3'}`}>
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
