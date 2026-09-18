import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  BookOpenCheck, 
  CalendarDays, 
  BarChart3, 
  FlaskConical, 
  ChevronRight,
  Edit3,
  X
} from 'lucide-react';
import { TabType, TeacherProfile } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  teacher: TeacherProfile;
  onOpenSettings: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  key: TabType;
  label: string;
  sub: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  teacher,
  onOpenSettings,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Tổng quan', sub: 'Bảng điều khiển trung tâm', icon: LayoutDashboard },
    { key: 'classes', label: 'Lớp học', sub: 'Quản lý lớp & tiến độ', icon: Users },
    { key: 'students', label: 'Học sinh', sub: 'Hồ sơ & theo dõi nề nếp', icon: GraduationCap },
    { key: 'attendance', label: 'Chuyên cần', sub: 'Điểm danh buổi học', icon: CalendarCheck },
    { key: 'grades', label: 'Điểm số', sub: 'Bảng điểm & kết quả', icon: Award },
    { key: 'assignments', label: 'Bài tập', sub: 'Giao bài & chấm bài', icon: BookOpenCheck },
    { key: 'teaching_plan', label: 'Kế hoạch giảng dạy', sub: 'Phân phối chương trình', icon: CalendarDays },
    { key: 'statistics', label: 'Thống kê', sub: 'Báo cáo & trực quan', icon: BarChart3 },
  ];

  const handleNavClick = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden" 
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                QUẢN TRỊ HỌC TẬP
              </div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">
                Hóa học THPT
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Chức Năng
          </div>
          {navItems.map((item, index) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm group ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-2xs border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 font-normal text-xs mr-1">{index + 1}.</span>
                    <span>{item.label}</span>
                  </div>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Sidebar Footer - Teacher Information as specified */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-start justify-between gap-2 p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {teacher.avatarText || 'GV'}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate" title={teacher.name}>
                  {teacher.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate" title={teacher.title}>
                  {teacher.title}
                </p>
                <p className="text-[11px] text-blue-600 font-medium truncate" title={teacher.school}>
                  {teacher.school}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
              title="Chỉnh sửa thông tin giáo viên & trường học"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400">
              Lưu trữ dữ liệu an toàn trên trình duyệt (LocalStorage)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
