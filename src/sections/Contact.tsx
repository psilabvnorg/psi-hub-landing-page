import { Phone, Facebook, Globe, Youtube, Mail, MapPin, MessageCircle, Linkedin } from 'lucide-react';
import type { Contact as ContactType } from '@/types/product';
import { PhLogo } from '@/components/PhLogo';
import { useLang } from '@/contexts/LanguageContext';

interface ContactProps {
  contact: ContactType;
}

export function Contact({ contact }: ContactProps) {
  const { t } = useLang();

  const contactItems = [
    { icon: Phone, key: 'phone' as const, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { icon: Facebook, key: 'facebook' as const, value: contact.facebook, href: `https://${contact.facebook}` },
    { icon: Globe, key: 'website' as const, value: contact.website, href: `https://${contact.website}` },
    { icon: Youtube, key: 'youtube' as const, value: contact.youtube, href: `https://youtube.com/${contact.youtube}` },
    { icon: MessageCircle, key: 'tiktok' as const, value: contact.tiktok, href: `https://tiktok.com/${contact.tiktok}` },
    { icon: Mail, key: 'email' as const, value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, key: 'address' as const, value: contact.address, href: '#', isAddress: true },
    ...(contact.linkedin ? [{ icon: Linkedin, key: 'linkedin' as const, value: 'tung-xe-tho', href: contact.linkedin }] : []),
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#111111] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-16">
          <div className="h-1 w-16 bg-[#FF9000] mb-6" />
          <div className="mb-4">
            <PhLogo prefix={t.contactLogo.prefix} suffix={t.contactLogo.suffix} size="lg" />
          </div>
          <p className="text-[#808080] text-lg max-w-2xl leading-relaxed">{t.contactDesc}</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {contactItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target={item.isAddress ? undefined : '_blank'}
              rel={item.isAddress ? undefined : 'noopener noreferrer'}
              className="group flex items-center gap-4 p-5 bg-[#1b1b1b] border border-[#292929] border-l-4 border-l-[#FF9000]/40 hover:border-[#FF9000]/60 hover:border-l-[#FF9000] hover:bg-[#1e1e1e] transition-all duration-150 rounded-sm"
            >
              <div className="w-11 h-11 bg-[#FF9000] flex items-center justify-center shrink-0 rounded-sm group-hover:bg-white transition-colors duration-150">
                <item.icon className="w-5 h-5 text-black" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#808080] font-bold tracking-widest uppercase mb-1">
                  {t.labels[item.key]}
                </p>
                <p className="text-white font-bold truncate group-hover:text-[#FF9000] transition-colors duration-150 text-lg">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
