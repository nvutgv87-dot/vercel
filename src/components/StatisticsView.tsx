import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  BookOpenCheck, 
  AlertTriangle, 
  Award,
  Filter,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { StudentItem, ClassItem, AssignmentItem } from '../types';

interface StatisticsViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  assignments: AssignmentItem[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  students,
  classes,
  assignments,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Lọc học sinh và bài tập theo lớp chọn
  const activeStudents = selectedClassId === 'all' 
    ? students 
    : students.filter((s) => s.classId === selectedClassId);

  const activeAssignments = selectedClassId === 'all'
    ? assignments
    : assignments.filter((a) => a.classId === selectedClassId || a.classId === 'all');

  // Thống kê phân loại học lực
  const totalCount = activeStudents.length || 1;
  const goodCount = activeStudents.filter((s) => s.status === 'Tốt').length;
  const stableCount = activeStudents.filter((s) => s.status === 'Ổn định').length;
  const attentionCount = activeStudents.filter((s) => s.status === 'Cần chú ý').length;

  const pctGood = Math.round((goodCount / totalCount) * 100);
  const pctStable = Math.round((stableCount / totalCount) * 100);
  const pctAttention = Math.round((attentionCount / totalCount) * 100);

  // Điểm trung bình toàn khối / lớp
  const avgClassScore = activeStudents.length > 0
    ? Math.round((activeStudents.reduce((acc, s) => acc + s.averageScore, 0) / activeStudents.length) * 10) / 10
    : 0;

  // Chuyên cần trung bình
  const avgAttendance = activeStudents.length > 0
    ? Math.round(activeStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / activeStudents.length)
    : 0;

  // Bài tập hoàn thành
  const totalSubmissions = activeAssignments.reduce((acc, a) => acc + a.completedCount, 0);
  const totalExpected = activeAssignments.reduce((acc, a) => acc + a.totalCount, 0) || 1;
  const assignRate = Math.round((totalSubmissions / totalExpected) * 100);

  return (
    <div className="space-y-6">
      {/* Header filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Báo Cáo & Thống Kê Giảng Dạy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tích trực quan chất lượng học tập, nề nếp chuyên cần và tỷ lệ làm bài tập môn Hóa học.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Xem theo lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-bold text-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Toàn bộ các lớp ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Điểm TB Môn</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">{avgClassScore} / 10</div>
          <div className="text-xs text-slate-500 mt-1">Đánh giá chung toàn bộ học sinh</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tỷ lệ chuyên cần</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{avgAttendance}%</div>
          <div className="text-xs text-slate-500 mt-1">Đi học đúng giờ và đủ tiết</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tỷ lệ nộp bài tập</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">{assignRate}%</div>
          <div className="text-xs text-slate-500 mt-1">{totalSubmissions} / {totalExpected} lượt nộp</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase">Học sinh cần chú ý</span>
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{attentionCount} em</div>
          <div className="text-xs text-rose-600/80 mt-1">Chiếm {pctAttention}% danh sách lớp</div>
        </div>
      </div>

      {/* Biểu đồ phân bố và so sánh các lớp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Phân loại học lực */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Phân bố kết quả xếp loại học tập
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Dữ liệu theo {selectedClassId === 'all' ? 'toàn bộ các lớp' : `lớp ${selectedClassId}`} ({activeStudents.length} học sinh)
          </p>

          {/* Biểu đồ cột ngang */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Xếp loại Tốt (ĐTB ≥ 8.0)
                </span>
                <span className="text-slate-800">{goodCount} em ({pctGood}%)</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctGood}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-blue-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Xếp loại Ổn định (6.5 - 7.9)
                </span>
                <span className="text-slate-800">{stableCount} em ({pctStable}%)</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pctStable}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-rose-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Cần chú ý (&lt; 6.5 hoặc vắng nhiều)
                </span>
                <span className="text-slate-800">{attentionCount} em ({pctAttention}%)</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pctAttention}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
            <strong>Nhận xét:</strong> {pctGood >= 50 ? 'Lớp có kết quả tiếp thu kiến thức Hóa học tốt, nắm vững lý thuyết và bài tập.' : 'Cần tăng cường rèn luyện phương pháp giải bài tập định lượng và giải thích hiện tượng thí nghiệm.'}
          </div>
        </div>

        {/* Card 2: Bảng so sánh giữa các lớp */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Bảng tổng hợp chất lượng theo từng lớp
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            So sánh điểm trung bình, chuyên cần và tiến độ giữa các lớp phụ trách.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3">Sĩ số</th>
                  <th className="py-2.5 px-3 text-center">ĐTB Lớp</th>
                  <th className="py-2.5 px-3 text-center">Chuyên cần</th>
                  <th className="py-2.5 px-3 text-center">Tiến độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => {
                  const clsStudents = students.filter((s) => s.classId === c.id);
                  const clsAvg = clsStudents.length > 0
                    ? Math.round((clsStudents.reduce((acc, s) => acc + s.averageScore, 0) / clsStudents.length) * 10) / 10
                    : 0;
                  const clsAtt = clsStudents.length > 0
                    ? Math.round(clsStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / clsStudents.length)
                    : 96;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-bold text-blue-700">Lớp {c.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.studentCount} HS</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-slate-800">
                        {clsAvg > 0 ? clsAvg.toFixed(1) : '--'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          {clsAtt}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-semibold text-blue-600">{c.progress}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
