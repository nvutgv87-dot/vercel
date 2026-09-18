import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X, 
  Check, 
  Filter,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AssignmentItem, ClassItem } from '../types';

interface AssignmentsViewProps {
  assignments: AssignmentItem[];
  classes: ClassItem[];
  onAddAssignment: (assignment: AssignmentItem) => void;
  onUpdateAssignment: (assignment: AssignmentItem) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleAssignmentStatus: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  classes,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onToggleAssignmentStatus,
}) => {
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Thêm / Sửa bài tập
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssignmentItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '10A1');
  const [content, setContent] = useState('');
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [completedCount, setCompletedCount] = useState<number>(35);
  const [totalCount, setTotalCount] = useState<number>(40);
  const [type, setType] = useState<AssignmentItem['type']>('Bài tập trắc nghiệm');
  const [status, setStatus] = useState<AssignmentItem['status']>('Đang giao');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setClassId(classFilter !== 'all' ? classFilter : classes[0]?.id || '10A1');
    setContent('');
    setAssignedDate(new Date().toISOString().split('T')[0]);
    // Mặc định hạn nộp sau 7 ngày
    const due = new Date();
    due.setDate(due.getDate() + 7);
    setDueDate(due.toISOString().split('T')[0]);
    const targetClass = classes.find(c => c.id === (classFilter !== 'all' ? classFilter : classes[0]?.id));
    const cap = targetClass ? targetClass.studentCount : 40;
    setCompletedCount(0);
    setTotalCount(cap);
    setType('Bài tập trắc nghiệm');
    setStatus('Đang giao');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: AssignmentItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setClassId(item.classId);
    setContent(item.content);
    setAssignedDate(item.assignedDate);
    setDueDate(item.dueDate);
    setCompletedCount(item.completedCount);
    setTotalCount(item.totalCount);
    setType(item.type);
    setStatus(item.status);
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      const updated: AssignmentItem = {
        ...editingItem,
        title: title.trim(),
        classId,
        content: content.trim(),
        assignedDate,
        dueDate,
        completedCount: Number(completedCount) || 0,
        totalCount: Number(totalCount) || 40,
        type,
        status,
        notes: notes.trim(),
      };
      onUpdateAssignment(updated);
    } else {
      const newItem: AssignmentItem = {
        id: `BT-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        classId,
        content: content.trim(),
        assignedDate,
        dueDate,
        completedCount: Number(completedCount) || 0,
        totalCount: Number(totalCount) || 40,
        type,
        status,
        notes: notes.trim(),
      };
      onAddAssignment(newItem);
    }
    setIsModalOpen(false);
  };

  // Lọc
  const filtered = assignments.filter((a) => {
    const matchClass = classFilter === 'all' || a.classId === classFilter || a.classId === 'all';
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchClass && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-blue-600" />
              Quản lý Bài tập Môn Hóa học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi phiếu học tập, đề trắc nghiệm và báo cáo thực hành thí nghiệm.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Tạo bài tập mới
          </button>
        </div>

        {/* Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Lọc theo lớp:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white font-medium"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
              <option value="Đã chấm xong">Đã chấm xong</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Danh sách bài tập */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <BookOpenCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Không có bài tập nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filtered.map((item) => {
            const completionRate = Math.round((item.completedCount / (item.totalCount || 1)) * 100);
            let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
            if (item.status === 'Đã chấm xong') {
              badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            } else if (item.status === 'Đã kết thúc') {
              badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
            }

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                          Lớp {item.classId}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${badgeClass}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.content}
                  </p>

                  {/* Tiến độ hoàn thành */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500">
                        Đã nộp: <strong>{item.completedCount}/{item.totalCount}</strong> học sinh
                      </span>
                      <span className="font-bold text-blue-600">{completionRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          completionRate >= 90 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span>Ngày giao: </span>
                      <strong className="text-slate-700">{item.assignedDate}</strong>
                    </div>
                    <div className="text-right">
                      <span>Hạn nộp: </span>
                      <strong className="text-rose-600">{item.dueDate}</strong>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                      Ghi chú: {item.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleAssignmentStatus(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {item.status === 'Đã chấm xong' ? 'Mở lại bài' : 'Đánh dấu hoàn thành'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa bài tập"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAssignment(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tạo / Sửa bài tập */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Chỉnh Sửa Bài Tập' : 'Giao Bài Tập Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tiêu đề bài tập / Phiếu học tập
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Phiếu trắc nghiệm cấu hình electron nguyên tử"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lớp áp dụng</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phân loại</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AssignmentItem['type'])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Bài tập trắc nghiệm">Bài tập trắc nghiệm</option>
                    <option value="Lý thuyết">Lý thuyết</option>
                    <option value="Thí nghiệm - Thực hành">Thí nghiệm - Thực hành</option>
                    <option value="Chuyên đề">Chuyên đề</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nội dung & Yêu cầu bài tập
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="Mô tả nội dung câu hỏi, tài liệu tham khảo hoặc hướng dẫn nộp bài..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày giao</label>
                  <input
                    type="date"
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Đã nộp / Tổng số</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={completedCount}
                      onChange={(e) => setCompletedCount(Number(e.target.value))}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-center"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      min="1"
                      value={totalCount}
                      onChange={(e) => setTotalCount(Number(e.target.value))}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentItem['status'])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                    <option value="Đã chấm xong">Đã chấm xong</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Lưu ý cho lớp trưởng hoặc học sinh..."
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
                  {editingItem ? 'Lưu thay đổi' : 'Tạo bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
