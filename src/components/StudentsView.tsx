import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  GraduationCap, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Award,
  Download
} from 'lucide-react';
import { StudentItem, ClassItem, StudentStatus } from '../types';
import { ExcelImportModal } from './ExcelImportModal';
import { exportStudentsToExcel } from '../services/excelService';

interface StudentsViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  selectedClassFilter?: string;
  onAddStudent: (student: StudentItem) => void;
  onUpdateStudent: (student: StudentItem) => void;
  onDeleteStudent: (id: string) => void;
  onImportExcel?: (importedStudents: StudentItem[], mode: 'append' | 'replace', targetClassId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  selectedClassFilter = 'all',
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onImportExcel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState(selectedClassFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | StudentStatus>('all');
  
  // Modal Thêm/Sửa học sinh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [dob, setDob] = useState('01/01/2009');
  const [classId, setClassId] = useState(classes[0]?.id || '10A1');
  const [attendanceRate, setAttendanceRate] = useState<number>(100);
  const [averageScore, setAverageScore] = useState<number>(8.0);
  const [completedAssignments, setCompletedAssignments] = useState<number>(5);
  const [totalAssignments, setTotalAssignments] = useState<number>(5);
  const [status, setStatus] = useState<StudentStatus>('Ổn định');
  const [note, setNote] = useState('');

  // Lọc học sinh
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClass = classFilter === 'all' || s.classId === classFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchQuery, classFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingStudent(null);
    setName('');
    setGender('Nam');
    setDob('15/05/2009');
    setClassId(classFilter !== 'all' ? classFilter : classes[0]?.id || '10A1');
    setAttendanceRate(100);
    setAverageScore(8.0);
    setCompletedAssignments(5);
    setTotalAssignments(5);
    setStatus('Ổn định');
    setNote('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: StudentItem) => {
    setEditingStudent(s);
    setName(s.name);
    setGender(s.gender);
    setDob(s.dob);
    setClassId(s.classId);
    setAttendanceRate(s.attendanceRate);
    setAverageScore(s.averageScore);
    setCompletedAssignments(s.completedAssignments);
    setTotalAssignments(s.totalAssignments);
    setStatus(s.status);
    setNote(s.note || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStudent) {
      const updated: StudentItem = {
        ...editingStudent,
        name: name.trim(),
        gender,
        dob,
        classId,
        attendanceRate: Number(attendanceRate) || 100,
        averageScore: Number(averageScore) || 0,
        completedAssignments: Number(completedAssignments) || 0,
        totalAssignments: Number(totalAssignments) || 5,
        status,
        note: note.trim(),
      };
      onUpdateStudent(updated);
    } else {
      const newStudent: StudentItem = {
        id: `HS-${Date.now().toString().slice(-4)}`,
        stt: students.length + 1,
        name: name.trim(),
        gender,
        dob,
        classId,
        attendanceRate: Number(attendanceRate) || 100,
        absentCount: 0,
        lateCount: 0,
        scores: { regular: [averageScore], midterm: averageScore, finalTerm: averageScore },
        averageScore: Number(averageScore) || 0,
        completedAssignments: Number(completedAssignments) || 0,
        totalAssignments: Number(totalAssignments) || 5,
        status,
        note: note.trim(),
      };
      onAddStudent(newStudent);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top filter and actions header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Danh sách Học sinh</h2>
            <p className="text-xs text-slate-500">
              Quản lý hồ sơ, theo dõi điểm số, bài tập và nề nếp môn Hóa học.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportStudentsToExcel(filteredStudents, classFilter === 'all' ? 'Danh_Sach_Toan_Bo_Hoc_Sinh' : `Danh_Sach_Lop_${classFilter}`)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-2xs"
              title="Xuất danh sách học sinh hiện tại ra file Excel (.xlsx)"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Xuất Excel
            </button>

            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
              title="Nhập danh sách học sinh từ file Excel hoặc CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Nhập từ Excel
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              + Thêm học sinh
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-3 border-t border-slate-100">
          {/* Tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm học sinh theo họ tên hoặc mã số..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bộ lọc Lớp & Trạng thái */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả các lớp ({classes.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | StudentStatus)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Tốt">Tốt</option>
              <option value="Ổn định">Ổn định</option>
              <option value="Cần chú ý">Cần chú ý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu học sinh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[200px]">Họ và tên</th>
                <th className="py-3.5 px-4 min-w-[80px]">Lớp</th>
                <th className="py-3.5 px-4 min-w-[120px]">Chuyên cần</th>
                <th className="py-3.5 px-4 min-w-[100px]">Điểm TB</th>
                <th className="py-3.5 px-4 min-w-[140px]">Bài tập hoàn thành</th>
                <th className="py-3.5 px-4 min-w-[110px]">Trạng thái</th>
                <th className="py-3.5 px-4 text-center min-w-[100px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, index) => {
                  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (s.status === 'Ổn định') {
                    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  } else if (s.status === 'Cần chú ý') {
                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                  }

                  const isAttention = s.status === 'Cần chú ý';

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isAttention ? 'bg-rose-50/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{s.gender}</span>
                          <span>•</span>
                          <span>{s.dob}</span>
                          {s.note && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600 truncate max-w-[200px]" title={s.note}>
                                {s.note}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800">
                          {s.classId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{s.attendanceRate}%</span>
                          {s.absentCount > 0 && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              Vắng {s.absentCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-extrabold text-sm ${
                          s.averageScore >= 8.0 ? 'text-emerald-600' :
                          s.averageScore >= 6.5 ? 'text-blue-600' : 'text-rose-600'
                        }`}>
                          {s.averageScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[70px] bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${(s.completedAssignments / (s.totalAssignments || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 font-medium">
                            {s.completedAssignments}/{s.totalAssignments}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa thông tin học sinh"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(s.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer thống kê bảng */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <strong className="text-slate-800">{filteredStudents.length}</strong> / {students.length} học sinh
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Tốt: {students.filter(s => s.status === 'Tốt').length}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ổn định: {students.filter(s => s.status === 'Ổn định').length}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Cần chú ý: {students.filter(s => s.status === 'Cần chú ý').length}</span>
          </div>
        </div>
      </div>

      {/* Modal Thêm / Sửa Học sinh */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? `Chỉnh sửa: ${editingStudent.name}` : 'Thêm Học Sinh Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              {!editingStudent && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Thầy có sẵn file danh sách lớp trong Excel?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsExcelModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors flex-shrink-0 text-center"
                  >
                    Nhập nhanh từ Excel
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Họ và tên học sinh
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lớp</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="12/04/2009"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Điểm TB (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={averageScore}
                    onChange={(e) => setAverageScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-semibold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chuyên cần (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bài tập hoàn thành</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={completedAssignments}
                      onChange={(e) => setCompletedAssignments(Number(e.target.value))}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-center"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      min="1"
                      value={totalAssignments}
                      onChange={(e) => setTotalAssignments(Number(e.target.value))}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trạng thái đánh giá</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StudentStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Ổn định">Ổn định</option>
                    <option value="Cần chú ý">Cần chú ý</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nhận xét / Ghi chú đặc điểm học sinh
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Ví dụ: Cần chú ý củng cố bài toán bảo toàn electron..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nhập dữ liệu từ Excel */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        classes={classes}
        defaultClassId={classFilter !== 'all' ? classFilter : classes[0]?.id || '10A1'}
        onImportSuccess={(importedStudents, mode, targetClassId) => {
          if (onImportExcel) {
            onImportExcel(importedStudents, mode, targetClassId);
          }
        }}
      />
    </div>
  );
};
