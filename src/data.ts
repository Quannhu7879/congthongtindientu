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
} from './types';

// Helper functions for localStorage
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
}

// Default Data Definitions
const defaultAccounts: User[] = [
  { id: 1, name: 'Nghiêm Hồng Quân', username: 'admin', role: 'Admin', extra: 'Quản trị', isFirstLogin: false, canPostNews: true },
  { id: 2, name: 'Nguyễn Kim Ngân', username: 'hs1', role: 'Học sinh', extra: '9A', isFirstLogin: false },
  { id: 3, name: 'Lê Thúy Quỳnh', username: 'gv1', role: 'Giáo viên', extra: 'Tổ Toán', isFirstLogin: false, canPostNews: true },
  { id: 4, name: 'Nguyễn Tiến Dũng', username: 'ph1', role: 'Phụ huynh', extra: 'Phụ huynh Nguyễn Kim Ngân', isFirstLogin: false },
  { id: 5, name: 'Trần Văn Cường', username: 'gv2', role: 'Giáo viên', extra: 'Tổ Xã Hội', isFirstLogin: false, canPostNews: false },
  { id: 6, name: 'Phạm Thị Lan', username: 'gv3', role: 'Giáo viên', extra: 'Tổ Ngoại Ngữ', isFirstLogin: false, canPostNews: true }
];

// Generate 16 Classes (6, 7, 8, 9 with letters A, B, C, D)
const defaultClasses: ClassItem[] = [];
const blocks = ['6', '7', '8', '9'];
const letters = ['A', 'B', 'C', 'D'];

blocks.forEach(khoi => {
  letters.forEach(lop => {
    let gvcnName = 'Chưa phân';
    if (lop === 'A') {
      gvcnName = 'Lê Thúy Quỳnh';
    } else if (lop === 'B') {
      gvcnName = 'Trần Văn Cường';
    } else if (lop === 'C') {
      gvcnName = 'Phạm Thị Lan';
    }
    defaultClasses.push({
      id: `${khoi}${lop}`,
      khoi: `Khối ${khoi}`,
      lop: `${khoi}${lop}`,
      gvcn: gvcnName,
      total: 40
    });
  });
});

export const fullSubjectsList = [
  "Toán", "Ngữ Văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", 
  "Công nghệ", "Tin học", "Lịch sử", "Địa lý", "GDCD", "Mỹ thuật", 
  "Âm nhạc", "GDTC", "HĐTN, HN", "GDĐP"
];

const defaultAssignments: Assignment[] = [
  { id: 101, teacherId: 3, teacherName: "Lê Thúy Quỳnh", subjects: ["Toán"], classes: ["6A", "6B", "9A"] },
  { id: 102, teacherId: 5, teacherName: "Trần Văn Cường", subjects: ["Ngữ Văn", "Lịch sử"], classes: ["7C", "7D", "8A"] }
];

const defaultCourseRegistrations: CourseRegistration[] = [
  { 
    id: 1, 
    studentName: 'Nguyễn Kim Ngân', 
    classInfo: '9A', 
    courses: ['Toán', 'Tiếng Anh'], 
    file: { name: 'DK_Ngan.doc', size: '1.2 MB' }, 
    status: 'Đã duyệt', 
    date: '19/06/2026' 
  }
];

const defaultSurveys: Survey[] = [
  { 
    id: 1, 
    parentName: "Nghiêm Hồng Sơn", 
    studentName: "Nghiêm Đình Phong", 
    classInfo: "6A", 
    topic: "Chất lượng bán trú & Dinh dưỡng học đường", 
    rating: 5, 
    content: "Đồ ăn bán trú đa dạng, nhà bếp sạch sẽ, các thầy cô quản lý ăn trưa vô cùng chu đáo.", 
    file: null, 
    status: "Đã tiếp thu", 
    date: "19/06/2026" 
  },
  { 
    id: 2, 
    parentName: "Vũ Thu Hà", 
    studentName: "Nguyễn Kim Ngân", 
    classInfo: "9A", 
    topic: "Đổi mới học vụ chuyên môn & Chuyển đổi số", 
    rating: 4, 
    content: "Đề xuất nhà trường trang bị thêm các hệ thống màn hình tương tác thông minh cho các phòng học.", 
    file: { name: "phieu_ks_ph_ha.pdf", size: "1.1 MB" }, 
    status: "Đang xử lý", 
    date: "18/06/2026" 
  }
];

