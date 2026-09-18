import React, { useState } from 'react';
import { X, User, School, BookOpen, Sliders, Download, RefreshCw, Check } from 'lucide-react';
import { TeacherProfile, GradeConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onSaveTeacher: (updated: TeacherProfile) => void;
  gradeConfig: GradeConfig;
  onSaveGradeConfig: (updated: GradeConfig) => void;
  onExportHtml: () => void;
  onOpenResetConfirm: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSaveTeacher,
  gradeConfig,
  onSaveGradeConfig,
  onExportHtml,
  onOpenResetConfirm,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...teacher });
  const [cfgData, setCfgData] = useState<GradeConfig>({ ...gradeConfig });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTeacher(formData);
    onSaveGradeConfig(cfgData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cấu hình & Thông tin Giảng dạy</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh thông tin giáo viên, môn học và quy tắc tính điểm</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên giáo viên
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ví dụ: Nguyễn Văn Út"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Môn giảng dạy
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Ví dụ: Hóa học"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chức danh / Vai trò
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ví dụ: Giáo viên Hóa học THPT"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên trường
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ví dụ: THPT Dương Minh Châu"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Năm học
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Năm học 2025 - 2026"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Học kỳ
              </label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Học kỳ I"
              />
            </div>
          </div>

          {/* Phần công thức tính điểm minh họa */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Hệ số tính điểm trung bình (Công thức tham khảo)
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              {cfgData.description}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Thường xuyên (HS)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={cfgData.regularWeight}
                  onChange={(e) => setCfgData({ ...cfgData, regularWeight: Number(e.target.value) || 1 })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-center font-medium"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Giữa kỳ (HS)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={cfgData.midtermWeight}
                  onChange={(e) => setCfgData({ ...cfgData, midtermWeight: Number(e.target.value) || 2 })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-center font-medium"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Cuối kỳ (HS)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={cfgData.finalWeight}
                  onChange={(e) => setCfgData({ ...cfgData, finalWeight: Number(e.target.value) || 3 })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-center font-medium"
                />
              </div>
            </div>
          </div>

          {/* Tiện ích Xuất File & Khôi phục demo */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <button
              type="button"
              onClick={onExportHtml}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Tải xuống File HTML Đơn (Dùng độc lập không cần mạng)
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenResetConfirm();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-medium text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Khôi phục dữ liệu mẫu ban đầu (Demo)
            </button>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
