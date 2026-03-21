import { Phone, Globe, Mail, MapPin } from 'lucide-react';
import type { Contact as ContactType } from '@/types/product';
import { useLang } from '@/contexts/LanguageContext';

interface ContactProps {
  contact: ContactType;
}

const YT_ICON = (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TT_ICON = (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const FB_ICON = (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LI_ICON = (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Contact({ contact }: ContactProps) {
  const { t } = useLang();

  const items = [
    { href: `tel:${contact.phone.replace(/\s/g, '')}`, icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" />, label: contact.phone },
    { href: `https://${contact.facebook}`, icon: FB_ICON, label: contact.facebook, external: true },
    { href: `https://${contact.website}`, icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" />, label: contact.website, external: true },
    { href: `https://youtube.com/${contact.youtube}`, icon: YT_ICON, label: contact.youtube, external: true },
    { href: `https://tiktok.com/${contact.tiktok}`, icon: TT_ICON, label: contact.tiktok, external: true },
    { href: contact.linkedin, icon: LI_ICON, label: 'tung-xe-tho', external: true },
    { href: `mailto:${contact.email}`, icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" />, label: contact.email },
    { icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-black" />, label: contact.address },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#111111] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl overflow-hidden">

          {/* Orange header bar */}
          <div className="flex items-center gap-3 px-5 py-3 bg-[#ffa31a]">
            <p className="text-sm font-black uppercase tracking-widest text-black">Contact Us</p>
            <div className="h-px flex-1 bg-black/20" />
            <p className="text-xs font-semibold text-black/70">{t.contactDesc}</p>
          </div>

          {/* Body */}
          <div className="flex bg-black">

            {/* Contact grid */}
            <div className="w-3/4 py-4 grid grid-cols-2">
              {items.map((item, i) => {
                const iconEl = (
                  <span className="flex h-9 w-9 sm:h-11 sm:w-11 lg:h-14 lg:w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#ffa31a]">
                    {item.icon}
                  </span>
                );
                const cls = `flex items-center gap-3 px-4 sm:px-6 text-sm sm:text-base lg:text-xl font-bold text-white/80 hover:text-white transition-colors py-2 sm:py-3`;
                return item.href ? (
                  <a key={i} href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>
                    {iconEl}
                    <span className="truncate">{item.label}</span>
                  </a>
                ) : (
                  <span key={i} className={`${cls} text-white/60`}>
                    {iconEl}
                    <span className="truncate">{item.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Right image */}
            <div className="w-1/4 flex-shrink-0 overflow-hidden">
              <style>{`
                @keyframes breathe {
                  0%, 100% { transform: scale(1); opacity: 0.9; }
                  50% { transform: scale(1.06); opacity: 1; }
                }
              `}</style>
              <a href="https://xechohang.vn" target="_blank" rel="noopener noreferrer" className="block h-full">
                <img
                  src="/assets/top.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ animation: 'breathe 3s ease-in-out infinite' }}
                />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
