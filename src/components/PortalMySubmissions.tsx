import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Plus, 
  Megaphone, 
  BookOpen, 
  GraduationCap, 
  Star, 
  Save, 
  X,
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { 
  User, 
  Activity, 
  SchoolNotification, 
  OfficialDocument, 
  Exam, 
  Homework, 
  Survey, 
  CourseRegistration, 
  Submission 
} from '../types';

interface PortalMySubmissionsProps {
  currentUser: User | null;
  
  // States and Save actions
  activities: Activity[];
  onSaveActivities: (activities: Activity[]) => void;
  
  notifications: SchoolNotification[];
  onSaveNotifications: (notifications: SchoolNotification[]) => void;
  
  documents: OfficialDocument[];
  onSaveDocuments: (documents: OfficialDocument[]) => void;
  
  exams: Exam[];
  onSaveExams: (exams: Exam[]) => void;
  
  homeworkList: Homework[];
  onSaveHomework: (homework: Homework[]) => void;
  
  surveys: Survey[];
  onSaveSurveys: (surveys: Survey[]) => void;
  
  registrations: CourseRegistration[];
  onSaveRegistrations: (registrations: CourseRegistration[]) => void;
  
  submissions: Submission[];
  onSaveSubmissions: (submissions: Submission[]) => void;
  
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

type CreatorTab = 'activities' | 'notifications' | 'documents' | 'exams' | 'homework' | 'surveys' | 'registrations' | 'submissions';

export default function PortalMySubmissions({
  currentUser,
  activities,
  onSaveActivities,
  notifications,
  onSaveNotifications,
  documents,
  onSaveDocuments,
  exams,
  onSaveExams,
  homeworkList,
  onSaveHomework,
  surveys,
  onSaveSurveys,
  registrations,
  onSaveRegistrations,
  submissions,
  onSaveSubmissions,
  showToast
}: PortalMySubmissionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Decide which tabs are available for the user role
  const getAvailableTabs = (): { id: CreatorTab; label: string; icon: React.ComponentType<any> }[] => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'Admin') {
      return [
        { id: 'activities', label: 'Bài viết Hoạt động', icon: FileText },
        { id: 'notifications', label: 'Thông báo mới nhất', icon: Megaphone },
        { id: 'documents', label: 'Văn bản chỉ đạo', icon: FileSpreadsheet },
        { id: 'exams', label: 'Ngân hàng đề thi', icon: GraduationCap },
        { id: 'homework', label: 'Bài tập về nhà', icon: BookOpen }
      ];
    }
    
    if (currentUser.role === 'Giáo viên') {
      return [
        { id: 'activities', label: 'Bài viết Hoạt động', icon: FileText },
        { id: 'notifications', label: 'Thông báo mới nhất', icon: Megaphone },
        { id: 'documents', label: 'Văn bản chỉ đạo', icon: FileSpreadsheet },
        { id: 'exams', label: 'Ngân hàng đề thi', icon: GraduationCap },
        { id: 'homework', label: 'Bài tập về nhà', icon: BookOpen }
      ];
    }
    
    if (currentUser.role === 'Phụ huynh') {
      return [
        { id: 'surveys', label: 'Ý kiến đóng góp (Khảo sát)', icon: Star },
        { id: 'registrations', label: 'Đăng ký học năng khiếu', icon: GraduationCap }
      ];
    }
    
    if (currentUser.role === 'Học sinh') {
      return [
        { id: 'submissions', label: 'Bài làm phòng thi & BTVN', icon: FileText }
      ];
    }
    
