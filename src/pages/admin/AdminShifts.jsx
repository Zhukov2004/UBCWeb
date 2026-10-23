import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trash2, Plus, Shield, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AdminShifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDate, setNewDate] = useState('');
  const [newShiftName, setNewShiftName] = useState('');

  const [notification, setNotification] = useState(null);

  const currentHost = window.location.hostname;
  const API_URL = (currentHost === 'localhost' || currentHost === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://ubc-backend-4gtj.onrender.com';

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
      setShifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/shifts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, shiftName: newShiftName })
      });
      if (!res.ok) throw new Error('Không thể tạo ca trực');
      
      showNotification('Tạo ca trực thành công!', 'success');
      setNewDate('');
      setNewShiftName('');
      fetchShifts();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleAssign = async (shiftId, reqItem) => {
    try {
      const res = await fetch(`${API_URL}/api/shifts/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId,
          userId: reqItem.userId,
          msv: reqItem.msv,
          hoVaTen: reqItem.hoVaTen
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      showNotification('Đã phân công thành viên thành công!', 'success');
      fetchShifts();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleUpdateStatus = async (shiftId, staffId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/shifts/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, staffId, status })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      
      showNotification('Cập nhật trạng thái thành công!', 'success');
      fetchShifts();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans relative text-sm">
      
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
              className="ml-2 p-1 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#800020] uppercase">Quản Trị Phân Công Lịch Trực</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Tổng hợp nguyện vọng và phân công lịch trực cho thành viên.</p>
          </div>
        </div>

        {/* Form tạo ca trực */}
        <form onSubmit={handleCreateShift} className="bg-white p-6 rounded-3xl border shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Ngày trực</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Tên ca / Thời gian</label>
            <input type="text" placeholder="VD: Ca sáng (08h - 11h30)" value={newShiftName} onChange={e => setNewShiftName(e.target.value)} required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5 transition">
            <Plus className="w-4 h-4" /> Thêm Ca Trực
          </button>
        </form>

        {/* Danh sách các ca trực và tổng hợp nguyện vọng */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-slate-400 text-xs font-medium">Đang tải danh sách ca trực...</div>
          ) : shifts.length > 0 ? (
            shifts.map((shift) => (
              <div key={shift._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">Ngày: {shift.date}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">{shift.shiftName}</h3>
                  </div>
                  <div className="text-right text-xs font-bold text-slate-600">
                    Đã phân công: <span className="text-[#800020]">{shift.assignedStaff?.length || 0}</span> thành viên
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cột 1: Nguyện vọng đăng ký */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" /> Nguyện Vọng Đăng Ký ({shift.requests?.length || 0})
                    </h4>
                    {shift.requests?.length > 0 ? (
                      <div className="space-y-2.5">
                        {shift.requests.map((req) => (
                          <div key={req._id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{req.hoVaTen}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">MSV: {req.msv}</p>
                            </div>
                            <button 
                              onClick={() => handleAssign(shift._id, req)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition"
                            >
                              Phân công +
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-slate-400 italic py-6 text-center">Chưa có ai đăng ký nguyện vọng ca này.</p>
                    )}
                  </div>

                  {/* Cột 2: Phân công chính thức */}
                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" /> Danh Sách Phân Công Chính Thức
                    </h4>
                    {shift.assignedStaff?.length > 0 ? (
                      <div className="space-y-2.5">
                        {shift.assignedStaff.map((staff) => (
                          <div key={staff._id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-100 text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{staff.hoVaTen}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">
                                MSV: {staff.msv} • <span className="text-emerald-700 font-bold">{staff.status}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleUpdateStatus(shift._id, staff._id, 'Đã đến')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer transition"
                                title="Đã đến"
                              >
                                ✓ Đã đến
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(shift._id, staff._id, 'Vắng mặt')}
                                className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold cursor-pointer transition"
                                title="Vắng"
                              >
                                ✕ Vắng
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(shift._id, staff._id, 'remove')}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition"
                                title="Xóa khỏi ca"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-slate-400 italic py-6 text-center">Chưa phân công thành viên nào.</p>
                    )}
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border text-center text-slate-400 text-xs font-medium">
              Chưa có ca trực nào được tạo trên hệ thống.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}