const defaultExams: Exam[] = [
  { 
    id: 1, 
    subject: 'Toán', 
    type: 'Giữa kỳ II', 
    duration: '45 phút', 
    teacher: 'Lê Thúy Quỳnh', 
    correctAnswers: "1A,2B,3C,4D", 
    mcqMaxScore: 5.0, 
    essayMaxScore: 5.0, 
    essayQuestion: "Hãy nêu ứng dụng của hệ thức lượng trong thực tế đời sống.", 
    targetType: 'class', 
    targetValue: '9A', 
    examFile: { name: 'DeToan_Lop9A.pdf' } 
  }
];

const defaultHomework: Homework[] = [
  { 
    id: 1, 
    subject: 'Toán', 
    title: 'Giải hệ phương trình bậc nhất hai ẩn', 
    content: 'Làm bài tập số 3, 4 trang 52 sách bài tập Toán 9 tập 2.', 
    deadline: '25/06/2026', 
    targetType: 'class', 
    targetValue: '9A', 
    homeworkFile: null 
  }
];

const defaultSubmissions: Submission[] = [
  { 
    id: 1, 
    student: 'Nguyễn Kim Ngân', 
    class: '9A', 
    subject: 'Toán', 
    type: 'Giữa kỳ II', 
    date: '19/06/2026', 
    submissionType: 'text', 
    text: 'Em xin nộp bài làm tự luận: Hệ thức lượng giúp đo chiều cao tháp, khoảng cách bờ sông mà không cần đo trực tiếp thông qua góc nghiêng và khoảng cách chân đế.', 
    fileData: null, 
    answers: "1A,2B,3C,4D", 
    mcqScore: 5.0, 
    mcqMaxScore: 5.0, 
    essayScore: null, 
    essayMaxScore: 5.0, 
    grade: null, 
    remark: '', 
    isSynced: false 
  }
];

const defaultDocuments: OfficialDocument[] = [
  { 
    id: 1, 
    title: "Kế hoạch thi đua khen thưởng năm học 2025 - 2026", 
    category: "Cấp Trường", 
    date: "19/06/2026", 
    file: { name: "KH_Thi_Dua_Khen_Thuong.doc", ext: "doc", size: "1.0 MB" } 
  }
];

const defaultNotifications: SchoolNotification[] = [
  { id: 1, date: '19/06', isNew: true, source: 'Nhà trường', title: 'Cập nhật hệ thống học vụ V12.15', content: 'Hệ thống tuyển sinh và học vụ đã chính thức cập nhật phân hệ V12.15. Kích hoạt toàn bộ các biểu mẫu số hóa, đăng ký và xét duyệt khóa học bổ trợ năng khiếu bằng phương thức kéo thả trực quan và ký duyệt Word tự động.' },
  { id: 2, date: '19/06', isNew: true, source: 'Xã Hòa Xá', title: 'Phối hợp tổ chức ngày hội thể thao mùa hè tại Xã', content: 'UBND Xã Hòa Xá phối hợp cùng BCH Đoàn trường phát động ngày hội thể dục thể thao, đua xe đạp và bảo vệ môi trường sinh thái địa phương cho toàn thể học sinh khối 6, 7, 8, 9.' },
  { id: 3, date: '18/06', isNew: true, source: 'Sở GD&ĐT', title: 'Hướng dẫn công tác chuẩn hóa cơ sở dữ liệu số học sinh', content: 'Văn bản số 2840/SGDĐT chỉ đạo về việc rà soát, đồng bộ 100% học bạ điện tử, thông tin gia đình và kết quả học tập kỳ II lên hệ thống chuyển đổi số quốc gia trước thời hạn quy định.' },
  { id: 4, date: '17/06', isNew: true, source: 'Bộ GD&ĐT', title: 'Ban hành quy chế đánh giá năng lực tích hợp mới 2026', content: 'Quyết định triển khai đổi mới căn bản phương thức thi và đánh giá kết quả học tập tích hợp giữa trắc nghiệm khách quan tự động và tự luận mở rộng nhằm phát huy tối đa tư duy học sinh.' },
  { id: 5, date: '16/06', isNew: true, source: 'Đoàn - Đội', title: 'Ra quân chiến dịch tình nguyện hoa phượng đỏ hè 2026', content: 'Liên đội THCS Hòa Phú phát động chiến dịch tình nguyện, dọn dẹp vệ sinh khuôn viên trường học, hỗ trợ phân loại rác thải nhựa tại nguồn và tổ chức lớp học ôn tập hè miễn phí cho học sinh khó khăn.' }
];

