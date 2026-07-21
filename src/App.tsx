import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  X,
  Bell,
  Heart,
  Calendar,
  Phone
} from 'lucide-react';

import PortalHeader from './components/PortalHeader';
import PortalSidebar from './components/PortalSidebar';
import PortalOverview from './components/PortalOverview';
import PortalRightNavBanner from './components/PortalRightNavBanner';
import PortalMySubmissions from './components/PortalMySubmissions';
import PortalAIAssistant from './components/PortalAIAssistant';

import { 
  ClassDetailView, 
  StudentDetailView 
} from './components/PortalDetailViews';

import { 
  PortalCourseRegistration, 
  PortalDocuments, 
  PortalHomework, 
  PortalExams, 
  PortalStudentTestRoom 
} from './components/PortalAcademicModules';

import { 
  PortalAccountManagement, 
  PortalClassStructure, 
  PortalTeacherAssignment, 
  PortalGradingDesk 
} from './components/PortalAdminAndTeacher';

import { 
  PortalTranscript, 
  PortalContactBook, 
  PortalExportCenter, 
  PortalMiniGameCenter 
} from './components/PortalReportsAndExports';

import { appData } from './data';
import { getSupabaseData, saveSupabaseData } from './lib/supabase';
import PortalSupabaseSync from './components/PortalSupabaseSync';
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
} from './types';

