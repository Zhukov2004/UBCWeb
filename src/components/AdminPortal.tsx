import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole, UserStatus, ClubMeeting } from '../types';
import {
  ShieldCheck,
  Users,
  FileCheck,
  Calendar,
  BarChart3,
  History,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  UserPlus,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  Filter,
  Send,
  Download,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Award,
  ShieldAlert,
  Sparkles,
  Image as ImageIcon,
  RotateCcw,
  Upload,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { UbcLogo } from './UbcLogo';

export const AdminPortal: React.FC = () => {
  const {
    users,
    reviews,
    articles,
    meetings,
    auditLogs,
    currentUser,
    heroBackgroundUrl,
    setHeroBackgroundUrl,
    resetHeroBackground,
    headerLogoUrl,
    setHeaderLogoUrl,
    setActiveTab: setAppActiveTab,
    quickSwitchUser,
    adminApproveUser,
    adminRejectUser,
    adminCreateUser,
    adminToggleUserStatus,
    adminChangeRole,
    adminModerateReview,
    adminModerateArticle,
    toggleMeetingCheckin,
    triggerPushNotification,
    adminInitialTab,
    setAdminInitialTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'members' | 'moderation' | 'meetings' | 'logs' | 'push' | 'appearance'>(
    adminInitialTab || 'stats'
  );

  // Appearance State for Admin
  const [customLogoInput, setCustomLogoInput] = useState('');
  const [customBgInput, setCustomBgInput] = useState('');
  const [appearanceSaved, setAppearanceSaved] = useState<string | null>(null);

  // Member Management State
  const [memberFilter, setMemberFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedGen, setSelectedGen] = useState<string>('all');
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);

  // New User Form (Direct Account Provision)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    faculty: 'Khoa Công nghệ Thông tin',
    class: 'DHKTP16A1HN',
    role: 'member' as UserRole,
    gen: 'Gen 4',
    department: 'Ban Văn Hoá Đọc',
    position: 'Thành viên',
    campus: 'Lĩnh Nam',
    hometown: '',
  });

  // Moderation state
  const [modFilter, setModFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  // Push Broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Pending counts
  const pendingUsersCount = users.filter((u) => u.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const pendingArticlesCount = articles.filter((a) => a.status === 'pending').length;
  const totalPending = pendingUsersCount + pendingReviewsCount + pendingArticlesCount;

  // Filtered Members
  const filteredUsers = users.filter((u) => {
    const matchesFilter = memberFilter === 'all' || u.status === memberFilter;
    const matchesCampus = selectedCampus === 'all' || u.campus === selectedCampus;
    const matchesDept = selectedDept === 'all' || u.department === selectedDept;
    const matchesGen = selectedGen === 'all' || u.gen === selectedGen;
    const matchesSearch =
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.studentId.includes(memberSearch) ||
      u.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.class.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (u.hometown && u.hometown.toLowerCase().includes(memberSearch.toLowerCase()));
    return matchesFilter && matchesCampus && matchesDept && matchesGen && matchesSearch;
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.studentId) return;

    adminCreateUser(newUserForm);
    setShowCreateUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      studentId: '',
      phone: '',
      faculty: 'Khoa Công nghệ Thông tin',
      class: 'DHKTP16A1HN',
      role: 'member',
      gen: 'Gen 7',
      department: 'Ban Văn Hoá Đọc',
      position: 'Thành viên',
      campus: 'Lĩnh Nam',
      hometown: '',
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    triggerPushNotification({
      title: `📢 ${broadcastTitle}`,
      message: broadcastMsg,
      type: 'system',
    });

    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  // STRICTLY ADMIN ONLY: normal users & guests CANNOT access club management
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl">
          <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif-title uppercase mb-2">
            Quyền Quản Trị Bị Giới Hạn
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto">
            Tính năng quản trị CLB, đổi logo và ảnh nền <span className="font-bold text-red-800">chỉ dành riêng cho tài khoản Admin</span>. Tài khoản của bạn hiện tại là{' '}
            <span className="font-bold text-slate-800">
              {currentUser ? `${currentUser.name} (MSV: ${currentUser.studentId} - ${currentUser.role === 'moderator' ? 'Ban Biên tập' : 'Thành viên'})` : 'Khách vãng lai (Chưa đăng nhập)'}
            </span>{' '}
            không có quyền truy cập khu vực này.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setAppActiveTab('home')}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition w-full sm:w-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trang chủ</span>
            </button>
            
            <button
              onClick={() => quickSwitchUser('ubc-thien-nv')}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition shadow-md shadow-red-700/20 w-full sm:w-auto cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Đăng nhập thử tài khoản Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 to-red-900 flex items-center justify-center text-white shadow-lg shadow-red-900/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full">
                  Ban Chủ Nhiệm CLB Sách UNETI
                </span>
                {totalPending > 0 && (
                  <span className="text-[10px] font-bold text-white bg-red-600 px-2.5 py-0.5 rounded-full animate-pulse">
                    {totalPending} việc cần duyệt
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif-title">
                Trung Tâm Quản Trị & Điều Hành UBC
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý thành viên, kiểm duyệt bài viết & review, theo dõi lịch sinh hoạt và nhật ký an toàn.
              </p>
            </div>
          </div>

          {/* Quick provision action */}
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-red-700/20 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cấp tài khoản thành viên mới</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê & Báo cáo</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 relative ${
              activeTab === 'members'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quản lý thành viên</span>
            {pendingUsersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingUsersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'moderation'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Duyệt Bài viết & Review</span>
            {pendingReviewsCount + pendingArticlesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingReviewsCount + pendingArticlesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'meetings'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Theo dõi lịch họp & Điểm danh</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Nhật ký hoạt động (Audit Log)</span>
          </button>

          <button
            onClick={() => setActiveTab('push')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'push'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Gửi thông báo đẩy</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'appearance'
                ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Giao diện (Logo & Nền Hero)</span>
          </button>
        </div>

        {/* TAB 1: BÁO CÁO THỐNG KÊ (ANALYTICS & KPIS) */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tổng thành viên
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">{users.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +15% so với kỳ trước
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Đơn chờ phê duyệt
                  </span>
                  <div className="text-3xl font-black text-red-700 mt-1">{pendingUsersCount}</div>
                  <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                    Đăng ký qua Mã sinh viên
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sự kiện & Buổi họp CLB
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">{meetings.length}</div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    Hà Nội & Nam Định
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Bài viết & Review
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {reviews.length + articles.length}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    {pendingReviewsCount + pendingArticlesCount} bài đang chờ duyệt
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Thành viên theo Gen */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-700" />
                  <span>Phân Bổ Thành Viên Theo Các Thế Hệ (Gen 1 - Gen 7)</span>
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Số lượng thành viên hoạt động và mạng lưới cựu thành viên UBC UNETI.
                </p>

                <div className="space-y-3">
                  {[
                    { gen: 'Gen 7 (Hiện tại)', count: 85, max: 100, color: 'bg-red-700' },
                    { gen: 'Gen 6 (2023-2024)', count: 72, max: 100, color: 'bg-red-600' },
                    { gen: 'Gen 5 (2022-2023)', count: 54, max: 100, color: 'bg-red-500' },
                    { gen: 'Gen 4 (2021-2022)', count: 40, max: 100, color: 'bg-red-400' },
                    { gen: 'Gen 3 (2020-2021)', count: 32, max: 100, color: 'bg-rose-400' },
                    { gen: 'Gen 2 & Gen 1', count: 48, max: 100, color: 'bg-slate-400' },
                  ].map((bar, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{bar.gen}</span>
                        <span>{bar.count} thành viên</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.color} transition-all duration-1000`}
                          style={{ width: `${(bar.count / bar.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Tỷ lệ các Ban chuyên môn */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-red-700" />
                  <span>Cơ Cấu Bộ Máy Ban Chuyên Môn UBC</span>
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Tỷ lệ phân bổ nhân sự vào 4 ban nòng cốt của Câu Lạc Bộ.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Ban Chuyên Môn', pct: '38%', count: '115 SV', desc: 'Đọc & Viết review, tuyển chọn sách' },
                    { name: 'Ban Truyền Thông', pct: '28%', count: '84 SV', desc: 'Hình ảnh, video TikTok & Fanpage' },
                    { name: 'Ban Hậu Cần & SK', pct: '22%', count: '66 SV', desc: 'Tổ chức sự kiện & quản lý phòng đọc' },
                    { name: 'Ban Đối Ngoại', pct: '12%', count: '36 SV', desc: 'Tài trợ, liên kết NXB & diễn giả' },
                  ].map((dept, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-2xl font-black text-red-800">{dept.pct}</span>
                      <h4 className="font-bold text-xs text-slate-800 mt-1">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{dept.count}</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic">{dept.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ THÀNH VIÊN (MEMBER MANAGEMENT) */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 animate-in fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMemberFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    memberFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({users.length})
                </button>
                <button
                  onClick={() => setMemberFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    memberFilter === 'pending'
                      ? 'bg-red-700 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span>Chờ duyệt</span>
                  {pendingUsersCount > 0 && (
                    <span className="bg-white text-red-700 px-1.5 py-0.2 rounded-full text-[10px]">
                      {pendingUsersCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMemberFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    memberFilter === 'approved'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Đã duyệt ({users.filter((u) => u.status === 'approved').length})
                </button>
                <button
                  onClick={() => setMemberFilter('suspended')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    memberFilter === 'suspended'
                      ? 'bg-rose-700 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Đang khóa ({users.filter((u) => u.status === 'suspended').length})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, MSV, quê quán, lớp..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                />
              </div>
            </div>

            {/* Detailed Roster Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lọc dữ liệu UBC:
              </span>

              {/* Filter by Campus */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Cơ sở:</span>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-red-600"
                >
                  <option value="all">Tất cả cơ sở</option>
                  <option value="Lĩnh Nam">CS Lĩnh Nam (HN)</option>
                  <option value="Minh Khai">CS Minh Khai (HN)</option>
                  <option value="Nam Định">CS Nam Định</option>
                </select>
              </div>

              {/* Filter by Department */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Ban:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-red-600"
                >
                  <option value="all">Tất cả các ban</option>
                  <option value="Ban Văn Hoá Đọc">Ban Văn Hoá Đọc</option>
                  <option value="Ban Hậu Cần">Ban Hậu Cần</option>
                  <option value="Ban Đào Tạo">Ban Đào Tạo</option>
                  <option value="Ban Truyền Thông">Ban Truyền Thông</option>
                  <option value="Ban Chủ nhiệm">Ban Chủ nhiệm</option>
                </select>
              </div>

              {/* Filter by Gen */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Thế hệ Gen:</span>
                <select
                  value={selectedGen}
                  onChange={(e) => setSelectedGen(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-red-600"
                >
                  <option value="all">Tất cả các Gen</option>
                  <option value="Gen 1">Gen 1</option>
                  <option value="Gen 2">Gen 2</option>
                  <option value="Gen 3">Gen 3</option>
                  <option value="Gen 4">Gen 4</option>
                  <option value="Gen 5">Gen 5</option>
                  <option value="Gen 6">Gen 6</option>
                  <option value="Gen 7">Gen 7</option>
                </select>
              </div>

              <span className="text-[11px] text-slate-400 ml-auto">
                Hiển thị: <strong className="text-slate-800">{filteredUsers.length}</strong> thành viên
              </span>
            </div>

            {/* Table of Members */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 pl-2">Thành viên & Chức vụ</th>
                    <th className="pb-3">Mã SV & Lớp</th>
                    <th className="pb-3">Ban & Gen</th>
                    <th className="pb-3">Cơ sở & Quê quán</th>
                    <th className="pb-3">Phân quyền</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3 text-right pr-2">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.position && (
                                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                                  {u.position}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-700">{u.studentId}</div>
                        <div className="text-[11px] text-slate-400">{u.class}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800">{u.department}</span>
                        <div className="text-[11px] text-red-700 font-bold">{u.gen}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-700">
                          {u.campus ? `CS ${u.campus}` : 'Chưa phân cơ sở'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          {u.hometown || 'Chưa cập nhật quê'}
                        </div>
                      </td>
                      <td className="py-3">
                        <select
                          value={u.role}
                          onChange={(e) => adminChangeRole(u.id, e.target.value as UserRole)}
                          className="text-xs bg-slate-100 border border-slate-200 rounded-md p-1 font-semibold text-slate-700 focus:outline-hidden"
                        >
                          <option value="member">Thành viên</option>
                          <option value="moderator">Ban Biên tập</option>
                          <option value="admin">Ban Chủ nhiệm (Admin)</option>
                        </select>
                      </td>
                      <td className="py-3">
                        {u.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Chờ duyệt
                          </span>
                        )}
                        {u.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Đã kích hoạt
                          </span>
                        )}
                        {u.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Bị khóa
                          </span>
                        )}
                        {u.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Từ chối
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => adminApproveUser(u.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                title="Phê duyệt đơn gia nhập"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => adminRejectUser(u.id)}
                                className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                title="Từ chối đơn"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Từ chối</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => adminToggleUserStatus(u.id)}
                              className={`p-1.5 rounded-lg text-xs transition ${
                                u.status === 'suspended'
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              title={u.status === 'suspended' ? 'Mở khóa' : 'Khóa tài khoản'}
                            >
                              {u.status === 'suspended' ? (
                                <Unlock className="w-3.5 h-3.5" />
                              ) : (
                                <Lock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedUserDetail(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Xem chi tiết & Lý do gia nhập"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Member Details Modal */}
            {selectedUserDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedUserDetail.avatar}
                      alt={selectedUserDetail.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-red-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {selectedUserDetail.name}
                      </h3>
                      <p className="text-xs text-red-700 font-semibold">
                        {selectedUserDetail.department} • {selectedUserDetail.gen}
                      </p>
                      <p className="text-[11px] text-slate-400">{selectedUserDetail.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mã Sinh Viên UNETI:</span>
                      <span className="font-bold text-slate-900">{selectedUserDetail.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lớp & Khoa:</span>
                      <span className="font-semibold text-slate-900">{selectedUserDetail.class} - {selectedUserDetail.faculty}</span>
                    </div>
                    {selectedUserDetail.position && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chức vụ trong CLB:</span>
                        <span className="font-bold text-red-700">{selectedUserDetail.position}</span>
                      </div>
                    )}
                    {selectedUserDetail.campus && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cơ sở học cố định:</span>
                        <span className="font-bold text-slate-900">Cơ sở {selectedUserDetail.campus}</span>
                      </div>
                    )}
                    {selectedUserDetail.hometown && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quê quán:</span>
                        <span className="font-semibold text-slate-900">{selectedUserDetail.hometown}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số điện thoại:</span>
                      <span className="font-semibold text-slate-900">{selectedUserDetail.phone}</span>
                    </div>
                    {selectedUserDetail.zaloName && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zalo:</span>
                        <span className="font-semibold text-blue-600">{selectedUserDetail.zaloName}</span>
                      </div>
                    )}
                    {selectedUserDetail.facebookUrl && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Facebook:</span>
                        <a
                          href={selectedUserDetail.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-700 hover:underline text-[11px] truncate max-w-[200px]"
                        >
                          Trang cá nhân →
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ngày gia nhập:</span>
                      <span>{selectedUserDetail.joinedAt}</span>
                    </div>
                  </div>

                  {selectedUserDetail.motivation && (
                    <div className="mb-4">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                        Lý do xin gia nhập & Định hướng đóng góp:
                      </span>
                      <p className="text-xs italic text-slate-600 bg-red-50/60 p-3 rounded-xl border border-red-100 leading-relaxed">
                        "{selectedUserDetail.motivation}"
                      </p>
                    </div>
                  )}

                  {selectedUserDetail.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          adminApproveUser(selectedUserDetail.id);
                          setSelectedUserDetail(null);
                        }}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Phê duyệt & Cấp quyền
                      </button>
                      <button
                        onClick={() => {
                          adminRejectUser(selectedUserDetail.id);
                          setSelectedUserDetail(null);
                        }}
                        className="flex-1 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal: Direct Account Provision (Admin tạo tài khoản cấp sẵn) */}
            {showCreateUserModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowCreateUserModal(false)}
                    className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                    <UserPlus className="w-4 h-4 text-red-700" />
                    <span>Cấp tài khoản đặc quyền</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 font-serif-title">
                    Tạo & Kích Hoạt Tài Khoản Trực Tiếp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tài khoản do Admin tạo sẽ được tự động kích hoạt (Approved) và có thể đăng nhập ngay mà không cần qua hàng chờ duyệt.
                  </p>

                  <form onSubmit={handleCreateUserSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        placeholder="VD: Nguyễn Văn B"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mã SV UNETI *</label>
                        <input
                          type="text"
                          placeholder="2310XXXXXX"
                          value={newUserForm.studentId}
                          onChange={(e) => setNewUserForm({ ...newUserForm, studentId: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Lớp</label>
                        <input
                          type="text"
                          placeholder="DHKTP16A1HN"
                          value={newUserForm.class}
                          onChange={(e) => setNewUserForm({ ...newUserForm, class: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                        <input
                          type="email"
                          placeholder="sv@uneti.edu.vn"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          placeholder="09XXXXXXXX"
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gen</label>
                        <select
                          value={newUserForm.gen}
                          onChange={(e) => setNewUserForm({ ...newUserForm, gen: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        >
                          <option value="Gen 7">Gen 7</option>
                          <option value="Gen 6">Gen 6</option>
                          <option value="Gen 5">Gen 5</option>
                          <option value="Gen 4">Gen 4</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Bộ phận</label>
                        <select
                          value={newUserForm.department}
                          onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        >
                          <option value="Ban Chuyên môn">Ban Chuyên môn</option>
                          <option value="Ban Truyền thông">Ban Truyền thông</option>
                          <option value="Ban Hậu cần & SK">Ban Hậu cần & SK</option>
                          <option value="Ban Đối ngoại">Ban Đối ngoại</option>
                          <option value="Ban Chủ nhiệm">Ban Chủ nhiệm</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phân quyền</label>
                        <select
                          value={newUserForm.role}
                          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden font-bold"
                        >
                          <option value="member">Thành viên</option>
                          <option value="moderator">Ban Biên tập</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateUserModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800 shadow-md"
                      >
                        Kích hoạt tài khoản
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DUYỆT BÀI VIẾT & REVIEW SÁCH (MODERATION) */}
        {activeTab === 'moderation' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Reviews Moderation */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-title flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-red-700" />
                    <span>Duyệt Bài Cảm Nhận & Review Sách ({reviews.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phê duyệt bài viết của thành viên để xuất bản lên tủ sách công khai.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-2xl border transition ${
                      rev.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200'
                        : rev.status === 'approved'
                        ? 'bg-white border-slate-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.bookCover}
                          alt={rev.bookTitle}
                          className="w-12 h-16 rounded object-cover shadow-xs border"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{rev.title}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rev.status === 'pending'
                                  ? 'bg-amber-200 text-amber-900'
                                  : rev.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {rev.status === 'pending'
                                ? 'Chờ kiểm duyệt'
                                : rev.status === 'approved'
                                ? 'Đã xuất bản'
                                : 'Đã từ chối'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Sách: <span className="font-semibold text-slate-700">{rev.bookTitle}</span> • Tác giả bài viết: <span className="font-semibold">{rev.authorName}</span> ({rev.authorGen})
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {rev.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => adminModerateReview(rev.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Phê duyệt</span>
                            </button>
                            <button
                              onClick={() => adminModerateReview(rev.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Từ chối</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              adminModerateReview(
                                rev.id,
                                rev.status === 'approved' ? 'rejected' : 'approved'
                              )
                            }
                            className="text-xs text-slate-500 hover:text-slate-800 underline"
                          >
                            Đổi trạng thái
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles Moderation */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-title flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-red-700" />
                    <span>Duyệt Bài Viết & Đề Xuất Tin Tức CLB ({articles.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phê duyệt bài viết của thành viên trước khi hiển thị lên Bảng tin CLB.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className={`p-5 rounded-2xl border transition ${
                      art.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{art.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              art.status === 'pending'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {art.status === 'pending' ? 'Chờ kiểm duyệt' : 'Đã đăng'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Chuyên mục: {art.category} • Người gửi: {art.authorName} ({art.authorRole}) • {art.publishedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {art.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => adminModerateArticle(art.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Xuất bản ngay</span>
                            </button>
                            <button
                              onClick={() => adminModerateArticle(art.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Từ chối</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold">
                            ✓ Hoạt động trên trang chủ
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">{art.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: THEO DÕI LỊCH HỌP & ĐIỂM DANH */}
        {activeTab === 'meetings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif-title mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-700" />
              <span>Quản Lý Lịch Sinh Hoạt & Danh Sách Điểm Danh</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Theo dõi số lượng sinh viên tham gia, thực hiện check-in trực tiếp tại hội trường.
            </p>

            <div className="space-y-6">
              {meetings.map((meet) => (
                <div key={meet.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md">
                          {meet.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {meet.date} ({meet.time})
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{meet.title}</h4>
                      <p className="text-xs text-slate-500">Địa điểm: {meet.location}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800">
                        {meet.registeredUsers.length}/{meet.maxAttendees} đã đăng ký
                      </span>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        {meet.registeredUsers.filter((u) => u.checkedIn).length} người đã check-in
                      </p>
                    </div>
                  </div>

                  {/* Registered Attendees Check-in Table */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                      Danh sách thành viên đăng ký (Bấm để điểm danh):
                    </span>

                    {meet.registeredUsers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa có thành viên nào đăng ký.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {meet.registeredUsers.map((user) => (
                          <div
                            key={user.userId}
                            onClick={() => toggleMeetingCheckin(meet.id, user.userId)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                              user.checkedIn
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <div>{user.userName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                MSV: {user.studentId}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                user.checkedIn
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {user.checkedIn ? 'Đã đến' : 'Vắng'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NHẬT KÝ HOẠT ĐỘNG (AUDIT LOG & SECURITY) */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif-title mb-1 flex items-center gap-2">
              <History className="w-5 h-5 text-red-700" />
              <span>Nhật Ký Hoạt Động & Bảo Mật Hệ Thống (Audit Logs)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Ghi nhận mọi hành động nhạy cảm: Đăng ký thành viên, duyệt quyền, mượn trả sách và quản trị.
            </p>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'success'
                          ? 'bg-emerald-500'
                          : log.severity === 'warning'
                          ? 'bg-amber-500'
                          : log.severity === 'danger'
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                      }`}
                    ></span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{log.action}</span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md">
                          {log.userName} ({log.userRole})
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{log.target}</p>
                      {log.details && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GỬI THÔNG BÁO ĐẨY TỨC THÌ (PUSH BROADCAST) */}
        {activeTab === 'push' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl mx-auto animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif-title mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-700" />
              <span>Phát Thông Báo Đẩy Tức Thì Đến Thành Viên</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Hệ thống sẽ hiển thị biểu ngữ thông báo đẩy trực tiếp (Toast) lên màn hình của mọi thành viên đang truy cập.
            </p>

            {broadcastSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thông báo đẩy đã được gửi tới toàn thể thành viên!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  placeholder="VD: Cập nhật lịch họp khẩn Ban Chủ nhiệm tối nay..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập nội dung cần truyền đạt..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-red-700/20"
              >
                <Send className="w-4 h-4" />
                <span>Phát thông báo đẩy ngay lập tức</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: QUẢN TRỊ GIAO DIỆN (CHỈ ADMIN MỚI CÓ QUYỀN ĐỔI LOGO & ẢNH NỀN) */}
        {activeTab === 'appearance' && (
          <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-title">
                    Quản Trị Giao Diện: Đổi Logo & Ảnh Nền Hero
                  </h3>
                  <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    Độc quyền dành riêng cho tài khoản Admin
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                Các tài khoản thành viên thông thường không có quyền truy cập hay thay đổi các thiết lập này. Mọi thay đổi sẽ được lưu trữ và đồng bộ tức thì trên toàn bộ website.
              </p>

              {appearanceSaved && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{appearanceSaved}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: Logo */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Logo Câu Lạc Bộ</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">Thanh Header</span>
                  </div>

                  {/* Logo Preview */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-2xs">
                    <UbcLogo size={60} />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {headerLogoUrl ? 'Logo tùy chỉnh đã tải' : 'Logo Vector Chuẩn UBC (Giữ nguyên)'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {headerLogoUrl ? 'Đang dùng hình ảnh do Admin tải lên' : 'Tay nâng sách 3D, Uneti\'s Book Club'}
                      </span>
                    </div>
                  </div>

                  {/* Action 1: Upload Logo */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tải ảnh logo từ máy tính:
                    </label>
                    <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl border border-dashed border-red-300 bg-red-50/50 hover:bg-red-50 text-xs font-semibold text-red-700 flex items-center justify-center gap-2 transition block text-center">
                      <Upload className="w-4 h-4" />
                      <span>Chọn tệp ảnh logo (PNG, JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setHeaderLogoUrl(event.target.result as string);
                                setAppearanceSaved('Đã cập nhật Logo CLB thành công!');
                                setTimeout(() => setAppearanceSaved(null), 3000);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Action 2: Logo URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hoặc dán URL logo:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://.../logo.png"
                        value={customLogoInput}
                        onChange={(e) => setCustomLogoInput(e.target.value)}
                        className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-hidden focus:border-red-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLogoInput.trim()) {
                            setHeaderLogoUrl(customLogoInput.trim());
                            setCustomLogoInput('');
                            setAppearanceSaved('Đã cập nhật Logo CLB từ URL!');
                            setTimeout(() => setAppearanceSaved(null), 3000);
                          }
                        }}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>

                  {/* Reset to Original Logo */}
                  {headerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeaderLogoUrl(null);
                        setAppearanceSaved('Đã khôi phục về Logo vector chuẩn của UBC!');
                        setTimeout(() => setAppearanceSaved(null), 3000);
                      }}
                      className="text-xs text-slate-500 hover:text-red-700 flex items-center gap-1.5 pt-2 cursor-pointer font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục Logo gốc ban đầu</span>
                    </button>
                  )}
                </div>

                {/* Section 2: Hero Background */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-700" />
                      <span>Ảnh Nền Trang Index (Hero)</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">Đầu trang index</span>
                  </div>

                  {/* Hero Background Preview */}
                  <div className="h-28 rounded-2xl overflow-hidden border border-slate-200 relative shadow-2xs group">
                    <img
                      src={heroBackgroundUrl || '/assets/tuyenquang-D0C5OBX9.jpg'}
                      alt="Hero Background Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                      <span className="text-[11px] font-bold text-white drop-shadow">
                        {heroBackgroundUrl === '/assets/tuyenquang-D0C5OBX9.jpg' || !heroBackgroundUrl
                          ? 'Ảnh chuẩn Tuyên Quang 07/04/2024'
                          : 'Ảnh nền tùy chỉnh hiện tại'}
                      </span>
                    </div>
                  </div>

                  {/* Upload Hero Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tải ảnh nền từ máy tính:
                    </label>
                    <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl border border-dashed border-red-300 bg-red-50/50 hover:bg-red-50 text-xs font-semibold text-red-700 flex items-center justify-center gap-2 transition block text-center">
                      <Upload className="w-4 h-4" />
                      <span>Chọn tệp ảnh nền (JPG, PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setHeroBackgroundUrl(event.target.result as string);
                                setAppearanceSaved('Đã cập nhật ảnh nền Hero Index thành công!');
                                setTimeout(() => setAppearanceSaved(null), 3000);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Hero Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hoặc dán URL ảnh nền:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://.../anh-hero.jpg"
                        value={customBgInput}
                        onChange={(e) => setCustomBgInput(e.target.value)}
                        className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-hidden focus:border-red-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customBgInput.trim()) {
                            setHeroBackgroundUrl(customBgInput.trim());
                            setCustomBgInput('');
                            setAppearanceSaved('Đã áp dụng ảnh nền từ URL!');
                            setTimeout(() => setAppearanceSaved(null), 3000);
                          }
                        }}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>

                  {/* Reset to Tuyen Quang */}
                  <button
                    type="button"
                    onClick={() => {
                      resetHeroBackground();
                      setAppearanceSaved('Đã khôi phục về ảnh nền Tuyên Quang chuẩn!');
                      setTimeout(() => setAppearanceSaved(null), 3000);
                    }}
                    className="text-xs text-slate-500 hover:text-red-700 flex items-center gap-1.5 pt-2 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục ảnh nền Tuyên Quang chuẩn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
