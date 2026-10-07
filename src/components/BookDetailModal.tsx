import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  BookmarkCheck,
  Heart,
  Share2,
  X,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const { selectedBook, setSelectedBook, borrowBook, reviews, currentUser, submitReview } = useApp();
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [borrowMessage, setBorrowMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!selectedBook) return null;

  const bookReviews = reviews.filter((r) => r.bookId === selectedBook.id && r.status === 'approved');

  const handleBorrow = () => {
    const res = borrowBook(selectedBook.id);
    setBorrowMessage({ text: res.message, success: res.success });
    setTimeout(() => setBorrowMessage(null), 4000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    submitReview({
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookCover: selectedBook.cover,
      rating: reviewRating,
      title: reviewTitle.trim(),
      content: reviewContent.trim(),
      keyTakeaways: ['Bài học rút ra từ tác phẩm.'],
      quote: 'Cuốn sách mang đến nhiều giá trị sâu sắc.',
    });

    setShowReviewInput(false);
    setReviewTitle('');
    setReviewContent('');
    setBorrowMessage({
      text: 'Bài review của bạn đã được gửi tới Ban Biên tập để duyệt!',
      success: true,
    });
    setTimeout(() => setBorrowMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-red-100">
        <button
          onClick={() => setSelectedBook(null)}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {borrowMessage && (
          <div
            className={`mb-4 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              borrowMessage.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {borrowMessage.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{borrowMessage.text}</span>
          </div>
        )}

        {/* Book Overview */}
        <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-slate-100">
          <img
            src={selectedBook.cover}
            alt={selectedBook.title}
            className="w-36 h-52 sm:w-44 sm:h-64 object-cover rounded-2xl shadow-lg border border-slate-200 mx-auto sm:mx-0 shrink-0"
          />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                {selectedBook.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-serif-title">
                {selectedBook.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tác giả: <span className="font-semibold text-slate-700">{selectedBook.author}</span>
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedBook.rating}</span>
                </div>
                <span className="text-xs text-slate-400">
                  ({selectedBook.reviewCount} lượt đánh giá)
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedBook.totalPages} trang
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
                {selectedBook.description}
              </p>
            </div>

            {/* Borrow CTA */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Tình trạng sách trong kho:</span>
                <span
                  className={`text-xs font-bold ${
                    selectedBook.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {selectedBook.availableCopies > 0
                    ? `Sẵn sàng mượn (${selectedBook.availableCopies}/${selectedBook.totalCopies} cuốn)`
                    : 'Tạm thời đã được mượn hết'}
                </span>
              </div>

              <button
                onClick={handleBorrow}
                disabled={selectedBook.availableCopies <= 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedBook.availableCopies > 0
                    ? 'bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-700/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{selectedBook.availableCopies > 0 ? 'Mượn sách' : 'Hết sách'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-700" />
              <span>Góc Cảm Nhận & Đánh Giá Của Thành Viên ({bookReviews.length})</span>
            </h3>

            <button
              onClick={() => setShowReviewInput(!showReviewInput)}
              className="text-xs font-bold text-red-700 hover:underline"
            >
              {showReviewInput ? 'Đóng form' : '+ Viết cảm nhận của bạn'}
            </button>
          </div>

          {/* Form write review */}
          {showReviewInput && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-5 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Đánh giá sao:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setReviewRating(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tiêu đề cảm nhận *
                </label>
                <input
                  type="text"
                  placeholder="Tiêu đề bài review..."
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white focus:outline-hidden focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nội dung chia sẻ *
                </label>
                <textarea
                  rows={3}
                  placeholder="Viết cảm nhận của bạn sau khi đọc cuốn sách này..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white focus:outline-hidden focus:border-red-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReviewInput(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs"
                >
                  Gửi kiểm duyệt
                </button>
              </div>
            </form>
          )}

          {bookReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
              Chưa có review nào được xuất bản cho cuốn sách này. Hãy là người đầu tiên chia sẻ cảm nhận!
            </p>
          ) : (
            <div className="space-y-3">
              {bookReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800">{rev.authorName}</span>
                      <span className="text-[10px] text-slate-400">({rev.authorGen})</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">"{rev.title}"</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
