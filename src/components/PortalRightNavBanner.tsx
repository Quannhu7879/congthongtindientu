import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Megaphone, 
  Calendar, 
  Trash2, 
  Send,
  X,
  PlusCircle,
  FileText
} from 'lucide-react';
import { SchoolNotification, User } from '../types';

interface PortalRightNavBannerProps {
  notifications: SchoolNotification[];
  onSaveNotifications: (updated: SchoolNotification[]) => void;
  currentUser: User | null;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function PortalRightNavBanner({
  notifications,
  onSaveNotifications,
  currentUser,
  showToast
}: PortalRightNavBannerProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('Nhà trường');
  const [newContent, setNewContent] = useState('');

  const isAdminOrTeacher = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Giáo viên');

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo!', 'error');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

    const newNotif: SchoolNotification = {
      id: Date.now(),
      date: formattedDate,
      isNew: true,
      source: newSource,
      title: newTitle.trim(),
      content: newContent.trim()
    };

    const updated = [newNotif, ...notifications];
    onSaveNotifications(updated);
    showToast('Đăng thông báo mới thành công!', 'success');
    
    // Reset form
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDeleteNotification = (id: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thông báo: "${title}"?`)) {
      const updated = notifications.filter(n => n.id !== id);
      onSaveNotifications(updated);
      showToast('Đã xóa thông báo thành công!', 'success');
      if (expandedId === id) setExpandedId(null);
    }
  };

  const getSourceBadgeStyles = (source: string) => {
    const srcLower = source.toLowerCase();
    if (srcLower.includes('sở') || srcLower.includes('bộ') || srcLower.includes('sgd')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (srcLower.includes('xã') || srcLower.includes('huyện') || srcLower.includes('ubnd')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (srcLower.includes('đoàn') || srcLower.includes('đội') || srcLower.includes('liên đội')) {
      return 'bg-violet-50 text-violet-700 border-violet-200';
    }
    return 'bg-blue-50 text-brandBlue border-blue-200';
  };

  return (
    <aside id="right-nav-banner" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-fit">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-brandBlue to-brandBlue-dark text-white p-3.5 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="w-1.5 h-3 bg-brandOrange rounded-full"></span>
          <span>THÔNG BÁO MỚI NHẤT</span>
        </div>
        <div className="flex items-center gap-1">
          <Bell className="w-4 h-4 text-brandOrange animate-bounce" />
        </div>
      </div>

      {/* Admin Quick Action Button */}
      {isAdminOrTeacher && (
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hành động của giáo vụ</span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brandOrange text-white text-[10px] font-black rounded-lg shadow-sm hover:bg-brandOrange-dark transition cursor-pointer"
          >
            {isAdding ? (
              <>
                <X className="w-3.5 h-3.5" /> Hủy đăng
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" /> Thêm thông báo
              </>
            )}
          </button>
        </div>
      )}

      {/* Add Notification Form Overlay/Expand */}
      {isAdding && (
        <form onSubmit={handleAddNotification} className="p-4 bg-orange-50/50 border-b border-orange-100 space-y-3 animate-fadeIn text-xs">
          <h4 className="font-extrabold text-orange-900 flex items-center gap-1.5 uppercase text-[10px]">
            <Megaphone className="w-3.5 h-3.5 text-brandOrange" /> Đăng thông báo mới
          </h4>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Tiêu đề thông báo</label>
            <input
              type="text"
              required
              placeholder="Nhập tiêu đề..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-brandOrange focus:border-brandOrange outline-none font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nguồn phát hành</label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-brandOrange outline-none font-medium text-slate-800"
              >
                <option value="Nhà trường">Nhà trường</option>
                <option value="Hòa Phú">Trường THCS Hòa Phú</option>
                <option value="Xã Hòa Xá">Xã Hòa Xá</option>
                <option value="Sở GD&ĐT">Sở GD&ĐT</option>
                <option value="Bộ GD&ĐT">Bộ GD&ĐT</option>
                <option value="Đoàn - Đội">Đoàn - Đội</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Trạng thái nổi bật</label>
              <div className="flex items-center gap-2 px-1.5 py-2 text-emerald-700 font-bold bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Mới (Live)</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Nội dung chi tiết</label>
            <textarea
              required
              rows={3}
              placeholder="Nhập chi tiết thông báo..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-brandOrange focus:border-brandOrange outline-none font-medium text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Send className="w-3.5 h-3.5" /> Gửi & Phát hành ngay
          </button>
        </form>
      )}

      {/* Notification List container */}
      <div className="flex flex-col divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium text-xs">
            Hiện tại chưa có thông báo nào mới.
          </div>
        ) : (
          notifications.map((notif) => {
            const isExpanded = expandedId === notif.id;
            return (
              <div key={notif.id} className={`p-4 transition hover:bg-slate-50/50 ${notif.isNew ? 'bg-amber-50/10' : ''}`}>
                <div className="flex items-start gap-2.5">
                  {/* Left block: Date bubble */}
                  <div className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1.5 rounded-lg flex flex-col items-center shrink-0 min-w-[42px]">
                    <span className="text-[10px] font-black tracking-tighter text-slate-800 leading-none">{notif.date.split('/')[0]}</span>
                    <span className="text-[8px] font-bold text-slate-400 leading-none mt-1">Tháng {notif.date.split('/')[1]}</span>
                  </div>

                  {/* Center/Right block: Details */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase shrink-0 ${getSourceBadgeStyles(notif.source)}`}>
                        {notif.source}
                      </span>
                      {notif.isNew && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-100 text-red-600 border border-red-200 rounded-md uppercase tracking-wider shrink-0 animate-pulse">
                          MỚI
                        </span>
                      )}
                    </div>

                    <h5 
                      onClick={() => toggleExpand(notif.id)}
                      className="text-xs font-bold text-slate-800 leading-snug cursor-pointer hover:text-brandBlue transition break-words"
                    >
                      {notif.title}
                    </h5>

                    {/* Expandable/Collapsible Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-words whitespace-pre-line">
                        {notif.content}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-slate-400">
                      <button
                        onClick={() => toggleExpand(notif.id)}
                        className="text-brandBlue hover:text-brandBlue-dark flex items-center gap-0.5 cursor-pointer transition"
                      >
                        {isExpanded ? (
                          <>
                            Thu gọn <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Xem chi tiết <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>

                      {isAdminOrTeacher && (
                        <button
                          onClick={() => handleDeleteNotification(notif.id, notif.title)}
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Decorative footer inside right banner */}
      <div className="bg-slate-50 p-3.5 border-t border-slate-100 text-[10px] text-slate-400 font-bold text-center flex items-center justify-center gap-1">
        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Cập nhật thời gian thực
      </div>
    </aside>
  );
}
