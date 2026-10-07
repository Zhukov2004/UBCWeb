import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Article, BookReview } from '../types';
import {
  FileText,
  MessageSquare,
  Clock,
  Eye,
  Heart,
  PenTool,
  Star,
  Quote,
  Sparkles,
  CheckCircle,
  PlusCircle,
  X
} from 'lucide-react';

export const LatestPosts: React.FC = () => {
  const {
    articles,
    reviews,
    currentUser,
    likeArticle,
    likeReview,
    submitArticle,
    submitReview,
    books,
    setSelectedArticle,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'reviews'>('articles');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<'article' | 'review'>('review');

  // Form states for submitting new content
  const [reviewForm, setReviewForm] = useState({
    bookId: books[0]?.id || '',
    rating: 5,
    title: '',
    content: '',
    keyTakeaway: '',
    quote: '',
  });

  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Góc cảm nhận' as Article['category'],
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
  });

  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Filter approved items for public home feed
  const approvedArticles = articles.filter((a) => a.status === 'approved');
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.title || !reviewForm.content) return;

    const selectedBook = books.find((b) => b.id === reviewForm.bookId) || books[0];

    submitReview({
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookCover: selectedBook.cover,
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      keyTakeaways: reviewForm.keyTakeaway ? [reviewForm.keyTakeaway] : ['Bài học giá trị đúc kết qua trải nghiệm.'],
      quote: reviewForm.quote || 'Sách là ngọn đèn soi sáng tri thức.',
    });

    setSubmissionSuccess('Bài review của bạn đã được gửi thành công! Admin Ban Biên tập sẽ duyệt trước khi hiển thị công khai.');
    setTimeout(() => {
      setSubmissionSuccess(null);
      setShowSubmitModal(false);
      setReviewForm({
        bookId: books[0]?.id || '',
        rating: 5,
        title: '',
        content: '',
        keyTakeaway: '',
        quote: '',
      });
    }, 2500);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) return;

    submitArticle({
      title: articleForm.title,
      summary: articleForm.summary,
      content: articleForm.content,
      coverImage: articleForm.coverImage,
      category: articleForm.category,
    });

    setSubmissionSuccess('Bài viết đã được gửi! Đang trong hàng chờ duyệt của Ban Chủ nhiệm.');
    setTimeout(() => {
      setSubmissionSuccess(null);
      setShowSubmitModal(false);
      setArticleForm({
        title: '',
        summary: '',
        content: '',
        category: 'Góc cảm nhận',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
      });
    }, 2500);
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 tracking-wider uppercase">
              <span className="w-6 h-0.5 bg-red-700"></span>
              <span>Góc Lan Tỏa Tri Thức</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-serif-title">
              Bài Viết Mới & Cảm Nhận Sách
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Nơi các thành viên UBC UNETI chia sẻ góc nhìn sâu sắc, kinh nghiệm và những trang sách yêu thích.
            </p>
          </div>

          {/* Sub Tab buttons & Write Post CTA */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setActiveSubTab('articles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'articles'
                    ? 'bg-white text-red-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bài viết CLB ({approvedArticles.length})
              </button>
              <button
                onClick={() => setActiveSubTab('reviews')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'reviews'
                    ? 'bg-white text-red-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Góc Review Sách ({approvedReviews.length})
              </button>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Gửi bài viết</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Articles Content */}
        {activeSubTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-red-200 transition-all hover:shadow-xl flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-red-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-red-700 transition line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.authorAvatar}
                      alt={article.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {article.authorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeArticle(article.id);
                      }}
                      className="flex items-center gap-1 hover:text-red-600 transition"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{article.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Book Reviews Content */}
        {activeSubTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-200 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Book header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={rev.bookCover}
                      alt={rev.bookTitle}
                      className="w-16 h-22 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                        Cảm nhận sách
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{rev.bookTitle}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Viết bởi {rev.authorName} ({rev.authorGen}) • {rev.createdAt}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 font-serif-title">
                    "{rev.title}"
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                    {rev.content}
                  </p>

                  {/* Quote block */}
                  {rev.quote && (
                    <div className="mt-4 p-3 bg-red-50/70 border-l-3 border-red-700 rounded-r-lg text-xs italic text-red-950 flex items-start gap-2">
                      <Quote className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{rev.quote}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.authorAvatar}
                      alt={rev.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-600">{rev.authorName}</span>
                  </div>

                  <button
                    onClick={() => likeReview(rev.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-700 transition"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Hữu ích ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Submit Article / Book Review (Strictly moderated) */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Đóng góp bài viết cho UBC UNETI</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1 font-serif-title">
                Gửi Bài Viết Hoặc Cảm Nhận Sách
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mọi bài viết gửi lên sẽ được Ban Biên tập CLB duyệt kỹ lưỡng để đảm bảo chất lượng nội dung trước khi hiển thị.
              </p>

              {submissionSuccess ? (
                <div className="my-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-sm text-emerald-900">{submissionSuccess}</p>
                </div>
              ) : (
                <>
                  {/* Type selector */}
                  <div className="mt-5 flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSubmitType('review')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                        submitType === 'review'
                          ? 'bg-white text-red-800 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      Cảm nhận & Review sách
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitType('article')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                        submitType === 'article'
                          ? 'bg-white text-red-800 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      Bài viết / Tin tức CLB
                    </button>
                  </div>

                  {submitType === 'review' ? (
                    <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Chọn sách bạn muốn review *
                        </label>
                        <select
                          value={reviewForm.bookId}
                          onChange={(e) => setReviewForm({ ...reviewForm, bookId: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        >
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title} - {b.author}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Đánh giá (Số sao)
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="p-1 focus:outline-hidden"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewForm.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tiêu đề bài cảm nhận *
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Cuốn sách làm thay đổi góc nhìn về sự kiên trì..."
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nội dung chia sẻ *
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Chia sẻ cảm xúc, những chi tiết làm bạn ấn tượng nhất..."
                          value={reviewForm.content}
                          onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Trích dẫn tâm đắc (Quote)
                        </label>
                        <input
                          type="text"
                          placeholder="Câu nói chạm đến bạn nhất trong tác phẩm..."
                          value={reviewForm.quote}
                          onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSubmitModal(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800 shadow-md"
                        >
                          Gửi duyệt bài review
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleArticleSubmit} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Chuyên mục *
                        </label>
                        <select
                          value={articleForm.category}
                          onChange={(e) =>
                            setArticleForm({
                              ...articleForm,
                              category: e.target.value as Article['category'],
                            })
                          }
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                        >
                          <option value="Góc cảm nhận">Góc cảm nhận</option>
                          <option value="Kinh nghiệm đọc">Kinh nghiệm đọc</option>
                          <option value="Workshop & Tọa đàm">Workshop & Tọa đàm</option>
                          <option value="Tin tức CLB">Tin tức CLB</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tiêu đề bài viết *
                        </label>
                        <input
                          type="text"
                          placeholder="Tiêu đề bài viết..."
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tóm tắt ngắn (1-2 câu) *
                        </label>
                        <input
                          type="text"
                          placeholder="Mô tả ngắn gọn nội dung bài viết..."
                          value={articleForm.summary}
                          onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nội dung chi tiết *
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Nội dung bài viết..."
                          value={articleForm.content}
                          onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSubmitModal(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800 shadow-md"
                        >
                          Gửi bài chờ duyệt
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
