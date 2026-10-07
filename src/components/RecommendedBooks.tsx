import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { BookOpen, Star, Search, Filter, CheckCircle2, AlertCircle, ArrowUpRight, Heart, BookmarkCheck } from 'lucide-react';

export const RecommendedBooks: React.FC = () => {
  const { books, borrowBook, setSelectedBook } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const categories = ['Tất cả', 'Phát triển bản thân', 'Kỹ năng giao tiếp', 'Kinh tế & Tài chính', 'Văn học thế giới', 'Văn học cảm xúc', 'Giáo dục & Cảm hứng'];

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'Tất cả' || book.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBorrow = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    const result = borrowBook(book.id);
    setActionMessage({
      text: result.message,
      type: result.success ? 'success' : 'error',
    });
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 tracking-wider uppercase">
              <span className="w-6 h-0.5 bg-red-700"></span>
              <span>Tủ Sách UBC Khuyên Đọc</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-serif-title">
              Danh Sách Sách Gợi Ý & Thư Viện Sinh Viên
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Được tuyển chọn kỹ lưỡng bởi Ban Chuyên môn UBC UNETI dành cho sinh viên phát triển kỹ năng và tư duy.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sách, tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-slate-50"
            />
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Categories Tab Pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-800 text-white shadow-md shadow-red-800/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group relative bg-white border border-slate-200 hover:border-red-200 rounded-2xl p-4 transition-all hover:shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 shadow-inner">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{book.rating}</span>
                      <span className="text-white/60">({book.reviewCount})</span>
                    </div>

                    <div
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs ${
                        isAvailable
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-rose-600/90 text-white'
                      }`}
                    >
                      {isAvailable ? `Còn ${book.availableCopies} cuốn` : 'Đã mượn hết'}
                    </div>
                  </div>

                  {/* Category & Title */}
                  <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-1">
                    {book.category}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-red-700 transition">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tác giả: <span className="font-medium text-slate-700">{book.author}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {book.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 italic">
                    {book.totalPages} trang • {book.curatedBy}
                  </span>

                  <button
                    onClick={(e) => handleBorrow(e, book)}
                    disabled={!isAvailable}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isAvailable
                        ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Mượn sách' : 'Hết sách'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
