import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, X, ShieldAlert, Award, BookOpen, MapPin, Calendar, Filter } from 'lucide-react';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // States cho tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBan, setSelectedBan] = useState('');
  const [selectedGen, setSelectedGen] = useState('');
  const [selectedKhoa, setSelectedKhoa] = useState('');

  // States cho Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  // Form data cho Thêm / Sửa
  const initialFormState = {
    stt: '',
    msv: '',
    ban: '',
    ngaySinh: '',
    khoa: '',
    nganh: '',
    lop: '',
    gen: '',
    facebook: '',
    nicknameFacebook: '',
    mailTruong: '',
    cosoHoc: '',
    que: '',
    anhThe: '',
    hoVaTen: '',
    anhSinhNhat: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // State xác nhận xoá
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // API URL
  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    return (currentHost === 'localhost' || currentHost === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://ubc-backend-4gtj.onrender.com';
  };

  // Lấy danh sách thành viên
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/api/users`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể tải danh sách');
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Trích xuất bộ lọc dropdown tự động
  const filterOptions = useMemo(() => {
    const bans = new Set();
    const gens = new Set();
    const khoas = new Set();

    members.forEach(m => {
      if (m.ban) bans.add(m.ban);
      if (m.gen) gens.add(m.gen);
      if (m.khoa) khoas.add(m.khoa);
    });

    return {
      bans: Array.from(bans).sort(),
      gens: Array.from(gens).sort((a, b) => Number(a) - Number(b)),
      khoas: Array.from(khoas).sort(),
    };
  }, [members]);

  // Lọc dữ liệu trên bảng Admin
  const filteredMembers = members.filter(m => {
    const matchSearch = searchTerm.trim() === '' ||
      m.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.msv?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBan = selectedBan === '' || m.ban === selectedBan;
    const matchGen = selectedGen === '' || String(m.gen) === String(selectedGen);
    const matchKhoa = selectedKhoa === '' || m.khoa === selectedKhoa;

    return matchSearch && matchBan && matchGen && matchKhoa;
  });

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentMemberId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Mở modal Chỉnh sửa
  const handleOpenEditModal = (member) => {
    setIsEditing(true);
    setCurrentMemberId(member._id);
    setFormData({
      stt: member.stt || '',
      msv: member.msv || '',
      ban: member.ban || '',
      ngaySinh: member.ngaySinh || '',
      khoa: member.khoa || '',
      nganh: member.nganh || member.Nganh || '',
      lop: member.lop || '',
      gen: member.gen || '',
      facebook: member.facebook || '',
      nicknameFacebook: member.nicknameFacebook || '',
      mailTruong: member.mailTruong || '',
      cosoHoc: member.cosoHoc || '',
      que: member.que || '',
      anhThe: member.anhThe || '',
      hoVaTen: member.hoVaTen || '',
      anhSinhNhat: member.anhSinhNhat || ''
    });
    setIsModalOpen(true);
  };

  // Xử lý Submit Form (Thêm hoặc Sửa)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${getApiUrl()}/api/users/${currentMemberId}`
        : `${getApiUrl()}/api/users`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Có lỗi xảy ra khi lưu dữ liệu');

      setSuccessMessage(isEditing ? 'Cập nhật thành viên thành công!' : 'Thêm thành viên mới thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Xử lý Xoá thành viên
  const handleDeleteMember = async (id) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Không thể xoá thành viên');

      setSuccessMessage('Đã xoá thành viên thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeleteConfirmId(null);
      fetchMembers();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header trang quản trị */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" /> Hệ thống Quản trị Viên (Admin Dashboard)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quản Lý Thành Viên UNETI Book Club
            </h1>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Thêm thành viên mới
          </button>
        </div>

        {/* Thông báo thành công */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2">
            ✅ {successMessage}
          </div>
        )}

        {/* Thanh công cụ tìm kiếm và lọc */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative sm:col-span-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm tên hoặc MSV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <select
            value={selectedBan}
            onChange={(e) => setSelectedBan(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="">Tất cả các Ban</option>
            {filterOptions.bans.map(ban => (
              <option key={ban} value={ban}>Ban {ban}</option>
            ))}
          </select>

          <select
            value={selectedGen}
            onChange={(e) => setSelectedGen(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="">Tất cả các Gen</option>
            {filterOptions.gens.map(gen => (
              <option key={gen} value={gen}>Gen {gen}</option>
            ))}
          </select>

          <select
            value={selectedKhoa}
            onChange={(e) => setSelectedKhoa(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="">Tất cả các Khoa</option>
            {filterOptions.khoas.map(khoa => (
              <option key={khoa} value={khoa}>{khoa}</option>
            ))}
          </select>
        </div>

        {/* Bảng dữ liệu thành viên */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-semibold text-sm">Đang tải cơ sở dữ liệu thành viên...</div>
          ) : error ? (
            <div className="text-center py-20 text-rose-600 font-semibold text-sm">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-4">Ảnh & Họ Tên</th>
                    <th className="py-4 px-4">MSV</th>
                    <th className="py-4 px-4">Gen & Ban</th>
                    <th className="py-4 px-4">Khoa / Ngành / Lớp</th>
                    <th className="py-4 px-4">Ngày sinh & Quê</th>
                    <th className="py-4 px-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-slate-50/80 transition-all">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {member.anhThe ? (
                              <img src={member.anhThe} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#800020] font-bold flex items-center justify-center shrink-0">
                                {member.hoVaTen?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{member.hoVaTen}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{member.mailTruong || 'Chưa có email'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {member.msv}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 w-max font-bold text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                              <Award className="w-3 h-3" /> Gen {member.gen || '---'}
                            </span>
                            <span className="font-bold text-[#800020]">Ban {member.ban || '---'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{member.khoa || '---'}</p>
                          <p className="text-[11px] text-slate-500">{member.nganh || member.Nganh || '---'} • <span className="font-semibold">{member.lop || '---'}</span></p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold">{member.ngaySinh || '---'}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{member.que || '---'}</p>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(member)}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition cursor-pointer"
                              title="Sửa thông tin"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(member._id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                              title="Xoá thành viên"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400">
                        Không tìm thấy thành viên nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Thêm / Sửa thành viên */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-slate-900 mb-6">
                {isEditing ? '✏️ Chỉnh sửa thông tin thành viên' : '➕ Thêm thành viên mới'}
              </h2>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.hoVaTen}
                      onChange={(e) => setFormData({...formData, hoVaTen: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: Vũ Như An"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mã sinh viên (MSV) *</label>
                    <input
                      type="text"
                      required
                      value={formData.msv}
                      onChange={(e) => setFormData({...formData, msv: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: 22174600046"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gen (Thế hệ) *</label>
                    <input
                      type="text"
                      required
                      value={formData.gen}
                      onChange={(e) => setFormData({...formData, gen: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: 4"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ban hoạt động</label>
                    <input
                      type="text"
                      value={formData.ban}
                      onChange={(e) => setFormData({...formData, ban: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: Đào tạo, Truyền thông..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khoa</label>
                    <input
                      type="text"
                      value={formData.khoa}
                      onChange={(e) => setFormData({...formData, khoa: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: Khoa học ứng dụng"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngành</label>
                    <input
                      type="text"
                      value={formData.nganh}
                      onChange={(e) => setFormData({...formData, nganh: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: Công nghệ thông tin"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lớp</label>
                    <input
                      type="text"
                      value={formData.lop}
                      onChange={(e) => setFormData({...formData, lop: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: DHKL16A2HN"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
                    <input
                      type="text"
                      value={formData.ngaySinh}
                      onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: 2/11/04"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quê quán</label>
                    <input
                      type="text"
                      value={formData.que}
                      onChange={(e) => setFormData({...formData, que: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: Hoàng Mai, Hà Nội"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email trường</label>
                    <input
                      type="email"
                      value={formData.mailTruong}
                      onChange={(e) => setFormData({...formData, mailTruong: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="VD: vnan.dhkl16a2hn@sv.uneti.edu.vn"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Link Facebook cá nhân</label>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Link ảnh thẻ (URL hình ảnh)</label>
                    <input
                      type="text"
                      value={formData.anhThe}
                      onChange={(e) => setFormData({...formData, anhThe: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#800020] outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Huỷ bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
                  >
                    {isEditing ? 'Lưu thay đổi' : 'Tạo mới thành viên'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xác nhận xoá */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">
                ⚠️
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">Xác nhận xoá thành viên?</h3>
              <p className="text-xs text-slate-500 mb-6">Thao tác này sẽ xoá hoàn toàn thông tin thành viên khỏi hệ thống cơ sở dữ liệu và không thể hoàn tác.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => handleDeleteMember(deleteConfirmId)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Xoá ngay
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}