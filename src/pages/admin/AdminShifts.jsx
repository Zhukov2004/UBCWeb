import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Trash2, Plus, Shield } from 'lucide-react';

export default function AdminShifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form tạo ca mới
  const [newDate, setNewDate] = useState('');
  const [newShiftName, setNewShiftName] = useState('');
  const [newMaxSlots, setNewMaxSlots] = useState(5);

  const currentHost = window.location.hostname;
  const API_URL = (currentHost === 'localhost' || currentHost === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://ubc-backend-4gtj.onrender.com';

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

  // Tạo ca trực mới
  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/shifts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, shiftName: newShiftName, maxSlots: newMaxSlots })
      });
      if (!res.ok) throw new Error('Không thể tạo ca trực');
      alert('Tạo ca trực thành công!');
      setNewDate('');
      setNewShiftName('');
      fetchShifts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Phân công thành viên từ danh sách đăng ký vào danh sách chính thức
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
      fetchShifts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Cập nhật trạng thái điểm danh hoặc xóa khỏi lịch
  const handleUpdateStatus = async (shiftId, staffId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/shifts/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, staffId, status })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      fetchShifts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#800020] uppercase">Quản Trị Phân Công Lịch Trực</h1>
            <p className="text-xs text-slate-500 font-medium">Tổng hợp nguyện vọng và phân công lịch trực cho thành viên.</p>
          </div>
        </div>

        {/* Form tạo ca trực */}
        <form onSubmit={handleCreateShift} className="bg-white p-6 rounded-3xl border shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Ngày trực</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Tên ca / Thời gian</label>
            <input type="text" placeholder="VD: Ca sáng (08h - 11h30)" value={newShiftName} onChange={e => setNewShiftName(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Số lượng tối đa</label>
            <input type="number" value={newMaxSlots} onChange={e => setNewMaxSlots(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#800020] text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Thêm Ca Trực
          </button>
        </form>

        {/* Danh sách các ca trực và tổng hợp nguyện vọng */}
        <div className="space-y-6">
          {shifts.map((shift) => (
            <div key={shift._id} className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">Ngày: {shift.date}</span>
                  <h3 className="text-base font-bold text-slate-800 mt-2">{shift.shiftName}</h3>
                </div>
                <div className="text-right text-xs font-semibold text-slate-500">
                  Đã phân công: <span className="text-[#800020] font-bold">{shift.assignedStaff?.length || 0}</span> / {shift.maxSlots}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cột 1: Danh sách sinh viên đăng ký nguyện vọng chờ phân công */}
                <div className="bg-slate-50 p-4 rounded-2xl border space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> Nguyện Vọng Đăng Ký ({shift.requests?.length || 0})
                  </h4>
                  {shift.requests?.length > 0 ? (
                    <div className="space-y-2">
                      {shift.requests.map((req) => (
                        <div key={req._id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{req.hoVaTen}</p>
                            <p className="text-[10px] text-slate-400 font-mono">MSV: {req.msv}</p>
                          </div>
                          <button 
                            onClick={() => handleAssign(shift._id, req)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            Phân công +
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Chưa có ai đăng ký nguyện vọng ca này.</p>
                  )}
                </div>

                {/* Cột 2: Danh sách chính thức được phân công và điểm danh */}
                <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" /> Danh Sách Phân Công Chính Thức
                  </h4>
                  {shift.assignedStaff?.length > 0 ? (
                    <div className="space-y-2">
                      {shift.assignedStaff.map((staff) => (
                        <div key={staff._id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{staff.hoVaTen}</p>
                            <p className="text-[10px] text-slate-400 font-mono">MSV: {staff.msv} • <span className="text-emerald-600 font-bold">{staff.status}</span></p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleUpdateStatus(shift._id, staff._id, 'Đã đến')}
                              className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[10px] font-bold"
                              title="Đã đến"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(shift._id, staff._id, 'Vắng mặt')}
                              className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold"
                              title="Vắng"
                            >
                              ✕
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(shift._id, staff._id, 'remove')}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                              title="Xóa khỏi ca"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Chưa phân công thành viên nào.</p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}