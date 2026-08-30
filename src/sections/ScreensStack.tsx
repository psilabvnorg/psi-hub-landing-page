import { useLang } from '@/contexts/LanguageContext';
import { getProductScreenshots } from '@/utils/productImages';
import { Coverflow3D } from '@/components/Coverflow3D';

// Same 8 screenshots the ContentHub product card carousel uses.
const SLIDES = getProductScreenshots('contenthub');

export function ScreensStack() {
  const { t } = useLang();

  return (
    <section id="screens" className="relative px-6 pt-4 pb-24 overflow-hidden scroll-mt-[130px]">
      <div className="relative z-[2] max-w-[1240px] mx-auto text-center psi-reveal">
        <p className="font-mono text-psi-eyebrow font-bold uppercase tracking-[.16em] text-psi-orangeLite">
          {t.stack.eyebrow}
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto mt-8">
        <Coverflow3D
          slides={SLIDES}
          ariaLabel="ContentHub screenshots"
          windowLabel={t.stack.windowLabel}
          hint={t.stack.hint}
        />
      </div>
    </section>
  );
}
