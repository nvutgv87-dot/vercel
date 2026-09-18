import { TeacherProfile, ClassItem, StudentItem, AssignmentItem, TeachingPlanItem, AttendanceRecord, GradeConfig } from '../types';

/**
 * =======================================================================
 * CẤU HÌNH THÔNG TIN GIÁO VIÊN & TRƯỜNG HỌC (DỄ DÀNG CHỈNH SỬA TẠI ĐÂY)
 * =======================================================================
 */
export const INITIAL_TEACHER: TeacherProfile = {
  name: 'Nguyễn Văn Út',
  title: 'Giáo viên Hóa học THPT',
  subject: 'Hóa học',
  school: 'THPT Dương Minh Châu',
  academicYear: 'Năm học 2025 - 2026',
  semester: 'Học kỳ I',
  avatarText: 'NVÚ'
};

/**
 * CẤU HÌNH CÔNG THỨC TÍNH ĐIỂM MINH HỌA
 * Điểm TB = (Tổng điểm thường xuyên + Giữa kỳ * 2 + Cuối kỳ * 3) / (Số cột thường xuyên + 2 + 3)
 */
export const INITIAL_GRADE_CONFIG: GradeConfig = {
  regularWeight: 1,
  midtermWeight: 2,
  finalWeight: 3,
  description: 'Công thức mẫu mô phỏng theo Thông tư 22/BGDĐT (Hệ số: Thường xuyên = 1, Giữa kỳ = 2, Cuối kỳ = 3).'
};

/**
 * DANH SÁCH LỚP HỌC MẪU
 */
export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: '10A1',
    name: '10A1',
    grade: 10,
    room: 'Phòng học 201 - Nhà B',
    studentCount: 42,
    progress: 65,
    currentTopic: 'Chương 2: Bảng tuần hoàn các nguyên tố hóa học',
    schedule: 'Thứ 2 (Tiết 1-2), Thứ 4 (Tiết 3)',
    notes: 'Lớp chuyên ban tự nhiên, khả năng tiếp thu bài nhanh, sôi nổi.'
  },
  {
    id: '10A2',
    name: '10A2',
    grade: 10,
    room: 'Phòng học 202 - Nhà B',
    studentCount: 40,
    progress: 60,
    currentTopic: 'Chương 2: Định luật tuần hoàn & Cấu hình electron',
    schedule: 'Thứ 3 (Tiết 2-3), Thứ 6 (Tiết 1)',
    notes: 'Cần chú trọng hướng dẫn giải bài tập tính toán nồng độ và khối lượng.'
  },
  {
    id: '11A1',
    name: '11A1',
    grade: 11,
    room: 'Phòng thí nghiệm Hóa 1',
    studentCount: 38,
    progress: 72,
    currentTopic: 'Chương 3: Cân bằng hóa học & Phản ứng oxy hóa - khử',
    schedule: 'Thứ 2 (Tiết 4), Thứ 5 (Tiết 2-3)',
    notes: 'Đã hoàn thành 2 bài thực hành điều chế chất khí an toàn.'
  },
  {
    id: '12A1',
    name: '12A1',
    grade: 12,
    room: 'Phòng học 305 - Nhà C',
    studentCount: 40,
    progress: 80,
    currentTopic: 'Chương 4: Polime và Vật liệu polime - Ôn thi TN',
    schedule: 'Thứ 3 (Tiết 4-5), Thứ 7 (Tiết 1-2)',
    notes: 'Lớp 12 tập trung luyện đề thi tốt nghiệp THPT và đánh giá năng lực.'
  }
];

/**
 * DANH SÁCH HỌC SINH MẪU (20 HỌC SINH GIẢ ĐỊNH MINH HỌA)
 */
