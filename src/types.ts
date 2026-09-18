export type TabType = 
  | 'dashboard' 
  | 'classes' 
  | 'students' 
  | 'attendance' 
  | 'grades' 
  | 'assignments' 
  | 'teaching_plan' 
  | 'statistics';

export type StudentStatus = 'Tốt' | 'Ổn định' | 'Cần chú ý';

export interface TeacherProfile {
  name: string;
  title: string; // e.g. "Giáo viên Hóa học"
  subject: string;
  school: string;
  academicYear: string;
  semester: string;
  avatarText?: string;
}

export interface ClassItem {
  id: string; // e.g. "10A1"
  name: string;
  grade: number; // 10, 11, 12
  room: string;
  studentCount: number;
  progress: number; // e.g. 65%
  currentTopic: string;
  schedule: string; // e.g. "Thứ 2 (tiết 1-2), Thứ 5 (tiết 3)"
  notes?: string;
}

export interface StudentScore {
  regular: number[]; // Điểm thường xuyên (hệ số 1)
  midterm: number | null; // Điểm giữa kỳ (hệ số 2)
  finalTerm: number | null; // Điểm cuối kỳ (hệ số 3)
}

export interface StudentItem {
  id: string;
  stt: number;
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  classId: string;
  attendanceRate: number; // %
  absentCount: number;
  lateCount: number;
  scores: StudentScore;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  status: StudentStatus;
  note: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  records: Record<string, AttendanceStatus>; // studentId -> status
  note?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  classId: string; // classId or "all"
  assignedDate: string;
  dueDate: string;
  content: string;
  completedCount: number;
  totalCount: number;
  status: 'Đang giao' | 'Đã kết thúc' | 'Đã chấm xong';
  type: 'Lý thuyết' | 'Bài tập trắc nghiệm' | 'Thí nghiệm - Thực hành' | 'Chuyên đề';
  notes?: string;
}

export interface TeachingPlanItem {
  id: string;
  week: number;
  classId: string;
  topic: string;
  periods: number; // Số tiết
  objectives: string; // Mục tiêu bài dạy
  status: 'Chưa dạy' | 'Đang thực hiện' | 'Hoàn thành';
  dateRange: string;
  notes?: string;
}

export interface GradeConfig {
  regularWeight: number;
  midtermWeight: number;
  finalWeight: number;
  description: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
