import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  FileText,
  Calendar,
  X,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Edit3,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Quote,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Plus
} from 'lucide-react';

const PRESET_COVERS = [
  {
    id: 'tuyenquang',
    title: 'Chuyến xe Tuyên Quang 07/04/2024',
    url: '/assets/tuyenquang-D0C5OBX9.jpg',
  },
  {
    id: 'red_stage',
    title: 'Hội trường Sắc đỏ UBC UNETI',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'library_ha8',
    title: 'Phòng đọc Thư viện HA8',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'reading_youth',
    title: 'Không gian Đọc sách & Thanh xuân',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'students_group',
    title: 'Đại gia đình Sinh viên Áo đỏ',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
  },
];

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    viewingUser,
    showProfileModal,
    setShowProfileModal,
    articles,
    reviews,
    updateUserProfile,
    uploadMemberPhoto,
    deleteMemberPhoto,
  } = useApp();

  const targetUser = viewingUser || currentUser;

  const [activeTab, setActiveTab] = useState<'profile' | 'gallery' | 'edit'>('profile');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // File input refs
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: targetUser?.name || '',
    bio: targetUser?.bio || '',
    favoriteQuote: targetUser?.favoriteQuote || '',
    phone: targetUser?.phone || '',
    faculty: targetUser?.faculty || '',
    class: targetUser?.class || '',
    campus: targetUser?.campus || 'Lĩnh Nam',
    hometown: targetUser?.hometown || '',
    facebookUrl: targetUser?.facebookUrl || '',
    zaloName: targetUser?.zaloName || '',
    hidePhone: targetUser?.privacySettings?.hidePhone ?? false,
    hideStudentId: targetUser?.privacySettings?.hideStudentId ?? false,
    hideEmail: targetUser?.privacySettings?.hideEmail ?? false,
  });

  // Sync form when targetUser changes
  React.useEffect(() => {
    if (targetUser) {
      setFormData({
        name: targetUser.name || '',
        bio: targetUser.bio || '',
        favoriteQuote: targetUser.favoriteQuote || '',
        phone: targetUser.phone || '',
        faculty: targetUser.faculty || '',
        class: targetUser.class || '',
        campus: targetUser.campus || 'Lĩnh Nam',
        hometown: targetUser.hometown || '',
        facebookUrl: targetUser.facebookUrl || '',
        zaloName: targetUser.zaloName || '',
        hidePhone: targetUser.privacySettings?.hidePhone ?? false,
        hideStudentId: targetUser.privacySettings?.hideStudentId ?? false,
        hideEmail: targetUser.privacySettings?.hideEmail ?? false,
      });
      setActiveTab('profile');
      setShowCoverPicker(false);
      setShowAvatarPicker(false);
      setShowAddPhotoModal(false);
      setLightboxIndex(null);
    }
  }, [targetUser?.id, showProfileModal]);

  if (!showProfileModal || !targetUser) return null;

  const isOwnProfile = currentUser?.id === targetUser.id;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isOwnProfile || isAdmin;

  const userPhotos = targetUser.galleryPhotos || [];
  const myArticles = articles.filter((a) => a.authorId === targetUser.id || a.authorName === targetUser.name);
  const myReviews = reviews.filter((r) => r.authorId === targetUser.id || r.authorName === targetUser.name);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateUserProfile({ coverImage: event.target.result as string }, targetUser.id);
          setShowCoverPicker(false);
          showFeedback('Đã cập nhật ảnh bìa thành công!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Avatar Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateUserProfile({ avatar: event.target.result as string }, targetUser.id);
          setShowAvatarPicker(false);
          showFeedback('Đã cập nhật ảnh đại diện thành công!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Gallery Photo Upload (Max 10)
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (userPhotos.length >= 10) {
        showFeedback('Hồ sơ đã đạt giới hạn tối đa 10 ảnh cá nhân!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = uploadMemberPhoto(event.target.result as string, targetUser.id);
          showFeedback(res.message);
          setShowAddPhotoModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const res = uploadMemberPhoto(newPhotoUrl.trim(), targetUser.id);
    showFeedback(res.message);
    setNewPhotoUrl('');
    setShowAddPhotoModal(false);
  };

  const handleDeletePhoto = (idx: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập?')) {
      const res = deleteMemberPhoto(idx, targetUser.id);
      showFeedback(res.message);
      if (lightboxIndex !== null) setLightboxIndex(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(
      {
        name: formData.name,
        bio: formData.bio,
        favoriteQuote: formData.favoriteQuote,
        phone: formData.phone,
        faculty: formData.faculty,
        class: formData.class,
        campus: formData.campus,
        hometown: formData.hometown,
        facebookUrl: formData.facebookUrl,
        zaloName: formData.zaloName,
        privacySettings: {
          hidePhone: formData.hidePhone,
          hideStudentId: formData.hideStudentId,
          hideEmail: formData.hideEmail,
        },
      },
      targetUser.id
    );
    showFeedback('Cập nhật thông tin hồ sơ thành công!');
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl relative max-h-[94vh] overflow-y-auto border border-red-100 flex flex-col">
        
        {/* Floating Close Button */}
        <button
          onClick={() => setShowProfileModal(false)}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md cursor-pointer"
          title="Đóng trang cá nhân"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-emerald-700 text-white px-5 py-2 rounded-full shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* 1. COVER PHOTO BANNER */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 shrink-0 overflow-hidden group">
          <img
            src={targetUser.coverImage || '/assets/tuyenquang-D0C5OBX9.jpg'}
            alt="Ảnh bìa hồ sơ"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Badge: Trực thuộc Trung tâm Thư viện UNETI */}
          <div className="absolute top-4 left-4 z-20">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/50 text-white border border-white/20 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
              CLB Sách UNETI • {targetUser.gen || 'Thế hệ Gen'}
            </span>
          </div>

          {/* Cover Photo Customizer Button (Owner/Admin) */}
          {canEdit && (
            <div className="absolute bottom-3 right-3 z-20">
              <button
                onClick={() => setShowCoverPicker(!showCoverPicker)}
                className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white border border-white/30 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-yellow-300" />
                <span>Đổi ảnh bìa</span>
              </button>
            </div>
          )}
        </div>

        {/* Cover Picker Dropdown/Modal */}
        {showCoverPicker && canEdit && (
          <div className="p-4 bg-slate-900 text-white border-b border-red-900/60 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Tùy chỉnh ảnh bìa trang cá nhân</span>
              </h4>
              <button
                onClick={() => setShowCoverPicker(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    updateUserProfile({ coverImage: preset.url }, targetUser.id);
                    setShowCoverPicker(false);
                    showFeedback('Đã đổi ảnh bìa thành công!');
                  }}
                  className={`relative rounded-xl overflow-hidden border text-left p-1 text-[10px] transition ${
                    targetUser.coverImage === preset.url
                      ? 'border-yellow-400 ring-2 ring-yellow-400'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-12 object-cover rounded-lg mb-1" />
                  <span className="block truncate text-slate-300 font-semibold">{preset.title}</span>
                </button>
              ))}
            </div>

            {/* Upload from file */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="file"
                ref={coverFileInputRef}
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <button
                onClick={() => coverFileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy tính</span>
              </button>

              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Hoặc dán URL ảnh bìa (https://...)"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400"
                />
                <button
                  onClick={() => {
                    if (customCoverUrl.trim()) {
                      updateUserProfile({ coverImage: customCoverUrl.trim() }, targetUser.id);
                      setCustomCoverUrl('');
                      setShowCoverPicker(false);
                      showFeedback('Đã đổi ảnh bìa thành công!');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. AVATAR & HEADER INFO BAR */}
        <div className="px-6 sm:px-8 pt-0 pb-4 border-b border-slate-100 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            
            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              {canEdit && (
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-1 right-1 p-2 rounded-2xl bg-red-700 hover:bg-red-800 text-white shadow-md border-2 border-white transition cursor-pointer"
                  title="Đổi ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5 text-yellow-300" />
                </button>
              )}
            </div>

            {/* Quick Actions (Switch tabs) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Hồ sơ thành viên
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                <span>Ảnh cá nhân ({userPhotos.length}/10)</span>
              </button>

              {canEdit && (
                <button
                  onClick={() => setActiveTab(activeTab === 'edit' ? 'profile' : 'edit')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'edit'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{activeTab === 'edit' ? 'Xem hồ sơ' : 'Sửa hồ sơ'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Avatar Picker Form */}
          {showAvatarPicker && canEdit && (
            <div className="mb-4 p-3 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="file"
                ref={avatarFileInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => avatarFileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Chọn ảnh từ máy</span>
              </button>
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Hoặc dán URL ảnh đại diện..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      updateUserProfile({ avatar: customAvatarUrl.trim() }, targetUser.id);
                      setCustomAvatarUrl('');
                      setShowAvatarPicker(false);
                      showFeedback('Đã cập nhật ảnh đại diện!');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Lưu
                </button>
              </div>
            </div>
          )}

          {/* Name & Identity Badges */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-title">
                {targetUser.name}
              </h2>
              <span className="text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full">
                {targetUser.gen || 'UBC'}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                targetUser.role === 'admin'
                  ? 'bg-red-700 text-white'
                  : targetUser.role === 'moderator'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {targetUser.role === 'admin' ? 'Ban Quản trị (Admin)' : targetUser.role === 'moderator' ? 'Ban Biên tập' : 'Thành viên'}
              </span>
              {targetUser.position && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  ★ {targetUser.position}
                </span>
              )}
            </div>

            <p className="text-xs text-red-800 font-bold">
              {targetUser.department} • Khoa: {targetUser.faculty || 'ĐH Kinh tế - Kỹ thuật Công nghiệp'} • Cơ sở: {targetUser.campus || 'Hà Nội'}
            </p>
          </div>
        </div>

        {/* 3. MAIN BODY TAB CONTENT */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* TAB 1: PROFILE OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Inspirational Quote Card */}
              {targetUser.favoriteQuote && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-red-700 text-yellow-300 shrink-0 shadow-xs">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-800 block">
                      Châm ngôn yêu thích
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 italic mt-0.5 leading-relaxed">
                      "{targetUser.favoriteQuote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Bio & Intro */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Giới thiệu bản thân:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {targetUser.bio || 'Chưa cập nhật phần giới thiệu cá nhân.'}
                </p>
              </div>

              {/* Personal Details Grid */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Thông tin sinh viên & Học tập:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Mã sinh viên (UNETI):</span>
                    <span className="font-bold font-mono text-slate-900">
                      {targetUser.privacySettings?.hideStudentId && !isOwnProfile && !isAdmin
                        ? `${targetUser.studentId?.substring(0, 4)}***** (Đã ẩn)`
                        : targetUser.studentId || 'Chưa cấp'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Lớp sinh hoạt:</span>
                    <span className="font-bold text-slate-900">{targetUser.class || 'N/A'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Cơ sở đào tạo:</span>
                    <span className="font-bold text-slate-900">{targetUser.campus || 'Minh Khai / Lĩnh Nam'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Quê quán:</span>
                    <span className="font-bold text-slate-900">{targetUser.hometown || 'Chưa cập nhật'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="font-bold text-slate-900">
                      {targetUser.privacySettings?.hidePhone && !isOwnProfile && !isAdmin
                        ? `${targetUser.phone?.substring(0, 4)}*** (Bảo mật)`
                        : targetUser.phone || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Ngày gia nhập CLB:</span>
                    <span className="font-bold text-slate-900">{targetUser.joinedAt || '21/04/2018'}</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              {(targetUser.facebookUrl || targetUser.zaloName) && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {targetUser.facebookUrl && (
                    <a
                      href={targetUser.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition"
                    >
                      <span>Facebook cá nhân</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {targetUser.zaloName && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
                      <span>Zalo: {targetUser.zaloName}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Mini Preview of Personal Photos (Up to 10 photos) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-700" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Bộ sưu tập ảnh cá nhân ({userPhotos.length}/10 ảnh)
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="text-xs text-red-700 font-bold hover:underline cursor-pointer"
                  >
                    Xem tất cả ảnh →
                  </button>
                </div>

                {userPhotos.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-400 border border-dashed border-slate-200">
                    Thành viên chưa tải lên ảnh cá nhân nào.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {userPhotos.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveTab('gallery');
                          setLightboxIndex(i);
                        }}
                        className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-2xs relative group cursor-pointer bg-slate-900"
                      >
                        <img
                          src={img}
                          alt={`Ảnh cá nhân ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                          Xem ảnh
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL PHOTO ALBUM (UP TO 10 PHOTOS) */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-red-700" />
                    <span>Bộ Sưu Tập Ảnh Cá Nhân • {targetUser.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mỗi thành viên được tải lên tối đa <strong className="text-red-700 font-bold">10 ảnh</strong> hoạt động, sự kiện và kỷ niệm cùng CLB.
                  </p>
                </div>

                {/* Add Photo Button (Owner/Admin) */}
                {canEdit && (
                  <button
                    onClick={() => {
                      if (userPhotos.length >= 10) {
                        showFeedback('Hồ sơ đã đạt tối đa 10 ảnh!');
                        return;
                      }
                      setShowAddPhotoModal(true);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                      userPhotos.length >= 10
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-red-700 hover:bg-red-800 text-white shadow-red-700/20'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm ảnh ({userPhotos.length}/10)</span>
                  </button>
                )}
              </div>

              {/* Photo Count Status Indicator */}
              <div className="flex items-center justify-between text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-600">
                  Số lượng ảnh đã tải lên: <strong className="text-red-800 font-bold">{userPhotos.length} / 10 ảnh</strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  {10 - userPhotos.length > 0 ? `Còn trống ${10 - userPhotos.length} ảnh` : 'Đã đạt giới hạn tối đa'}
                </span>
              </div>

              {/* Photo Grid */}
              {userPhotos.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
                  <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Chưa có ảnh nào trong bộ sưu tập</p>
                  {canEdit && (
                    <button
                      onClick={() => setShowAddPhotoModal(true)}
                      className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold"
                    >
                      Tải lên ảnh đầu tiên
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {userPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-900"
                    >
                      <img
                        src={photo}
                        alt={`Ảnh kỷ niệm ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => setLightboxIndex(index)}
                      />

                      {/* Photo Index Badge */}
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {index + 1}/10
                      </span>

                      {/* Delete Button (Owner/Admin) */}
                      {canEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(index);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-700/80 hover:bg-red-800 text-white opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* View Large Overlay */}
                      <div
                        onClick={() => setLightboxIndex(index)}
                        className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition text-[11px] text-white text-center font-semibold cursor-pointer"
                      >
                        Phóng to ảnh
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EDIT PROFILE FORM (OWNER/ADMIN) */}
          {activeTab === 'edit' && canEdit && (
            <form onSubmit={handleSaveProfile} className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-600" />
                    <span>Tùy Biến Chỉnh Sửa Hồ Sơ Cá Nhân</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật thông tin, ảnh bìa, ảnh đại diện và quyền riêng tư hiển thị.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-700/20 cursor-pointer"
                >
                  Lưu thay đổi hồ sơ
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khoa / Viện đào tạo
                  </label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp sinh hoạt
                  </label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cơ sở học tập
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  >
                    <option value="Minh Khai">Cơ sở 454 Minh Khai (Hà Nội)</option>
                    <option value="Lĩnh Nam">Cơ sở 218 Lĩnh Nam (Hà Nội)</option>
                    <option value="Nam Định">Cơ sở 353 Trần Hưng Đạo (Nam Định)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quê quán
                  </label>
                  <input
                    type="text"
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Châm ngôn / Câu nói yêu thích
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đọc sách để nâng cao tri thức, hành động để phụng sự cộng đồng."
                    value={formData.favoriteQuote}
                    onChange={(e) => setFormData({ ...formData, favoriteQuote: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới thiệu bản thân (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đường dẫn Facebook cá nhân
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên hiển thị Zalo
                  </label>
                  <input
                    type="text"
                    value={formData.zaloName}
                    onChange={(e) => setFormData({ ...formData, zaloName: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
                  />
                </div>
              </div>

              {/* Privacy settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Cài đặt quyền riêng tư:
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hidePhone}
                    onChange={(e) => setFormData({ ...formData, hidePhone: e.target.checked })}
                    className="rounded text-red-700"
                  />
                  <span>Ẩn số điện thoại với thành viên khác</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hideStudentId}
                    onChange={(e) => setFormData({ ...formData, hideStudentId: e.target.checked })}
                    className="rounded text-red-700"
                  />
                  <span>Ẩn Mã sinh viên (chỉ hiển thị 4 chữ số đầu)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-700/20 cursor-pointer"
                >
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* 4. MODAL: ADD PHOTO (UP TO 10 PHOTOS) */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-red-200">
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-700" />
              <span>Thêm ảnh vào bộ sưu tập ({userPhotos.length}/10)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mỗi thành viên được tải lên tối đa 10 bức ảnh kỷ niệm cùng CLB.
            </p>

            {/* Option A: Upload local file */}
            <div className="mb-4">
              <input
                type="file"
                ref={galleryFileInputRef}
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-red-400 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-800 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Chọn tệp ảnh từ máy tính (PNG, JPG)</span>
              </button>
            </div>

            {/* Option B: Add by URL */}
            <form onSubmit={handleAddPhotoByUrl} className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hoặc dán URL ảnh trực tiếp:
              </span>
              <input
                type="url"
                placeholder="https://example.com/anh-sinh-hoat.jpg"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-600"
              />
              <button
                type="submit"
                disabled={!newPhotoUrl.trim()}
                className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Thêm ảnh vào bộ sưu tập
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. LIGHTBOX MODAL: FULL RESOLUTION PHOTO VIEWER */}
      {lightboxIndex !== null && userPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white pb-3">
              <span className="text-xs font-bold tracking-wider">
                Ảnh {lightboxIndex + 1} / {userPhotos.length} • {targetUser.name}
              </span>

              <div className="flex items-center gap-2">
                {canEdit && (
                  <button
                    onClick={() => handleDeletePhoto(lightboxIndex)}
                    className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh</span>
                  </button>
                )}
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Stage */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={userPhotos[lightboxIndex]}
                alt={`Ảnh ${lightboxIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />

              {/* Prev / Next controls */}
              {userPhotos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxIndex((lightboxIndex - 1 + userPhotos.length) % userPhotos.length)
                    }
                    className="absolute left-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % userPhotos.length)}
                    className="absolute right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {userPhotos.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full p-1">
                {userPhotos.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      lightboxIndex === idx ? 'border-yellow-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
