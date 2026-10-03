import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Users } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem tab hiện tại có đang được chọn không
  const isActive = (path) => location.pathname === path;

  // Kiểm tra thông tin người dùng từ localStorage khi Navbar được tải
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Lỗi đọc thông tin user:', err);
      }
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
    window.location.reload(); // Làm mới trang để cập nhật lại giao diện
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo và Tên CLB */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* KHUNG LOGO - Bạn có thể thay src bằng file ảnh logo của bạn (ví dụ: /logo.png hoặc import logo) */}
          <div className="w-10 h-10 rounded-xl bg-[#800020]/10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src="/logoclb.jpg" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Nếu chưa có file logo.png thì hiển thị chữ cái đầu thay thế tạm thời
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-[#800020] font-black text-sm">UBC</span>';
              }}
            />
          </div>
          <span className="text-xl font-black text-[#800020] uppercase tracking-tight">
            UNETI Book Club
          </span>
        </Link>

        {/* Các liên kết menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-slate-700">
          <Link 
            to="/" 
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/') 
                ? 'bg-[#800020] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang chủ
          </Link>

          <Link 
            to="/about" 
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/about') 
                ? 'bg-[#800020] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Giới thiệu
          </Link>

          <Link 
            to="/members" 
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/members') 
                ? 'bg-[#800020] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> Thành viên
          </Link>
        </div>

        {/* Khu vực hiển thị tài khoản */}
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
                className="ml-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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