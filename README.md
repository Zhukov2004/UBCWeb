<div align="center">

  <img src="public/logoclb.jpg" alt="UBC Logo" width="120" height="120" style="border-radius: 50%; border: 3px solid #800020; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />

  # 📚 Uneti's Book Club (UBC)
  <p><strong>Cổng thông tin chính thức & Giao diện giới thiệu Câu lạc bộ Sách Đại học Kinh tế - Kỹ thuật Công nghiệp</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Theme-Red%20%23800020-800020?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Theme">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38Bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  </p>

  <p>
    <a href="#-giới-thiệu">Giới thiệu</a> •
    <a href="#-tính-năng-nổi-bật">Tính năng</a> •
    <a href="#-giao-diện--cấu-trúc">Cấu trúc</a> •
    <a href="#-công-nghệ-sử-dụng">Công nghệ</a> •
    <a href="#-hướng-dẫn-cài-đặt">Cài đặt</a> •
    <a href="#-định-hướng-tương-lai">Tương lai</a>
  </p>
</div>

---

## 🌟 Giới thiệu dự án

**Uneti's Book Club (UBC)** là không gian số năng động dành cho các bạn sinh viên yêu mến sách tại trường **Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI)**. Dự án được xây dựng nhằm mục đích:
- 📖 Lan tỏa văn hóa đọc, giới thiệu những đầu sách hay và giá trị nhân văn đến cộng đồng sinh viên.
- 🤝 Kết nối các bạn trẻ có cùng niềm đam mê qua các buổi tọa đàm, hội sách và sự kiện giao lưu học thuật.
- 🎨 Xây dựng bộ nhận diện số hiện đại, chuyên nghiệp, thể hiện tinh thần tuổi trẻ UNETI nhiệt huyết và sáng tạo.

---

## 🚀 Tính năng nổi bật

- **🎨 Red-and-White Theme độc quyền**: Sử dụng gam màu đỏ rượu chủ đạo (`#800020`) kết hợp cùng nền trắng/xám hiện đại, mang lại cảm giác trang trọng nhưng trẻ trung.
- **📱 Responsive toàn diện**: Tối ưu hóa hoàn hảo trên mọi thiết bị từ màn hình máy tính lớn đến điện thoại di động nhờ hệ thống **Tailwind CSS**.
- **🧭 Thanh điều hướng linh hoạt (Sticky Navbar)**: Cố định thông minh, tích hợp menu thu gọn (hamburger menu) mượt mà cho trải nghiệm mobile.
- **📊 Hiệu ứng số nhảy động (Stats Counter)**: Hiệu ứng số trực quan thể hiện quy mô hoạt động của CLB (Số lượng thành viên, đầu sách, lượt tương tác, sự kiện).
- **🧩 Tái sử dụng Component**: Tách bạch các thành phần giao diện (`Navbar`, `Footer`, `Hero Section`) giúp mã nguồn sạch sẽ, dễ bảo trì và mở rộng.

---

## 📂 Cấu trúc mã nguồn

Dự án được tổ chức theo mô hình Component-based chuẩn mực của React/Vite:

```text
book-club-web/
├── public/
│   └── logoclb.jpg          # Logo chính thức của CLB
├── src/
│   ├── assets/
│   │   └── tuyenquang.JPG   # Ảnh tập thể banner chất lượng cao
│   ├── components/
│   │   ├── Navbar.jsx       # Thanh điều hướng (hỗ trợ mobile dropdown)
│   │   └── Footer.jsx       # Chân trang (giới thiệu đa cột & thông tin liên hệ)
│   ├── pages/
│   │   └── public/
│   │       └── Home.jsx     # Trang chủ chính
│   ├── App.jsx              # Khởi tạo định tuyến (React Router)
│   ├── main.jsx             # Điểm vào ứng dụng React
│   └── index.css            # Cấu hình Tailwind CSS
├── package.json
└── README.md

🛠 Công nghệ sử dụng
Frontend Core: React.js (v18), React Router DOM (v6)

Build Tool: Vite (cực kỳ nhanh chóng và tối ưu hóa tài nguyên)

Styling: Tailwind CSS (Utility-first CSS framework)

Icons: Lucide React (Thư viện icon hiện đại, sắc nét)

Phông chữ: Montserrat / Font hệ thống tiêu chuẩn thanh lịch, dễ đọc

⚙️ Hướng dẫn cài đặt và chạy dự án
Để chạy thử dự án này trên máy cá nhân của bạn, hãy làm theo các bước sau:

Clone repository về máy:

Bash
git clone [https://github.com/username/book-club-web.git](https://github.com/username/book-club-web.git)
cd book-club-web
Cài đặt các gói thư viện phụ thuộc:

Bash
npm install
Chạy môi trường phát triển (Development Server):

Bash
npm run dev
Truy cập ứng dụng:
Mở trình duyệt và truy cập vào đường dẫn hiển thị trên terminal (thường là http://localhost:5173).

🔮 Định hướng phát triển tương lai
🔄 Tích hợp Backend Database: Di chuyển dữ liệu quản lý thành viên và tài liệu sang MongoDB với kiến trúc Node.js / Express API.

🛠 Trang quản trị (Admin Dashboard): Xây dựng khu vực quản lý riêng dành cho Ban Chủ Nhiệm để kiểm duyệt nội dung, quản lý sự kiện và cập nhật thông tin thành viên linh hoạt.

📝 Góc Review Sách & Blog: Bổ sung chuyên trang chia sẻ cảm nhận sách do chính các thành viên CLB chấp bút.