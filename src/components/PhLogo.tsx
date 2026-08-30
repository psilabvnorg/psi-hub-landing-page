interface PhLogoProps {
  prefix: string;
  suffix: string;
  size?: 'md' | 'lg' | 'xl';
  showImage?: boolean;
  glow?: boolean;
}

const sizeClass = {
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
};

export function PhLogo({ prefix, suffix, size = 'md', showImage = false, glow = false }: PhLogoProps) {
  return (
    <div className={`flex items-center gap-2 leading-none ${sizeClass[size]}`}>
      {showImage && (
        <span className="inline-block animate-breathe">
          <img
            src="/logo.png"
            alt="logo"
            className="h-10 w-auto object-contain transition-transform duration-500 ease-out hover:rotate-[360deg]"
          />
        </span>
      )}
      <span className="font-black text-white leading-none">{prefix}</span>
      <span
        className={`font-black bg-[#ffa31a] text-black px-3 py-2 rounded-2xl leading-none transition-shadow duration-200 ${
          glow ? 'shadow-[0_6px_20px_rgba(255,163,26,.45)] hover:shadow-[0_8px_28px_rgba(255,163,26,.65)]' : ''
        }`}
      >
        {suffix}
      </span>
    </div>
  );
}
