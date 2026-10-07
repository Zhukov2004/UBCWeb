import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Flame
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'Kể cho mình về ngày thành lập UBC 21/04/2018 (Gen 1)',
  'Chuyến xe thiện nguyện Tuyên Quang 07/04/2024 có ý nghĩa gì?',
  'Ai là Chủ nhiệm CLB qua các thời kỳ Gen 1 - Gen 7?',
  'Cơ cấu CLB trực thuộc Trung tâm Thư viện UNETI như thế nào?',
  'Cách thức đăng ký gia nhập UBC Gen 7 hiện tại?',
];

export const UbcHistoryChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Xin chào bạn! Mình là **UBC Genius** - Trợ lý AI chuyên trách tìm hiểu Lịch sử & Truyền thống **Câu Lạc Bộ Sách Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI)**.

Bạn có thể hỏi mình bất kỳ điều gì về:
- Các thế hệ **Gen 1 đến Gen 7** của UBC
- Ban Chủ nhiệm và các gương mặt tiêu biểu qua các thời kỳ
- Mốc thành lập **21/04/2018** trực thuộc Trung tâm Thư viện UNETI
- Chuyến xe thiện nguyện **Tuyên Quang 07/04/2024** và các mốc son 10 năm

Hãy chọn câu hỏi gợi ý bên dưới hoặc gõ câu hỏi của bạn nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare conversation history payload
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!res.ok) {
        throw new Error('Lỗi khi gửi yêu cầu tới máy chủ');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Xin lỗi bạn, tôi chưa có phản hồi thích hợp.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Rất tiếc, đã xảy ra sự cố kết nối tới máy chủ. Vui lòng thử lại sau giây lát!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: 'Cuộc trò chuyện đã được làm mới. Bạn muốn tìm hiểu về mốc lịch sử nào của UBC UNETI?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button: Single circular button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-800 via-red-900 to-red-950 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-red-400/50 group cursor-pointer"
          title="Trò chuyện với UBC Genius AI (Lịch sử CLB)"
          aria-label="Mở trợ lý AI UBC Genius"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-red-950"></span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col overflow-hidden bg-white border border-red-200 rounded-3xl ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight font-serif-title">
                    UBC Genius • Lịch Sử CLB
                  </h3>
                  <span className="text-[10px] bg-red-700/80 text-rose-100 px-2 py-0.2 rounded-full font-bold">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[10px] text-rose-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Đang trực tuyến • Sẵn sàng giải đáp về các Gen</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-rose-100">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
                title="Làm mới hội thoại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition hidden sm:block"
                title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
                title="Đóng chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scrollable Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-700 to-red-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-red-700 text-white rounded-br-xs shadow-md shadow-red-700/15'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {/* Message content formatted */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        {paragraph.split('**').map((part, idx) =>
                          idx % 2 === 1 ? (
                            <strong key={idx} className={msg.role === 'user' ? 'font-black' : 'font-bold text-red-900'}>
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Message footer */}
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      msg.role === 'user' ? 'text-rose-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-slate-700"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4 text-rose-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-700 to-red-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 shadow-xs flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[11px] text-slate-400">Đang lục tìm tư liệu UBC...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-600" />
              <span>Gợi ý:</span>
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-700 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200 hover:border-red-200 shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Hỏi về lịch sử các Gen, mốc thời gian, nhân sự UBC..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 bg-slate-50 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white disabled:bg-slate-200 disabled:text-slate-400 transition shadow-md shadow-red-700/20 active:scale-95 shrink-0"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
