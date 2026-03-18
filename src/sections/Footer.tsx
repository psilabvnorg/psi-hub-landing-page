import { Heart } from 'lucide-react';

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#808080]/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">{brandName}</span>
          </div>

          {/* Copyright */}
          <p className="text-[#808080] text-sm text-center">
            &copy; {currentYear} {brandName}. All rights reserved.
          </p>

          {/* Made with love */}
          <p className="text-[#808080] text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#ffa31a] fill-[#ffa31a]" /> in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
