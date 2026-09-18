import { 
  TeacherProfile, 
  ClassItem, 
  StudentItem, 
  AssignmentItem, 
  TeachingPlanItem, 
  AttendanceRecord, 
  GradeConfig 
} from '../types';
import { 
  INITIAL_TEACHER, 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_TEACHING_PLAN, 
  INITIAL_ATTENDANCE, 
  INITIAL_GRADE_CONFIG 
} from '../data/initialData';

const KEYS = {
  TEACHER: 'qllh_chem_teacher_v1',
  CLASSES: 'qllh_chem_classes_v1',
  STUDENTS: 'qllh_chem_students_v1',
  ASSIGNMENTS: 'qllh_chem_assignments_v1',
  TEACHING_PLAN: 'qllh_chem_plan_v1',
  ATTENDANCE: 'qllh_chem_attendance_v1',
  GRADE_CONFIG: 'qllh_chem_grade_config_v1',
  SOUND: 'qllh_chem_sound_v1',
};

export function getStoredTeacher(): TeacherProfile {
  try {
    const data = localStorage.getItem(KEYS.TEACHER);
    return data ? JSON.parse(data) : INITIAL_TEACHER;
  } catch {
    return INITIAL_TEACHER;
  }
}

export function saveStoredTeacher(teacher: TeacherProfile): void {
  localStorage.setItem(KEYS.TEACHER, JSON.stringify(teacher));
}

export function getStoredClasses(): ClassItem[] {
  try {
    const data = localStorage.getItem(KEYS.CLASSES);
    return data ? JSON.parse(data) : INITIAL_CLASSES;
  } catch {
    return INITIAL_CLASSES;
  }
}

export function saveStoredClasses(classes: ClassItem[]): void {
  localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
}

export function getStoredStudents(): StudentItem[] {
  try {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: StudentItem[]): void {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
}

export function getStoredAssignments(): AssignmentItem[] {
  try {
    const data = localStorage.getItem(KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
}

export function saveStoredAssignments(assignments: AssignmentItem[]): void {
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

export function getStoredTeachingPlan(): TeachingPlanItem[] {
  try {
    const data = localStorage.getItem(KEYS.TEACHING_PLAN);
    return data ? JSON.parse(data) : INITIAL_TEACHING_PLAN;
  } catch {
    return INITIAL_TEACHING_PLAN;
  }
}

export function saveStoredTeachingPlan(plan: TeachingPlanItem[]): void {
  localStorage.setItem(KEYS.TEACHING_PLAN, JSON.stringify(plan));
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    const data = localStorage.getItem(KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
  } catch {
    return INITIAL_ATTENDANCE;
  }
}

export function saveStoredAttendance(records: AttendanceRecord[]): void {
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
}

export function getStoredGradeConfig(): GradeConfig {
  try {
    const data = localStorage.getItem(KEYS.GRADE_CONFIG);
    return data ? JSON.parse(data) : INITIAL_GRADE_CONFIG;
  } catch {
    return INITIAL_GRADE_CONFIG;
  }
}

export function saveStoredGradeConfig(config: GradeConfig): void {
  localStorage.setItem(KEYS.GRADE_CONFIG, JSON.stringify(config));
}

export function getStoredSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem(KEYS.SOUND);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function saveStoredSoundEnabled(enabled: boolean): void {
  localStorage.setItem(KEYS.SOUND, String(enabled));
}

/**
 * Khôi phục toàn bộ dữ liệu về trạng thái mẫu ban đầu
 */
export function resetAllDataToDemo(): void {
  localStorage.setItem(KEYS.TEACHER, JSON.stringify(INITIAL_TEACHER));
  localStorage.setItem(KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
  localStorage.setItem(KEYS.TEACHING_PLAN, JSON.stringify(INITIAL_TEACHING_PLAN));
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  localStorage.setItem(KEYS.GRADE_CONFIG, JSON.stringify(INITIAL_GRADE_CONFIG));
}

/**
 * Tính điểm trung bình minh họa dựa trên công thức giáo viên cấu hình
 */
export function computeStudentAverage(scores: StudentItem['scores'], config: GradeConfig): number {
  const regScores = scores.regular.filter(s => typeof s === 'number' && !isNaN(s));
  const sumReg = regScores.reduce((acc, val) => acc + val, 0);
  const countReg = regScores.length;

  let totalPoints = sumReg * config.regularWeight;
  let totalWeight = countReg * config.regularWeight;

  if (scores.midterm !== null && !isNaN(scores.midterm)) {
    totalPoints += scores.midterm * config.midtermWeight;
    totalWeight += config.midtermWeight;
  }

  if (scores.finalTerm !== null && !isNaN(scores.finalTerm)) {
    totalPoints += scores.finalTerm * config.finalWeight;
    totalWeight += config.finalWeight;
  }

  if (totalWeight === 0) return 0;
  return Math.round((totalPoints / totalWeight) * 10) / 10;
}

/**
 * Xác định trạng thái học tập tự động dựa trên điểm số và chuyên cần
 */
export function determineStudentStatus(avgScore: number, attendanceRate: number): 'Tốt' | 'Ổn định' | 'Cần chú ý' {
  if (avgScore < 5.0 || attendanceRate < 92) {
    return 'Cần chú ý';
  }
  if (avgScore >= 8.0 && attendanceRate >= 96) {
    return 'Tốt';
  }
  return 'Ổn định';
}
