import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Users, ShieldAlert, ChevronDown, Award, Settings, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // States điều khiển hiển thị Menu xổ xuống (Dropdown)
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const membersRef = useRef(null);
  const adminRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Đọc user từ localStorage
  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Lỗi đọc thông tin user:', err);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  // Đóng dropdown khi click ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (membersRef.current && !membersRef.current.contains(event.target)) {
        setIsMembersDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng dropdown khi đổi trang
  useEffect(() => {
    setIsMembersDropdownOpen(false);
    setIsAdminDropdownOpen(false);
  }, [location.pathname]);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
    window.location.reload();
  };

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo và Tên CLB */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#800020]/10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src="/logoclb.jpg" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-[#800020] font-black text-sm">UBC</span>';
              }}
            />
          </div>
          <span className="text-xl font-black text-[#800020] uppercase tracking-tight">
            UNETI Book Club
          </span>
        </Link>

        {/* Các liên kết menu chính */}
        <div className="hidden md:flex items-center gap-3 text-sm font-semibold text-slate-700">
          <Link 
            to="/" 
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/') ? 'bg-[#800020] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang chủ
          </Link>
          <Link 
            to="/about" 
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/about') ? 'bg-[#800020] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Giới thiệu
          </Link>

          {/* MENU XỔ XUỐNG: THÀNH VIÊN & BAN CHỦ NHIỆM */}
          <div className="relative" ref={membersRef}>
            <button
              onClick={() => setIsMembersDropdownOpen(!isMembersDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive('/members') || location.pathname.startsWith('/core-team') ? 'bg-[#800020] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" /> Thành viên <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMembersDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMembersDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link 
                  to="/members" 
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-400" /> Tất cả Thành viên
                </Link>
                <div className="my-1 border-t border-slate-100"></div>
                <div className="px-4 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Ban Chủ Nhiệm Các Thế Hệ</div>
                <Link 
                  to="/core-team/4" 
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Ban Chủ Nhiệm Gen 4
                </Link>
                <Link 
                  to="/core-team/3" 
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Ban Chủ Nhiệm Gen 3
                </Link>
                <Link 
                  to="/core-team/2" 
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Ban Chủ Nhiệm Gen 2
                </Link>
              </div>
            )}
          </div>

          {/* MENU XỔ XUỐNG: QUẢN TRỊ ADMIN */}
          {isAdmin && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Quản trị <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAdminDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link 
                    to="/admin/members" 
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-amber-600" /> Quản lý Thành viên
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#800020] transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-indigo-600" /> Quản lý Tài khoản
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Khu vực hiển thị tài khoản cá nhân / Đăng nhập */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.hoVaTen ? currentUser.hoVaTen.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium leading-none">Xin chào,</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.hoVaTen}</p>
              </div>
              <button 
                onClick={handleLogout}
                title="Đăng xuất"
                className="ml-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-5 py-2.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Đăng Nhập
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}