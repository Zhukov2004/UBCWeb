import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, MapPin, BookOpen, X, ChevronLeft, ChevronRight, Award, Filter, Calendar } from 'lucide-react';

export default function CoreTeamGenPage() {
  const { gen } = useParams(); // Lấy số gen từ URL (2, 3, hoặc 4)
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // States bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBan, setSelectedBan] = useState('');
  const [selectedChucVu, setSelectedChucVu] = useState('');
  const [selectedLop, setSelectedLop] = useState('');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Gọi API tương ứng với collection của Gen đó khi gen thay đổi
  useEffect(() => {
    const fetchGenData = async () => {
      try {
        setLoading(true);
        setError('');
        const currentHost = window.location.hostname;
        const API_URL = (currentHost === 'localhost' || currentHost === '127.0.0.1')
          ? 'http://localhost:5000'
          : 'https://ubc-backend-4gtj.onrender.com';

        // Gọi đúng route API collection gen tương ứng (ví dụ: /api/gens/4)
        const response = await fetch(`${API_URL}/api/gens/${gen}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || `Không thể tải dữ liệu Gen ${gen}`);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenData();
  }, [gen]);

  // Trích xuất các option lọc an toàn tuyệt đối với key không bị trùng
  const filterOptions = useMemo(() => {
    const bans = new Set();
    const chucVus = new Set();
    const lops = new Set();

    if (Array.isArray(members)) {
      members.forEach(m => {
        if (!m) return;
        const banVal = m.ban || m.Ban;
        const chucVuVal = m.chucVu || m['Chức vụ'];
        const lopVal = m.lop || m['Lớp'];

        if (banVal) bans.add(String(banVal).trim());
        if (chucVuVal) chucVus.add(String(chucVuVal).trim());
        if (lopVal) lops.add(String(lopVal).trim());
      });
    }

    return {
      bans: Array.from(bans).sort(),
      chucVus: Array.from(chucVus).sort(),
      lops: Array.from(lops).sort(),
    };
  }, [members]);

  // Lọc dữ liệu an toàn tuyệt đối chống trắng trang
  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members)) return [];

    return members.filter(m => {
      if (!m) return false;

      try {
        const name = (m.hoVaTen || m['Họ và tên'] || '').toLowerCase();
        const phone = String(m.soDienThoai || m['Số điện thoại'] || '').toLowerCase();
        const term = searchTerm.trim().toLowerCase();

        const matchSearch = term === '' || name.includes(term) || phone.includes(term);
        const matchBan = selectedBan === '' || (m.ban || m.Ban) === selectedBan;
        const matchChucVu = selectedChucVu === '' || (m.chucVu || m['Chức vụ']) === selectedChucVu;
        const matchLop = selectedLop === '' || (m.lop || m['Lớp']) === selectedLop;

        return matchSearch && matchBan && matchChucVu && matchLop;
      } catch (e) {
        return false;
      }
    });
  }, [members, searchTerm, selectedBan, selectedChucVu, selectedLop]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBan, selectedChucVu, selectedLop]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBan('');
    setSelectedChucVu('');
    setSelectedLop('');
  };

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Tiêu đề trang động theo Gen */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Award className="w-4 h-4 text-amber-600" /> Ban Chủ Nhiệm Thế Hệ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight mb-2">
            Gen {gen} - UNETI Book Club
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Danh sách thủ lĩnh và ban cán sự cốt cán thế hệ Gen {gen}.
          </p>
        </div>

        {/* KHU VỰC TÌM KIẾM & BỘ LỌC */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Filter className="w-4 h-4 text-[#800020]" />
              <span>Tìm kiếm & Bộ lọc Gen {gen}</span>
            </div>
            {(searchTerm || selectedBan || selectedChucVu || selectedLop) && (
              <button onClick={handleResetFilters} className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer">
                Xoá bộ lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo Họ tên hoặc Số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedChucVu}
                onChange={(e) => setSelectedChucVu(e.target.value)}
                className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#800020] cursor-pointer"
              >
                <option value="">Tất cả Chức vụ</option>
                {filterOptions.chucVus.map((cv, idx) => (
                  <option key={`filter-cv-${cv}-${idx}`} value={cv}>{cv}</option>
                ))}
              </select>

              <select
                value={selectedBan}
                onChange={(e) => setSelectedBan(e.target.value)}
                className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#800020] cursor-pointer"
              >
                <option value="">Tất cả Ban</option>
                {filterOptions.bans.map((ban, idx) => (
                  <option key={`filter-ban-${ban}-${idx}`} value={ban}>Ban {ban}</option>
                ))}
              </select>

              <select
                value={selectedLop}
                onChange={(e) => setSelectedLop(e.target.value)}
                className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#800020] cursor-pointer"
              >
                <option value="">Tất cả Lớp</option>
                {filterOptions.lops.map((lop, idx) => (
                  <option key={`filter-lop-${lop}-${idx}`} value={lop}>{lop}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <div className="text-center py-20 text-slate-500 font-medium text-sm">Đang tải danh sách Gen {gen}...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-md mx-auto font-medium text-sm">{error}</div>}

        {/* LƯỚI HIỂN THỊ THÀNH VIÊN */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembers.length > 0 ? (
              currentMembers.map((member, idx) => {
                const name = member.hoVaTen || member['Họ và tên'] || 'Chưa cập nhật';
                const role = member.chucVu || member['Chức vụ'] || 'Thành viên BCN';
                const department = member.ban || member.Ban || '---';
                const classNameVal = member.lop || member['Lớp'] || '---';
                const phone = member.soDienThoai || member['Số điện thoại'] || '---';
                const avatar = member.anhThe || member.anh || '';

                return (
                  <div 
                    key={member._id || `member-${idx}`}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-14 h-14 rounded-2xl object-cover border border-amber-100" />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#800020] font-black text-xl flex items-center justify-center border border-amber-100 group-hover:bg-[#800020] group-hover:text-white transition-all">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-800 truncate">{name}</h3>
                          <p className="text-xs font-extrabold text-[#800020] mt-0.5">{role}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold bg-red-50 text-[#800020] px-2 py-0.5 rounded border border-red-100">
                            Ban {department}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-500 mb-4 border-t border-slate-100 pt-3">
                        <p className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Lớp: <span className="font-semibold text-slate-700">{classNameVal}</span></p>
                        <p className="flex items-center gap-2">📞 SĐT: <span className="font-semibold text-slate-700 font-mono">{phone}</span></p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="w-full py-2 bg-slate-50 hover:bg-[#800020] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 hover:border-[#800020] cursor-pointer"
                    >
                      Xem chi tiết hồ sơ
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400 font-medium text-sm">
                Không tìm thấy thành viên Gen {gen} phù hợp với bộ lọc.
              </div>
            )}
          </div>
        )}

        {/* MODAL CHI TIẾT */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#800020] text-white font-black text-3xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  {(selectedMember.hoVaTen || selectedMember['Họ và tên'])?.charAt(0)}
                </div>
                <h2 className="text-xl font-black text-slate-800">{selectedMember.hoVaTen || selectedMember['Họ và tên']}</h2>
                <p className="text-xs font-bold text-[#800020] uppercase tracking-wider mt-1">
                  {selectedMember.chucVu || selectedMember['Chức vụ']} - Gen {gen}
                </p>
              </div>

              <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Ban hoạt động:</span><span className="font-bold text-slate-800">{selectedMember.ban || selectedMember.Ban}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Khoa:</span><span className="font-bold text-slate-800">{selectedMember.khoa || selectedMember.Khoa || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Lớp:</span><span className="font-bold text-slate-800">{selectedMember.lop || selectedMember['Lớp'] || '---'}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Ngày sinh:</span><span className="font-bold text-slate-800">{selectedMember.ngaySinh || selectedMember['Ngày tháng năm sinh'] || '---'}</span></div>
                <div className="flex justify-between py-1 items-center"><span className="text-slate-400 font-medium">Số điện thoại:</span><span className="font-mono font-bold text-slate-800">{selectedMember.soDienThoai || selectedMember['Số điện thoại'] || '---'}</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}