import { createClient } from '@supabase/supabase-js';
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
  OutstandingClass 
} from '../types';

// Read configuration from Vite env, fallback to user provided public keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://cyhjuwwpugdyepjfqdjh.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aGp1d3dwdWdkeWVwamZxZGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1ODkxNTUsImV4cCI6MjEwMDE2NTE1NX0.7OMR4C5f7XXm0PdfbsjYxoS0T6ElbZ1u-tW4x4CwCdQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL Schema for users to create tables in Supabase
export const SUPABASE_SQL_SCHEMA = `-- THCS HÒA PHÚ - SUPABASE TABLE CREATION SCHEMA
-- Bạn chỉ cần copy và paste toàn bộ mã này vào mục SQL Editor trong Supabase Dashboard và nhấn Run.

-- 1. Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS school_accounts (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT NOT NULL,
  extra TEXT,
  "isFirstLogin" BOOLEAN DEFAULT FALSE,
  "canPostNews" BOOLEAN DEFAULT FALSE
);

-- 2. Bảng cơ cấu lớp học
CREATE TABLE IF NOT EXISTS school_classes (
  id TEXT PRIMARY KEY,
  khoi TEXT NOT NULL,
  lop TEXT NOT NULL,
  gvcn TEXT,
  total INT DEFAULT 40
);

-- 3. Bảng phân công giảng dạy
CREATE TABLE IF NOT EXISTS school_assignments (
  id INT PRIMARY KEY,
  "teacherId" INT NOT NULL,
  "teacherName" TEXT NOT NULL,
  subjects JSONB NOT NULL,
  classes JSONB NOT NULL
);

-- 4. Bảng đăng ký lớp học chuyên đề
CREATE TABLE IF NOT EXISTS school_course_registrations (
  id INT PRIMARY KEY,
  "studentName" TEXT NOT NULL,
  "classInfo" TEXT NOT NULL,
  courses JSONB NOT NULL,
  file JSONB,
  status TEXT NOT NULL,
  date TEXT NOT NULL
);

-- 5. Bảng khảo sát ý kiến phụ huynh / học sinh
CREATE TABLE IF NOT EXISTS school_surveys (
  id INT PRIMARY KEY,
  "parentName" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "classInfo" TEXT NOT NULL,
  topic TEXT NOT NULL,
  rating INT NOT NULL,
  content TEXT NOT NULL,
  file JSONB,
  status TEXT NOT NULL,
  date TEXT NOT NULL
);

-- 6. Bảng đề thi trực tuyến
CREATE TABLE IF NOT EXISTS school_exams (
  id INT PRIMARY KEY,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  duration TEXT NOT NULL,
  teacher TEXT NOT NULL,
  "correctAnswers" TEXT NOT NULL,
  "mcqMaxScore" NUMERIC NOT NULL,
  "essayMaxScore" NUMERIC NOT NULL,
  "essayQuestion" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetValue" TEXT NOT NULL,
  "examFile" JSONB
);

-- 7. Bảng bài tập về nhà
CREATE TABLE IF NOT EXISTS school_homework (
  id INT PRIMARY KEY,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  deadline TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetValue" TEXT NOT NULL,
  "homeworkFile" JSONB
);

-- 8. Bảng bài nộp & chấm điểm của học sinh
CREATE TABLE IF NOT EXISTS school_submissions (
  id INT PRIMARY KEY,
  student TEXT NOT NULL,
  class TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  "submissionType" TEXT NOT NULL,
  text TEXT,
  "fileData" JSONB,
  answers TEXT,
  "mcqScore" NUMERIC DEFAULT 0,
  "mcqMaxScore" NUMERIC DEFAULT 5,
  "essayScore" NUMERIC,
  "essayMaxScore" NUMERIC DEFAULT 5,
  grade NUMERIC,
  remark TEXT,
  "isSynced" BOOLEAN DEFAULT TRUE
);

-- 9. Bảng văn bản công văn chỉ đạo
CREATE TABLE IF NOT EXISTS school_documents (
  id INT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  file JSONB
);

-- 10. Bảng thông báo học vụ nhà trường
CREATE TABLE IF NOT EXISTS school_notifications (
  id INT PRIMARY KEY,
  date TEXT NOT NULL,
  "isNew" BOOLEAN DEFAULT TRUE,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

-- 11. Bảng hoạt động tin tức sự kiện
CREATE TABLE IF NOT EXISTS school_activities (
  id INT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  content TEXT NOT NULL,
  img TEXT,
  likes INT DEFAULT 0,
  "likedByUser" BOOLEAN DEFAULT FALSE,
  comments JSONB DEFAULT '[]'::jsonb
);

-- 12. Bảng học sinh tiêu biểu
CREATE TABLE IF NOT EXISTS school_outstanding_students (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  badge TEXT NOT NULL,
  gpa TEXT NOT NULL,
  conduct TEXT NOT NULL,
  avatar TEXT,
  achievements JSONB NOT NULL,
  subjects JSONB NOT NULL,
  guestbook JSONB DEFAULT '[]'::jsonb
);

-- 13. Bảng tập thể lớp xuất sắc
CREATE TABLE IF NOT EXISTS school_outstanding_classes (
  id TEXT PRIMARY KEY,
  lop TEXT NOT NULL,
  gvcn TEXT NOT NULL,
  slogan TEXT NOT NULL,
  icon TEXT,
  "iconColor" TEXT,
  total INT NOT NULL,
  achievements JSONB NOT NULL,
  guestbook JSONB DEFAULT '[]'::jsonb
);

-- Kích hoạt quyền truy cập công khai (RLS Bypass cho môi trường học tập)
ALTER TABLE school_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_outstanding_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_outstanding_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON school_accounts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_accounts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_accounts FOR DELETE USING (true);

-- Lặp lại chính sách mở rộng cho các bảng khác để dễ phát triển
CREATE POLICY "Allow public select" ON school_classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_classes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_classes FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_assignments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_assignments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_assignments FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_course_registrations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_course_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_course_registrations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_course_registrations FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_surveys FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_surveys FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_surveys FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_exams FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_exams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_exams FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_homework FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_homework FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_homework FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_homework FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_submissions FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_documents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_documents FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_notifications FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_activities FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_outstanding_students FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_outstanding_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_outstanding_students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_outstanding_students FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON school_outstanding_classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON school_outstanding_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON school_outstanding_classes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON school_outstanding_classes FOR DELETE USING (true);
`;

