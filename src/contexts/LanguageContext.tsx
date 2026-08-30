import { createContext, useContext, useState } from 'react';

export type Lang = 'en' | 'vi';

export const translations = {
  en: {
    Guide: 'Guide',
    labels: {
      phone: 'Phone', facebook: 'Facebook', website: 'Website',
      youtube: 'YouTube', tiktok: 'TikTok', email: 'Email', address: 'Address', linkedin: 'LinkedIn',
    },
    nav: {
      links: { products: 'Products', contact: 'Contact' },
      cta: 'Install guide',
    },
    pageIndex: {
      intro: 'Overview',
      screens: 'Screens',
    },
    intro: {
      badge: 'ContentHub · Windows & macOS builds available',
      h1a: 'One desktop app for your whole',
      h1b: 'content pipeline.',
      subhead: 'News into video, auto-generated karaoke, bulk YouTube playlist download and processing, voice cloning, dubbing, background removal and image upscaling — all running on your own machine.',
      ctaPrimary: 'Explore ContentHub →',
      ctaSecondary: 'Download for Windows or macOS',
      finePrint: 'Free to try · Windows 10/11 & macOS · No card required',
      videoCaption: 'A full video walkthrough of the install.',
    },
    stack: {
      eyebrow: 'ContentHub · Real app screens',
      hint: 'Drag, scroll, or click to explore',
      windowLabel: 'AI Content Hub — Windows',
    },
    marquee: {
      items: [
        'News → Video', 'Auto Karaoke', 'YouTube Playlist Batch', 'Voice Cloning',
        'Video Dubbing', 'Background Removal', 'Image Upscale', 'Pipeline Automation',
      ],
    },
    features: {
      eyebrow: 'What it does',
      h2: 'So many features, only one application.',
      sub: 'Every feature runs on its own or chains into an automated pipeline. No plugins to install, no jumping between five different websites.',
      items: [
        { title: 'News into video', body: 'Paste an article link. The app drafts the script, narrates it, assembles footage and exports a finished video.' },
        { title: 'Auto karaoke', body: 'Extract lyrics, align them word by word, and render a karaoke video with text that follows the track.' },
        { title: 'Bulk playlist download', body: 'Queue an entire YouTube playlist, then download and process every item in the background while you work.' },
        { title: 'Voice cloning', body: 'From one short sample, generate new narration that keeps the same voice across every video you make.' },
        { title: 'Video dubbing', body: 'Translate and re-voice foreign footage, matching each line to the timing of the original.' },
        { title: 'Background removal', body: 'Cut backgrounds out of images and video in batches, with clean edges for thumbnails and composites.' },
        { title: 'Image upscale', body: 'Raise old or soft images to a resolution that holds up in 1080p and 4K timelines.' },
        { title: 'Pipeline automation', body: 'Chain the steps into one recipe and run it in bulk: one click, dozens of finished videos.' },
      ],
    },
    demo: {
      eyebrow: 'Demo',
      h2: 'Watch one video built end to end.',
      watchLabel: 'Watch on YouTube @psihubvn',
    },
    guide: {
      eyebrow: 'Install guide',
      h2: 'A screenshot for every step.',
      chipDuration: 'About 15 minutes',
      chipNoApiKey: 'No API key needed',
      railLabel: 'Steps',
      ctaApi: 'API guide',
      stepLabel: 'Step',
      noteLabel: 'Note',
      platformWindows: 'Windows',
      platformMac: 'macOS',
      sectionBasic: 'Basic install',
      sectionAdvanced: 'Advanced (OpenClaw)',
      comingSoonTitle: 'Coming soon',
      comingSoonDesc: 'This guide is being prepared.',
      wslTitle: 'What is WSL?',
      wslDescription: 'WSL (Windows Subsystem for Linux) is a feature on Windows 10/11 that lets you run a Linux environment inside Windows without a virtual machine or reboot. Turn it on once, then use it like a normal terminal window.',
      wslNoteTitle: 'Why install OpenClaw in WSL instead of Windows?',
      wslNote: 'OpenClaw can automatically execute commands sent through Telegram. To keep it secure, we run OpenClaw inside WSL — a Linux environment separated from Windows. This means OpenClaw cannot access your personal files or data on the Windows machine.',
      openClawTitle: 'What is OpenClaw?',
      openClawDescription: 'OpenClaw is a bridge between Telegram and the PSI app. After setup, you can message your bot to download videos, create news videos, read text, recognize text in images, and more — without opening the app. OpenClaw runs inside WSL and connects to PSI automatically when the app starts.',
      singleRunNote: 'This guide only needs to be done once. After setup, just open the PSI app to use it — no extra terminal steps are required.',
      advancedMacTitle: 'What is OpenClaw?',
      advancedMacDescription: 'OpenClaw is a bridge between Telegram and the PSI app. After setup, you can message your bot to download videos, create news videos, read text, recognize text in images, and more. OpenClaw automatically launches with PSI and does not require extra software.',
      advancedMacNoteTitle: 'Why run OpenClaw in a Linux VM on Mac?',
      advancedMacNote: 'OpenClaw can execute tasks based on Telegram commands. For security, we run it inside a built-in Linux microVM (QEMU) embedded in the app — completely isolated from macOS. This means OpenClaw cannot access your personal files or data on your Mac.',
      advancedMacBottomNote: 'The Linux VM is embedded in the app — you do not need to install Node.js, Docker, Homebrew, or any other tools. Just fill in your Telegram bot token in Settings, and OpenClaw will start automatically when PSI opens.',
      lockWarning: '⚠ If the app locks after 30 minutes, close and reopen it. It is still free and fully functional.',
      nodejsAdvice1: '1. NodeJS: If the app fails while rendering video, try downloading NodeJS from:',
      nodejsAdvice2: 'After installing NodeJS, restart the application.',
      pythonAdvice1: '2. If the server fails to start, try Python 3.12.0 from:',
      captions: [
        'The release page on Hugging Face',
        'Two folders after extracting: MODELS and RUNTIME',
        'Right-click → Run as administrator',
        'The SmartScreen notice',
        'Run anyway starts the app',
        'First start-up screen',
        'Settings → Server tab',
        'Model list with download buttons',
        'Model status: Installed',
      ],
    },
    testimonial: {
      eyebrow: 'Video',
      h2: 'Real user experience video',
      desc: 'Watch a live Facebook Reel from a real user.',
      fallback: 'If the embedded video does not appear, you can still watch it directly at',
      linkText: 'Facebook Reel link',
    },
    products: {
      eyebrow: 'Our products',
      h2: 'Everything PsiHub is building.',
    },
    productStatus: { ready: 'Ready', beta: 'Beta', comingSoon: 'Coming soon' },
    contactCta: {
      eyebrow: 'Contact',
      h2: "We're here to help.",
      ctaGuide: 'Read the install guide →',
      ctaFacebook: 'Message us on Facebook',
      desc: 'Reach us on any channel below. We are always happy to help.',
    },
    footer: {
      tagline: 'Innovative digital solutions for everyone',
      allRights: 'All rights reserved.',
      madeIn: 'Made in',
    },
  },
  vi: {
    Guide: 'Hướng Dẫn',
    labels: {
      phone: 'Điện Thoại', facebook: 'Facebook', website: 'Website',
      youtube: 'YouTube', tiktok: 'TikTok', email: 'Email', address: 'Địa Chỉ', linkedin: 'LinkedIn',
    },
    nav: {
      links: { products: 'Sản phẩm', contact: 'Liên hệ' },
      cta: 'Hướng dẫn cài đặt',
    },
    pageIndex: {
      intro: 'Giới thiệu',
      screens: 'Ảnh chụp',
    },
    intro: {
      badge: 'ContentHub · Đã có bản Windows & macOS',
      h1a: 'Một công cụ cho toàn bộ',
      h1b: 'quy trình sản xuất nội dung.',
      subhead: 'Biến tin tức thành video, tự động tạo karaoke, tải và xử lý playlist YouTube hàng loạt, nhân bản giọng nói, lồng tiếng, xóa nền, nâng cấp ảnh — tất cả chạy trên máy của bạn.',
      ctaPrimary: 'Khám phá và xem hướng dẫn ContentHub',
      ctaSecondary: 'Tải bản Windows hoặc macOS',
      finePrint: 'Miễn phí dùng mọi chức năng',
      videoCaption: 'Video hướng dẫn cài đặt đầy đủ.',
    },
    stack: {
      eyebrow: 'ContentHub · Giao diện trong ứng dụng',
      hint: 'Kéo, cuộn hoặc bấm để xem thêm',
      windowLabel: 'AI Content Hub — Windows',
    },
    marquee: {
      items: [
        'News → Video', 'Auto Karaoke', 'YouTube Playlist Batch', 'Voice Cloning',
        'Video Dubbing', 'Background Removal', 'Image Upscale', 'Pipeline Automation',
      ],
    },
    features: {
      eyebrow: 'Tính năng',
      h2: 'Rất nhiều tính năng, một ứng dụng duy nhất.',
      sub: 'Mỗi tính năng chạy độc lập hoặc nối thành chuỗi tự động. Không cần cài thêm plugin, không phải nhảy qua nhiều web.',
      items: [
        { title: 'Tin tức thành video', body: 'Dán một đường link bài báo. Công cụ viết kịch bản, đọc lời bình, ghép hình và xuất ra video hoàn chỉnh.' },
        { title: 'Tự động tạo karaoke', body: 'Tách lời, canh thời gian từng chữ và render video karaoke có chữ chạy theo nhạc.' },
        { title: 'Tải playlist hàng loạt', body: 'Đưa cả playlist YouTube vào hàng đợi, tải và xử lý hàng loạt trong khi bạn làm việc khác.' },
        { title: 'Nhân bản giọng nói', body: 'Từ một mẫu giọng ngắn, tạo lời đọc mới giữ nguyên chất giọng cho mọi video sau này.' },
        { title: 'Lồng tiếng video', body: 'Dịch và lồng tiếng lại video nước ngoài, khớp thời lượng từng câu với bản gốc.' },
        { title: 'Xóa nền', body: 'Xóa nền ảnh và video theo lô, giữ viền sạch cho thumbnail và cảnh ghép.' },
        { title: 'Nâng cấp ảnh', body: 'Tăng độ phân giải ảnh cũ, mờ lên mức dùng được cho video 1080p và 4K.' },
        { title: 'Tự động hóa quy trình', body: 'Nối các bước thành một chuỗi và chạy hàng loạt: một lần bấm, hàng chục video ra lò.' },
      ],
    },
    demo: {
      eyebrow: 'Demo',
      h2: 'Xem video hướng dẫn cài đặt.',
      watchLabel: 'Xem trên YouTube @psihubvn',
    },
    guide: {
      eyebrow: 'Hướng dẫn cài đặt',
      h2: 'Có ảnh minh họa cho từng bước.',
      chipDuration: 'Khoảng 15 phút',
      chipNoApiKey: 'Không cần API key',
      railLabel: 'Các bước',
      ctaApi: 'Hướng dẫn API',
      stepLabel: 'Bước',
      noteLabel: 'Lưu ý',
      platformWindows: 'Windows',
      platformMac: 'macOS',
      sectionBasic: 'Cài đặt cơ bản',
      sectionAdvanced: 'Nâng cao (OpenClaw)',
      comingSoonTitle: 'Sắp có',
      comingSoonDesc: 'Hướng dẫn đang được chuẩn bị.',
      wslTitle: 'WSL là gì?',
      wslDescription: 'WSL (Windows Subsystem for Linux) là một tính năng có sẵn trên Windows 10/11, cho phép bạn chạy môi trường Linux ngay bên trong Windows - không cần cài máy ảo, không cần khởi động lại máy. Bạn chỉ cần bật nó lên một lần, sau đó dùng như một cửa sổ terminal bình thường.',
      wslNoteTitle: 'Tại sao cài OpenClaw trong WSL mà không phải thẳng trên Windows?',
      wslNote: 'OpenClaw có khả năng tự động thực thi một số thao tác theo lệnh bạn gửi qua Telegram. Để đảm bảo an toàn, chúng tôi chạy OpenClaw bên trong WSL - một môi trường Linux tách biệt hoàn toàn khỏi Windows. Điều này có nghĩa là OpenClaw không thể truy cập vào file và dữ liệu cá nhân trên máy tính Windows của bạn, giúp dữ liệu luôn được bảo mật.',
      openClawTitle: 'OpenClaw là gì?',
      openClawDescription: 'OpenClaw là cầu nối giữa Telegram và ứng dụng PSI. Sau khi cài xong, bạn có thể nhắn tin trực tiếp cho bot Telegram của mình để ra lệnh - tải video, tạo video tin tức, đọc văn bản, nhận dạng chữ trong ảnh, v.v. - mà không cần mở máy tính. OpenClaw chạy ngầm trong WSL và tự động kết nối với PSI khi bạn khởi động ứng dụng.',
      singleRunNote: 'Hướng dẫn này chỉ cần làm một lần duy nhất. Sau khi cài xong, mỗi lần muốn dùng chỉ cần mở ứng dụng PSI lên là đủ - không cần thao tác thêm gì trong terminal nữa.',
      advancedMacTitle: 'OpenClaw là gì?',
      advancedMacDescription: 'OpenClaw là cầu nối giữa Telegram và ứng dụng PSI. Sau khi cài xong, bạn có thể nhắn tin trực tiếp cho bot Telegram của mình để ra lệnh - tải video, tạo video tin tức, đọc văn bản, nhận dạng chữ trong ảnh, v.v. - mà không cần mở máy tính. OpenClaw tự động khởi động cùng ứng dụng PSI, không cần cài thêm bất kỳ phần mềm nào.',
      advancedMacNoteTitle: 'Tại sao OpenClaw chạy trong máy ảo Linux thay vì thẳng trên Mac?',
      advancedMacNote: 'OpenClaw có khả năng tự động thực thi các thao tác theo lệnh bạn gửi qua Telegram. Để đảm bảo an toàn, chúng tôi chạy OpenClaw bên trong một máy ảo Linux nhỏ (QEMU microVM) được nhúng sẵn trong ứng dụng - hoàn toàn tách biệt khỏi macOS. Điều này có nghĩa là OpenClaw không thể truy cập vào file và dữ liệu cá nhân trên máy tính của bạn, giúp dữ liệu luôn được bảo mật.',
      advancedMacBottomNote: 'Máy ảo Linux được nhúng sẵn trong ứng dụng - bạn không cần cài Node.js, Docker, Homebrew hay bất kỳ công cụ nào khác. Chỉ cần điền Telegram bot token vào phần Cài Đặt, OpenClaw sẽ tự khởi động mỗi khi mở ứng dụng PSI.',
      lockWarning: '⚠ Nếu app bị khóa sau 30 phút, hãy đóng rồi mở lại. Ứng dụng vẫn dùng miễn phí và đầy đủ chức năng.',
      nodejsAdvice1: '1. NodeJS: Nếu ứng dụng bị lỗi khi render video, thử tải NodeJS từ:',
      nodejsAdvice2: 'Sau khi cài đặt NodeJS, khởi động lại ứng dụng.',
      pythonAdvice1: '2. Nếu server không bật được, thử tải Python 3.12.0 từ:',
      captions: [
        'Trang phát hành trên Hugging Face',
        'Hai thư mục sau khi giải nén: MODELS và RUNTIME',
        'Chuột phải → Run as administrator',
        'Thông báo SmartScreen',
        'Nhấn Run anyway để khởi động',
        'Màn hình khởi động lần đầu',
        'Cài Đặt → tab Máy chủ',
        'Danh sách model với nút tải xuống',
        'Trạng thái model: Đã cài',
      ],
    },
    testimonial: {
      eyebrow: 'Video',
      h2: 'Video trải nghiệm tool thực tế từ người dùng thật',
      desc: 'Xem video Facebook Reel từ người dùng thật.',
      fallback: 'Nếu trình nhúng không hiển thị, bạn vẫn có thể xem trực tiếp tại',
      linkText: 'link Facebook Reel',
    },
    products: {
      eyebrow: 'Sản phẩm của chúng tôi',
      h2: 'Mọi sản phẩm PsiHub đang xây dựng.',
    },
    productStatus: { ready: 'Đã có', beta: 'Beta', comingSoon: 'Sắp ra mắt' },
    contactCta: {
      eyebrow: 'Liên hệ',
      h2: 'Chúng tôi luôn sẵn sàng hỗ trợ.',
      ctaGuide: 'Đọc hướng dẫn cài đặt',
      ctaFacebook: 'Nhắn tin trên Facebook',
      desc: 'Liên hệ qua bất kỳ kênh nào bên dưới. Chúng tôi luôn sẵn sàng hỗ trợ.',
    },
    footer: {
      tagline: 'Giải pháp số cho mọi người',
      allRights: 'Bảo lưu mọi quyền.',
      madeIn: 'Sản xuất tại',
    },
  },
};

const LanguageContext = createContext<{
  lang: Lang;
  t: typeof translations['en'];
  toggle: () => void;
}>({
  lang: 'en',
  t: translations.en,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('vi');
  const toggle = () => setLang((l) => (l === 'en' ? 'vi' : 'en'));
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
