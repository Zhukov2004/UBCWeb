import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  X,
  ShieldCheck,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    register,
    quickSwitchUser,
  } = useApp();

  const [loginCredential, setLoginCredential] = useState<string>('21109100115'); // Nguyễn Văn Thiện (Admin)
  const [loginPassword, setLoginPassword] = useState<string>('12345678'); // Mật khẩu đăng nhập
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register Form (Keyed by Student ID)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    faculty: 'Khoa Công nghệ Thông tin',
    class: '',
    gen: 'Gen 7',
    department: 'Ban Văn Hoá Đọc',
    motivation: '',
  });

  const [regResult, setRegResult] = useState<{ message: string; success: boolean } | null>(null);

  if (!showAuthModal) return null;

  // Xử lý Đăng Nhập gọi qua API Backend Node.js / MongoDB
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msv: loginCredential, // Dùng mã sinh viên làm trường định danh chính
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!');
      }

      // Lưu trữ Token và thông tin user vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setLoginSuccess(data.message || 'Đăng nhập thành công!');
      
      setTimeout(() => {
        setShowAuthModal(false);
        setLoginSuccess(null);
        window.location.reload(); // Tải lại trang để cập nhật trạng thái đăng nhập
      }, 1200);

    } catch (err: any) {
      setLoginError(err.message || 'Không thể kết nối đến máy chủ backend.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegResult(null);

    if (!regForm.name || !regForm.email || !regForm.studentId || !regForm.motivation) {
      setRegResult({
        success: false,
        message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)',
      });
      return;
    }

    const res = register(regForm);
    setRegResult(res);

    if (res.success) {
      // Clear form
      setRegForm({
        name: '',
        email: '',
        studentId: '',
        phone: '',
        faculty: 'Khoa Công nghệ Thông tin',
        class: '',
        gen: 'Gen 7',
        department: 'Ban Văn Hoá Đọc',
        motivation: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-red-100">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-md shadow-red-700/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 font-serif-title uppercase">
              UNETI BOOK CLUB
            </h3>
            <p className="text-[11px] text-slate-400">Hệ thống phân quyền & định danh sinh viên</p>
          </div>
        </div>

        {/* Tabs: Đăng nhập vs Đăng ký */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              authModalMode === 'login'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setRegResult(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              authModalMode === 'register'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký Tài Khoản Bằng Mã SV
          </button>
        </div>

        {/* MODE 1: LOGIN */}
        {authModalMode === 'login' && (
          <div>
            <div className="mb-4">
              <h4 className="text-base font-bold text-slate-900">Đăng Nhập Tài Khoản</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập <span className="font-semibold text-red-700">Mã sinh viên</span> hoặc Email UNETI của bạn để đăng nhập.
              </p>
            </div>

            {/* Notifications for status */}
            {loginError && (
              <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{loginError}</div>
              </div>
            )}

            {loginSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã sinh viên hoặc Email đăng ký *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginCredential}
                    onChange={(e) => setLoginCredential(e.target.value)}
                    placeholder="VD: 21109100115 hoặc email@uneti.edu.vn"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50 font-medium"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Đăng nhập bằng Mã sinh viên được cấp khi tham gia CLB hoặc email sinh viên.
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Mật khẩu</label>
                  <span className="text-[11px] text-red-700 font-semibold cursor-pointer hover:underline">
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-red-700/20 active:scale-98 cursor-pointer"
              >
                Đăng Nhập
              </button>
            </form>

            {/* Quick Demo Switcher Section (Test roles directly) */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Đăng nhập nhanh 1-Click để kiểm tra phân quyền:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Admin 1 */}
                <button
                  type="button"
                  onClick={() => {
                    quickSwitchUser('ubc-thien-nv');
                    setShowAuthModal(false);
                  }}
                  className="p-2.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-left transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-red-700 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-red-950 flex items-center gap-1">
                      <span>Admin</span>
                      <span className="text-[9px] bg-red-700 text-white px-1 rounded">Chủ nhiệm</span>
                    </div>
                    <div className="text-[10px] text-red-700 font-medium">Nguyễn Văn Thiện</div>
                    <div className="text-[9px] text-slate-500 font-mono">MSV: 21109100115</div>
                  </div>
                </button>

                {/* Normal Member */}
                <button
                  type="button"
                  onClick={() => {
                    quickSwitchUser('ubc-an-vn');
                    setShowAuthModal(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span>Thành viên</span>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1 rounded">Member</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">Vũ Như An</div>
                    <div className="text-[9px] text-slate-500 font-mono">MSV: 22174600046</div>
                  </div>
                </button>
              </div>

              <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">Ghi chú phân quyền:</span> Chỉ tài khoản <span className="font-bold text-red-700">Admin</span> mới có quyền đổi logo, đổi ảnh nền index và truy cập quản trị CLB. Tài khoản <span className="font-bold">Thành viên bình thường</span> không có các quyền này.
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: REGISTER */}
        {authModalMode === 'register' && (
          <div>
            <div className="mb-4">
              <h4 className="text-base font-bold text-slate-900">Đăng Ký Thành Viên Bằng Mã Sinh Viên</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tài khoản thành viên được quản lý và định danh qua <span className="font-bold text-red-700">Mã sinh viên UNETI</span>. Sau khi đăng ký, đơn sẽ được gửi tới Ban Chủ nhiệm phê duyệt.
              </p>
            </div>

            {regResult && (
              <div
                className={`mb-4 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                  regResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                {regResult.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {regResult.success ? 'Đã tiếp nhận đơn đăng ký!' : 'Chưa thể gửi đơn'}
                  </div>
                  <div className="mt-0.5 leading-relaxed">{regResult.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn Anh"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã sinh viên UNETI *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 24103100123"
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50 font-mono font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp sinh hoạt</label>
                  <input
                    type="text"
                    placeholder="VD: DHKTP18A1HN"
                    value={regForm.class}
                    onChange={(e) => setRegForm({ ...regForm, class: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên *</label>
                  <input
                    type="email"
                    placeholder="sv@uneti.edu.vn"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="09XXXXXXXX"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khoa / Viện</label>
                  <select
                    value={regForm.faculty}
                    onChange={(e) => setRegForm({ ...regForm, faculty: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  >
                    <option value="Khoa Công nghệ Thông tin">Khoa CNTT</option>
                    <option value="Khoa Ngoại Ngữ">Khoa Ngoại Ngữ</option>
                    <option value="Khoa Kế toán - Kiểm toán">Khoa Kế toán - Kiểm toán</option>
                    <option value="Khoa Quản trị và Marketing">Khoa Quản trị và Marketing</option>
                    <option value="Khoa Cơ khí">Khoa Cơ khí</option>
                    <option value="Khoa Điện - Điện tử">Khoa Điện - Điện tử</option>
                    <option value="Khoa Dệt may và Thời trang">Khoa Dệt may và Thời trang</option>
                    <option value="Khoa Thương mại">Khoa Thương mại</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ban nguyện vọng</label>
                  <select
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  >
                    <option value="Ban Văn Hoá Đọc">Ban Văn Hoá Đọc</option>
                    <option value="Ban Truyền thông">Ban Truyền thông</option>
                    <option value="Ban Hậu cần">Ban Hậu cần</option>
                    <option value="Ban Đào Tạo">Ban Đào Tạo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lý do muốn gia nhập & Giới thiệu bản thân *
                </label>
                <textarea
                  rows={3}
                  placeholder="Chia sẻ về sở thích đọc sách, kinh nghiệm hoặc mong muốn đóng góp cho CLB UBC..."
                  value={regForm.motivation}
                  onChange={(e) => setRegForm({ ...regForm, motivation: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 bg-slate-50"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-red-700/20 active:scale-98 cursor-pointer"
                >
                  Gửi Đơn Đăng Ký (Theo Mã SV)
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 mt-2">
                🔒 Tài khoản sau khi đăng ký sẽ ở trạng thái chờ duyệt. Ban Chủ nhiệm sẽ duyệt đơn trong cổng quản trị.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};