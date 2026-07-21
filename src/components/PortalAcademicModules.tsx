import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Download, 
  UploadCloud, 
  Send, 
  Check, 
  X, 
  FileText, 
  FolderOpen, 
  Plus, 
  BookOpen, 
  PenTool, 
  AlertCircle,
  Timer,
  CheckCircle,
  Calendar,
  FileCode,
  Users,
  CloudLightning
} from 'lucide-react';
import { 
  User, 
  CourseRegistration, 
  OfficialDocument, 
  Homework, 
  Exam, 
  Submission, 
  ClassItem 
} from '../types';

// ==========================================
// 1. COURSE REGISTRATION COMPONENT
// ==========================================
interface CourseRegProps {
  currentUser: User | null;
  registrations: CourseRegistration[];
  onSaveRegistrations: (regs: CourseRegistration[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalCourseRegistration({
  currentUser,
  registrations,
  onSaveRegistrations,
  showToast
}: CourseRegProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const toggleCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const f = files[0];
      setUploadedFile({ name: f.name, size: (f.size / (1024 * 1024)).toFixed(2) + " MB" });
      showToast(`Đã nạp tệp: ${f.name}`, "success");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      setUploadedFile({ name: f.name, size: (f.size / (1024 * 1024)).toFixed(2) + " MB" });
      showToast(`Đã nạp tệp: ${f.name}`, "success");
    }
  };

  const downloadCourseTemplate = () => {
    const docHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="utf-8">
          <title>Đơn đăng ký bồi dưỡng</title>
          <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 30px; }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #000; padding: 10px; text-align: left; }
          </style>
      </head>
      <body>
          <h2 class="text-center font-bold">ĐƠN ĐĂNG KÝ HỌC NÂNG KHIẾU &amp; BỒI DƯỠNG HÈ</h2>
          <p class="text-center">Năm học 2025 - 2026</p>
          <p>Kính gửi: Ban Giám hiệu Trường THCS Hòa Phú</p>
          <p>Tên tôi là: .....................................................................................................................</p>
          <p>Phụ huynh em: ................................................................ Lớp: .........................</p>
          <p>Tôi xin tự nguyện đăng ký các lớp bồi dưỡng nâng cao năng lực văn hóa cho con em.</p>
          <p>Xin trân trọng cảm ơn!</p>
          <p style="text-align: right;"><i>Phụ huynh ký tên</i></p>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + docHTML], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Don_Dang_Ky_Hoc_Nang_Khieu.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Tải về biểu mẫu Word thành công!", "success");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Bạn cần đăng nhập để đăng ký khóa học!", "error");
      return;
    }
    if (selectedCourses.length === 0) {
      showToast("Vui lòng chọn ít nhất một lớp học!", "error");
      return;
    }
    if (!uploadedFile) {
      showToast("Vui lòng tải lên ảnh chụp/file biểu mẫu đã ký xác nhận!", "error");
      return;
    }

    const isStudent = currentUser.role === 'Học sinh';
    const studentName = isStudent ? currentUser.name : currentUser.extra.replace("Phụ huynh ", "").trim();
    const classInfo = isStudent ? currentUser.extra : "6A";

    const newReg: CourseRegistration = {
      id: Date.now(),
      studentName,
      classInfo,
      courses: selectedCourses,
      file: uploadedFile,
      status: 'Chờ duyệt',
      date: new Date().toLocaleDateString('vi-VN')
    };

    onSaveRegistrations([newReg, ...registrations]);
    setSelectedCourses([]);
    setUploadedFile(null);
    showToast("Đơn đăng ký bồi dưỡng đã gửi lên hệ thống học vụ!", "success");
  };

  const handleApprove = (id: number, status: 'Đã duyệt' | 'Từ chối') => {
    const updated = registrations.map(r => r.id === id ? { ...r, status } : r);
    onSaveRegistrations(updated);
    showToast(`Đã phê duyệt trạng thái đăng ký: "${status}"`, "success");
  };

  const downloadSignedApproval = (reg: CourseRegistration) => {
    const approvalDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .stamp { border: 3px double red; color: red; display: inline-block; padding: 10px; font-weight: bold; margin-top: 20px; text-transform: uppercase; }
          </style>
      </head>
      <body>
          <h2>QUYẾT ĐỊNH PHÊ DUYỆT KHÓA HỌC BỒI DƯỠNG</h2>
          <p>Ban Giám hiệu THCS Hòa Phú phê duyệt đăng ký cho học sinh: <b>${reg.studentName}</b> (Lớp ${reg.classInfo})</p>
          <p>Môn bồi dưỡng đã duyệt: <b>${reg.courses.join(', ')}</b></p>
          <p>Ngày ký phê duyệt: ${reg.date}</p>
          <div class="stamp">
            TRƯỜNG THCS HÒA PHÚ<br>ĐÃ PHÊ DUYỆT HỒ SƠ<br>Mã xác thực: HP-V12.15-APPROVED
          </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + approvalDoc], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quyet_Dinh_Hoc_Nang_Khieu_${reg.studentName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Tải về bản ký duyệt thành công!", "success");
  };

  // Filter registrations for parent/student
  const isStudent = currentUser?.role === 'Học sinh';
  const isParent = currentUser?.role === 'Phụ huynh';
  const filterName = isStudent ? currentUser.name : isParent ? currentUser.extra.replace("Phụ huynh ", "").trim() : '';

  const filteredRegs = registrations.filter(r => {
    if (currentUser?.role === 'Admin') return true;
    return r.studentName === filterName;
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-fade-in text-xs">
      <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
        <Compass className="w-5 h-5 text-emerald-600" /> Đăng ký khóa học bồi dưỡng &amp; năng khiếu học kỳ II
      </h3>
      
      {/* Step 1: Download Word Template */}
      {currentUser?.role !== 'Admin' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-extrabold text-emerald-800 text-xs mb-1">Bước 1: Tải Biểu mẫu đăng ký (Bắt buộc)</h4>
            <p className="text-[10px] text-emerald-600 leading-relaxed font-semibold">
              Gia đình vui lòng tải file Word mẫu, điền các nguyện vọng đăng ký học thêm nâng cao và ký xác nhận của cha mẹ.
            </p>
          </div>
          <button 
            onClick={downloadCourseTemplate}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Tải Biểu Mẫu (Word)
          </button>
        </div>
      )}

      {/* Step 2: Register Form */}
      {currentUser?.role !== 'Admin' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-slate-50/50 p-4 rounded-xl border mb-6">
          <h4 className="font-extrabold text-slate-800 text-xs border-b pb-2 uppercase tracking-wide">
            Bước 2: Tích chọn môn học &amp; Tải lên tệp đã ký
          </h4>
          
          <div>
            <span className="block text-[10px] font-black text-brandBlue uppercase tracking-wider mb-2">DANH SÁCH CHUYÊN ĐỀ PHÙ HỢP:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-semibold">
              {["Toán nâng cao", "Ngữ Văn nâng cao", "Tiếng Anh IELTS Foundation", "Khoa học Tự nhiên nâng cao"].map(c => {
                const selected = selectedCourses.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCourse(c)}
                    className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition text-left ${
                      selected ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={selected} 
                      onChange={() => {}} 
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none" 
                    />
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DRAG AND DROP ZONE */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-4 border-2 border-dashed rounded-xl p-5 text-center relative hover:bg-slate-100 transition duration-200 cursor-pointer ${
              isDragOver ? 'border-brandBlue bg-blue-50/50' : 'border-slate-300 bg-white'
            }`}
          >
            <input 
              type="file" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".pdf, .doc, .docx, image/*"
            />
            <UploadCloud className="w-8 h-8 text-brandBlue mx-auto mb-2 animate-pulse" />
            <h5 className="text-xs font-bold text-slate-700">
              {uploadedFile ? (
                <span className="text-emerald-600 font-black">
                  ✓ Đã đính kèm: <u>{uploadedFile.name}</u> ({uploadedFile.size})
                </span>
              ) : (
                "Kéo thả tải lên hình chụp / scan biểu mẫu đã ký (PDF, Ảnh, Word)"
              )}
            </h5>
            <span className="text-[9px] text-slate-400 block mt-1">(Bấm để chọn tệp thủ công nếu không thể kéo thả)</span>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-brandBlue hover:bg-brandBlue-dark text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Gửi đăng ký xét tuyển
            </button>
          </div>
        </form>
      )}

      {/* Register Listing */}
      <div className="mt-8">
        <h4 className="font-extrabold text-slate-800 text-xs border-b pb-2 mb-4 flex items-center gap-1.5 uppercase">
          <CheckCircle className="w-4 h-4 text-brandBlue" /> Lịch sử đăng ký và tình trạng duyệt
        </h4>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100 text-[10px]">
                <th className="p-3">Học sinh / Lớp</th>
                <th className="p-3">Môn học chuyên đề</th>
                <th className="p-3 text-center">Tệp gốc nộp</th>
                <th className="p-3 text-center">Ngày nộp</th>
                <th className="p-3 text-right">Trạng thái / Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRegs.length > 0 ? (
                filteredRegs.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3">
                      <span className="font-extrabold text-slate-800">{r.studentName}</span>
                      <div className="text-[9px] text-slate-400">Khối Lớp: {r.classInfo}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {r.courses.map(c => (
                          <span key={c} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] px-2 py-0.5 rounded-lg font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-brandBlue font-extrabold text-[10px] block truncate max-w-[120px]">{r.file ? r.file.name : ''}</span>
                      <span className="text-[9px] text-slate-400 font-mono block">{r.file ? r.file.size : ''}</span>
                    </td>
                    <td className="p-3 text-center text-slate-500 font-bold font-mono">{r.date}</td>
                    <td className="p-3 text-right">
                      {currentUser?.role === 'Admin' && r.status === 'Chờ duyệt' ? (
                        <div className="flex gap-1 justify-end">
                          <button 
                            onClick={() => handleApprove(r.id, 'Đã duyệt')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                          >
                            Duyệt
                          </button>
                          <button 
                            onClick={() => handleApprove(r.id, 'Từ chối')}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border ${
                            r.status === 'Đã duyệt' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            r.status === 'Từ chối' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {r.status}
                          </span>
                          
                          {r.status === 'Đã duyệt' && (
                            <button
                              onClick={() => downloadSignedApproval(r)}
                              className="text-[10px] text-emerald-700 hover:text-white font-bold flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 px-2 py-1 rounded-md border border-emerald-200 hover:border-emerald-600 transition shadow-sm cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> Quyết định (.doc)
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400 font-bold italic">
                    Chưa có hồ sơ đăng ký bồi dưỡng trực tuyến nào được thực hiện.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. OFFICIAL DOCUMENTS COMPONENT
// ==========================================
interface DocProps {
  currentUser: User | null;
  documents: OfficialDocument[];
  onSaveDocuments: (docs: OfficialDocument[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalDocuments({
  currentUser,
  documents,
  onSaveDocuments,
  showToast
}: DocProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'Cấp Sở/Bộ' | 'Cấp UBND xã' | 'Cấp Trường'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // upload form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Cấp Sở/Bộ' | 'Cấp UBND xã' | 'Cấp Trường'>('Cấp Trường');
  const [docFile, setDocFile] = useState<{ name: string; size: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setDocFile({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB"
      });
      showToast(`Đã đính kèm tệp văn bản: ${f.name}`, "success");
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !docFile) {
      showToast("Vui lòng điền đủ thông tin tiêu đề và tệp đính kèm!", "error");
      return;
    }

    const newDoc: OfficialDocument = {
      id: Date.now(),
      title: title.trim(),
      category,
      date: new Date().toLocaleDateString('vi-VN'),
      file: {
        name: docFile.name,
        ext: docFile.name.split('.').pop() || 'pdf',
        size: docFile.size
      }
    };

    onSaveDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    
    // clear form
    setTitle('');
    setDocFile(null);
    showToast("Phát hành văn bản chỉ đạo mới thành công!", "success");
  };

  const downloadDocument = (doc: OfficialDocument) => {
    // mock download
    const markup = `<h2>VĂN BẢN CHỈ ĐẠO THCS HÒA PHÚ</h2><p><b>Tiêu đề:</b> ${doc.title}</p><p><b>Ban hành:</b> ${doc.category} - Ngày: ${doc.date}</p>`;
    const blob = new Blob(['\ufeff' + markup], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file ? doc.file.name : "van_ban_chi_dao.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Đã tải về tệp tin: ${doc.file ? doc.file.name : ''}`, "success");
  };

  const filteredDocs = filterTab === 'all' ? documents : documents.filter(d => d.category === filterTab);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-brandOrange" /> Quản lý Văn bản chỉ đạo, hành chính
        </h3>
        
        {currentUser?.role === 'Admin' && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Đăng tải văn bản mới
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {['all', 'Cấp Sở/Bộ', 'Cấp UBND xã', 'Cấp Trường'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              filterTab === tab 
                ? 'bg-brandOrange text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'Tất cả' : tab}
          </button>
        ))}
      </div>

      {/* Docs Grid / Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100 text-[10px]">
              <th className="p-3">Thông tin văn bản</th>
              <th className="p-3">Cấp ban hành</th>
              <th className="p-3 text-center">Dung lượng</th>
              <th className="p-3 text-center">Ngày đăng</th>
              <th className="p-3 text-right">Tải về</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredDocs.length > 0 ? (
              filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3">
                    <span className="font-extrabold text-slate-800 block md:max-w-md max-w-xs leading-relaxed">
                      {doc.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Mã số: DOC-${doc.id}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${
                      doc.category === 'Cấp Sở/Bộ' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      doc.category === 'Cấp UBND xã' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-400 font-bold">
                    {doc.file ? doc.file.size : '-'}
                  </td>
                  <td className="p-3 text-center text-slate-500 font-bold font-mono">
                    {doc.date}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="text-brandBlue hover:text-brandBlue-dark font-extrabold flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> Tải (.doc)
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 font-bold italic">
                  Chưa ghi nhận tệp văn bản chỉ đạo hành chính nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-brandOrange animate-bounce" /> Đăng tải văn bản chỉ đạo mới
              </h4>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 font-semibold text-slate-600">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Cấp ban hành</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandOrange cursor-pointer"
                >
                  <option value="Cấp Sở/Bộ">Cấp Sở/Bộ (GD&ĐT)</option>
                  <option value="Cấp UBND xã">Cấp UBND xã (Hòa Xá)</option>
                  <option value="Cấp Trường">Cấp Trường (THCS Hòa Phú)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tiêu đề quyết định/chỉ thị</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 font-bold"
                  placeholder="Ví dụ: Kế hoạch tổ chức ôn tập hè năm học 2026..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tải lên tệp văn bản đính kèm</label>
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 text-center relative hover:bg-slate-100 hover:border-brandOrange transition cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf, .doc, .docx, image/*"
                    required
                  />
                  <UploadCloud className="w-8 h-8 text-brandOrange mx-auto mb-1.5 animate-pulse" />
                  <p className="font-bold text-slate-700">
                    {docFile ? `Đã đính kèm: ${docFile.name}` : "Chọn tệp văn bản chính thức (.pdf, .doc, .png)"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-brandOrange hover:bg-brandOrange-dark text-white px-5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Lưu &amp; Ban Hành Văn Bản
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
// 3. HOMEWORK MANAGEMENT COMPONENT
// ==========================================
interface HomeworkProps {
  currentUser: User | null;
  homeworkList: Homework[];
  onSaveHomework: (list: Homework[]) => void;
  classes: ClassItem[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalHomework({
  currentUser,
  homeworkList,
  onSaveHomework,
  classes,
  showToast
}: HomeworkProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState('Toán');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('25/06/2026');
  const [targetClass, setTargetClass] = useState('9A');
  const [hwFile, setHwFile] = useState<{ name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHwFile({ name: e.target.files[0].name });
      showToast("Đã đính kèm tài liệu bài tập!", "success");
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Vui lòng điền đủ thông tin bài tập!", "error");
      return;
    }

    const newHw: Homework = {
      id: Date.now(),
      subject,
      title: title.trim(),
      content: content.trim(),
      deadline,
      targetType: 'class',
      targetValue: targetClass,
      homeworkFile: hwFile
    };

    onSaveHomework([newHw, ...homeworkList]);
    setShowAddModal(false);
    
    // clear form
    setTitle('');
    setContent('');
    setHwFile(null);
    showToast(`Đã giao bài tập mới thành công cho lớp ${targetClass}!`, "success");
  };

  const isTeacher = currentUser?.role === 'Giáo viên';
  const isStudent = currentUser?.role === 'Học sinh';

  const visibleHw = homeworkList.filter(h => {
    if (currentUser?.role === 'Admin' || isTeacher) return true;
    if (isStudent) return h.targetValue === currentUser.extra;
    return true; // Parent etc
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-pink-600" /> Quản lý bài tập về nhà hàng ngày
        </h3>
        
        {(currentUser?.role === 'Admin' || isTeacher) && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Giao bài tập mới
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visibleHw.length > 0 ? (
          visibleHw.map(hw => (
            <div key={hw.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group hover:border-pink-300 transition shadow-sm font-semibold">
              <span className="bg-pink-50 text-pink-700 border border-pink-100 text-[9px] px-2 py-0.5 rounded-lg uppercase font-bold absolute top-3.5 right-4">
                Hạn nộp: {hw.deadline}
              </span>
              
              <h4 className="text-brandBlue font-black text-sm pr-20">
                {hw.subject}: {hw.title}
              </h4>
              
              <p className="text-slate-600 text-xs font-medium leading-relaxed mt-2 pl-4 border-l-2 border-slate-300 italic">
                "{hw.content}"
              </p>
              
              <div className="mt-3.5 flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t pt-2.5">
                <span>Giao cho: <b className="text-slate-800">Lớp {hw.targetValue}</b></span>
                {hw.homeworkFile && (
                  <span className="text-brandOrange flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Đính kèm: {hw.homeworkFile.name}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-6 italic font-bold">
            Hôm nay em không có bài tập về nhà nào cần hoàn thành. Hãy ôn tập kiến thức nhé!
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-brandOrange animate-bounce" /> Giao nhiệm vụ bài tập về nhà mới
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Môn học</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandOrange cursor-pointer"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Ngữ Văn">Ngữ Văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Vật lý">Vật lý</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Lớp học nhận bài</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandOrange cursor-pointer"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.lop}>{c.lop}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tên đề tài bài tập</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 font-bold"
                  placeholder="Ví dụ: Đọc hiểu văn bản Lão Hạc..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nội dung đề bài chi tiết</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 font-medium"
                  placeholder="Yêu cầu cụ thể, số lượng câu hỏi và hướng dẫn..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Hạn chót nộp bài</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 font-bold"
                    placeholder="Ví dụ: 25/06/2026"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">File đính kèm</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-[10px] border p-2 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-brandOrange hover:bg-brandOrange-dark text-white px-5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Giao Bài Tập Về Nhà
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
// 4. EXAM BANK COMPONENT
// ==========================================
interface ExamBankProps {
  currentUser: User | null;
  exams: Exam[];
  onSaveExams: (list: Exam[]) => void;
  classes: ClassItem[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalExams({
  currentUser,
  exams,
  onSaveExams,
  classes,
  showToast
}: ExamBankProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState('Toán');
  const [type, setType] = useState('Giữa kỳ II');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [mcqMax, setMcqMax] = useState(5);
  const [essayMax, setEssayMax] = useState(5);
  const [essayQuestion, setEssayQuestion] = useState('');
  const [targetClass, setTargetClass] = useState('9A');
  const [examFile, setExamFile] = useState<{ name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExamFile({ name: e.target.files[0].name });
      showToast("Đã đính kèm tệp đề thi chính thức!", "success");
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayQuestion.trim() || !correctAnswers.trim() || !examFile) {
      showToast("Vui lòng nhập đầy đủ đáp án trắc nghiệm, đề bài và đính kèm file tệp đề!", "error");
      return;
    }

    const newExam: Exam = {
      id: Date.now(),
      subject,
      type,
      duration: "45 phút",
      teacher: currentUser ? currentUser.name : "Giáo viên",
      correctAnswers: correctAnswers.trim().toUpperCase(),
      mcqMaxScore: mcqMax,
      essayMaxScore: essayMax,
      essayQuestion: essayQuestion.trim(),
      targetType: 'class',
      targetValue: targetClass,
      examFile
    };

    onSaveExams([...exams, newExam]);
    setShowAddModal(false);
    
    // reset form
    setCorrectAnswers('');
    setEssayQuestion('');
    setExamFile(null);
    showToast(`Đã xuất bản đề kiểm tra bồi dưỡng thành công cho lớp ${targetClass}!`, "success");
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brandBlue" /> Ngân hàng đề kiểm tra tích hợp năng lực số
        </h3>
        
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Giáo viên') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-brandBlue hover:bg-brandBlue-dark text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Đăng tệp đề kiểm tra mới
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exams.length > 0 ? (
          exams.map(e => (
            <div key={e.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative hover:border-brandBlue transition shadow-sm font-semibold text-slate-700">
              <span className="bg-blue-50 text-brandBlue border border-blue-100 text-[9px] px-2 py-0.5 rounded-lg uppercase font-bold absolute top-3.5 right-4">
                {e.type}
              </span>
              
              <h4 className="text-slate-800 font-black text-sm pr-20">
                Môn: {e.subject}
              </h4>
              
              <p className="text-slate-500 text-[10px] mt-1">
                Người soạn: {e.teacher} • Thời lượng: {e.duration}
              </p>
              
              <div className="bg-white border rounded-xl p-3 my-3 space-y-1.5 text-[11px] shadow-inner font-medium">
                <div>
                  <span className="text-emerald-700 font-extrabold block text-[9px] uppercase">Đáp án trắc nghiệm chuẩn (Thang {e.mcqMaxScore}đ):</span>
                  <code className="text-emerald-800 font-mono font-bold block bg-emerald-50 px-2 py-1 rounded border mt-0.5 truncate">{e.correctAnswers}</code>
                </div>
                <div>
                  <span className="text-brandOrange font-extrabold block text-[9px] uppercase">Đề bài tự luận (Thang {e.essayMaxScore}đ):</span>
                  <p className="text-slate-600 line-clamp-1 italic mt-0.5">"{e.essayQuestion}"</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t pt-2.5">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Đối tượng: Lớp {e.targetValue}</span>
                {e.examFile && (
                  <span className="text-brandOrange font-mono">🖹 {e.examFile.name}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="sm:col-span-2 text-center text-slate-400 py-6 italic font-bold">
            Hiện tại ngân hàng đề kiểm tra nội bộ đang trống.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brandOrange animate-bounce" /> Biên soạn &amp; Phát hành đề kiểm tra mới
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Môn học đề kiểm tra</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandBlue cursor-pointer"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Ngữ Văn">Ngữ Văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa học Tự nhiên">Khoa học Tự nhiên</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Đối tượng lớp thi</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandBlue cursor-pointer"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.lop}>{c.lop}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Loại hình kiểm tra</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandBlue cursor-pointer"
                  >
                    <option value="Thường xuyên">Thường xuyên (Miệng / 15p)</option>
                    <option value="Giữa kỳ II">Kiểm tra Giữa kỳ II</option>
                    <option value="Cuối kỳ II">Kiểm tra Cuối kỳ II</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tải lên tệp đề bài (.pdf / .doc)</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-[10px] border p-2.5 rounded-xl bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Chuỗi đáp án trắc nghiệm (Ngăn cách bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={correctAnswers}
                  onChange={(e) => setCorrectAnswers(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-mono uppercase font-bold"
                  placeholder="Ví dụ: 1A,2B,3C,4D"
                  required
                />
                <span className="text-[9px] text-slate-400 italic block mt-1">Hệ thống sẽ tự động đối chiếu chấm điểm phần thi trắc nghiệm theo thang điểm nạp.</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Trọng số trắc nghiệm (đọc tự động)</label>
                  <input
                    type="number"
                    value={mcqMax}
                    onChange={(e) => setMcqMax(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white outline-none font-bold"
                    step="0.5"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Trọng số tự luận (Chấm tay)</label>
                  <input
                    type="number"
                    value={essayMax}
                    onChange={(e) => setEssayMax(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white outline-none font-bold"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Đề câu hỏi tự luận chi tiết</label>
                <textarea
                  rows={2}
                  value={essayQuestion}
                  onChange={(e) => setEssayQuestion(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-medium"
                  placeholder="Yêu cầu cụ thể của câu hỏi tự luận để học sinh làm bài..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-brandBlue hover:bg-brandBlue-dark text-white px-5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Lưu &amp; Giao Đề Thi Toàn Diện
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
// 5. STUDENT TEST ROOM COMPONENT
// ==========================================
interface StudentTestProps {
  currentUser: User | null;
  exams: Exam[];
  submissions: Submission[];
  onSaveSubmissions: (subs: Submission[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalStudentTestRoom({
  currentUser,
  exams,
  submissions,
  onSaveSubmissions,
  showToast
}: StudentTestProps) {
  const [activeTest, setActiveTest] = useState<Exam | null>(null);
  const [timerText, setTimerStr] = useState('45:00');
  const [answersInput, setAnswersInput] = useState('');
  const [essayText, setEssayText] = useState('');
  const [testFile, setTestFile] = useState<{ name: string } | null>(null);

  const timerRef = useRef<number | null>(null);
  const timeLimitSeconds = useRef<number>(45 * 60);

  // Active student allocated exams (not yet completed)
  const isStudent = currentUser?.role === 'Học sinh';
  const studentClass = isStudent ? currentUser.extra : '';

  const studentExams = exams.filter(e => {
    // Only allocated to class
    const isTargeted = e.targetType === 'all' || e.targetValue === studentClass || e.targetValue === currentUser?.name;
    // Check if student has already submitted this exam
    const hasSubmitted = submissions.some(s => s.student === currentUser?.name && s.subject === e.subject && s.type === e.type);
    return isTargeted && !hasSubmitted;
  });

  const startTest = (exam: Exam) => {
    setActiveTest(exam);
    timeLimitSeconds.current = 45 * 60;
    
    // Clear existing timer if any
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      timeLimitSeconds.current--;
      
      const m = Math.floor(timeLimitSeconds.current / 60);
      const s = timeLimitSeconds.current % 60;
      setTimerStr(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);

      if (timeLimitSeconds.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // auto submit
        triggerAutoSubmit(exam);
      }
    }, 1000);

    showToast(`Bắt đầu làm bài thi môn: ${exam.subject} - ${exam.type}. Thời gian: 45 Phút. Chúc bạn thi tốt!`, "success");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTestFile({ name: e.target.files[0].name });
      showToast("Đã tải kèm tệp bài làm tự luận!", "success");
    }
  };

  const triggerAutoSubmit = (exam: Exam) => {
    submitTestDirectly(exam, true);
  };

  const submitTestDirectly = (exam: Exam, isAuto = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Auto grading MCQ choices
    let calculatedMcqScore = 0;
    const studentChoices = answersInput.toUpperCase().split(',');
    const correctChoices = exam.correctAnswers.toUpperCase().split(',');

    let matchCount = 0;
    studentChoices.forEach((ch, idx) => {
      const formattedCh = ch.trim();
      const formattedCorrect = (correctChoices[idx] || '').trim();
      if (formattedCh === formattedCorrect && formattedCorrect !== '') {
        matchCount++;
      }
    });

    if (correctChoices.length > 0) {
      const rawMcqScore = (matchCount / correctChoices.length) * exam.mcqMaxScore;
      calculatedMcqScore = Math.round(rawMcqScore * 10) / 10;
    }

    const newSub: Submission = {
      id: Date.now(),
      student: currentUser?.name || 'Học sinh',
      class: currentUser?.extra || '6A',
      subject: exam.subject,
      type: exam.type,
      date: new Date().toLocaleDateString('vi-VN'),
      submissionType: testFile ? 'file' : 'text',
      text: essayText.trim(),
      fileData: testFile,
      answers: answersInput.trim().toUpperCase(),
      mcqScore: calculatedMcqScore,
      mcqMaxScore: exam.mcqMaxScore,
      essayScore: null, // Pending grading
      essayMaxScore: exam.essayMaxScore,
      grade: null, // mcq + essay score pending
      remark: '',
      isSynced: false
    };

    onSaveSubmissions([newSub, ...submissions]);
    
    // reset room
    setActiveTest(null);
    setAnswersInput('');
    setEssayText('');
    setTestFile(null);

    if (isAuto) {
      showToast("Hết thời gian quy định! Hệ thống đã tự động lưu trữ và nộp bài thi.", "info");
    } else {
      showToast("Đã hoàn thành và nộp bài thi thành công! Bài làm đang được chuyển sang Giáo viên bộ môn chấm điểm.", "success");
    }
  };

  const cancelTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveTest(null);
    setAnswersInput('');
    setEssayText('');
    setTestFile(null);
    showToast("Đã hủy bài thi hiện tại.", "info");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
      <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 uppercase">
        <Timer className="w-5 h-5 text-violet-600" /> Phòng thi học sinh trực tuyến
      </h3>

      {/* Lobby - shows available exams */}
      {!activeTest ? (
        <div className="space-y-3 animate-fade-in">
          <p className="text-[11px] text-slate-500 font-semibold italic mb-4">
            Chào mừng em bước vào phòng thi học sinh. Dưới đây là danh sách các đề kiểm tra đang được mở dành riêng cho em. Hãy ấn "Làm bài" khi đã chuẩn bị sẵn sàng.
          </p>
          
          {studentExams.length > 0 ? (
            studentExams.map(e => (
              <div key={e.id} className="p-4 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-violet-300 transition shadow-sm font-semibold text-slate-700">
                <div>
                  <span className="bg-violet-50 text-violet-700 border border-violet-100 text-[9px] px-2 py-0.5 rounded-lg uppercase font-bold">
                    {e.type}
                  </span>
                  <h4 className="text-slate-800 font-black text-sm mt-1.5 pr-10">
                    Môn: {e.subject}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Thời lượng: {e.duration} • Soạn bởi GV: {e.teacher}
                  </p>
                </div>
                
                <button
                  onClick={() => startTest(e)}
                  className="bg-brandBlue hover:bg-brandBlue-dark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Bắt đầu Làm Bài
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 py-6 italic font-bold">
              Chúc mừng em! Không còn đề kiểm tra nào cần hoàn thành vào lúc này.
            </div>
          )}
        </div>
      ) : (
        /* Active test view */
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-between bg-orange-50 border border-orange-200 p-3.5 rounded-2xl text-xs font-black items-center">
            <span className="text-brandOrange flex items-center gap-1.5 animate-pulse">
              <CloudLightning className="w-4 h-4 text-brandOrange" /> THI ĐANG DIỄN RA
            </span>
            <span className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 font-mono shadow-md">
              <Timer className="w-4 h-4 text-orange-400 animate-spin" /> {timerText}
            </span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl font-semibold">
            <h4 className="font-black text-sm text-brandBlue">
              Đề thi môn: {activeTest.subject} - {activeTest.type}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Thời gian quy định: 45 phút • Điểm tự động: {activeTest.mcqMaxScore}đ • Tự luận: {activeTest.essayMaxScore}đ
            </p>
            
            {activeTest.examFile && (
              <div className="mt-3.5 flex items-center justify-between border-t pt-2.5 text-xs">
                <span className="text-slate-500 font-bold">File đề đính kèm: <b>{activeTest.examFile.name}</b></span>
                <button 
                  onClick={() => showToast(`Tải xuống đề bài: ${activeTest.examFile?.name}`, "success")}
                  className="bg-brandBlue hover:bg-brandBlue-dark text-white text-[10px] px-3 py-1.5 rounded-lg shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Tải đề về máy (.pdf)
                </button>
              </div>
            )}
          </div>

          {/* Answers Sheet Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-3 font-semibold text-slate-600">
            <label className="block text-xs font-black text-brandBlue uppercase tracking-wide">
              1. Phần trắc nghiệm (Chọn đáp án chuẩn):
            </label>
            <input 
              type="text" 
              value={answersInput}
              onChange={(e) => setAnswersInput(e.target.value)}
              className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-white font-bold font-mono uppercase"
              placeholder="Nhập chuỗi đáp án của em, phân tách bằng dấu phẩy. Ví dụ: 1A,2B,3C,4D"
              required
            />
            <span className="text-[9px] text-slate-400 italic block">
              Lưu ý: Viết liền không dấu cách, ngăn cách bằng dấu phẩy. Đáp án sẽ được so khớp tự động ngay sau khi nộp.
            </span>
          </div>

          {/* Essay Answers Sheet Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-3 font-semibold text-slate-600">
            <label className="block text-xs font-black text-brandOrange uppercase tracking-wide">
              2. Phần thi tự luận:
            </label>
            <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 text-[11px] leading-relaxed text-slate-700 italic">
              <b>Đề bài tự luận:</b> "{activeTest.essayQuestion}"
            </div>
            
            <textarea 
              rows={4}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-white font-medium"
              placeholder="Nhập nội dung lời giải tự luận của em trực tiếp vào đây..."
            />
            
            <div className="pt-2 border-t">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hoặc đính kèm file chụp/Word bài làm tự luận tự viết tay</label>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="w-full text-[10px] border p-2 bg-white rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button 
              type="button"
              onClick={cancelTest}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition"
            >
              Hủy bỏ (Không nộp)
            </button>
            <button 
              type="button"
              onClick={() => submitTestDirectly(activeTest)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Nộp bài hoàn tất thi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
