import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, Award, Heart, Sparkles, Target, 
  Compass, ArrowRight, History, ShieldCheck, Layers, FileText, CheckCircle2 
} from 'lucide-react';
import Footer from '../../components/Footer';

export default function About() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      
      {/* 1. HERO SECTION: PHẦN MỞ ĐẦU HOÀNH TRÁNG */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#800020]/10 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-black uppercase tracking-wider border border-[#800020]/20">
            <Sparkles className="w-4 h-4" /> Về Chúng Tôi • UNETI Book Club & Thư Viện
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight leading-tight">
            Lan Tỏa Tri Thức & <span className="text-[#800020]">Văn Hóa Đọc</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Ngôi nhà chung của cộng đồng yêu sách Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI), nơi kết nối đam mê, lưu giữ tri thức và phát triển các thế hệ sinh viên bản lĩnh.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/members" 
              className="px-7 py-3.5 bg-[#800020] hover:bg-[#600018] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              Khám Phá Thành Viên <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/core-team/4" 
              className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Ban Chủ Nhiệm Gen 4
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS BANNER: CON SỐ ẤN TƯỢNG */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="bg-[#800020] text-white rounded-3xl p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-amber-500/20">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-300">300+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-200">Thành viên gắn kết</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-300">4+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-200">Thế hệ Thủ lĩnh (Gen)</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-300">3</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-200">Cơ sở Đào tạo</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-300">10 Năm</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-200">Phát triển gắn kết</p>
          </div>
        </div>
      </div>

      {/* 3. NỘI DUNG TÍCH HỢP 5 TIÊU CHÍ (HỆ THỐNG TAB TƯƠNG TÁC) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Thông Tin & Quy Định Hoạt Động</h2>
          <p className="text-slate-500 text-sm font-medium">Tìm hiểu chi tiết về lịch sử, chức năng, cơ cấu và quy định của chúng tôi.</p>
        </div>

        {/* Thanh Menu Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-[#800020] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" /> Lịch sử hình thành
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'functions' ? 'bg-[#800020] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" /> Chức năng & Nhiệm vụ
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'achievements' ? 'bg-[#800020] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" /> Thành tích đạt được
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'structure' ? 'bg-[#800020] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" /> Cơ cấu tổ chức
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'rules' ? 'bg-[#800020] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" /> Nội quy & Quy định
          </button>
        </div>

        {/* Nội dung tương ứng từng Tab */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 transition-all">
          
          {/* Tab 1: Lịch sử hình thành */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Lịch sử hình thành và phát triển</h3>
                  <p className="text-xs text-slate-400 font-semibold">Chặng đường khẳng định giá trị văn hóa đọc tại UNETI</p>
                </div>
              </div>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Trải qua quá trình xây dựng và trưởng thành cùng với sự phát triển lớn mạnh của Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI), tập thể phong trào văn hóa đọc và câu lạc bộ sách đã không ngừng nỗ lực vươn lên.
                </p>
                <p>
                  Từ những ngày đầu thành lập với số lượng thành viên khiêm tốn, qua các thế hệ từ Gen 1 đến Gen 4 hiện tại, CLB đã quy tụ hơn 300+ thành viên nhiệt huyết từ khắp các cơ sở đào tạo (Hà Nội và Nam Định), trở thành cái nôi nuôi dưỡng tri thức và lan tỏa tình yêu đọc sách sâu rộng trong toàn trường.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Chức năng & Nhiệm vụ */}
          {activeTab === 'functions' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Chức năng & Nhiệm vụ</h3>
                  <p className="text-xs text-slate-400 font-semibold">Kim chỉ nam cho mọi hoạt động ngoại khóa và học thuật</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#800020]" /> Phát triển văn hóa đọc</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Khơi gợi và nuôi dưỡng thói quen đọc sách, nghiên cứu tài liệu khoa học cho sinh viên UNETI.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#800020]" /> Tổ chức sự kiện tri thức</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Thực hiện các buổi workshop, tọa đàm giao lưu tác giả, giới thiệu sách hay và cuộc thi viết.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#800020]" /> Kết nối cộng đồng</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Xây dựng môi trường giao lưu lành mạnh, gắn kết sinh viên các khoa và các khóa học với nhau.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#800020]" /> Hỗ trợ học tập</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Phối hợp cùng hệ thống thư viện trường cung cấp tài nguyên, hướng dẫn tra cứu tài liệu hiệu quả.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Thành tích đạt được */}
          {activeTab === 'achievements' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Thành tích đạt được</h3>
                  <p className="text-xs text-slate-400 font-semibold">Những dấu ấn tự hào qua các năm hoạt động</p>
                </div>
              </div>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Nhận nhiều bằng khen, giấy khen của Đoàn Thanh niên - Hội Sinh viên Trường Đại học Kinh tế - Kỹ thuật Công nghiệp.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Tổ chức thành công hàng chục chương trình tọa đàm, quyên góp sách và hội sách sinh viên thu hút hàng ngàn lượt tham gia.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Xây dựng cộng đồng hơn 300+ thành viên gắn kết, nhiều thế hệ sinh viên trưởng thành và đạt danh hiệu "Sinh viên 5 tốt" các cấp.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Cơ cấu tổ chức */}
          {activeTab === 'structure' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Cơ cấu tổ chức</h3>
                  <p className="text-xs text-slate-400 font-semibold">Hệ thống ban chuyên môn vận hành CLB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#800020]">Ban Điều Hành</h4>
                  <p className="text-xs text-slate-500">Quản lý chung, định hướng chiến lược và đối ngoại.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#800020]">Ban Nội Dung</h4>
                  <p className="text-xs text-slate-500">Lên kế hoạch chủ đề sách, viết bài review và tổ chức sinh hoạt.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#800020]">Ban Truyền Thông</h4>
                  <p className="text-xs text-slate-500">Thiết kế hình ảnh, quản lý fanpage và lan tỏa thông điệp.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-[#800020]">Ban Hậu Cần</h4>
                  <p className="text-xs text-slate-500">Đảm bảo cơ sở vật chất, hậu cần và tổ chức các sự kiện.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Nội quy & Quy định */}
          {activeTab === 'rules' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Nội quy & Quy định</h3>
                  <p className="text-xs text-slate-400 font-semibold">Quy chuẩn ứng xử và sinh hoạt chung</p>
                </div>
              </div>
              <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <p><strong>Chấp hành nội quy:</strong> Tôn trọng quy chế chung của nhà trường và các quy định hoạt động của Câu lạc bộ.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <p><strong>Tinh thần trách nhiệm:</strong> Tham gia đầy đủ các buổi sinh hoạt định kỳ, tích cực đóng góp ý kiến xây dựng phong trào chung.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <p><strong>Đoàn kết & Văn minh:</strong> Giữ gìn thái độ lịch sự, văn minh trong giao tiếp nội bộ cũng như khi tham gia các hoạt động cộng đồng.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}