    return [];
  };

  const tabs = getAvailableTabs();
  const [activeTab, setActiveTab] = useState<CreatorTab>(tabs[0]?.id || 'activities');

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Temporary form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editCourses, setEditCourses] = useState<string[]>([]);
  const [editStudentName, setEditStudentName] = useState('');
  const [editClassInfo, setEditClassInfo] = useState('');
  const [editSubmissionText, setEditSubmissionText] = useState('');

  const currentUsername = currentUser ? currentUser.username : '';
  const currentFullName = currentUser ? currentUser.name : '';

  // Filter content items based on search and current user authorship
  const getFilteredItems = () => {
    const q = searchTerm.toLowerCase();
    
    switch (activeTab) {
      case 'activities':
        // Teachers & Admins can manage all activities or those created
        return activities.filter(act => 
          act.title.toLowerCase().includes(q) || 
          act.category.toLowerCase().includes(q)
        );

      case 'notifications':
        // Teachers & Admins can manage notices
        return notifications.filter(notif => 
          notif.title.toLowerCase().includes(q) || 
          notif.source.toLowerCase().includes(q)
        );

      case 'documents':
        // Teachers & Admins can manage official documents
        return documents.filter(doc => 
          doc.title.toLowerCase().includes(q) || 
          doc.category.toLowerCase().includes(q)
        );

      case 'exams':
        // Filter exams authored by current teacher name or all if admin
        return exams.filter(exam => {
          const matchesAuthor = currentUser?.role === 'Admin' || exam.teacher === currentFullName;
          const matchesSearch = exam.subject.toLowerCase().includes(q) || exam.type.toLowerCase().includes(q);
          return matchesAuthor && matchesSearch;
        });

      case 'homework':
        // Filter homework created in subjects
        return homeworkList.filter(hw => 
          hw.title.toLowerCase().includes(q) || hw.subject.toLowerCase().includes(q)
        );

      case 'surveys':
        // Parents view their own feedback submissions
        return surveys.filter(s => {
          const isOwn = s.parentName.toLowerCase() === currentFullName.toLowerCase() || s.parentName.toLowerCase() === currentUsername.toLowerCase();
          return isOwn && (s.topic.toLowerCase().includes(q) || s.content.toLowerCase().includes(q));
        });

      case 'registrations':
        // Parents view their registrations
        return registrations.filter(r => 
          r.studentName.toLowerCase().includes(q) || r.courses.some(c => c.toLowerCase().includes(q))
        );

      case 'submissions':
        // Students view their own submissions
        return submissions.filter(sub => {
          const isOwn = sub.student.toLowerCase() === currentFullName.toLowerCase() || sub.student.toLowerCase() === currentUsername.toLowerCase();
          return isOwn && (sub.subject.toLowerCase().includes(q) || sub.type.toLowerCase().includes(q));
        });

      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();

  // Handle deletions
  const handleDeleteItem = (id: number, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nội dung: "${title}"?`)) {
      return;
    }

    if (activeTab === 'activities') {
      onSaveActivities(activities.filter(a => a.id !== id));
      showToast('Đã xóa bài viết hoạt động thành công!', 'success');
    } else if (activeTab === 'notifications') {
      onSaveNotifications(notifications.filter(n => n.id !== id));
      showToast('Đã xóa thông báo thành công!', 'success');
    } else if (activeTab === 'documents') {
      onSaveDocuments(documents.filter(d => d.id !== id));
      showToast('Đã xóa văn bản chỉ đạo!', 'success');
    } else if (activeTab === 'exams') {
      onSaveExams(exams.filter(e => e.id !== id));
      showToast('Đã xóa đề thi khỏi ngân hàng!', 'success');
    } else if (activeTab === 'homework') {
      onSaveHomework(homeworkList.filter(h => h.id !== id));
      showToast('Đã xóa bài tập về nhà!', 'success');
    } else if (activeTab === 'surveys') {
      onSaveSurveys(surveys.filter(s => s.id !== id));
      showToast('Đã rút lại ý kiến đóng góp thành công!', 'success');
    } else if (activeTab === 'registrations') {
      const reg = registrations.find(r => r.id === id);
      if (reg && reg.status !== 'Chờ duyệt') {
        showToast('Không thể hủy đăng ký đã được ban giám hiệu phê duyệt!', 'error');
        return;
      }
      onSaveRegistrations(registrations.filter(r => r.id !== id));
      showToast('Đã hủy đăng ký lớp năng khiếu thành công!', 'success');
    } else if (activeTab === 'submissions') {
      const sub = submissions.find(s => s.id === id);
      if (sub && sub.grade !== null) {
        showToast('Không thể xóa bài nộp đã được chấm điểm!', 'error');
        return;
      }
      onSaveSubmissions(submissions.filter(s => s.id !== id));
      showToast('Đã thu hồi bài làm thành công!', 'success');
    }
  };

  // Open Edit Mode
  const startEdit = (item: any) => {
    setEditingId(item.id);
    
    if (activeTab === 'activities') {
      setEditTitle(item.title);
      setEditCategory(item.category);
      setEditDesc(item.desc);
      setEditContent(item.content);
    } else if (activeTab === 'notifications') {
      setEditTitle(item.title);
      setEditCategory(item.source);
      setEditContent(item.content);
    } else if (activeTab === 'documents') {
      setEditTitle(item.title);
      setEditCategory(item.category);
    } else if (activeTab === 'exams') {
      setEditTitle(item.subject);
      setEditCategory(item.type);
    } else if (activeTab === 'homework') {
      setEditTitle(item.title);
      setEditCategory(item.subject);
      setEditContent(item.content);
    } else if (activeTab === 'surveys') {
      setEditTitle(item.topic);
      setEditRating(item.rating);
      setEditContent(item.content);
      setEditStudentName(item.studentName);
      setEditClassInfo(item.classInfo);
    } else if (activeTab === 'registrations') {
      setEditStudentName(item.studentName);
      setEditClassInfo(item.classInfo);
      setEditCourses(item.courses);
    } else if (activeTab === 'submissions') {
      setEditSubmissionText(item.text || '');
    }
  };

  // Save changes
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    if (activeTab === 'activities') {
      const updated = activities.map(a => a.id === editingId ? { 
        ...a, 
        title: editTitle, 
        category: editCategory, 
        desc: editDesc, 
        content: editContent 
      } : a);
      onSaveActivities(updated);
      showToast('Đã cập nhật bài viết hoạt động thành công!', 'success');
    } 
    else if (activeTab === 'notifications') {
      const updated = notifications.map(n => n.id === editingId ? { 
        ...n, 
        title: editTitle, 
        source: editCategory, 
        content: editContent 
      } : n);
      onSaveNotifications(updated);
      showToast('Cập nhật thông báo thành công!', 'success');
    } 
    else if (activeTab === 'documents') {
      const updated = documents.map(d => d.id === editingId ? { 
        ...d, 
        title: editTitle, 
        category: editCategory as any
      } : d);
      onSaveDocuments(updated);
      showToast('Đã sửa đổi thông tin văn bản chỉ đạo!', 'success');
    } 
    else if (activeTab === 'exams') {
      const updated = exams.map(ex => ex.id === editingId ? { 
        ...ex, 
        subject: editTitle, 
        type: editCategory 
      } : ex);
      onSaveExams(updated);
      showToast('Đã cập nhật thông tin ngân hàng đề thi!', 'success');
    } 
    else if (activeTab === 'homework') {
      const updated = homeworkList.map(h => h.id === editingId ? { 
        ...h, 
        title: editTitle, 
        subject: editCategory, 
        content: editContent 
      } : h);
      onSaveHomework(updated);
      showToast('Đã lưu bài tập về nhà chỉnh sửa!', 'success');
    } 
    else if (activeTab === 'surveys') {
      const updated = surveys.map(s => s.id === editingId ? { 
        ...s, 
        topic: editTitle, 
        rating: editRating, 
        content: editContent,
        studentName: editStudentName,
        classInfo: editClassInfo
      } : s);
      onSaveSurveys(updated);
      showToast('Đã sửa đổi ý kiến đóng góp thành công!', 'success');
    } 
    else if (activeTab === 'registrations') {
      const updated = registrations.map(r => r.id === editingId ? { 
        ...r, 
        studentName: editStudentName, 
        classInfo: editClassInfo, 
        courses: editCourses 
      } : r);
      onSaveRegistrations(updated);
      showToast('Cập nhật đăng ký lớp năng khiếu thành công!', 'success');
    } 
    else if (activeTab === 'submissions') {
      const updated = submissions.map(sub => sub.id === editingId ? { 
        ...sub, 
        text: editSubmissionText 
      } : sub);
      onSaveSubmissions(updated);
      showToast('Cập nhật bài viết làm phòng thi thành công!', 'success');
    }

    setEditingId(null);
  };

  const availableCoursesList = ['Toán nâng cao', 'Vật lý vui', 'Lập trình Scratch', 'Cờ vua thế giới', 'Mỹ thuật sáng tạo', 'Anh văn giao tiếp'];

  const toggleCourseSelection = (courseName: string) => {
    if (editCourses.includes(courseName)) {
      setEditCourses(editCourses.filter(c => c !== courseName));
    } else {
      setEditCourses([...editCourses, courseName]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Top Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-rose-500 animate-pulse" />
            QUẢN LÝ NỘI DUNG TÔI GỬI LÊN
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Danh sách lưu trữ, chỉnh sửa và thu hồi các tin bài, biểu mẫu khảo sát, văn bản chỉ đạo hoặc bài nộp của tài khoản <span className="font-extrabold text-brandBlue">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>
      </div>

      {/* Role Tabs Nav Bar */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setEditingId(null);
              }}
              className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive 
                  ? 'bg-white text-brandBlue shadow-sm border-l-2 border-brandBlue' 
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Quick Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung đã gửi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brandBlue font-medium text-slate-800"
          />
        </div>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-xs font-bold text-slate-500 px-3 hover:text-slate-700 bg-slate-100 rounded-xl cursor-pointer"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Display List of items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="border border-dashed rounded-2xl p-10 text-center text-slate-400 font-semibold text-xs space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Không tìm thấy nội dung đã gửi nào phù hợp trong mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item: any) => {
              const isEditing = editingId === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className={`border rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between gap-4 ${
                    isEditing ? 'border-brandBlue bg-blue-50/10' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <form onSubmit={handleSaveChanges} className="space-y-4 text-xs w-full">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-extrabold text-[10px] uppercase text-brandBlue tracking-wider">CHẾ ĐỘ SỬA NỘI DUNG</span>
                        <button 
                          type="button" 
                          onClick={() => setEditingId(null)}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Editing fields depending on type */}
                      {activeTab === 'activities' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề</label>
                              <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chuyên mục</label>
                              <input 
                                type="text" 
                                value={editCategory} 
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tóm tắt ngắn</label>
                            <textarea 
                              value={editDesc} 
                              onChange={(e) => setEditDesc(e.target.value)}
                              rows={2}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nội dung chi tiết</label>
                            <textarea 
                              value={editContent} 
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={4}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'notifications' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề thông báo</label>
                              <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nguồn phát hành</label>
                              <input 
                                type="text" 
                                value={editCategory} 
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chi tiết thông báo</label>
                            <textarea 
                              value={editContent} 
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'documents' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên văn bản chỉ đạo</label>
                            <input 
                              type="text" 
                              value={editTitle} 
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cấp ban hành</label>
                            <select 
                              value={editCategory} 
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white"
                            >
                              <option value="Cấp Trường">Cấp Trường</option>
                              <option value="Cấp UBND xã">Cấp UBND xã</option>
                              <option value="Cấp Sở/Bộ">Cấp Sở/Bộ</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {activeTab === 'exams' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bộ môn thi</label>
                            <input 
                              type="text" 
                              value={editTitle} 
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kỳ kiểm tra</label>
                            <input 
                              type="text" 
                              value={editCategory} 
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'homework' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề bài tập</label>
                              <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Môn học</label>
                              <input 
                                type="text" 
                                value={editCategory} 
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đề bài / Nội dung chi tiết</label>
                            <textarea 
                              value={editContent} 
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'surveys' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chủ đề góp ý</label>
                              <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Học sinh lớp</label>
                              <input 
                                type="text" 
                                value={editClassInfo} 
                                onChange={(e) => setEditClassInfo(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mức hài lòng (Sao)</label>
                              <select 
                                value={editRating} 
                                onChange={(e) => setEditRating(Number(e.target.value))}
                                className="w-full p-2 border rounded-lg bg-white"
                              >
                                <option value={5}>5 Sao (Xuất sắc)</option>
                                <option value={4}>4 Sao (Hài lòng)</option>
                                <option value={3}>3 Sao (Bình thường)</option>
                                <option value={2}>2 Sao (Chưa tốt)</option>
                                <option value={1}>1 Sao (Cần sửa đổi gấp)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chi tiết ý kiến góp ý</label>
                            <textarea 
                              value={editContent} 
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              className="w-full p-2 border rounded-lg bg-white" required 
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'registrations' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Họ tên học sinh</label>
                              <input 
                                type="text" 
                                value={editStudentName} 
                                onChange={(e) => setEditStudentName(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lớp</label>
                              <input 
                                type="text" 
                                value={editClassInfo} 
                                onChange={(e) => setEditClassInfo(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white" required 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chọn lớp năng khiếu mới</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border">
                              {availableCoursesList.map(c => {
                                const selected = editCourses.includes(c);
                                return (
                                  <button
                                    type="button"
                                    key={c}
                                    onClick={() => toggleCourseSelection(c)}
                                    className={`px-2 py-1.5 rounded-lg border font-bold text-[10px] transition text-left cursor-pointer ${
                                      selected ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600'
                                    }`}
                                  >
                                    {selected ? '✓ ' : ''}{c}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'submissions' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nội dung bài làm sửa đổi</label>
                          <textarea 
                            value={editSubmissionText} 
                            onChange={(e) => setEditSubmissionText(e.target.value)}
                            rows={5}
                            className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-700" required 
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-black shadow cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* General Reading Mode with stats, dates, statuses */
                    <>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-100 border text-slate-600">
                              {activeTab === 'activities' && (item.category || 'Hoạt động')}
                              {activeTab === 'notifications' && (item.source || 'Thông báo')}
                              {activeTab === 'documents' && (item.category || 'Văn bản')}
                              {activeTab === 'exams' && (item.type || 'Đề thi')}
                              {activeTab === 'homework' && (`Môn ${item.subject}`)}
                              {activeTab === 'surveys' && (`Góp ý: ${item.topic}`)}
                              {activeTab === 'registrations' && ('Khóa học Năng khiếu')}
                              {activeTab === 'submissions' && (`Bài thi / Bài tập môn ${item.subject}`)}
                            </span>
                            
                            {/* Date field */}
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {item.date || 'Gần đây'}
                            </span>
                          </div>

                          <h3 className="text-xs font-black text-slate-800 leading-snug">
                            {activeTab === 'activities' && item.title}
                            {activeTab === 'notifications' && item.title}
                            {activeTab === 'documents' && item.title}
                            {activeTab === 'exams' && `Môn ${item.subject} (${item.type})`}
                            {activeTab === 'homework' && item.title}
                            {activeTab === 'surveys' && `Khảo sát PH em: ${item.studentName} (Lớp ${item.classInfo})`}
                            {activeTab === 'registrations' && `Đăng ký cho học sinh: ${item.studentName} (Lớp ${item.classInfo})`}
                            {activeTab === 'submissions' && `Môn ${item.subject} (${item.type})`}
                          </h3>
                        </div>

                        {/* Status badges for dynamic workflows */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {(activeTab === 'surveys' || activeTab === 'registrations') && (
                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                              item.status === 'Đã duyệt' || item.status === 'Đã tiếp thu'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'Từ chối'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {item.status === 'Đã duyệt' || item.status === 'Đã tiếp thu' ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              ) : item.status === 'Từ chối' ? (
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                              )}
                              <span>{item.status}</span>
                            </span>
                          )}

                          {activeTab === 'submissions' && (
                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                              item.grade !== null
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {item.grade !== null ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>ĐÃ CHẤM: {item.grade} / {item.mcqMaxScore + item.essayMaxScore} Đ</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                  <span>CHỜ CHẤM ĐIỂM</span>
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content representation */}
                      <div className="text-xs text-slate-600 space-y-2">
                        {activeTab === 'activities' && (
                          <>
                            <p className="font-extrabold text-slate-700">Tóm tắt: {item.desc}</p>
                            <p className="text-slate-500 whitespace-pre-line text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">{item.content}</p>
                          </>
                        )}
                        {activeTab === 'notifications' && (
                          <p className="whitespace-pre-line text-[11px] bg-slate-50 p-2.5 rounded-xl border">{item.content}</p>
                        )}
                        {activeTab === 'documents' && (
                          <p className="text-slate-500 font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-brandOrange" /> Tệp đính kèm: {item.file?.name || 'Chưa đính kèm tệp tin'}
                          </p>
                        )}
                        {activeTab === 'exams' && (
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <p className="font-semibold text-slate-500">Thời gian làm bài: <b className="text-slate-800">{item.duration} phút</b></p>
                            <p className="font-semibold text-slate-500">Đáp án trắc nghiệm: <b className="text-slate-800">{item.correctAnswers}</b></p>
                            <p className="col-span-2 font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-100">Câu hỏi tự luận: {item.essayQuestion}</p>
                          </div>
                        )}
                        {activeTab === 'homework' && (
                          <>
                            <p className="font-semibold text-slate-500">Hạn nộp: <b className="text-rose-600">{item.deadline}</b></p>
                            <p className="whitespace-pre-line text-[11px] bg-slate-50 p-2.5 rounded-xl border">{item.content}</p>
                          </>
                        )}
                        {activeTab === 'surveys' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 p-1.5 rounded-lg border border-amber-100 w-fit">
                              <span className="text-[10px] font-black text-amber-700 uppercase pr-1">Mức hài lòng:</span>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-current' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <p className="italic text-slate-700 font-medium bg-orange-50/20 p-3 rounded-xl border border-orange-100/50">"{item.content}"</p>
                          </div>
                        )}
                        {activeTab === 'registrations' && (
                          <div className="space-y-1 bg-emerald-50/10 p-3 rounded-xl border border-emerald-100/50">
                            <p className="font-bold text-slate-500 text-[10px] uppercase">Lớp đăng ký học năng khiếu:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.courses.map((c: string) => (
                                <span key={c} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {activeTab === 'submissions' && (
                          <div className="space-y-2">
                            {item.answers && (
                              <p className="text-[10px] font-bold text-slate-500">Đã chọn trắc nghiệm: <span className="font-black text-slate-800">{item.answers}</span></p>
                            )}
                            <p className="whitespace-pre-line text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium text-slate-700">
                              <b>Bài viết tự luận:</b><br />
                              {item.text || 'Không có bài làm tự luận'}
                            </p>
                            {item.remark && (
                              <p className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 p-2 rounded-lg font-bold">
                                <b>Nhận xét của giáo viên:</b> {item.remark}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions: Edit & Delete */}
                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                        {/* Only allow editing based on condition */}
                        {(() => {
                          let showEdit = true;
                          let showDelete = true;
                          
                          if (activeTab === 'registrations' && item.status !== 'Chờ duyệt') {
                            showEdit = false; // Cannot edit approved/rejected courses
                          }
                          if (activeTab === 'submissions' && item.grade !== null) {
                            showEdit = false; // Cannot edit graded tests
                            showDelete = false;
                          }
                          if (activeTab === 'surveys' && item.status !== 'Mới nhận') {
                            showEdit = false; // Cannot edit processed surveys
                          }

                          return (
                            <>
                              {showEdit && (
                                <button
                                  onClick={() => startEdit(item)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-700 hover:text-white rounded-xl transition font-bold text-[10px] cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Sửa thông tin
                                </button>
                              )}
                              {showDelete && (
                                <button
                                  onClick={() => handleDeleteItem(
                                    item.id, 
                                    item.title || item.topic || `Đăng ký của em ${item.studentName}` || `Bài nộp môn ${item.subject}`
                                  )}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white rounded-xl transition font-bold text-[10px] cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> 
                                  {activeTab === 'surveys' ? 'Rút lại' : activeTab === 'registrations' ? 'Hủy đăng ký' : activeTab === 'submissions' ? 'Thu hồi' : 'Xóa bỏ'}
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
