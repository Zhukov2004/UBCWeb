import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Home as HomeIcon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tên Câu Lạc Bộ */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logoclb.jpg" 
              alt="Logo CLB" 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#800020] shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => { e.target.src = '/logoclb.jpg'; }}
            />
            <div>
              <span className="block font-black text-[#800020] text-lg sm:text-xl tracking-tight uppercase">CLB Sách UNETI</span>
              <span className="block text-xs text-slate-500 font-medium">Đại học Kinh tế - Kỹ thuật Công nghiệp</span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold text-[#800020] bg-red-50 transition-colors flex items-center gap-2">
              <HomeIcon className="w-4 h-4" /> Trang chủ
            </Link>
            <a href="#about" className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-[#800020] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Giới thiệu
            </a>
            <a href="#events" className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-[#800020] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Sự kiện
            </a>
            <a href="#contact" className="ml-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#800020] hover:bg-[#600018] shadow-md hover:shadow-lg transition-all">
              Liên hệ
            </a>
          </div>

          {/* Nút Hamburger Menu cho Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#800020]" /> : <Menu className="w-6 h-6 text-[#800020]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu dạng Dropdown cho Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-[#800020] bg-red-50"
          >
            <HomeIcon className="w-5 h-5" /> Trang chủ
          </Link>
          <a 
            href="#about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <BookOpen className="w-5 h-5 text-[#800020]" /> Giới thiệu
          </a>
          <a 
            href="#events" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <Calendar className="w-5 h-5 text-[#800020]" /> Sự kiện
          </a>
          <div className="pt-2">
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-xl font-bold text-white bg-[#800020] shadow-md"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}