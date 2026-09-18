import * as XLSX from 'xlsx';
import { StudentItem, StudentStatus } from '../types';

export interface ParsedStudentRow {
  stt?: number;
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  classId: string;
  averageScore: number;
  note?: string;
  isValid: boolean;
  error?: string;
}

// Normalize Vietnamese header string for fuzzy matching
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Tạo và tải xuống file Excel mẫu (.xlsx) để giáo viên điền danh sách học sinh
 */
export function downloadStudentTemplate(defaultClassId: string = '10A1') {
  const templateData = [
    {
      'STT': 1,
      'Họ và tên': 'Nguyễn Hoàng An',
      'Lớp': defaultClassId,
      'Giới tính': 'Nam',
      'Ngày sinh': '15/04/2009',
      'Điểm TB': 8.5,
      'Ghi chú': 'Học sinh tích cực, tổ trưởng',
    },
    {
      'STT': 2,
      'Họ và tên': 'Trần Thị Bích Ngọc',
      'Lớp': defaultClassId,
      'Giới tính': 'Nữ',
      'Ngày sinh': '22/08/2009',
      'Điểm TB': 7.8,
      'Ghi chú': '',
    },
    {
      'STT': 3,
      'Họ và tên': 'Lê Văn Cường',
      'Lớp': defaultClassId,
      'Giới tính': 'Nam',
      'Ngày sinh': '10/11/2009',
      'Điểm TB': 5.5,
      'Ghi chú': 'Cần chú ý bài tập hóa học hữu cơ',
    },
    {
      'STT': 4,
      'Họ và tên': 'Phạm Minh Đức',
      'Lớp': defaultClassId,
      'Giới tính': 'Nam',
      'Ngày sinh': '03/02/2009',
      'Điểm TB': 9.2,
      'Ghi chú': 'Đội tuyển học sinh giỏi Hóa',
    },
    {
      'STT': 5,
      'Họ và tên': 'Võ Khánh Vy',
      'Lớp': defaultClassId,
      'Giới tính': 'Nữ',
      'Ngày sinh': '19/09/2009',
      'Điểm TB': 6.8,
      'Ghi chú': '',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 25 }, // Họ và tên
    { wch: 10 }, // Lớp
    { wch: 10 }, // Giới tính
    { wch: 15 }, // Ngày sinh
    { wch: 10 }, // Điểm TB
    { wch: 35 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHocSinh');

  XLSX.writeFile(workbook, `Mau_Danh_Sach_Hoc_Sinh_${defaultClassId}.xlsx`);
}

/**
 * Đọc file Excel (.xlsx, .xls, .csv) và chuyển đổi thành danh sách học sinh xem trước
 */
export async function parseStudentExcelFile(
  file: File,
  targetClassId: string
): Promise<{ students: ParsedStudentRow[]; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Đọc dữ liệu dạng mảng các dòng (header array)
        const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: '',
          raw: false,
        });

        if (!rawRows || rawRows.length === 0) {
          resolve({ students: [], fileName: file.name });
          return;
        }

        // Tự động nhận diện tiêu đề cột
        const headers = Object.keys(rawRows[0]);
        let nameKey = '';
        let classKey = '';
        let genderKey = '';
        let dobKey = '';
        let scoreKey = '';
        let noteKey = '';
        let sttKey = '';

        headers.forEach((h) => {
          const norm = normalizeHeader(h);
          if (norm.includes('hovaten') || norm.includes('hoten') || norm === 'ten' || norm === 'name') {
            nameKey = h;
          } else if (norm === 'lop' || norm.includes('lop') || norm === 'class') {
            classKey = h;
          } else if (norm.includes('gioitinh') || norm === 'phai' || norm === 'gender') {
            genderKey = h;
          } else if (norm.includes('ngaysinh') || norm.includes('dob') || norm.includes('ns')) {
            dobKey = h;
          } else if (norm.includes('diemtb') || norm.includes('dtb') || norm.includes('diem') || norm === 'score') {
            scoreKey = h;
          } else if (norm.includes('ghichu') || norm.includes('nhanxet') || norm === 'note') {
            noteKey = h;
          } else if (norm === 'stt' || norm.includes('thutu') || norm === 'no') {
            sttKey = h;
          }
        });

        // Nếu không tìm thấy cột họ tên rõ ràng, lấy cột chuỗi dài đầu tiên
        if (!nameKey) {
          nameKey = headers.find((h) => {
            const val = String(rawRows[0][h] || '');
            return val.length > 3 && isNaN(Number(val));
          }) || headers[0];
        }

        const parsedList: ParsedStudentRow[] = [];

        rawRows.forEach((row, index) => {
          const rawName = String(row[nameKey] || '').trim();
          if (!rawName) return; // Bỏ qua dòng trống

          const rawClass = classKey && row[classKey] ? String(row[classKey]).trim() : targetClassId;
          const rawGender = genderKey && row[genderKey] ? String(row[genderKey]).trim().toLowerCase() : '';
          const gender: 'Nam' | 'Nữ' = (rawGender.startsWith('nữ') || rawGender.startsWith('nu') || rawGender === 'f' || rawGender === 'female') ? 'Nữ' : 'Nam';

          const rawDob = dobKey && row[dobKey] ? String(row[dobKey]).trim() : '01/01/2009';
          
          let score = 7.0;
          if (scoreKey && row[scoreKey] !== '') {
            const parsedScore = parseFloat(String(row[scoreKey]).replace(',', '.'));
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10) {
              score = Math.round(parsedScore * 10) / 10;
            }
          }

          const rawNote = noteKey && row[noteKey] ? String(row[noteKey]).trim() : '';
          const stt = sttKey && !isNaN(Number(row[sttKey])) ? Number(row[sttKey]) : index + 1;

          parsedList.push({
            stt,
            name: rawName,
            gender,
            dob: rawDob,
            classId: rawClass || targetClassId,
            averageScore: score,
            note: rawNote,
            isValid: rawName.length >= 2,
          });
        });

        resolve({ students: parsedList, fileName: file.name });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Xuất danh sách học sinh ra file Excel (.xlsx)
 */
export function exportStudentsToExcel(students: StudentItem[], filenameTitle: string = 'Danh_Sach_Hoc_Sinh') {
  const exportRows = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã học sinh': s.id,
    'Họ và tên': s.name,
    'Lớp': s.classId,
    'Giới tính': s.gender,
    'Ngày sinh': s.dob,
    'Chuyên cần (%)': s.attendanceRate,
    'Số buổi vắng': s.absentCount,
    'TX1': s.scores.regular[0] ?? '',
    'TX2': s.scores.regular[1] ?? '',
    'TX3': s.scores.regular[2] ?? '',
    'Giữa kỳ': s.scores.midterm ?? '',
    'Cuối kỳ': s.scores.finalTerm ?? '',
    'Điểm TB': s.averageScore,
    'Bài tập hoàn thành': `${s.completedAssignments}/${s.totalAssignments}`,
    'Xếp loại': s.status,
    'Ghi chú': s.note || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HocSinh');

  XLSX.writeFile(workbook, `${filenameTitle}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