const defaultActivities: Activity[] = [
  { 
    id: 1, 
    title: "Hội thi Thể thao Học sinh THCS Hòa Phú", 
    category: "TIN TỨC", 
    date: "12/10/2025", 
    desc: "Các trận đấu sôi nổi kịch tính của bộ môn đua xe đạp và bóng đá...", 
    content: "Hội thi thể thao học sinh trường THCS Hòa Phú được tổ chức thường niên nhằm phát triển toàn diện thể lực, kỹ năng làm việc nhóm và đặc biệt là bộ môn đua xe đạp vòng quanh khu vực hồ sinh thái Xã Hòa Xá, mang lại bầu không khí vô cùng phấn khởi cho toàn trường.", 
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400", 
    likes: 42, 
    likedByUser: false, 
    comments: [
      { username: "Học sinh 6A", text: "Trận đua xe đạp kịch tính quá thầy cô ơi!", date: "12/10/2025" }
    ] 
  },
  { 
    id: 2, 
    title: "Khai mạc Tuần lễ Hưởng ứng học tập suốt đời năm học mới", 
    category: "SỰ KIỆN", 
    date: "15/10/2025", 
    desc: "Phát động văn hóa đọc sách và ứng dụng công nghệ thông tin...", 
    content: "Lễ phát động Tuần lễ học tập suốt đời năm học mới tại thư viện trung tâm trường THCS Hòa Phú. Chương trình thu hút hơn 800 học sinh đăng ký các chuyên mục nghiên cứu khoa học tự nhiên và tiếng Anh giao tiếp chuẩn quốc tế.", 
    img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400", 
    likes: 28, 
    likedByUser: false, 
    comments: [] 
  },
  { 
    id: 3, 
    title: "Sáng kiến Khoa học Sáng tạo trẻ THCS Hòa Phú 2026", 
    category: "VĂN THỂ", 
    date: "18/10/2025", 
    desc: "Triển lãm khoa học cấp trường mang tính thực tế cao...", 
    content: "Vinh danh các phát minh sáng tạo trẻ của học sinh trường THCS Hòa Phú, tập trung vào chế tạo robot tự động dọn rác, ứng dụng IoT bảo vệ môi trường và giải pháp chuyển đổi số lớp học thông minh vô cùng sáng tạo.", 
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400", 
    likes: 35, 
    likedByUser: false, 
    comments: [] 
  }
];