export default function App() {
  // Session Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('school_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState('overview');

  // Interactive Outstanding Class/Student Details Overlays
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);

  // Auto-fading custom toast notification state
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ msg, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Master Data States with Lazy Initializers from localStorage
  const [accounts, setAccounts] = useState<User[]>(() => appData.getAccounts());
  const [classes, setClasses] = useState<ClassItem[]>(() => appData.getClasses());
  const [assignments, setAssignments] = useState<Assignment[]>(() => appData.getAssignments());
  const [registrations, setRegistrations] = useState<CourseRegistration[]>(() => appData.getCourseRegistrations());
  const [surveys, setSurveys] = useState<Survey[]>(() => appData.getSurveys());
  const [exams, setExams] = useState<Exam[]>(() => appData.getExams());
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => appData.getHomework());
  const [submissions, setSubmissions] = useState<Submission[]>(() => appData.getSubmissions());
  const [documents, setDocuments] = useState<OfficialDocument[]>(() => appData.getDocuments());
  const [notifications, setNotifications] = useState<SchoolNotification[]>(() => appData.getNotifications());
  const [activities, setActivities] = useState<Activity[]>(() => appData.getActivities());
  const [outstandingStudents, setOutstandingStudents] = useState<OutstandingStudent[]>(() => appData.getOutstandingStudents());
  const [outstandingClasses, setOutstandingClasses] = useState<OutstandingClass[]>(() => appData.getOutstandingClasses());
  const [settings, setSettings] = useState<SchoolSetting[]>(() => appData.getSettings());

  // Load live data from Supabase on mount with seamless local cache fallbacks
  useEffect(() => {
    async function syncDataFromSupabase() {
      try {
        console.log('[Supabase Sync] Đang đồng bộ hóa dữ liệu trực tuyến...');
        
        const [
          dbAccounts,
          dbClasses,
          dbAssignments,
          dbRegistrations,
          dbSurveys,
          dbExams,
          dbHomework,
          dbSubmissions,
          dbDocuments,
          dbNotifications,
          dbActivities,
          dbOutstandingStudents,
          dbOutstandingClasses,
          dbSettings
        ] = await Promise.all([
          getSupabaseData<User[]>('school_accounts', accounts),
          getSupabaseData<ClassItem[]>('school_classes', classes),
          getSupabaseData<Assignment[]>('school_assignments', assignments),
          getSupabaseData<CourseRegistration[]>('school_course_registrations', registrations),
          getSupabaseData<Survey[]>('school_surveys', surveys),
          getSupabaseData<Exam[]>('school_exams', exams),
          getSupabaseData<Homework[]>('school_homework', homeworkList),
          getSupabaseData<Submission[]>('school_submissions', submissions),
          getSupabaseData<OfficialDocument[]>('school_documents', documents),
          getSupabaseData<SchoolNotification[]>('school_notifications', notifications),
          getSupabaseData<Activity[]>('school_activities', activities),
          getSupabaseData<OutstandingStudent[]>('school_outstanding_students', outstandingStudents),
          getSupabaseData<OutstandingClass[]>('school_outstanding_classes', outstandingClasses),
          getSupabaseData<SchoolSetting[]>('school_settings', settings)
        ]);

        if (dbAccounts && dbAccounts.length > 0) { setAccounts(dbAccounts); appData.saveAccounts(dbAccounts); }
        if (dbClasses && dbClasses.length > 0) { setClasses(dbClasses); appData.saveClasses(dbClasses); }
        if (dbAssignments && dbAssignments.length > 0) { setAssignments(dbAssignments); appData.saveAssignments(dbAssignments); }
        if (dbRegistrations && dbRegistrations.length > 0) { setRegistrations(dbRegistrations); appData.saveCourseRegistrations(dbRegistrations); }
        if (dbSurveys && dbSurveys.length > 0) { setSurveys(dbSurveys); appData.saveSurveys(dbSurveys); }
        if (dbExams && dbExams.length > 0) { setExams(dbExams); appData.saveExams(dbExams); }
        if (dbHomework && dbHomework.length > 0) { setHomeworkList(dbHomework); appData.saveHomework(dbHomework); }
        if (dbSubmissions && dbSubmissions.length > 0) { setSubmissions(dbSubmissions); appData.saveSubmissions(dbSubmissions); }
        if (dbDocuments && dbDocuments.length > 0) { setDocuments(dbDocuments); appData.saveDocuments(dbDocuments); }
        if (dbNotifications && dbNotifications.length > 0) { setNotifications(dbNotifications); appData.saveNotifications(dbNotifications); }
        if (dbActivities && dbActivities.length > 0) { setActivities(dbActivities); appData.saveActivities(dbActivities); }
        if (dbOutstandingStudents && dbOutstandingStudents.length > 0) { setOutstandingStudents(dbOutstandingStudents); appData.saveOutstandingStudents(dbOutstandingStudents); }
        if (dbOutstandingClasses && dbOutstandingClasses.length > 0) { setOutstandingClasses(dbOutstandingClasses); appData.saveOutstandingClasses(dbOutstandingClasses); }
        if (dbSettings && dbSettings.length > 0) { setSettings(dbSettings); appData.saveSettings(dbSettings); }
        
        console.log('[Supabase Sync] Đồng bộ hoàn tất!');
      } catch (err) {
        console.warn('[Supabase Sync Error] Không thể tải dữ liệu trực tiếp từ Supabase:', err);
      }
    }
    syncDataFromSupabase();
  }, []);

  // Handle Authentication Sessions Saving
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('school_current_user', JSON.stringify(user));
    showToast(`Chào mừng ${user.name} (${user.role}) đăng nhập thành công hệ thống học vụ THCS Hòa Phú!`, "success");
    setCurrentTab('overview');
    setActiveClassId(null);
    setActiveStudentId(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('school_current_user');
    showToast("Bạn đã đăng xuất khỏi phiên làm việc an toàn.", "info");
    setCurrentTab('overview');
    setActiveClassId(null);
    setActiveStudentId(null);
  };

  // State persist-to-storage handlers with real-time Supabase background synchronization
  const handleSaveAccounts = async (newAccounts: User[]) => {
    setAccounts(newAccounts);
    appData.saveAccounts(newAccounts);
    await saveSupabaseData('school_accounts', newAccounts);
  };

  const handleSaveClasses = async (newClasses: ClassItem[]) => {
    setClasses(newClasses);
    appData.saveClasses(newClasses);
    await saveSupabaseData('school_classes', newClasses);
  };

  const handleSaveAssignments = async (newAsgs: Assignment[]) => {
    setAssignments(newAsgs);
    appData.saveAssignments(newAsgs);
    await saveSupabaseData('school_assignments', newAsgs);
  };

  const handleSaveRegistrations = async (newRegs: CourseRegistration[]) => {
    setRegistrations(newRegs);
    appData.saveCourseRegistrations(newRegs);
    await saveSupabaseData('school_course_registrations', newRegs);
  };

  const handleSaveSurveys = async (newSurveys: Survey[]) => {
    setSurveys(newSurveys);
    appData.saveSurveys(newSurveys);
    await saveSupabaseData('school_surveys', newSurveys);
  };

  const handleSaveExams = async (newExams: Exam[]) => {
    setExams(newExams);
    appData.saveExams(newExams);
    await saveSupabaseData('school_exams', newExams);
  };

  const handleSaveHomework = async (newHw: Homework[]) => {
    setHomeworkList(newHw);
    appData.saveHomework(newHw);
    await saveSupabaseData('school_homework', newHw);
  };

  const handleSaveSubmissions = async (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    appData.saveSubmissions(newSubs);
    await saveSupabaseData('school_submissions', newSubs);
  };

  const handleSaveDocuments = async (newDocs: OfficialDocument[]) => {
    setDocuments(newDocs);
    appData.saveDocuments(newDocs);
    await saveSupabaseData('school_documents', newDocs);
  };

  const handleSaveOutstandingStudents = async (newStds: OutstandingStudent[]) => {
    setOutstandingStudents(newStds);
    appData.saveOutstandingStudents(newStds);
    await saveSupabaseData('school_outstanding_students', newStds);
  };

  const handleSaveOutstandingClasses = async (newCls: OutstandingClass[]) => {
    setOutstandingClasses(newCls);
    appData.saveOutstandingClasses(newCls);
    await saveSupabaseData('school_outstanding_classes', newCls);
  };

  const handleSaveActivities = async (newActivities: Activity[]) => {
    setActivities(newActivities);
    appData.saveActivities(newActivities);
    await saveSupabaseData('school_activities', newActivities);
  };

  const handleSaveSettings = async (newSettings: SchoolSetting[]) => {
    setSettings(newSettings);
    appData.saveSettings(newSettings);
    await saveSupabaseData('school_settings', newSettings);
  };

  const handleSaveNotifications = async (newNotifications: SchoolNotification[]) => {
    setNotifications(newNotifications);
    appData.saveNotifications(newNotifications);
    await saveSupabaseData('school_notifications', newNotifications);
  };

  // Helper callbacks to switch directly to Class/Student profile pages
  const handleViewClass = (id: string) => {
    setActiveClassId(id);
    setActiveStudentId(null);
  };

  const handleViewStudent = (id: number) => {
    setActiveStudentId(id);
    setActiveClassId(null);
  };

  // Render the current active tab or full-screen profiles
  const renderTabContent = () => {
    if (activeClassId) {
      return (
        <ClassDetailView
          classId={activeClassId}
          outstandingClasses={outstandingClasses}
          onBack={() => setActiveClassId(null)}
          onSaveOutstandingClasses={handleSaveOutstandingClasses}
          showToast={showToast}
          currentUser={currentUser}
        />
      );
    }

    if (activeStudentId) {
      return (
        <StudentDetailView
          studentId={activeStudentId}
          outstandingStudents={outstandingStudents}
          onBack={() => setActiveStudentId(null)}
          onSaveOutstandingStudents={handleSaveOutstandingStudents}
          showToast={showToast}
          currentUser={currentUser}
        />
      );
    }

    switch (currentTab) {
      case 'overview':
        return (
          <PortalOverview
            surveys={surveys}
            onSaveSurveys={handleSaveSurveys}
            activities={activities}
            onSaveActivities={handleSaveActivities}
            outstandingClasses={outstandingClasses}
            outstandingStudents={outstandingStudents}
            notifications={notifications}
            currentUser={currentUser}
            onViewClass={handleViewClass}
            onViewStudent={handleViewStudent}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            showToast={showToast}
            accounts={accounts}
            onSaveAccounts={handleSaveAccounts}
            onSaveOutstandingStudents={handleSaveOutstandingStudents}
            onSaveOutstandingClasses={handleSaveOutstandingClasses}
          />
        );

      case 'ai-assistant':
        return (
          <PortalAIAssistant
            currentUser={currentUser}
          />
        );

      case 'course-registration':
        return (
          <PortalCourseRegistration
            currentUser={currentUser}
            registrations={registrations}
            onSaveRegistrations={handleSaveRegistrations}
            showToast={showToast}
          />
        );

      case 'documents':
        return (
          <PortalDocuments
            currentUser={currentUser}
            documents={documents}
            onSaveDocuments={handleSaveDocuments}
            showToast={showToast}
          />
        );

      case 'accounts':
        return (
          <PortalAccountManagement
            currentUser={currentUser}
            accounts={accounts}
            onSaveAccounts={handleSaveAccounts}
            showToast={showToast}
          />
        );

      case 'classes':
        return (
          <PortalClassStructure
            classes={classes}
            onSaveClasses={handleSaveClasses}
            accounts={accounts}
            showToast={showToast}
          />
        );

      case 'assignments':
        return (
          <PortalTeacherAssignment
            assignments={assignments}
            onSaveAssignments={handleSaveAssignments}
            accounts={accounts}
            classes={classes}
            showToast={showToast}
          />
        );

      case 'homework':
        return (
          <PortalHomework
            currentUser={currentUser}
            homeworkList={homeworkList}
            onSaveHomework={handleSaveHomework}
            classes={classes}
            showToast={showToast}
          />
        );

      case 'exams':
        return (
          <PortalExams
            currentUser={currentUser}
            exams={exams}
            onSaveExams={handleSaveExams}
            classes={classes}
            showToast={showToast}
          />
        );

      case 'tests':
        return (
          <PortalStudentTestRoom
            currentUser={currentUser}
            exams={exams}
            submissions={submissions}
            onSaveSubmissions={handleSaveSubmissions}
            showToast={showToast}
          />
        );

      case 'grades':
        return (
          <PortalGradingDesk
            submissions={submissions}
            onSaveSubmissions={handleSaveSubmissions}
            showToast={showToast}
          />
        );

      case 'transcripts':
        return (
          <PortalTranscript
            currentUser={currentUser}
            submissions={submissions}
            classes={classes}
            showToast={showToast}
          />
        );

      case 'contact':
        return (
          <PortalContactBook
            currentUser={currentUser}
            submissions={submissions}
            showToast={showToast}
          />
        );

      case 'export':
        return (
          <PortalExportCenter
            submissions={submissions}
            surveys={surveys}
            assignments={assignments}
            showToast={showToast}
          />
        );

      case 'games':
        return (
          <PortalMiniGameCenter
            showToast={showToast}
          />
        );

      case 'supabase-sync':
        return (
          <PortalSupabaseSync
            accounts={accounts}
            classes={classes}
            assignments={assignments}
            registrations={registrations}
            surveys={surveys}
            exams={exams}
            homeworkList={homeworkList}
            submissions={submissions}
            documents={documents}
            notifications={notifications}
            activities={activities}
            outstandingStudents={outstandingStudents}
            outstandingClasses={outstandingClasses}
            settings={settings}
            showToast={showToast}
          />
        );

      default:
        return (
          <div className="bg-white p-6 rounded-2xl border text-center text-slate-400 font-bold">
            Phân hệ học vụ này đang được cấu trúc và đồng bộ hóa trực tuyến.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Header section with Auth modules & Real-time digital clock */}
      <PortalHeader
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        accounts={accounts}
        onSaveAccounts={handleSaveAccounts}
        settings={settings}
        showToast={showToast}
      />

      {/* Main Grid Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Rail / Sidebar */}
        <div className="lg:col-span-3 md:col-span-12 h-fit">
          <PortalSidebar
            currentUser={currentUser}
            currentTab={currentTab}
            onChangeTab={(tab) => {
              // Map virtual sidebar IDs to matching state-rendering tabs
              const idMapping: Record<string, string> = {
                'subjects': 'assignments',
                'student-test': 'tests',
                'grading': 'grades',
                'reports': 'transcripts',
                'contact-book': 'contact',
                'export-center': 'export',
                'game-center': 'games'
              };
              const mappedTab = idMapping[tab] || tab;
              setCurrentTab(mappedTab);
              setActiveClassId(null);
              setActiveStudentId(null);
            }}
          />
        </div>

        {/* Dynamic central workspace */}
        <div className="lg:col-span-6 md:col-span-12 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClassId || activeStudentId || currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right vertical nav banner - Latest Notifications */}
        <div className="lg:col-span-3 md:col-span-12">
          <PortalRightNavBanner
            notifications={notifications}
            onSaveNotifications={handleSaveNotifications}
            currentUser={currentUser}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Footer / Chân trang */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brandBlue"></span>
            <span>HỆ THỐNG QUẢN TRỊ & HỌC VỤ SỐ HOÁ THCS HÒA PHÚ - PHÂN HỆ V12.15</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
            <div>
              Bản quyền thuộc về <span className="text-brandBlue font-extrabold">thầy giáo Nghiêm Hồng Quân</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 text-brandBlue px-3 py-1.5 rounded-full border border-blue-100">
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>SĐT: <a href="tel:0984839799" className="hover:underline">0984839799</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern, high-contrast Toast Notification banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 max-w-sm"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            
            <p className="text-xs font-semibold leading-relaxed pr-6">{toast.msg}</p>
            
            <button 
              onClick={() => setToast(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
