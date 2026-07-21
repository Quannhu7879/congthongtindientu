export type UserRole = 'Admin' | 'Giáo viên' | 'Học sinh' | 'Phụ huynh';

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  extra: string; // e.g. "6A" or "Tổ Toán"
  isFirstLogin?: boolean;
  canPostNews?: boolean;
}

export interface ClassItem {
  id: string; // e.g. "6A"
  khoi: string; // e.g. "Khối 6"
  lop: string; // e.g. "6A"
  gvcn: string;
  total: number;
}

export interface Assignment {
  id: number;
  teacherId: number;
  teacherName: string;
  subjects: string[];
  classes: string[];
}

export interface CourseRegistration {
  id: number;
  studentName: string;
  classInfo: string;
  courses: string[];
  file: { name: string; size: string } | null;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  date: string;
}

export interface Survey {
  id: number;
  parentName: string;
  studentName: string;
  classInfo: string;
  topic: string;
  rating: number;
  content: string;
  file: { name: string; size: string } | null;
  status: 'Mới nhận' | 'Đang xử lý' | 'Đã tiếp thu';
  date: string;
}

export interface Exam {
  id: number;
  subject: string;
  type: string; // e.g. "Giữa kỳ II", "Cuối kỳ II", "Thường xuyên"
  duration: string;
  teacher: string;
  correctAnswers: string; // e.g. "1A,2B,3C,4D"
  mcqMaxScore: number;
  essayMaxScore: number;
  essayQuestion: string;
  targetType: 'all' | 'class' | 'student';
  targetValue: string;
  examFile: { name: string } | null;
}

export interface Homework {
  id: number;
  subject: string;
  title: string;
  content: string;
  deadline: string;
  targetType: 'all' | 'class' | 'student';
  targetValue: string;
  homeworkFile: { name: string } | null;
}

export interface Submission {
  id: number;
  student: string;
  class: string;
  subject: string;
  type: string;
  date: string;
  submissionType: 'text' | 'file';
  text: string;
  fileData: { name: string } | null;
  answers: string; // student's MCQ choices
  mcqScore: number;
  mcqMaxScore: number;
  essayScore: number | null;
  essayMaxScore: number;
  grade: number | null; // mcq + essay score
  remark: string;
  isSynced: boolean;
}

export interface OfficialDocument {
  id: number;
  title: string;
  category: 'Cấp Sở/Bộ' | 'Cấp UBND xã' | 'Cấp Trường';
  date: string;
  file: { name: string; ext: string; size: string } | null;
}

export interface SchoolNotification {
  id: number;
  date: string;
  isNew: boolean;
  source: string;
  title: string;
  content: string;
}

export interface Comment {
  username: string;
  text: string;
  date: string;
}

export interface Activity {
  id: number;
  title: string;
  category: string;
  date: string;
  desc: string;
  content: string;
  img: string;
  likes: number;
  likedByUser?: boolean;
  comments: Comment[];
}

export interface GuestbookEntry {
  name: string;
  msg: string;
}

export interface OutstandingStudent {
  id: number;
  name: string;
  class: string;
  badge: string;
  gpa: string;
  conduct: string;
  avatar: string;
  achievements: string[];
  subjects: Record<string, number>;
  guestbook: GuestbookEntry[];
}

export interface OutstandingClass {
  id: string; // e.g. "9A"
  lop: string;
  gvcn: string;
  slogan: string;
  icon: string;
  iconColor: string;
  total: number;
  achievements: string[];
  guestbook: GuestbookEntry[];
}

export interface SchoolSetting {
  id: string;
  value: string;
}

