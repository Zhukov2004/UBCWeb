import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Users, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Hàm đọc user từ localStorage
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

    // Lắng nghe sự thay đổi của localStorage (khi vừa đăng nhập xong ở trang khác)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]); // Chạy lại mỗi khi đổi đường dẫn (ví dụ từ trang login về trang chủ)

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
    window.location.reload(); // Ép làm mới toàn bộ trang để reset sạch sẽ state
  };

  // Kiểm tra xem user hiện tại có phải là admin hay không
  // (Tùy thuộc vào cách backend trả về, thông thường là currentUser.role === 'admin')
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

        {/* Các liên kết menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-slate-700">
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
          <Link 
            to="/members" 
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive('/members') ? 'bg-[#800020] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> Thành viên
          </Link>

          {/* HIỂN THỊ LINK QUẢN TRỊ TRÊN MENU NẾU LÀ ADMIN */}
          {isAdmin && (
  <div className="flex items-center gap-2">
    <Link 
      to="/admin/members" 
      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
    >
      ⚙️ Quản lý Thành viên
    </Link>
    <Link 
      to="/admin/users" 
      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
    >
      👤 Quản lý Tài khoản
    </Link>
  </div>
)}
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