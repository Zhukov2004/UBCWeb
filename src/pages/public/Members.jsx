import React, { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, X } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // Tự động nhận diện: Đang chạy ở máy cá nhân -> dùng localhost:5000, lên mạng -> dùng Render
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://ubc-backend-4gtj.onrender.com';

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Không thể tải danh sách');
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [API_URL]);

  const filteredMembers = members.filter(m => 
    m.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.msv?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.khoa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.ban?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Tiêu đề trang */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight mb-2">
            Thành Viên UNETI Book Club
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Danh sách gắn kết các thế hệ thành viên văn hóa đọc.
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="max-w-md mx-auto mb-10 relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, MSV, Khoa, Ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020] transition-all"
          />
        </div>

        {loading && <div className="text-center py-20 text-slate-500 font-medium">Đang tải danh sách thành viên...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-md mx-auto font-medium">{error}</div>}

        {/* Lưới danh sách thành viên */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div 
                  key={member._id || member.msv}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {member.anhThe ? (
                        <img src={member.anhThe} alt={member.hoVaTen} className="w-14 h-14 rounded-2xl object-cover border border-amber-100" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#800020] font-black text-xl flex items-center justify-center border border-amber-100 group-hover:bg-[#800020] group-hover:text-white transition-all">
                          {member.hoVaTen ? member.hoVaTen.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-800 truncate">{member.hoVaTen}</h3>
                        <p className="text-xs font-semibold text-slate-400">MSV: <span className="text-slate-600 font-mono">{member.msv}</span></p>
                        <p className="text-xs font-medium text-[#800020] mt-0.5">{member.ban ? `Ban ${member.ban}` : 'Thành viên'}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4 border-t border-slate-100 pt-3">
                      <p className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Lớp: <span className="font-semibold text-slate-700">{member.lop || 'Chưa cập nhật'}</span></p>
                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Quê: <span className="font-semibold text-slate-700 truncate">{member.que || 'Chưa cập nhật'}</span></p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="w-full py-2 bg-slate-50 hover:bg-[#800020] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 hover:border-[#800020]"
                  >
                    Xem chi tiết hồ sơ
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400 font-medium">
                Không tìm thấy thành viên phù hợp.
              </div>
            )}
          </div>
        )}

        {/* Modal Chi tiết thành viên */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                {selectedMember.anhThe ? (
                  <img src={selectedMember.anhThe} alt={selectedMember.hoVaTen} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-amber-100 shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#800020] text-white font-black text-3xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    {selectedMember.hoVaTen?.charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-black text-slate-800">{selectedMember.hoVaTen}</h2>
                <p className="text-xs font-bold text-[#800020] uppercase tracking-wider mt-1">
                  Ban {selectedMember.ban || 'Chưa phân ban'} • Gen {selectedMember.gen || 'N/A'}
                </p>
              </div>

              <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Mã sinh viên:</span><span className="font-mono font-bold text-slate-800">{selectedMember.msv}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Ngày sinh:</span><span className="font-bold text-slate-800">{selectedMember.ngaySinh || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Khoa:</span><span className="font-bold text-slate-800">{selectedMember.khoa || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Lớp:</span><span className="font-bold text-slate-800">{selectedMember.lop || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Cơ sở học:</span><span className="font-bold text-slate-800">{selectedMember.cosoHoc || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Quê quán:</span><span className="font-bold text-slate-800 text-right">{selectedMember.que || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Email trường:</span><span className="font-mono text-xs font-bold text-slate-800">{selectedMember.mailTruong || '---'}</span></div>
                <div className="flex justify-between py-1 items-center"><span className="text-slate-400 font-medium">Facebook:</span>
                  {selectedMember.facebook ? (
                    <a href={selectedMember.facebook} target="_blank" rel="noopener noreferrer" className="text-[#800020] font-bold hover:underline flex items-center gap-1.5">
                      <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      {selectedMember.nicknameFacebook || 'Link Facebook'}
                    </a>
                  ) : '---'}
                </div>
              </div>

              {selectedMember.anhSinhNhat && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-500 mb-2">Ảnh kỷ niệm / Sinh nhật:</p>
                  <img src={selectedMember.anhSinhNhat} alt="Ảnh sinh nhật" className="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}