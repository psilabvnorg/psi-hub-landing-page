import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useLang } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

type Platform = 'windows' | 'mac';
type Section = 'basic' | 'advanced';

interface StepLink {
  text: string;
  url: string;
}

interface StepDetailLink {
  text: string;
  url: string;
  detail: string;
}

interface StepData {
  number: number;
  title: string;
  description: string;
  link?: StepLink;
  links?: StepDetailLink[];
  videoLink?: StepLink;
  image?: string;
  note?: string;
  noteLinks?: StepLink[];
  noteImage?: string;
  noteBeforeImage?: string;
}

interface InstallConfig {
  basic: StepData[];
  advanced: StepData[];
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

const pageText = {
  en: {
    heading: 'Installation Guide',
    subtitle: 'NO TOKEN, NO API KEY REQUIRED',
    warning: '⚠ Remember to download the correct Mac/Windows file!',
    platformWindows: '🪟 Windows',
    platformMac: '🍎 macOS',
    sectionBasic: 'Basic install',
    sectionAdvanced: 'Advanced - OCR, LipSync, OpenClaw',
    basicSummary: (count: number) => `Follow these ${count} steps to install and run ContentHub on your computer.`,
    comingSoonTitle: 'Coming Soon',
    comingSoonDesc: 'Advanced installation guide is being prepared.',
    wslTitle: 'What is WSL?',
    wslDescription: 'WSL (Windows Subsystem for Linux) is a feature on Windows 10/11 that lets you run a Linux environment inside Windows without a virtual machine or reboot. Turn it on once, then use it like a normal terminal window.',
    wslNoteTitle: 'Why install OpenClaw in WSL instead of Windows?',
    wslNote: 'OpenClaw can automatically execute commands sent through Telegram. To keep it secure, we run OpenClaw inside WSL — a Linux environment separated from Windows. This means OpenClaw cannot access your personal files or data on the Windows machine.',
    openClawTitle: 'What is OpenClaw?',
    openClawDescription: 'OpenClaw is a bridge between Telegram and the PSI app. After setup, you can message your bot to download videos, create news videos, read text, recognize text in images, and more — without opening the app. OpenClaw runs inside WSL and connects to PSI automatically when the app starts.',
    advancedMacTitle: 'What is OpenClaw?',
    advancedMacDescription: 'OpenClaw is a bridge between Telegram and the PSI app. After setup, you can message your bot to download videos, create news videos, read text, recognize text in images, and more. OpenClaw automatically launches with PSI and does not require extra software.',
    advancedMacNoteTitle: 'Why run OpenClaw in a Linux VM on Mac?',
    advancedMacNote: 'OpenClaw can execute tasks based on Telegram commands. For security, we run it inside a built-in Linux microVM (QEMU) embedded in the app — completely isolated from macOS. This means OpenClaw cannot access your personal files or data on your Mac.',
    advancedMacBottomNote: 'The Linux VM is embedded in the app — you do not need to install Node.js, Docker, Homebrew, or any other tools. Just fill in your Telegram bot token in Settings, and OpenClaw will start automatically when PSI opens.',
    singleRunNote: 'This guide only needs to be done once. After setup, just open the PSI app to use it — no extra terminal steps are required.',
    demoTag: 'Demo',
    demoHeading: 'Demo and Installation Guide',
    demoVideoLabel: 'Demo',
    stepLabel: 'Step',
    testimonialVideoHeading: 'REAL USER EXPERIENCE VIDEO',
    testimonialDescription: 'Watch a live Facebook Reel from a real user.',
    testimonialFallback: 'If the embedded video does not appear, you can still watch it directly at',
    testimonialLinkText: 'Facebook Reel link',
    lockWarning: '⚠ If the app locks after 30 minutes, close and reopen it. It is still free and fully functional.',
    noteHeading: '⚠ Note',
    nodejsAdvice1: '1. NodeJS: If the app fails while rendering video, try downloading NodeJS from:',
    nodejsAdvice2: 'After installing NodeJS, restart the application.',
    pythonAdvice1: '2. If the server fails to start, try Python 3.12.0 from:',
  },
  vi: {
    heading: 'Hướng Dẫn Cài Đặt',
    subtitle: 'KHÔNG TỐN TOKEN, KO CẦN API KEY',
    warning: '⚠ Nhớ chọn đúng file Mac/Windows khi tải về bạn nhé!',
    platformWindows: '🪟 Windows',
    platformMac: '🍎 macOS',
    sectionBasic: 'Cài đặt cơ bản',
    sectionAdvanced: 'Nâng cao - OCR, LipSync, OpenClaw',
    basicSummary: (count: number) => `Làm theo ${count} bước dưới đây để cài đặt và chạy ContentHub trên máy tính.`,
    comingSoonTitle: 'Coming Soon',
    comingSoonDesc: 'Hướng dẫn nâng cao - OCR, LipSync, OpenClaw đang được chuẩn bị.',
    wslTitle: 'WSL là gì?',
    wslDescription: 'WSL (Windows Subsystem for Linux) là một tính năng có sẵn trên Windows 10/11, cho phép bạn chạy môi trường Linux ngay bên trong Windows - không cần cài máy ảo, không cần khởi động lại máy. Bạn chỉ cần bật nó lên một lần, sau đó dùng như một cửa sổ terminal bình thường.',
    wslNoteTitle: 'Tại sao cài OpenClaw trong WSL mà không phải thẳng trên Windows?',
    wslNote: 'OpenClaw có khả năng tự động thực thi một số thao tác theo lệnh bạn gửi qua Telegram. Để đảm bảo an toàn, chúng tôi chạy OpenClaw bên trong WSL - một môi trường Linux tách biệt hoàn toàn khỏi Windows. Điều này có nghĩa là OpenClaw không thể truy cập vào file và dữ liệu cá nhân trên máy tính Windows của bạn, giúp dữ liệu luôn được bảo mật.',
    openClawTitle: 'OpenClaw là gì?',
    openClawDescription: 'OpenClaw là cầu nối giữa Telegram và ứng dụng PSI. Sau khi cài xong, bạn có thể nhắn tin trực tiếp cho bot Telegram của mình để ra lệnh - tải video, tạo video tin tức, đọc văn bản, nhận dạng chữ trong ảnh, v.v. - mà không cần mở máy tính. OpenClaw chạy ngầm trong WSL và tự động kết nối với PSI khi bạn khởi động ứng dụng.',
    advancedMacTitle: 'OpenClaw là gì?',
    advancedMacDescription: 'OpenClaw là cầu nối giữa Telegram và ứng dụng PSI. Sau khi cài xong, bạn có thể nhắn tin trực tiếp cho bot Telegram của mình để ra lệnh - tải video, tạo video tin tức, đọc văn bản, nhận dạng chữ trong ảnh, v.v. - mà không cần mở máy tính. OpenClaw tự động khởi động cùng ứng dụng PSI, không cần cài thêm bất kỳ phần mềm nào.',
    advancedMacNoteTitle: 'Tại sao OpenClaw chạy trong máy ảo Linux thay vì thẳng trên Mac?',
    advancedMacNote: 'OpenClaw có khả năng tự động thực thi các thao tác theo lệnh bạn gửi qua Telegram. Để đảm bảo an toàn, chúng tôi chạy OpenClaw bên trong một máy ảo Linux nhỏ (QEMU microVM) được nhúng sẵn trong ứng dụng - hoàn toàn tách biệt khỏi macOS. Điều này có nghĩa là OpenClaw không thể truy cập vào file và dữ liệu cá nhân trên máy tính của bạn, giúp dữ liệu luôn được bảo mật.',
    advancedMacBottomNote: 'Máy ảo Linux được nhúng sẵn trong ứng dụng - bạn không cần cài Node.js, Docker, Homebrew hay bất kỳ công cụ nào khác. Chỉ cần điền Telegram bot token vào phần Cài Đặt, OpenClaw sẽ tự khởi động mỗi khi mở ứng dụng PSI.',
    singleRunNote: 'Hướng dẫn này chỉ cần làm một lần duy nhất. Sau khi cài xong, mỗi lần muốn dùng chỉ cần mở ứng dụng PSI lên là đủ - không cần thao tác thêm gì trong terminal nữa.',
    demoTag: 'Demo',
    demoHeading: 'Demo và Hướng Dẫn Cài Đặt',
    demoVideoLabel: 'Demo',
    testimonialVideoHeading: 'VIDEO TRẢI NGHIỆM TOOL THỰC TẾ TỪ NGƯỜI DÙNG THẬT',
    testimonialDescription: 'Xem video Facebook Reel từ người dùng thật.',
    testimonialFallback: 'Nếu trình nhúng không hiển thị, bạn vẫn có thể xem trực tiếp tại',
    testimonialLinkText: 'link Facebook Reel',
    lockWarning: '⚠ Nếu app bị khóa sau 30 phút, hãy đóng rồi mở lại. Ứng dụng vẫn dùng miễn phí và đầy đủ chức năng.',
    noteHeading: '⚠ Lưu ý',
    stepLabel: 'Bước',
    nodejsAdvice1: '1. NodeJS: Nếu ứng dụng bị lỗi khi render video, thử tải NodeJS từ:',
    nodejsAdvice2: 'Sau khi cài đặt NodeJS, khởi động lại ứng dụng.',
    pythonAdvice1: '2. Nếu server không bật được, thử tải Python 3.12.0 từ:',
  },
} as const;

function renderDescription(description: string, link?: StepLink) {
  const parts = description.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
      {link && (
        <>
          {' '}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffa31a] underline hover:text-white transition-colors duration-150"
          >
            {link.text}
          </a>
        </>
      )}
    </>
  );
}

