import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';

const HF_URL = 'https://huggingface.co/psilab/ai-content-hub-release/tree/main';
const VIDEO_ID = 'mrKhGq2x9z4';

export function Intro() {
  const { t } = useLang();

  return (
    <section id="intro" className="relative px-6 pt-[150px] pb-20 overflow-hidden scroll-mt-[130px]">
      {/* Glow group */}
      <div data-depth="0.06" className="absolute inset-[-10%_-5%] z-0 pointer-events-none">
        <div
          className="absolute rounded-full animate-psi-drift"
          style={{ top: '-6%', left: '50%', marginLeft: '-550px', width: 1100, height: 620, background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.20) 0%, rgba(255,163,26,0) 70%)' }}
        />
        <div
          className="absolute rounded-full animate-psi-drift-slow"
          style={{ top: '22%', left: '2%', width: 520, height: 520, background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,92,26,.13) 0%, rgba(255,92,26,0) 70%)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ top: '6%', right: 0, width: 460, height: 460, background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,204,128,.10) 0%, rgba(255,204,128,0) 70%)' }}
        />
      </div>

      {/* Grid mesh */}
      <div data-depth="0.14" className="psi-mesh absolute inset-x-0 top-0 h-[120%] z-0" />

      <div
        className="relative z-[2] max-w-[1240px] mx-auto grid grid-cols-1 md:[grid-template-columns:0.8fr_1.2fr] gap-x-[60px] gap-y-12 items-center"
      >
        {/* Left — ContentHub introduction */}
        <div className="psi-reveal">
          <div className="inline-flex items-center gap-2.5 border border-[rgba(255,163,26,.32)] bg-[rgba(255,163,26,.07)] rounded-full px-4 py-2 font-mono text-[11.5px] font-bold tracking-[.1em] uppercase text-psi-orangeLite">
            <span className="w-[7px] h-[7px] rounded-full bg-psi-ok animate-psi-pulse" />
            {t.intro.badge}
          </div>

          <h1 className="mt-[22px] font-display font-bold text-psi-h2-lg text-psi-ink" style={{ textWrap: 'balance' }}>
            <span className="block">{t.intro.h1a}</span>
            <span className="psi-text-gradient block">{t.intro.h1b}</span>
          </h1>

          <p className="max-w-[520px] mt-5 font-body text-psi-lead text-psi-muted" style={{ textWrap: 'pretty' }}>
            {t.intro.subhead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              to="/#screens"
              className="bg-psi-orange text-psi-ink font-extrabold text-base px-[30px] py-4 rounded-psi-btn shadow-psi-cta"
            >
              {t.intro.ctaPrimary}
            </Link>
            <a
              href={HF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-psi-borderBtn bg-[var(--psi-glass)] text-psi-ink font-bold px-7 py-4 rounded-psi-btn"
            >
              {t.intro.ctaSecondary}
            </a>
          </div>

          <p className="mt-[18px] font-mono text-[11.5px] tracking-[.08em] uppercase text-psi-dim">
            {t.intro.finePrint}
          </p>
        </div>

        {/* Right — install demo video */}
        <div className="psi-reveal [perspective:1200px]">
          <div
            data-tilt
            className="rounded-psi-xl overflow-hidden border border-psi-borderStrong shadow-psi-frame transition-transform duration-[350ms] ease-psi"
            style={{ transform: 'rotateX(11deg)' }}
          >
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}`}
                title="PsiHub install demo video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-xs tracking-[.06em] text-psi-muted4">
            {t.intro.videoCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
