import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, BookOpen, X, ChevronLeft, ChevronRight, Award, Filter, Calendar } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // States cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState('');     // Tìm theo Tên hoặc Mã SV
  const [selectedBan, setSelectedBan] = useState('');     // Lọc theo Ban
  const [selectedGen, setSelectedGen] = useState('');     // Lọc theo Gen
  const [selectedKhoa, setSelectedKhoa] = useState('');   // Lọc theo Khoa
  const [selectedLop, setSelectedLop] = useState('');     // Lọc theo Lớp
  const [selectedDate, setSelectedDate] = useState('');   // Lọc theo Ngày sinh

  // States cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Hiển thị 9 thành viên mỗi trang (3x3 grid)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const currentHost = window.location.hostname;
        const API_URL = (currentHost === 'localhost' || currentHost === '127.0.0.1')
          ? 'http://localhost:5000'
          : 'https://ubc-backend-4gtj.onrender.com';

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
  }, []);

  // Tự động trích xuất các giá trị độc lập từ dữ liệu để đưa vào danh sách menu xổ xuống (Dropdown)
  const filterOptions = useMemo(() => {
    const bans = new Set();
    const gens = new Set();
    const khoas = new Set();
    const lops = new Set();

    members.forEach(m => {
      if (m.ban) bans.add(m.ban);
      if (m.gen) gens.add(m.gen);
      if (m.khoa) khoas.add(m.khoa);
      if (m.lop) lops.add(m.lop);
    });

    return {
      bans: Array.from(bans).sort(),
      gens: Array.from(gens).sort((a, b) => Number(a) - Number(b)), // Sắp xếp Gen tăng dần
      khoas: Array.from(khoas).sort(),
      lops: Array.from(lops).sort(),
    };
  }, [members]);

  // Lọc danh sách thành viên dựa trên tất cả các tiêu chí
  const filteredMembers = members.filter(m => {
    // 1. Tìm theo tên hoặc mã sinh viên (Hộp tìm kiếm chính)
    const matchSearch = searchTerm.trim() === '' || 
      m.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.msv?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo Ban (Menu xổ xuống)
    const matchBan = selectedBan === '' || m.ban === selectedBan;

    // 3. Lọc theo Gen (Menu xổ xuống)
    const matchGen = selectedGen === '' || String(m.gen) === String(selectedGen);

    // 4. Lọc theo Khoa (Menu xổ xuống)
    const matchKhoa = selectedKhoa === '' || m.khoa === selectedKhoa;

    // 5. Lọc theo Lớp (Menu xổ xuống)
    const matchLop = selectedLop === '' || m.lop === selectedLop;

    // 6. Lọc theo Ngày sinh (Chọn ngày dạng YYYY-MM-DD hoặc so sánh chuỗi ngày)
    // Lưu ý: Trường ngày sinh trong DB của bạn ví dụ là "2/11/04", ô input date trả về "YYYY-MM-DD". 
    // Ta có thể so sánh trực tiếp hoặc kiểm tra tương đối nếu ngày tháng khớp.
    let matchDate = true;
    if (selectedDate) {
      // selectedDate có dạng "YYYY-MM-DD" từ input type="date"
      const [year, month, day] = selectedDate.split('-');
      const formattedInputDate = `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`; // Chuyển về dạng d/m/yy
      const formattedInputDateFull = `${parseInt(day)}/${parseInt(month)}/${year}`;       // Chuyển về dạng d/m/yyyy
      
      matchDate = m.ngaySinh === formattedInputDate || m.ngaySinh === formattedInputDateFull || m.ngaySinh?.includes(`${parseInt(day)}/${parseInt(month)}`);
    }

    return matchSearch && matchBan && matchGen && matchKhoa && matchLop && matchDate;
  });

  // Reset về trang 1 khi thay đổi bất kỳ bộ lọc nào
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBan, selectedGen, selectedKhoa, selectedLop, selectedDate]);

  // Hàm xoá toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBan('');
    setSelectedGen('');
    setSelectedKhoa('');
    setSelectedLop('');
    setSelectedDate('');
  };

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm tạo danh sách các trang hiển thị kèm dấu '...'
  const getPaginationPages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

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

        {/* KHU VỰC TÌM KIẾM & BỘ LỌC NÂNG CAO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Filter className="w-4 h-4 text-[#800020]" />
              <span>Tìm kiếm & Bộ lọc thông tin</span>
            </div>
            {(searchTerm || selectedBan || selectedGen || selectedKhoa || selectedLop || selectedDate) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Xoá bộ lọc
              </button>
            )}
          </div>

          {/* Hàng 1: Ô tìm kiếm tên/mã & Chọn ngày sinh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hộp tìm kiếm theo Tên hoặc Mã SV */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo Họ tên hoặc Mã sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020] transition-all"
              />
            </div>

            {/* Chọn ngày sinh */}
            <div className="relative flex items-center">
              <div className="w-full flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#800020] transition-all">
                <Calendar className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                />
                {selectedDate && (
                  <button onClick={() => setSelectedDate('')} className="text-slate-400 hover:text-slate-600 text-xs ml-2">X</button>
                )}
              </div>
            </div>
          </div>

          {/* Hàng 2: Các Menu xổ xuống (Dropdown) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Lọc theo Ban */}
            <select
              value={selectedBan}
              onChange={(e) => setSelectedBan(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
            >
              <option value="">Tất cả các Ban</option>
              {filterOptions.bans.map(ban => (
                <option key={ban} value={ban}>Ban {ban}</option>
              ))}
            </select>

            {/* Lọc theo Gen */}
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
            >
              <option value="">Tất cả các Gen</option>
              {filterOptions.gens.map(gen => (
                <option key={gen} value={gen}>Gen {gen}</option>
              ))}
            </select>

            {/* Lọc theo Khoa */}
            <select
              value={selectedKhoa}
              onChange={(e) => setSelectedKhoa(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
            >
              <option value="">Tất cả các Khoa</option>
              {filterOptions.khoas.map(khoa => (
                <option key={khoa} value={khoa}>{khoa}</option>
              ))}
            </select>

            {/* Lọc theo Lớp */}
            <select
              value={selectedLop}
              onChange={(e) => setSelectedLop(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
            >
              <option value="">Tất cả các Lớp</option>
              {filterOptions.lops.map(lop => (
                <option key={lop} value={lop}>{lop}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-20 text-slate-500 font-medium">Đang tải danh sách thành viên...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-md mx-auto font-medium">{error}</div>}

        {/* Lưới danh sách thành viên */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
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
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-[#800020]">{member.ban ? `Ban ${member.ban}` : 'Thành viên'}</span>
                            {member.gen && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60">
                                <Award className="w-3 h-3" /> Gen {member.gen}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-500 mb-4 border-t border-slate-100 pt-3">
                        <p className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Lớp: <span className="font-semibold text-slate-700">{member.lop || 'Chưa cập nhật'}</span></p>
                        <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Quê: <span className="font-semibold text-slate-700 truncate">{member.que || 'Chưa cập nhật'}</span></p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="w-full py-2 bg-slate-50 hover:bg-[#800020] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 hover:border-[#800020] cursor-pointer"
                    >
                      Xem chi tiết hồ sơ
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-slate-400 font-medium">
                  Không tìm thấy thành viên phù hợp với bộ lọc.
                </div>
              )}
            </div>

            {/* PHÂN TRANG THÔNG MINH (1 2 3 ... 17 18 19) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPaginationPages().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${index}`} className="px-3 py-2 text-slate-400 font-bold select-none">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition cursor-pointer ${
                          currentPage === page
                            ? 'bg-[#800020] text-white shadow-md'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Chi tiết thành viên */}
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
                {selectedMember.anhThe ? (
                  <img src={selectedMember.anhThe} alt={selectedMember.hoVaTen} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-amber-100 shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#800020] text-white font-black text-3xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    {selectedMember.hoVaTen?.charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-black text-slate-800">{selectedMember.hoVaTen}</h2>
                <p className="text-xs font-bold text-[#800020] uppercase tracking-wider mt-1">
                  Ban {selectedMember.ban || 'Chưa phân ban'} {selectedMember.gen ? `• Gen ${selectedMember.gen}` : ''}
                </p>
              </div>

              <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Mã sinh viên:</span><span className="font-mono font-bold text-slate-800">{selectedMember.msv}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-200/60"><span className="text-slate-400 font-medium">Gen:</span><span className="font-bold text-[#800020]">Gen {selectedMember.gen || '---'}</span></div>
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