const defaultOutstandingStudents: OutstandingStudent[] = [
  { 
    id: 1, 
    name: "Nguyễn Kim Ngân", 
    class: "9A", 
    badge: "Thủ khoa Toán học", 
    gpa: "9.8", 
    conduct: "Tốt", 
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", 
    achievements: [
      "Giải Nhất học sinh giỏi Toán cấp Thành phố 2026", 
      "Huy chương Vàng Violympic Toán học trẻ toàn quốc", 
      "Đại sứ Đọc sách xuất sắc cấp Tỉnh"
    ], 
    subjects: { "Toán": 10.0, "Ngữ Văn": 9.5, "Tiếng Anh": 9.8, "KHTN": 9.8 }, 
    guestbook: [
      { name: "Thầy Quân", msg: "Tự hào về em! Tiếp tục phát huy vững vàng nhé." }, 
      { name: "Mẹ của Ngân", msg: "Cố gắng giữ vững tinh thần hiếu học con yêu." }
    ] 
  },
  { 
    id: 2, 
    name: "Phạm Nam Khánh", 
    class: "8C", 
    badge: "Ngôi sao Khoa học", 
    gpa: "9.4", 
    conduct: "Tốt", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", 
    achievements: [
      "Giải Xuất sắc Sáng tạo Robot Trẻ 2026", 
      "Giải Nhì cuộc thi Tìm hiểu vũ trụ thiên văn học", 
      "Hạng Nhất Olympic Tiếng Anh trực tuyến"
    ], 
    subjects: { "Toán": 9.2, "Ngữ Văn": 8.8, "Tiếng Anh": 9.8, "KHTN": 9.8 }, 
    guestbook: [
      { name: "Cô Quỳnh", msg: "Khánh có tư duy kỹ thuật cực tốt!" }
    ] 
  },
  { 
    id: 3, 
    name: "Trần Minh Châu", 
    class: "7A", 
    badge: "MC Tài năng Trẻ", 
    gpa: "9.6", 
    conduct: "Tốt", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", 
    achievements: [
      "Huy chương Vàng Hùng biện Tiếng Anh cấp Thành phố", 
      "Bằng khen Gương mặt Đội viên tiêu biểu xuất sắc", 
      "Giải Nhất đơn ca liên hoan văn nghệ"
    ], 
    subjects: { "Toán": 9.0, "Ngữ Văn": 9.8, "Tiếng Anh": 10.0, "KHTN": 9.4 }, 
    guestbook: [
      { name: "Trường THCS Hòa Phú", msg: "Cực kỳ năng động và xuất sắc!" }
    ] 
  }
];

const defaultOutstandingClasses: OutstandingClass[] = [
  { 
    id: "9A", 
    lop: "Lớp 9A", 
    gvcn: "Nghiêm Hồng Quân", 
    slogan: "Dẫn đầu thi đua học tốt", 
    icon: "Flag", 
    iconColor: "text-amber-600 bg-amber-50 border-amber-200", 
    total: 42, 
    achievements: [
      "Giải Nhất tuần lễ thi đua cao điểm chào mừng học kỳ mới", 
      "Danh hiệu tập thể Chi đội mạnh xuất sắc dẫn đầu khối 9", 
      "100% học viên lớp hoàn thành mục tiêu học bạ số chuyển đổi"
    ], 
    guestbook: [
      { name: "Ban Giám Hiệu", msg: "Chúc mừng tập thể 9A luôn giữ vững lá cờ đầu!" }
    ] 
  },
  { 
    id: "8C", 
    lop: "Lớp 8C", 
    gvcn: "Phạm Thị Lan", 
    slogan: "Giải nhất văn nghệ trường", 
    icon: "Music", 
    iconColor: "text-purple-600 bg-purple-50 border-purple-200", 
    total: 38, 
    achievements: [
      "Giải Đặc biệt liên hoan văn nghệ Hoa Phượng Đỏ", 
      "Lớp học giữ gìn kỷ cương học vụ tốt nhất tuần 3", 
      "Giải Nhì giải bóng đá khối 8"
    ], 
    guestbook: [] 
  },
  { 
    id: "7A", 
    lop: "Lớp 7A", 
    gvcn: "Trần Văn Cường", 
    slogan: "Vô địch bóng đá nam", 
    icon: "Trophy", 
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200", 
    total: 41, 
    achievements: [
      "Cúp vô địch bóng đá truyền thống hè 2026", 
      "Giải Nhất trang trí không gian học tập thân thiện", 
      "Tuyên dung 12 cá nhân có thành tích xuất sắc học lực"
    ], 
    guestbook: [] 
  },
  { 
    id: "9B", 
    lop: "Lớp 9B", 
    gvcn: "Lê Thúy Quỳnh", 
    slogan: "Chi đội mạnh xuất sắc", 
    icon: "Award", 
    iconColor: "text-rose-500 bg-rose-50 border-rose-200", 
    total: 40, 
    achievements: [
      "Chi đội đạt danh hiệu vững mạnh liên tục", 
      "Giải Nhất cuộc thi Tìm hiểu Luật trẻ em"
    ], 
    guestbook: [] 
  },
  { 
    id: "6E", 
    lop: "Lớp 6E", 
    gvcn: "Nguyễn Kim Ngân", 
    slogan: "Lớp học Xanh-Sạch nhất", 
    icon: "Leaf", 
    iconColor: "text-teal-500 bg-teal-50 border-teal-200", 
    total: 36, 
    achievements: [
      "Giải Xuất sắc chiến dịch dọn rác thải xanh", 
      "Danh hiệu lớp học vệ sinh kiểu mẫu của xã"
    ], 
    guestbook: [] 
  },
  { 
    id: "8A", 
    lop: "Lớp 8A", 
    gvcn: "Lê Thúy Quỳnh", 
    slogan: "100% chuyên cần tháng 5", 
    icon: "Clock", 
    iconColor: "text-blue-500 bg-blue-50 border-blue-200", 
    total: 39, 
    achievements: [
      "Đạt tỉ lệ đi học đúng giờ 100% toàn diện", 
      "Giải Ba văn nghệ cấp trường"
    ], 
    guestbook: [] 
  }
];

