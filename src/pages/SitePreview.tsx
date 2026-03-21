import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen, Home, Package, FileText, Layers } from 'lucide-react';
import { PhLogo } from '@/components/PhLogo';

interface PageCard {
  title: string;
  subtitle: string;
  description: string;
  path: string;
  external?: boolean;
  tag: string;
  tagColor: 'green' | 'orange' | 'blue' | 'gray';
  icon: React.ReactNode;
  accent: string;
}

const PAGES: PageCard[] = [
  {
    title: 'Trang Chủ',
    subtitle: 'PsiHub — Home',
    description: 'Trang chính: giới thiệu thương hiệu, video demo, toàn bộ sản phẩm, và liên hệ.',
    path: '/',
    tag: 'Trang chính',
    tagColor: 'green',
    icon: <Home className="w-6 h-6" />,
    accent: '#ffa31a',
  },
  {
    title: 'ContentHub',
    subtitle: 'Hướng dẫn cài đặt',
    description: 'Hướng dẫn từng bước tải về, giải nén và chạy ứng dụng ContentHub trên Windows.',
    path: '/contenthub/huong-dan',
    tag: 'Hướng dẫn',
    tagColor: 'orange',
    icon: <BookOpen className="w-6 h-6" />,
    accent: '#ffa31a',
  },
  {
    title: 'ContentHub API',
    subtitle: 'Tài liệu API',
    description: 'Tài liệu kỹ thuật cho ContentHub REST API: endpoints, xác thực, ví dụ code.',
    path: '/contenthub/huong-dan-api',
    tag: 'API Docs',
    tagColor: 'blue',
    icon: <FileText className="w-6 h-6" />,
    accent: '#3b82f6',
  },
  {
    title: 'ContentHub Docs',
    subtitle: 'Tài liệu chi tiết',
    description: 'Tài liệu đầy đủ tính năng và hướng dẫn sử dụng ContentHub.',
    path: '/contenthub/docs',
    tag: 'Docs',
    tagColor: 'blue',
    icon: <Layers className="w-6 h-6" />,
    accent: '#3b82f6',
  },
  {
    title: 'Psi69',
    subtitle: 'Hướng dẫn sử dụng',
    description: 'Hướng dẫn cho xe điện 2 bánh Psi69. Trang đang được cập nhật.',
    path: '/psi69/huong-dan',
    tag: 'Sắp ra mắt',
    tagColor: 'gray',
    icon: <Package className="w-6 h-6" />,
    accent: '#ffa31a',
  },
  {
    title: 'JobHub',
    subtitle: 'Hướng dẫn sử dụng',
    description: 'Hướng dẫn cho nền tảng tuyển dụng thông minh JobHub. Trang đang được cập nhật.',
    path: '/jobhub/huong-dan',
    tag: 'Sắp ra mắt',
    tagColor: 'gray',
    icon: <Package className="w-6 h-6" />,
    accent: '#ffa31a',
  },
  {
    title: 'LifeHub',
    subtitle: 'Hướng dẫn sử dụng',
    description: 'Hướng dẫn cho trợ lý quản lý cuộc sống LifeHub. Trang đang được cập nhật.',
    path: '/lifehub/huong-dan',
    tag: 'Sắp ra mắt',
    tagColor: 'gray',
    icon: <Package className="w-6 h-6" />,
    accent: '#ffa31a',
  },
];

const HOME_SECTIONS = [
  { label: 'Hero / Navbar', desc: 'Logo, menu hướng dẫn, chuyển ngôn ngữ', anchor: '/' },
  { label: 'Banner', desc: 'Video demo YouTube + card ContentHub nổi bật', anchor: '/' },
  { label: 'Sản Phẩm', desc: 'Grid tất cả sản phẩm — Ready & Sắp Ra Mắt', anchor: '/#products' },
  { label: 'Liên Hệ', desc: 'Phone, Facebook, YouTube, TikTok, Email, Địa chỉ', anchor: '/#contact' },
  { label: 'Footer', desc: 'Bản quyền & thương hiệu PsiHub', anchor: '/' },
];

const tagStyle: Record<string, string> = {
  green: 'bg-green-500/15 text-green-400 border border-green-500/30',
  orange: 'bg-[#ffa31a]/15 text-[#ffa31a] border border-[#ffa31a]/40',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  gray: 'bg-white/5 text-white/40 border border-white/10',
};

export function SitePreview() {
  return (
    <div className="min-h-screen bg-[#1b1b1b]">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-[#ffa31a] transition-colors duration-150 text-2xl font-bold"
          >
            <ArrowLeft className="w-7 h-7" />
            Quay Lại
          </Link>
          <div className="h-6 w-px bg-[#333]" />
          <PhLogo prefix="Psi" suffix="Hub" size="md" showImage />
          <span className="text-[#606060] text-xl">/</span>
          <span className="text-[#ffa31a] text-xl font-bold">Site Preview</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
          <h1 className="text-white text-4xl font-black mb-3">Tổng Quan Website</h1>
          <p className="text-[#808080] text-lg">Tất cả các trang và section của PsiHub — một cái nhìn tổng thể.</p>
        </div>

        {/* Pages grid */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#ffa31a] text-xs font-black uppercase tracking-widest">Các Trang</span>
            <div className="h-px flex-1 bg-[#222]" />
            <span className="text-[#505050] text-xs">{PAGES.length} trang</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAGES.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="group relative flex flex-col bg-[#111111] border border-[#222222] hover:border-[#ffa31a]/50 rounded-sm overflow-hidden transition-colors duration-200"
              >
                {/* Accent line */}
                <div className="h-[3px]" style={{ backgroundColor: page.accent }} />

                <div className="p-6 flex flex-col gap-3 flex-1">
                  {/* Icon + tag row */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black"
                      style={{ backgroundColor: page.accent }}
                    >
                      {page.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm ${tagStyle[page.tagColor]}`}>
                      {page.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-white text-xl font-black leading-tight">{page.title}</h2>
                    <p className="text-[#ffa31a] text-xs font-bold mt-0.5">{page.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-[#808080] text-sm leading-relaxed flex-1">{page.description}</p>

                  {/* Path */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e]">
                    <code className="text-[#505050] text-xs font-mono">{page.path}</code>
                    <ExternalLink className="w-4 h-4 text-[#404040] group-hover:text-[#ffa31a] transition-colors duration-150" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Home page sections */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#ffa31a] text-xs font-black uppercase tracking-widest">Sections — Trang Chủ</span>
            <div className="h-px flex-1 bg-[#222]" />
          </div>

          <div className="flex flex-col gap-0 border border-[#222222] rounded-sm overflow-hidden">
            {HOME_SECTIONS.map((section, i) => (
              <a
                key={i}
                href={section.anchor}
                className="flex items-center gap-5 px-6 py-4 bg-[#111111] hover:bg-[#161616] border-b border-[#1e1e1e] last:border-b-0 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ffa31a]/10 border border-[#ffa31a]/20 flex items-center justify-center text-[#ffa31a] text-xs font-black">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base">{section.label}</p>
                  <p className="text-[#606060] text-sm">{section.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#333] group-hover:text-[#ffa31a] flex-shrink-0 transition-colors duration-150" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
