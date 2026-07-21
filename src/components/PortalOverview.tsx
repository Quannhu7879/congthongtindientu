import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Flag, 
  Music, 
  Trophy, 
  Heart, 
  MessageSquare, 
  Clock, 
  FileText, 
  Send, 
  CloudLightning, 
  Plus, 
  Check, 
  Download, 
  FileSpreadsheet, 
  X, 
  FileCode,
  Calendar,
  Bell,
  Star,
  CornerDownRight,
  UploadCloud,
  ChevronRight,
  School
} from 'lucide-react';
import { User, Survey, Activity, SchoolNotification, OutstandingClass, OutstandingStudent, SchoolSetting } from '../types';

interface PortalOverviewProps {
  surveys: Survey[];
  onSaveSurveys: (surveys: Survey[]) => void;
  activities: Activity[];
  onSaveActivities: (activities: Activity[]) => void;
  outstandingClasses: OutstandingClass[];
  outstandingStudents: OutstandingStudent[];
  notifications: SchoolNotification[];
  currentUser: User | null;
  onViewClass: (id: string) => void;
  onViewStudent: (id: number) => void;
  settings?: SchoolSetting[];
  onSaveSettings?: (settings: SchoolSetting[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalOverview({
  surveys,
  onSaveSurveys,
  activities,
  onSaveActivities,
  outstandingClasses,
  outstandingStudents,
  notifications,
  currentUser,
  onViewClass,
  onViewStudent,
  settings,
  onSaveSettings,
  showToast
}: PortalOverviewProps) {
  // Helper to get configuration value with fallback
  const getSettingValue = (id: string, defVal: string) => {
    return settings?.find(s => s.id === id)?.value || defVal;
  };

  // Admin and Carousel state managers
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [adminBannerTitle, setAdminBannerTitle] = useState(() => getSettingValue('hero_title', 'Cổng thông tin giáo dục THCS Hòa Phú'));
  const [adminBannerDesc, setAdminBannerDesc] = useState(() => getSettingValue('hero_desc', 'Chào mừng năm học mới. Thầy trò trường THCS Hòa Phú thi đua thực hiện đổi mới số, hướng tới dạy tốt và học tập tiến bộ không ngừng.'));
  const [adminBgType, setAdminBgType] = useState(() => getSettingValue('hero_bg_type', 'gradient'));
  const [adminBgImage, setAdminBgImage] = useState(() => getSettingValue('hero_bg_image', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'));
  const [adminGradFrom, setAdminGradFrom] = useState(() => getSettingValue('hero_bg_gradient_from', '#1e3a8a'));
  const [adminGradTo, setAdminGradTo] = useState(() => getSettingValue('hero_bg_gradient_to', '#1e40af'));
  const [adminMarqueeText, setAdminMarqueeText] = useState(() => settings?.find(s => s.id === 'marquee_text')?.value || '🚀 Chào mừng quý thầy cô, phụ huynh và các em học sinh đến với Cổng thông tin điện tử & Chuyển đổi số học tập Trường THCS Hòa Phú - Ứng Hòa - Hà Nội!');
  
  const [adminCarouselList, setAdminCarouselList] = useState<string[]>(() => {
    try {
      const val = getSettingValue('carousel_images', '[]');
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200'
      ];
    } catch(e) {
      return [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200'
      ];
    }
  });
  const [newCarouselUrl, setNewCarouselUrl] = useState('');

  // Synchronize when settings change from database
  React.useEffect(() => {
    if (settings && settings.length > 0) {
      setAdminBannerTitle(getSettingValue('hero_title', 'Cổng thông tin giáo dục THCS Hòa Phú'));
      setAdminBannerDesc(getSettingValue('hero_desc', 'Chào mừng năm học mới. Thầy trò trường THCS Hòa Phú thi đua thực hiện đổi mới số, hướng tới dạy tốt và học tập tiến bộ không ngừng.'));
      setAdminBgType(getSettingValue('hero_bg_type', 'gradient'));
      setAdminBgImage(getSettingValue('hero_bg_image', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'));
      setAdminGradFrom(getSettingValue('hero_bg_gradient_from', '#1e3a8a'));
      setAdminGradTo(getSettingValue('hero_bg_gradient_to', '#1e40af'));
      setAdminMarqueeText(settings?.find(s => s.id === 'marquee_text')?.value || '🚀 Chào mừng quý thầy cô, phụ huynh và các em học sinh đến với Cổng thông tin điện tử & Chuyển đổi số học tập Trường THCS Hòa Phú - Ứng Hòa - Hà Nội!');
      try {
        const val = getSettingValue('carousel_images', '[]');
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdminCarouselList(parsed);
        }
      } catch(e) {}
    }
  }, [settings]);

  // Slideshow timer
  React.useEffect(() => {
    if (adminBgType !== 'carousel' || adminCarouselList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % adminCarouselList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [adminBgType, adminCarouselList]);

  // Activity Edit Form State
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [editActTitle, setEditActTitle] = useState('');
  const [editActCategory, setEditActCategory] = useState('');
  const [editActDesc, setEditActDesc] = useState('');
  const [editActContent, setEditActContent] = useState('');
  const [editActImage, setEditActImage] = useState('');

  const startEditActivity = (act: Activity) => {
    setEditActTitle(act.title);
    setEditActCategory(act.category || 'TIN TỨC');
    setEditActDesc(act.desc || '');
    setEditActContent(act.content || '');
    setEditActImage(act.img || '');
    setIsEditingActivity(true);
  };

  const handleEditActivitySubmit = (e: React.FormEvent, actId: number) => {
    e.preventDefault();
    if (!editActTitle.trim() || !editActDesc.trim()) {
      showToast("Vui lòng điền đủ thông tin tiêu đề và tóm tắt!", "error");
      return;
    }
    const updated = activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          title: editActTitle.trim(),
          category: editActCategory,
          desc: editActDesc.trim(),
          content: editActContent.trim() || editActDesc.trim(),
          img: editActImage.trim()
        };
      }
      return act;
    });
    onSaveActivities(updated);
    setIsEditingActivity(false);
    setSelectedActivity(updated.find(x => x.id === actId) || null);
    showToast("Đã cập nhật bài viết thành công!", "success");
  };

  const handleDeleteActivity = (actId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      const updated = activities.filter(act => act.id !== actId);
      onSaveActivities(updated);
      setSelectedActivity(null);
      setIsEditingActivity(false);
      showToast("Đã xóa bài viết khỏi hệ thống!", "success");
    }
  };

  const handleSaveAdminSettings = () => {
    if (!onSaveSettings) return;

    const updatedSettings: SchoolSetting[] = [
      { id: 'hero_title', value: adminBannerTitle.trim() },
      { id: 'hero_desc', value: adminBannerDesc.trim() },
      { id: 'hero_bg_type', value: adminBgType },
      { id: 'hero_bg_image', value: adminBgImage.trim() },
      { id: 'hero_bg_gradient_from', value: adminGradFrom.trim() },
      { id: 'hero_bg_gradient_to', value: adminGradTo.trim() },
      { id: 'marquee_text', value: adminMarqueeText.trim() },
      { id: 'carousel_images', value: JSON.stringify(adminCarouselList) }
    ];

    onSaveSettings(updatedSettings);
    showToast("Đã lưu và đồng bộ cấu hình giao diện thành công!", "success");
    setShowAdminSettings(false);
  };

  const handleAddCarouselImage = () => {
    if (!newCarouselUrl.trim()) return;
    if (!newCarouselUrl.startsWith('http')) {
      showToast("Vui lòng nhập URL ảnh hợp lệ!", "error");
      return;
    }
    setAdminCarouselList([...adminCarouselList, newCarouselUrl.trim()]);
    setNewCarouselUrl('');
    showToast("Đã thêm ảnh vào danh sách tạm, hãy nhấp 'Lưu cấu hình' để hoàn thành!", "info");
  };

  const handleRemoveCarouselImage = (idxToRemove: number) => {
    setAdminCarouselList(adminCarouselList.filter((_, idx) => idx !== idxToRemove));
    showToast("Đã xóa ảnh khỏi danh sách tạm, hãy nhấp 'Lưu cấu hình' để hoàn thành!", "info");
  };
  // Survey panel tab
  const [surveyTab, setSurveyTab] = useState<'online' | 'upload' | 'list'>('online');
  const [starRating, setStarRating] = useState<number>(5);
  
  // Online survey form state
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [classInfo, setClassInfo] = useState('6A');
  const [surveyTopic, setTopic] = useState('Chất lượng dạy và học');
  const [surveyContent, setContent] = useState('');

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadParentName, setUploadParentName] = useState('');
  const [uploadStudentName, setUploadStudentName] = useState('');

  // Selected Activity detail modal
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [commentText, setCommentText] = useState('');

  // New activity form modal
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActCategory, setNewActCategory] = useState('TIN TỨC');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActContent, setNewActContent] = useState('');
  const [newActImage, setNewActImage] = useState('');

  // View school notification details
  const [selectedNotification, setSelectedNotification] = useState<SchoolNotification | null>(null);

  // Helper rating text
  const ratingTexts: Record<number, string> = {
    1: "Rất không hài lòng (1/5)",
    2: "Không hài lòng (2/5)",
    3: "Bình thường (3/5)",
    4: "Hài lòng (4/5)",
    5: "Rất hài lòng (5/5)"
  };

  // Submit Online Survey
  const handleOnlineSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !studentName.trim() || !surveyContent.trim()) {
      showToast("Vui lòng nhập đầy đủ họ tên và nội dung ý kiến đóng góp!", "error");
      return;
    }

    const newSurvey: Survey = {
      id: Date.now(),
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      classInfo,
      topic: surveyTopic,
      rating: starRating,
      content: surveyContent.trim(),
      file: null,
      status: 'Mới nhận',
      date: new Date().toLocaleDateString('vi-VN')
    };

    onSaveSurveys([newSurvey, ...surveys]);
    showToast("Đã gửi ý kiến khảo sát trực tuyến thành công!", "success");

    // Clear form
    setParentName('');
    setStudentName('');
    setStarRating(5);
    setContent('');
    setSurveyTab('list');
  };

  // Handle Scan File Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
      showToast(`Đã đính kèm tệp: ${file.name}`, "success");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
      showToast(`Đã đính kèm tệp: ${file.name}`, "success");
    }
  };

  // Submit Uploaded Survey Scan
  const handleUploadedSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadParentName.trim() || !uploadStudentName.trim() || !uploadedFile) {
      showToast("Vui lòng tải lên tệp khảo sát và điền đầy đủ họ tên!", "error");
      return;
    }

    const classMatch = uploadStudentName.match(/(6|7|8|9)[A-D]/i);
    const parsedClass = classMatch ? classMatch[0].toUpperCase() : '6A';
    const parsedStudent = uploadStudentName.replace(parsedClass, '').replace(/[-\s]+$/, '').trim() || 'Học sinh';

    const newSurvey: Survey = {
      id: Date.now(),
      parentName: uploadParentName.trim(),
      studentName: parsedStudent,
      classInfo: parsedClass,
      topic: "Khảo sát biểu mẫu (Phiếu bản cứng tải lên tệp quét)",
      rating: 5,
      content: `Gia đình đã gửi bản cứng phiếu khảo sát ý kiến đóng góp thông qua tệp đính kèm số hóa: ${uploadedFile.name}`,
      file: uploadedFile,
      status: 'Mới nhận',
      date: new Date().toLocaleDateString('vi-VN')
    };

    onSaveSurveys([newSurvey, ...surveys]);
    showToast("Tải lên biểu mẫu khảo sát quét thành công!", "success");

    // Clear form
    setUploadParentName('');
    setUploadStudentName('');
    setUploadedFile(null);
    setSurveyTab('list');
  };

  // Update survey status (Admin only)
  const handleUpdateSurveyStatus = (id: number, status: 'Đã tiếp thu' | 'Đang xử lý') => {
    const updated = surveys.map(s => s.id === id ? { ...s, status } : s);
    onSaveSurveys(updated);
    showToast(`Đã cập nhật trạng thái phản hồi ý kiến thành: "${status}"`, "success");
  };

  // Activity interaction - Likes
  const handleLikeActivity = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = activities.map(act => {
      if (act.id === id) {
        const liked = !act.likedByUser;
        return {
          ...act,
          likes: liked ? act.likes + 1 : Math.max(0, act.likes - 1),
          likedByUser: liked
        };
      }
      return act;
    });
    onSaveActivities(updated);
    
    // Sync current selected activity
    if (selectedActivity && selectedActivity.id === id) {
      setSelectedActivity(updated.find(x => x.id === id) || null);
    }
    showToast("Cập nhật lượt thích hoạt động!", "info");
  };

  // Add Comment to Activity
  const handleAddComment = (e: React.FormEvent, actId: number) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const username = currentUser ? currentUser.name : "Khách ẩn danh";
    const newComment = {
      username,
      text: commentText.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };

    const updated = activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          comments: [...(act.comments || []), newComment]
        };
      }
      return act;
    });

    onSaveActivities(updated);
    setCommentText('');
    setSelectedActivity(updated.find(x => x.id === actId) || null);
    showToast("Đã gửi bình luận công khai!", "success");
  };

  // Add new Activity news (Admin or authorized Teacher)
  const handleNewActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim() || !newActDesc.trim()) {
      showToast("Vui lòng điền đủ thông tin tiêu đề và tóm tắt!", "error");
      return;
    }

    const newAct: Activity = {
      id: Date.now(),
      title: newActTitle.trim(),
      category: newActCategory,
      date: new Date().toLocaleDateString('vi-VN'),
      desc: newActDesc.trim(),
      content: newActContent.trim() || newActDesc.trim(),
      img: newActImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400",
      likes: 0,
      comments: []
    };

    onSaveActivities([newAct, ...activities]);
    setShowAddActivity(false);
    
    // reset form
    setNewActTitle('');
    setNewActDesc('');
    setNewActContent('');
    setNewActImage('');

    showToast("Đăng tải bài viết hoạt động thành công!", "success");
  };

  // File download helper (Microsoft Word MIME DOC)
  const triggerDocDownload = (filename: string, htmlMarkup: string) => {
    const blob = new Blob(['\ufeff' + htmlMarkup], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export specific survey report
  const downloadSubmittedSurveyReport = (survey: Survey) => {
    const markup = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="utf-8">
          <title>Phiếu tiếp nhận ý kiến phụ huynh</title>
          <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; color: #000; }
              h2 { text-align: center; text-transform: uppercase; color: #1e3a8a; font-size: 16px; margin-bottom: 2px; }
              .center { text-align: center; }
              .border-box { border: 1px solid #334155; padding: 25px; min-height: 100px; margin-top: 15px; border-radius: 6px; background-color: #fafafa; }
          </style>
      </head>
      <body>
          <table style="width: 100%; margin-bottom: 30px;">
              <tr>
                  <td style="width: 45%; text-align: center; font-weight: bold; font-size: 12px;">
                      SỞ GD&ĐT THÀNH PHỐ HÀ NỘI<br>
                      <b>TRƯỜNG THCS HÒA PHÚ</b><br>
                      -------
                  </td>
                  <td style="width: 55%; text-align: center; font-weight: bold; font-size: 12px;">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
                      <b>Độc lập - Tự do - Hạnh phúc</b><br>
                      <span style="text-decoration: underline;">------------------------</span>
                  </td>
              </tr>
          </table>
          <h2>PHIẾU TIẾP NHẬN Ý KIẾN PHỤ HUYNH HỌC SINH</h2>
          <p class="center" style="font-style: italic; font-size: 11px; margin-bottom: 25px;">(Mã phiếu lưu trữ hệ thống: SURVEY-REC-${survey.id})</p>
          
          <p>Hệ thống Cổng thông tin điện tử & Chuyển đổi số Trường THCS Hòa Phú xin trân trọng xác nhận đã tiếp nhận nội dung góp ý từ quý phụ huynh học sinh với chi tiết sau:</p>
          
          <p><b>Họ và tên Phụ huynh học sinh:</b> <b>${survey.parentName}</b></p>
          <p><b>Phụ huynh em học sinh:</b> <b>${survey.studentName}</b> – Lớp học: <b>${survey.classInfo}</b></p>
          <p><b>Ngày ghi nhận hệ thống:</b> ${survey.date}</p>
          <p><b>Chuyên mục khảo sát đóng góp:</b> <span style="color: #ea580c; font-weight: bold;">${survey.topic}</span></p>
          <p><b>Mức độ hài lòng của gia đình:</b> <b>${survey.rating} / 5 Sao</b></p>
          
          <p><b>Nội dung ý kiến đóng góp nguyên bản:</b></p>
          <div class="border-box">
              <i>"${survey.content}"</i>
          </div>
          
          <p><b>Trạng thái tiếp thu hiện tại:</b> <b style="color: #059669;">${survey.status}</b></p>
          
          <table style="width: 100%; margin-top: 50px; font-size: 13px;">
              <tr>
                  <td style="width: 50%; text-align: center;">
                      <b>TM. HỘI ĐỒNG SƯ PHẠM NHÀ TRƯỜNG</b><br>
                      <b>Hiệu trưởng</b><br>
                      <span style="font-size: 10px; color: #555;">(Hệ thống xác thực & đóng dấu số tự động)</span><br><br><br>
                      <b>Thầy Trần Hữu Phúc</b>
                  </td>
                  <td style="width: 50%; text-align: center;">
                      <i>Hòa Xá, ngày ${survey.date}</i><br>
                      <b>ĐẠI DIỆN PHỤ HUYNH HỌC SINH</b><br>
                      <span style="font-size: 10px; color: #555;">(Ký trực tuyến điện tử bằng định danh vân tay)</span>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
    triggerDocDownload(`Phieu_Gop_Y_PH_${survey.parentName.replace(/\s+/g, '_')}.doc`, markup);
    showToast(`Đã xuất file biểu mẫu tiếp nhận của PH ${survey.parentName}`, "success");
  };

  // Export summary of surveys to Word Doc
  const exportSurveySummaryWord = () => {
    if (surveys.length === 0) {
      showToast("Chưa có khảo sát nào để tổng hợp!", "error");
      return;
    }

    const summary: Record<string, { total: number; counts: Record<number, number> }> = {};
    const topics = [
      "Chất lượng dạy và học",
      "Hoạt động trải nghiệm",
      "Đổi mới học vụ chuyên môn & Chuyển đổi số",
      "Cơ sở vật chất & Thiết bị dạy học",
      "Ý kiến đóng góp xây dựng khác"
    ];
    
    topics.forEach(t => {
      summary[t] = { total: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    });

    surveys.forEach(s => {
      const topicKey = topics.includes(s.topic) ? s.topic : "Ý kiến đóng góp xây dựng khác";
      summary[topicKey].total++;
      if (s.rating >= 1 && s.rating <= 5) {
        summary[topicKey].counts[s.rating]++;
      }
    });

    let tableRows = '';
    let idx = 1;
    for (const [topic, data] of Object.entries(summary)) {
      tableRows += `
        <tr>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${idx++}</td>
          <td style="border: 1px solid #000; padding: 8px;"><b>${topic}</b></td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; color: #ea580c;">${data.total}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${data.counts[5]}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${data.counts[4]}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${data.counts[3]}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${data.counts[2]}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center; color: #dc2626;">${data.counts[1]}</td>
        </tr>
      `;
    }

    const htmlMarkup = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="utf-8">
          <title>Bảng tổng hợp khảo sát phụ huynh</title>
          <style>
              body { font-family: 'Times New Roman', serif; padding: 30px; }
              h2, h3 { text-align: center; margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; }
              th { border: 1px solid #000; padding: 10px; background-color: #e2e8f0; text-align: center; font-weight: bold; color: #1e3a8a; }
          </style>
      </head>
      <body>
          <table style="width: 100%; border-bottom: 2px solid #1e3a8a; margin-top: 0px; margin-bottom: 25px; border-collapse: collapse; border: none;">
              <tr>
                  <td style="text-align: center; font-weight: bold; font-size: 13px; width: 45%; border: none; padding: 0 0 10px 0; line-height: 1.5;">
                      SỞ GD&ĐT HÀ NỘI<br>
                      <b>TRƯỜNG THCS HÒA PHÚ</b><br>
                      -------
                  </td>
                  <td style="text-align: center; font-weight: bold; font-size: 13px; width: 55%; border: none; padding: 0 0 10px 0; line-height: 1.5;">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
                      <b>Độc lập - Tự do - Hạnh phúc</b><br>
                      ------------------------
                  </td>
              </tr>
          </table>
          
          <h2 style="color: #1e3a8a; text-transform: uppercase;">BẢNG TỔNG HỢP Ý KIẾN KHẢO SÁT PHỤ HUYNH TOÀN TRƯỜNG</h2>
          <h3 style="font-style: italic; font-weight: normal; font-size: 12px; color: #64748b;">(Ghi nhận đóng góp trực tuyến & bản giấy nộp kèm)</h3>
          
          <table>
              <thead>
                  <tr>
                      <th rowspan="2" style="width: 5%;">STT</th>
                      <th rowspan="2" style="width: 35%;">Nội dung / Chủ đề khảo sát đóng góp</th>
                      <th rowspan="2" style="width: 10%;">Tổng số<br>ý kiến</th>
                      <th colspan="5">Mức độ hài lòng của gia đình (Số lượng phiếu)</th>
                  </tr>
                  <tr>
                      <th style="width: 10%;">5/5<br>(Rất HL)</th>
                      <th style="width: 10%;">4/5<br>(Hài lòng)</th>
                      <th style="width: 10%;">3/5<br>(Bình thường)</th>
                      <th style="width: 10%;">2/5<br>(Không HL)</th>
                      <th style="width: 10%;">1/5<br>(Ý kiến khác)</th>
                  </tr>
              </thead>
              <tbody>
                  ${tableRows}
              </tbody>
          </table>
          
          <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div style="text-align: center; width: 40%; font-size: 13px;">
                  <b>Người lập bảng</b><br>
                  <i>(Ký và ghi rõ họ tên)</i><br><br><br>
                  Bộ phận Giáo vụ
              </div>
              <div style="text-align: center; width: 50%; font-size: 13px;">
                  <b>TM. HỘI ĐỒNG SƯ PHẠM NHÀ TRƯỜNG</b><br>
                  <i>(Hệ thống ký duyệt tự động)</i><br><br><br>
                  <b>Hiệu trưởng Trần Hữu Phúc</b>
              </div>
          </div>
      </body>
      </html>
    `;

    triggerDocDownload("Bao_Cao_Tong_Hop_Khao_Sat_PH.doc", htmlMarkup);
    showToast("Đã xuất báo cáo tổng hợp khảo sát (Word)", "success");
  };

  // Open direct print window (A4 styled layout) - perfectly acts as client-side PDF export!
  const printSurveySummaryPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const summary: Record<string, { total: number; counts: Record<number, number> }> = {};
    const topics = [
      "Chất lượng dạy và học",
      "Hoạt động trải nghiệm",
      "Đổi mới học vụ chuyên môn & Chuyển đổi số",
      "Cơ sở vật chất & Thiết bị dạy học",
      "Ý kiến đóng góp xây dựng khác"
    ];
    
    topics.forEach(t => {
      summary[t] = { total: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    });

    surveys.forEach(s => {
      const topicKey = topics.includes(s.topic) ? s.topic : "Ý kiến đóng góp xây dựng khác";
      summary[topicKey].total++;
      if (s.rating >= 1 && s.rating <= 5) {
        summary[topicKey].counts[s.rating]++;
      }
    });

    let tableRows = '';
    let idx = 1;
    for (const [topic, data] of Object.entries(summary)) {
      tableRows += `
        <tr>
          <td>${idx++}</td>
          <td><b>${topic}</b></td>
          <td class="bold">${data.total}</td>
          <td>${data.counts[5]}</td>
          <td>${data.counts[4]}</td>
          <td>${data.counts[3]}</td>
          <td>${data.counts[2]}</td>
          <td class="red">${data.counts[1]}</td>
        </tr>
      `;
    }

    printWindow.document.write(`
      <html>
      <head>
        <title>Kết xuất PDF Báo cáo Khảo Sát THCS Hòa Phú</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 30px; }
          .header-left { font-weight: bold; font-size: 13px; line-height: 1.5; }
          .header-right { font-weight: bold; font-size: 13px; text-align: right; line-height: 1.5; }
          h1 { text-align: center; color: #1e3a8a; font-size: 20px; font-weight: 800; margin-bottom: 5px; text-transform: uppercase; }
          h2 { text-align: center; font-style: italic; font-weight: normal; font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th { border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; text-align: center; font-weight: bold; color: #1e3a8a; }
          td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          td.bold { font-weight: bold; text-align: center; }
          td.red { color: #dc2626; text-align: center; }
          .footer { display: flex; justify-content: space-between; margin-top: 60px; font-size: 12px; }
          .footer-col { text-align: center; width: 45%; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="text-align: right; margin-bottom: 15px;">
          <button onclick="window.print();" style="background-color: #ea580c; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ In / Lưu PDF
          </button>
        </div>
        <div class="header">
          <div class="header-left">
            SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI<br>
            <b>TRƯỜNG THCS HÒA PHÚ</b><br>
            -------
          </div>
          <div class="header-right">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            Độc lập - Tự do - Hạnh phúc<br>
            ------------------------
          </div>
        </div>
        
        <h1>Bảng tổng hợp ý kiến khảo sát phụ huynh toàn trường</h1>
        <h2>(Kết quả khảo sát trực tuyến & bản scan đính kèm năm học 2025 - 2026)</h2>
        
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width: 5%;">STT</th>
              <th rowspan="2" style="width: 35%;">Nội dung / Chủ đề khảo sát đóng góp</th>
              <th rowspan="2" style="width: 10%;">Tổng số ý kiến</th>
              <th colspan="5">Mức độ hài lòng của gia đình (Số lượng phiếu)</th>
            </tr>
            <tr>
              <th style="width: 10%;">5/5 (Rất HL)</th>
              <th style="width: 10%;">4/5 (Hài lòng)</th>
              <th style="width: 10%;">3/5 (Bình thường)</th>
              <th style="width: 10%;">2/5 (Không HL)</th>
              <th style="width: 10%;">1/5 (Ý kiến khác)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="footer">
          <div class="footer-col">
            <b>Người thực hiện lập báo cáo</b><br>
            <i>(Ký và ghi rõ họ tên)</i><br><br><br><br>
            Hội đồng Giáo vụ Số
          </div>
          <div class="footer-col">
            <i>Hòa Xá, ngày ${new Date().toLocaleDateString('vi-VN')}</i><br>
            <b>TM. HỘI ĐỒNG SƯ PHẠM NHÀ TRƯỜNG</b><br>
            <i>(Ký tên và đóng dấu điện tử)</i><br><br><br><br>
            <b>Thầy Hiệu trưởng Trần Hữu Phúc</b>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Mở màn hình in báo cáo PDF thành công!", "success");
  };

  // Check write news permissions
  const canPublishNews = currentUser && (
    currentUser.role === 'Admin' || 
    (currentUser.role === 'Giáo viên' && currentUser.canPostNews)
  );

  return (
    <section className="col-span-1 lg:col-span-6 flex flex-col gap-6 animate-fade-in">
      {/* Welcome Banner */}
      {currentUser?.role === 'Admin' && (
        <div className="flex justify-between items-center bg-slate-800 text-white p-3 rounded-2xl shadow-sm border border-slate-700">
          <span className="text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Chế độ quản trị viên hệ thống
          </span>
          <button
            onClick={() => setShowAdminSettings(!showAdminSettings)}
            className="p-1.5 px-3 bg-brandOrange hover:bg-orange-600 rounded-lg text-[10px] font-black tracking-wider uppercase transition cursor-pointer active:scale-95 shadow"
          >
            {showAdminSettings ? 'Đóng cấu hình' : '⚙️ Quản Trị Banner & Chữ Chạy'}
          </button>
        </div>
      )}

      {/* Admin settings slide board */}
      {currentUser?.role === 'Admin' && showAdminSettings && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white space-y-4 shadow-xl animate-fade-in">
          <h3 className="text-xs font-black uppercase text-brandOrange tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <span>⚙️</span> Bảng điều hành giao diện trang chủ & thông báo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Col */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Tiêu đề Hero Banner</label>
                <input
                  type="text"
                  value={adminBannerTitle}
                  onChange={(e) => setAdminBannerTitle(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-brandOrange focus:outline-none"
                  placeholder="Nhập tiêu đề lớn..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Mô tả Hero Banner</label>
                <textarea
                  value={adminBannerDesc}
                  onChange={(e) => setAdminBannerDesc(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 h-20 focus:ring-1 focus:ring-brandOrange focus:outline-none resize-none"
                  placeholder="Nhập mô tả tóm tắt..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Kiểu nền Banner</label>
                <select
                  value={adminBgType}
                  onChange={(e) => setAdminBgType(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-brandOrange focus:outline-none"
                >
                  <option value="gradient">Dải màu Gradient</option>
                  <option value="image">Ảnh nền tĩnh (URL)</option>
                  <option value="carousel">Slide ảnh chạy tự động (Carousel)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Chữ chạy thông báo (Marquee)</label>
                <input
                  type="text"
                  value={adminMarqueeText}
                  onChange={(e) => setAdminMarqueeText(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-brandOrange focus:outline-none"
                  placeholder="Nhập văn bản chạy đầu trang..."
                />
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-3">
              {adminBgType === 'gradient' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Màu bắt đầu</label>
                    <input
                      type="color"
                      value={adminGradFrom}
                      onChange={(e) => setAdminGradFrom(e.target.value)}
                      className="w-full h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Màu kết thúc</label>
                    <input
                      type="color"
                      value={adminGradTo}
                      onChange={(e) => setAdminGradTo(e.target.value)}
                      className="w-full h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {adminBgType === 'image' && (
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">URL ảnh nền tĩnh</label>
                  <input
                    type="text"
                    value={adminBgImage}
                    onChange={(e) => setAdminBgImage(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-brandOrange focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <img src={adminBgImage} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-lg border border-slate-800" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400" }} />
                </div>
              )}

              {adminBgType === 'carousel' && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Quản lý Slide ảnh chạy tự động ({adminCarouselList.length})</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCarouselUrl}
                      onChange={(e) => setNewCarouselUrl(e.target.value)}
                      className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      placeholder="Thêm URL ảnh..."
                    />
                    <button
                      type="button"
                      onClick={handleAddCarouselImage}
                      className="px-2.5 bg-brandOrange hover:bg-orange-600 rounded-lg text-xs font-bold"
                    >
                      Thêm
                    </button>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                    {adminCarouselList.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px] bg-slate-900 border border-slate-800 p-1.5 rounded gap-2">
                        <span className="truncate flex-1 text-slate-300 font-mono">{img}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselImage(idx)}
                          className="text-rose-500 hover:text-rose-400 font-bold px-1"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    {adminCarouselList.length === 0 && (
                      <p className="text-center text-slate-500 text-[10px] py-4">Chưa có ảnh nào. Hãy thêm ảnh!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowAdminSettings(false);
                showToast("Đã hủy thay đổi cấu hình tạm thời", "info");
              }}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-extrabold transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSaveAdminSettings}
              className="px-5 py-1.5 bg-brandOrange hover:bg-orange-600 text-white rounded-xl text-xs font-black transition shadow cursor-pointer active:scale-95"
            >
              Lưu cấu hình hệ thống
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div 
        className="rounded-3xl p-6 text-white relative overflow-hidden shadow-md transition-all duration-700 min-h-[180px] flex flex-col justify-center"
        style={{
          background: adminBgType === 'gradient'
            ? `linear-gradient(to bottom right, ${adminGradFrom}, ${adminGradTo})`
            : adminBgType === 'image'
            ? `linear-gradient(to bottom, rgba(30, 58, 138, 0.45), rgba(30, 64, 175, 0.85)), url(${adminBgImage}) center/cover no-repeat`
            : 'none'
        }}
      >
        {/* Background carousel if selected */}
        {adminBgType === 'carousel' && adminCarouselList.length > 0 && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            {adminCarouselList.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  currentSlide === idx ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(30, 58, 138, 0.5), rgba(30, 64, 175, 0.85)), url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
            
            {/* Carousel dots / navigation */}
            <div className="absolute bottom-4 right-5 z-10 flex gap-1.5 bg-black/30 pointer-events-auto px-2.5 py-1 rounded-full">
              {adminCarouselList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none z-0">
          <School className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <span className="bg-brandOrange text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm">
            Ứng dụng Chuyển đổi số học tập
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-2 mb-1.5 drop-shadow-md">
            {adminBannerTitle}
          </h2>
          <p className="text-xs text-blue-100 max-w-md drop-shadow-sm font-semibold leading-relaxed">
            {adminBannerDesc}
          </p>
        </div>
      </div>

      {/* Parents Surveys / Opinions Widget */}
      <div className="bg-white border-2 border-brandOrange/80 rounded-2xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3 mb-4 gap-3">
          <div>
            <span className="bg-brandOrange text-white px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase">
              Tính năng mới
            </span>
            <h3 className="font-black text-xs md:text-sm text-slate-800 flex items-center gap-1.5 uppercase mt-1">
              <CloudLightning className="w-4 h-4 text-brandOrange animate-pulse animate-duration-1000" /> 
              Khảo sát &amp; Đóng góp ý kiến phụ huynh học sinh
            </h3>
          </div>
          
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl text-[10px] font-extrabold shrink-0">
            <button 
              onClick={() => setSurveyTab('online')}
              className={`px-3 py-1.5 rounded-lg transition ${
                surveyTab === 'online' ? 'bg-white text-brandBlue shadow-sm' : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              Ý kiến trực tuyến
            </button>
            <button 
              onClick={() => setSurveyTab('upload')}
              className={`px-3 py-1.5 rounded-lg transition ${
                surveyTab === 'upload' ? 'bg-white text-brandBlue shadow-sm' : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              Bản giấy &amp; Tải tệp lên
            </button>
            <button 
              onClick={() => setSurveyTab('list')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                surveyTab === 'list' ? 'bg-white text-brandBlue shadow-sm' : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              Danh sách ({surveys.length})
            </button>
          </div>
        </div>

        {/* Tab content 1: Online Survey Form */}
        {surveyTab === 'online' && (
          <form onSubmit={handleOnlineSurveySubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Họ tên phụ huynh</label>
                <input 
                  type="text" 
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Định" 
                  className="w-full text-xs p-2.5 border rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Họ tên con học sinh</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Thư" 
                  className="w-full text-xs p-2.5 border rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Lớp học trực thuộc</label>
                <select 
                  value={classInfo}
                  onChange={(e) => setClassInfo(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl font-bold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-brandOrange cursor-pointer"
                >
                  <option value="6A">Lớp 6A</option>
                  <option value="6B">Lớp 6B</option>
                  <option value="7A">Lớp 7A</option>
                  <option value="7B">Lớp 7B</option>
                  <option value="8A">Lớp 8A</option>
                  <option value="8B">Lớp 8B</option>
                  <option value="9A">Lớp 9A</option>
                  <option value="9B">Lớp 9B</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Chủ đề đóng góp ý kiến</label>
                <select 
                  value={surveyTopic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl font-bold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-brandOrange cursor-pointer"
                >
                  <option value="Chất lượng dạy và học">Chất lượng dạy và học của thầy và trò</option>
                  <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm &amp; Stem ngoại khóa</option>
                  <option value="Đổi mới học vụ chuyên môn & Chuyển đổi số">Đổi mới học vụ chuyên môn &amp; Chuyển đổi số</option>
                  <option value="Cơ sở vật chất & Thiết bị dạy học">Cơ sở vật chất &amp; Thiết bị màn hình học tập</option>
                  <option value="Ý kiến đóng góp xây dựng khác">Ý kiến đóng góp xây dựng khác</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mức độ hài lòng của gia đình</label>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStarRating(val)}
                        className="text-base text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        {val <= starRating ? <Star className="w-5 h-5 fill-amber-400" /> : <Star className="w-5 h-5 text-slate-300" />}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-amber-600">
                    {ratingTexts[starRating]}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nội dung ý kiến chi tiết</label>
              <textarea 
                rows={2} 
                value={surveyContent}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập những đề xuất, đóng góp tâm huyết của phụ huynh gửi tới thầy hiệu trưởng và nhà trường..." 
                className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandOrange bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-brandOrange hover:bg-brandOrange-dark text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Gửi ý kiến khảo sát trực tuyến
              </button>
            </div>
          </form>
        )}

        {/* Tab content 2: Download Template & Drag-drop Upload scan */}
        {surveyTab === 'upload' && (
          <form onSubmit={handleUploadedSurveySubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-extrabold text-blue-800 text-xs mb-0.5">
                  Bước 1: Tải biểu mẫu in giấy (Khảo sát Phụ huynh)
                </h4>
                <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                  Phụ huynh tải biểu mẫu về máy, điền thông tin đóng góp bằng tay và ký xác nhận.
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button 
                  type="button"
                  onClick={() => triggerDocDownload("Don_Khao_Sat_Y_Kien_PH.doc", "<h2>BIỂU MẪU KHẢO SÁT CHẤT LƯỢNG THCS HÒA PHÚ</h2><p>Họ tên PH:................................... Tên HS: .......................... Lớp: .............</p><p>Ý kiến đóng góp: .................................................................................</p><p>Ký tên: ..........................</p>")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-3.5 py-2.5 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Bản Word (.doc)
                </button>
                <button 
                  type="button"
                  onClick={() => showToast("Đang kết xuất tệp PDF trắng... Vui lòng in từ trình duyệt", "info")}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] px-3.5 py-2.5 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Bản PDF (.pdf)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs">
                Bước 2: Tải lên bản chụp điện thoại / file scan đã hoàn tất
              </h4>
              
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-5 text-center relative hover:bg-slate-100 hover:border-brandOrange transition duration-200 cursor-pointer"
              >
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept=".pdf, .doc, .docx, image/*"
                />
                <UploadCloud className="w-8 h-8 text-brandOrange mx-auto mb-1.5 animate-bounce" />
                <h5 className="text-[11px] font-bold text-slate-700">
                  {uploadedFile 
                    ? `Đã nạp tệp: ${uploadedFile.name} (${uploadedFile.size})` 
                    : "Kéo thả hình ảnh chụp phiếu ý kiến khảo sát đã hoàn tất vào đây để gửi lên hệ thống"
                  }
                </h5>
                <span className="text-[9px] text-slate-400 block mt-1">Chấp nhận định dạng ảnh (.jpg, .png) hoặc PDF, Word</span>
              </div>

              {uploadedFile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-200 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Tên phụ huynh ghi trên phiếu</label>
                    <input 
                      type="text" 
                      value={uploadParentName}
                      onChange={(e) => setUploadParentName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Thị Liên" 
                      className="w-full text-xs p-2 border rounded-lg mt-1 font-bold bg-white outline-none focus:ring-2 focus:ring-brandOrange"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Họ tên con học sinh &amp; Lớp (Ví dụ: Nguyễn Văn A - 6A)</label>
                    <input 
                      type="text" 
                      value={uploadStudentName}
                      onChange={(e) => setUploadStudentName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A - 6A" 
                      className="w-full text-xs p-2 border rounded-lg mt-1 font-bold bg-white outline-none focus:ring-2 focus:ring-brandOrange"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                    <button 
                      type="submit"
                      className="bg-brandOrange hover:bg-brandOrange-dark text-white font-bold text-[10px] px-4 py-2 rounded-lg shadow transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Hoàn thành gửi phiếu quét
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Tab content 3: History List / Actions */}
        {surveyTab === 'list' && (
          <div className="space-y-3">
            <div className="overflow-x-auto max-h-64 custom-scrollbar rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-100 text-[10px]">
                    <th className="p-2.5">Phụ huynh / Con</th>
                    <th className="p-2.5">Ý kiến đóng góp</th>
                    <th className="p-2.5 text-center">Đánh giá</th>
                    <th className="p-2.5 text-center">Tệp gốc</th>
                    <th className="p-2.5 text-center">Ngày nộp</th>
                    <th className="p-2.5 text-right">Trạng thái / Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {surveys.length > 0 ? (
                    surveys.map(s => {
                      const scoreStars = Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < s.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                        />
                      ));

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2.5">
                            <span className="font-extrabold text-slate-800 text-[11px] md:text-xs">
                              {s.parentName}
                            </span>
                            <div className="text-[9px] text-slate-500 font-bold">
                              Con: {s.studentName} ({s.classInfo})
                            </div>
                          </td>
                          <td className="p-2.5 max-w-[150px]">
                            <span className="font-extrabold text-brandBlue block text-[10px] truncate">
                              {s.topic}
                            </span>
                            <p className="text-slate-600 italic line-clamp-1 text-[11px]" title={s.content}>
                              "{s.content}"
                            </p>
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {scoreStars}
                            </div>
                          </td>
                          <td className="p-2.5 text-center">
                            {s.file ? (
                              <div>
                                <span className="text-[10px] text-brandOrange font-bold block truncate max-w-[100px]">
                                  {s.file.name}
                                </span>
                                <span className="text-[8px] text-slate-400 block font-mono">
                                  {s.file.size}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="p-2.5 text-center text-slate-500 font-bold font-mono text-[10px]">
                            {s.date}
                          </td>
                          <td className="p-2.5 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-1">
                                {currentUser && currentUser.role === 'Admin' && s.status !== 'Đã tiếp thu' && (
                                  <button 
                                    onClick={() => handleUpdateSurveyStatus(s.id, 'Đã tiếp thu')}
                                    className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold text-[9px] px-2 py-1 rounded transition"
                                  >
                                    Tiếp thu
                                  </button>
                                )}
                                <button 
                                  onClick={() => downloadSubmittedSurveyReport(s)}
                                  className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-[9px] px-2.5 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-2.5 h-2.5" /> Bản in
                                </button>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border mt-1 ${
                                s.status === 'Đã tiếp thu' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                s.status === 'Đang xử lý' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 font-bold">
                        Chưa nhận được phiếu khảo sát ý kiến nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Overall Reports Summary actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={exportSurveySummaryWord}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Xuất Tổng Hợp (Word)
              </button>
              <button 
                onClick={printSurveySummaryPDF}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Kết xuất tổng hợp (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* School Fact Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Học sinh</span>
          <span className="block text-xl font-black text-brandBlue mt-1">820 em</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Giáo viên</span>
          <span className="block text-xl font-black text-brandOrange mt-1">48 Thầy cô</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Lớp học</span>
          <span className="block text-xl font-black text-emerald-600 mt-1">16 Lớp</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Học bạ số</span>
          <span className="block text-xl font-black text-indigo-600 mt-1">100%</span>
        </div>
      </div>

      {/* OUTSTANDING ACTIVITIES */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h3 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-1.5 h-4 bg-brandOrange rounded-full"></span>
            Hoạt động nổi bật nhà trường
          </h3>
          {canPublishNews && (
            <button 
              onClick={() => setShowAddActivity(true)}
              className="bg-brandBlue hover:bg-brandBlue-dark text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Đăng bài
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {activities.map(act => (
            <div 
              key={act.id} 
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex flex-col h-full relative"
            >
              <div onClick={() => setSelectedActivity(act)} className="h-28 w-full relative overflow-hidden">
                <img src={act.img} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-brandBlue text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow">
                  {act.category}
                </span>
              </div>
              <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                <h4 onClick={() => setSelectedActivity(act)} className="font-extrabold text-[11px] md:text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-brandBlue transition-colors duration-200">
                  {act.title}
                </h4>
                
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[9px]" /> {act.date}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleLikeActivity(e, act.id)}
                      className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${act.likedByUser ? 'text-rose-500' : 'text-slate-400'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${act.likedByUser ? 'fill-rose-500 text-rose-500 animate-pulse' : ''}`} />
                      <span>{act.likes}</span>
                    </button>
                    <button onClick={() => setSelectedActivity(act)} className="flex items-center gap-1 hover:text-brandBlue transition-colors text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{act.comments ? act.comments.length : 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OUTSTANDING CLASSES */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <h3 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
            Lớp học tiêu biểu xuất sắc
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold italic">
            Click để xem vinh danh
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outstandingClasses.map(cls => (
            <div 
              key={cls.id}
              onClick={() => onViewClass(cls.id)}
              className="group border border-slate-200 p-4 rounded-2xl bg-white relative cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="absolute top-3.5 right-3.5 text-lg p-2 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                {cls.icon === 'Flag' && <Flag className="w-4 h-4 text-orange-500" />}
                {cls.icon === 'Music' && <Music className="w-4 h-4 text-purple-600" />}
                {cls.icon === 'Trophy' && <Trophy className="w-4 h-4 text-emerald-600" />}
                {cls.icon === 'Award' && <Award className="w-4 h-4 text-rose-500" />}
                {cls.icon === 'Leaf' && <Star className="w-4 h-4 text-teal-500" />}
                {cls.icon === 'Clock' && <Clock className="w-4 h-4 text-blue-500" />}
              </div>
              
              <h4 className="font-black text-brandBlue text-sm group-hover:text-brandOrange transition-colors">
                {cls.lop}
              </h4>
              <span className="text-xs font-bold text-slate-700 block mt-2">
                "{cls.slogan}"
              </span>
              <span className="text-[10px] text-slate-400 block mt-4 font-semibold">
                GVCN: {cls.gvcn} • Sĩ số: {cls.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* OUTSTANDING STUDENTS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <h3 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-1.5 h-4 bg-brandBlue rounded-full"></span>
            Gương sáng học sinh danh dự tiêu biểu
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-brandOrange animate-pulse" /> Học bạ vàng
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outstandingStudents.map(std => (
            <div 
              key={std.id}
              onClick={() => onViewStudent(std.id)}
              className="group border border-slate-200 p-4 rounded-2xl bg-white relative cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full border-2 border-brandBlue/30 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img src={std.avatar} alt={std.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-800 text-xs truncate group-hover:text-brandBlue transition-colors">
                  {std.name}
                </h4>
                <span className="text-[10px] font-bold text-brandOrange block mt-0.5 truncate">
                  {std.badge}
                </span>
                <div className="flex justify-between items-center mt-2 text-[9px] text-slate-400 font-semibold">
                  <span>Lớp: {std.class}</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                    GPA: {std.gpa}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL FOR SELECTED ACTIVITY */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => {
                  setSelectedActivity(null);
                  setIsEditingActivity(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {isEditingActivity ? (
                /* EDIT FORM FOR ACTIVITY */
                <form onSubmit={(e) => handleEditActivitySubmit(e, selectedActivity.id)} className="space-y-4 mt-4">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide border-b pb-2">
                    📝 Hiệu chỉnh bài viết
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Tiêu đề bài viết</label>
                    <input
                      type="text"
                      value={editActTitle}
                      onChange={(e) => setEditActTitle(e.target.value)}
                      className="w-full text-xs border rounded-xl p-2.5 font-medium focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Danh mục</label>
                      <select
                        value={editActCategory}
                        onChange={(e) => setEditActCategory(e.target.value)}
                        className="w-full text-xs border rounded-xl p-2.5 font-medium focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      >
                        <option value="TIN TỨC">TIN TỨC</option>
                        <option value="SỰ KIỆN">SỰ KIỆN</option>
                        <option value="VĂN THỂ">VĂN THỂ</option>
                        <option value="THÔNG BÁO">THÔNG BÁO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Ảnh đại diện (URL)</label>
                      <input
                        type="text"
                        value={editActImage}
                        onChange={(e) => setEditActImage(e.target.value)}
                        className="w-full text-xs border rounded-xl p-2.5 font-medium focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Tóm tắt ngắn</label>
                    <textarea
                      value={editActDesc}
                      onChange={(e) => setEditActDesc(e.target.value)}
                      className="w-full text-xs border rounded-xl p-2.5 font-medium h-16 resize-none focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Nội dung chi tiết</label>
                    <textarea
                      value={editActContent}
                      onChange={(e) => setEditActContent(e.target.value)}
                      className="w-full text-xs border rounded-xl p-2.5 font-medium h-32 resize-none focus:ring-1 focus:ring-brandOrange focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditingActivity(false)}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 bg-brandOrange hover:bg-orange-600 text-white rounded-xl text-xs font-black transition shadow"
                    >
                      Cập nhật bài viết
                    </button>
                  </div>
                </form>
              ) : (
                /* READ ONLY DETAIL VIEW */
                <>
                  <img 
                    src={selectedActivity.img} 
                    alt={selectedActivity.title} 
                    className="w-full h-44 object-cover mt-2 rounded-2xl shadow-inner" 
                  />

                  {/* Admin Editorial Controls */}
                  {canPublishNews && (
                    <div className="flex gap-2 mt-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 justify-end">
                      <button
                        type="button"
                        onClick={() => startEditActivity(selectedActivity)}
                        className="p-1 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold border border-blue-200 transition cursor-pointer flex items-center gap-1"
                      >
                        Sửa bài viết
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(selectedActivity.id)}
                        className="p-1 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-bold border border-rose-200 transition cursor-pointer flex items-center gap-1"
                      >
                        Xóa bài viết
                      </button>
                    </div>
                  )}
                  
                  <h3 className="font-black text-slate-800 text-sm md:text-base mt-4 leading-snug">
                    {selectedActivity.title}
                  </h3>
                  
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> <span>Đăng lúc: {selectedActivity.date}</span>
                  </p>
                  
                  <div className="mt-4">
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium whitespace-pre-line">
                      {selectedActivity.content}
                    </p>
                  </div>
                  
                  {/* Like / Comments Module */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-800 uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4 text-brandOrange animate-pulse" /> 
                        Bình luận ({selectedActivity.comments ? selectedActivity.comments.length : 0})
                      </span>
                      
                      <button 
                        onClick={(e) => handleLikeActivity(e, selectedActivity.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                          selectedActivity.likedByUser 
                            ? 'bg-rose-100 text-rose-500 hover:bg-rose-200' 
                            : 'bg-rose-50 text-rose-400 hover:bg-rose-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${selectedActivity.likedByUser ? 'fill-rose-500' : ''}`} />
                        <span>{selectedActivity.likes} Thích</span>
                      </button>
                    </div>
                    
                    {/* Write Comment Form */}
                    <form onSubmit={(e) => handleAddComment(e, selectedActivity.id)} className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brandOrange font-medium" 
                        placeholder="Viết bình luận công khai đóng góp..."
                        required
                      />
                      <button 
                        type="submit"
                        className="bg-brandOrange hover:bg-brandOrange-dark text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                    
                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar p-1">
                      {selectedActivity.comments && selectedActivity.comments.length > 0 ? (
                        selectedActivity.comments.map((comment, cidx) => (
                          <div key={cidx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="text-brandBlue">{comment.username}</span>
                              <span className="text-slate-400 font-mono">{comment.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              {comment.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-slate-400 py-3 text-[11px] font-medium">
                          Chưa có phản hồi nào. Hãy thảo luận đầu tiên!
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW ACTIVITY NEWS MODAL */}
      <AnimatePresence>
        {showAddActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowAddActivity(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-3 mb-4">
                <h4 className="font-black text-sm text-brandBlue">Đăng bài hoạt động / Tin tức mới</h4>
              </div>

              <form onSubmit={handleNewActivitySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Tiêu đề bài viết</label>
                  <input 
                    type="text" 
                    value={newActTitle}
                    onChange={(e) => setNewActTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-bold"
                    placeholder="Ví dụ: Đại hội thể thao hè 2026"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Chuyên mục</label>
                    <input 
                      type="text" 
                      value={newActCategory}
                      onChange={(e) => setNewActCategory(e.target.value)}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-bold"
                      placeholder="Tin tức, Sự kiện, Thể thao..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Link ảnh đại diện (Unsplash)</label>
                    <input 
                      type="text" 
                      value={newActImage}
                      onChange={(e) => setNewActImage(e.target.value)}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-mono"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Tóm tắt ngắn</label>
                  <textarea 
                    rows={2}
                    value={newActDesc}
                    onChange={(e) => setNewActDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-medium"
                    placeholder="Tóm tắt ngắn gọn hoạt động hiển thị ở trang chủ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nội dung chi tiết</label>
                  <textarea 
                    rows={4}
                    value={newActContent}
                    onChange={(e) => setNewActContent(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-medium"
                    placeholder="Nội dung bài báo đầy đủ khi click vào xem chi tiết..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button 
                    type="button"
                    onClick={() => setShowAddActivity(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="bg-brandBlue hover:bg-brandBlue-dark text-white px-5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    Lưu &amp; Phát hành bài viết
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
