import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accounts');
            setAccounts(res.data);
            setLoading(false);
        } catch (err) {
            setError('Không thể tải danh sách tài khoản!');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            try {
                await axios.delete(`http://localhost:5000/api/accounts/${id}`);
                setAccounts(accounts.filter(acc => acc._id !== id));
            } catch (err) {
                alert('Xóa tài khoản thất bại!');
            }
        }
    };

    const handleToggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const res = await axios.put(`http://localhost:5000/api/accounts/${id}/role`, { role: newRole });
            setAccounts(accounts.map(acc => acc._id === id ? res.data : acc));
        } catch (err) {
            alert('Cập nhật quyền thất bại!');
        }
    };

    // Hàm đặt lại mật khẩu
    const handleResetPassword = async (id) => {
        const newPassword = prompt('Nhập mật khẩu mới cho tài khoản này (tối thiểu 6 ký tự):');
        if (!newPassword) return; // Nếu bấm Cancel thì thoát

        if (newPassword.length < 6) {
            alert('Mật khẩu quá ngắn! Phải từ 6 ký tự trở lên.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/accounts/${id}/reset-password`, { newPassword });
            alert('Đổi mật khẩu thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Tài khoản Hệ thống</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Tổng số: {accounts.length} tài khoản
                </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Tên / Email</th>
                            <th className="py-3 px-4">Vai trò</th>
                            <th className="py-3 px-4">Ngày tạo</th>
                            <th className="py-3 px-4 text-center">Thao tác quản trị</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {accounts.map((acc, index) => (
                            <tr key={acc._id} className="hover:bg-gray-50 transition">
                                <td className="py-3 px-4 font-medium">{index + 1}</td>
                                <td className="py-3 px-4">
                                    <div className="font-semibold text-gray-900">{acc.username || acc.hoVaTen || 'Chưa cập nhật'}</div>
                                    <div className="text-gray-500 text-xs">{acc.email}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        acc.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                            : 'bg-green-100 text-green-700 border border-green-200'
                                    }`}>
                                        {acc.role ? acc.role.toUpperCase() : 'USER'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-500 text-xs">
                                    {acc.createdAt ? new Date(acc.createdAt).toLocaleString('vi-VN', {
                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    }) : 'N/A'}
                                </td>
                                <td className="py-3 px-4 text-center space-x-2">
                                    <button
                                        onClick={() => handleResetPassword(acc._id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        onClick={() => handleToggleRole(acc._id, acc.role)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium text-white transition ${
                                            acc.role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {acc.role === 'admin' ? 'Hạ xuống User' : 'Nâng Admin'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(acc._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}