import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  FolderOpen, 
  Users, 
  School, 
  BookOpen, 
  FileText, 
  PenTool, 
  Edit3, 
  CheckSquare, 
  Calculator, 
  Contact, 
  FileSpreadsheet, 
  Gamepad2,
  Wand2,
  Database
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  currentUser: User | null;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  allowedRoles: ('all' | UserRole)[];
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Trang chủ tổng quan', icon: LayoutDashboard, colorClass: 'text-brandBlue', allowedRoles: ['all'] },
  { id: 'course-registration', label: 'Khóa học của con', icon: Compass, colorClass: 'text-emerald-600', allowedRoles: ['Admin', 'Học sinh', 'Phụ huynh'] },
  { id: 'documents', label: 'Văn bản chỉ đạo', icon: FolderOpen, colorClass: 'text-brandOrange', allowedRoles: ['Admin', 'Giáo viên', 'Học sinh', 'Phụ huynh'] },
  { id: 'accounts', label: 'Quản lý tài khoản', icon: Users, colorClass: 'text-indigo-600', allowedRoles: ['Admin'] },
  { id: 'classes', label: 'Cơ cấu Khối / Lớp học', icon: School, colorClass: 'text-slate-500', allowedRoles: ['Admin'] },
  { id: 'subjects', label: 'Bộ môn & Phân công', icon: BookOpen, colorClass: 'text-teal-600', allowedRoles: ['Admin'] },
  { id: 'exams', label: 'Ngân hàng đề thi', icon: FileText, colorClass: 'text-amber-600', allowedRoles: ['Admin', 'Giáo viên'] },
  { id: 'homework', label: 'Bài tập về nhà', icon: PenTool, colorClass: 'text-pink-600', allowedRoles: ['Admin', 'Giáo viên'] },
  { id: 'student-test', label: 'Phòng thi học sinh', icon: Edit3, colorClass: 'text-violet-600', allowedRoles: ['Học sinh'] },
  { id: 'grading', label: 'Chấm bài & Đồng bộ', icon: CheckSquare, colorClass: 'text-rose-600', allowedRoles: ['Admin', 'Giáo viên'] },
  { id: 'reports', label: 'Học bạ tổng hợp', icon: Calculator, colorClass: 'text-cyan-600', allowedRoles: ['Admin', 'Giáo viên', 'Học sinh', 'Phụ huynh'] },
  { id: 'contact-book', label: 'Sổ liên lạc gia đình', icon: Contact, colorClass: 'text-blue-600', allowedRoles: ['Admin', 'Giáo viên', 'Học sinh', 'Phụ huynh'] },
  { id: 'export-center', label: 'Trung tâm kết xuất', icon: FileSpreadsheet, colorClass: 'text-emerald-700', allowedRoles: ['Admin', 'Giáo viên'] },
  { id: 'supabase-sync', label: 'Cơ sở dữ liệu Supabase', icon: Database, colorClass: 'text-blue-500', allowedRoles: ['Admin'] },
  { id: 'game-center', label: 'Trò chơi Trí tuệ', icon: Gamepad2, colorClass: 'text-amber-500', allowedRoles: ['all'] },
];

export default function PortalSidebar({ currentTab, onChangeTab, currentUser }: SidebarProps) {
  const userRole = currentUser ? currentUser.role : null;

  // Filter menu items by user role permissions
  const visibleItems = menuItems.filter(item => {
    if (item.allowedRoles.includes('all')) return true;
    if (!userRole) return false;
    return item.allowedRoles.includes(userRole);
  });

  return (
    <aside className="flex flex-col gap-4">
      {/* Navigation Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-brandBlue to-brandBlue-dark text-white p-3.5 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-3 bg-brandOrange rounded-full"></span>
          MENU QUẢN TRỊ HỆ THỐNG
        </div>
        
        <nav className="flex flex-col text-xs divide-y divide-slate-100">
          {visibleItems.map(item => {
            const Icon = item.icon;
            
            // Map virtual/legacy currentTab IDs back to sidebar item IDs for visually highlight matching
            const isActive = currentTab === item.id || 
                             (currentTab === 'assignments' && item.id === 'subjects') ||
                             (currentTab === 'tests' && item.id === 'student-test') ||
                             (currentTab === 'grades' && item.id === 'grading') ||
                             (currentTab === 'transcripts' && item.id === 'reports') ||
                             (currentTab === 'contact' && item.id === 'contact-book') ||
                             (currentTab === 'export' && item.id === 'export-center') ||
                             (currentTab === 'games' && item.id === 'game-center');
            
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`text-left px-4 py-3 flex items-center gap-3 font-semibold transition border-l-4 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50/50 text-brandBlue border-brandBlue' 
                    : 'text-slate-600 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 text-center shrink-0 ${item.colorClass}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Assistant Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-2xl text-xs space-y-2 shadow-sm">
        <h5 className="font-extrabold text-indigo-900 uppercase flex items-center gap-1.5 text-[11px]">
          <Wand2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Trợ lý Giáo vụ V12.15
        </h5>
        <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
          <b>Mẹo click thông minh:</b> Di chuột bấm vào các ngôi sao học sinh hoặc thẻ lớp tiêu biểu trên trang chủ để xem ngay học bạ điểm số chi tiết cùng bảng vinh danh hào hùng!
        </p>
      </div>
    </aside>
  );
}
