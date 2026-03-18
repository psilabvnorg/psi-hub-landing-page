import { 
  Phone, 
  Facebook, 
  Globe, 
  Youtube, 
  Mail, 
  MapPin,
  MessageCircle
} from 'lucide-react';
import type { Contact as ContactType } from '@/types/product';

interface ContactProps {
  contact: ContactType;
}

export function Contact({ contact }: ContactProps) {
  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      value: contact.facebook,
      href: `https://${contact.facebook}`,
    },
    {
      icon: Globe,
      label: 'Website',
      value: contact.website,
      href: `https://${contact.website}`,
    },
    {
      icon: Youtube,
      label: 'YouTube',
      value: contact.youtube,
      href: `https://youtube.com/${contact.youtube}`,
    },
    {
      icon: MessageCircle,
      label: 'TikTok',
      value: contact.tiktok,
      href: `https://tiktok.com/${contact.tiktok}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: contact.address,
      href: '#',
      isAddress: true,
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#292929]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#ffa31a]/10 border border-[#ffa31a]/30 text-[#ffa31a] text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-[#808080] text-lg max-w-2xl mx-auto">
            Have questions or want to collaborate? Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              target={item.isAddress ? undefined : '_blank'}
              rel={item.isAddress ? undefined : 'noopener noreferrer'}
              className="group flex items-center gap-4 p-6 bg-[#292929] rounded-xl border border-[#808080]/20 hover:border-[#ffa31a]/50 transition-all hover-lift"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-[#ffa31a]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ffa31a]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#ffa31a]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#808080] mb-0.5">{item.label}</p>
                <p className="text-white font-medium truncate group-hover:text-[#ffa31a] transition-colors">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Map or Additional Info */}
        <div className="mt-12 p-8 bg-[#292929] rounded-2xl border border-[#808080]/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            Ready to Transform Your Experience?
          </h3>
          <p className="text-[#808080] mb-6 max-w-xl mx-auto">
            Join thousands of users who are already using PsiHub products to enhance their 
            productivity and daily life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-orange text-black rounded-lg font-medium hover:shadow-lg hover:shadow-[#ffa31a]/20 transition-all"
            >
              <Globe className="w-5 h-5" />
              Visit Main Website
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b1b1b] border border-[#808080]/30 text-white rounded-lg font-medium hover:border-[#ffa31a]/50 transition-all"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
