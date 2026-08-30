import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';

// Every combination below is read live from the same JSON files the old
// standalone guide page used (public/config/install_{windows,mac}_contenthub[_en].json)
// so this section and any future full-guide page never drift apart, and so
// adding/editing a step is a content change, not a code change.
type Platform = 'windows' | 'mac';
type Section = 'basic' | 'advanced';

interface RawStep {
  number: number;
  title: string;
  description: string;
  link?: { text: string; url: string };
  links?: { text: string; url: string; detail: string }[];
  videoLink?: { text: string; url: string };
  note?: string;
  noteBeforeImage?: string;
  noteLinks?: { text: string; url: string }[];
  noteImage?: string;
  image?: string;
}

interface GuideConfig {
  basic: RawStep[];
  advanced: RawStep[];
}

const JSON_URLS: Record<Platform, Record<'vi' | 'en', string>> = {
  windows: {
    vi: '/config/install_windows_contenthub.json',
    en: '/config/install_windows_contenthub_en.json',
  },
  mac: {
    vi: '/config/install_mac_contenthub.json',
    en: '/config/install_mac_contenthub_en.json',
  },
};

// Natural pixel size of each Windows-basic screenshot, so the browser can
// reserve the right aspect ratio before the (lazy-loaded) image arrives —
// this one flow is by far the most-visited, so it gets the extra polish.
const WINDOWS_BASIC_IMAGE_DIMS: Record<number, [number, number]> = {
  1: [1671, 652],
  2: [795, 105],
  3: [858, 709],
  4: [540, 442],
  5: [565, 519],
  6: [1492, 895],
  7: [1587, 896],
  8: [1588, 894],
  9: [1471, 897],
};

function stripNotePrefix(text?: string): string | undefined {
  if (!text) return undefined;
  return text.replace(/^(LƯU\s*Ý|NOTE)\s*:\s*/i, '').trim();
}

