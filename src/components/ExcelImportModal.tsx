import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  X, 
  Check, 
  AlertCircle, 
  Users, 
  Info,
  Trash2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { ClassItem, StudentItem, StudentStatus } from '../types';
import { 
  downloadStudentTemplate, 
  parseStudentExcelFile, 
  ParsedStudentRow 
} from '../services/excelService';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  defaultClassId?: string;
  onImportSuccess: (importedStudents: StudentItem[], mode: 'append' | 'replace', targetClassId: string) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  classes,
  defaultClassId = '10A1',
  onImportSuccess,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(defaultClassId);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await parseStudentExcelFile(file, selectedClassId);
      if (result.students.length === 0) {
        setErrorMsg('Không tìm thấy dữ liệu học sinh trong file Excel. Vui lòng kiểm tra lại file mẫu!');
        setParsedRows([]);
        setSelectedIndexes(new Set());
      } else {
        setFileName(result.fileName);
        setParsedRows(result.students);
        // Chọn tất cả dòng hợp lệ mặc định
        const validSet = new Set<number>();
        result.students.forEach((_, idx) => validSet.add(idx));
        setSelectedIndexes(validSet);
      }
    } catch (err: any) {
      setErrorMsg('Đã có lỗi khi đọc file Excel. Vui lòng đảm bảo file đúng định dạng .xlsx, .xls hoặc .csv!');
    } finally {
      setIsLoading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleSelectRow = (idx: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIndexes.size === parsedRows.length) {
      setSelectedIndexes(new Set());
    } else {
      const all = new Set<number>();
      parsedRows.forEach((_, idx) => all.add(idx));
      setSelectedIndexes(all);
    }
  };

  const handleConfirmImport = () => {
    const toImport = parsedRows.filter((_, idx) => selectedIndexes.has(idx));
    if (toImport.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 học sinh để nhập vào danh sách!');
      return;
    }

    const newStudents: StudentItem[] = toImport.map((row, i) => {
      const score = row.averageScore || 7.0;
      let status: StudentStatus = 'Ổn định';
      if (score >= 8.0) status = 'Tốt';
      else if (score < 5.0) status = 'Cần chú ý';

      return {
        id: `HS-${Date.now().toString().slice(-4)}-${i + 1}`,
        stt: i + 1,
        name: row.name,
        gender: row.gender,
        dob: row.dob,
        classId: row.classId || selectedClassId,
        attendanceRate: 100,
        absentCount: 0,
        lateCount: 0,
        scores: { regular: [score], midterm: score, finalTerm: score },
        averageScore: score,
        completedAssignments: 5,
        totalAssignments: 5,
        status,
        note: row.note || '',
      };
    });

    onImportSuccess(newStudents, importMode, selectedClassId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nhập danh sách học sinh từ file Excel
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ định dạng file <strong>.xlsx, .xls, .csv</strong>, đọc nhanh và bảo mật hoàn toàn trên máy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Controls: Target class & Download template */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Lớp nhận học sinh:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 border border-blue-200 rounded-lg bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => downloadStudentTemplate(selectedClassId)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              title="Tải về file Excel mẫu có cấu trúc chuẩn"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Tải file Excel mẫu (.xlsx)
            </button>
          </div>

          {/* Upload Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Kéo thả file Excel vào đây hoặc <span className="text-blue-600 underline">bấm để chọn file</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Chấp nhận định dạng: .xlsx, .xls, .csv (Tự động nhận diện các cột Họ tên, Giới tính, Ngày sinh, Điểm số)
            </p>
            {fileName && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                <FileCheck className="w-3.5 h-3.5" />
                Đã nạp file: {fileName}
              </div>
            )}
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-6 text-xs text-slate-500">
              Đang phân tích dữ liệu từ file Excel...
            </div>
          )}

          {/* Preview Table if rows exist */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800">Xem trước dữ liệu:</span>
                  <span className="text-slate-500">
                    Đã chọn <strong className="text-blue-700">{selectedIndexes.size}</strong> / {parsedRows.length} học sinh
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {selectedIndexes.size === parsedRows.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>

                  <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                    <span className="text-slate-500">Chế độ:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-blue-600"
                      />
                      <span>Thêm nối tiếp</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="replace"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-blue-600"
                      />
                      <span>Ghi đè lớp {selectedClassId}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIndexes.size === parsedRows.length && parsedRows.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded text-blue-600"
                        />
                      </th>
                      <th className="p-2.5 w-12 text-center">STT</th>
                      <th className="p-2.5">Họ và tên</th>
                      <th className="p-2.5">Lớp</th>
                      <th className="p-2.5">Giới tính</th>
                      <th className="p-2.5">Ngày sinh</th>
                      <th className="p-2.5 text-center">Điểm TB</th>
                      <th className="p-2.5">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => {
                      const isSelected = selectedIndexes.has(idx);
                      return (
                        <tr
                          key={idx}
                          onClick={() => toggleSelectRow(idx)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(idx)}
                              className="rounded text-blue-600"
                            />
                          </td>
                          <td className="p-2.5 text-center text-slate-400 font-medium">
                            {row.stt || idx + 1}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {row.classId || selectedClassId}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{row.gender}</td>
                          <td className="p-2.5 text-slate-600">{row.dob}</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">
                            {row.averageScore.toFixed(1)}
                          </td>
                          <td className="p-2.5 text-slate-500 italic truncate max-w-[150px]">
                            {row.note || '--'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {parsedRows.length > 0 ? (
              <span>
                Sẽ nhập <strong className="text-slate-800">{selectedIndexes.size}</strong> học sinh vào lớp{' '}
                <strong className="text-blue-700">{selectedClassId}</strong>
              </span>
            ) : (
              <span>Vui lòng nạp file Excel để xem trước dữ liệu</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0 || selectedIndexes.size === 0}
              onClick={handleConfirmImport}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs ${
                parsedRows.length > 0 && selectedIndexes.size > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              Xác nhận nhập học sinh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
