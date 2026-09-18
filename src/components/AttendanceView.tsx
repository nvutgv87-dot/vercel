import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  Save, 
  Check, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertCircle,
  FileCheck,
  CheckCheck
} from 'lucide-react';
import { StudentItem, ClassItem, AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes,
  attendanceRecords,
  onSaveAttendance,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '10A1');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sessionNote, setSessionNote] = useState('');

  // Map studentId -> AttendanceStatus
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  // Lọc học sinh theo lớp đã chọn
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Nạp dữ liệu điểm danh ngày đã chọn nếu có trong database
  useEffect(() => {
    const existing = attendanceRecords.find(
      (r) => r.classId === selectedClassId && r.date === selectedDate
    );

    if (existing) {
      setStatusMap(existing.records);
      setSessionNote(existing.note || '');
    } else {
      // Mặc định tất cả là 'present'
      const initial: Record<string, AttendanceStatus> = {};
      classStudents.forEach((s) => {
        initial[s.id] = 'present';
      });
      setStatusMap(initial);
      setSessionNote('');
    }
  }, [selectedClassId, selectedDate, attendanceRecords, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const next: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      next[s.id] = 'present';
    });
    setStatusMap(next);
  };

  const handleSave = () => {
    const record: AttendanceRecord = {
      id: `DD-${selectedDate}-${selectedClassId}`,
      date: selectedDate,
      classId: selectedClassId,
      records: statusMap,
      note: sessionNote.trim(),
    };
    onSaveAttendance(record);
  };

  // Thống kê nhanh buổi điểm danh
  const totalInClass = classStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  classStudents.forEach((s) => {
    const st = statusMap[s.id] || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'absent') absentCount++;
    else if (st === 'late') lateCount++;
    else if (st === 'excused') excusedCount++;
  });

  return (
    <div className="space-y-6">
      {/* Top selector card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              Sổ Điểm Danh Buổi Học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ghi nhận chuyên cần, vắng phép, không phép và đi muộn nhanh chóng bằng 1 chạm.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-colors border border-emerald-200"
              title="Đánh dấu tất cả học sinh có mặt"
            >
              <CheckCheck className="w-4 h-4" />
              Tất cả có mặt
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu điểm danh
            </button>
          </div>
        </div>

        {/* Lựa chọn lớp & ngày */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Lớp học:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-semibold text-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} ({c.studentCount} HS)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Ngày dạy:</span>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="Ghi chú buổi học (ví dụ: Bài thực hành số 1, kiểm tra 15 phút...)"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Thanh 4 thẻ thống kê số lượng điểm danh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            Tổng số học sinh
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalInClass}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Có mặt
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{presentCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <UserX className="w-4 h-4 text-rose-600" />
            Vắng (Không phép)
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{absentCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Đi muộn / Có phép
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {lateCount} <span className="text-xs font-normal text-slate-500">muộn</span> + {excusedCount} <span className="text-xs font-normal text-slate-500">phép</span>
          </div>
        </div>
      </div>

      {/* Danh sách học sinh & nút bấm trạng thái */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Danh sách điểm danh: Lớp {selectedClassId} ({classStudents.length} học sinh)
          </span>
          <span className="text-xs text-slate-400">
            Bấm chọn trực tiếp trạng thái của từng học sinh
          </span>
        </div>

        {classStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Chưa có học sinh nào trong lớp {selectedClassId}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {classStudents.map((s, index) => {
              const currentStatus = statusMap[s.id] || 'present';

              return (
                <div
                  key={s.id}
                  className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-semibold text-slate-400">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-900">{s.name}</span>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{s.gender}</span>
                        <span>•</span>
                        <span>ĐTB: {s.averageScore}</span>
                        {s.note && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 truncate max-w-[250px]" title={s.note}>
                              {s.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Nút chọn trạng thái nhanh */}
                  <div className="grid grid-cols-4 gap-1.5 sm:w-auto">
                    {/* Có mặt */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Có mặt
                    </button>

                    {/* Vắng */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Vắng
                    </button>

                    {/* Đi muộn */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Đi muộn
                    </button>

                    {/* Có phép */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'excused')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        currentStatus === 'excused'
                          ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Có phép
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Nhớ bấm nút <strong className="text-blue-700">"Lưu điểm danh"</strong> để cập nhật dữ liệu.
          </span>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Lưu điểm danh
          </button>
        </div>
      </div>
    </div>
  );
};
