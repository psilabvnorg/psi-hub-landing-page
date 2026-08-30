import { useLang } from '@/contexts/LanguageContext';

const VIDEO_ID = 'mrKhGq2x9z4';

export function Demo() {
  const { t } = useLang();

  return (
    <section id="demo" className="relative px-6 py-[100px] overflow-hidden bg-psi-bgAlt border-y border-psi-hairline scroll-mt-[130px]">
      <div
        data-depth="0.1"
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '-20%', left: '50%', marginLeft: '-500px', width: 1000, height: 800,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.11) 0%, rgba(255,163,26,0) 70%)',
        }}
      />

      <div className="relative max-w-[960px] mx-auto text-center psi-reveal">
        <p className="font-mono text-psi-eyebrow font-bold uppercase tracking-[.16em] text-psi-orangeLite">
          {t.demo.eyebrow}
        </p>
        <h2 className="mt-4 font-display font-bold text-psi-h2-sm text-psi-ink">{t.demo.h2}</h2>

        <div className="mt-10 [perspective:1200px]">
          <div
            data-tilt
            className="rounded-psi-xl overflow-hidden border border-psi-borderStrong shadow-psi-frame transition-transform duration-[350ms] ease-psi"
            style={{ transform: 'rotateX(11deg)' }}
          >
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}`}
                title="PsiHub demo video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>

        <a
          href="https://youtube.com/@psihubvn"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[18px] inline-block font-mono text-xs tracking-[.1em] uppercase text-psi-muted4 hover:text-psi-orangeLite transition-colors duration-150"
        >
          {t.demo.watchLabel} →
        </a>
      </div>
    </section>
  );
}