function ContentHubInstallGuideContent() {
  const { config } = useProducts();
  const { lang, toggle } = useLang();
  const copy = pageText[lang];
  const [platform, setPlatform] = useState<Platform>('windows');
  const [section, setSection] = useState<Section>('basic');
  const [installConfig, setInstallConfig] = useState<InstallConfig>({ basic: [], advanced: [] });

  useEffect(() => {
    fetch(JSON_URLS[platform][lang])
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInstallConfig({ basic: data, advanced: [] });
        } else {
          setInstallConfig({ basic: data.basic ?? [], advanced: data.advanced ?? [] });
        }
      })
      .catch(() => setInstallConfig({ basic: [], advanced: [] }));
  }, [platform, lang]);

  const steps = installConfig[section];

  return (
      <div className="min-h-screen bg-[#1b1b1b]">

        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
            >
              <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <PhLogo prefix="Content" suffix="Hub" size="md" />
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={toggle}
                className="text-sm font-bold uppercase tracking-widest px-3 py-2 rounded-xl border border-[#444] text-[#fff] hover:border-[#ffa31a] hover:text-[#ffa31a] transition-colors"
              >
                <span className={lang === 'en' ? 'text-[#ffa31a]' : 'text-[#808080]'}>EN</span>
                <span className="text-[#808080]">/</span>
                <span className={lang === 'vi' ? 'text-[#ffa31a]' : 'text-[#808080]'}>VI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 text-center">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-1">{copy.heading}</h1>
            <p className="text-white text-base font-bold mb-3 underline">{copy.subtitle}</p>
            <p className="text-[#ffa31a] text-lg font-bold mb-8 animate-pulse">
              {copy.warning}
            </p>

            {/* Platform toggle */}
            <div className="inline-flex rounded-xl overflow-hidden border-2 border-[#ffa31a] mb-6">
              <button
                onClick={() => setPlatform('windows')}
                className={`px-8 py-3 text-lg font-bold transition-all duration-200 cursor-pointer ${
                  platform === 'windows'
                    ? 'bg-[#ffa31a] text-black'
                    : 'bg-transparent text-[#ffa31a] hover:bg-[#ffa31a]/10'
                }`}
              >
                {copy.platformWindows}
              </button>
              <button
                onClick={() => setPlatform('mac')}
                className={`px-8 py-3 text-lg font-bold transition-all duration-200 cursor-pointer ${
                  platform === 'mac'
                    ? 'bg-[#ffa31a] text-black'
                    : 'bg-transparent text-[#ffa31a] hover:bg-[#ffa31a]/10'
                }`}
              >
                {copy.platformMac}
              </button>
            </div>

            {/* Section toggle */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl overflow-hidden border-2 border-[#444]">
                <button
                  onClick={() => setSection('basic')}
                  className={`px-6 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                    section === 'basic'
                      ? 'bg-[#444] text-white'
                      : 'bg-transparent text-[#888] hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {copy.sectionBasic}
                </button>
                <button
                  onClick={() => setSection('advanced')}
                  className={`px-6 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                    section === 'advanced'
                      ? 'bg-[#444] text-white'
                      : 'bg-transparent text-[#888] hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {copy.sectionAdvanced}
                </button>
              </div>
            </div>

            {section === 'basic' && (
              <p className="text-white text-base mt-6">
                {copy.basicSummary(steps.length)}
              </p>
            )}
          </div>

          {/* Advanced placeholder */}
          {section === 'advanced' && steps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#ffa31a]/10 border-2 border-[#ffa31a]/30 flex items-center justify-center">
                <span className="text-[#ffa31a] text-2xl">🚧</span>
              </div>
              <p className="text-white text-xl font-bold">{copy.comingSoonTitle}</p>
              <p className="text-[#888] text-base text-center max-w-sm">
                {copy.comingSoonDesc}
              </p>
            </div>
          )}

          {/* Advanced intro */}
          {section === 'advanced' && steps.length > 0 && platform === 'windows' && (
            <div className="mb-10 p-6 rounded-2xl border border-[#ffa31a]/20 bg-[#ffa31a]/5 flex flex-col gap-5">
              <div>
                <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-2">{copy.wslTitle}</p>
                <p className="text-white text-base leading-relaxed">
                  <strong>{copy.wslTitle}</strong> {copy.wslDescription}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#1a1a2e] border border-[#3a3a6a]">
                <span className="text-xl mt-0.5">🔒</span>
                <div className="flex flex-col gap-1">
                  <p className="text-[#a0a8ff] text-sm font-bold">{copy.wslNoteTitle}</p>
                  <p className="text-[#aaa] text-sm leading-relaxed">
                    {copy.wslNote.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-white">{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-2">{copy.openClawTitle}</p>
                <p className="text-white text-base leading-relaxed">
                  <strong>{copy.openClawTitle}</strong> {copy.openClawDescription}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#111] border border-[#2a2a2a]">
                <span className="text-xl mt-0.5">💡</span>
                <p className="text-[#aaa] text-sm leading-relaxed">
                  {copy.singleRunNote}
                </p>
              </div>
            </div>
          )}

          {/* Advanced intro - Mac */}
          {section === 'advanced' && steps.length > 0 && platform === 'mac' && (
            <div className="mb-10 p-6 rounded-2xl border border-[#ffa31a]/20 bg-[#ffa31a]/5 flex flex-col gap-5">
              <div>
                <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-2">{copy.advancedMacTitle}</p>
                <p className="text-white text-base leading-relaxed">
                  <strong>{copy.advancedMacTitle}</strong> {copy.advancedMacDescription}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#1a1a2e] border border-[#3a3a6a]">
                <span className="text-xl mt-0.5">🔒</span>
                <div className="flex flex-col gap-1">
                  <p className="text-[#a0a8ff] text-sm font-bold">{copy.advancedMacNoteTitle}</p>
                  <p className="text-[#aaa] text-sm leading-relaxed">
                    {copy.advancedMacNote.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-white">{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#111] border border-[#2a2a2a]">
                <span className="text-xl mt-0.5">💡</span>
                <p className="text-[#aaa] text-sm leading-relaxed">
                  {copy.advancedMacBottomNote}
                </p>
              </div>
            </div>
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <div className="flex flex-col gap-12">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">
                        {copy.stepLabel} {step.number}
                      </p>
                      <h2 className="text-white text-xl font-bold">{step.title}</h2>
                      <p className="text-white text-base mt-1">
                        {renderDescription(step.description, step.link)}
                      </p>
                      {step.videoLink && (
                        <a
                          href={step.videoLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-[#ffa31a] underline hover:text-white transition-colors font-bold"
                        >
                          {step.videoLink.text}
                        </a>
                      )}
                      {step.links && (
                        <div className="mt-3 flex flex-col gap-3">
                          {step.links.map((l, i) => (
                            <div key={i}>
                              <a
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#ffa31a] underline hover:text-white transition-colors font-bold"
                              >
                                {l.text}
                              </a>
                              <span className="text-white"> : {l.detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {step.noteBeforeImage && (
                    <div className="ml-14 p-4 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
                      <p className="text-[#ffa31a] text-base font-bold mb-1">{copy.noteHeading}</p>
                      <p className="text-white text-base">{step.noteBeforeImage}</p>
                    </div>
                  )}

                  {step.image && (
                    <div className="rounded-xl overflow-hidden border border-[#2a2a2a] ml-14">
                      <img
                        src={step.image}
                        alt={`${copy.stepLabel} ${step.number}`}
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {step.note && (
                    <div className="ml-14 p-4 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
                      <p className="text-[#ffa31a] text-base font-bold mb-1">{copy.noteHeading}</p>
                      <div className="text-white text-base">
                        {step.note.split('\n').map((line, li) => {
                          const isCommand = line.startsWith('xattr') || line.startsWith('$');
                          if (isCommand) {
                            return (
                              <code key={li} className="block mt-2 bg-[#111] text-[#ffa31a] px-3 py-2 rounded-lg font-mono text-sm">
                                {line}
                              </code>
                            );
                          }
                          return (
                            <p key={li}>
                              {line.split(/(\[\d+\]|voice clone)/gi).map((part, i) => {
                                const refMatch = part.match(/^\[(\d+)\]$/);
                                if (refMatch && step.noteLinks) {
                                  const link = step.noteLinks[parseInt(refMatch[1]) - 1];
                                  if (link) return (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                      className="text-[#ffa31a] underline hover:opacity-80">
                                      {link.text}
                                    </a>
                                  );
                                }
                                if (part.toLowerCase() === 'voice clone') {
                                  return <strong key={i} className="underline">{part}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                      {step.noteImage && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
                          <img src={step.noteImage} alt="Lưu ý" className="w-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Lock note - basic only */}
              {section === 'basic' && (
                <>
                  <div className="ml-14 flex flex-col gap-3">
                    <p className="text-[#ffa31a] text-lg font-bold animate-pulse">
                      {copy.lockWarning}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-[#2a2a2a]">
                      <img
                        src="/assets/PIN.jpg"
                        alt="Lưu ý khi bị lock"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="ml-14 p-6 rounded-xl border border-[#ffa31a]/30 bg-[#ffa31a]/5 animate-pulse-border">
                    <p className="text-[#ffa31a] text-xl font-bold mb-3">{copy.noteHeading}</p>
                    <p className="text-white text-lg">
                      {copy.nodejsAdvice1}{' '}
                      <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors">https://nodejs.org/en/download</a>
                      <br />{copy.nodejsAdvice2}
                    </p>
                    <p className="text-white text-lg mt-3">
                      {copy.pythonAdvice1}{' '}
                      <a href="https://www.python.org/downloads/release/python-3120/" target="_blank" rel="noopener noreferrer" className="text-[#ffa31a] underline hover:text-white transition-colors">https://www.python.org/downloads/release/python-3120/</a>
                    </p>
                  </div>

                  {/* Demo video */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                        ▶
                      </div>
                      <div>
                        <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">
                          {copy.demoTag}
                        </p>
                        <h2 className="text-white text-xl font-bold">{copy.demoHeading}</h2>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] ml-14" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src="https://www.youtube.com/embed/IEepEZDoFDI?autoplay=0&mute=0"
                        title={copy.demoHeading}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <p className="text-white text-base font-bold ml-14 mt-4">{copy.demoVideoLabel}</p>
                    <div className="flex flex-wrap gap-4 ml-14 mt-2">
                      <a
                        href="https://www.youtube.com/@psihubvn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF4444] hover:bg-[#FF0000]/20 transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                        YouTube: @psihubvn
                      </a>
                      <a
                        href="https://www.tiktok.com/@psihub.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f2ea]/10 border border-[#00f2ea]/30 text-[#00f2ea] hover:bg-[#00f2ea]/20 transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z"/></svg>
                        TikTok: @psihub.me
                      </a>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                          ⭐
                        </div>
                        <div>
                          <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">
                            VIDEO
                          </p>
                          <h2 className="text-white text-xl font-bold">{copy.testimonialVideoHeading}</h2>
                        </div>
                      </div>
                      <div className="ml-14 rounded-2xl border border-[#2a2a2a] bg-[#111] p-5">
                        <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111]" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1611932096739881&show_text=0&width=560"
                            title={copy.testimonialVideoHeading}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                        <div className="mt-4 text-sm text-[#aaa]">
                          <p>{copy.testimonialDescription}</p>
                          <p>
                            {copy.testimonialFallback}{' '}
                            <a
                              href="https://www.facebook.com/reel/1611932096739881"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ffa31a] underline hover:text-white"
                            >
                              {copy.testimonialLinkText}
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
  );
}

export function ContentHubInstallGuide() {
  return <ContentHubInstallGuideContent />;
}