// Shared **bold** markdown, used in both step descriptions and note bodies.
function renderBold(text: string, keyPrefix = ''): React.ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}${i}`}>{part}</strong> : part
  );
}

function renderDescription(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {renderBold(line, `d${i}-`)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

// Note bodies carry a bit more formatting than descriptions: a line starting
// with `$` or `sudo`/`xattr` renders as a terminal command, blank lines
// become paragraph spacing, and `[1]`/`[2]` tokens resolve against noteLinks.
function renderNote(text: string, noteLinks?: { text: string; url: string }[]) {
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <span key={i} className="block h-2" />;
    const trimmed = line.trim();
    if (trimmed.startsWith('$') || trimmed.startsWith('sudo ') || trimmed.startsWith('xattr')) {
      return (
        <code
          key={i}
          className="block mt-2 bg-black/40 text-psi-orange px-3 py-2 rounded-lg font-mono text-[13px] whitespace-pre-wrap break-all"
        >
          {line}
        </code>
      );
    }
    const segments = line.split(/(\[\d+\])/g);
    return (
      <p key={i} className="mt-1.5 first:mt-0">
        {segments.map((seg, j) => {
          const m = seg.match(/^\[(\d+)\]$/);
          const linked = m ? noteLinks?.[Number(m[1]) - 1] : undefined;
          if (linked) {
            return (
              <a
                key={j}
                href={linked.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-psi-ink transition-colors duration-150"
              >
                {linked.text}
              </a>
            );
          }
          return <span key={j}>{renderBold(seg, `n${i}-${j}-`)}</span>;
        })}
      </p>
    );
  });
}

function toggleBtnClass(active: boolean) {
  return `px-4 py-2 rounded-full font-mono text-[11.5px] font-bold tracking-[.08em] uppercase transition-colors duration-150 ${
    active ? 'bg-psi-orange text-psi-ink' : 'text-psi-muted4 hover:text-psi-ink'
  }`;
}

export function InstallGuide() {
  const { t, lang } = useLang();
  const [platform, setPlatform] = useState<Platform>('windows');
  const [section, setSection] = useState<Section>('basic');
  const [configs, setConfigs] = useState<Partial<Record<Platform, Record<'vi' | 'en', GuideConfig>>>>({});
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(1);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Fetch all four platform/language combinations once, up front, so
  // flipping the toggles is instant with no reload flicker.
  useEffect(() => {
    let cancelled = false;
    const platforms: Platform[] = ['windows', 'mac'];
    const langs = ['vi', 'en'] as const;
    Promise.all(
      platforms.flatMap((p) =>
        langs.map((l) =>
          fetch(JSON_URLS[p][l])
            .then((r) => r.json())
            .then((data) => ({ p, l, data }))
            .catch(() => ({ p, l, data: { basic: [], advanced: [] } }))
        )
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Partial<Record<Platform, Record<'vi' | 'en', GuideConfig>>> = {};
      for (const { p, l, data } of results) {
        next[p] = next[p] ?? ({} as Record<'vi' | 'en', GuideConfig>);
        next[p]![l] = { basic: data.basic ?? [], advanced: data.advanced ?? [] };
      }
      setConfigs(next);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const config = configs[platform]?.[lang];
  const rawSteps = useMemo(
    () => (config ? (section === 'basic' ? config.basic : config.advanced) : []),
    [config, section]
  );
  const showCaptions = platform === 'windows' && section === 'basic';

  // `active` is only ever written by the scroll-spy below, so right after
  // switching platform/section (before the next scroll event) it can still
  // point at a step number from the previous list — fall back to the first
  // step of the new one for that render instead of a stale/missing highlight.
  const activeStep = rawSteps.some((s) => s.number === active) ? active : rawSteps[0]?.number ?? 1;

  // Scroll-spy over the step articles — only wired up once they actually
  // exist in the DOM, and torn down whenever the list changes so it never
  // observes stale nodes from the previous platform/section.
  useEffect(() => {
    if (!rawSteps.length || !('IntersectionObserver' in window)) return;
    const els = rawSteps
      .map((s) => document.getElementById(`gstep-${s.number}`))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(Number(topMost.target.getAttribute('data-step')));
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rawSteps]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <section id="guide" className="relative px-6 py-[120px] scroll-mt-[130px]">
      {/* Glow lives in its own clipped layer — an overflow-hidden ancestor
          around the sticky step rail below would break position:sticky.
          This section runs to ~9 steps of screenshots (thousands of px), so
          one blob near the top only lights up the head — three, spaced
          down the section and alternating sides, keep some ambient warmth
          in view for however far you've scrolled. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: '4%', right: '-12%', width: 820, height: 820,
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.09) 0%, rgba(255,163,26,0) 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '38%', left: '-14%', width: 720, height: 720,
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,163,26,.08) 0%, rgba(255,163,26,0) 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '70%', right: '-10%', width: 760, height: 760,
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,92,26,.07) 0%, rgba(255,92,26,0) 70%)',
          }}
        />
      </div>

      <div className="relative max-w-[1240px] mx-auto">
        {/* Head */}
        <div className="max-w-[720px] mx-auto text-center psi-reveal">
          <p className="font-mono text-psi-eyebrow font-bold uppercase tracking-[.16em] text-psi-orangeLite">
            {t.guide.eyebrow}
          </p>
          <h2
            className="mt-4 font-display font-bold text-psi-ink"
            style={{ fontSize: 'clamp(32px,4.4vw,50px)', lineHeight: 1.05, letterSpacing: '-.03em', textWrap: 'balance' }}
          >
            {t.guide.h2}
          </h2>

          {/* Platform + section toggles */}
          <div className="mt-[26px] flex flex-wrap gap-3 justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-psi-borderStrong p-1">
              <button type="button" onClick={() => setPlatform('windows')} className={toggleBtnClass(platform === 'windows')}>
                {t.guide.platformWindows}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlatform('mac');
                  setSection('basic');
                }}
                className={toggleBtnClass(platform === 'mac')}
              >
                {t.guide.platformMac}
              </button>
            </div>
            {platform === 'windows' && (
              <div className="inline-flex items-center gap-1 rounded-full border border-psi-borderStrong p-1">
                <button type="button" onClick={() => setSection('basic')} className={toggleBtnClass(section === 'basic')}>
                  {t.guide.sectionBasic}
                </button>
                <button type="button" onClick={() => setSection('advanced')} className={toggleBtnClass(section === 'advanced')}>
                  {t.guide.sectionAdvanced}
                </button>
              </div>
            )}
          </div>

          {section === 'basic' && (
            <div className="mt-3.5 flex flex-wrap gap-2.5 justify-center">
              <span className="rounded-full px-[15px] py-2 font-mono text-[11px] font-bold tracking-[.09em] uppercase border border-psi-borderDashed text-psi-muted4">
                {t.guide.chipNoApiKey}
              </span>
            </div>
          )}
        </div>

        {!loaded ? (
          <div className="mt-16 flex justify-center text-psi-muted4 text-sm">…</div>
        ) : rawSteps.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-psi-ink text-xl font-bold">{t.guide.comingSoonTitle}</p>
            <p className="text-psi-muted3 text-base max-w-sm">{t.guide.comingSoonDesc}</p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 xl:[grid-template-columns:236px_1fr] gap-[52px] items-start">
            {/* Step rail — sticky within this grid's row height, so it tracks
                the steps while the section is in view and scrolls away
                normally once you pass the last one. */}
            <aside
              className="hidden xl:block sticky top-[104px] max-h-[calc(100vh-130px)] overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d0ccbe transparent' }}
            >
              <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-muted5 px-3 pb-3.5">
                {t.guide.railLabel}
              </p>
              <nav className="flex flex-col gap-0.5">
                {rawSteps.map((raw) => {
                  const isActive = activeStep === raw.number;
                  return (
                    <a
                      key={raw.number}
                      href={`#gstep-${raw.number}`}
                      className={`flex gap-3 items-baseline px-3 py-[9px] rounded-[10px] border-l-2 text-[13.5px] leading-[1.35] transition-colors duration-[250ms] ${
                        isActive
                          ? 'text-psi-orangeLite border-psi-orange bg-[rgba(255,163,26,.06)]'
                          : 'text-psi-muted4 border-psi-borderSoft hover:text-psi-ink'
                      }`}
                    >
                      <span className="font-mono text-[11px] font-bold tracking-[.06em] shrink-0">
                        {String(raw.number).padStart(2, '0')}
                      </span>
                      <span>{raw.title}</span>
                    </a>
                  );
                })}
              </nav>
              <div className="mt-[26px] pt-[22px] border-t border-psi-hairline flex flex-col gap-2.5">
                <Link
                  to="/contenthub/huong-dan-api"
                  className="block text-center rounded-xl px-4 py-[13px] text-[14.5px] bg-psi-orange text-psi-ink font-extrabold shadow-[0_14px_34px_rgba(255,163,26,.26)]"
                >
                  {t.guide.ctaApi}
                </Link>
              </div>
            </aside>

            {/* Step articles */}
            <div className="flex flex-col gap-[26px]">
              {section === 'advanced' && (
                <div className="flex flex-col gap-5 bg-psi-surface border border-psi-borderSoft rounded-psi-lg px-[30px] py-7">
                  {platform === 'windows' ? (
                    <>
                      <div>
                        <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-orangeLite mb-2">
                          {t.guide.wslTitle}
                        </p>
                        <p className="text-[15px] leading-[1.65] text-psi-muted2">{t.guide.wslDescription}</p>
                      </div>
                      <div className="flex gap-3.5 items-start bg-[rgba(120,140,255,.08)] border border-[rgba(120,140,255,.25)] rounded-[14px] px-5 py-[18px]">
                        <span className="text-lg shrink-0">🔒</span>
                        <div>
                          <p className="font-bold text-[13px] text-[#4c50b0]">{t.guide.wslNoteTitle}</p>
                          <p className="mt-1.5 text-[14px] leading-[1.6] text-[#4f4f78]">{renderBold(t.guide.wslNote)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-orangeLite mb-2">
                          {t.guide.openClawTitle}
                        </p>
                        <p className="text-[15px] leading-[1.65] text-psi-muted2">{t.guide.openClawDescription}</p>
                      </div>
                      <div className="flex gap-3.5 items-start bg-black/25 border border-psi-borderSoft rounded-[14px] px-5 py-[18px]">
                        <span className="text-lg shrink-0">💡</span>
                        <p className="text-[14px] leading-[1.6] text-psi-muted3">{t.guide.singleRunNote}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-orangeLite mb-2">
                          {t.guide.advancedMacTitle}
                        </p>
                        <p className="text-[15px] leading-[1.65] text-psi-muted2">{t.guide.advancedMacDescription}</p>
                      </div>
                      <div className="flex gap-3.5 items-start bg-[rgba(120,140,255,.08)] border border-[rgba(120,140,255,.25)] rounded-[14px] px-5 py-[18px]">
                        <span className="text-lg shrink-0">🔒</span>
                        <div>
                          <p className="font-bold text-[13px] text-[#4c50b0]">{t.guide.advancedMacNoteTitle}</p>
                          <p className="mt-1.5 text-[14px] leading-[1.6] text-[#4f4f78]">{renderBold(t.guide.advancedMacNote)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3.5 items-start bg-black/25 border border-psi-borderSoft rounded-[14px] px-5 py-[18px]">
                        <span className="text-lg shrink-0">💡</span>
                        <p className="text-[14px] leading-[1.6] text-psi-muted3">{t.guide.advancedMacBottomNote}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {rawSteps.map((raw, i) => {
                const isLast = raw.number === rawSteps.length;
                const note = stripNotePrefix(raw.note ?? raw.noteBeforeImage);
                const caption = showCaptions ? t.guide.captions[i] : undefined;
                const imageDims =
                  platform === 'windows' && section === 'basic' ? WINDOWS_BASIC_IMAGE_DIMS[raw.number] : undefined;

                return (
                  <article key={raw.number} id={`gstep-${raw.number}`} data-step={raw.number} className="relative scroll-mt-[130px]">
                    <div className="flex gap-[22px] items-start">
                      {/* Timeline gutter */}
                      <div className="flex flex-col items-center self-stretch shrink-0">
                        <span className="w-11 h-11 rounded-full bg-psi-orange text-psi-ink font-display font-bold text-[19px] flex items-center justify-center shadow-[0_10px_28px_rgba(255,163,26,.32)] z-10">
                          {raw.number}
                        </span>
                        {!isLast && (
                          <span
                            className="flex-1 w-0.5 mt-2.5"
                            style={{ background: 'linear-gradient(to bottom, rgba(255,163,26,.45), rgba(255,163,26,.05))' }}
                          />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className={`flex-1 min-w-0 bg-psi-surface border rounded-psi-lg pt-7 px-[30px] pb-[30px] ${
                          isLast ? 'border-[rgba(255,163,26,.3)]' : 'border-psi-borderSoft'
                        }`}
                      >
                        <p className="font-mono text-[10.5px] font-bold tracking-[.16em] uppercase text-psi-orangeLite">
                          {t.guide.stepLabel} {raw.number}
                        </p>
                        <h3 className="mt-2.5 font-display font-semibold text-[23px] tracking-[-.015em] text-psi-ink">
                          {raw.title}
                        </h3>
                        <p className="mt-3 text-[15.5px] leading-[1.65] text-psi-muted2" style={{ textWrap: 'pretty' }}>
                          {renderDescription(raw.description)}
                        </p>

                        {/* A single lightweight link (e.g. "Open @BotFather →") */}
                        {raw.link && (
                          <a
                            href={raw.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[9px] mt-4 border border-psi-borderBtn rounded-xl px-4 py-[11px] font-bold text-sm text-psi-ink"
                          >
                            {raw.link.text}
                          </a>
                        )}

                        {/* One or more download pills, each with a detail line */}
                        {raw.links?.map((l, li) => (
                          <a
                            key={li}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-wrap items-center gap-2.5 mt-4 bg-[rgba(255,163,26,.1)] border border-[rgba(255,163,26,.32)] rounded-xl px-4 py-3 text-psi-orangeLite font-bold text-[14.5px]"
                          >
                            <span className="font-mono">↓ {l.text}</span>
                            <span className="font-body font-medium text-[#9a6a1f]">{l.detail}</span>
                          </a>
                        ))}

                        {raw.videoLink && (
                          <a
                            href={raw.videoLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[9px] mt-4 border border-psi-borderBtn rounded-xl px-4 py-[11px] font-bold text-sm text-psi-ink"
                          >
                            <span>▶</span> {raw.videoLink.text}
                          </a>
                        )}

                        {note && (
                          <div className="flex gap-3.5 items-start mt-5 bg-[rgba(255,163,26,.07)] border border-[rgba(255,163,26,.28)] rounded-[14px] px-5 py-[18px]">
                            <span className="font-mono text-[15px] text-psi-orangeLite shrink-0">⚠</span>
                            <div className="min-w-0">
                              <p className="font-mono text-[10.5px] font-bold tracking-[.14em] uppercase text-psi-orangeLite">
                                {t.guide.noteLabel}
                              </p>
                              <div className="mt-1 text-[14.5px] leading-[1.6] text-[#9a6a1f]" style={{ textWrap: 'pretty' }}>
                                {renderNote(note, raw.noteLinks)}
                              </div>
                              {raw.noteImage && (
                                <div className="mt-3 rounded-[10px] overflow-hidden border border-[rgba(255,163,26,.25)]">
                                  <img src={raw.noteImage} loading="lazy" className="block w-full" alt="" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {raw.image && (
                          <figure className="mt-6 cursor-zoom-in" onClick={() => setLightbox(raw.image!)}>
                            {/* Screenshot chrome stays dark — these frame the app's own
                                dark-mode UI, so a light frame would look broken here. */}
                            <div className="border border-[#262626] rounded-[14px] overflow-hidden bg-[#0f0f0f] shadow-[0_24px_60px_rgba(0,0,0,.55)]">
                              <img
                                src={raw.image}
                                loading="lazy"
                                width={imageDims?.[0]}
                                height={imageDims?.[1]}
                                className="block w-full h-auto"
                                alt={raw.title}
                              />
                            </div>
                            {caption && (
                              <figcaption className="mt-3 font-mono text-[11.5px] tracking-[.06em] text-psi-muted5">
                                {caption}
                              </figcaption>
                            )}
                          </figure>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Session-lock notice + the two most common CPU-only fixes —
                  not one of the numbered steps, just a heads-up for anyone
                  who hits it. Shown for either platform's basic install. */}
              {section === 'basic' && (
                <>
                  <div className="flex flex-col gap-5">
                    <p className="text-psi-orangeLite font-bold text-[15.5px] animate-pulse">{t.guide.lockWarning}</p>
                    <div className="rounded-[14px] overflow-hidden border border-[#262626] bg-[#0f0f0f] shadow-[0_24px_60px_rgba(0,0,0,.55)]">
                      <img src="/assets/PIN.jpg" alt="" loading="lazy" className="block w-full" />
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start bg-[rgba(255,163,26,.07)] border border-[rgba(255,163,26,.28)] rounded-[14px] px-5 py-[18px]">
                    <span className="font-mono text-[15px] text-psi-orangeLite shrink-0">⚠</span>
                    <div className="flex flex-col gap-3">
                      <p className="font-mono text-[10.5px] font-bold tracking-[.14em] uppercase text-psi-orangeLite">
                        {t.guide.noteLabel}
                      </p>
                      <p className="text-[14.5px] leading-[1.6] text-[#9a6a1f]">
                        {t.guide.nodejsAdvice1}{' '}
                        <a
                          href="https://nodejs.org/en/download"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-psi-ink transition-colors duration-150"
                        >
                          https://nodejs.org/en/download
                        </a>
                        <br />
                        {t.guide.nodejsAdvice2}
                      </p>
                      <p className="text-[14.5px] leading-[1.6] text-[#9a6a1f]">
                        {t.guide.pythonAdvice1}{' '}
                        <a
                          href="https://www.python.org/downloads/release/python-3120/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-psi-ink transition-colors duration-150"
                        >
                          https://www.python.org/downloads/release/python-3120/
                        </a>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {lightbox &&
        createPortal(
          <div
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-10 bg-[rgba(6,6,6,.92)] backdrop-blur-lg cursor-zoom-out"
          >
            <img
              src={lightbox}
              alt=""
              className="max-w-full max-h-full rounded-[14px] border border-[#3a3a3a] shadow-[0_40px_120px_rgba(0,0,0,.8)]"
            />
          </div>,
          document.body
        )}
    </section>
  );
}
