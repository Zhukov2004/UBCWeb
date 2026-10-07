import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Eye, Heart, X, Share2, Bookmark, BookOpen } from 'lucide-react';

export const ArticleDetailModal: React.FC = () => {
  const { selectedArticle, setSelectedArticle, likeArticle } = useApp();

  if (!selectedArticle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto border border-red-100">
        <button
          onClick={() => setSelectedArticle(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={selectedArticle.coverImage}
            alt={selectedArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-[10px] font-bold bg-red-700 text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
              {selectedArticle.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-2 font-serif-title leading-snug">
              {selectedArticle.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-rose-100/90 mt-2">
              <span>{selectedArticle.publishedAt}</span>
              <span>•</span>
              <span>Thời gian đọc: {selectedArticle.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-6 sm:p-8">
          {/* Author info */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={selectedArticle.authorAvatar}
                alt={selectedArticle.authorName}
                className="w-10 h-10 rounded-full object-cover border border-red-200"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-900">{selectedArticle.authorName}</h4>
                <p className="text-[11px] text-red-700 font-semibold">{selectedArticle.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => likeArticle(selectedArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition"
              >
                <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                <span>Thích ({selectedArticle.likes})</span>
              </button>
            </div>
          </div>

          {/* Lead Summary */}
          <p className="text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border-l-4 border-red-700 mb-6 italic">
            "{selectedArticle.summary}"
          </p>

          {/* Body paragraphs */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              © Câu lạc bộ Sách Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI)
            </span>
            <button
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Đóng bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
