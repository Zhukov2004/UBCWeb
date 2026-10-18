import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, X, UserCheck, ShieldAlert, KeyRound, Trash2 } from 'lucide-react';

export default function AdminUsers() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

    // State tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // State Modal Thêm tài khoản mới
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        msv: '',
        role: 'user'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentLoggedInUser(JSON.parse(storedUser));
            } catch (e) {
                setCurrentLoggedInUser(null);
            }
        }
    }, []);

    const getApiUrl = () => {
        const currentHost = window.location.hostname;
        return (currentHost === 'localhost' || currentHost === '127.0.0.1')
            ? 'http://localhost:5000'
            : 'https://ubc-backend-4gtj.onrender.com';
    };

    const fetchAccounts = async () => {
        try {
            const API_URL = getApiUrl();
            const res = await axios.get(`${API_URL}/api/accounts`);
            setAccounts(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            setError('Không thể tải danh sách tài khoản!');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Lọc tài khoản theo từ khóa tìm kiếm
    const filteredAccounts = useMemo(() => {
        if (!Array.isArray(accounts)) return [];
        return accounts.filter(acc => {
            const name = acc.username || acc.hoVaTen || '';
            const email = acc.email || '';
            const msv = acc.msv || acc.MSV || '';
            const term = searchTerm.toLowerCase();

            return name.toLowerCase().includes(term) || 
                   email.toLowerCase().includes(term) || 
                   msv.toLowerCase().includes(term);
        });
    }, [accounts, searchTerm]);

    // Xử lý Thêm tài khoản mới
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const API_URL = getApiUrl();
            const res = await axios.post(`${API_URL}/api/accounts`, formData);
            
            setSuccessMessage('Thêm tài khoản mới thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
            
            setIsModalOpen(false);
            setFormData({ username: '', email: '', password: '', msv: '', role: 'user' });
            fetchAccounts();
        } catch (err) {
            alert(err.response?.data?.message || 'Thêm tài khoản thất bại!');
        }
    };

    // Xóa tài khoản
    const handleDelete = async (id, targetEmail, targetRole) => {
        if (currentLoggedInUser && currentLoggedInUser.email === targetEmail) {
            alert('⚠️ Bạn không thể tự xóa tài khoản của chính mình!');
            return;
        }

        const requesterRole = currentLoggedInUser?.role?.toLowerCase();
        if (requesterRole !== 'superadmin' && targetRole?.toLowerCase() === 'superadmin') {
            alert('⚠️ Admin thường không có quyền xóa tài khoản Super Admin!');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            try {
                const API_URL = getApiUrl();
                await axios.delete(`${API_URL}/api/accounts/${id}`);
                setAccounts(accounts.filter(acc => acc._id !== id));
                setSuccessMessage('Xóa tài khoản thành công!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                alert(err.response?.data?.message || 'Xóa tài khoản thất bại!');
            }
        }
    };

    // Đổi quyền (Role)
    const handleToggleRole = async (id, currentRole, targetEmail) => {
        if (currentLoggedInUser && currentLoggedInUser.email === targetEmail) {
            alert('⚠️ Bạn không thể tự thay đổi quyền hạn của chính mình!');
            return;
        }

        const requesterRole = currentLoggedInUser?.role?.toLowerCase();
        if (requesterRole !== 'superadmin') {
            alert('⚠️ Bạn là Admin thường, không có quyền thay đổi phân quyền tài khoản!');
            return;
        }

        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const API_URL = getApiUrl();
            const res = await axios.put(`${API_URL}/api/accounts/${id}/role`, { 
                role: newRole, 
                requesterRole: currentLoggedInUser.role 
            });
            setAccounts(accounts.map(acc => acc._id === id ? res.data : acc));
            setSuccessMessage('Cập nhật quyền thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Cập nhật quyền thất bại!');
        }
    };

    // Đặt lại mật khẩu
    const handleResetPassword = async (id, targetRole) => {
        const requesterRole = currentLoggedInUser?.role?.toLowerCase();
        if (requesterRole !== 'superadmin' && targetRole?.toLowerCase() === 'superadmin') {
            alert('⚠️ Admin thường không có quyền đổi mật khẩu của tài khoản Super Admin!');
            return;
        }

        const newPassword = prompt('Nhập mật khẩu mới cho tài khoản này (tối thiểu 6 ký tự):');
        if (!newPassword) return;

        if (newPassword.length < 6) {
            alert('Mật khẩu quá ngắn! Phải từ 6 ký tự trở lên.');
            return;
        }

        try {
            const API_URL = getApiUrl();
            await axios.put(`${API_URL}/api/accounts/${id}/reset-password`, { newPassword });
            alert('Đổi mật khẩu thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500 font-semibold">Đang tải dữ liệu hệ thống...</div>;
    if (error) return <div className="text-center py-20 text-rose-600 font-semibold">{error}</div>;

    const isSuperAdmin = currentLoggedInUser?.role?.toLowerCase() === 'superadmin';

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-sm rounded-3xl border border-slate-200 mt-6">
            
            {/* Header & Nút Thêm mới */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                        <ShieldAlert className="w-4 h-4" /> Hệ thống Quản trị Viên
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Tài khoản Hệ thống</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Vai trò hiện tại của bạn: <strong className="text-purple-700">{currentLoggedInUser?.role?.toUpperCase() || 'USER'}</strong>
                    </p>
                </div>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Thêm tài khoản mới
                </button>
            </div>

            {successMessage && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2">
                    ✅ {successMessage}
                </div>
            )}

            {/* Thanh tìm kiếm */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc MSV..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                </div>
            </div>

            {/* Bảng danh sách tài khoản */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-4 px-4">#</th>
                            <th className="py-4 px-4">Tên / Email</th>
                            <th className="py-4 px-4">MSV</th>
                            <th className="py-4 px-4">Vai trò</th>
                            <th className="py-4 px-4">Ngày tạo</th>
                            <th className="py-4 px-4 text-center">Thao tác quản trị</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                        {filteredAccounts.length > 0 ? (
                            filteredAccounts.map((acc, index) => {
                                const isSelf = currentLoggedInUser && currentLoggedInUser.email === acc.email;
                                const isTargetSuperAdmin = acc.role?.toLowerCase() === 'superadmin';

                                return (
                                    <tr key={acc._id} className="hover:bg-slate-50/80 transition">
                                        <td className="py-3 px-4 font-bold text-slate-500">{index + 1}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {acc.username || acc.hoVaTen || 'Chưa cập nhật'}
                                                {isSelf && (
                                                    <span className="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-rose-200">
                                                        Tài khoản của bạn
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-slate-400 font-mono text-[11px] mt-0.5">{acc.email}</div>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                            {acc.msv || acc.MSV || '---'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                isTargetSuperAdmin
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    : acc.role === 'admin' 
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {acc.role ? acc.role.toUpperCase() : 'USER'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                                            {acc.createdAt ? new Date(acc.createdAt).toLocaleString('vi-VN', {
                                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-center space-x-2">
                                            <button
                                                onClick={() => handleResetPassword(acc._id, acc.role)}
                                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition cursor-pointer"
                                            >
                                                Đổi mật khẩu
                                            </button>
                                            
                                            <button
                                                onClick={() => handleToggleRole(acc._id, acc.role, acc.email)}
                                                disabled={isSelf || !isSuperAdmin || isTargetSuperAdmin}
                                                className={`px-3 py-1.5 font-bold rounded-xl transition ${
                                                    isSelf || !isSuperAdmin || isTargetSuperAdmin
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                        : acc.role === 'admin' 
                                                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer' 
                                                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer'
                                                }`}
                                            >
                                                {acc.role === 'admin' ? 'Hạ xuống User' : 'Nâng Admin'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(acc._id, acc.email, acc.role)}
                                                disabled={isSelf}
                                                className={`px-3 py-1.5 font-bold rounded-xl transition ${
                                                    isSelf ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer'
                                                }`}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-12 text-slate-400">
                                    Không tìm thấy tài khoản nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm tài khoản mới */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 mb-6">➕ Thêm tài khoản mới</h3>

                        <form onSubmit={handleCreateAccount} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Tên hiển thị *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                                    placeholder="VD: email@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu (Tối thiểu 6 ký tự) *</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                                    placeholder="******"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Mã sinh viên (MSV)</label>
                                <input
                                    type="text"
                                    value={formData.msv}
                                    onChange={(e) => setFormData({...formData, msv: e.target.value})}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                                    placeholder="VD: 22174600046"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none cursor-pointer"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-[#800020] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                                >
                                    Tạo tài khoản
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}