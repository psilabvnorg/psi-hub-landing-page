import { createContext, useContext, useState } from 'react';

export type Lang = 'en' | 'vi';

export const translations = {
  en: {
    productsDesc: 'A suite of powerful tools built to enhance your productivity, creativity, and daily life.',
    productsLogo: { prefix: 'Our ', suffix: 'Products' },
    contactLogo: { prefix: 'Contact ', suffix: 'Us' },
    getInTouch: 'Get In Touch',
    liveDemo: 'Live Demo',
    visitSite: 'Visit Site',
    contactDesc: 'Reach out through any channel below. We\'re ready to help.',
    labels: {
      phone: 'Phone', facebook: 'Facebook', website: 'Website',
      youtube: 'YouTube', tiktok: 'TikTok', email: 'Email', address: 'Address', linkedin: 'LinkedIn',
    },
    ready: 'Ready',
    readySection: 'Ready',
    comingSoonSection: 'Coming Soon',
    allRights: 'All rights reserved.',
    madeIn: 'Made in',
  },
  vi: {
    productsDesc: 'Bộ công cụ mạnh mẽ giúp nâng cao năng suất, sáng tạo và cuộc sống hàng ngày của bạn.',
    productsLogo: { prefix: 'Sản ', suffix: 'Phẩm' },
    contactLogo: { prefix: 'Liên ', suffix: 'Hệ' },
    getInTouch: 'Liên Hệ',
    liveDemo: 'Xem Demo',
    visitSite: 'Truy Cập',
    contactDesc: 'Liên hệ qua bất kỳ kênh nào bên dưới. Chúng tôi luôn sẵn sàng hỗ trợ.',
    labels: {
      phone: 'Điện Thoại', facebook: 'Facebook', website: 'Website',
      youtube: 'YouTube', tiktok: 'TikTok', email: 'Email', address: 'Địa Chỉ', linkedin: 'LinkedIn',
    },
    ready: 'Sẵn Sàng',
    readySection: 'Sẵn Sàng',
    comingSoonSection: 'Sắp Ra Mắt',
    allRights: 'Bảo lưu mọi quyền.',
    madeIn: 'Sản xuất tại',
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
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang((l) => (l === 'en' ? 'vi' : 'en'));
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
