import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Copy, 
  CloudLightning, 
  ArrowUpRight, 
  ExternalLink, 
  Check, 
  Server,
  Play,
  AlertTriangle
} from 'lucide-react';
import { 
  testSupabaseConnection, 
  SUPABASE_SQL_SCHEMA, 
  seedDefaultDataToSupabase,
  saveSupabaseData
} from '../lib/supabase';
import { 
  User, 
  ClassItem, 
  Assignment, 
  CourseRegistration, 
  Survey, 
  Exam, 
  Homework, 
  Submission, 
  OfficialDocument, 
  SchoolNotification, 
  Activity, 
  OutstandingStudent, 
  OutstandingClass,
  SchoolSetting
} from '../types';

interface PortalSupabaseSyncProps {
  accounts: User[];
  classes: ClassItem[];
  assignments: Assignment[];
  registrations: CourseRegistration[];
  surveys: Survey[];
  exams: Exam[];
  homeworkList: Homework[];
  submissions: Submission[];
  documents: OfficialDocument[];
  notifications: SchoolNotification[];
  activities: Activity[];
  outstandingStudents: OutstandingStudent[];
  outstandingClasses: OutstandingClass[];
  settings?: SchoolSetting[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalSupabaseSync({
  accounts,
  classes,
  assignments,
  registrations,
  surveys,
  exams,
  homeworkList,
  submissions,
  documents,
  notifications,
  activities,
  outstandingStudents,
  outstandingClasses,
  settings,
  showToast
}: PortalSupabaseSyncProps) {
  const [connStatus, setConnStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [connMessage, setConnMessage] = useState('Đang kết nối tới Supabase...');
  const [isCopied, setIsCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResults, setSeedResults] = useState<Record<string, boolean> | null>(null);

  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://cyhjuwwpugdyepjfqdjh.supabase.co';

  // Test Connection
  const checkConnection = async () => {
    setConnStatus('checking');
    setConnMessage('Đang kiểm tra kết nối hệ thống...');
    const res = await testSupabaseConnection();
    if (res.success) {
      setConnStatus('connected');
      setConnMessage(res.message);
    } else {
      setConnStatus('disconnected');
      setConnMessage(res.message);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setIsCopied(true);
    showToast("Đã sao chép mã SQL khởi tạo vào bộ nhớ tạm!", "success");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleBulkSeed = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đẩy toàn bộ dữ liệu hiện tại lên Supabase? Thao tác này sẽ ghi đè các bản ghi trùng ID.")) {
      setIsSeeding(true);
      try {
        const res = await seedDefaultDataToSupabase({
          school_accounts: accounts,
          school_classes: classes,
          school_assignments: assignments,
          school_course_registrations: registrations,
          school_surveys: surveys,
          school_exams: exams,
          school_homework: homeworkList,
          school_submissions: submissions,
          school_documents: documents,
          school_notifications: notifications,
          school_activities: activities,
          school_outstanding_students: outstandingStudents,
          school_outstanding_classes: outstandingClasses,
          school_settings: settings || []
        });
        
        setSeedResults(res.results);
        if (res.success) {
          showToast(res.message, "success");
          checkConnection();
        } else {
          showToast(res.message, "error");
        }
      } catch (err: any) {
        showToast(`Lỗi đồng bộ: ${err.message || err}`, "error");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  // Sync individual table
  const handleSyncTable = async (tableName: string, dataList: any[]) => {
    showToast(`Đang đồng bộ bảng ${tableName}...`, "info");
    const { success, error } = await saveSupabaseData(tableName, dataList);
    if (success) {
      showToast(`Đồng bộ thành công bảng ${tableName} (${dataList.length} bản ghi)!`, "success");
      checkConnection();
    } else {
      showToast(`Đồng bộ thất bại: ${error}`, "error");
    }
  };

  const tablesInfo = [
    { name: 'school_accounts', label: 'Tài khoản người dùng', data: accounts },
    { name: 'school_classes', label: 'Cơ cấu Khối / Lớp', data: classes },
    { name: 'school_assignments', label: 'Phân công giảng dạy', data: assignments },
    { name: 'school_course_registrations', label: 'Đăng ký lớp học chuyên đề', data: registrations },
    { name: 'school_surveys', label: 'Khảo sát chất lượng', data: surveys },
    { name: 'school_exams', label: 'Ngân hàng đề thi', data: exams },
    { name: 'school_homework', label: 'Bài tập về nhà', data: homeworkList },
    { name: 'school_submissions', label: 'Bài thi & Kết quả nộp', data: submissions },
    { name: 'school_documents', label: 'Văn bản chỉ đạo', data: documents },
    { name: 'school_notifications', label: 'Thông báo học vụ', data: notifications },
    { name: 'school_activities', label: 'Tin tức & Hoạt động ngoại khóa', data: activities },
    { name: 'school_outstanding_students', label: 'Học sinh tiêu biểu vinh danh', data: outstandingStudents },
    { name: 'school_outstanding_classes', label: 'Tập thể lớp xuất sắc vinh danh', data: outstandingClasses },
    { name: 'school_settings', label: 'Cấu hình hệ thống (Banner, chữ chạy)', data: settings || [] },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Hệ Thống Cơ Sở Dữ Liệu Supabase Cloud
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Liên kết đồng bộ trực tuyến dữ liệu học vụ THCS Hòa Phú với đám mây Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkConnection}
            className="p-2 rounded-xl border hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            Tải lại kết nối
          </button>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer"
          >
            Trang chủ Supabase
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Connection Indicator Card */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
        connStatus === 'connected' 
          ? 'bg-emerald-50 border-emerald-200' 
          : connStatus === 'disconnected' 
            ? 'bg-rose-50 border-rose-200' 
            : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="p-3 rounded-xl bg-white shadow-sm border">
          {connStatus === 'connected' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
          {connStatus === 'disconnected' && <XCircle className="w-6 h-6 text-rose-500" />}
          {connStatus === 'checking' && <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Trạng thái liên kết</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
              connStatus === 'connected' 
                ? 'bg-emerald-200 text-emerald-800' 
                : connStatus === 'disconnected' 
                  ? 'bg-rose-200 text-rose-800' 
                  : 'bg-slate-200 text-slate-700'
            }`}>
              {connStatus === 'connected' ? 'Đã liên kết' : connStatus === 'disconnected' ? 'Chưa kết nối' : 'Đang kiểm tra'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 leading-snug">{connMessage}</p>
          <p className="text-[10px] text-slate-500 font-mono">Project URL: {supabaseUrl}</p>
        </div>
      </div>

      {/* Two Columns: Action Dashboard & SQL Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sync Table Dashboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-xs uppercase text-slate-600 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-slate-400" />
                Danh mục bảng dữ liệu học vụ
              </h3>
              <button
                disabled={isSeeding}
                onClick={handleBulkSeed}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  isSeeding 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CloudLightning className="w-3.5 h-3.5" />
                {isSeeding ? 'Đang đồng bộ...' : 'Đẩy tất cả mẫu lên Cloud'}
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {tablesInfo.map(t => (
                <div key={t.name} className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-slate-50 transition text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{t.label}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{t.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-[10px] font-bold">
                      {t.data.length} dòng
                    </span>
                    <button
                      onClick={() => handleSyncTable(t.name, t.data)}
                      className="p-1 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      Gửi lên
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SQL Setup Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border rounded-xl p-4 bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-xs uppercase text-slate-300 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-blue-400" />
                Mã lệnh SQL Query đầy đủ
              </h3>
              <button
                onClick={handleCopySQL}
                className="p-1 px-2.5 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-lg text-[10px] font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-200" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Đã sao chép!' : 'Copy Toàn Bộ SQL'}
              </button>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed text-slate-400 font-medium">
              <p>
                Sao chép và chạy đoạn mã dưới đây trong <b>SQL Editor &gt; New Query</b> trên bảng điều khiển Supabase của bạn để tự động tạo cấu trúc bảng hoàn chỉnh:
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] font-mono select-all overflow-y-auto max-h-[350px] text-emerald-400 leading-normal scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
                {SUPABASE_SQL_SCHEMA}
              </div>
              <div className="p-3 bg-blue-950/50 border border-blue-900/50 rounded-lg flex items-start gap-2.5 text-blue-200 text-[10px]">
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <b>Hướng dẫn từng bước:</b> <br />
                  1. Nhấp nút <b>"Copy Toàn Bộ SQL"</b> ở trên.<br />
                  2. Truy cập dự án Supabase của bạn, chọn menu <b>SQL Editor</b> bên trái.<br />
                  3. Chọn <b>"New Query"</b> và dán toàn bộ đoạn mã vừa copy vào.<br />
                  4. Nhấp nút <b>RUN</b> ở góc dưới bên phải để thực thi câu lệnh SQL.<br />
                  5. Quay lại đây, nhấp <b>"Đẩy tất cả mẫu lên Cloud"</b> hoặc click <b>"Gửi lên"</b> từng bảng để đồng bộ dữ liệu ban đầu!
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