export const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: 'HS-101',
    stt: 1,
    name: 'Trần Hoàng Bảo An',
    gender: 'Nữ',
    dob: '12/04/2009',
    classId: '10A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.0, 8.5, 9.5], midterm: 8.8, finalTerm: 9.0 },
    averageScore: 8.9,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Nắm vững kiến thức cấu tạo nguyên tử, hăng hái phát biểu'
  },
  {
    id: 'HS-102',
    stt: 2,
    name: 'Lê Minh Khang',
    gender: 'Nam',
    dob: '23/08/2009',
    classId: '10A1',
    attendanceRate: 98,
    absentCount: 0,
    lateCount: 1,
    scores: { regular: [8.0, 7.5, 8.5], midterm: 7.8, finalTerm: 8.2 },
    averageScore: 8.0,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Ổn định',
    note: 'Kỹ năng làm bài trắc nghiệm nhanh, cần cẩn thận phần tự luận'
  },
  {
    id: 'HS-103',
    stt: 3,
    name: 'Nguyễn Thảo My',
    gender: 'Nữ',
    dob: '05/11/2009',
    classId: '10A1',
    attendanceRate: 95,
    absentCount: 1,
    lateCount: 0,
    scores: { regular: [6.0, 5.5, 6.0], midterm: 5.0, finalTerm: 5.2 },
    averageScore: 5.5,
    completedAssignments: 3,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Yếu phần tính toán số mol và bán kính nguyên tử, cần phụ đạo thêm'
  },
  {
    id: 'HS-104',
    stt: 4,
    name: 'Võ Quốc Huy',
    gender: 'Nam',
    dob: '17/02/2009',
    classId: '10A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.5, 10.0, 9.0], midterm: 9.5, finalTerm: 9.8 },
    averageScore: 9.6,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Thành viên đội tuyển học sinh giỏi Hóa học cấp trường'
  },
  {
    id: 'HS-105',
    stt: 5,
    name: 'Phạm Đăng Khoa',
    gender: 'Nam',
    dob: '19/07/2009',
    classId: '10A1',
    attendanceRate: 92,
    absentCount: 2,
    lateCount: 1,
    scores: { regular: [5.0, 4.5, 5.5], midterm: 4.8, finalTerm: 4.5 },
    averageScore: 4.8,
    completedAssignments: 2,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Thường xuyên thiếu bài tập về nhà, hay mất tập trung trong giờ học'
  },
  {
    id: 'HS-106',
    stt: 6,
    name: 'Đặng Ngọc Ánh',
    gender: 'Nữ',
    dob: '30/09/2009',
    classId: '10A2',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [8.5, 8.0, 8.5], midterm: 8.0, finalTerm: 8.5 },
    averageScore: 8.3,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Vẽ sơ đồ tư duy bảng tuần hoàn rất chi tiết và thẩm mỹ'
  },
  {
    id: 'HS-107',
    stt: 7,
    name: 'Bùi Gia Phúc',
    gender: 'Nam',
    dob: '14/01/2009',
    classId: '10A2',
    attendanceRate: 96,
    absentCount: 1,
    lateCount: 0,
    scores: { regular: [7.0, 7.5, 7.0], midterm: 7.2, finalTerm: 7.0 },
    averageScore: 7.1,
    completedAssignments: 4,
    totalAssignments: 5,
    status: 'Ổn định',
    note: 'Có tiến bộ trong phần viết phương trình hóa học'
  },
  {
    id: 'HS-108',
    stt: 8,
    name: 'Hoàng Thị Kim Ngân',
    gender: 'Nữ',
    dob: '02/06/2009',
    classId: '10A2',
    attendanceRate: 90,
    absentCount: 2,
    lateCount: 2,
    scores: { regular: [4.5, 5.0, 4.0], midterm: 4.2, finalTerm: 4.5 },
    averageScore: 4.4,
    completedAssignments: 2,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Điểm kiểm tra định kỳ thấp, cần liên hệ giáo viên chủ nhiệm'
  },
  {
    id: 'HS-109',
    stt: 9,
    name: 'Trịnh Tuấn Kiệt',
    gender: 'Nam',
    dob: '28/12/2009',
    classId: '10A2',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.0, 9.5, 9.0], midterm: 9.0, finalTerm: 9.2 },
    averageScore: 9.2,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Học lực xuất sắc, tác phong thí nghiệm chuẩn xác'
  },
  {
    id: 'HS-110',
    stt: 10,
    name: 'Huỳnh Tấn Phát',
    gender: 'Nam',
    dob: '11/05/2008',
    classId: '11A1',
    attendanceRate: 98,
    absentCount: 0,
    lateCount: 1,
    scores: { regular: [8.5, 9.0, 8.5], midterm: 8.5, finalTerm: 8.8 },
    averageScore: 8.7,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Nắm vững phương pháp thăng bằng electron trong phản ứng oxi hóa khử'
  },
  {
    id: 'HS-111',
    stt: 11,
    name: 'Đỗ Quỳnh Trâm',
    gender: 'Nữ',
    dob: '18/10/2008',
    classId: '11A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [7.5, 8.0, 7.5], midterm: 7.5, finalTerm: 7.8 },
    averageScore: 7.7,
    completedAssignments: 4,
    totalAssignments: 5,
    status: 'Ổn định',
    note: 'Chăm chỉ, hoàn thành bài tập đúng thời hạn'
  },
  {
    id: 'HS-112',
    stt: 12,
    name: 'Mai Văn Hùng',
    gender: 'Nam',
    dob: '09/03/2008',
    classId: '11A1',
    attendanceRate: 94,
    absentCount: 1,
    lateCount: 2,
    scores: { regular: [5.5, 6.0, 5.0], midterm: 5.2, finalTerm: 5.0 },
    averageScore: 5.3,
    completedAssignments: 3,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Còn lúng túng khi viết hằng số cân bằng Kc, cần rèn luyện thêm'
  },
  {
    id: 'HS-113',
    stt: 13,
    name: 'Dương Yến Nhi',
    gender: 'Nữ',
    dob: '25/08/2008',
    classId: '11A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.0, 9.0, 9.5], midterm: 9.2, finalTerm: 9.0 },
    averageScore: 9.1,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Thao tác ống nghiệm và pipet rất khéo léo trong giờ thực hành'
  },
  {
    id: 'HS-114',
    stt: 14,
    name: 'Nguyễn Thành Trung',
    gender: 'Nam',
    dob: '04/04/2007',
    classId: '12A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.5, 9.0, 9.5], midterm: 9.2, finalTerm: 9.6 },
    averageScore: 9.4,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Tốc độ giải đề Hóa thi THPT 40 câu đạt trên 9.0 điểm'
  },
  {
    id: 'HS-115',
    stt: 15,
    name: 'Phan Diệu Linh',
    gender: 'Nữ',
    dob: '16/09/2007',
    classId: '12A1',
    attendanceRate: 98,
    absentCount: 0,
    lateCount: 1,
    scores: { regular: [8.5, 8.5, 9.0], midterm: 8.8, finalTerm: 8.5 },
    averageScore: 8.6,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Vững lý thuyết este - lipit và polime tổng hợp'
  },
  {
    id: 'HS-116',
    stt: 16,
    name: 'Trần Đình Trọng',
    gender: 'Nam',
    dob: '22/01/2007',
    classId: '12A1',
    attendanceRate: 95,
    absentCount: 1,
    lateCount: 1,
    scores: { regular: [7.0, 7.5, 7.0], midterm: 7.0, finalTerm: 7.2 },
    averageScore: 7.2,
    completedAssignments: 4,
    totalAssignments: 5,
    status: 'Ổn định',
    note: 'Cần chú ý ôn lại bài toán bảo toàn electron và bảo toàn khối lượng'
  },
  {
    id: 'HS-117',
    stt: 17,
    name: 'Vũ Minh Quân',
    gender: 'Nam',
    dob: '08/07/2007',
    classId: '12A1',
    attendanceRate: 88,
    absentCount: 3,
    lateCount: 2,
    scores: { regular: [5.0, 4.5, 5.0], midterm: 4.8, finalTerm: 4.6 },
    averageScore: 4.8,
    completedAssignments: 2,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Hổng kiến thức hữu cơ 11, cần kế hoạch kèm riêng trước kỳ thi HK'
  },
  {
    id: 'HS-118',
    stt: 18,
    name: 'Lâm Thanh Trúc',
    gender: 'Nữ',
    dob: '31/12/2007',
    classId: '12A1',
    attendanceRate: 100,
    absentCount: 0,
    lateCount: 0,
    scores: { regular: [9.0, 9.5, 9.0], midterm: 9.0, finalTerm: 9.3 },
    averageScore: 9.2,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Tốt',
    note: 'Học sinh gương mẫu, lớp phó học tập kiêm hỗ trợ giải bài nhóm'
  },
  {
    id: 'HS-119',
    stt: 19,
    name: 'Hồ Chí Thiện',
    gender: 'Nam',
    dob: '15/06/2009',
    classId: '10A1',
    attendanceRate: 97,
    absentCount: 1,
    lateCount: 0,
    scores: { regular: [7.5, 8.0, 8.0], midterm: 7.8, finalTerm: 7.6 },
    averageScore: 7.7,
    completedAssignments: 5,
    totalAssignments: 5,
    status: 'Ổn định',
    note: 'Khá tích cực trong thảo luận nhóm, bài làm trình bày sạch đẹp'
  },
  {
    id: 'HS-120',
    stt: 20,
    name: 'Đoàn Thúy Vy',
    gender: 'Nữ',
    dob: '29/03/2008',
    classId: '11A1',
    attendanceRate: 93,
    absentCount: 2,
    lateCount: 0,
    scores: { regular: [6.0, 5.5, 6.5], midterm: 5.8, finalTerm: 5.5 },
    averageScore: 5.8,
    completedAssignments: 3,
    totalAssignments: 5,
    status: 'Cần chú ý',
    note: 'Vắng 2 buổi thực hành do ốm, cần bố trí kiểm tra bù cột thí nghiệm'
  }
];

