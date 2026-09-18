import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Eye, 
  X, 
  Check, 
  GraduationCap, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ClassItem, TeacherProfile, StudentItem, AssignmentItem } from '../types';

interface ClassesViewProps {
  classes: ClassItem[];
  teacher: TeacherProfile;
  students: StudentItem[];
  assignments: AssignmentItem[];
  onAddClass: (cls: ClassItem) => void;
  onUpdateClass: (cls: ClassItem) => void;
  onDeleteClass: (id: string) => void;
  onViewClassStudents: (classId: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  classes,
  teacher,
  students,
  assignments,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onViewClassStudents,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(10);
  const [room, setRoom] = useState('');
  const [studentCount, setStudentCount] = useState<number>(40);
  const [progress, setProgress] = useState<number>(50);
  const [currentTopic, setCurrentTopic] = useState('');
  const [schedule, setSchedule] = useState('');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setName('');
    setGrade(10);
    setRoom('Phòng học ');
    setStudentCount(40);
    setProgress(50);
    setCurrentTopic('Chương 1: Mở đầu Hóa học');
    setSchedule('Thứ 2 (Tiết 1-2)');
    setNotes('');
    setModalMode('create');
  };

  const openEditModal = (cls: ClassItem) => {
    setSelectedClass(cls);
    setName(cls.name);
    setGrade(cls.grade);
    setRoom(cls.room);
    setStudentCount(cls.studentCount);
    setProgress(cls.progress);
    setCurrentTopic(cls.currentTopic);
    setSchedule(cls.schedule);
    setNotes(cls.notes || '');
    setModalMode('edit');
  };

  const openDetailModal = (cls: ClassItem) => {
    setSelectedClass(cls);
    setModalMode('detail');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (modalMode === 'create') {
      const newCls: ClassItem = {
        id: name.trim(),
        name: name.trim(),
        grade: Number(grade) || 10,
        room: room.trim() || 'Phòng học chính',
        studentCount: Number(studentCount) || 40,
        progress: Math.min(100, Math.max(0, Number(progress) || 0)),
        currentTopic: currentTopic.trim() || 'Chương trình tiêu chuẩn',
        schedule: schedule.trim() || 'Thời khóa biểu trường',
        notes: notes.trim(),
      };
      onAddClass(newCls);
    } else if (modalMode === 'edit' && selectedClass) {
      const updatedCls: ClassItem = {
        ...selectedClass,
        name: name.trim(),
        grade: Number(grade) || selectedClass.grade,
        room: room.trim() || selectedClass.room,
        studentCount: Number(studentCount) || selectedClass.studentCount,
        progress: Math.min(100, Math.max(0, Number(progress) || 0)),
        currentTopic: currentTopic.trim() || selectedClass.currentTopic,
        schedule: schedule.trim() || selectedClass.schedule,
        notes: notes.trim(),
      };
      onUpdateClass(updatedCls);
    }
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quản lý Lớp học đang giảng dạy</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng <span className="font-semibold text-blue-700">{classes.length} lớp</span> thuộc phụ trách của thầy {teacher.name} môn {teacher.subject}.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          + Thêm lớp mới
        </button>
      </div>

      {/* Grid danh sách lớp học */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {classes.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const activeAssignmentsCount = assignments.filter(
            (a) => (a.classId === cls.id || a.classId === 'all') && a.status === 'Đang giao'
          ).length;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header card lớp */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-lg flex items-center justify-center border border-blue-100">
                      {cls.name}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">Lớp {cls.name}</h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Khối {cls.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.room}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Sĩ số: {cls.studentCount} HS
                  </span>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Giáo viên:</span>
                    <span className="font-semibold text-slate-800">{teacher.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Môn học:</span>
                    <span className="font-semibold text-blue-700">{teacher.subject}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 flex-shrink-0">Chuyên đề hiện tại:</span>
                    <span className="font-medium text-slate-800 text-right truncate max-w-[200px]" title={cls.currentTopic}>
                      {cls.currentTopic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Số bài tập đang giao:</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      {activeAssignmentsCount} bài tập
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Học sinh trong danh sách:</span>
                    <span className="font-medium text-slate-700">{classStudents.length} hồ sơ</span>
                  </div>
                </div>

                {/* Tiến độ chương trình */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Tiến độ chương trình:</span>
                    <span className="font-bold text-blue-600">{cls.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openDetailModal(cls)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Chi tiết
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewClassStudents(cls.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Xem danh sách học sinh của lớp"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Học sinh
                  </button>

                  <button
                    onClick={() => openEditModal(cls)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteClass(cls.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa lớp học"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Thêm / Sửa Lớp */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? 'Thêm Lớp Học Mới' : `Sửa Thông Tin Lớp ${selectedClass?.name}`}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tên lớp (Ví dụ: 10A1, 10A2, 11A1, 12A1)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Khối lớp</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sĩ số</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phòng học</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ví dụ: Phòng 201 - Nhà B"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chuyên đề / bài giảng hiện tại</label>
                <input
                  type="text"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  placeholder="Chương 2: Bảng tuần hoàn các nguyên tố hóa học"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiến độ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lịch học</label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Thứ 2 (tiết 1-2)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú đặc điểm lớp</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  placeholder="Học sinh tích cực thực hành thí nghiệm..."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  {modalMode === 'create' ? 'Tạo lớp học' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Lớp */}
      {modalMode === 'detail' && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center">
                  {selectedClass.name}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Chi tiết Lớp {selectedClass.name}</h3>
                  <p className="text-xs text-slate-500">{selectedClass.room}</p>
                </div>
              </div>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                <p><strong>Giáo viên bộ môn:</strong> {teacher.name} ({teacher.subject})</p>
                <p><strong>Trường:</strong> {teacher.school}</p>
                <p><strong>Thời khóa biểu:</strong> {selectedClass.schedule}</p>
                <p><strong>Chuyên đề hiện tại:</strong> {selectedClass.currentTopic}</p>
                <p><strong>Ghi chú:</strong> {selectedClass.notes || 'Không có ghi chú đặc biệt'}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                  Danh sách học sinh của lớp ({students.filter(s => s.classId === selectedClass.id).length} học sinh)
                </h4>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                  {students.filter(s => s.classId === selectedClass.id).map(s => (
                    <div key={s.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <span className="ml-2 text-slate-400 text-[11px]">({s.gender})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">ĐTB: {s.averageScore}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.status === 'Tốt' ? 'bg-emerald-100 text-emerald-700' :
                          s.status === 'Cần chú ý' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
