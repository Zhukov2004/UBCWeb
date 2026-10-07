// Tự động nhận diện môi trường:
// - Nếu chạy lệnh `npm run dev` (development), dùng http://localhost:5000
// - Nếu đã build lên host (production), dùng URL của server trên host hoặc biến môi trường VITE_API_URL
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : 'https://domain-backend-cua-ban.com'); // Thay link này bằng domain backend thực tế khi lên host