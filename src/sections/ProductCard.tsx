import { useState } from 'react';
import { ExternalLink, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % product.screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + product.screenshots.length) % product.screenshots.length);
  };

  return (
    <div className="group bg-[#292929] rounded-2xl overflow-hidden border border-[#808080]/20 hover-lift">
      {/* Header with Logo and Name */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#1b1b1b] flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src={product.logo} 
                alt={`${product.name} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-[#ffa31a] transition-colors">
                {product.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                product.status === 'Ready' ? 'status-ready' : 'status-beta'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-[#808080] text-sm leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Screenshots Carousel */}
      <div className="relative bg-[#1b1b1b]">
        <div className="aspect-video relative overflow-hidden">
          {product.screenshots.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot}
              alt={`${product.name} screenshot ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                index === currentScreenshot ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={prevScreenshot}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#ffa31a] hover:text-black transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextScreenshot}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#ffa31a] hover:text-black transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Screenshot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {product.screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreenshot(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentScreenshot 
                    ? 'bg-[#ffa31a] w-6' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-4">
        <div className="flex flex-wrap gap-3">
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffa31a]/10 border border-[#ffa31a]/30 text-[#ffa31a] rounded-lg hover:bg-[#ffa31a]/20 transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Live Demo
          </a>
          <a
            href={product.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-orange text-black rounded-lg hover:shadow-lg hover:shadow-[#ffa31a]/20 transition-all text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
}
