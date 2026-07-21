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
  CornerDownRight,
  RefreshCw,
  UserCheck,
  UserPlus,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import * as XLSX from 'xlsx';
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
  onSaveAccounts?: (list: User[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalClassStructure({
  classes,
  onSaveClasses,
  accounts,
  onSaveAccounts,
  showToast
}: ClassStructureProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [khoi, setKhoi] = useState('6');
  const [lop, setLop] = useState('');
  const [gvcn, setGvcn] = useState('');

  // Sync / Class detail states
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');

  const generateUsernameFromName = (name: string, className: string): string => {
    if (!name.trim()) return '';
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '');
    const cleanClass = className.toLowerCase().replace(/\s+/g, '');
    return `${cleanName}_${cleanClass}`;
  };

  // Download Excel template
  const downloadTemplate = (className: string) => {
    try {
      const data = [
        {
          "STT": 1,
          "Họ và tên": "Nguyễn Văn An",
          "Lớp": className
        },
        {
          "STT": 2,
          "Họ và tên": "Trần Thị Hồng",
          "Lớp": className
        },
        {
          "STT": 3,
          "Họ và tên": "Phạm Quốc Khánh",
          "Lớp": className
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mẫu cấp tài khoản");
      
      const colWidths = [
        { wch: 6 },  // STT
        { wch: 25 }, // Họ và tên
        { wch: 12 }  // Lớp
      ];
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(workbook, `Bieu_Mau_Cap_Tai_Khoan_Lop_${className}.xlsx`);
      showToast("Tải biểu mẫu Excel thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi tạo file mẫu Excel!", "error");
    }
  };

  // Export current students to Excel
  const exportToExcel = (students: User[], className: string) => {
    try {
      if (students.length === 0) {
        showToast("Lớp hiện không có học sinh nào để xuất!", "info");
        return;
      }

      const data = students.map((s, idx) => ({
        "STT": idx + 1,
        "Họ và tên": s.name,
        "Tên đăng nhập": s.username,
        "Mật khẩu mặc định": "123",
        "Vai trò": "Học sinh",
        "Lớp": s.extra
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Học sinh lớp ${className}`);
      
      const colWidths = [
        { wch: 6 },  // STT
        { wch: 25 }, // Họ và tên
        { wch: 22 }, // Tên đăng nhập
        { wch: 18 }, // Mật khẩu mặc định
        { wch: 12 }, // Vai trò
        { wch: 10 }  // Lớp
      ];
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(workbook, `Danh_Sach_Tai_Khoan_Hoc_Sinh_Lop_${className}.xlsx`);
      showToast(`Xuất file Excel danh sách lớp ${className} thành công!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xuất danh sách học sinh ra file Excel!", "error");
    }
  };

  // Import students from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>, className: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (data.length === 0) {
          showToast("File Excel rỗng hoặc không có dữ liệu hợp lệ!", "error");
          return;
        }

        // Find the "Họ và tên" or similar column
        const firstRow = data[0];
        const nameKey = Object.keys(firstRow).find(key => 
          key.toLowerCase().includes("họ") || 
          key.toLowerCase().includes("tên") || 
          key.toLowerCase().includes("name") ||
          key.toLowerCase() === "ho_va_ten"
        );
        
        if (!nameKey) {
          showToast("Không tìm thấy cột 'Họ và tên' hoặc 'Name' trong file Excel!", "error");
          return;
        }

        const importedAccounts: User[] = [];
        let allUsernames = [...accounts.map(a => a.username)];

        data.forEach((row: any, i: number) => {
          const rawName = row[nameKey]?.toString().trim();
          if (!rawName) return;

          // Generate username automatically
          let baseUsername = generateUsernameFromName(rawName, className);
          let username = baseUsername;
          let counter = 1;

          // Resolve duplicate usernames
          while (allUsernames.includes(username)) {
            username = `${baseUsername}_${counter}`;
            counter++;
          }

          allUsernames.push(username);

          importedAccounts.push({
            id: Date.now() + i + Math.floor(Math.random() * 1000),
            name: rawName,
            username: username,
            password: '123',
            role: 'Học sinh',
            extra: className,
            isFirstLogin: true,
            canPostNews: false
          });
        });

        if (importedAccounts.length === 0) {
          showToast("Không phát hiện học sinh nào hợp lệ từ file Excel!", "error");
          return;
        }

        if (onSaveAccounts) {
          onSaveAccounts([...accounts, ...importedAccounts]);
          showToast(`Nhập dữ liệu thành công! Đã cấp thêm ${importedAccounts.length} tài khoản học sinh lớp ${className} từ file Excel.`, "success");
          
          // Also automatically synchronize classes list total count
          const updatedClasses = classes.map(c => {
            if (c.lop === className) {
              const prevStudentsCount = accounts.filter(a => a.role === 'Học sinh' && a.extra === className).length;
              return { ...c, total: prevStudentsCount + importedAccounts.length };
            }
            return c;
          });
          onSaveClasses(updatedClasses);

          // Update the local state for selected class to represent updated sĩ số
          if (selectedClass && selectedClass.lop === className) {
            setSelectedClass({
              ...selectedClass,
              total: accounts.filter(a => a.role === 'Học sinh' && a.extra === className).length + importedAccounts.length
            });
          }
        } else {
          showToast("Chức năng lưu tài khoản chưa được thiết lập trên máy chủ!", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Có lỗi xảy ra khi xử lý file Excel. Vui lòng kiểm tra lại định dạng!", "error");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

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

  // Sync Class size to match the number of student accounts
  const handleSyncClassSize = (classId: string, actualCount: number) => {
    const updated = classes.map(c => {
      if (c.id === classId) {
        return { ...c, total: actualCount };
      }
      return c;
    });
    onSaveClasses(updated);

    if (selectedClass && selectedClass.id === classId) {
      setSelectedClass({ ...selectedClass, total: actualCount });
    }

    showToast(`Đồng bộ sĩ số lớp ${classId} thành ${actualCount} thành công!`, "success");
  };

  // Sync all classes with actual accounts in system
  const handleSyncAllClasses = () => {
    const updated = classes.map(c => {
      const actualCount = accounts.filter(a => a.role === 'Học sinh' && a.extra === c.lop).length;
      return { ...c, total: actualCount };
    });
    onSaveClasses(updated);
    showToast("Đã quét và đồng bộ sĩ số danh nghĩa với số lượng tài khoản thực tế cho toàn bộ các lớp!", "success");
  };

  // Auto generate 10 mock student accounts for a class
  const handleAutoGenerateStudents = (className: string) => {
    const sampleNames = [
      "Nguyễn Văn Minh", "Trần Thị Hồng", "Lê Hoàng Đức", "Phạm Hải Yến",
      "Vũ Quốc Khánh", "Nguyễn Thu Trang", "Đỗ Bảo Long", "Phan Thanh Trúc",
      "Hoàng Gia Huy", "Ngô Quỳnh Anh", "Lý Hoài Nam", "Dương Cẩm Tú",
      "Đặng Văn Hùng", "Bùi Mai Chi", "Trịnh Xuân Đạt", "Võ Mỹ Linh"
    ];

    const currentClassStudents = accounts.filter(a => a.role === 'Học sinh' && a.extra === className);
    const existingIndex = currentClassStudents.length;

    const generatedAccounts: User[] = [];
    const prefix = className.toLowerCase();

    for (let i = 0; i < 8; i++) {
      const studentName = sampleNames[(existingIndex + i) % sampleNames.length];
      const username = `${prefix}_hs${existingIndex + i + 1}`;

      if (accounts.some(a => a.username === username)) {
        continue;
      }

      generatedAccounts.push({
        id: Date.now() + i,
        name: studentName,
        username: username,
        password: '123',
        role: 'Học sinh',
        extra: className,
        isFirstLogin: true,
        canPostNews: false
      });
    }

    if (generatedAccounts.length === 0) {
      showToast("Không thể tạo thêm tài khoản học sinh tự động (trùng tên đăng nhập)!", "error");
      return;
    }

    if (onSaveAccounts) {
      onSaveAccounts([...accounts, ...generatedAccounts]);
      showToast(`Đã tự động tạo và cấp ${generatedAccounts.length} tài khoản học sinh mẫu cho lớp ${className}!`, "success");
    } else {
      showToast("Chức năng đồng bộ tài khoản chưa khả dụng!", "error");
    }
  };

  // Add a single student manually
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    if (!newStudentName.trim() || !newStudentUsername.trim()) {
      showToast("Vui lòng nhập Họ tên và Tên đăng nhập học sinh!", "error");
      return;
    }

    const username = newStudentUsername.trim().toLowerCase().replace(/\s+/g, '');
    if (accounts.some(a => a.username === username)) {
      showToast("Tên tài khoản này đã tồn tại trong hệ thống!", "error");
      return;
    }

    const newStudent: User = {
      id: Date.now(),
      name: newStudentName.trim(),
      username: username,
      password: '123',
      role: 'Học sinh',
      extra: selectedClass.lop,
      isFirstLogin: true,
      canPostNews: false
    };

    if (onSaveAccounts) {
      onSaveAccounts([...accounts, newStudent]);
      setNewStudentName('');
      setNewStudentUsername('');
      showToast(`Cấp tài khoản cho học sinh ${newStudent.name} thành công!`, "success");
    } else {
      showToast("Chức năng đồng bộ tài khoản chưa khả dụng!", "error");
    }
  };

  // Delete a student account
  const handleDeleteStudent = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản học sinh này?")) {
      if (onSaveAccounts) {
        onSaveAccounts(accounts.filter(a => a.id !== id));
        showToast("Đã xóa tài khoản học sinh thành công!", "success");
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center border-b pb-4 mb-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <School className="w-5 h-5 text-brandBlue" /> Cơ cấu Khối / Lớp học trực thuộc nhà trường
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Kích chuột vào từng thẻ lớp để xem, quản lý danh sách học sinh và đồng bộ tài khoản.
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleSyncAllClasses}
            className="border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Đồng bộ sĩ số tất cả các lớp dựa theo số tài khoản thực tế"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            Đồng bộ toàn bộ sĩ số
          </button>

          <button 
            onClick={openModal}
            className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs px-4 py-1.5 rounded-lg font-bold shadow transition cursor-pointer"
          >
            Thêm Lớp Mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {classes.map(c => {
          // Count active accounts for this class
          const actualStudentCount = accounts.filter(a => a.role === 'Học sinh' && a.extra === c.lop).length;
          const isSynced = c.total === actualStudentCount;

          return (
            <div 
              key={c.id} 
              onClick={() => setSelectedClass(c)}
              className="bg-slate-50 hover:bg-white p-4 border border-slate-200 hover:border-brandOrange hover:shadow-md rounded-2xl relative shadow-sm font-semibold transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div>
                <div className="flex justify-between items-center border-b pb-1.5 mb-1.5">
                  <b className="text-brandBlue group-hover:text-brandOrange text-sm block transition-colors">Lớp {c.lop}</b>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    isSynced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`} title={isSynced ? "Sĩ số đã đồng bộ" : "Sĩ số lệch danh nghĩa"}>
                    {isSynced ? "Khớp" : "Lệch"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mb-1">
                  <b>GVCN:</b> {c.gvcn}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  <b>Sĩ số:</b> {c.total} học sinh
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  Đã cấp: <b>{actualStudentCount} tài khoản</b>
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-brandOrange flex items-center gap-1 text-[9px] font-bold mt-2 self-end">
                <span>Quản lý &amp; Đồng bộ</span> &rarr;
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
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
                  className="w-full text-xs p-2.5 border rounded-lg bg-white cursor-pointer font-bold"
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
                  className="w-full text-xs p-2.5 border rounded-lg bg-white cursor-pointer font-bold"
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

      {/* Class Detail & Student Sync Modal */}
      <AnimatePresence>
        {selectedClass && (() => {
          const classStudents = accounts.filter(a => a.role === 'Học sinh' && a.extra === selectedClass.lop);
          const isSynced = selectedClass.total === classStudents.length;

          return (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
              onClick={() => setSelectedClass(null)}
            >
              <motion.div 
                className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 font-semibold text-slate-600 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex justify-between items-center border-b pb-3.5 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-brandOrange flex items-center justify-center border border-orange-100">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Thông Tin &amp; Đồng Bộ Lớp {selectedClass.lop}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">GVCN: {selectedClass.gvcn} • Sĩ số khai báo: {selectedClass.total} học sinh</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedClass(null)} 
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Synchronization Status Box */}
                <div className={`p-4 rounded-2xl border mb-4 text-xs ${
                  isSynced 
                    ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800' 
                    : 'bg-amber-50/70 border-amber-100 text-amber-800'
                }`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-2">
                      {isSynced ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-extrabold text-xs block">
                          {isSynced ? "Đã đồng bộ hoàn hảo!" : "Phát hiện lệch sĩ số!"}
                        </span>
                        <span className="text-[10px] leading-normal font-medium mt-1 block">
                          {isSynced 
                            ? `Sĩ số danh nghĩa của lớp (${selectedClass.total}) trùng khớp chính xác với số lượng tài khoản học sinh đã cấp thực tế trên hệ thống.`
                            : `Sĩ số danh nghĩa là ${selectedClass.total}, nhưng chỉ có ${classStudents.length} tài khoản học sinh tương ứng. Vui lòng nhấn nút bên cạnh để đồng bộ.`
                          }
                        </span>
                      </div>
                    </div>

                    {!isSynced && (
                      <button
                        onClick={() => handleSyncClassSize(selectedClass.id, classStudents.length)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-sm shrink-0 flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Đồng bộ ngay
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtitle / Tools */}
                <div className="flex justify-between items-center mb-2.5 mt-1">
                  <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                    <Users className="w-4 h-4 text-brandBlue" />
                    Tài khoản học sinh trực thuộc ({classStudents.length})
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleAutoGenerateStudents(selectedClass.lop)}
                    className="text-brandBlue hover:text-brandBlue-dark text-[10px] font-bold flex items-center gap-1 hover:underline transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brandOrange animate-pulse" />
                    Cấp nhanh 8 tài khoản mẫu
                  </button>
                </div>

                {/* Student list */}
                <div className="border border-slate-100 rounded-xl max-h-56 overflow-y-auto custom-scrollbar mb-4 bg-slate-50/50">
                  {classStudents.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-medium">
                      Chưa có tài khoản học sinh nào được cấp cho lớp này.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase text-[9px] border-b border-slate-200">
                          <th className="p-2.5">Họ và tên</th>
                          <th className="p-2.5">Tên đăng nhập</th>
                          <th className="p-2.5">Trạng thái</th>
                          <th className="p-2.5 text-right">Tác vụ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {classStudents.map(student => (
                          <tr key={student.id} className="hover:bg-slate-100/50 transition">
                            <td className="p-2.5 font-extrabold text-slate-800">{student.name}</td>
                            <td className="p-2.5 font-mono text-[10px] text-slate-500">{student.username}</td>
                            <td className="p-2.5">
                              <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-100 font-black">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                                Hoạt động
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition"
                                title="Xóa tài khoản học sinh"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Excel integration tools */}
                <div className="border-t pt-4 pb-1 mb-4">
                  <h5 className="font-extrabold text-xs text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Quản lý tài khoản hàng loạt qua Excel
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Template download */}
                    <button
                      type="button"
                      onClick={() => downloadTemplate(selectedClass.lop)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition font-bold border border-slate-200 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-600" />
                      Tải biểu mẫu Excel
                    </button>

                    {/* Export current students */}
                    <button
                      type="button"
                      onClick={() => exportToExcel(classStudents, selectedClass.lop)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition font-bold border border-slate-200 cursor-pointer"
                      disabled={classStudents.length === 0}
                      style={{ opacity: classStudents.length === 0 ? 0.6 : 1 }}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      Xuất danh sách Excel
                    </button>

                    {/* Upload button wrapper */}
                    <div className="relative">
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="excel-file-upload-input"
                        onChange={(e) => handleImportExcel(e, selectedClass.lop)}
                        className="hidden"
                      />
                      <label
                        htmlFor="excel-file-upload-input"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition font-bold border border-emerald-200 cursor-pointer w-full text-center block"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
                        Tải file Excel lên
                      </label>
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-slate-400 font-medium mt-2 leading-relaxed">
                    * Gợi ý: Hãy nhấn <b>Tải biểu mẫu Excel</b>, điền thông tin học sinh rồi bấm <b>Tải file Excel lên</b>. Hệ thống tự động sinh tài khoản theo mẫu <code>tên_lớp</code> (không dấu) và đặt mật khẩu là <code>123</code>.
                  </p>
                </div>

                {/* Add student inline form */}
                <div className="border-t pt-4">
                  <h5 className="font-extrabold text-xs text-slate-800 mb-2 flex items-center gap-1">
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    Cấp tài khoản lẻ cho lớp {selectedClass.lop}
                  </h5>

                  <form onSubmit={handleAddSingleStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        value={newStudentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewStudentName(val);
                          setNewStudentUsername(generateUsernameFromName(val, selectedClass.lop));
                        }}
                        placeholder="Họ và tên học sinh"
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none font-bold placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newStudentUsername}
                        onChange={(e) => setNewStudentUsername(e.target.value)}
                        placeholder="Tên đăng nhập (ví dụ: hs_9a_an)"
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none font-mono text-[11px] placeholder:font-normal"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Cấp tài khoản
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
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
