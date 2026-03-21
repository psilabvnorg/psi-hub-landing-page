import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { useProducts } from '@/hooks/useProducts';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PhLogo } from '@/components/PhLogo';

const steps = [
  {
    number: 1,
    title: 'Tải file cài đặt về máy',
    description: (
      <>
        Tải file <strong>full69.rar</strong> (đầy đủ, không có nhân giọng) hoặc{' '}
        <strong>full69_plus_voice_clone.rar</strong> (đầy đủ, có nhân giọng) về máy tính.{' '}
        <a
          href="https://huggingface.co/psilab/ai-content-hub-release/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ffa31a] underline hover:text-white transition-colors duration-150"
        >
          Tải tại đây →
        </a>
      </>
    ),
    image: '/assets/docs/contenthub/1.PNG',
  },
  {
    number: 2,
    title: 'Giải nén file',
    description: 'Nhấn chuột phải vào file .rar vừa tải về và giải nén ra một thư mục.',
    image: '/assets/docs/contenthub/2.PNG',
  },
  {
    number: 3,
    title: 'Mở thư mục và chạy ứng dụng',
    description: 'Mở thư mục vừa giải nén, click chuột phải vào file "ContentHub.exe" và chọn "Run as administrator" để chạy ứng dụng với quyền quản trị.',
    image: '/assets/docs/contenthub/3.PNG',
  },
  {
    number: 4,
    title: 'Cảnh báo Windows — nhấn "More info"',
    description: 'Windows có thể hiện thông báo bảo mật SmartScreen. Đây là bình thường — nhấn "More info" để tiếp tục.',
    image: '/assets/docs/contenthub/4.PNG',
  },
  {
    number: 5,
    title: 'Nhấn "Run anyway" để chạy',
    description: 'Nhấn "Run anyway" để khởi động ứng dụng. Ứng dụng hoàn toàn an toàn.',
    image: '/assets/docs/contenthub/5.PNG',
  },
  {
    number: 6,
    title: 'Chờ ứng dụng khởi động',
    description: 'Nếu chờ quá 10 phút mà chưa xong, hãy đóng cửa sổ này và vào trang Cài Đặt để bật thủ công.',
    image: '/assets/docs/contenthub/6.PNG',
  },
  {
    number: 7,
    title: 'Vào trang cài đặt để khởi động ứng dụng',
    description: 'Mở trang Cài Đặt trong ứng dụng và nhấn nút khởi động để bật thủ công.',
    image: '/assets/docs/contenthub/7.PNG',
  },
];

export function ContentHubInstallGuide() {
  const { config } = useProducts();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1b1b1b]">

        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:text-[#ffa31a] transition-colors duration-150 text-2xl font-bold"
            >
              <ArrowLeft className="w-7 h-7" />
              Quay Lại
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <PhLogo prefix="Content" suffix="Hub" size="md" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 text-center">
            <div className="h-1 w-16 bg-[#ffa31a] mx-auto mb-6" />
            <h1 className="text-white text-3xl font-bold mb-3">Hướng Dẫn Cài Đặt</h1>
            <p className="text-[#808080] text-base">Làm theo 7 bước dưới đây để cài đặt và chạy ContentHub trên máy tính.</p>
          </div>

          <div className="flex flex-col gap-12">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                {/* Step header */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffa31a] flex items-center justify-center text-black font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <p className="text-[#ffa31a] text-xs font-bold uppercase tracking-widest mb-1">Bước {step.number}</p>
                    <h2 className="text-white text-xl font-bold">{step.title}</h2>
                    <p className="text-[#909090] text-base mt-1">{step.description}</p>
                  </div>
                </div>

                {/* Image */}
                <div className="rounded-xl overflow-hidden border border-[#2a2a2a] ml-14">
                  <img
                    src={step.image}
                    alt={`Bước ${step.number}`}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {config && <Contact contact={config.contact} />}
        {config && <Footer brandName={config.brand.name} />}
      </div>
    </LanguageProvider>
  );
}