/**
 * DANH SÁCH BÀI TẬP MẪU
 */
export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'BT-01',
    title: 'Phiếu học tập: Cấu tạo vỏ nguyên tử và Obitan nguyên tử (s, p, d)',
    classId: '10A1',
    assignedDate: '2026-09-10',
    dueDate: '2026-09-19',
    content: 'Hoàn thành 15 câu hỏi trắc nghiệm và 2 bài tập tự luận xác định cấu hình electron nguyên tử của các nguyên tố từ Z=1 đến Z=20.',
    completedCount: 38,
    totalCount: 42,
    status: 'Đang giao',
    type: 'Lý thuyết',
    notes: 'Nhắc nhở học sinh nộp trước 17h00 ngày thứ Sáu.'
  },
  {
    id: 'BT-02',
    title: 'Trắc nghiệm: Quy luật biến đổi tính chất trong Bảng tuần hoàn',
    classId: '10A2',
    assignedDate: '2026-09-12',
    dueDate: '2026-09-20',
    content: '20 câu hỏi trắc nghiệm rèn luyện so sánh bán kính nguyên tử, độ âm điện và tính kim loại - phi kim.',
    completedCount: 32,
    totalCount: 40,
    status: 'Đang giao',
    type: 'Bài tập trắc nghiệm',
    notes: 'Lớp 10A2 còn 8 em chưa nộp.'
  },
  {
    id: 'BT-03',
    title: 'Báo cáo thực hành số 1: Tốc độ phản ứng & Chuyển dịch cân bằng',
    classId: '11A1',
    assignedDate: '2026-09-08',
    dueDate: '2026-09-15',
    content: 'Viết báo cáo nhận xét hiện tượng thí nghiệm giữa dung dịch Na2S2O3 và H2SO4 khi thay đổi nồng độ và nhiệt độ.',
    completedCount: 38,
    totalCount: 38,
    status: 'Đã chấm xong',
    type: 'Thí nghiệm - Thực hành',
    notes: '100% học sinh nộp đúng hạn, kết quả thực hành đạt yêu cầu cao.'
  },
  {
    id: 'BT-04',
    title: 'Luyện đề số 04: Tổng hợp kiến thức Este - Cacbohiđrat - Amin',
    classId: '12A1',
    assignedDate: '2026-09-14',
    dueDate: '2026-09-22',
    content: 'Đề thi 40 câu cấu trúc chuẩn Bộ GD&ĐT phân hóa từ mức độ nhận biết đến vận dụng cao.',
    completedCount: 29,
    totalCount: 40,
    status: 'Đang giao',
    type: 'Bài tập trắc nghiệm',
    notes: 'Đề có câu phân loại về đipeptit và polime.'
  },
  {
    id: 'BT-05',
    title: 'Chuyên đề: Phân loại polime theo nguồn gốc và cấu trúc mạch',
    classId: '12A1',
    assignedDate: '2026-09-05',
    dueDate: '2026-09-12',
    content: 'Lập bảng phân biệt phản ứng trùng hợp và phản ứng trùng ngưng (tơ tằm, tơ visco, tơ nilon-6,6).',
    completedCount: 40,
    totalCount: 40,
    status: 'Đã kết thúc',
    type: 'Chuyên đề',
    notes: 'Đã chữa chi tiết trên lớp tiết 5 thứ Bảy.'
  }
];

