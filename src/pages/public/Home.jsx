import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ArrowRight, Quote, Sparkles, Users } from 'lucide-react';
import bgImage from '../../assets/tuyenquang.jpg';

// Import các component vừa tách
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
export default function Home() {
  // State hiệu ứng số nhảy cho phần thống kê
  const [stats, setStats] = useState({
    membersCount: 0,
    booksCount: 0,
    interactionsCount: 0,
    eventsCount: 0,
  });

  // Hiệu ứng số nhảy thống kê (Stats Counter)
  useEffect(() => {
    const targets = { membersCount: 300, booksCount: 10000, interactionsCount: 5000, eventsCount: 30 };
    let current = { membersCount: 0, booksCount: 0, interactionsCount: 0, eventsCount: 0 };

    const interval = setInterval(() => {
      let allDone = true;
      Object.keys(targets).forEach((key) => {
        const target = targets[key];
        const inc = Math.ceil(target / 100);
        if (current[key] < target) {
          current[key] = current[key] + inc > target ? target : current[key] + inc;
          allDone = false;
        }
      });

      setStats({ ...current });
      if (allDone) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Hàm định dạng số liệu
  const formatNumber = (num) => {
    if (num >= 1000) {
      if (num % 1000 === 0) return (num / 1000).toFixed(0) + 'k+';
      return (num / 1000).toFixed(1).replace('.0', '') + 'k+';
    }
    return num + '+';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#800020] selection:text-white">
      
      {/* Gọi Component Navbar tái sử dụng */}
      <Navbar />

      {/* ================= BANNER CHÍNH & THỐNG KÊ ================= */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat min-h-[650px] flex flex-col justify-end items-center text-white pb-0 pt-32 shadow-2xl"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url(${bgImage})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-red-100 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-300" /> 
            <span>Thắp lửa tri thức cùng UNETI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            Câu lạc bộ sách trường Đại học Kinh tế - Kỹ thuật Công nghiệp
          </h1>
          <p className="text-red-100 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Nơi kết nối đam mê đọc sách, lan tỏa tri thức và rèn luyện kỹ năng cho thế hệ sinh viên năng động, sáng tạo.
          </p>

          {/* STATS BOX (Thống kê nhanh) */}
          <div className="bg-[#800020]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {formatNumber(stats.membersCount)}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Thành viên tích cực</span>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {formatNumber(stats.booksCount)}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Đầu sách trong kho</span>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {formatNumber(stats.interactionsCount)}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Lượt tương tác / năm</span>
            </div>
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {formatNumber(stats.eventsCount)}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Sự kiện đã tổ chức</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PHẦN GIỚI THIỆU (ABOUT SECTION) ================= */}
      <section id="about" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#800020] font-bold text-sm uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full inline-block mb-3">
            Về Chúng Tôi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lan Tỏa Văn Hóa Đọc - Kết Nối Đam Mê
          </h2>
          <div className="w-16 h-1 bg-[#800020] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grid thẻ giới thiệu chi tiết */}
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sứ Mệnh & Tầm Nhìn</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Xây dựng thói quen đọc sách mỗi ngày, hình thành môi trường học tập tích cực, giúp sinh viên UNETI tiếp cận tri thức nhân loại và phát triển bản thân toàn diện.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Cộng Đồng Gắn Kết</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ngôi nhà chung của những bạn trẻ yêu sách. Nơi các thành viên cùng nhau chia sẻ góc nhìn, thảo luận các đầu sách hay và rèn luyện kỹ năng mềm qua từng hoạt động.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Hoạt Động Sôi Nổi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tổ chức định kỳ các buổi tọa đàm tác giả, cuộc thi review sách, hội sách sinh viên và các chương trình thiện nguyện mang đậm dấu ấn tuổi trẻ UNETI.
            </p>
          </div>

        </div>

        {/* Khối quote trích dẫn nổi bật */}
        <div className="mt-16 bg-gradient-to-r from-red-900 to-[#800020] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black">
            <Quote className="w-64 h-64" />
          </div>
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="text-yellow-300 font-semibold uppercase tracking-wider text-xs">Thông điệp CLB</span>
            <blockquote className="text-xl sm:text-2xl font-bold italic leading-snug">
              "Sách mở ra trước mắt tôi những chân trời mới. Đọc sách là hộ chiếu cho muôn năm tới."
            </blockquote>
          </div>
          <div className="relative z-10 shrink-0">
            <a href="#contact" className="px-6 py-3.5 bg-white text-[#800020] font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
              Tham gia cùng chúng tôi <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= PHẦN SỰ KIỆN (EVENTS SECTION) ================= */}
      <section id="events" className="py-20 bg-slate-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#800020] font-bold text-sm uppercase tracking-widest bg-white px-4 py-1.5 rounded-full inline-block mb-3 shadow-sm">
              Sự Kiện Nổi Bật
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hành Trình Gieo Mầm Tri Thức
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 flex flex-col justify-between">
              <div className="p-8 space-y-4">
                <span className="bg-red-100 text-[#800020] px-3 py-1 rounded-lg text-xs font-bold uppercase">Tọa đàm</span>
                <h3 className="text-xl font-bold text-slate-900">Ngày hội Văn hóa Đọc và Chia sẻ Sách 2026</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sự kiện thường niên lớn nhất năm thu hút hàng trăm sinh viên tham gia với các hoạt động đổi sách cũ, giao lưu diễn giả và tọa đàm hướng nghiệp qua trang sách.
                </p>
              </div>
              <div className="px-8 pb-8 pt-0 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>📅 Dự kiến: Tháng 11/2026</span>
                <span className="text-[#800020] font-bold">Đang cập nhật...</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 flex flex-col justify-between">
              <div className="p-8 space-y-4">
                <span className="bg-red-100 text-[#800020] px-3 py-1 rounded-lg text-xs font-bold uppercase">Cuộc thi</span>
                <h3 className="text-xl font-bold text-slate-900">Cuộc thi Review Sách "Trang Giấy Sáng Tương Lai"</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sân chơi bổ ích để các bạn sinh viên thỏa sức sáng tạo video hoặc bài viết cảm nhận về cuốn sách đã thay đổi cuộc đời mình.
                </p>
              </div>
              <div className="px-8 pb-8 pt-0 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>📅 Dự kiến: Hàng quý</span>
                <span className="text-[#800020] font-bold">Mở đơn đăng ký</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gọi Component Footer tái sử dụng */}
      <Footer />

    </div>
  );
}