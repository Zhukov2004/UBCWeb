import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClubMeeting } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Plus,
  AlertCircle,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export const ClubSchedule: React.FC = () => {
  const { meetings, currentUser, rsvpMeeting, createMeeting } = useApp();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<{ message: string; success: boolean } | null>(null);

  // Form for new meeting (Admin)
  const [newMeetingForm, setNewMeetingForm] = useState({
    title: '',
    type: 'CLB Đọc sách (Reading Circle)' as ClubMeeting['type'],
    date: '',
    time: '',
    location: '',
    targetAudience: 'Toàn thể thành viên UBC UNETI',
    description: '',
    speaker: '',
    maxAttendees: 40,
    agendaStr: '',
    status: 'upcoming' as ClubMeeting['status'],
  });

  const handleRSVP = (meetingId: string) => {
    const res = rsvpMeeting(meetingId);
    setRsvpFeedback({ message: res.message, success: res.success });
    setTimeout(() => setRsvpFeedback(null), 4000);
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingForm.title || !newMeetingForm.date || !newMeetingForm.location) return;

    createMeeting({
      title: newMeetingForm.title,
      type: newMeetingForm.type,
      date: newMeetingForm.date,
      time: newMeetingForm.time || '19:30 - 21:00',
      location: newMeetingForm.location,
      targetAudience: newMeetingForm.targetAudience,
      description: newMeetingForm.description,
      speaker: newMeetingForm.speaker,
      maxAttendees: Number(newMeetingForm.maxAttendees) || 50,
      agenda: newMeetingForm.agendaStr
        ? newMeetingForm.agendaStr.split('\n').filter((l) => l.trim().length > 0)
        : ['19:30: Điểm danh và khai mạc', '20:00: Thảo luận chuyên đề', '21:00: Bế mạc'],
      status: 'upcoming',
    });

    setShowCreateModal(false);
    setNewMeetingForm({
      title: '',
      type: 'CLB Đọc sách (Reading Circle)',
      date: '',
      time: '',
      location: '',
      targetAudience: 'Toàn thể thành viên UBC UNETI',
      description: '',
      speaker: '',
      maxAttendees: 40,
      agendaStr: '',
      status: 'upcoming',
    });
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 tracking-wider uppercase">
              <span className="w-6 h-0.5 bg-red-700"></span>
              <span>Gặp Gỡ & Sinh Hoạt Định Kỳ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-serif-title">
              Lịch Hoạt Động & Họp Câu Lạc Bộ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Các buổi sinh hoạt văn hóa đọc, tọa đàm chuyên đề và họp mặt triển khai dự án tại hai cơ sở Hà Nội & Nam Định.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Lên lịch họp mới</span>
            </button>
          )}
        </div>

        {/* Feedback message */}
        {rsvpFeedback && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
              rsvpFeedback.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {rsvpFeedback.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{rsvpFeedback.message}</span>
          </div>
        )}

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meetings.map((meeting) => {
            const isUserRegistered = currentUser
              ? meeting.registeredUsers.some((u) => u.userId === currentUser.id)
              : false;
            const isFull = meeting.registeredUsers.length >= meeting.maxAttendees;

            return (
              <div
                key={meeting.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-red-200 p-6 flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden"
              >
                {/* Type Badge & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                      {meeting.type}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Sắp diễn ra
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-3 leading-snug">
                    {meeting.title}
                  </h3>

                  {/* Date, Time, Location */}
                  <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{meeting.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                    {meeting.description}
                  </p>

                  {/* Agenda preview */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Chương trình dự kiến:
                    </span>
                    <ul className="mt-1 space-y-1">
                      {meeting.agenda.slice(0, 3).map((item, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-500 flex items-start gap-1.5"
                        >
                          <span className="text-red-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* RSVP Bottom Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>
                      {meeting.registeredUsers.length}/{meeting.maxAttendees} người
                    </span>
                  </div>

                  {isUserRegistered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Đã đăng ký</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRSVP(meeting.id)}
                      disabled={isFull}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                      }`}
                    >
                      <span>{isFull ? 'Hết chỗ' : 'Tham gia'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Create Meeting (Admin only) */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-red-700" />
                <span>Lên kế hoạch hoạt động CLB</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1 font-serif-title">
                Tạo Buổi Họp / Sinh Hoạt Mới
              </h3>
              <p className="text-xs text-slate-500">
                Thông báo đẩy sẽ được gửi tự động tới các thành viên CLB sau khi tạo.
              </p>

              <form onSubmit={handleCreateMeeting} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại sự kiện *</label>
                  <select
                    value={newMeetingForm.type}
                    onChange={(e) =>
                      setNewMeetingForm({
                        ...newMeetingForm,
                        type: e.target.value as ClubMeeting['type'],
                      })
                    }
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  >
                    <option value="CLB Đọc sách (Reading Circle)">CLB Đọc sách (Reading Circle)</option>
                    <option value="Họp định kỳ">Họp định kỳ Ban Chủ nhiệm</option>
                    <option value="Workshop & Kỹ năng">Workshop & Kỹ năng</option>
                    <option value="Tọa đàm chuyên gia">Tọa đàm chuyên gia</option>
                    <option value="Gặp mặt tân thành viên">Gặp mặt tân thành viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiêu đề buổi sinh hoạt *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Reading Circle #25: Nghệ thuật đàm phán..."
                    value={newMeetingForm.title}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, title: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày diễn ra *</label>
                    <input
                      type="date"
                      value={newMeetingForm.date}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian</label>
                    <input
                      type="text"
                      placeholder="19:30 - 21:00"
                      value={newMeetingForm.time}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa điểm / Phòng họp *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Hội trường HA8 CS Minh Khai hoặc Google Meet"
                    value={newMeetingForm.location}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, location: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới hạn số lượng tham gia
                  </label>
                  <input
                    type="number"
                    value={newMeetingForm.maxAttendees}
                    onChange={(e) =>
                      setNewMeetingForm({ ...newMeetingForm, maxAttendees: Number(e.target.value) })
                    }
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả nội dung</label>
                  <textarea
                    rows={3}
                    placeholder="Mục đích và nội dung cốt lõi của buổi sinh hoạt..."
                    value={newMeetingForm.description}
                    onChange={(e) =>
                      setNewMeetingForm({ ...newMeetingForm, description: e.target.value })
                    }
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chương trình dự kiến (Mỗi dòng một mục)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="19:30: Check-in&#10;19:45: Thảo luận nhóm&#10;20:30: Chia sẻ kinh nghiệm"
                    value={newMeetingForm.agendaStr}
                    onChange={(e) =>
                      setNewMeetingForm({ ...newMeetingForm, agendaStr: e.target.value })
                    }
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-red-600 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800 shadow-md"
                  >
                    Tạo & Gửi thông báo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
