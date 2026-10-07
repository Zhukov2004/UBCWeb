import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  Calendar,
  Heart,
  MessageSquare,
  Users,
  Send,
  Camera,
  ChevronRight,
  Bookmark,
  Shield,
  Clock,
  Bot,
  Search,
  MapPin,
  GraduationCap,
  BookOpen,
  Filter,
  CheckCircle,
  ExternalLink,
  Eye,
  Camera as CameraIcon
} from 'lucide-react';

export const UbcHistory: React.FC = () => {
  const {
    historyList,
    memories,
    addMemory,
    likeMemory,
    currentUser,
    setShowAuthModal,
    users,
    openUserProfile,
    historyInitialTab,
    setHistoryInitialTab,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'timeline' | 'directory' | 'wall'>(historyInitialTab || 'timeline');
  const [selectedGenIndex, setSelectedGenIndex] = useState<number>(historyList.length - 2); // Default to Gen 6 / Gen 5
  const [memoryInput, setMemoryInput] = useState<string>('');
  const [sentMessageToast, setSentMessageToast] = useState<boolean>(false);

  // Sync if historyInitialTab changes from outside
  React.useEffect(() => {
    if (historyInitialTab) {
      setActiveTab(historyInitialTab);
    }
  }, [historyInitialTab]);

  // Directory filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenFilter, setSelectedGenFilter] = useState('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('all');

  const currentGen = historyList[selectedGenIndex] || historyList[0];

  const handlePostMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryInput.trim()) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    addMemory(memoryInput.trim());
    setMemoryInput('');
    setSentMessageToast(true);
    setTimeout(() => setSentMessageToast(false), 3000);
  };

  // Filtered members for directory
  const filteredMembers = useMemo(() => {
    return users.filter((u) => {
      if (u.status !== 'approved') return false;

      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.class && u.class.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.position && u.position.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGen = selectedGenFilter === 'all' || u.gen === selectedGenFilter;
      const matchesDept = selectedDeptFilter === 'all' || u.department === selectedDeptFilter;
      const matchesCampus = selectedCampusFilter === 'all' || u.campus === selectedCampusFilter;

      return matchesSearch && matchesGen && matchesDept && matchesCampus;
    });
  }, [users, searchQuery, selectedGenFilter, selectedDeptFilter, selectedCampusFilter]);

  return (
    <section className="py-16 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-700" />
            <span>Kỷ Yếu & Truyền Thống UBC UNETI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif-title uppercase tracking-tight">
            UBC History • Tiếp Lửa Tri Thức Qua Các Gen
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Nơi lưu giữ những dấu ấn tự hào, kỷ niệm chuyến xe Tuyên Quang 07/04/2024 và danh bạ các thế hệ thành viên đã cùng nhau xây dựng mái nhà chung UNETI Book Club.
          </p>

          {/* AI History Assistant Callout */}
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-200/80 px-5 py-3 rounded-2xl shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-red-950 block">UBC Genius AI</span>
                <span className="text-slate-500 text-[11px]">Trợ lý thông minh giải đáp toàn bộ lịch sử Gen 1 đến Gen 7</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-red-700 bg-white border border-red-200 px-3 py-1 rounded-full shadow-xs">
              💬 Bấm nút trò chuyện ở góc dưới màn hình!
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-red-800 text-white shadow-lg shadow-red-900/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Dấu ấn các thế hệ Gen</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-red-800 text-white shadow-lg shadow-red-900/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh bạ thành viên ({users.filter(u => u.status === 'approved').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wall')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'wall'
                ? 'bg-red-800 text-white shadow-lg shadow-red-900/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Lưu bút truyền thống</span>
          </button>
        </div>

        {/* TAB 1: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="animate-in fade-in">
            {/* Gen Selector Bar */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
              {historyList.map((g, idx) => (
                <button
                  key={g.gen}
                  onClick={() => setSelectedGenIndex(idx)}
                  className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex flex-col items-center gap-0.5 ${
                    selectedGenIndex === idx
                      ? 'bg-red-800 text-white shadow-lg shadow-red-900/25 scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="font-extrabold">{g.gen}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      selectedGenIndex === idx ? 'text-rose-200' : 'text-slate-400'
                    }`}
                  >
                    {g.academicYear}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Gen Showcase Card */}
            <div className="bg-white rounded-3xl border border-red-100 p-6 sm:p-10 shadow-xl mb-12">
              {/* Top Banner of Selected Gen */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-widest">
                    <Bookmark className="w-4 h-4" />
                    <span>Niên khóa {currentGen.academicYear}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif-title">
                    {currentGen.gen}: {currentGen.theme}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {currentGen.description}
                  </p>
                </div>

                {/* Achievements Pill */}
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                    <Award className="w-4 h-4 text-red-700" />
                    <span>Thành tựu tiêu biểu</span>
                  </div>
                  <ul className="space-y-1.5">
                    {currentGen.achievements.map((ach, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                        <span className="text-red-600 font-bold">✓</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Leaders of this Gen */}
              <div className="py-8 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-700" />
                  <span>Gương Mặt Ban Điều Hành & Đại Diện {currentGen.gen}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentGen.leaders.map((leader, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-red-300 transition"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{leader.name}</h5>
                          <span className="text-xs font-semibold text-red-700 block">
                            {leader.role}
                          </span>
                          <span className="text-[11px] text-slate-400">{leader.faculty}</span>
                        </div>
                      </div>

                      {leader.message && (
                        <p className="text-xs italic text-slate-600 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed mt-2">
                          "{leader.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones & Gallery */}
              <div className="pt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline Milestones */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-700" />
                    <span>Cột Mốc Lịch Sử Của {currentGen.gen}</span>
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-200">
                    {currentGen.milestones.map((m, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-red-700 border-2 border-white shadow-xs"></span>
                        <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                          {m.date}
                        </span>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">{m.title}</h5>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery photos */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-red-700" />
                    <span>Khoảnh Khắc Kỷ Niệm (Kỷ Yếu)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentGen.gallery.map((img, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden shadow-sm bg-slate-100">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-40 object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-white text-xs font-medium leading-tight">
                            {img.caption}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DANH BẠ THÀNH VIÊN */}
        {activeTab === 'directory' && (
          <div className="animate-in fade-in space-y-6">
            {/* Notice: Public Gen Member Directory */}
            <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200/80 p-4 sm:p-5 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span>Danh Sách Thành Viên Các Gen (Công Khai)</span>
                    <span className="text-[10px] font-bold bg-red-700 text-white px-2 py-0.5 rounded-full">
                      Public Directory
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mỗi thành viên là 1 thẻ hồ sơ. <strong>Bấm vào thẻ bất kỳ</strong> để xem Profile, bộ sưu tập ảnh (tối đa 10 ảnh), và tự do tùy biến thông tin cá nhân của mình.
                  </p>
                </div>
              </div>

              {currentUser && (
                <button
                  onClick={() => openUserProfile(currentUser)}
                  className="shrink-0 bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/10 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Trang cá nhân của bạn</span>
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, mã SV, lớp, chức vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-600 focus:bg-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedGenFilter}
                  onChange={(e) => setSelectedGenFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">Tất cả Gen</option>
                  <option value="Gen 1">Gen 1</option>
                  <option value="Gen 2">Gen 2</option>
                  <option value="Gen 3">Gen 3</option>
                  <option value="Gen 4">Gen 4</option>
                  <option value="Gen 5">Gen 5</option>
                  <option value="Gen 6">Gen 6</option>
                  <option value="Gen 7">Gen 7</option>
                </select>

                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">Tất cả ban</option>
                  <option value="Ban Văn Hoá Đọc">Ban Văn Hoá Đọc</option>
                  <option value="Ban Hậu Cần">Ban Hậu Cần</option>
                  <option value="Ban Đào Tạo">Ban Đào Tạo</option>
                  <option value="Ban Truyền Thông">Ban Truyền Thông</option>
                </select>

                <select
                  value={selectedCampusFilter}
                  onChange={(e) => setSelectedCampusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">Tất cả cơ sở</option>
                  <option value="Lĩnh Nam">CS Lĩnh Nam</option>
                  <option value="Minh Khai">CS Minh Khai</option>
                  <option value="Nam Định">CS Nam Định</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Tìm thấy: <strong className="text-red-700">{filteredMembers.length}</strong> thành viên
              </span>
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => openUserProfile(member)}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  {/* Card Cover Banner */}
                  <div className="relative h-28 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={member.coverImage || '/assets/tuyenquang-D0C5OBX9.jpg'}
                      alt="Ảnh bìa hồ sơ"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                    {/* Gen & Public Badge */}
                    <div className="absolute top-2.5 left-3 flex items-center gap-1.5 flex-wrap">
                      {member.gen && (
                        <span className="text-[10px] font-black bg-red-700 text-white px-2 py-0.5 rounded-full shadow-xs">
                          {member.gen}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Hồ sơ công khai
                      </span>
                    </div>

                    {/* Photos Count (Max 10) */}
                    <div className="absolute top-2.5 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                      <CameraIcon className="w-3 h-3 text-amber-300" />
                      <span>{(member.galleryPhotos || []).length}/10 ảnh</span>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar overlapping cover banner */}
                      <div className="flex items-end justify-between -mt-10 mb-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white group-hover:ring-2 group-hover:ring-red-500 transition-all"
                          />
                          {currentUser?.id === member.id && (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                              title="Hồ sơ của bạn"
                            />
                          )}
                        </div>

                        {currentUser?.id === member.id && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            ★ Bạn có thể sửa
                          </span>
                        )}
                      </div>

                      {/* Name & Role */}
                      <div className="mb-3">
                        <h4 className="font-extrabold text-slate-900 text-base group-hover:text-red-800 transition-colors flex items-center gap-1.5">
                          <span>{member.name}</span>
                        </h4>
                        {member.position ? (
                          <div className="text-xs font-bold text-red-700 mt-0.5 truncate">
                            {member.position}
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                            Thành viên CLB
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 truncate font-medium">
                          {member.department}
                        </div>
                      </div>

                      {/* Academic & Campus details */}
                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <GraduationCap className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="truncate font-medium">{member.faculty || 'ĐH Kinh tế - Kỹ thuật Công nghiệp'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Lớp: <strong className="text-slate-700">{member.class || 'N/A'}</strong></span>
                          {member.campus && <span>Cơ sở: <strong className="text-slate-700">{member.campus}</strong></span>}
                        </div>
                        {member.hometown && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">Quê quán: {member.hometown}</span>
                          </div>
                        )}
                      </div>

                      {/* Bio Quote */}
                      {member.bio && (
                        <p className="text-xs text-slate-600 italic line-clamp-2 mb-3 bg-red-50/40 p-2.5 rounded-xl border border-red-100/50">
                          "{member.bio}"
                        </p>
                      )}
                    </div>

                    <div>
                      {/* Reading stats & contact */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-3 font-semibold">
                          <span title="Số sách đã đọc">📚 {member.readingStats?.booksRead || 0} sách</span>
                          <span title="Bài review đã viết">✍️ {member.readingStats?.reviewsCount || 0} review</span>
                        </div>

                        {member.facebookUrl && (
                          <a
                            href={member.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-xs"
                          >
                            <span>Facebook</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* CTA button to open full Profile */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUserProfile(member);
                        }}
                        className="w-full mt-3 py-2.5 px-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-700 hover:to-red-800 text-red-800 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border border-red-200 hover:border-transparent shadow-xs cursor-pointer group-hover:bg-red-700 group-hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Profile & Album ảnh ({(member.galleryPhotos || []).length}/10) →</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">Không tìm thấy thành viên phù hợp</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BỨC TƯỜNG LƯU BÚT */}
        {activeTab === 'wall' && (
          <div className="bg-gradient-to-br from-red-900 via-[#7a0312] to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl animate-in fade-in">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Lưu Bút Truyền Thống UBC
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 font-serif-title">
                Bức Tường Kỷ Niệm & Lời Chúc Các Thế Hệ
              </h3>
              <p className="text-xs sm:text-sm text-rose-100/80 mt-1">
                Dù bạn là Gen 1 hay Gen 7, những dòng nhắn gửi tại đây chính là cầu nối tiếp lửa cho truyền thống bền lâu của CLB Sách UNETI.
              </p>
            </div>

            {/* Form to leave a memory */}
            <form onSubmit={handlePostMemory} className="max-w-2xl mx-auto mb-10">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={
                    currentUser
                      ? `Viết lời chúc hoặc chia sẻ kỷ niệm của bạn (với tư cách ${currentUser.name} - ${currentUser.gen})...`
                      : 'Đăng nhập để gửi gắm kỷ niệm vào bức tường UBC...'
                  }
                  value={memoryInput}
                  onChange={(e) => setMemoryInput(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-rose-200/60 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lời chúc</span>
                </button>
              </div>

              {sentMessageToast && (
                <div className="mt-2 text-center text-xs font-bold text-emerald-300 animate-in fade-in">
                  ✓ Lời chúc của bạn đã được ghi danh vào Bức tường Kỷ niệm UBC!
                </div>
              )}
            </form>

            {/* Memories list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memories.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-white text-sm block">{m.authorName}</span>
                        <span className="text-[11px] text-rose-300">
                          {m.gen} • {m.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-rose-200/60">{m.date}</span>
                    </div>

                    <p className="text-xs text-rose-100/90 leading-relaxed italic mt-2">
                      "{m.message}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
                    <button
                      onClick={() => likeMemory(m.id)}
                      className="flex items-center gap-1.5 text-xs text-rose-200 hover:text-white transition"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      <span>{m.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
