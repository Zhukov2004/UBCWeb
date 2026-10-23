import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Members from './pages/public/Members'; // <-- Đảm bảo đã import trang Members
import AdminMembers from './pages/admin/AdminMembers';
import AdminUsers from './pages/admin/AdminUsers';
import CoreTeamGenPage from './pages/CoreTeamGenPage';
import Profile from './pages/Profile';
import About from './pages/public/About';
import ShiftManagement from './pages/public/ShiftManagement';
import AdminShifts from './pages/admin/AdminShifts';
export default function App() {
  return (
    <Router>
      <Navbar /> {/* Thanh điều hướng hiển thị xuyên suốt các trang */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/shifts" element={<AdminShifts />} />
        {/* THÊM DÒNG NÀY ĐỂ KHẮC PHỤC LỖI KHỚP ROUTE */}
        <Route path="/members" element={<Members />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/core-team/:gen" element={<CoreTeamGenPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/shifts" element={<ShiftManagement />} />
      </Routes>
    </Router>
  );
}