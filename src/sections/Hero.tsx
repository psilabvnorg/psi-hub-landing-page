import { ChevronDown } from 'lucide-react';
import type { Brand } from '@/types/product';

interface HeroProps {
  brand: Brand;
}

export function Hero({ brand }: HeroProps) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#292929] via-[#1b1b1b] to-[#1b1b1b]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffa31a]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ffa31a]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 163, 26, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 163, 26, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-[#ffa31a]/10 border border-[#ffa31a]/30 text-[#ffa31a] text-sm font-medium mb-6">
            Welcome to the Future
          </span>
        </div>
        
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="text-gradient">{brand.name}</span>
        </h1>
        
        <p 
          className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light mb-4 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          {brand.tagline}
        </p>
        
        <p 
          className="text-base sm:text-lg text-[#808080] max-w-2xl mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          {brand.description}
        </p>
        
        {/* CTA Button */}
        <div 
          className="animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <button
            onClick={scrollToProducts}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-orange text-black font-semibold rounded-full hover:shadow-lg hover:shadow-[#ffa31a]/30 transition-all duration-300 animate-pulse-glow"
          >
            Explore Our Products
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
        
        {/* Stats */}
        <div 
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ffa31a]">7</div>
            <div className="text-sm text-[#808080] mt-1">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ffa31a]">10K+</div>
            <div className="text-sm text-[#808080] mt-1">Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ffa31a]">99%</div>
            <div className="text-sm text-[#808080] mt-1">Satisfaction</div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1b1b1b] to-transparent" />
    </section>
  );
}
