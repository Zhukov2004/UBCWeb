import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { currentUser, activePushAlert, dismissPushAlert, setActiveTab, setAdminInitialTab } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  if (!activePushAlert) return null;

  const handleAction = () => {
    if (activePushAlert.actionLink) {
      if (isAdmin && activePushAlert.targetRole === 'admin') {
        setActiveTab('admin');
        if (activePushAlert.actionLink.tab) {
          setAdminInitialTab(activePushAlert.actionLink.tab);
        }
      } else {
        setActiveTab('meetings');
      }
    }
    dismissPushAlert();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-red-600/40 relative overflow-hidden backdrop-blur-md">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-rose-600"></div>

        <button
          onClick={dismissPushAlert}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-700/80 text-white flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 pr-4">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              {isAdmin && activePushAlert.targetRole === 'admin'
                ? 'Thông Báo Quản Trị Mới'
                : 'Lịch Sự Kiện CLB Mới'}
            </span>
            <h4 className="font-bold text-xs text-white mt-0.5 leading-snug">
              {activePushAlert.title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
              {activePushAlert.message}
            </p>

            {activePushAlert.actionLink && (
              <button
                onClick={handleAction}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white underline transition cursor-pointer"
              >
                <span>
                  {isAdmin && activePushAlert.targetRole === 'admin'
                    ? 'Xem & Duyệt ngay tại Trang Quản trị'
                    : 'Xem chi tiết lịch sự kiện CLB'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
