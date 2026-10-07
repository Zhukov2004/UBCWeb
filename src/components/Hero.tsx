import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Settings,
  MapPin
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    currentUser,
    heroBackgroundUrl,
    setHeroBackgroundUrl,
    resetHeroBackground,
    setActiveTab,
  } = useApp();

  const [showBgCustomizer, setShowBgCustomizer] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STRICTLY ADMIN ONLY: normal users & guests have NO rights to change background
  const isAdmin = currentUser?.role === 'admin';

  const activeBg = heroBackgroundUrl || '/assets/tuyenquang-D0C5OBX9.jpg';

  const PRESET_BACKGROUNDS = [
    {
      id: 'tuyenquang_default',
      title: 'Chuyến xe Tuyên Quang 07/04/2024',
      subtitle: 'Tệp ảnh chuẩn /assets/tuyenquang-D0C5OBX9.jpg',
      url: '/assets/tuyenquang-D0C5OBX9.jpg',
    },
    {
      id: 'gala_stage',
      title: 'Hội trường kỷ niệm UNETI',
      subtitle: 'Sân khấu lớn trang trọng',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1800&auto=format&fit=crop&q=80',
    },
    {
      id: 'volunteer_trip',
      title: 'Chuyến xe thiện nguyện trao sách',
      subtitle: 'Hành trình lan tỏa tri thức',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&auto=format&fit=crop&q=80',
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHeroBackgroundUrl(event.target.result as string);
          setShowBgCustomizer(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setHeroBackgroundUrl(customUrlInput.trim());
      setCustomUrlInput('');
      setShowBgCustomizer(false);
    }
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[650px] flex flex-col justify-end items-center text-white pb-0 pt-32 shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75)), url("${activeBg}")`,
      }}
    >
      {/* Top Banner Tag: Tuyên Quang 07/04/2024 & STRICTLY ADMIN ONLY background customizer button */}
      <div className="absolute top-4 left-0 right-0 z-20 px-4 flex items-center justify-between max-w-6xl mx-auto">
        <button
          onClick={() => setShowPhotoModal(true)}
          className="inline-flex items-center gap-2 text-[11px] font-semibold text-red-100 tracking-wider uppercase bg-black/50 hover:bg-black/70 px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-md cursor-pointer transition border border-white/20 shadow-md group"
        >
          <Camera className="w-3.5 h-3.5 text-yellow-300 group-hover:scale-110 transition" />
          <span>Tuyên Quang, ngày 07/04/2024</span>
          <span className="text-[10px] text-yellow-300 font-bold ml-1 hidden xs:inline">Xem ảnh →</span>
        </button>

        {/* STRICTLY ADMIN ONLY: Normal users and guests will NEVER see this button! */}
        {isAdmin && (
          <button
            onClick={() => setShowBgCustomizer(!showBgCustomizer)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-200 bg-[#800020]/90 hover:bg-[#990026] border border-yellow-400/50 px-3.5 py-1.5 rounded-full backdrop-blur-md transition shadow-md cursor-pointer"
            title="Quyền Admin: Đổi ảnh nền Hero"
          >
            <Settings className="w-3.5 h-3.5 text-yellow-300" />
            <span>Admin: Đổi ảnh nền</span>
          </button>
        )}
      </div>

      {/* Gradient overlay matching user specification */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>

      {/* Hero content container matching user specification */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-red-100 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles w-4 h-4 text-yellow-300"
            aria-hidden="true"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0 1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
            <path d="M20 2v4"></path>
            <path d="M22 4h-4"></path>
            <circle cx="4" cy="20" r="2"></circle>
          </svg>
          <span>CLB Trực Thuộc Trung Tâm Thư Viện • ĐH Kinh Tế - Kỹ Thuật Công Nghiệp</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg font-serif-title max-w-4xl mx-auto leading-tight">
          Câu lạc bộ sách trường Đại học Kinh tế - Kỹ thuật Công nghiệp
        </h1>

        <p className="text-red-100 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
          CLB trực thuộc Phòng ban Trung tâm Thư viện UNETI. Hành trình 10 năm thắp lửa tri thức, gắn kết đam mê đọc sách và rèn luyện kỹ năng qua các thế hệ sinh viên.
        </p>

        {/* Stats Grid Container: Focused on Formation, Generations, Members and Campuses */}
        <div className="bg-[#800020]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">10+ Năm</span>
            <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Hình thành & Phát triển</span>
          </div>
          <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">7 Thế hệ</span>
            <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Gen thủ lĩnh tiếp nối</span>
          </div>
          <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">300+</span>
            <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Thành viên & Cựu SV</span>
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">3 Cơ sở</span>
            <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Minh Khai • Lĩnh Nam • N.Định</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#journey-section"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-red-900 hover:bg-red-50 font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer"
          >
            <span>Khám phá Quá trình hình thành & phát triển</span>
            <span className="text-base">↓</span>
          </a>
          <button
            onClick={() => setShowPhotoModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-950/70 hover:bg-red-950 text-yellow-300 border border-yellow-400/40 font-bold text-xs sm:text-sm transition backdrop-blur-md cursor-pointer"
          >
            <Camera className="w-4 h-4 text-yellow-300" />
            <span>Kỷ niệm 10 năm Tuyên Quang 07/04/2024</span>
          </button>
        </div>
      </div>

      {/* STRICTLY ADMIN ONLY: Background Customizer Modal */}
      {isAdmin && showBgCustomizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-red-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowBgCustomizer(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-5 h-5 text-yellow-300" />
              <h3 className="text-lg font-bold">Dành cho Admin: Đổi ảnh nền Hero Index</h3>
            </div>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Tính năng này chỉ dành cho Admin CLB. Người dùng thông thường không có quyền và không nhìn thấy bảng này.
            </p>

            {/* Presets */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Chọn ảnh mẫu:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_BACKGROUNDS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setHeroBackgroundUrl(preset.url);
                      setShowBgCustomizer(false);
                    }}
                    className={`text-left p-3 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                      activeBg === preset.url
                        ? 'border-yellow-400 bg-red-950/70 text-yellow-200'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{preset.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.subtitle}</div>
                    </div>
                    {activeBg === preset.url && (
                      <Check className="w-4 h-4 text-yellow-400 shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Local upload */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Tải ảnh từ máy tính:
              </span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-red-500/60 bg-red-950/30 hover:bg-red-950/60 text-xs font-semibold text-rose-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Chọn tệp ảnh từ máy tính (PNG, JPG, JPEG)</span>
              </button>
            </div>

            {/* Custom URL */}
            <form onSubmit={handleApplyCustomUrl} className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Hoặc dán URL ảnh nền:
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/anh-tuyenquang.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  resetHeroBackground();
                  setShowBgCustomizer(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục ảnh Tuyên Quang chuẩn</span>
              </button>

              <button
                onClick={() => setShowBgCustomizer(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tuyên Quang Lightbox Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative border border-red-900/60 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest bg-red-950 border border-red-800 px-3 py-1 rounded-full">
                  Kỷ niệm 10 năm (21/4/2014 - 21/4/2024)
                </span>
                <span className="text-xs font-bold text-rose-300 bg-white/10 px-3 py-1 rounded-full">
                  Tuyên Quang, ngày 07 tháng 4 năm 2024
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-2 font-serif-title">
                Chuyến Xe Thiện Nguyện & Giao Lưu Kỷ Niệm 10 Năm CLB Sách UNETI
              </h3>
              <p className="text-xs text-rose-200/80 mt-1">
                Đại gia đình UNETI Book Club trong sắc áo đỏ rực truyền thống, dẫn đầu là Chủ nhiệm Nguyễn Văn Thiện, Cựu Chủ nhiệm sáng lập Nguyễn Thuý Hường cùng Ban Điều hành và các thành viên tiêu biểu.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-red-800/40 shadow-xl bg-black">
              <img
                src={activeBg}
                alt="Chuyến đi Tuyên Quang 07/04/2024"
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-rose-100/90 leading-relaxed flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-yellow-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Địa điểm: Tỉnh Tuyên Quang</span>
                </div>
                <span className="mt-0.5 block">
                  Trao tặng 2.500 đầu sách ước mơ & 50 suất học bổng cho học sinh vùng cao.
                </span>
              </div>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setActiveTab('history');
                }}
                className="self-end sm:self-center px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                Xem chi tiết tại UBC History →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
