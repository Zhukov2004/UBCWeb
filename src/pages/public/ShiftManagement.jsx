import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, Users, Send, Shield, Sparkles, Clock, ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ShiftManagement() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  
  // State quản lý thông báo tùy chỉnh
  const [notification, setNotification] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser?.role?.toLowerCase() || '';
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    return (currentHost === 'localhost' || currentHost === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://ubc-backend-4gtj.onrender.com';
  };

  const API_URL = getApiUrl();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchShifts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/shifts`);
      const data = await res.json();
      const shiftList = Array.isArray(data) ? data : [];
      setShifts(shiftList);
      if (shiftList.length > 0 && !selectedShift) {
        setSelectedShift(shiftList[0]);
      }
    } catch (err) {
      console.error('Lỗi tải ca trực:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Kiểm tra thời hạn đăng ký: Từ 17h Thứ 7 đến 22h Chủ Nhật
  const checkRegistrationTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0: Chủ Nhật, 6: Thứ Bảy
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;

    const isSatValid = (day === 6 && totalMinutes >= 17 * 60);
    const isSunValid = (day === 0 && totalMinutes <= 22 * 60);

    return isSatValid || isSunValid;
  };

  // Gửi nguyện vọng đăng ký ca và tải lại trang
  const handleRegister = async (shiftId) => {
    if (!currentUser?.msv) {
      showNotification('Vui lòng đăng nhập tài khoản có mã sinh viên để đăng ký!', 'error');
      return;
    }

    if (!checkRegistrationTime()) {
      showNotification('Chưa đến thời gian đăng ký! Thời gian mở: Từ 17h Thứ Bảy đến 22h Chủ Nhật hàng tuần.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/shifts/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId,
          userId: currentUser._id || currentUser.id,
          msv: currentUser.msv,
          hoVaTen: currentUser.hoVaTen || currentUser.username
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      
      showNotification('Gửi nguyện vọng thành công! Đang tải lại trang...', 'success');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const getUserShiftStatus = (shift) => {
    if (!shift) return null;
    const userId = currentUser?._id || currentUser?.id;
    const msv = currentUser?.msv;

    const assigned = shift.assignedStaff?.find(a => String(a.userId) === String(userId) || a.msv === msv);
    if (assigned) return { type: 'assigned', text: `Đã phân công (${assigned.status})` };

    const requested = shift.requests?.find(r => String(r.userId) === String(userId) || r.msv === msv);
    if (requested) return { type: 'requested', text: 'Đã gửi nguyện vọng (Chờ duyệt)' };

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-bold ${
            notification.type === 'success' 
              ? 'bg-emerald-900 text-white border-emerald-700' 
              : 'bg-rose-900 text-white border-rose-700'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* THANH TIÊU ĐỀ & THÔNG BÁO THỜI HẠN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Bảng Thời Khóa Biểu Trực Thư Viện
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Lịch Trực Tuần UBC
            </h1>
          </div>
          <div className="bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wide border border-amber-200 text-center">
            ⚠️ Hạn đăng ký: Từ 17h Thứ 7 đến 22h Chủ Nhật hàng tuần
          </div>
        </div>

        {/* KHUNG CHÍNH: BÊN TRÁI LÀ TKB, BÊN PHẢI LÀ CHI TIẾT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* BÊN TRÁI: BẢNG TKB MA TRẬN */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4 overflow-x-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#800020]" /> Lịch Trực Tuần Này (Bấm vào ca để xem chi tiết)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">S: Sáng | C: Chiều</span>
            </div>

            {loading ? (
              <p className="text-center py-10 text-slate-400 text-xs">Đang tải thời khóa biểu...</p>
            ) : shifts.length > 0 ? (
              <div className="min-w-[600px] divide-y divide-slate-100">
                
                <div className="grid grid-cols-6 bg-slate-50 rounded-2xl p-3 text-center text-xs font-black text-slate-700 uppercase">
                  <div className="col-span-2 text-left pl-2">Thông tin ca</div>
                  <div>Sáng (S)</div>
                  <div>Chiều (C)</div>
                  <div>Đã Đăng Ký</div>
                  <div>Thao tác</div>
                </div>

                {shifts.map((shift) => {
                  const isSelected = selectedShift?._id === shift._id;
                  const registeredCount = shift.assignedStaff?.length || 0;
                  const requestCount = shift.requests?.length || 0;

                  return (
                    <div 
                      key={shift._id}
                      onClick={() => setSelectedShift(shift)}
                      className={`grid grid-cols-6 p-3.5 items-center text-xs font-semibold rounded-2xl transition cursor-pointer ${
                        isSelected ? 'bg-rose-50/80 border-2 border-[#800020]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="col-span-2 space-y-0.5">
                        <p className="font-bold text-slate-900">{shift.date}</p>
                        <p className="text-[11px] text-[#800020] font-black">{shift.shiftName}</p>
                      </div>

                      <div className="text-center">
                        {shift.shiftName.toLowerCase().includes('sáng') ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">x</span>
                        ) : <span className="text-slate-300">-</span>}
                      </div>

                      <div className="text-center">
                        {shift.shiftName.toLowerCase().includes('chiều') ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg">x</span>
                        ) : <span className="text-slate-300">-</span>}
                      </div>

                      <div className="text-center font-mono font-bold text-slate-700">
                        <span className="text-emerald-600">{registeredCount}</span> người
                        {requestCount > 0 && <span className="text-blue-600 text-[10px] block">(+{requestCount} chờ)</span>}
                      </div>

                      <div className="text-right">
                        <button className="px-3 py-1.5 bg-slate-100 hover:bg-[#800020] hover:text-white rounded-xl text-[11px] font-bold transition">
                          Xem <ArrowRight className="w-3 h-3 inline ml-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-10 text-slate-400 text-xs">Chưa có dữ liệu lịch trực nào.</p>
            )}
          </div>

          {/* BÊN PHẢI: BẢNG CHI TIẾT CA */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6 sticky top-24">
            
            {selectedShift ? (
              <div className="space-y-6">
                
                <div className="border-b pb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-white bg-[#800020] px-3 py-1 rounded-xl uppercase">
                      {selectedShift.date}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedShift.location || 'Thư viện UNETI'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {selectedShift.shiftName}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-50 p-4 rounded-2xl border">
                    <p className="text-2xl font-black text-[#800020]">{selectedShift.assignedStaff?.length || 0}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Đã phân công chính thức</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border">
                    <p className="text-2xl font-black text-blue-600">{selectedShift.requests?.length || 0}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Nguyện vọng chờ duyệt</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#800020]" /> Danh Sách Thành Viên Đã Đăng Ký
                  </h4>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedShift.assignedStaff?.length > 0 && selectedShift.assignedStaff.map((staff, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{staff.hoVaTen}</p>
                          <p className="text-[10px] text-slate-400">Trạng thái: <strong className="text-emerald-700">{staff.status}</strong></p>
                        </div>
                        <Shield className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}

                    {selectedShift.requests?.length > 0 && selectedShift.requests.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{req.hoVaTen}</p>
                          <p className="text-[10px] text-blue-600 font-semibold">Chờ Admin phê duyệt</p>
                        </div>
                        <Clock className="w-4 h-4 text-blue-500" />
                      </div>
                    ))}

                    {(!selectedShift.assignedStaff?.length && !selectedShift.requests?.length) && (
                      <p className="text-xs text-slate-400 text-center py-6 italic bg-slate-50 rounded-2xl">
                        Chưa có thành viên nào đăng ký ca này.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  {(() => {
                    const status = getUserShiftStatus(selectedShift);
                    if (status) {
                      return (
                        <div className="w-full py-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-2xl text-center border border-emerald-200 flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> {status.text}
                        </div>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleRegister(selectedShift._id)}
                        className="w-full py-3.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Đăng Ký Nguyện Vọng Ca Này
                      </button>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <p>Hãy bấm vào một ca trực ở bảng bên trái để xem thông tin chi tiết.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}