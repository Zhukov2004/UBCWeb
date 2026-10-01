import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Các route khác sẽ được thêm vào đây sau */}
      </Routes>
    </BrowserRouter>
  );
}