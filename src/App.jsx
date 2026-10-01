import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login'; // <-- Import trang Login vừa tạo

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* <-- Khai báo đường dẫn đăng nhập */}
      </Routes>
    </Router>
  );
}