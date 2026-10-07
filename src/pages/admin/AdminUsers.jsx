import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Trash2, Search, UserCheck } from 'lucide-react';
import { API_URL } from '../../utils/api'; // Hoặc thay bằng 'http://localhost:5000'

export default function AdminUsers() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách từ endpoint /api/accounts hoàn toàn mới
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách tài khoản!');
      }

      const data = await response.json();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi kết nối đến API quản lý tài khoản mới.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Xóa tài khoản
  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Xóa tài khoản thất bại!');
      }

      setAccounts(accounts.filter(acc => acc._id !== id));
      alert('Đã xóa tài khoản thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi xóa tài khoản.');
    }
  };

  // Đổi quyền (Role)
  const handleToggleRole = async (account) => {
    const newRole = account.role === 'admin' ? 'user' : 'admin';

    if (!window.confirm(`Bạn muốn đổi quyền thành [${newRole.toUpperCase()}]?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/accounts/${account._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Cập nhật quyền thất bại!');
      }

      const updatedAcc = await response.json();
      setAccounts(accounts.map(acc => acc._id === updatedAcc._id ? updatedAcc : acc));
      alert('Cập nhật quyền thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi đổi quyền.');
    }
  };

  // Lọc tìm kiếm theo Tên hoặc Email
  const filteredAccounts = accounts.filter(acc => 
    (acc.hoVaTen && acc.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (acc.email && acc.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Tiêu đề */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#800020] uppercase tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7" /> Quản Lý Tài Khoản (Account System)
            </h1>
            <p className="text-sm text-slate-500 mt-1">Hệ thống quản lý tài khoản hoàn toàn mới, độc lập và bảo mật.</p>
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all"
            />
          </div>
        </div>

        {/* Trạng thái */}
        {loading && <div className="text-center py-12 text-slate-500 font-medium">Đang tải dữ liệu...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-6">{error}</div>}

        {/* Bảng dữ liệu */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <th className="py-4 px-6">Họ và Tên</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Vai trò (Role)</th>
                    <th className="py-4 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => {
                      const isAdmin = account.role === 'admin';

                      return (
                        <tr key={account._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold text-xs">
                              {account.hoVaTen ? account.hoVaTen.charAt(0).toUpperCase() : 'A'}
                            </div>
                            {account.hoVaTen || 'Chưa cập nhật'}
                          </td>
                          <td className="py-4 px-6 text-slate-600">{account.email}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              {isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên (User)'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center space-x-2">
                            <button 
                              onClick={() => handleToggleRole(account)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isAdmin 
                                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                              }`}
                            >
                              {isAdmin ? 'Hạ quyền User' : 'Cấp quyền Admin'}
                            </button>

                            <button 
                              onClick={() => handleDeleteAccount(account._id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-400 italic">
                        Không có tài khoản nào trong hệ thống.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}