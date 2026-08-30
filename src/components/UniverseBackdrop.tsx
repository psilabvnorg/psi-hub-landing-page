import { useRef } from 'react';
import { useUniverseBackdrop } from '@/hooks/useUniverseBackdrop';

/**
 * Ambient full-page backdrop — starfield, orbiting "planet" dots, drifting
 * drone glyphs, two flight paths. Mounted once at the app root (see
 * main.tsx), before <Routes>, so it paints behind every page/section by
 * DOM order and persists across route navigation without remounting.
 *
 * For it to actually show through, page-level wrappers must not paint
 * their own opaque background over it — see App.tsx / OthersProduct.tsx,
 * which rely on <body>'s bg-psi-bg as the solid base color instead.
 */
export function UniverseBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useUniverseBackdrop(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-[400ms]"
      style={{ opacity: 'var(--psi-universe-opacity)' }}
    />
  );
}
