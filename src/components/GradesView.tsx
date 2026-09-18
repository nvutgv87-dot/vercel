import React, { useState } from 'react';
import { 
  Award, 
  Save, 
  Settings, 
  AlertTriangle, 
  Check, 
  Info, 
  RotateCcw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { StudentItem, ClassItem, GradeConfig } from '../types';
import { computeStudentAverage, determineStudentStatus } from '../services/storage';

interface GradesViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  gradeConfig: GradeConfig;
  onUpdateStudents: (updatedList: StudentItem[]) => void;
  onOpenSettings: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  classes,
  gradeConfig,
  onUpdateStudents,
  onOpenSettings,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '10A1');
  const [localStudents, setLocalStudents] = useState<StudentItem[]>(students);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Cập nhật khi students prop thay đổi từ ngoài
  React.useEffect(() => {
    setLocalStudents(students);
    setHasUnsavedChanges(false);
  }, [students]);

  const classStudents = localStudents.filter((s) => s.classId === selectedClassId);

  // Xử lý thay đổi điểm thường xuyên
  const handleRegularScoreChange = (studentId: string, index: number, valueStr: string) => {
    const val = valueStr === '' ? 0 : parseFloat(valueStr);
    if (isNaN(val) || val < 0 || val > 10) return;

    setLocalStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newReg = [...s.scores.regular];
        newReg[index] = Math.round(val * 10) / 10;
        const newScores = { ...s.scores, regular: newReg };
        const newAvg = computeStudentAverage(newScores, gradeConfig);
        const newStatus = determineStudentStatus(newAvg, s.attendanceRate);
        return {
          ...s,
          scores: newScores,
          averageScore: newAvg,
          status: newStatus,
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  // Xử lý thay đổi điểm Giữa kỳ
  const handleMidtermScoreChange = (studentId: string, valueStr: string) => {
    const val = valueStr === '' ? null : parseFloat(valueStr);
    if (val !== null && (isNaN(val) || val < 0 || val > 10)) return;

    setLocalStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newScores = { ...s.scores, midterm: val !== null ? Math.round(val * 10) / 10 : null };
        const newAvg = computeStudentAverage(newScores, gradeConfig);
        const newStatus = determineStudentStatus(newAvg, s.attendanceRate);
        return {
          ...s,
          scores: newScores,
          averageScore: newAvg,
          status: newStatus,
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  // Xử lý thay đổi điểm Cuối kỳ
  const handleFinalScoreChange = (studentId: string, valueStr: string) => {
    const val = valueStr === '' ? null : parseFloat(valueStr);
    if (val !== null && (isNaN(val) || val < 0 || val > 10)) return;

    setLocalStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newScores = { ...s.scores, finalTerm: val !== null ? Math.round(val * 10) / 10 : null };
        const newAvg = computeStudentAverage(newScores, gradeConfig);
        const newStatus = determineStudentStatus(newAvg, s.attendanceRate);
        return {
          ...s,
          scores: newScores,
          averageScore: newAvg,
          status: newStatus,
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    onUpdateStudents(localStudents);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Bảng Điểm Môn Hóa Học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập và chỉnh sửa điểm trực tiếp trên từng ô. Tự động tính điểm trung bình môn theo công thức minh họa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              title="Xem và chỉnh sửa trọng số hệ số tính điểm"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Cấu hình hệ số
            </button>

            <button
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors ${
                hasUnsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {hasUnsavedChanges ? 'Lưu bảng điểm *' : 'Đã lưu'}
            </button>
          </div>
        </div>

        {/* Lựa chọn lớp & Chú thích công thức */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Chọn lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-bold text-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} ({students.filter(s => s.classId === c.id).length} học sinh)
                </option>
              ))}
            </select>
          </div>

          {/* Hộp thông báo công thức minh họa */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Lưu ý:</strong> {gradeConfig.description} (TX × {gradeConfig.regularWeight}, GK × {gradeConfig.midtermWeight}, CK × {gradeConfig.finalWeight}).
            </span>
          </div>
        </div>
      </div>

      {/* Bảng điểm chi tiết */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[200px]">Họ và tên</th>
                <th className="py-3 px-3 text-center min-w-[90px]">TX 1</th>
                <th className="py-3 px-3 text-center min-w-[90px]">TX 2</th>
                <th className="py-3 px-3 text-center min-w-[90px]">TX 3</th>
                <th className="py-3 px-3 text-center min-w-[100px] bg-blue-50/50 text-blue-900">
                  Giữa kỳ (HS{gradeConfig.midtermWeight})
                </th>
                <th className="py-3 px-3 text-center min-w-[100px] bg-indigo-50/50 text-indigo-900">
                  Cuối kỳ (HS{gradeConfig.finalWeight})
                </th>
                <th className="py-3 px-4 text-center min-w-[100px] bg-slate-100/70 font-bold">
                  Điểm TB
                </th>
                <th className="py-3 px-4 min-w-[110px] text-center">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Chưa có học sinh nào trong lớp {selectedClassId}.
                  </td>
                </tr>
              ) : (
                classStudents.map((s, idx) => {
                  const isLowScore = s.averageScore < 5.0;
                  const isModerate = s.averageScore >= 5.0 && s.averageScore < 6.5;

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isLowScore ? 'bg-rose-50/20' : isModerate ? 'bg-amber-50/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {s.gender} • Chuyên cần: {s.attendanceRate}%
                        </div>
                      </td>

                      {/* TX 1 */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={s.scores.regular[0] ?? ''}
                          onChange={(e) => handleRegularScoreChange(s.id, 0, e.target.value)}
                          className="w-16 py-1.5 px-2 text-center border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>

                      {/* TX 2 */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={s.scores.regular[1] ?? ''}
                          onChange={(e) => handleRegularScoreChange(s.id, 1, e.target.value)}
                          className="w-16 py-1.5 px-2 text-center border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>

                      {/* TX 3 */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={s.scores.regular[2] ?? ''}
                          onChange={(e) => handleRegularScoreChange(s.id, 2, e.target.value)}
                          className="w-16 py-1.5 px-2 text-center border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>

                      {/* Giữa kỳ */}
                      <td className="py-2.5 px-2 text-center bg-blue-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={s.scores.midterm ?? ''}
                          onChange={(e) => handleMidtermScoreChange(s.id, e.target.value)}
                          className="w-16 py-1.5 px-2 text-center border border-blue-200 rounded-lg text-xs font-bold text-blue-700 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </td>

                      {/* Cuối kỳ */}
                      <td className="py-2.5 px-2 text-center bg-indigo-50/20">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={s.scores.finalTerm ?? ''}
                          onChange={(e) => handleFinalScoreChange(s.id, e.target.value)}
                          className="w-16 py-1.5 px-2 text-center border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>

                      {/* ĐTB */}
                      <td className="py-2.5 px-4 text-center bg-slate-50/50">
                        <span
                          className={`font-black text-sm px-2.5 py-1 rounded-md ${
                            isLowScore
                              ? 'bg-rose-100 text-rose-700'
                              : s.averageScore >= 8.0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {s.averageScore.toFixed(1)}
                        </span>
                      </td>

                      {/* Đánh giá */}
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            s.status === 'Tốt'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : s.status === 'Cần chú ý'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer bảng điểm */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Màu đỏ cảnh báo học sinh có ĐTB &lt; 5.0 hoặc nề nếp cần theo dõi</span>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Có thay đổi chưa lưu
              </span>
            )}
            <button
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-2 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                hasUnsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              Lưu điểm số vào hệ thống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
