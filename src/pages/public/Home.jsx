import React, { useEffect, useState } from 'react';
import { Users, Sparkles, Award, Heart, Shield, ArrowRight } from 'lucide-react';
import bgImage from '../../assets/tuyenquang.jpg';

// Import component Footer tái sử dụng
import Footer from '../../components/Footer';

export default function Home() {
  // State hiệu ứng số nhảy cho phần thống kê thành viên
  const [stats, setStats] = useState({
    membersCount: 0,
    generationsCount: 0,
    campusesCount: 0,
    yearsCount: 0,
  });

  // Hiệu ứng số nhảy thống kê
  useEffect(() => {
    const targets = { membersCount: 300, generationsCount: 7, campusesCount: 3, yearsCount: 10 };
    let current = { membersCount: 0, generationsCount: 0, campusesCount: 0, yearsCount: 0 };

    const interval = setInterval(() => {
      let allDone = true;
      Object.keys(targets).forEach((key) => {
        const target = targets[key];
        const inc = Math.ceil(target / 50);
        if (current[key] < target) {
          current[key] = current[key] + inc > target ? target : current[key] + inc;
          allDone = false;
        }
      });

      setStats({ ...current });
      if (allDone) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Danh sách các thế hệ cốt cán / ban chủ nhiệm mẫu
  const coreMembers = [
    { name: 'Nguyễn Văn A', role: 'Chủ nhiệm CLB (Đời thứ 6)', desc: 'Định hướng chiến lược và kết nối các thế hệ thành viên.', cohort: 'K15' },
    { name: 'Trần Thị B', role: 'Phó Chủ nhiệm phụ trách Truyền thông', desc: 'Lan tỏa hình ảnh nhiệt huyết của tuổi trẻ UNETI đến sinh viên.', cohort: 'K16' },
    { name: 'Lê Văn C', role: 'Trưởng ban Nhân sự & Đào tạo', desc: 'Người kết nối, xây dựng mái nhà chung gắn kết cho hàng trăm thành viên.', cohort: 'K16' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#800020] selection:text-white">
      
      {/* ================= BANNER CHÍNH & THỐNG KÊ THÀNH VIÊN ================= */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat min-h-[650px] flex flex-col justify-end items-center text-white pb-0 pt-32 shadow-2xl"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${bgImage})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-red-100 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-300" /> 
            <span>Ngôi nhà chung của những trái tim nhiệt huyết UNETI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            Đội Ngũ & Thành Viên Câu Lạc Bộ Sách UNETI
          </h1>
          <p className="text-red-100 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Nơi hội tụ những gương mặt sinh viên năng động, sáng tạo và luôn hết mình vì văn hóa đọc và các hoạt động cộng đồng.
          </p>

          {/* STATS BOX (Thống kê thành viên & tổ chức) */}
          <div className="bg-[#800020]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {stats.membersCount}+
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Thành viên đồng hành</span>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {stats.generationsCount}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Thế hệ thủ lĩnh</span>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {stats.campusesCount}
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Cơ sở đào tạo</span>
            </div>
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">
                {stats.yearsCount} Năm
              </span>
              <span className="text-xs text-red-100 font-semibold uppercase tracking-wider">Phát triển gắn kết</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PHẦN GIỚI THIỆU CON NGƯỜI & TINH THẦN ================= */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#800020] font-bold text-sm uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full inline-block mb-3">
            Con Người UNETI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tinh Thần Đoàn Kết & Sức Mạnh Tập Thể
          </h2>
          <div className="w-16 h-1 bg-[#800020] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Thế Hệ Năng Động</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Quy tụ các bạn sinh viên đến từ khắp các khoa chuyên ngành của trường, cùng chung tình yêu với sách và khát vọng hoàn thiện bản thân.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Gắn Kết Như Gia Đình</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Không chỉ là nơi sinh hoạt học thuật, CLB còn là môi trường rèn luyện kỹ năng sống, chia sẻ kinh nghiệm học tập và hỗ trợ lẫn nhau qua từng năm tháng đại học.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-red-50 text-[#800020] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Thủ Lĩnh Tận Tâm</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Đội ngũ ban chủ nhiệm và các thế hệ đi trước luôn sát cánh, truyền lửa và dẫn dắt các thành viên mới tự tin bước ra khỏi vùng an toàn.
            </p>
          </div>
        </div>
      </section>

      {/* ================= BAN CHỦ NHIỆM / THÀNH VIÊN TIÊU BIỂU ================= */}
      <section className="py-20 bg-slate-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#800020] font-bold text-sm uppercase tracking-widest bg-white px-4 py-1.5 rounded-full inline-block mb-3 shadow-sm">
              Ban Vận Động & Ban Chủ Nhiệm
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Gương Mặt Đại Diện Các Thế Hệ
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/60 flex flex-col justify-between text-center group hover:-translate-y-1 transition-transform">
                <div>
                  {/* Avatar giả lập */}
                  <div className="w-24 h-24 bg-gradient-to-tr from-[#800020] to-red-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <span className="bg-red-50 text-[#800020] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {member.cohort}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-3">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#800020] mt-1 mb-4">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {member.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                  Thành viên tích cực UNETI
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gọi Component Footer tái sử dụng */}
      <Footer />

    </div>
  );
}