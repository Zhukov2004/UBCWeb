import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Login() {
  const [msv, setMsv] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msv, password })
    });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại!');
      }

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert(`Chào mừng ${data.user.hoVaTen} đăng nhập thành công!`);

      // Luôn chuyển hướng về trang chủ
      navigate('/');

    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ Backend!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-[#800020] hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cổng Đăng Nhập UBC</h2>
            <p className="text-xs text-slate-500">Xác thực tài khoản thành viên qua MongoDB</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mã Sinh Viên (MSV)</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={msv}
                  onChange={(e) => setMsv(e.target.value)}
                  placeholder="VD: ADMIN001 hoặc mã sinh viên của bạn" 
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#800020] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#800020] transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#800020] hover:bg-[#600018] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
}