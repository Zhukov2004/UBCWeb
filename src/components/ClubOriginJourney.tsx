import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Calendar,
  Users,
  Award,
  Heart,
  ArrowRight,
  MapPin,
  Camera,
  Compass,
  Flame,
  CheckCircle,
  Clock,
  Shield,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Building2,
  ChevronRight
} from 'lucide-react';

interface Milestone {
  year: string;
  exactDate?: string;
  phase: 'phase-1' | 'phase-2' | 'phase-3';
  phaseName: string;
  title: string;
  badge: string;
  description: string;
  story: string;
  image: string;
  leaders: string[];
  achievements: string[];
}

export const ClubOriginJourney: React.FC = () => {
  const {
    setActiveTab,
    setShowAuthModal,
    setAuthModalMode,
    currentUser,
    users,
    openUserProfile,
    setHistoryInitialTab,
  } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'phase-1' | 'phase-2' | 'phase-3'>('all');
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(4); // Default to 2024 Tuyên Quang milestone

  const MILESTONES: Milestone[] = [
    {
      year: '2014',
      exactDate: 'Tháng 4 / 2014',
      phase: 'phase-1',
      phaseName: 'Giai Đoạn Khởi Sinh (2014 - 2018)',
      title: 'Nhen Nhóm Ý Tưởng & Khởi Nguồn Văn Hóa Đọc',
      badge: 'Khởi nguồn ý tưởng',
      description: 'Ý tưởng ban đầu xuất phát từ một nhóm sinh viên kỹ thuật và kinh tế yêu sách, mong muốn tạo ra một không gian trao đổi tri thức và rèn luyện kỹ năng thực chất tại UNETI.',
      story: 'Giữa môi trường đại học giàu truyền thống công nghệ và kinh tế, một nhóm bạn trẻ đã kết nối đam mê, tổ chức những buổi đọc nhóm và chia sẻ kinh nghiệm tại góc sân trường và phòng tự học. Đây chính là những hạt mầm đầu tiên đặt nền móng cho CLB Sách UNETI sau này.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
      leaders: ['Các cựu sinh viên sáng lập khóa K8, K9'],
      achievements: [
        'Quy tụ hơn 30 sinh viên tiên phong yêu đọc sách',
        'Hình thành nhóm sinh hoạt kỹ năng đầu tiên',
        'Khởi thảo định hướng văn hóa đọc thực chất'
      ]
    },
    {
      year: '2018',
      exactDate: '21/04/2018',
      phase: 'phase-1',
      phaseName: 'Giai Đoạn Khởi Sinh (2014 - 2018)',
      title: 'Chính Thức Thành Lập CLB Sách UNETI Trực Thuộc Trung Tâm Thư Viện (Gen 1)',
      badge: 'Dấu mốc thành lập chính thức',
      description: 'Chủ nhiệm sáng lập Nguyễn Thuý Hường cùng Ban điều hành Gen 1 chính thức ra mắt CLB trực thuộc Trung tâm Thư viện - Phòng ban trường ĐH Kinh tế - Kỹ thuật Công nghiệp.',
      story: 'Ngày 21/04/2018 ghi dấu mốc lịch sử khi CLB Sách UNETI (Uneti\'s Book Club - UBC) được thành lập chính thức trực thuộc Trung tâm Thư viện Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (CLB trực thuộc Phòng ban của Nhà trường). Màu áo đỏ thắm cùng biểu tượng tay nâng sách 3D đã trở thành biểu tượng tinh thần nhiệt huyết của sinh viên UNETI.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      leaders: ['Nguyễn Thuý Hường (Chủ nhiệm sáng lập)', 'Phạm Ánh Hồng (PCN Hậu cần)', 'Lê Thị Ngoan (PCN Đào tạo)'],
      achievements: [
        'Được Trung tâm Thư viện nhà trường chính thức công nhận và bảo trợ',
        'Thu hút hơn 80 thành viên chính thức gia nhập thế hệ Gen 1',
        'Xây dựng bộ nhận diện áo đỏ truyền thống và biểu tượng tay nâng sách'
      ]
    },
    {
      year: '2020',
      exactDate: '2019 - 2020',
      phase: 'phase-2',
      phaseName: 'Chuyển Mình & Vượt Thách Thức (2019 - 2021)',
      title: 'Vượt Qua Đại Dịch & Chuyển Đổi Số Văn Hóa Đọc (Gen 2 - Gen 3)',
      badge: 'Chuyển đổi số & Vượt khó',
      description: 'Thích ứng linh hoạt trong bối cảnh đại dịch COVID-19, chuyển đổi mạnh mẽ sang mô hình sinh hoạt số và chuỗi Review sách trực tuyến.',
      story: 'Dưới sự chèo lái của thế hệ Gen 2 và Gen 3 như anh Phạm Gia Trung, chị Lương Thị Thu Trang, chị Lô Thị Ngọc Bích, chị Kiều Trang Nhung, ngọn lửa đọc sách không hề bị dập tắt. Chuỗi Review sách trực tuyến đã lan tỏa hàng chục ngàn lượt xem trên mạng xã hội, kết nối sinh viên tại nhà và phối hợp cùng Trung tâm Thư viện khai thác nguồn học liệu điện tử.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      leaders: ['Phạm Gia Trung (PCN Hậu cần HN)', 'Lương Thị Thu Trang (PCN Truyền thông)', 'Lô Thị Ngọc Bích (Phó CN Gen 3)', 'Kiều Trang Nhung (Phó CN Gen 3)'],
      achievements: [
        'Hơn 50 bài Book Review xuất sắc lan tỏa rộng rãi trên mạng xã hội',
        'Tổ chức 15 buổi tọa đàm Online chuyên đề phương pháp tự học và đọc sách',
        'Mở rộng không gian sinh hoạt kết nối sang cơ sở 218 Lĩnh Nam'
      ]
    },
    {
      year: '2022',
      exactDate: '2021 - 2022',
      phase: 'phase-2',
      phaseName: 'Chuyển Mình & Vượt Thách Thức (2019 - 2021)',
      title: 'Mở Rộng Kết Nối 3 Cơ Sở & Khai Trương Phòng Đọc HA8 (Gen 4 - Gen 5)',
      badge: 'Hội tụ 3 cơ sở đào tạo',
      description: 'Phủ sóng toàn diện tại cả 3 cơ sở: Minh Khai, Lĩnh Nam (Hà Nội) và Nam Định; hoàn thiện bộ máy 4 ban chuyên môn nòng cốt.',
      story: 'UBC bước vào giai đoạn tăng tốc với sự ra đời của các ban chức năng chuyên nghiệp: Ban Văn hoá Đọc, Ban Truyền thông, Ban Hậu cần và Ban Đào tạo. Với sự đồng hành của Trung tâm Thư viện, phòng đọc HA8 tại cơ sở 454 Minh Khai chính thức trở thành "tổng hành dinh" ấm cúng của đại gia đình UBC.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
      leaders: ['Nguyễn Văn Thiện (Chủ nhiệm)', 'Nguyễn Thanh Bình (Trưởng ban Hậu cần)', 'Nguyễn Xuân Sắc (Trưởng ban Văn hoá Đọc)'],
      achievements: [
        'Đưa vào vận hành phòng sinh hoạt HA8 cùng Trung tâm Thư viện',
        'Thành lập phân chi hội UBC tại cơ sở TP. Nam Định',
        'Đạt mốc 250+ thành viên tích cực trải khắp các khoa viện'
      ]
    },
    {
      year: '2024',
      exactDate: '07/04/2024 & 21/04/2024',
      phase: 'phase-3',
      phaseName: 'Mốc Son 10 Năm & Tương Lai (2022 - Nay)',
      title: 'Mốc Son 10 Năm & Chuyến Xe Thiện Nguyện Tuyên Quang (Gen 6)',
      badge: 'Đại lễ 10 năm & Sứ mệnh phụng sự',
      description: 'Kỷ niệm 10 năm hành trình (2014 - 2024) bằng chuyến xe thiện nguyện trao tặng tri thức cho học sinh vùng cao tỉnh Tuyên Quang.',
      story: 'Ngày 07/04/2024, hơn 50 thành viên cốt cán trong màu áo đỏ rực rỡ, dẫn đầu bởi Chủ nhiệm Nguyễn Văn Thiện và Cựu CN sáng lập Nguyễn Thuý Hường, đã hội tụ trên sân khấu Tuyên Quang. Chuyến đi đã trao tặng 2.500 đầu sách ước mơ và 50 suất học bổng, khẳng định triết lý: "Đọc để nâng cao tri thức - Hành động để sẻ chia cộng đồng".',
      image: '/assets/tuyenquang-D0C5OBX9.jpg',
      leaders: ['Nguyễn Văn Thiện (Chủ nhiệm CLB)', 'Nguyễn Thuý Hường (Cựu CN sáng lập)', 'Ban Điều hành Gen 6'],
      achievements: [
        'Trao tặng 2.500 đầu sách ước mơ cho học sinh vùng cao Tuyên Quang',
        'Tổ chức thành công Đại lễ Kỷ niệm 10 năm thành lập CLB UBC',
        'Xác lập bức ảnh kỷ niệm lịch sử Tuyên Quang ngày 07/04/2024'
      ]
    },
    {
      year: '2025 - Nay',
      exactDate: 'Gen 7 Hiện tại & Tương lai',
      phase: 'phase-3',
      phaseName: 'Mốc Son 10 Năm & Tương Lai (2022 - Nay)',
      title: 'Kế Thừa Di Sản, Đổi Mới Số Hóa & Vươn Tầm Thế Hệ Trẻ (Gen 7)',
      badge: 'Đổi mới sáng tạo & Chuyển giao thế hệ',
      description: 'Ứng dụng công nghệ quản trị thành viên bằng Mã sinh viên, phát huy vai trò CLB trực thuộc Phòng ban Trung tâm Thư viện.',
      story: 'Bước sang thập kỷ thứ hai, thế hệ Gen 7 tiếp tục kế thừa ngọn đuốc từ các anh chị đi trước. Hệ thống quản trị thành viên bằng Mã sinh viên UNETI, phân quyền minh bạch, không ngừng đổi mới hình thức sinh hoạt Reading Circle và mở rộng hợp tác cùng Trung tâm Thư viện trong các sự kiện ngày hội sách toàn trường.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      leaders: ['Ban Chủ nhiệm đương nhiệm Gen 7', 'Thế hệ thủ lĩnh trẻ các khoa viện'],
      achievements: [
        'Số hóa 100% hồ sơ thành viên qua Mã sinh viên UNETI',
        'Kết nối mạng lưới cựu thành viên thành đạt quay về đồng hành cùng CLB',
        'Khẳng định vị thế CLB học thuật & kỹ năng tiêu biểu trực thuộc Trung tâm Thư viện UNETI'
      ]
    }
  ];

  const filteredMilestones = selectedPhase === 'all'
    ? MILESTONES
    : MILESTONES.filter((m) => m.phase === selectedPhase);

  const activeMilestone = MILESTONES[activeMilestoneIndex] || MILESTONES[4];

  const CORE_VALUES = [
    {
      icon: Flame,
      title: 'Sắc Áo Đỏ Nhiệt Huyết',
      desc: 'Màu cờ sắc áo truyền thống tượng trưng cho đam mê, tinh thần cống hiến và ngọn lửa tri thức bất diệt của sinh viên UNETI từ năm 2014 đến nay.'
    },
    {
      icon: Building2,
      title: 'Trực Thuộc Trung Tâm Thư Viện',
      desc: 'Là CLB trực thuộc Phòng ban chức năng của Nhà trường, được thụ hưởng không gian học thuật, phòng đọc HA8 và sự bảo trợ chuyên môn sâu sắc.'
    },
    {
      icon: Heart,
      title: 'Trách Nhiệm Phụng Sự',
      desc: 'Lan tỏa văn hóa đọc không chỉ trong khuôn viên trường mà còn qua những chuyến xe thiện nguyện vùng cao như mốc son Tuyên Quang 07/04/2024.'
    }
  ];

  const KEY_LEADERS = [
    {
      name: 'Nguyễn Thuý Hường',
      role: 'Chủ nhiệm sáng lập (Gen 1)',
      faculty: 'Khoa Kế toán - Kiểm toán (DHKT14A2CL)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      quote: 'Những ngày đầu thành lập còn bao thiếu thốn, nhưng nhờ sự bảo trợ của Trung tâm Thư viện và tình yêu sách của các bạn, UBC đã đứng vững và lớn mạnh như hôm nay.',
      highlight: 'Người đặt viên gạch đầu tiên'
    },
    {
      name: 'Phạm Gia Trung',
      role: 'PCN Hậu Cần Hà Nội (Gen 2)',
      faculty: 'Khoa Cơ Khí (DHCD15A5HN)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      quote: 'Anh em khối kỹ thuật chúng mình đến với sách như một cách làm giàu tâm hồn và rèn giũa bản lĩnh sống.',
      highlight: 'Thủ lĩnh hậu cần kiên cường'
    },
    {
      name: 'Lô Thị Ngọc Bích',
      role: 'Phó CN Ban Văn Hoá Đọc (Gen 3)',
      faculty: 'Khoa Quản trị và Marketing (DHQT17A3HN)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      quote: 'Vượt qua giai đoạn đại dịch, chúng mình tự hào khi đưa hoạt động sinh hoạt của UBC lên không gian số và chạm tới hàng ngàn sinh viên.',
      highlight: 'Tiên phong chuyển đổi số'
    },
    {
      name: 'Nguyễn Văn Thiện',
      role: 'Chủ nhiệm CLB (Đại diện Tuyên Quang)',
      faculty: 'Khoa Ngoại Ngữ (DHNN15A5HN)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      quote: 'Chuyến xe Tuyên Quang ngày 07/04/2024 là minh chứng cho 10 năm thắp lửa: Sinh viên UNETI đọc sách không chỉ cho bản thân, mà còn để sẻ chia cùng đất nước.',
      highlight: 'Trưởng đoàn Tuyên Quang 07/04/2024'
    }
  ];

  const HISTORICAL_STATS = [
    { value: '10+', label: 'Năm đồng hành cùng sinh viên', desc: 'Từ 2014 đến 2024+' },
    { value: '7', label: 'Thế hệ Gen tiếp nối', desc: 'Kế thừa ngọn lửa tri thức' },
    { value: '300+', label: 'Thành viên & Cựu thành viên', desc: 'Mái nhà chung gắn kết' },
    { value: '3', label: 'Cơ sở sinh hoạt UNETI', desc: 'Minh Khai • Lĩnh Nam • Nam Định' },
    { value: '2.500+', label: 'Sách thiện nguyện trao tặng', desc: 'Dấu ấn Tuyên Quang 07/04/2024' },
    { value: '100%', label: 'Sinh viên quản trị bằng MSV', desc: 'Chuyển đổi số hiện đại' }
  ];

  return (
    <div id="journey-section" className="bg-[#fafafa] py-16 sm:py-24 text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* SECTION 1: HEADER & QUÁ TRÌNH HÌNH THÀNH VÀ PHÁT TRIỂN */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-900 border border-red-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-700" />
            <span>Kỷ Niệm 10 Năm • 2014 - 2024+</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif-title uppercase tracking-tight">
            Quá Trình Hình Thành & Phát Triển Của UBC
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Hành trình một thập kỷ bền bỉ thắp sáng tình yêu tri thức của Câu lạc bộ Sách trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI Book Club).
          </p>
        </div>

        {/* ORGANIZATIONAL AFFILIATION HIGHLIGHT: TRỰC THUỘC TRUNG TÂM THƯ VIỆN (PHÒNG BAN) */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-red-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-700/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Building2 className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-1 rounded-full inline-block">
                  Cơ Cấu Tổ Chức & Pháp Lý
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-serif-title text-white">
                  CLB Trực Thuộc Trung Tâm Thư Viện (CLB Trực Thuộc Phòng Ban)
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-2xl">
                  Câu lạc bộ Sách UNETI (UBC) là đơn vị trực thuộc <strong className="text-yellow-200">Trung tâm Thư viện Trường Đại học Kinh tế - Kỹ thuật Công nghiệp</strong> — cơ cấu trực thuộc Phòng ban chức năng của Nhà trường. CLB là cánh tay nối dài lan tỏa văn hóa đọc, hướng dẫn phương pháp tự học và kết nối bạn đọc tại cả 3 cơ sở đào tạo.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[11px] text-rose-200 block uppercase font-bold">Điểm tựa học thuật</span>
                <span className="text-xs font-bold text-yellow-300">Phòng đọc HA8 & Thư viện 3 cơ sở</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[11px] text-rose-200 block uppercase font-bold">Mô hình quản trị</span>
                <span className="text-xs font-bold text-yellow-300">Số hóa 100% theo Mã sinh viên</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 3 GIÁ TRỊ CỐT LÕI (CORE VALUES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-red-100 shadow-md shadow-red-900/5 hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 to-red-900 text-white flex items-center justify-center mb-6 shadow-md shadow-red-800/20 group-hover:scale-110 transition duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif-title">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* SECTION 3: INTERACTIVE 10-YEAR HISTORICAL TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-lg relative overflow-hidden">
          {/* Subtle watermarked UBC logo */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none text-9xl font-black font-serif-title select-none">
            UBC
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-widest block">
                Dòng Thời Gian Lịch Sử
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-title mt-1">
                Các Mốc Son Vàng (2014 - 2024+)
              </h3>
            </div>

            {/* Phase Filters */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedPhase === 'all'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả (10 Năm)
              </button>
              <button
                onClick={() => setSelectedPhase('phase-1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedPhase === 'phase-1'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2014 - 2018 (Khởi sinh)
              </button>
              <button
                onClick={() => setSelectedPhase('phase-2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedPhase === 'phase-2'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2019 - 2021 (Vượt khó)
              </button>
              <button
                onClick={() => setSelectedPhase('phase-3')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedPhase === 'phase-3'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2022 - 2024+ (Mốc son 10 năm)
              </button>
            </div>
          </div>

          {/* Quick Year Selector Ribbon */}
          <div className="py-6 flex items-center gap-3 overflow-x-auto scrollbar-none border-b border-slate-100">
            {MILESTONES.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setActiveMilestoneIndex(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeMilestoneIndex === idx
                    ? 'bg-red-800 text-white shadow-md shadow-red-800/20 scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Năm {m.year}</span>
                {m.year === '2024' && (
                  <span className="text-[10px] bg-yellow-400 text-red-950 px-1.5 py-0.2 rounded font-black">
                    Tuyên Quang
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Active Milestone Spotlight Showcase */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl overflow-hidden border-2 border-red-200 shadow-xl relative aspect-4/3 bg-slate-900">
                <img
                  src={activeMilestone.image}
                  alt={activeMilestone.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest bg-red-700 text-white px-3 py-1 rounded-full shadow-md">
                    {activeMilestone.badge}
                  </span>
                </div>
                {activeMilestone.exactDate && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs flex items-center justify-between">
                    <span className="font-semibold">{activeMilestone.exactDate}</span>
                    <span className="text-[10px] text-yellow-300 font-bold uppercase">Dấu ấn UBC</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block mb-2">
                  {activeMilestone.phaseName}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-title leading-tight">
                  {activeMilestone.title}
                </h4>
              </div>

              <p className="text-sm font-semibold text-slate-700 leading-relaxed border-l-4 border-red-700 pl-4 py-1 bg-red-50/40 rounded-r-xl">
                {activeMilestone.description}
              </p>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeMilestone.story}
              </p>

              {/* Leaders on this milestone */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Thế hệ cán bộ đồng hành:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeMilestone.leaders.map((lead, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                    >
                      <Users className="w-3.5 h-3.5 text-red-700" />
                      <span>{lead}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Thành quả tiêu biểu:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {activeMilestone.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: HÀNH TRÌNH 10 NĂM QUA NHỮNG CON SỐ BIẾT NÓI */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              Hành Trình Tự Hào
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-title uppercase">
              10 Năm Qua Những Con Số Biết Nói
            </h3>
            <p className="text-xs text-slate-500">
              Những nỗ lực không ngừng nghỉ của các thế hệ thành viên dưới sự định hướng của Trung tâm Thư viện UNETI.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HISTORICAL_STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-xs hover:border-red-300 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-red-700 font-serif-title block mb-1">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-800 block leading-snug">
                    {stat.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: THẾ HỆ THỦ LĨNH QUA CÁC THỜI KỲ (HALL OF LEADERSHIP) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              Di Sản Lãnh Đạo
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-title uppercase">
              Những Người Dẫn Lối Qua Các Thế Hệ
            </h3>
            <p className="text-xs text-slate-500">
              Biết ơn những người anh, người chị đã đặt nền móng và truyền ngọn lửa nhiệt huyết cho thế hệ hôm nay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KEY_LEADERS.map((leader, i) => {
              const matchedMember = users.find((u) => u.name === leader.name);
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (matchedMember) {
                      openUserProfile(matchedMember);
                    }
                  }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-red-100 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 font-serif-title group-hover:text-red-800 transition-colors">
                          {leader.name}
                        </h4>
                        <span className="text-[11px] font-bold text-red-700 block">
                          {leader.role}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {leader.faculty}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md inline-block mb-3">
                      ★ {leader.highlight}
                    </span>

                    <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                      "{leader.quote}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (matchedMember) {
                        openUserProfile(matchedMember);
                      }
                    }}
                    className="w-full mt-2 py-2 px-3 bg-red-50 hover:bg-red-700 text-red-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Xem Profile cá nhân →</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action button to view all public member cards */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setHistoryInitialTab('directory');
                setActiveTab('history');
              }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-red-800 to-red-950 hover:from-red-900 hover:to-black text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-950/20 hover:scale-105 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Xem Danh Bạ Công Khai Thành Viên Các Gen (Mỗi thành viên 1 thẻ) →</span>
            </button>
          </div>
        </div>

        {/* SECTION 6: ĐẶC BIỆT - MỐC SON TUYÊN QUANG 07/04/2024 */}
        <div className="bg-gradient-to-br from-red-950 via-slate-950 to-red-950 text-white rounded-3xl p-8 sm:p-12 border border-red-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-red-700 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
                  Mốc Son Lịch Sử
                </span>
                <span className="text-xs text-yellow-300 font-bold">
                  Tuyên Quang, Ngày 07 Tháng 04 Năm 2024
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-serif-title tracking-tight leading-tight">
                Chuyến Xe Thiện Nguyện Kỷ Niệm 10 Năm CLB Sách UNETI
              </h3>

              <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
                Hơn 50 thành viên tiêu biểu trong trang phục áo đỏ đồng phục đã vượt hàng trăm cây số mang theo 2.500 cuốn sách ước mơ và 50 suất học bổng đến với học sinh vùng cao tỉnh Tuyên Quang. Đây là minh chứng hùng hồn nhất cho hành trình 10 năm thắp lửa tri thức và sẻ chia yêu thương của sinh viên UNETI.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="bg-white/10 rounded-2xl p-3 border border-white/15">
                  <span className="text-2xl font-black text-yellow-300 block">2.500+</span>
                  <span className="text-[10px] text-red-200 uppercase font-semibold">Đầu sách trao tặng</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 border border-white/15">
                  <span className="text-2xl font-black text-yellow-300 block">50+</span>
                  <span className="text-[10px] text-red-200 uppercase font-semibold">Suất học bổng</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 border border-white/15">
                  <span className="text-2xl font-black text-yellow-300 block">10 Năm</span>
                  <span className="text-[10px] text-red-200 uppercase font-semibold">Sắc áo đỏ rực</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl relative">
                <img
                  src="/assets/tuyenquang-D0C5OBX9.jpg"
                  alt="Đại gia đình UBC tại Tuyên Quang"
                  className="w-full h-auto object-cover max-h-72 sm:max-h-80"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-amber-200 text-center font-bold">
                  Bức ảnh lưu niệm đại gia đình UBC trên sân khấu Tuyên Quang
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: KÊU GỌI HÀNH ĐỘNG & ĐỒNG HÀNH */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-red-100 shadow-md text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-title uppercase">
              Cùng Viết Tiếp Trang Sử Mới Của UBC UNETI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Bạn là tân sinh viên hay sinh viên các khóa đang theo học tại UNETI? Hãy cùng khoác lên mình màu áo đỏ truyền thống của CLB Sách trực thuộc Trung tâm Thư viện và trở thành một phần của đại gia đình UBC ngay hôm nay!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-lg shadow-red-700/20 cursor-pointer active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>Đăng ký gia nhập bằng Mã sinh viên</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-lg shadow-red-700/20 cursor-pointer active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Khám phá toàn bộ kỷ yếu UBC History</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-1.5 px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <span>Xem danh bạ thành viên các thế hệ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
