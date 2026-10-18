import React, { useState, useEffect } from 'react';
import { User, Lock, Upload, Save, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'password'

  // States form thông tin cá nhân
  const [formData, setFormData] = useState({
    hoVaTen: '', msv: '', ban: '', khoa: '', nganh: '',
    lop: '', ngaySinh: '', que: '', facebook: '', mailTruong: '', anhThe: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // States form đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    return (currentHost === 'localhost' || currentHost === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://ubc-backend-4gtj.onrender.com';
  };

  const getMemberAvatar = (anhThe) => {
    if (!anhThe) return null;
    if (anhThe.startsWith('http')) return anhThe;
    return `${getApiUrl()}${anhThe}`;
  };

  // Tải thông tin tài khoản cá nhân
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setCurrentUser(userObj);
        
        // Gọi API lấy dữ liệu chi tiết mới nhất
        fetch(`${getApiUrl()}/api/profile/me/${userObj._id || userObj.id}`)
          .then(res => res.json())
          .then(data => {
            if (data) {
              setFormData({
                hoVaTen: data['Họ và tên'] || data.hoVaTen || data.username || '',
                msv: data['Mã SV'] || data.msv || '',
                ban: data.ban || data.Ban || '',
                khoa: data.khoa || data.Khoa || '',
                nganh: data.nganh || data.Nganh || '',
                lop: data.lop || data.Lop || '',
                ngaySinh: data.ngaySinh || data['Ngày sinh'] || '',
                que: data.que || data['Quê'] || '',
                facebook: data.facebook || data.Facebook || '',
                mailTruong: data.email || data.mailTruong || '',
                anhThe: data['Ảnh thẻ'] || data.anhThe || ''
              });
            }
          })
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Xử lý chọn ảnh đại diện từ máy tính/điện thoại
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('hoVaTen', formData.hoVaTen);
      data.append('msv', formData.msv);
      data.append('ban', formData.ban);
      data.append('khoa', formData.khoa);
      data.append('nganh', formData.nganh);
      data.append('lop', formData.lop);
      data.append('ngaySinh', formData.ngaySinh);
      data.append('que', formData.que);
      data.append('facebook', formData.facebook);

      if (selectedFile) {
        data.append('anhThe', selectedFile);
      }

      const userId = currentUser._id || currentUser.id;
      const res = await fetch(`${getApiUrl()}/api/profile/me/${userId}`, {
        method: 'PUT',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại');

      // Đội dữ liệu mới vào localStorage
      const updatedUserObj = { ...currentUser, ...result.user, hoVaTen: formData.hoVaTen };
      localStorage.setItem('user', JSON.stringify(updatedUserObj));
      window.dispatchEvent(new Event('storage'));

      setMessage({ type: 'success', text: 'Đã cập nhật thông tin thành công!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // Tự đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp!' });
      return;
    }

    try {
      const userId = currentUser._id || currentUser.id;
      const res = await fetch(`${getApiUrl()}/api/accounts/${userId}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Đổi mật khẩu thất bại');

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-semibold">Đang tải hồ sơ cá nhân...</div>;
  if (!currentUser) return <div className="text-center py-20 text-rose-600 font-semibold">Vui lòng đăng nhập để xem thông tin này!</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Card Header Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            {(previewUrl || getMemberAvatar(formData.anhThe)) ? (
              <img 
                src={previewUrl || getMemberAvatar(formData.anhThe)} 
                alt="" 
                onError={(e) => { e.target.style.display = 'none'; }}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#800020] shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-amber-50 text-[#800020] font-black text-3xl flex items-center justify-center border-2 border-amber-200 shadow-md">
                {formData.hoVaTen?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-black text-slate-900">{formData.hoVaTen || 'Thành viên'}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">{formData.mailTruong}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                MSV: {formData.msv || '---'}
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold uppercase">
                Vai trò: {currentUser.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Chuyển đổi giữa 2 Tab */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setActiveTab('info'); setMessage({ type: '', text: '' }); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'info' ? 'bg-[#800020] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Cập nhật thông tin
          </button>
          <button
            onClick={() => { setActiveTab('password'); setMessage({ type: '', text: '' }); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'password' ? 'bg-[#800020] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" /> Đổi mật khẩu
          </button>
        </div>

        {/* Thông báo kết quả */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl font-bold text-xs shadow-sm flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* TAB 1: FORM CẬP NHẬT THÔNG TIN */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">Ảnh thẻ / Ảnh đại diện</label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4 text-[#800020]" />
                  <span>{selectedFile ? selectedFile.name : 'Tải ảnh mới từ thiết bị / điện thoại'}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
                  <input type="text" value={formData.hoVaTen} onChange={(e) => setFormData({...formData, hoVaTen: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã sinh viên (MSV)</label>
                  <input type="text" value={formData.msv} onChange={(e) => setFormData({...formData, msv: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ban hoạt động</label>
                  <input type="text" value={formData.ban} onChange={(e) => setFormData({...formData, ban: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khoa</label>
                  <input type="text" value={formData.khoa} onChange={(e) => setFormData({...formData, khoa: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngành</label>
                  <input type="text" value={formData.nganh} onChange={(e) => setFormData({...formData, nganh: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp</label>
                  <input type="text" value={formData.lop} onChange={(e) => setFormData({...formData, lop: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
                  <input type="text" value={formData.ngaySinh} onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quê quán</label>
                  <input type="text" value={formData.que} onChange={(e) => setFormData({...formData, que: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link Facebook cá nhân</label>
                  <input type="text" value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer">
                  <Save className="w-4 h-4" /> Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: FORM ĐỔI MẬT KHẨU */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại *</label>
                <input 
                  type="password" 
                  required 
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự) *</label>
                <input 
                  type="password" 
                  required 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <input 
                  type="password" 
                  required 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer">
                  <KeyRound className="w-4 h-4" /> Đổi mật khẩu ngay
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}