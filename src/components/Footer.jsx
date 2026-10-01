import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Phần lưới chia 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
          
          {/* Cột 1: Giới thiệu ngắn về CLB */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logoclb.jpg" 
                alt="Logo CLB" 
                className="w-10 h-10 rounded-full object-cover border border-[#800020]"
                onError={(e) => { e.target.src = '/logoclb.jpg'; }}
              />
              <span className="font-bold text-white text-lg tracking-tight uppercase">CLB Sách UNETI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ngôi nhà chung của những trái tim yêu sách tại Đại học Kinh tế - Kỹ thuật Công nghiệp. Nơi lan tỏa tri thức, kết nối đam mê và phát triển kỹ năng toàn diện cho sinh viên.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">Khám Phá</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#800020] transition-colors flex items-center gap-1">
                  Trang chủ
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-[#800020] transition-colors flex items-center gap-1">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#800020] transition-colors flex items-center gap-1">
                  Sự kiện nổi bật
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ & Kênh truyền thông */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">Liên Hệ & Truyền Thông</h4>
            <div className="space-y-3 text-sm text-slate-400">
              
              {/* Địa chỉ */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                <span>Cơ sở Hà Nội & Cơ sở Nam Định - UNETI</span>
              </div>

              {/* Email liên hệ */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#800020] shrink-0" />
                <a href="mailto:clbsachuneti@gmail.com" className="hover:text-white transition-colors">
                  clbsachuneti@gmail.com
                </a>
              </div>

              {/* Điện thoại */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#800020] shrink-0" />
                <span>0123 456 789 (Hotline Ban Chủ Nhiệm)</span>
              </div>

              {/* Mạng xã hội */}
              <div className="pt-2 flex items-center gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#800020] hover:text-white hover:border-[#800020] transition-all"
                  title="Fanpage Facebook"
                >
                  <Share2 className="w-5 h-5" />
                </a>

                <a 
                  href="https://uneti.edu.vn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#800020] hover:text-white hover:border-[#800020] transition-all"
                  title="Website UNETI"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Dòng bản quyền dưới cùng */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 UNETI Book Club. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <span className="text-red-500">❤️</span> for UNETI Students
          </p>
        </div>

      </div>
    </footer>
  );
}