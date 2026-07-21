import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Award, 
  User as UserIcon, 
  Users, 
  Flag, 
  Music, 
  Trophy, 
  Star, 
  Clock, 
  PenTool, 
  Send, 
  Info,
  CheckCircle,
  ShieldAlert,
  School,
  Heart
} from 'lucide-react';
import { OutstandingClass, OutstandingStudent, User } from '../types';
import SmartMediaView from './SmartMediaView';

interface ClassDetailViewProps {
  classId: string;
  outstandingClasses: OutstandingClass[];
  onBack: () => void;
  onSaveOutstandingClasses: (classes: OutstandingClass[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  currentUser: User | null;
}

export function ClassDetailView({
  classId,
  outstandingClasses,
  onBack,
  onSaveOutstandingClasses,
  showToast,
  currentUser
}: ClassDetailViewProps) {
  const cls = outstandingClasses.find(c => c.id === classId);
  const [writerName, setWriterName] = useState(currentUser ? currentUser.name : '');
  const [message, setMessage] = useState('');

  if (!cls) {
    return (
      <div className="bg-white p-6 rounded-2xl border text-center text-slate-500 font-bold">
        Không tìm thấy thông tin chi tiết lớp học này.
        <button onClick={onBack} className="block mt-4 bg-brandBlue text-white px-4 py-2 rounded-xl text-xs mx-auto">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast("Vui lòng nhập lời chúc ý nghĩa!", "error");
      return;
    }

    const newEntry = {
      name: writerName.trim() || "Khách ẩn danh",
      msg: message.trim()
    };

    const updated = outstandingClasses.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          guestbook: [newEntry, ...(c.guestbook || [])]
        };
      }
      return c;
    });

    onSaveOutstandingClasses(updated);
    setMessage('');
    showToast("Gửi lời chúc tốt đẹp đến tập thể thành công!", "success");
  };

  return (
    <div 
      onClick={onBack} 
      className="content-section bg-slate-100/50 p-4 rounded-3xl cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md animate-fade-in cursor-default max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <button 
            onClick={onBack} 
            className="text-brandBlue hover:text-brandBlue-dark font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại trang chủ
          </button>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Chi đội mạnh xuất sắc cấp trường
          </span>
        </div>

        {/* Class Banner Banner */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-inner mb-6">
          <div className="absolute right-4 bottom-0 opacity-15 transform translate-y-2">
            <Flag className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {cls.lop}
          </h2>
          <p className="text-xs text-emerald-100 font-semibold mt-1 italic">
            Slogan: "{cls.slogan}"
          </p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1">
              <UserIcon className="w-4 h-4 text-emerald-300" /> GVCN: {cls.gvcn}
            </div>
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1">
              <Users className="w-4 h-4 text-emerald-300" /> Sĩ số: {cls.total} học sinh
            </div>
          </div>
        </div>

        {/* Stats and indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
          <div className="bg-slate-50 p-4 border rounded-xl shadow-inner">
            <span className="text-slate-400 font-extrabold block text-[10px] uppercase">Học lực giỏi/khá</span>
            <span className="text-xl font-extrabold text-emerald-600">82.5%</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '82.5%' }}></div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 border rounded-xl shadow-inner">
            <span className="text-slate-400 font-extrabold block text-[10px] uppercase">Hạnh kiểm tốt</span>
            <span className="text-xl font-extrabold text-brandBlue">100%</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
              <div className="bg-brandBlue h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 border rounded-xl shadow-inner">
            <span className="text-slate-400 font-extrabold block text-[10px] uppercase">Chuyên cần năm học</span>
            <span className="text-xl font-extrabold text-brandOrange">99.8%</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
              <div className="bg-brandOrange h-1.5 rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Achievements list */}
        <div className="mb-6">
          <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5 border-b pb-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Bảng vàng thành tích tập thể
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold">
            {cls.achievements && cls.achievements.map((a, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guestbook Section */}
        <div className="border-t pt-5">
          <h4 className="font-extrabold text-xs text-brandBlue uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-brandOrange animate-pulse" /> Lưu bút chúc mừng lớp học
          </h4>
          
          <form onSubmit={handleGuestbookSubmit} className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <input 
              type="text" 
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder="Tên của bạn..." 
              className="w-full sm:w-1/3 text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue font-bold bg-slate-50 focus:bg-white"
              required
            />
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời chúc/động viên tập thể lớp..." 
              className="flex-1 text-xs px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue font-medium bg-slate-50 focus:bg-white"
              required
            />
            <button 
              type="submit"
              className="bg-brandBlue hover:bg-brandBlue-dark text-white text-xs font-bold px-4 py-2.5 sm:py-0 rounded-xl transition shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Gửi
            </button>
          </form>

          <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {cls.guestbook && cls.guestbook.length > 0 ? (
              cls.guestbook.map((g, idx) => (
                <div key={idx} className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl text-xs">
                  <div className="flex justify-between items-center font-bold text-[9px] mb-1">
                    <span className="text-brandBlue"><UserIcon className="w-3 h-3 inline mr-1" /> {g.name}</span>
                    <span className="text-slate-400 font-mono">Ý kiến chúc mừng số hóa</span>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed">"{g.msg}"</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-3 italic text-xs font-semibold">
                Lớp học chưa nhận được lưu bút nào. Hãy là người đầu tiên chúc mừng!
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-[10px] text-slate-400 font-semibold italic border-t pt-3 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-300" /> Bấm ra khoảng trống bên ngoài biểu mẫu để quay về Trang chủ nhanh chóng!
        </div>
      </div>
    </div>
  );
}

interface StudentDetailViewProps {
  studentId: number;
  outstandingStudents: OutstandingStudent[];
  onBack: () => void;
  onSaveOutstandingStudents: (students: OutstandingStudent[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  currentUser: User | null;
}

export function StudentDetailView({
  studentId,
  outstandingStudents,
  onBack,
  onSaveOutstandingStudents,
  showToast,
  currentUser
}: StudentDetailViewProps) {
  const std = outstandingStudents.find(s => s.id === studentId);
  const [writerName, setWriterName] = useState(currentUser ? currentUser.name : '');
  const [message, setMessage] = useState('');

  if (!std) {
    return (
      <div className="bg-white p-6 rounded-2xl border text-center text-slate-500 font-bold">
        Không tìm thấy thông tin chi tiết học sinh này.
        <button onClick={onBack} className="block mt-4 bg-brandBlue text-white px-4 py-2 rounded-xl text-xs mx-auto">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast("Vui lòng nhập lời khen tặng!", "error");
      return;
    }

    const newEntry = {
      name: writerName.trim() || "Khách ẩn danh",
      msg: message.trim()
    };

    const updated = outstandingStudents.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          guestbook: [newEntry, ...(s.guestbook || [])]
        };
      }
      return s;
    });

    onSaveOutstandingStudents(updated);
    setMessage('');
    showToast(`Đã gửi lời chúc vinh danh cho em ${std.name} thành công!`, "success");
  };

  return (
    <div 
      onClick={onBack} 
      className="content-section bg-slate-100/50 p-4 rounded-3xl cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md animate-fade-in cursor-default max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <button 
            onClick={onBack} 
            className="text-brandBlue hover:text-brandBlue-dark font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại trang chủ
          </button>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600 animate-bounce" /> Học sinh danh dự cấp trường
          </span>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0">
            <SmartMediaView url={std.avatar} alt={std.name} className="w-full h-full object-cover animate-fade-in" />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {std.name}
            </h2>
            <p className="text-xs text-brandOrange font-bold mt-1">
              Danh hiệu: {std.badge}
            </p>
            
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-slate-400" /> Lớp: <b className="text-slate-800">{std.class}</b>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" /> GPA: <b className="text-slate-800">{std.gpa}</b>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Hạnh kiểm: <b className="text-slate-800">{std.conduct}</b>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-xs">
          {/* Awards Cabinet */}
          <div className="bg-white p-4 border rounded-xl shadow-sm">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5 border-b pb-2">
              <Trophy className="w-4 h-4 text-yellow-500" /> Tủ cúp thành tích xuất sắc
            </h4>
            <ul className="space-y-2 text-slate-600 font-semibold">
              {std.achievements && std.achievements.map((a, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 py-1.5 rounded-lg border border-slate-100">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic subject GPAs */}
          <div className="bg-white p-4 border rounded-xl shadow-sm">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5 border-b pb-2">
              <Star className="w-4 h-4 text-brandBlue fill-brandBlue/10" /> Học bạ năng lực học vụ
            </h4>
            <div className="space-y-3 font-semibold text-slate-700">
              {Object.keys(std.subjects).map((subName) => {
                const score = std.subjects[subName];
                const pct = score * 10;
                let colorClass = "bg-brandBlue";
                if (score >= 9.5) colorClass = "bg-brandOrange";
                else if (score >= 9.0) colorClass = "bg-emerald-500";

                return (
                  <div key={subName}>
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span>{subName}</span>
                      <span>{score.toFixed(1)} / 10.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full border">
                      <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Congratulatory Wall */}
        <div className="border-t pt-5">
          <h4 className="font-extrabold text-xs text-brandBlue uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse fill-rose-50" /> Gửi lời khen tặng &amp; Động viên em
          </h4>
          
          <form onSubmit={handleGuestbookSubmit} className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <input 
              type="text" 
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder="Họ tên người khen tặng..." 
              className="w-full sm:w-1/3 text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue font-bold bg-slate-50 focus:bg-white"
              required
            />
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời khen tặng vinh quang, ý nghĩa..." 
              className="flex-1 text-xs px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue font-medium bg-slate-50 focus:bg-white"
              required
            />
            <button 
              type="submit"
              className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs font-bold px-4 py-2.5 sm:py-0 rounded-xl transition shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Khen tặng
            </button>
          </form>

          <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {std.guestbook && std.guestbook.length > 0 ? (
              std.guestbook.map((g, idx) => (
                <div key={idx} className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-xl text-xs">
                  <div className="flex justify-between items-center font-bold text-[9px] mb-1">
                    <span className="text-rose-700 flex items-center gap-1"><Award className="w-3 h-3 text-rose-500" /> {g.name}</span>
                    <span className="text-slate-400 font-mono">Khen tặng lưu niệm số</span>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed">"{g.msg}"</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-3 italic text-xs font-semibold">
                Chưa có lời nhắn khen tặng nào. Hãy gửi lời khích lệ đầu tiên!
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-[10px] text-slate-400 font-semibold italic border-t pt-3 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-300" /> Bấm ra khoảng trống bên ngoài biểu mẫu để quay về Trang chủ nhanh chóng!
        </div>
      </div>
    </div>
  );
}
