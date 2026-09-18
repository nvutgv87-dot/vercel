import React, { useState, useEffect } from 'react';
import { TabType, TeacherProfile, ClassItem, StudentItem, AssignmentItem, TeachingPlanItem, AttendanceRecord, GradeConfig, AppNotification } from './types';
import { 
  getStoredTeacher, 
  saveStoredTeacher, 
  getStoredClasses, 
  saveStoredClasses, 
  getStoredStudents, 
  saveStoredStudents, 
  getStoredAssignments, 
  saveStoredAssignments, 
  getStoredTeachingPlan, 
  saveStoredTeachingPlan, 
  getStoredAttendance, 
  saveStoredAttendance, 
  getStoredGradeConfig, 
  saveStoredGradeConfig, 
  getStoredSoundEnabled, 
  saveStoredSoundEnabled,
  resetAllDataToDemo 
} from './services/storage';
import { exportToSingleHtmlFile } from './services/exportHtml';
import { playSoftChime } from './utils/audio';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { GradesView } from './components/GradesView';
import { AssignmentsView } from './components/AssignmentsView';
import { TeachingPlanView } from './components/TeachingPlanView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter pass-through from Classes to Students
  const [studentViewClassFilter, setStudentViewClassFilter] = useState<string>('all');

  // App Data States
  const [teacher, setTeacher] = useState<TeacherProfile>(getStoredTeacher);
  const [classes, setClasses] = useState<ClassItem[]>(getStoredClasses);
  const [students, setStudents] = useState<StudentItem[]>(getStoredStudents);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(getStoredAssignments);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlanItem[]>(getStoredTeachingPlan);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(getStoredAttendance);
  const [gradeConfig, setGradeConfig] = useState<GradeConfig>(getStoredGradeConfig);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(getStoredSoundEnabled);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = (message: string, type: AppNotification['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setNotifications((prev) => [...prev, { id, message, type }]);
    playSoftChime(soundEnabled);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Toggle âm thanh
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveStoredSoundEnabled(next);
    if (next) playSoftChime(true);
    showToast(next ? 'Đã BẬT âm thanh thông báo nhẹ' : 'Đã TẮT âm thanh thông báo', 'info');
  };

  // Cập nhật thông tin giáo viên & hệ số điểm
  const handleSaveTeacher = (updated: TeacherProfile) => {
    setTeacher(updated);
    saveStoredTeacher(updated);
    showToast('Đã lưu thông tin giáo viên thành công!');
  };

  const handleSaveGradeConfig = (updated: GradeConfig) => {
    setGradeConfig(updated);
    saveStoredGradeConfig(updated);
    showToast('Đã cập nhật công thức tính điểm!');
  };

  // Thao tác Lớp học (CRUD)
  const handleAddClass = (cls: ClassItem) => {
    const next = [...classes, cls];
    setClasses(next);
    saveStoredClasses(next);
    showToast(`Đã thêm lớp ${cls.name} thành công!`);
  };

  const handleUpdateClass = (cls: ClassItem) => {
    const next = classes.map((c) => (c.id === cls.id ? cls : c));
    setClasses(next);
    saveStoredClasses(next);
    showToast(`Đã cập nhật thông tin lớp ${cls.name}!`);
  };

  const handleDeleteClass = (id: string) => {
    const target = classes.find((c) => c.id === id);
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa lớp học',
      message: `Bạn có chắc chắn muốn xóa lớp ${target?.name || id} không? Học sinh thuộc lớp này cũng sẽ bị ảnh hưởng.`,
      confirmText: 'Xóa lớp',
      variant: 'danger',
      onConfirm: () => {
        const next = classes.filter((c) => c.id !== id);
        setClasses(next);
        saveStoredClasses(next);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        showToast(`Đã xóa lớp ${target?.name || id} thành công!`, 'info');
      },
    });
  };

  // Thao tác Học sinh (CRUD)
  const handleAddStudent = (student: StudentItem) => {
    const next = [...students, student];
    setStudents(next);
    saveStoredStudents(next);
    showToast(`Đã thêm học sinh ${student.name} vào lớp ${student.classId}!`);
  };

  const handleImportExcel = (
    importedStudents: StudentItem[],
    mode: 'append' | 'replace',
    targetClassId: string
  ) => {
    let next: StudentItem[];
    if (mode === 'replace') {
      const otherStudents = students.filter((s) => s.classId !== targetClassId);
      next = [...otherStudents, ...importedStudents];
    } else {
      next = [...students, ...importedStudents];
    }
    next = next.map((s, idx) => ({ ...s, stt: idx + 1 }));

    // Cập nhật lại sĩ số lớp học cho đồng bộ
    const updatedClassCount = next.filter((s) => s.classId === targetClassId).length;
    const nextClasses = classes.map((c) =>
      c.id === targetClassId ? { ...c, studentCount: updatedClassCount } : c
    );
    setClasses(nextClasses);
    saveStoredClasses(nextClasses);

    setStudents(next);
    saveStoredStudents(next);
    showToast(`Đã nhập thành công ${importedStudents.length} học sinh vào lớp ${targetClassId}!`);
  };

  const handleUpdateStudent = (student: StudentItem) => {
    const next = students.map((s) => (s.id === student.id ? student : s));
    setStudents(next);
    saveStoredStudents(next);
    showToast(`Đã cập nhật học sinh ${student.name}!`);
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa học sinh',
      message: `Bạn có chắc chắn muốn xóa học sinh ${target?.name || ''} khỏi danh sách không? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa học sinh',
      variant: 'danger',
      onConfirm: () => {
        const next = students.filter((s) => s.id !== id);
        setStudents(next);
        saveStoredStudents(next);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        showToast(`Đã xóa học sinh khỏi hệ thống!`, 'info');
      },
    });
  };

  const handleUpdateAllStudents = (updatedList: StudentItem[]) => {
    setStudents(updatedList);
    saveStoredStudents(updatedList);
    showToast('Đã lưu toàn bộ điểm số học sinh thành công!');
  };

  // Thao tác Bài tập (CRUD)
  const handleAddAssignment = (item: AssignmentItem) => {
    const next = [item, ...assignments];
    setAssignments(next);
    saveStoredAssignments(next);
    showToast(`Đã giao bài tập mới cho lớp ${item.classId}!`);
  };

  const handleUpdateAssignment = (item: AssignmentItem) => {
    const next = assignments.map((a) => (a.id === item.id ? item : a));
    setAssignments(next);
    saveStoredAssignments(next);
    showToast('Đã cập nhật thông tin bài tập!');
  };

  const handleDeleteAssignment = (id: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa bài tập',
      message: 'Bạn có chắc chắn muốn xóa bài tập này không?',
      confirmText: 'Xóa bài tập',
      variant: 'danger',
      onConfirm: () => {
        const next = assignments.filter((a) => a.id !== id);
        setAssignments(next);
        saveStoredAssignments(next);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        showToast('Đã xóa bài tập!', 'info');
      },
    });
  };

  const handleToggleAssignmentStatus = (id: string) => {
    const next = assignments.map((a) => {
      if (a.id !== id) return a;
      const nextStatus = a.status === 'Đã chấm xong' ? 'Đang giao' : 'Đã chấm xong';
      return { ...a, status: nextStatus as AssignmentItem['status'] };
    });
    setAssignments(next);
    saveStoredAssignments(next);
    showToast('Đã thay đổi trạng thái bài tập!');
  };

  // Thao tác Kế hoạch giảng dạy (CRUD)
  const handleAddPlan = (plan: TeachingPlanItem) => {
    const next = [...teachingPlans, plan];
    setTeachingPlans(next);
    saveStoredTeachingPlan(next);
    showToast(`Đã thêm bài học vào Tuần ${plan.week}!`);
  };

  const handleUpdatePlan = (plan: TeachingPlanItem) => {
    const next = teachingPlans.map((p) => (p.id === plan.id ? plan : p));
    setTeachingPlans(next);
    saveStoredTeachingPlan(next);
    showToast(`Đã cập nhật bài học Tuần ${plan.week}!`);
  };

  const handleDeletePlan = (id: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa kế hoạch bài dạy',
      message: 'Bạn có chắc chắn muốn xóa mục kế hoạch bài giảng này không?',
      confirmText: 'Xóa bài dạy',
      variant: 'danger',
      onConfirm: () => {
        const next = teachingPlans.filter((p) => p.id !== id);
        setTeachingPlans(next);
        saveStoredTeachingPlan(next);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        showToast('Đã xóa kế hoạch bài dạy!', 'info');
      },
    });
  };

  // Điểm danh
  const handleSaveAttendance = (record: AttendanceRecord) => {
    const existingIndex = attendanceRecords.findIndex((r) => r.id === record.id);
    let next: AttendanceRecord[];
    if (existingIndex >= 0) {
      next = [...attendanceRecords];
      next[existingIndex] = record;
    } else {
      next = [record, ...attendanceRecords];
    }
    setAttendanceRecords(next);
    saveStoredAttendance(next);
    showToast(`Đã lưu điểm danh lớp ${record.classId} ngày ${record.date}!`);
  };

  // Khôi phục dữ liệu mẫu
  const handleOpenResetConfirm = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Khôi phục dữ liệu demo mẫu',
      message: 'Toàn bộ dữ liệu bạn đã nhập thêm hoặc chỉnh sửa sẽ được đặt lại về trạng thái mẫu ban đầu của thầy Nguyễn Văn Út. Bạn có chắc chắn muốn tiếp tục?',
      confirmText: 'Khôi phục dữ liệu demo',
      variant: 'warning',
      onConfirm: () => {
        resetAllDataToDemo();
        setTeacher(getStoredTeacher());
        setClasses(getStoredClasses());
        setStudents(getStoredStudents());
        setAssignments(getStoredAssignments());
        setTeachingPlans(getStoredTeachingPlan());
        setAttendanceRecords(getStoredAttendance());
        setGradeConfig(getStoredGradeConfig());
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        showToast('Đã khôi phục dữ liệu demo ban đầu thành công!', 'info');
      },
    });
  };

  // Xuất file HTML đơn độc lập
  const handleExportHtml = () => {
    exportToSingleHtmlFile({
      teacher,
      classes,
      students,
      assignments,
      plans: teachingPlans,
      attendance: attendanceRecords,
      gradeConfig,
    });
    showToast('Đã xuất và tải về file HTML đơn chạy ngoại tuyến!');
  };

  // Tiêu đề tab hiện tại
  const tabTitles: Record<TabType, string> = {
    dashboard: 'Tổng quan Hoạt động Giảng dạy',
    classes: 'Quản lý Lớp học',
    students: 'Quản lý Danh sách Học sinh',
    attendance: 'Sổ Điểm danh & Chuyên cần',
    grades: 'Quản lý Điểm số & Đánh giá',
    assignments: 'Quản lý Giao bài & Chấm bài tập',
    teaching_plan: 'Kế hoạch Giảng dạy & Phân phối chương trình',
    statistics: 'Thống kê & Báo cáo Chất lượng',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        teacher={teacher}
        onOpenSettings={() => setIsSettingsOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          teacher={teacher}
          activeTabTitle={tabTitles[activeTab]}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportHtml={handleExportHtml}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Nội dung chính các tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              teacher={teacher}
              classes={classes}
              students={students}
              assignments={assignments}
              plans={teachingPlans}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'classes' && (
            <ClassesView
              classes={classes}
              teacher={teacher}
              students={students}
              assignments={assignments}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onViewClassStudents={(classId) => {
                setStudentViewClassFilter(classId);
                setActiveTab('students');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              classes={classes}
              selectedClassFilter={studentViewClassFilter}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onImportExcel={handleImportExcel}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classes}
              attendanceRecords={attendanceRecords}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'grades' && (
            <GradesView
              students={students}
              classes={classes}
              gradeConfig={gradeConfig}
              onUpdateStudents={handleUpdateAllStudents}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              classes={classes}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onToggleAssignmentStatus={handleToggleAssignmentStatus}
            />
          )}

          {activeTab === 'teaching_plan' && (
            <TeachingPlanView
              plans={teachingPlans}
              classes={classes}
              onAddPlan={handleAddPlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              students={students}
              classes={classes}
              assignments={assignments}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        teacher={teacher}
        onSaveTeacher={handleSaveTeacher}
        gradeConfig={gradeConfig}
        onSaveGradeConfig={handleSaveGradeConfig}
        onExportHtml={handleExportHtml}
        onOpenResetConfirm={handleOpenResetConfirm}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmText={confirmModalState.confirmText}
        variant={confirmModalState.variant}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