// Load and Initialize Data
export const appData = {
  getAccounts: () => getStorageItem<User[]>('school_accounts', defaultAccounts),
  saveAccounts: (data: User[]) => setStorageItem('school_accounts', data),

  getClasses: () => getStorageItem<ClassItem[]>('school_classes', defaultClasses),
  saveClasses: (data: ClassItem[]) => setStorageItem('school_classes', data),

  getAssignments: () => getStorageItem<Assignment[]>('school_assignments', defaultAssignments),
  saveAssignments: (data: Assignment[]) => setStorageItem('school_assignments', data),

  getCourseRegistrations: () => getStorageItem<CourseRegistration[]>('school_course_regs', defaultCourseRegistrations),
  saveCourseRegistrations: (data: CourseRegistration[]) => setStorageItem('school_course_regs', data),

  getSurveys: () => getStorageItem<Survey[]>('school_surveys', defaultSurveys),
  saveSurveys: (data: Survey[]) => setStorageItem('school_surveys', data),

  getExams: () => getStorageItem<Exam[]>('school_exams', defaultExams),
  saveExams: (data: Exam[]) => setStorageItem('school_exams', data),

  getHomework: () => getStorageItem<Homework[]>('school_homework', defaultHomework),
  saveHomework: (data: Homework[]) => setStorageItem('school_homework', data),

  getSubmissions: () => getStorageItem<Submission[]>('school_submissions', defaultSubmissions),
  saveSubmissions: (data: Submission[]) => setStorageItem('school_submissions', data),

  getDocuments: () => getStorageItem<OfficialDocument[]>('school_documents', defaultDocuments),
  saveDocuments: (data: OfficialDocument[]) => setStorageItem('school_documents', data),

  getNotifications: () => getStorageItem<SchoolNotification[]>('school_notifications', defaultNotifications),
  saveNotifications: (data: SchoolNotification[]) => setStorageItem('school_notifications', data),

  getActivities: () => getStorageItem<Activity[]>('school_activities', defaultActivities),
  saveActivities: (data: Activity[]) => setStorageItem('school_activities', data),

  getOutstandingStudents: () => getStorageItem<OutstandingStudent[]>('school_outstanding_students', defaultOutstandingStudents),
  saveOutstandingStudents: (data: OutstandingStudent[]) => setStorageItem('school_outstanding_students', data),

  getOutstandingClasses: () => getStorageItem<OutstandingClass[]>('school_outstanding_classes', defaultOutstandingClasses),
  saveOutstandingClasses: (data: OutstandingClass[]) => setStorageItem('school_outstanding_classes', data)
};
