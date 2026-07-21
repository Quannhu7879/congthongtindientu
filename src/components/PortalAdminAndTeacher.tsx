import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  School, 
  BookOpen, 
  CheckSquare, 
  Plus, 
  Edit, 
  Trash, 
  RotateCcw, 
  Save, 
  ShieldAlert, 
  Award, 
  FileText, 
  CheckCircle, 
  Info,
  X,
  PlusCircle,
  Eye,
  CornerDownRight
} from 'lucide-react';
import { 
  User, 
  ClassItem, 
  Assignment, 
  Submission, 
  UserRole 
} from '../types';
import { fullSubjectsList } from '../data';

// ==========================================
// 1. ACCOUNT MANAGEMENT COMPONENT
// ==========================================
interface AccountMgmtProps {
  currentUser: User | null;
  accounts: User[];
  onSaveAccounts: (list: User[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalAccountManagement({
  currentUser,
  accounts,
  onSaveAccounts,
  showToast
}: AccountMgmtProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [role, setRole] = useState<UserRole>('Học sinh');
  const [extra, setExtra] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setUsername('');
    setPassword('123');
    setRole('Học sinh');
    setExtra('');
    setShowAddModal(true);
  };

  const openEditModal = (acc: User) => {
    setEditingId(acc.id);
    setName(acc.name);
    setUsername(acc.username);
    setPassword(acc.password || '123');
    setRole(acc.role);
    setExtra(acc.extra);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    if (acc.role === 'Admin') {
      showToast("Không thể xóa tài khoản Quản trị viên điều hành!", "error");
      return;
    }

    if (window.confirm(`Bạn chắc chắn muốn loại bỏ vĩnh viễn tài khoản "${acc.username}" khỏi hệ thống?`)) {
      onSaveAccounts(accounts.filter(a => a.id !== id));
      showToast("Đã xóa tài khoản thành công!", "success");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password) {
      showToast("Vui lòng điền đầy đủ các thông tin!", "error");
      return;
    }

    if (editingId) {
      // Edit
      const updated = accounts.map(a => 
        a.id === editingId 
          ? { ...a, name: name.trim(), username: username.trim(), password, role, extra: extra.trim() } 
          : a
      );
      onSaveAccounts(updated);
      showToast("Cập nhật thông tin tài khoản thành công!", "success");
    } else {
      // Create
      if (accounts.some(a => a.username === username.trim())) {
        showToast("Tên tài khoản này đã được sử dụng!", "error");
        return;
      }

      const newAcc: User = {
        id: Date.now(),
        name: name.trim(),
        username: username.trim(),
        password,
        role,
        extra: extra.trim() || (role === 'Học sinh' ? '6A' : 'Tự do'),
        isFirstLogin: false,
        canPostNews: false
      };
      onSaveAccounts([...accounts, newAcc]);
      showToast("Cấp tài khoản mới thành công!", "success");
    }
    setShowAddModal(false);
  };

  const togglePermission = (id: number, checked: boolean) => {
    const updated = accounts.map(a => a.id === id ? { ...a, canPostNews: checked } : a);
    onSaveAccounts(updated);
    showToast("Cập nhật phân quyền đăng tin thành công!", "success");
  };

  const teachers = accounts.filter(a => a.role === 'Giáo viên');

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" /> Quản lý tài khoản người dùng hệ thống
        </h3>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPermModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Phân quyền đăng tin
          </button>
          
          <button 
            onClick={openAddModal}
            className="bg-brandBlue hover:bg-brandBlue-dark text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Cấp mới tài khoản
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse font-semibold">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
              <th className="p-3">Họ và tên</th>
              <th className="p-3">Tên tài khoản</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Thông tin thêm</th>
              <th className="p-3 text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {accounts.map(acc => (
              <tr key={acc.id} className="hover:bg-slate-50 transition duration-150">
                <td className="p-3 font-extrabold text-slate-800">
                  {acc.name}
                </td>
                <td className="p-3 font-mono">
                  {acc.username}
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                    acc.role === 'Admin' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    acc.role === 'Giáo viên' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    acc.role === 'Học sinh' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {acc.role}
                  </span>
                </td>
                <td className="p-3 font-medium text-slate-500">
                  {acc.extra || '-'}
                </td>
                <td className="p-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button 
                      onClick={() => openEditModal(acc)} 
                      className="bg-blue-50 hover:bg-brandBlue text-brandBlue hover:text-white font-bold p-2 rounded-lg transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(acc.id)} 
                      className={`font-bold p-2 rounded-lg transition ${
                        acc.role === 'Admin' 
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                          : 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white'
                      }`}
                      disabled={acc.role === 'Admin'}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account Add/Edit Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 font-semibold text-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-slate-800">
                {editingId ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Họ tên thành viên</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none font-bold"
                  placeholder="Ví dụ: Nghiêm Hồng Phúc"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Tên tài khoản</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none font-mono font-bold"
                  placeholder="Viết liền không dấu"
                  required
                  disabled={editingId !== null}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Mật khẩu bảo mật</label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Vai trò</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-white cursor-pointer"
                >
                  <option value="Học sinh">Học sinh</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Phụ huynh">Phụ huynh</option>
                  <option value="Admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Thông tin thêm (Lớp / Tổ bộ môn)</label>
                <input 
                  type="text" 
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none font-bold"
                  placeholder="Ví dụ: 9A hoặc Tổ Toán"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brandBlue hover:bg-brandBlue-dark text-white text-xs font-bold py-3 rounded-xl transition shadow"
              >
                Lưu Thông Tin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Permission Modal */}
      {showPermModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowPermModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative font-semibold text-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-amber-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Phân quyền đăng tải tin tức hoạt động
              </h4>
              <button onClick={() => setShowPermModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 mb-4 italic leading-relaxed">
              Kích hoạt công tắc để cho phép các Thầy Cô giáo bộ môn có quyền tự đăng tải các hoạt động, cuộc thi, tin học vụ lên Trang Chủ.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar p-1">
              {teachers.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">{t.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{t.extra}</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={t.canPostNews}
                      onChange={(e) => togglePermission(t.id, e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 2. CLASS STRUCTURE COMPONENT
// ==========================================
interface ClassStructureProps {
  classes: ClassItem[];
  onSaveClasses: (list: ClassItem[]) => void;
  accounts: User[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalClassStructure({
  classes,
  onSaveClasses,
  accounts,
  showToast
}: ClassStructureProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [khoi, setKhoi] = useState('6');
  const [lop, setLop] = useState('');
  const [gvcn, setGvcn] = useState('');

  const openModal = () => {
    const teachers = accounts.filter(a => a.role === 'Giáo viên');
    setGvcn(teachers.length > 0 ? teachers[0].name : 'Chưa phân');
    setLop('');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lop.trim()) {
      showToast("Vui lòng điền tên lớp!", "error");
      return;
    }

    const className = lop.toUpperCase().replace(/\s+/g, '');
    const duplicate = classes.some(c => c.lop === className);
    if (duplicate) {
      showToast("Lớp học này đã tồn tại trong danh sách!", "error");
      return;
    }

    const newClass: ClassItem = {
      id: className,
      khoi: `Khối ${khoi}`,
      lop: className,
      gvcn,
      total: 40
    };

    onSaveClasses([...classes, newClass]);
    setShowAddModal(false);
    showToast(`Đã thêm lớp ${className} thành công!`, "success");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <School className="w-5 h-5 text-brandBlue" /> Cơ cấu Khối / Lớp học trực thuộc nhà trường
        </h3>
        
        <button 
          onClick={openModal}
          className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs px-4 py-1.5 rounded-lg font-bold shadow cursor-pointer"
        >
          Thêm Lớp Mới
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {classes.map(c => (
          <div key={c.id} className="bg-slate-50 p-4 border border-slate-200 rounded-2xl relative shadow-sm font-semibold">
            <b className="text-brandBlue text-sm block border-b pb-1.5 mb-1.5">Lớp {c.lop}</b>
            <span className="text-[10px] text-slate-500 block"><b>GVCN:</b> {c.gvcn}</span>
            <span className="text-[10px] text-slate-500 block"><b>Sĩ số:</b> {c.total} học sinh chính thức</span>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 font-semibold text-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-extrabold text-sm">Thêm Lớp Học Mới</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Khối lớp trực thuộc</label>
                <select
                  value={khoi}
                  onChange={(e) => setKhoi(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-white cursor-pointer"
                >
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Tên lớp học</label>
                <input 
                  type="text" 
                  value={lop}
                  onChange={(e) => setLop(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none font-bold uppercase"
                  placeholder="Ví dụ: 9A"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Bổ nhiệm Giáo viên Chủ Nhiệm (GVCN)</label>
                <select
                  value={gvcn}
                  onChange={(e) => setGvcn(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-white cursor-pointer"
                >
                  {accounts.filter(a => a.role === 'Giáo viên').map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.extra})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-brandOrange text-white text-xs font-bold py-3 rounded-xl shadow"
              >
                Lưu Lớp Học
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 3. TEACHER ASSIGNMENT COMPONENT
// ==========================================
interface AssignmentProps {
  assignments: Assignment[];
  onSaveAssignments: (list: Assignment[]) => void;
  accounts: User[];
  classes: ClassItem[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalTeacherAssignment({
  assignments,
  onSaveAssignments,
  accounts,
  classes,
  showToast
}: AssignmentProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [undoHistory, setUndoHistory] = useState<Assignment[][]>([]);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<number>(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingId(null);
    const teachers = accounts.filter(a => a.role === 'Giáo viên');
    setTeacherId(teachers.length > 0 ? teachers[0].id : 0);
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setShowAddModal(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingId(asg.id);
    setTeacherId(asg.teacherId);
    setSelectedSubjects(asg.subjects);
    setSelectedClasses(asg.classes);
    setShowAddModal(true);
  };

  const pushHistory = () => {
    setUndoHistory([...undoHistory, [...assignments]]);
  };

  const handleUndo = () => {
    if (undoHistory.length === 0) return;
    const previous = undoHistory[undoHistory.length - 1];
    onSaveAssignments(previous);
    setUndoHistory(undoHistory.slice(0, -1));
    showToast("Đã hoàn tác hành động phân công!", "info");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa bản phân công giảng dạy này?")) {
      pushHistory();
      onSaveAssignments(assignments.filter(a => a.id !== id));
      showToast("Xóa phân công thành công!", "success");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0 || selectedClasses.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 môn dạy và 1 lớp phụ trách!", "error");
      return;
    }

    pushHistory();
    const teacher = accounts.find(a => a.id === teacherId);
    const teacherName = teacher ? teacher.name : 'Giáo viên';

    if (editingId) {
      const updated = assignments.map(a => 
        a.id === editingId 
          ? { ...a, teacherId, teacherName, subjects: selectedSubjects, classes: selectedClasses }
          : a
      );
      onSaveAssignments(updated);
      showToast("Cập nhật phân công giảng dạy thành công!", "success");
    } else {
      const newAsg: Assignment = {
        id: Date.now(),
        teacherId,
        teacherName,
        subjects: selectedSubjects,
        classes: selectedClasses
      };
      onSaveAssignments([...assignments, newAsg]);
      showToast("Phân công nhiệm vụ giảng dạy mới thành công!", "success");
    }
    setShowAddModal(false);
  };

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(x => x !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const toggleClass = (lop: string) => {
    if (selectedClasses.includes(lop)) {
      setSelectedClasses(selectedClasses.filter(x => x !== lop));
    } else {
      setSelectedClasses([...selectedClasses, lop]);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <div className="flex justify-between border-b pb-3 mb-4 items-center">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" /> Phân công Giáo viên &amp; Bộ môn giảng dạy chuyên đề
        </h3>
        
        <div className="flex gap-2">
          {undoHistory.length > 0 && (
            <button 
              onClick={handleUndo}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm border flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Hoàn tác hành vụ
            </button>
          )}
          
          <button 
            onClick={handleOpenAdd}
            className="bg-brandBlue hover:bg-brandBlue-dark text-white text-xs px-3.5 py-1.5 rounded-lg font-bold shadow cursor-pointer"
          >
            Phân công mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse font-semibold">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
              <th className="p-3">Họ tên giáo viên bộ môn</th>
              <th className="p-3">Môn dạy</th>
              <th className="p-3">Khối Lớp phụ trách</th>
              <th className="p-3 text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 transition duration-150">
                <td className="p-3 font-extrabold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>{a.teacherName}</span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {a.subjects.map(s => (
                      <span key={s} className="bg-blue-50 border border-blue-100 text-brandBlue px-2 py-0.5 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-[300px]">
                    {a.classes.map(c => (
                      <span key={c} className="bg-orange-50 border border-orange-100 text-brandOrange px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex gap-1.5 justify-end">
                    <button 
                      onClick={() => handleOpenEdit(a)}
                      className="bg-blue-50 hover:bg-blue-600 text-brandBlue hover:text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(a.id)}
                      className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border font-semibold text-slate-600 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-brandBlue flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{editingId ? 'Chỉnh Sửa Phân Công' : 'Biên Soạn Phân Công Giảng Dạy'}</span>
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">1. Chọn giáo viên giảng dạy</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brandBlue cursor-pointer"
                >
                  {accounts.filter(a => a.role === 'Giáo viên').map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.extra})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">2. Môn dạy (Có thể tích chọn nhiều môn)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 text-[11px] gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                  {fullSubjectsList.map(sub => {
                    const hasSub = selectedSubjects.includes(sub);
                    return (
                      <label key={sub} className="flex items-center gap-1.5 p-1.5 hover:bg-white rounded border border-transparent hover:border-blue-200 cursor-pointer transition">
                        <input 
                          type="checkbox" 
                          checked={hasSub}
                          onChange={() => toggleSubject(sub)}
                          className="w-3.5 h-3.5 rounded text-brandBlue" 
                        />
                        <span>{sub}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">3. Khối / Lớp học phụ trách giảng dạy</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 text-[11px] gap-2 p-3 bg-orange-50/50 border border-orange-100 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                  {classes.map(c => {
                    const hasCls = selectedClasses.includes(c.lop);
                    return (
                      <label key={c.id} className="flex items-center gap-1.5 p-1.5 hover:bg-white rounded border border-transparent hover:border-orange-200 cursor-pointer transition">
                        <input 
                          type="checkbox" 
                          checked={hasCls}
                          onChange={() => toggleClass(c.lop)}
                          className="w-3.5 h-3.5 rounded text-brandOrange" 
                        />
                        <span>Lớp {c.lop}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-brandBlue hover:bg-brandBlue-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Lưu Phân Công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 4. GRADING DESK COMPONENT
// ==========================================
interface GradingDeskProps {
  submissions: Submission[];
  onSaveSubmissions: (list: Submission[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalGradingDesk({
  submissions,
  onSaveSubmissions,
  showToast
}: GradingDeskProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeSub, setActiveSub] = useState<Submission | null>(null);
  
  // Grading State
  const [essayScore, setEssayScore] = useState<number>(0);
  const [remark, setRemark] = useState('');

  const openGrading = (sub: Submission) => {
    setActiveSub(sub);
    setEssayScore(sub.essayScore || 0);
    setRemark(sub.remark || '');
    setShowModal(true);
  };

  const handleGradeSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;

    if (essayScore < 0 || essayScore > activeSub.essayMaxScore) {
      showToast(`Điểm tự luận tối thiểu là 0 và tối đa không được vượt quá ${activeSub.essayMaxScore}đ!`, "error");
      return;
    }

    const calculatedGrade = Math.round((activeSub.mcqScore + essayScore) * 10) / 10;

    const updated = submissions.map(s => 
      s.id === activeSub.id 
        ? { 
            ...s, 
            essayScore, 
            grade: calculatedGrade, 
            remark: remark.trim() || 'Giáo viên bộ môn đã chấm đạt yêu cầu.',
            isSynced: true 
          }
        : s
    );

    onSaveSubmissions(updated);
    setShowModal(false);
    showToast(`Đã đồng bộ tổng điểm (${calculatedGrade}đ) của học sinh ${activeSub.student} thành công!`, "success");
  };

  const pendingGrading = submissions.filter(s => s.grade === null);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <CheckSquare className="w-5 h-5 text-rose-600" /> Chấm điểm &amp; Đồng bộ học bạ số tự động
      </h3>

      <div className="space-y-4">
        {pendingGrading.length > 0 ? (
          pendingGrading.map(sub => (
            <div key={sub.id} className="p-4 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-rose-300 transition shadow-sm font-semibold">
              <div>
                <b className="text-slate-800 text-sm">{sub.student}</b>
                <p className="text-xs text-slate-500 mt-1">
                  Lớp: <span className="text-slate-800 font-bold">{sub.class}</span> | 
                  Chuyên môn: <span className="font-bold text-brandBlue">{sub.subject}</span> | 
                  Khảo thí: <span className="font-semibold text-slate-600">{sub.type}</span>
                </p>
                <span className="text-[10px] text-slate-400 font-bold font-mono">Thời gian nộp: {sub.date}</span>
              </div>
              
              <button 
                onClick={() => openGrading(sub)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" /> Chấm điểm
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-6 italic font-bold">
            ✓ Tuyệt vời! Toàn bộ bài kiểm tra đã được chấm hoàn tất và đồng bộ vào cơ sở học vụ số.
          </div>
        )}
      </div>

      {/* Grading Detail Modal */}
      {showModal && activeSub && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 font-semibold text-slate-600 max-h-[95vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm uppercase flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-brandBlue animate-pulse" /> Đánh giá phiếu khảo thí chi tiết
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSave} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-normal text-xs text-slate-700">
                <p><b>Học sinh:</b> {activeSub.student} (Lớp {activeSub.class})</p>
                <p><b>Bài thi:</b> Môn {activeSub.subject} - Đề: {activeSub.type}</p>
                <p><b>Nộp bài ngày:</b> {activeSub.date}</p>
              </div>

              {/* Autograded section */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase block mb-1">1. Điểm trắc nghiệm (đối khớp tự động):</span>
                  <p className="font-medium text-slate-500 text-[10px]">Phương án làm bài: <code className="font-mono text-emerald-900 bg-white px-2 py-0.5 rounded border ml-1 font-bold">{activeSub.answers || 'Không làm'}</code></p>
                </div>
                <div className="bg-white border rounded-xl px-3 py-1.5 text-center shadow-sm">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Phần MCQ</span>
                  <span className="text-sm font-black text-emerald-700">{activeSub.mcqScore.toFixed(1)} / {activeSub.mcqMaxScore}đ</span>
                </div>
              </div>

              {/* Essay handgrading section */}
              <div className="bg-slate-50 p-4 border rounded-xl shadow-inner space-y-2">
                <span className="text-[10px] font-black text-brandOrange uppercase block">2. Chấm điểm bài giải tự luận (Chấm thủ công):</span>
                
                {activeSub.text && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border font-medium italic leading-relaxed shadow-sm">
                    "${activeSub.text}"
                  </p>
                )}

                {activeSub.fileData && (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border text-[11px] font-medium shadow-sm">
                    <span className="text-slate-500 font-bold">File tự luận nộp kèm: <b className="text-brandBlue">{activeSub.fileData.name}</b></span>
                    <button 
                      type="button" 
                      onClick={() => showToast(`Tải xuống bài làm: ${activeSub.fileData?.name}`, "success")}
                      className="bg-brandBlue text-white text-[9px] px-2 py-1 rounded shadow-inner font-black cursor-pointer"
                    >
                      Tải File (.jpg)
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nhập điểm phần tự luận (Tối đa {activeSub.essayMaxScore}đ):</label>
                  <input
                    type="number"
                    value={essayScore}
                    onChange={(e) => setEssayScore(parseFloat(e.target.value) || 0)}
                    min="0"
                    max={activeSub.essayMaxScore}
                    step="0.25"
                    className="w-full text-xs p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-brandOrange font-bold"
                    placeholder={`Tối đa ${activeSub.essayMaxScore}`}
                    required
                  />
                </div>
              </div>

              {/* Dynamic total score visualization */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="block font-black text-slate-700 uppercase">TỔNG ĐIỂM ĐỒNG BỘ:</span>
                  <span className="text-[9px] text-slate-400 italic font-medium">(Tự động chấm: {activeSub.mcqScore}đ + Tự luận: {essayScore}đ)</span>
                </div>
                <div className="bg-white border rounded-xl px-4 py-2 text-center shadow-md">
                  <span className="text-xl font-black text-brandBlue">
                    {Math.min(10.0, activeSub.mcqScore + essayScore).toFixed(1)}
                  </span>
                  <span className="block text-[8px] text-slate-400 font-bold">Thang 10</span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Lời nhận xét / Phê bình của giáo viên</label>
                <textarea
                  rows={2}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-medium focus:bg-white"
                  placeholder="Ví dụ: Em giải bài sáng tạo, chữ viết sạch đẹp. Cần rèn luyện thêm trắc nghiệm phản xạ nhanh."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Đồng Bộ Điểm Học Bạ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
