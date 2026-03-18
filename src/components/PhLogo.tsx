interface PhLogoProps {
  prefix: string;
  suffix: string;
  size?: 'md' | 'lg' | 'xl';
  showImage?: boolean;
}

const sizeClass = {
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
};

export function PhLogo({ prefix, suffix, size = 'md', showImage = false }: PhLogoProps) {
  return (
    <div className={`flex items-center gap-2 leading-none ${sizeClass[size]}`}>
      {showImage && <img src="/logo.png" alt="logo" className="h-10 w-auto object-contain" />}
      <span className="font-black text-white leading-none">{prefix}</span>
      <span className="font-black bg-[#FF9000] text-black px-3 py-2 rounded-2xl leading-none">
        {suffix}
      </span>
    </div>
  );
}
