import { Star } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';

const REEL_URL = 'https://www.facebook.com/reel/1611932096739881';

export function Testimonial() {
  const { t } = useLang();

  return (
    <section
      id="testimonial"
      className="relative px-6 py-[110px] overflow-hidden bg-psi-bgAlt border-y border-psi-hairline scroll-mt-[130px]"
    >
      <div className="relative max-w-[700px] mx-auto psi-reveal">
        <div className="flex items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-psi-orange flex items-center justify-center shrink-0 shadow-[0_10px_28px_rgba(255,163,26,.32)]">
            <Star className="w-5 h-5 text-psi-ink fill-psi-ink" />
          </span>
          <div>
            <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-orangeLite">
              {t.testimonial.eyebrow}
            </p>
            <h2 className="mt-1 font-display font-bold text-[22px] leading-[1.2] text-psi-ink">
              {t.testimonial.h2}
            </h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-psi-borderSoft bg-psi-surface3 p-5">
          <div className="relative overflow-hidden rounded-2xl border border-psi-borderSoft bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${REEL_URL}&show_text=0&width=560`}
              title={t.testimonial.h2}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="mt-4 text-[14px] leading-[1.6] text-psi-muted3">
            <p>{t.testimonial.desc}</p>
            <p>
              {t.testimonial.fallback}{' '}
              <a
                href={REEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-psi-orangeLite underline hover:text-psi-ink transition-colors duration-150"
              >
                {t.testimonial.linkText}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
