import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Members from './pages/public/Members'; // <-- Đảm bảo đã import trang Members

export default function App() {
  return (
    <Router>
      <Navbar /> {/* Thanh điều hướng hiển thị xuyên suốt các trang */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* THÊM DÒNG NÀY ĐỂ KHẮC PHỤC LỖI KHỚP ROUTE */}
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}