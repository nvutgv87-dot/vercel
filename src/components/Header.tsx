import React from 'react';
import { Menu, Bell, Volume2, VolumeX, Download, Settings, Sparkles, BookOpen } from 'lucide-react';
import { TeacherProfile } from '../types';

interface HeaderProps {
  teacher: TeacherProfile;
  activeTabTitle: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onExportHtml: () => void;
  onToggleMobileSidebar: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  activeTabTitle,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onExportHtml,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Hamburger on mobile + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <BookOpen className="w-3 h-3" />
                {teacher.school}
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">•</span>
              <span className="text-xs text-slate-500 font-medium hidden md:inline">
                {teacher.academicYear} ({teacher.semester})
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight flex items-center gap-2 mt-0.5">
              <span>{activeTabTitle}</span>
            </h1>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Nút bật/tắt âm thanh thông báo */}
          <button
            onClick={onToggleSound}
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? 'border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
            title={soundEnabled ? 'Âm thanh thông báo: Đang BẬT (Bấm để Tắt)' : 'Âm thanh thông báo: Đang TẮT (Bấm để Bật)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
          </button>

          {/* Nút Tải HTML đơn */}
          <button
            onClick={onExportHtml}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            title="Tải về file HTML đơn để chạy ngoại tuyến không cần mạng"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất HTML đơn</span>
          </button>

          {/* Nút Cài đặt */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Tùy chỉnh thông tin giáo viên & hệ số tính điểm"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Cài đặt</span>
          </button>

          {/* Teacher avatar pill */}
          <div 
            onClick={onOpenSettings}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="Nhấn để chỉnh sửa thông tin giáo viên"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
              {teacher.avatarText || 'GV'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {teacher.name}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                {teacher.subject}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