/**
 * KẾ HOẠCH GIẢNG DẠY MẪU
 */
export const INITIAL_TEACHING_PLAN: TeachingPlanItem[] = [
  {
    id: 'KH-01',
    week: 1,
    classId: '10A1',
    topic: 'Bài 1: Nhập môn Hóa học & Các quy tắc an toàn trong phòng thí nghiệm',
    periods: 2,
    objectives: 'Nắm được đối tượng nghiên cứu của hóa học, vai trò của hóa học trong đời sống và kỹ năng xử lý tình huống khẩn cấp.',
    status: 'Hoàn thành',
    dateRange: '05/09 - 10/09',
    notes: 'Đã tổ chức hướng dẫn tại phòng thí nghiệm Hóa học.'
  },
  {
    id: 'KH-02',
    week: 2,
    classId: '10A1',
    topic: 'Bài 2: Thành phần nguyên tử - Hạt proton, nơtron, electron',
    periods: 3,
    objectives: 'Hiểu kích thước, khối lượng, điện tích của các hạt cấu tạo nên nguyên tử. Khái niệm điện tích hạt nhân và số khối.',
    status: 'Hoàn thành',
    dateRange: '11/09 - 16/09',
    notes: 'Học sinh làm tốt bài tập tính số hạt p, n, e.'
  },
  {
    id: 'KH-03',
    week: 3,
    classId: '10A1',
    topic: 'Bài 3: Cấu trúc lớp vỏ electron nguyên tử - Obitan nguyên tử',
    periods: 3,
    objectives: 'Viết được cấu hình electron của 20 nguyên tố đầu tiên trong BTH theo nguyên lý vững bền và quy tắc Hund.',
    status: 'Đang thực hiện',
    dateRange: '17/09 - 22/09',
    notes: 'Đang rèn luyện cho các em viết obitan ô lượng tử.'
  },
  {
    id: 'KH-04',
    week: 4,
    classId: '10A1',
    topic: 'Bài 4: Bảng tuần hoàn các nguyên tố hóa học - Ô, chu kỳ, nhóm',
    periods: 3,
    objectives: 'Mối liên hệ giữa cấu hình electron và vị trí nguyên tố trong BTH. Quy luật biến đổi tính chất.',
    status: 'Chưa dạy',
    dateRange: '23/09 - 28/09',
    notes: 'Chuẩn bị tranh ảnh và mô hình bảng tuần hoàn khổ lớn.'
  },
  {
    id: 'KH-05',
    week: 3,
    classId: '11A1',
    topic: 'Chương 3: Cân bằng hóa học & Biểu thức hằng số cân bằng Kc',
    periods: 2,
    objectives: 'Hiểu nguyên lý Le Chatelier, các yếu tố ảnh hưởng đến chuyển dịch cân bằng (nồng độ, nhiệt độ, áp suất).',
    status: 'Đang thực hiện',
    dateRange: '17/09 - 22/09',
    notes: 'Có thí nghiệm đối chứng với khí NO2 màu nâu đỏ.'
  },
  {
    id: 'KH-06',
    week: 3,
    classId: '12A1',
    topic: 'Chương 4: Đại cương về Polime - Cấu trúc và phương pháp điều chế',
    periods: 3,
    objectives: 'Phân loại polime thiên nhiên, nhân tạo và tổng hợp. Phương trình phản ứng trùng hợp và trùng ngưng.',
    status: 'Đang thực hiện',
    dateRange: '17/09 - 22/09',
    notes: 'Lồng ghép liên hệ thực tế về rác thải nhựa và bảo vệ môi trường.'
  }
];

/**
 * ĐIỂM DANH MẪU
 */
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'DD-2026-09-17-10A1',
    date: '2026-09-17',
    classId: '10A1',
    records: {
      'HS-101': 'present',
      'HS-102': 'present',
      'HS-103': 'excused',
      'HS-104': 'present',
      'HS-105': 'late',
      'HS-119': 'present'
    },
    note: 'Nguyễn Thảo My có đơn xin phép nghỉ do bị sốt nhẹ.'
  },
  {
    id: 'DD-2026-09-16-10A2',
    date: '2026-09-16',
    classId: '10A2',
    records: {
      'HS-106': 'present',
      'HS-107': 'present',
      'HS-108': 'absent',
      'HS-109': 'present'
    },
    note: 'Hoàng Thị Kim Ngân vắng không phép, đã báo GVCN.'
  }
];
