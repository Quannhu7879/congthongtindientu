import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  FileSpreadsheet, 
  Eye, 
  Save, 
  Search, 
  Star, 
  MessageSquare, 
  Trophy, 
  AlertCircle, 
  Smile, 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  Award,
  User as UserIcon,
  ChevronRight,
  Heart,
  Share2,
  ListFilter,
  X
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { 
  User, 
  Submission, 
  ClassItem, 
  Survey, 
  Assignment 
} from '../types';

// ==========================================
// 1. TRANSCRIPT REPORT COMPONENT
// ==========================================
interface TranscriptProps {
  currentUser: User | null;
  submissions: Submission[];
  classes: ClassItem[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalTranscript({
  currentUser,
  submissions,
  classes,
  showToast
}: TranscriptProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudentReport, setSelectedStudentReport] = useState<any | null>(null);

  // Derive consolidated student grades
  // For the sake of school records, we extract graded submissions (grade !== null)
  const gradedList = submissions.filter(s => s.grade !== null);

  // Group by student to build a report card
  const studentReportMap: Record<string, any> = {};

  // Seed default students if any to populate list beautifully
  const studentRoster = [
    { name: "Nguyễn Minh Anh", lop: "9A", conduct: "Tốt", presence: "45/45" },
    { name: "Phạm Quốc Bảo", lop: "9A", conduct: "Tốt", presence: "44/45" },
    { name: "Trần Khánh Vy", lop: "9A", conduct: "Tốt", presence: "45/45" },
    { name: "Lê Hoàng Long", lop: "8B", conduct: "Khá", presence: "43/45" },
    { name: "Vũ Phương Thảo", lop: "8B", conduct: "Tốt", presence: "45/45" },
    { name: "Đỗ Gia Huy", lop: "7C", conduct: "Tốt", presence: "45/45" },
    { name: "Phùng Tiến Đạt", lop: "6D", conduct: "Khá", presence: "42/45" },
  ];

  studentRoster.forEach(s => {
    studentReportMap[s.name] = {
      name: s.name,
      lop: s.lop,
      conduct: s.conduct,
      presence: s.presence,
      grades: {
        "Toán": 8.5,
        "Ngữ Văn": 8.0,
        "Tiếng Anh": 9.0,
        "Vật lý": 8.5,
        "Sinh học": 7.5
      }
    };
  });

  // Inject current submissions into the records
  gradedList.forEach(sub => {
    if (!studentReportMap[sub.student]) {
      studentReportMap[sub.student] = {
        name: sub.student,
        lop: sub.class,
        conduct: "Tốt",
        presence: "45/45",
        grades: {}
      };
    }
    studentReportMap[sub.student].grades[sub.subject] = sub.grade;
  });

  const studentsList = Object.values(studentReportMap);

  // Filters
  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.lop === selectedClass;
    return matchesSearch && matchesClass;
  });

  const viewReportCard = (std: any) => {
    setSelectedStudentReport(std);
    showToast(`Mở học bạ số chi tiết của em ${std.name}!`, "info");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" /> Bảng điểm học bạ số &amp; Tổng hợp kết quả học tập
      </h3>

      {/* Filter and search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-brandBlue font-bold"
            placeholder="Tìm kiếm học sinh theo tên..."
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
        </div>
        
        <div className="flex gap-1.5 shrink-0">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs border p-2 bg-white rounded-xl font-bold cursor-pointer outline-none"
          >
            <option value="all">Tất cả các Lớp</option>
            {classes.map(c => (
              <option key={c.id} value={c.lop}>Lớp {c.lop}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100 text-[10px]">
              <th className="p-3">Học sinh / Lớp</th>
              <th className="p-3">Hạnh kiểm</th>
              <th className="p-3">Hiện diện</th>
              <th className="p-3 text-center">Toán</th>
              <th className="p-3 text-center">Ngữ Văn</th>
              <th className="p-3 text-center">Ngoại ngữ</th>
              <th className="p-3 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredStudents.map((std, idx) => {
              const tScore = std.grades["Toán"] || '-';
              const vScore = std.grades["Ngữ Văn"] || '-';
              const eScore = std.grades["Tiếng Anh"] || '-';
              
              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="p-3">
                    <span className="font-extrabold text-slate-800">{std.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Khối Lớp: {std.lop}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                      std.conduct === 'Tốt' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}>
                      {std.conduct}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono font-bold">{std.presence}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{tScore}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{vScore}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{eScore}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => viewReportCard(std)}
                      className="text-brandBlue hover:text-brandBlue-dark font-extrabold bg-blue-50 hover:bg-blue-100 border border-blue-100 p-1.5 rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem sổ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Report Card Overlay Modal */}
      {selectedStudentReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs text-slate-600 font-semibold max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brandOrange animate-pulse" /> Sổ điểm danh dự điện tử
              </h4>
              <button onClick={() => setSelectedStudentReport(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-4 text-white shadow-inner mb-4 relative overflow-hidden">
              <div className="absolute right-3 bottom-0 opacity-10">
                <UserIcon className="w-24 h-24" />
              </div>
              <h5 className="text-sm font-black uppercase tracking-tight">{selectedStudentReport.name}</h5>
              <p className="text-[10px] text-teal-100">Chi đội: Lớp {selectedStudentReport.lop} • Trường THCS Hòa Phú</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3.5 border-t border-white/20 pt-2.5 text-[10px] font-bold">
                <span>Chuyên cần: {selectedStudentReport.presence}</span>
                <span>Hạnh kiểm: {selectedStudentReport.conduct}</span>
              </div>
            </div>

            <h6 className="font-black text-[10px] text-slate-400 uppercase tracking-wider mb-2.5">ĐIỂM TRUNG BÌNH CÁC MÔN HỌC KỲ II:</h6>
            
            <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border">
              {Object.keys(selectedStudentReport.grades).map((subj) => {
                const val = selectedStudentReport.grades[subj];
                const pct = val * 10;
                let barColor = "bg-brandBlue";
                if (val >= 9.0) barColor = "bg-brandOrange";
                else if (val >= 8.0) barColor = "bg-emerald-500";

                return (
                  <div key={subj}>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span>{subj}</span>
                      <span className="text-slate-800">{val.toFixed(1)} / 10.0</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full">
                      <div className={`${barColor} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedStudentReport(null)}
              className="w-full mt-5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3 rounded-xl transition shadow"
            >
              Đóng sổ điểm số
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 2. CONTACT BOOK COMPONENT
// ==========================================
interface ContactBookProps {
  currentUser: User | null;
  submissions: Submission[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalContactBook({
  currentUser,
  submissions,
  showToast
}: ContactBookProps) {
  const [commentText, setCommentText] = useState('');
  const [confirmReceipt, setConfirmReceipt] = useState(false);
  const [remarksHistory, setRemarksHistory] = useState([
    {
      id: 1,
      sender: "Cô Nguyễn Hồng Hạnh (GVCN)",
      msg: "Con có tinh thần tự giác học tập rất tốt, chú ý xây dựng bài môn Toán xuất sắc.",
      date: "18/06/2026",
      likes: 2,
      replies: [
        { name: "Phụ huynh em Nguyễn Minh Anh", text: "Cảm ơn Cô giáo đã dạy bảo và quan tâm cháu!" }
      ]
    },
    {
      id: 2,
      sender: "Thầy Trịnh Văn Tùng (GV Vật Lý)",
      msg: "Bài kiểm tra thực hành Lý của em đạt điểm tối đa, hoạt động đội nhóm hăng hái.",
      date: "14/06/2026",
      likes: 1,
      replies: []
    }
  ]);

  const handlePostReply = (id: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast("Vui lòng nhập nội dung phản hồi!", "error");
      return;
    }

    const parentName = currentUser ? currentUser.name : "Phụ huynh học sinh";
    const updated = remarksHistory.map(rem => {
      if (rem.id === id) {
        return {
          ...rem,
          replies: [...rem.replies, { name: parentName, text: commentText.trim() }]
        };
      }
      return rem;
    });

    setRemarksHistory(updated);
    setCommentText('');
    setConfirmReceipt(true);
    showToast("Phản hồi ý kiến và xác nhận ký số gia đình thành công!", "success");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <MessageSquare className="w-5 h-5 text-indigo-600" /> Sổ liên lạc gia đình &amp; Tương tác trực tuyến với Giáo viên
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Child overall stats */}
        <div className="bg-slate-50 p-4 rounded-2xl border flex flex-col justify-between font-semibold text-slate-700">
          <span className="text-[10px] text-slate-400 font-black uppercase">1. Thông tin thể chất &amp; Y tế</span>
          
          <div className="my-3 space-y-1 text-xs">
            <p><b>Họ tên:</b> {currentUser?.role === 'Phụ huynh' ? currentUser.extra.replace("Phụ huynh ", "") : (currentUser?.name || "Nguyễn Minh Anh")}</p>
            <p><b>Cân nặng:</b> 46 kg</p>
            <p><b>Chiều cao:</b> 156 cm</p>
            <p><b>Thị lực:</b> 10/10 (Tốt)</p>
          </div>
          
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] px-2 py-0.5 rounded-lg text-center font-black">
            Khỏe mạnh bình thường
          </span>
        </div>

        {/* Attendance overview */}
        <div className="bg-slate-50 p-4 rounded-2xl border flex flex-col justify-between font-semibold text-slate-700">
          <span className="text-[10px] text-slate-400 font-black uppercase">2. Thống kê Chuyên cần</span>
          
          <div className="my-3 space-y-1 text-xs">
            <p><b>Tổng số buổi học:</b> 45 buổi</p>
            <p><b>Hiện diện có mặt:</b> 45 buổi</p>
            <p><b>Vắng có phép:</b> 0 buổi</p>
            <p><b>Vắng không phép:</b> 0 buổi</p>
          </div>
          
          <span className="bg-blue-50 text-brandBlue border border-blue-100 text-[9px] px-2 py-0.5 rounded-lg text-center font-black">
            Điểm chuyên cần: 10.0 / 10
          </span>
        </div>

        {/* Digital Signature Confirmation */}
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex flex-col justify-between font-semibold text-slate-700">
          <span className="text-[10px] text-amber-800 font-black uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Ký xác nhận của gia đình
          </span>
          
          <p className="text-[10px] text-amber-700 leading-normal italic my-2">
            Phụ huynh vui lòng gửi lời nhắn phản hồi bên dưới bất kỳ phiếu nhận xét nào để kích hoạt dấu ký điện tử "Đã nhận tin báo".
          </p>

          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full ${confirmReceipt ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
            <span className="text-[10px] font-bold text-slate-800">
              {confirmReceipt ? "✓ Đã xác nhận gia đình" : "Chờ phụ huynh phản hồi"}
            </span>
          </div>
        </div>
      </div>

      {/* Remarks history feed */}
      <h4 className="font-extrabold text-slate-800 text-xs border-b pb-2 mb-4 uppercase tracking-wider">
        Nhật ký nhận xét và tương tác từ Nhà trường
      </h4>

      <div className="space-y-4">
        {remarksHistory.map(rem => (
          <div key={rem.id} className="p-4 bg-slate-50 border rounded-2xl space-y-3 shadow-sm font-semibold text-slate-700">
            <div className="flex justify-between text-[10px] text-slate-400 font-black">
              <span className="text-brandBlue">{rem.sender}</span>
              <span>{rem.date}</span>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed italic pl-3.5 border-l-2 border-slate-300">
              "{rem.msg}"
            </p>

            {/* Replies (comments) thread */}
            {rem.replies.length > 0 && (
              <div className="pl-6 space-y-2.5 border-t pt-2.5">
                {rem.replies.map((rep, idx) => (
                  <div key={idx} className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl text-xs">
                    <span className="text-[9px] text-emerald-800 font-black block">{rep.name} (Gia đình):</span>
                    <p className="text-slate-600 font-medium mt-1">"{rep.text}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Response interactive form */}
            <form onSubmit={(e) => handlePostReply(rem.id, e)} className="flex gap-2 border-t pt-3">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="Nhập ý kiến phản hồi hoặc xác nhận đã xem..."
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Gửi phản hồi
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==========================================
// 3. EXPORT CENTER COMPONENT
// ==========================================
interface ExportProps {
  submissions: Submission[];
  surveys: Survey[];
  assignments: Assignment[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalExportCenter({
  submissions,
  surveys,
  assignments,
  showToast
}: ExportProps) {

  const handleExportTranscripts = () => {
    // 1. Prepare data format for Excel Sheet
    const data = submissions.map(s => ({
      "Họ và Tên Học Sinh": s.student,
      "Lớp Học": s.class,
      "Môn Học": s.subject,
      "Kỳ Khảo Thí": s.type,
      "Điểm Trắc Nghiệm (MCQ)": s.mcqScore,
      "Điểm Tự Luận": s.essayScore || 'Chưa chấm',
      "Tổng Điểm": s.grade || 'Chưa đồng bộ',
      "Ngày Thi / Nộp Bài": s.date,
      "Nhận Xét Của Giáo Viên": s.remark || ''
    }));

    // 2. Create Sheet using xlsx
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Bang_Diem_Hoc_Ba_So");

    // 3. Trigger local File writing
    writeFile(wb, "Bang_Diem_Khao_Thi_THCS_Hoa_Phu.xlsx");
    showToast("Đã trích xuất và tải xuống bảng điểm học kỳ II định dạng Excel thành công!", "success");
  };

  const handleExportSurveys = () => {
    const data = surveys.map(s => ({
      "Họ Tên Phụ Huynh / Học Sinh": s.parentName,
      "Khối Lớp": s.classInfo,
      "Nội dung Đóng Góp Ý Kiến": s.content,
      "Thời Gian Đăng Tải": s.date,
      "Tệp Đính Kèm Khảo Sát": s.file ? s.file.name : 'Không có'
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Khao_Sat_Gop_Y_Gia_Dinh");

    writeFile(wb, "YKien_KhaoSat_GiaDinh_HoaPhu.xlsx");
    showToast("Trích xuất kết quả khảo sát đóng góp ý kiến gia đình thành công!", "success");
  };

  const handleExportAssignments = () => {
    const data = assignments.map(a => ({
      "Tên Giáo Viên": a.teacherName,
      "Môn Giảng Dạy": a.subjects.join(', '),
      "Các Khối Lớp Phụ Trách": a.classes.join(', ')
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Phan_Cong_Giang_Day");

    writeFile(wb, "PhanCong_GiangDay_HocKyII.xlsx");
    showToast("Đã kết xuất danh mục phân công giáo viên thành công!", "success");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Trung tâm kết xuất dữ liệu Excel học vụ chính xác
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-4 border rounded-xl shadow-inner font-semibold">
          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Cơ sở dữ liệu học bạ</span>
          <span className="text-lg font-black text-slate-800">{submissions.length} phiếu</span>
          <p className="text-[10px] text-slate-400 mt-1">Gồm phiếu trắc nghiệm tự động chấm và điểm tự luận giáo viên.</p>
        </div>

        <div className="bg-slate-50 p-4 border rounded-xl shadow-inner font-semibold">
          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Khảo sát thu nhận</span>
          <span className="text-lg font-black text-slate-800">{surveys.length} đơn</span>
          <p className="text-[10px] text-slate-400 mt-1">Đóng góp ý kiến chuyển đổi số, dọn vệ sinh trường học.</p>
        </div>

        <div className="bg-slate-50 p-4 border rounded-xl shadow-inner font-semibold">
          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Chỉ mục dạy</span>
          <span className="text-lg font-black text-slate-800">{assignments.length} phân công</span>
          <p className="text-[10px] text-slate-400 mt-1">Giảng dạy chuyên đề văn hóa và bồi dưỡng bơi hè.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-300 transition duration-150 font-semibold text-slate-700">
          <div>
            <h4 className="text-slate-800 font-black text-sm">Trích xuất Bảng điểm Khảo thí &amp; Học bạ học kỳ II</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Biên soạn tệp báo cáo thành tích từng em theo mẫu quy chuẩn Sở GD&amp;ĐT.</p>
          </div>
          <button
            onClick={handleExportTranscripts}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Kết xuất Excel (.xlsx)
          </button>
        </div>

        <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-300 transition duration-150 font-semibold text-slate-700">
          <div>
            <h4 className="text-slate-800 font-black text-sm">Trích xuất kết quả khảo sát đóng góp ý kiến</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Xuất các ý kiến đóng góp trực tuyến và tệp đính kèm của cha mẹ.</p>
          </div>
          <button
            onClick={handleExportSurveys}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Kết xuất Excel (.xlsx)
          </button>
        </div>

        <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-300 transition duration-150 font-semibold text-slate-700">
          <div>
            <h4 className="text-slate-800 font-black text-sm">Danh mục phân công giảng dạy toàn cơ sở</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Phân bổ tổ bộ môn, môn học phụ trách cho toàn thể Giáo viên.</p>
          </div>
          <button
            onClick={handleExportAssignments}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Kết xuất Excel (.xlsx)
          </button>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. MINI GAME CENTER COMPONENT
// ==========================================
export function PortalMiniGameCenter({
  showToast
}: {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}) {
  const [secretNumber, setSecretNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('Hãy chọn một con số từ 1 đến 100 và ấn Đoán nhé!');
  const [guessesCount, setGuessesCount] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('school_game_highscore');
    return saved ? parseInt(saved) : 999;
  });

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(guess);
    if (isNaN(parsed) || parsed < 1 || parsed > 100) {
      showToast("Vui lòng nhập một số nguyên hợp lệ từ 1 đến 100!", "error");
      return;
    }

    const nextCount = guessesCount + 1;
    setGuessesCount(nextCount);

    if (parsed === secretNumber) {
      setFeedback(`🎉 CHÚC MỪNG EM! Con số may mắn chính xác là ${secretNumber}. Em đã đoán trúng sau ${nextCount} lượt thử!`);
      showToast("Đoán trúng rồi! Chúc mừng trí tuệ toán học xuất sắc của em!", "success");
      
      if (nextCount < highScore) {
        setHighScore(nextCount);
        localStorage.setItem('school_game_highscore', nextCount.toString());
        showToast("Kỷ lục trí tuệ mới của cá nhân em đã được thiết lập!", "info");
      }
    } else if (parsed > secretNumber) {
      setFeedback(`📉 Số ${parsed} quá LỚN rồi! Hãy thử đoán một con số bé hơn nhé.`);
    } else {
      setFeedback(`📈 Số ${parsed} quá BÉ rồi! Hãy thử đoán một con số lớn hơn nhé.`);
    }
    setGuess('');
  };

  const handleRestart = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuessesCount(0);
    setFeedback('Hệ thống đã chọn ngẫu nhiên một con số mới! Hãy tranh tài đoán nhanh nhé.');
    setGuess('');
    showToast("Trò chơi mới bắt đầu!", "success");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs animate-fade-in font-semibold text-slate-700">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-50" /> Cổng trò chơi rèn luyện tư duy Toán học Số Học
      </h3>

      <div className="max-w-md mx-auto text-center space-y-4 py-3">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <HelpCircle className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10" />
          <h4 className="text-base font-black uppercase tracking-wider mb-1">Con số may mắn (Lucky Number)</h4>
          <p className="text-[10px] text-violet-100 leading-normal font-medium">
            Rèn luyện tư duy chia đôi nhị phân! Hãy đoán xem máy tính đang ẩn giấu con số bí mật nào trong khoảng từ 1 tới 100.
          </p>

          <div className="flex justify-between items-center text-[10px] font-black border-t border-violet-400/30 pt-3.5 mt-3.5">
            <span>Số lượt đoán: <b className="text-yellow-300 font-mono text-sm">{guessesCount}</b></span>
            <span>Kỷ lục cá nhân: <b className="text-yellow-300 font-mono text-sm">{highScore === 999 ? 'Chưa lập' : `${highScore} lượt`}</b></span>
          </div>
        </div>

        {/* Feedback visual box */}
        <div className="bg-slate-50 p-4 rounded-xl border font-bold text-center text-slate-800 animate-pulse italic">
          "{feedback}"
        </div>

        {/* Input guess form */}
        <form onSubmit={handleGuessSubmit} className="flex gap-2">
          <input 
            type="number" 
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-1 text-center font-mono font-bold text-base p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
            placeholder="Ví dụ: 50"
            min="1"
            max="100"
            required
          />
          <button 
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-black px-6 py-3 rounded-xl transition shadow cursor-pointer"
          >
            Đoán
          </button>
        </form>

        <button
          onClick={handleRestart}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition border text-xs cursor-pointer"
        >
          Làm mới trò chơi
        </button>
      </div>
    </div>
  );
}
