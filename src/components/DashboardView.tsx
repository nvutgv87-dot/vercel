import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpenCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  FlaskConical,
  Award
} from 'lucide-react';
import { TeacherProfile, ClassItem, StudentItem, AssignmentItem, TeachingPlanItem, TabType } from '../types';

interface DashboardViewProps {
  teacher: TeacherProfile;
  classes: ClassItem[];
  students: StudentItem[];
  assignments: AssignmentItem[];
  plans: TeachingPlanItem[];
  onNavigate: (tab: TabType) => void;
  onSelectClassForDetails?: (classId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  teacher,
  classes,
  students,
  assignments,
  plans,
  onNavigate,
}) => {
  // Thống kê nhanh
  const activeAssignments = assignments.filter((a) => a.status === 'Đang giao');
  const attentionStudents = students.filter((s) => s.status === 'Cần chú ý');
  const goodStudents = students.filter((s) => s.status === 'Tốt');
  const stableStudents = students.filter((s) => s.status === 'Ổn định');

  // Tổng số học sinh tính theo sĩ số thực tế của các lớp
  const totalEnrolled = classes.reduce((sum, c) => sum + c.studentCount, 0);

  // Phân bố học lực
  const totalStudentsCount = students.length || 1;
  const pctGood = Math.round((goodStudents.length / totalStudentsCount) * 100);
  const pctStable = Math.round((stableStudents.length / totalStudentsCount) * 100);
  const pctAttention = Math.round((attentionStudents.length / totalStudentsCount) * 100);

  // Tỷ lệ hoàn thành bài tập tổng quan
  const totalAssignExpected = assignments.reduce((acc, a) => acc + a.totalCount, 0) || 1;
  const totalAssignCompleted = assignments.reduce((acc, a) => acc + a.completedCount, 0);
  const completionRate = Math.round((totalAssignCompleted / totalAssignExpected) * 100);

  return (
    <div className="space-y-6">
      {/* Banner Lời chào & Bối cảnh giảng dạy */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-3 border border-white/10">
            <FlaskConical className="w-3.5 h-3.5 text-blue-300" />
            <span>Năm học {teacher.academicYear} • {teacher.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, thầy {teacher.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Tổng quan hoạt động giảng dạy môn {teacher.subject} — Trường {teacher.school}. Theo dõi sĩ số, chuyên cần, kết quả học tập và bài tập của các lớp.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              Điểm danh hôm nay
            </button>
            <button
              onClick={() => onNavigate('grades')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/60 hover:bg-blue-600 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              <Award className="w-4 h-4" />
              Bảng điểm định kỳ
            </button>
          </div>
        </div>

        {/* Trang trí background hình học nhẹ */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <FlaskConical className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* 4 Thẻ thống kê cốt lõi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Số lớp đang dạy */}
        <div 
          onClick={() => onNavigate('classes')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số lớp đang dạy</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {classes.length} <span className="text-sm font-normal text-slate-500">lớp</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-blue-600 font-medium">Khối 10, 11, 12</span>
              <span>•</span>
              <span>Đang hoạt động</span>
            </div>
          </div>
        </div>

        {/* Tổng số học sinh */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số học sinh</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalEnrolled} <span className="text-sm font-normal text-slate-500">em</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{pctGood}% Tốt</span>
              <span>•</span>
              <span>{students.length} hồ sơ theo dõi</span>
            </div>
          </div>
        </div>

        {/* Bài tập đang giao */}
        <div 
          onClick={() => onNavigate('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bài tập đang giao</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeAssignments.length} <span className="text-sm font-normal text-slate-500">bài</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-blue-600 font-medium">{completionRate}% nộp bài</span>
              <span>•</span>
              <span>Đang mở</span>
            </div>
          </div>
        </div>

        {/* Học sinh cần chú ý */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group bg-linear-to-b from-white to-rose-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Học sinh cần chú ý</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
              {attentionStudents.length} <span className="text-sm font-normal text-slate-500">em</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-600/90 font-medium">
              <span>Cần hỗ trợ học tập & nề nếp</span>
            </div>
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ TRỰC QUAN ĐƠN GIẢN, DỄ ĐỌC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ 1: Phân bố kết quả học tập */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Phân bố kết quả học tập</h3>
              <span className="text-xs text-slate-400">Dựa trên ĐTB</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Tỷ lệ học lực theo tiêu chuẩn xếp loại của lớp giảng dạy.
            </p>

            {/* Thanh bar phân bố trực quan */}
            <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner mb-4">
              <div style={{ width: `${pctGood}%` }} className="bg-emerald-500 hover:opacity-90 transition-all" title={`Tốt: ${pctGood}%`} />
              <div style={{ width: `${pctStable}%` }} className="bg-blue-500 hover:opacity-90 transition-all" title={`Ổn định: ${pctStable}%`} />
              <div style={{ width: `${pctAttention}%` }} className="bg-rose-500 hover:opacity-90 transition-all" title={`Cần chú ý: ${pctAttention}%`} />
            </div>

            {/* Chú thích chi tiết */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-700">Tốt (ĐTB ≥ 8.0)</span>
                </div>
                <span className="font-bold text-slate-900">{goodStudents.length} em ({pctGood}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700">Ổn định (6.5 - 7.9)</span>
                </div>
                <span className="font-bold text-slate-900">{stableStudents.length} em ({pctStable}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="font-medium text-slate-700">Cần chú ý (&lt; 6.5 hoặc vắng)</span>
                </div>
                <span className="font-bold text-rose-600">{attentionStudents.length} em ({pctAttention}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ 2: Tỷ lệ hoàn thành bài tập */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Tỷ lệ hoàn thành bài tập</h3>
              <span className="text-xs font-semibold text-blue-600">{completionRate}% Tổng thể</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Theo dõi tiến độ nộp bài của từng bài tập đang triển khai.
            </p>

            <div className="space-y-3">
              {assignments.slice(0, 4).map((a) => {
                const rate = Math.round((a.completedCount / (a.totalCount || 1)) * 100);
                return (
                  <div key={a.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[190px]" title={a.title}>
                        {a.title} ({a.classId})
                      </span>
                      <span className="font-semibold text-slate-800">{rate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          rate >= 90 ? 'bg-emerald-500' : rate >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                        }`} 
                        style={{ width: `${rate}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('assignments')}
            className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start"
          >
            Xem tất cả bài tập <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Biểu đồ 3: Chuyên cần theo lớp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Chuyên cần theo lớp</h3>
              <span className="text-xs text-slate-400">Tháng hiện tại</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Tỷ lệ đi học đầy đủ và đúng giờ của từng khối lớp.
            </p>

            <div className="space-y-3">
              {classes.map((c) => {
                // Tính trung bình chuyên cần cho học sinh lớp này (nếu có dữ liệu) hoặc lấy mặc định 95-98%
                const classStudents = students.filter(s => s.classId === c.id);
                const avgAtt = classStudents.length > 0 
                  ? Math.round(classStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / classStudents.length)
                  : 96;

                return (
                  <div key={c.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Lớp {c.name}</div>
                      <div className="text-[11px] text-slate-500">Sĩ số: {c.studentCount} học sinh</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                        avgAtt >= 96 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {avgAtt}% Chuyên cần
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start"
          >
            Xem sổ điểm danh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 KHU VỰC CHI TIẾT THEO YÊU CẦU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Lịch dạy / công việc gần đây */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Lịch dạy & Công việc gần đây</h3>
            </div>
            <button
              onClick={() => onNavigate('teaching_plan')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Kế hoạch dạy
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {classes.map((c) => (
              <div key={c.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                      Lớp {c.name}
                    </span>
                    <span className="text-xs font-medium text-slate-700">{c.room}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {c.currentTopic}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {c.schedule}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">{c.progress}%</span>
                  <div className="text-[10px] text-slate-400">tiến độ</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Bài tập sắp đến hạn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bài tập sắp đến hạn</h3>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Quản lý bài tập
            </button>
          </div>

          <div className="space-y-2.5">
            {assignments.filter(a => a.status === 'Đang giao').slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-xl border border-slate-200/70 hover:border-blue-200 transition-colors bg-slate-50/40">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                    {a.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex-shrink-0">
                    Hạn: {a.dueDate}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Lớp: <strong className="text-slate-700">{a.classId}</strong></span>
                  <span>Đã nộp: <strong className="text-slate-800">{a.completedCount}/{a.totalCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Hoạt động giảng dạy & bài học gần đây */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hoạt động chương trình gần đây</h3>
            </div>
            <button
              onClick={() => onNavigate('teaching_plan')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem chi tiết
            </button>
          </div>

          <div className="space-y-3">
            {plans.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5">
                  {p.status === 'Hoàn thành' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Tuần {p.week} - {p.classId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{p.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Học sinh cần chú ý */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs bg-linear-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Danh sách học sinh cần chú ý</h3>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Xem tất cả ({attentionStudents.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {attentionStudents.slice(0, 4).map((s) => (
              <div key={s.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{s.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {s.classId}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600 truncate mt-0.5">
                    {s.note || 'Cần theo dõi thêm về điểm số và chuyên cần'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    ĐTB: {s.averageScore}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Chuyên cần: {s.attendanceRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
