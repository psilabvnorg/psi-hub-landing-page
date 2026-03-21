import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApiDocs } from '@/sections/ApiDocs';

export function ContentHubDocs() {
  return (
    <div className="min-h-screen bg-[#1b1b1b]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#606060] hover:text-[#ffa31a] transition-colors duration-150 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-[#333]" />
          <span className="text-white text-sm font-bold">ContentHub</span>
          <span className="text-[#606060] text-sm">/</span>
          <span className="text-[#ffa31a] text-sm font-mono">API Docs</span>
        </div>
      </div>

      <ApiDocs />
    </div>
  );
}
