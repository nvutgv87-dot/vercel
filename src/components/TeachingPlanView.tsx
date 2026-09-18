import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X, 
  Check, 
  BookOpen,
  Filter,
  ListOrdered
} from 'lucide-react';
import { TeachingPlanItem, ClassItem } from '../types';

interface TeachingPlanViewProps {
  plans: TeachingPlanItem[];
  classes: ClassItem[];
  onAddPlan: (plan: TeachingPlanItem) => void;
  onUpdatePlan: (plan: TeachingPlanItem) => void;
  onDeletePlan: (id: string) => void;
}

export const TeachingPlanView: React.FC<TeachingPlanViewProps> = ({
  plans,
  classes,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
}) => {
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TeachingPlanItem | null>(null);

  // Form states
  const [week, setWeek] = useState<number>(1);
  const [classId, setClassId] = useState(classes[0]?.id || '10A1');
  const [topic, setTopic] = useState('');
  const [periods, setPeriods] = useState<number>(3);
  const [objectives, setObjectives] = useState('');
  const [status, setStatus] = useState<TeachingPlanItem['status']>('Chưa dạy');
  const [dateRange, setDateRange] = useState('');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setEditingPlan(null);
    setWeek(plans.length + 1);
    setClassId(classFilter !== 'all' ? classFilter : classes[0]?.id || '10A1');
    setTopic('');
    setPeriods(3);
    setObjectives('');
    setStatus('Chưa dạy');
    setDateRange('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: TeachingPlanItem) => {
    setEditingPlan(p);
    setWeek(p.week);
    setClassId(p.classId);
    setTopic(p.topic);
    setPeriods(p.periods);
    setObjectives(p.objectives);
    setStatus(p.status);
    setDateRange(p.dateRange);
    setNotes(p.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (editingPlan) {
      const updated: TeachingPlanItem = {
        ...editingPlan,
        week: Number(week) || 1,
        classId,
        topic: topic.trim(),
        periods: Number(periods) || 2,
        objectives: objectives.trim(),
        status,
        dateRange: dateRange.trim() || 'Theo phân phối',
        notes: notes.trim(),
      };
      onUpdatePlan(updated);
    } else {
      const newPlan: TeachingPlanItem = {
        id: `KH-${Date.now().toString().slice(-4)}`,
        week: Number(week) || 1,
        classId,
        topic: topic.trim(),
        periods: Number(periods) || 2,
        objectives: objectives.trim(),
        status,
        dateRange: dateRange.trim() || 'Theo phân phối',
        notes: notes.trim(),
      };
      onAddPlan(newPlan);
    }
    setIsModalOpen(false);
  };

  const filtered = plans.filter((p) => {
    const matchClass = classFilter === 'all' || p.classId === classFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchClass && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Kế hoạch Giảng dạy Môn Hóa học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân phối chương trình chi tiết theo từng tuần, bài học, số tiết và mục tiêu kiến thức.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Thêm bài dạy mới
          </button>
        </div>

        {/* Filter bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Lớp:</span>
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
              <option value="all">Tất cả</option>
              <option value="Chưa dạy">Chưa dạy</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline / Danh sách kế hoạch */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Không có bài học nào trong kế hoạch giảng dạy này.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => {
              let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
              let StatusIcon = Clock;
              if (item.status === 'Hoàn thành') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                StatusIcon = CheckCircle2;
              } else if (item.status === 'Đang thực hiện') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                StatusIcon = Clock;
              }

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Week badge */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold text-blue-500">Tuần</span>
                      <span className="text-base font-extrabold leading-none">{item.week}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                          Lớp {item.classId}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.periods} tiết
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{item.dateRange}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.topic}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        <strong>Mục tiêu:</strong> {item.objectives}
                      </p>

                      {item.notes && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg mt-1 italic">
                          Ghi chú thiết bị / bài tập: {item.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Status and actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa kế hoạch bài học"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePlan(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa kế hoạch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa Kế hoạch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? 'Sửa Kế Hoạch Bài Học' : 'Thêm Bài Học Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tuần thứ</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-center font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lớp</label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Số tiết</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={periods}
                    onChange={(e) => setPeriods(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-center font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Chủ đề / Tên bài học Hóa học
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Bài 3: Cấu trúc vỏ electron nguyên tử"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mục tiêu kiến thức, năng lực & phẩm chất
                </label>
                <textarea
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  rows={3}
                  placeholder="Học sinh viết được cấu hình electron, phân biệt obitan s, p, d..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thời gian thực hiện</label>
                  <input
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="15/09 - 20/09"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TeachingPlanItem['status'])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Chưa dạy">Chưa dạy</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú thiết bị / thí nghiệm</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Chuẩn bị ống nghiệm, đèn cồn, hóa chất Na, Cu..."
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
                  {editingPlan ? 'Lưu bài dạy' : 'Tạo bài dạy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