// Helper checking connection & schema health
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('school_accounts').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { 
          success: false, 
          message: 'Kết nối thành công tới Supabase, nhưng các bảng dữ liệu chưa được khởi tạo. Vui lòng chạy mã lệnh SQL trong tab cấu hình.' 
        };
      }
      return { success: false, message: `Lỗi Supabase: ${error.message} (Mã lỗi: ${error.code})` };
    }
    return { success: true, message: 'Kết nối hoạt động bình thường! Đã tìm thấy các bảng cơ sở dữ liệu.' };
  } catch (err: any) {
    return { success: false, message: `Không thể kết nối internet hoặc sai cấu hình: ${err.message || err}` };
  }
}

// Type-safe generic handlers to query data from Supabase with localStorage backup
export async function getSupabaseData<T>(tableName: string, fallbackData: T): Promise<T> {
  try {
    const { data, error } = await supabase.from(tableName).select('*').order('id', { ascending: true });
    if (error) {
      // Nếu có lỗi (ví dụ chưa có bảng trong database - mã lỗi 42P01), ta dùng dữ liệu fallback mẫu 
      // để giúp giao diện không bị lỗi hoặc trắng màn hình khi người dùng chưa cấu hình cơ sở dữ liệu.
      console.warn(`[Supabase] Lỗi tải dữ liệu cho "${tableName}": ${error.message}. Sử dụng dữ liệu dự phòng.`);
      return fallbackData;
    }
    // Nếu bảng tồn tại trong database (đã chạy SQL setup thành công) nhưng trống hoặc có dữ liệu,
    // ta CHỈ hiển thị dữ liệu thực tế trong database (cho dù rỗng []), không dùng dữ liệu fallback che lấp nữa.
    const resultData = data || [];
    console.log(`[Supabase Live Data] Bảng "${tableName}" có ${resultData.length} bản ghi thực tế trong database.`);
    return resultData as unknown as T;
  } catch (err) {
    console.error(`[Supabase Error] getSupabaseData for "${tableName}":`, err);
    return fallbackData;
  }
}

// Save specific list of records to Supabase using upsert
export async function saveSupabaseData<T extends { id: any }>(tableName: string, dataList: T[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!dataList || dataList.length === 0) return { success: true };
    
    // Format JSON fields before writing (some objects need simple preparation)
    const formattedData = dataList.map(item => {
      const copy = { ...item };
      return copy;
    });

    const { error } = await supabase.from(tableName).upsert(formattedData, { onConflict: 'id' });
    if (error) {
      console.error(`[Supabase Save Error] Upsert failed for "${tableName}":`, error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error(`[Supabase Save Exception] on "${tableName}":`, err);
    return { success: false, error: err.message || String(err) };
  }
}

// Delete item by ID
export async function deleteSupabaseItem(tableName: string, id: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// Bulk seed system with defaults
export async function seedDefaultDataToSupabase(allData: {
  school_accounts: User[];
  school_classes: ClassItem[];
  school_assignments: Assignment[];
  school_course_registrations: CourseRegistration[];
  school_surveys: Survey[];
  school_exams: Exam[];
  school_homework: Homework[];
  school_submissions: Submission[];
  school_documents: OfficialDocument[];
  school_notifications: SchoolNotification[];
  school_activities: Activity[];
  school_outstanding_students: OutstandingStudent[];
  school_outstanding_classes: OutstandingClass[];
}): Promise<{ success: boolean; message: string; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};
  let overallSuccess = true;
  let errorMsg = '';

  for (const [table, list] of Object.entries(allData)) {
    if (list && list.length > 0) {
      const { success, error } = await saveSupabaseData(table, list as any[]);
      results[table] = success;
      if (!success) {
        overallSuccess = false;
        errorMsg += `${table}: ${error}; `;
      }
    } else {
      results[table] = true;
    }
  }

  return {
    success: overallSuccess,
    message: overallSuccess 
      ? 'Đồng bộ hóa toàn bộ dữ liệu mẫu lên Supabase thành công!' 
      : `Có lỗi trong quá trình đồng bộ hóa: ${errorMsg}`,
    results
  };
}
