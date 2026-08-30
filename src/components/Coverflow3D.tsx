import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';

// Shared 3D coverflow carousel: drag, scroll horizontally, click a side
// card, or use the arrow keys to bring a different image to the front. Only
// 3 are ever on stage at once (center + one peek on each side); the rest
// sit off-stage until they cycle into view.
//
// Used both by Home's hero screenshot stage (ScreensStack) and ContentHub's
// "Inside the app" gallery, so the two present screenshots identically
// wherever they show up.
const DRAG_THRESHOLD_PX = 50;
const WHEEL_COOLDOWN_MS = 450;

type Role = 'center' | 'left' | 'right' | 'hidden';

function roleFor(index: number, focus: number, total: number): Role {
  const offset = (index - focus + total) % total;
  if (offset === 0) return 'center';
  if (offset === 1) return 'right';
  if (offset === total - 1) return 'left';
  return 'hidden';
}

function styleFor(role: Role): CSSProperties {
  switch (role) {
    case 'center':
      return { left: '14%', width: '72%', top: 0, height: '100%', transform: 'translateZ(60px) rotateY(0deg)', zIndex: 3 };
    case 'left':
      return { left: '-2%', width: '32%', top: '14%', height: '72%', transform: 'translateZ(-180px) rotateY(19deg)', zIndex: 1 };
    case 'right':
      return { left: '70%', width: '32%', top: '14%', height: '72%', transform: 'translateZ(-180px) rotateY(-19deg)', zIndex: 1 };
    case 'hidden':
      return { left: '50%', width: '32%', top: '14%', height: '72%', transform: 'translateZ(-400px) rotateY(0deg)', zIndex: 0, opacity: 0, pointerEvents: 'none' };
  }
}

interface Coverflow3DProps {
  slides: string[];
  ariaLabel: string;
  defaultFocus?: number;
  /** Shows a traffic-light title bar on the center card, e.g. "AI Content Hub — Windows". */
  windowLabel?: string;
  /** Per-slide caption shown below the dots for whichever slide is centered. */
  captions?: string[];
  /** Static hint text shown below the dots (used instead of captions). */
  hint?: string;
  /** Override the stage's responsive height classes. */
  heightClassName?: string;
}

export function Coverflow3D({
  slides,
  ariaLabel,
  defaultFocus = 0,
  windowLabel,
  captions,
  hint,
  heightClassName = 'h-[320px] sm:h-[420px] md:h-[520px] lg:h-[580px]',
}: Coverflow3DProps) {
  const [focus, setFocus] = useState(defaultFocus);
  const dragStartX = useRef<number | null>(null);
  const wheelLocked = useRef(false);

  const advance = useCallback((dir: 1 | -1) => {
    setFocus((f) => (f + dir + slides.length) % slides.length);
  }, [slides.length]);

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // let vertical page scroll through
    e.preventDefault();
    if (wheelLocked.current) return;
    wheelLocked.current = true;
    advance(e.deltaX > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked.current = false; }, WHEEL_COOLDOWN_MS);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) advance(dx < 0 ? 1 : -1);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') advance(-1);
    if (e.key === 'ArrowRight') advance(1);
  };

  return (
    <div className="relative z-[2] [perspective:1800px] [perspective-origin:50%_10%]">
      <div
        data-tilt
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className={`relative ${heightClassName} [transform-style:preserve-3d] transition-transform duration-[350ms] ease-psi cursor-grab active:cursor-grabbing touch-pan-y select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-psi-orange focus-visible:outline-offset-8 rounded-[16px]`}
        style={{ transform: 'rotateX(11deg)' }}
      >
        {slides.map((src, i) => {
          const role = roleFor(i, focus, slides.length);
          const isCenter = role === 'center';
          return (
            <div
              key={src}
              data-role={role}
              onClick={() => { if (!isCenter) setFocus(i); }}
              className={`absolute overflow-hidden border transition-all duration-500 ease-psi ${
                isCenter
                  ? 'rounded-[16px] border-[#2f2f2f] bg-[#141414] shadow-psi-window'
                  : 'rounded-[14px] border-[#262626] shadow-psi-card-3d cursor-pointer'
              }`}
              style={styleFor(role)}
            >
              {isCenter && windowLabel && (
                <div className="flex items-center gap-2 px-3.5 py-[11px] bg-[#171717] border-b border-[#262626]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-psi-orange" />
                  <span className="ml-2 font-mono text-[11px] text-[#6a6a6a]">{windowLabel}</span>
                </div>
              )}
              <img
                src={src}
                alt=""
                draggable={false}
                className={`w-full object-cover object-top ${isCenter && windowLabel ? 'h-[calc(100%-38px)]' : 'h-full'}`}
                style={isCenter ? undefined : { filter: 'saturate(.9) brightness(.72)' }}
              />
            </div>
          );
        })}

        {/* Flat click zones over the left/right peek areas. The side cards
            themselves sit inside a preserve-3d + perspective context, where
            their *painted* pixels and their *hit-tested* pixels can diverge
            (a known browser quirk for nested 3D transforms) — clicking the
            visible sliver of a rotated card can silently miss it. These
            plain, untransformed overlays give a reliable click target over
            the same area instead. */}
        <button
          type="button"
          aria-label="Previous screenshot"
          onClick={() => advance(-1)}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-y-0 left-0 w-[16%] z-[4] cursor-pointer bg-transparent hover:bg-white/[.02] transition-colors duration-200"
        />
        <button
          type="button"
          aria-label="Next screenshot"
          onClick={() => advance(1)}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-y-0 right-0 w-[16%] z-[4] cursor-pointer bg-transparent hover:bg-white/[.02] transition-colors duration-200"
        />
      </div>

      {/* Focus dots + hint/caption */}
      <div className="relative z-[3] mt-6 flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Show screenshot ${i + 1}`}
              onClick={() => setFocus(i)}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ background: i === focus ? '#ffa31a' : '#3a3a3a' }}
            />
          ))}
        </div>
        {captions?.[focus] && (
          <p className="font-mono text-xs tracking-[.06em] text-psi-muted4 text-center">{captions[focus]}</p>
        )}
        {hint && <p className="font-mono text-[10.5px] tracking-[.13em] uppercase text-psi-dim">{hint}</p>}
      </div>
    </div>
  );
}
