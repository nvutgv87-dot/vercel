import { 
  TeacherProfile, 
  ClassItem, 
  StudentItem, 
  AssignmentItem, 
  TeachingPlanItem, 
  AttendanceRecord,
  GradeConfig
} from '../types';

export function exportToSingleHtmlFile(data: {
  teacher: TeacherProfile;
  classes: ClassItem[];
  students: StudentItem[];
  assignments: AssignmentItem[];
  plans: TeachingPlanItem[];
  attendance: AttendanceRecord[];
  gradeConfig: GradeConfig;
}): void {
  const jsonTeacher = JSON.stringify(data.teacher, null, 2);
  const jsonClasses = JSON.stringify(data.classes, null, 2);
  const jsonStudents = JSON.stringify(data.students, null, 2);
  const jsonAssignments = JSON.stringify(data.assignments, null, 2);
  const jsonPlans = JSON.stringify(data.plans, null, 2);
  const jsonAttendance = JSON.stringify(data.attendance, null, 2);
  const jsonConfig = JSON.stringify(data.gradeConfig, null, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QUẢN TRỊ HỌC TẬP – Hóa học THPT (Bản ngoại tuyến)</title>
  <style>
    :root {
      --primary: #1e40af;
      --primary-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; }
    
    /* Layout */
    .sidebar { width: 260px; background: #ffffff; border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-header { padding: 18px; border-bottom: 1px solid var(--border); }
    .sidebar-header h2 { font-size: 16px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; }
    .sidebar-header p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    
    .nav-list { list-style: none; padding: 12px 8px; flex: 1; overflow-y: auto; }
    .nav-item { padding: 10px 14px; margin-bottom: 4px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #475569; display: flex; align-items: center; gap: 10px; transition: all 0.15s; }
    .nav-item:hover { background-color: #f1f5f9; color: var(--primary); }
    .nav-item.active { background-color: #eff6ff; color: var(--primary); font-weight: 600; }
    
    .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); background: #f8fafc; }
    .teacher-badge { display: flex; align-items: center; gap: 10px; }
    .teacher-avatar { width: 36px; height: 36px; border-radius: 50%; background: #dbeafe; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
    .teacher-info h4 { font-size: 13px; font-weight: 600; }
    .teacher-info p { font-size: 11px; color: var(--text-muted); }
    
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { height: 60px; background: #ffffff; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
    .topbar h1 { font-size: 17px; font-weight: 700; color: #1e293b; }
    .topbar-actions { display: flex; align-items: center; gap: 12px; }
    
    .content-area { flex: 1; padding: 24px; overflow-y: auto; }
    
    /* Components */
    .card { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.04); padding: 20px; margin-bottom: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    
    .stat-card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; }
    .stat-val { font-size: 26px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
    
    .btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-outline { background: white; border: 1px solid var(--border); color: #334155; }
    .btn-outline:hover { background: #f8fafc; }
    .btn-danger { background: #fee2e2; color: #b91c1c; }
    .btn-danger:hover { background: #fecaca; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    
    .badge { display: inline-block; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-danger { background: #fee2e2; color: #b91c1c; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }

    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f8fafc; color: #475569; font-weight: 600; padding: 12px; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    tr:hover { background-color: #fafafa; }
    
    .table-container { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
    .search-input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; width: 240px; }
    .filter-select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; background: white; }
    
    .notice-bar { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
    
    @media (max-width: 768px) {
      body { flex-direction: column; }
      .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
      .grid-2 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>QUẢN TRỊ HỌC TẬP</h2>
      <p>Môn Hóa học THPT</p>
    </div>
    <ul class="nav-list">
      <li class="nav-item active" onclick="switchTab('dashboard')">📊 1. Tổng quan</li>
      <li class="nav-item" onclick="switchTab('classes')">🏫 2. Lớp học</li>
      <li class="nav-item" onclick="switchTab('students')">🎓 3. Học sinh</li>
      <li class="nav-item" onclick="switchTab('attendance')">✅ 4. Chuyên cần</li>
      <li class="nav-item" onclick="switchTab('grades')">📝 5. Điểm số</li>
      <li class="nav-item" onclick="switchTab('assignments')">📚 6. Bài tập</li>
      <li class="nav-item" onclick="switchTab('teaching_plan')">📅 7. Kế hoạch giảng dạy</li>
      <li class="nav-item" onclick="switchTab('statistics')">📈 8. Thống kê</li>
    </ul>
    <div class="sidebar-footer">
      <div class="teacher-badge">
        <div class="teacher-avatar" id="avatarLetter">NVÚ</div>
        <div class="teacher-info">
          <h4 id="sidebarTeacherName">${data.teacher.name}</h4>
          <p id="sidebarTeacherTitle">${data.teacher.title}</p>
          <p id="sidebarTeacherSchool">${data.teacher.school}</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- MAIN AREA -->
  <main class="main">
    <header class="topbar">
      <h1 id="tabHeading">Dashboard Tổng quan</h1>
      <div class="topbar-actions">
        <button class="btn btn-outline btn-sm" onclick="resetToDemo()">Khôi phục dữ liệu mẫu</button>
      </div>
    </header>

    <div class="content-area" id="contentRoot">
      <!-- Content rendered by JavaScript -->
    </div>
  </main>

  <script>
    // DỮ LIỆU ĐƯỢC NHÚNG TRỰC TIẾP
    const initialData = {
      teacher: ${jsonTeacher},
      classes: ${jsonClasses},
      students: ${jsonStudents},
      assignments: ${jsonAssignments},
      plans: ${jsonPlans},
      attendance: ${jsonAttendance},
      gradeConfig: ${jsonConfig}
    };

    let appData = (() => {
      try {
        const saved = localStorage.getItem('chem_lms_offline_data');
        return saved ? JSON.parse(saved) : initialData;
      } catch (e) {
        return initialData;
      }
    })();

    function persist() {
      localStorage.setItem('chem_lms_offline_data', JSON.stringify(appData));
    }

    let currentTab = 'dashboard';

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.nav-item').forEach((el, idx) => {
        const tabs = ['dashboard', 'classes', 'students', 'attendance', 'grades', 'assignments', 'teaching_plan', 'statistics'];
        if (tabs[idx] === tab) el.classList.add('active');
        else el.classList.remove('active');
      });
      render();
    }

    function resetToDemo() {
      if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu demo mặc định không?')) {
        appData = JSON.parse(JSON.stringify(initialData));
        persist();
        render();
        alert('Đã khôi phục dữ liệu demo thành công!');
      }
    }

    function render() {
      const root = document.getElementById('contentRoot');
      const heading = document.getElementById('tabHeading');

      if (currentTab === 'dashboard') {
        heading.innerText = 'Tổng quan hoạt động giảng dạy';
        const attentionStudents = appData.students.filter(s => s.status === 'Cần chú ý');
        const activeAssignments = appData.assignments.filter(a => a.status === 'Đang giao');

        root.innerHTML = \`
          <div class="notice-bar">
            <strong>Bản lưu trữ cá nhân:</strong> Dữ liệu được lưu trực tiếp trong trình duyệt máy tính của bạn (LocalStorage).
          </div>
          <div class="card" style="border-left: 4px solid var(--primary);">
            <h2>Xin chào, thầy \${appData.teacher.name}</h2>
            <p style="color: var(--text-muted); margin-top: 4px;">Tổng quan hoạt động giảng dạy môn \${appData.teacher.subject} - Trường \${appData.teacher.school}</p>
          </div>

          <div class="grid-4">
            <div class="stat-card">
              <div>
                <div class="stat-label">Số lớp đang dạy</div>
                <div class="stat-val">\${appData.classes.length}</div>
              </div>
              <span style="font-size: 28px;">🏫</span>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Tổng số học sinh</div>
                <div class="stat-val">\${appData.students.length}</div>
              </div>
              <span style="font-size: 28px;">🎓</span>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Bài tập đang giao</div>
                <div class="stat-val">\${activeAssignments.length}</div>
              </div>
              <span style="font-size: 28px;">📚</span>
            </div>
            <div class="stat-card" style="border-color: #fecaca; background: #fffdfd;">
              <div>
                <div class="stat-label" style="color: #b91c1c;">Học sinh cần chú ý</div>
                <div class="stat-val" style="color: #dc2626;">\${attentionStudents.length}</div>
              </div>
              <span style="font-size: 28px;">⚠️</span>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3 style="margin-bottom: 14px;">Lịch dạy & Công việc gần đây</h3>
              <ul style="list-style: none;">
                \${appData.classes.map(c => \`
                  <li style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between;">
                    <div>
                      <strong>Lớp \${c.name}</strong> (\${c.room})
                      <div style="font-size: 12px; color: var(--text-muted);">\${c.schedule}</div>
                    </div>
                    <span class="badge badge-blue">Tiến độ: \${c.progress}%</span>
                  </li>
                \`).join('')}
              </ul>
            </div>

            <div class="card">
              <h3 style="margin-bottom: 14px; color: #b91c1c;">Học sinh cần quan tâm & hỗ trợ</h3>
              <ul style="list-style: none;">
                \${attentionStudents.map(s => \`
                  <li style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>\${s.name}</strong> - Lớp \${s.classId}
                      <div style="font-size: 12px; color: #dc2626;">\${s.note || 'Điểm số hoặc chuyên cần thấp'}</div>
                    </div>
                    <div>
                      <span class="badge badge-danger">ĐTB: \${s.averageScore}</span>
                    </div>
                  </li>
                \`).join('')}
              </ul>
            </div>
          </div>
        \`;
      } else if (currentTab === 'classes') {
        heading.innerText = 'Quản lý Lớp học';
        root.innerHTML = \`
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3>Danh sách các lớp đang giảng dạy (\${appData.classes.length} lớp)</h3>
              <button class="btn btn-primary" onclick="addClassPrompt()">+ Thêm lớp</button>
            </div>
            <div class="grid-2">
              \${appData.classes.map(c => \`
                <div class="card" style="margin-bottom: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <h2 style="font-size: 20px; color: var(--primary);">Lớp \${c.name}</h2>
                      <p style="font-size: 12px; color: var(--text-muted);">\${c.room}</p>
                    </div>
                    <span class="badge badge-blue">Sĩ số: \${c.studentCount} em</span>
                  </div>
                  <div style="margin: 14px 0; font-size: 13px;">
                    <p><strong>Giáo viên:</strong> \${appData.teacher.name} (\${appData.teacher.subject})</p>
                    <p><strong>Chuyên đề hiện tại:</strong> \${c.currentTopic}</p>
                    <p><strong>Lịch dạy:</strong> \${c.schedule}</p>
                    <div style="margin-top: 8px;">
                      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                        <span>Tiến độ chương trình:</span>
                        <strong>\${c.progress}%</strong>
                      </div>
                      <div style="background: #e2e8f0; border-radius: 10px; height: 6px; overflow: hidden;">
                        <div style="background: var(--primary); width: \${c.progress}%; height: 100%;"></div>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
                    <button class="btn btn-outline btn-sm" onclick="editClass('\${c.id}')">Sửa thông tin</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClass('\${c.id}')">Xóa lớp</button>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (currentTab === 'students') {
        heading.innerText = 'Quản lý Danh sách học sinh';
        root.innerHTML = \`
          <div class="card">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
              <input type="text" class="search-input" id="studentSearch" placeholder="Tìm kiếm học sinh theo tên..." oninput="filterStudentsTable()">
              <div style="display: flex; gap: 8px;">
                <select class="filter-select" id="classFilter" onchange="filterStudentsTable()">
                  <option value="all">Tất cả các lớp</option>
                  \${appData.classes.map(c => \`<option value="\${c.id}">Lớp \${c.name}</option>\`).join('')}
                </select>
                <select class="filter-select" id="statusFilter" onchange="filterStudentsTable()">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Tốt">Tốt</option>
                  <option value="Ổn định">Ổn định</option>
                  <option value="Cần chú ý">Cần chú ý</option>
                </select>
                <button class="btn btn-primary" onclick="addStudentPrompt()">+ Thêm học sinh</button>
              </div>
            </div>
            <div class="table-container">
              <table id="studentsTable">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Lớp</th>
                    <th>Chuyên cần</th>
                    <th>Điểm TB</th>
                    <th>Bài tập</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody id="studentTbody">
                  \${renderStudentsRows(appData.students)}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else {
        root.innerHTML = \`
          <div class="card">
            <h3>Mục \${heading.innerText}</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Vui lòng sử dụng giao diện đầy đủ trực tuyến để trải nghiệm trọn vẹn mọi tính năng tương tác chuyên sâu.</p>
          </div>
        \`;
      }
    }

    function renderStudentsRows(list) {
      return list.map((s, idx) => {
        let badgeClass = 'badge-success';
        if (s.status === 'Ổn định') badgeClass = 'badge-blue';
        if (s.status === 'Cần chú ý') badgeClass = 'badge-danger';

        return \`
          <tr>
            <td>\${idx + 1}</td>
            <td><strong>\${s.name}</strong><br><small style="color: var(--text-muted)">\${s.note || ''}</small></td>
            <td>\${s.classId}</td>
            <td>\${s.attendanceRate}%</td>
            <td><strong>\${s.averageScore}</strong></td>
            <td>\${s.completedAssignments}/\${s.totalAssignments}</td>
            <td><span class="badge \${badgeClass}">\${s.status}</span></td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="editStudentScore('\${s.id}')">Điểm</button>
              <button class="btn btn-danger btn-sm" onclick="deleteStudent('\${s.id}')">Xóa</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function filterStudentsTable() {
      const kw = (document.getElementById('studentSearch')?.value || '').toLowerCase().trim();
      const cls = document.getElementById('classFilter')?.value || 'all';
      const st = document.getElementById('statusFilter')?.value || 'all';

      const filtered = appData.students.filter(s => {
        const matchKw = !kw || s.name.toLowerCase().includes(kw);
        const matchCls = cls === 'all' || s.classId === cls;
        const matchSt = st === 'all' || s.status === st;
        return matchKw && matchCls && matchSt;
      });

      const tbody = document.getElementById('studentTbody');
      if (tbody) tbody.innerHTML = renderStudentsRows(filtered);
    }

    function addClassPrompt() {
      const name = prompt('Nhập tên lớp (Ví dụ: 10A3):');
      if (!name) return;
      const count = parseInt(prompt('Nhập sĩ số học sinh:', '40')) || 40;
      const newClass = {
        id: name.toUpperCase().trim(),
        name: name.toUpperCase().trim(),
        grade: parseInt(name) || 10,
        room: 'Phòng học mới',
        studentCount: count,
        progress: 0,
        currentTopic: 'Chương 1: Mở đầu Hóa học',
        schedule: 'Đang xếp thời khóa biểu'
      };
      appData.classes.push(newClass);
      persist();
      render();
      alert('Đã thêm lớp ' + newClass.name + ' thành công!');
    }

    function deleteClass(id) {
      if (confirm('Bạn có chắc chắn muốn xóa lớp ' + id + ' không? Toàn bộ học sinh thuộc lớp này sẽ được cập nhật.')) {
        appData.classes = appData.classes.filter(c => c.id !== id);
        persist();
        render();
        alert('Đã xóa lớp thành công!');
      }
    }

    function editClass(id) {
      const cls = appData.classes.find(c => c.id === id);
      if (!cls) return;
      const newTopic = prompt('Chỉnh sửa chuyên đề giảng dạy hiện tại:', cls.currentTopic);
      if (newTopic !== null) {
        cls.currentTopic = newTopic;
        const newProg = parseInt(prompt('Cập nhật tiến độ % (0-100):', String(cls.progress)));
        if (!isNaN(newProg)) cls.progress = Math.min(100, Math.max(0, newProg));
        persist();
        render();
      }
    }

    function addStudentPrompt() {
      const name = prompt('Nhập họ và tên học sinh:');
      if (!name) return;
      const classId = prompt('Nhập mã lớp (Ví dụ: ' + appData.classes.map(c => c.id).join(', ') + '):', appData.classes[0]?.id || '10A1');
      const newStudent = {
        id: 'HS-' + Date.now(),
        stt: appData.students.length + 1,
        name: name.trim(),
        gender: 'Nam',
        dob: '01/01/2009',
        classId: classId || '10A1',
        attendanceRate: 100,
        absentCount: 0,
        lateCount: 0,
        scores: { regular: [8.0], midterm: 8.0, finalTerm: 8.0 },
        averageScore: 8.0,
        completedAssignments: 5,
        totalAssignments: 5,
        status: 'Ổn định',
        note: 'Học sinh mới thêm'
      };
      appData.students.push(newStudent);
      persist();
      render();
      alert('Đã thêm học sinh ' + name + ' thành công!');
    }

    function deleteStudent(id) {
      if (confirm('Bạn có chắc chắn muốn xóa học sinh này không?')) {
        appData.students = appData.students.filter(s => s.id !== id);
        persist();
        render();
      }
    }

    function editStudentScore(id) {
      const s = appData.students.find(x => x.id === id);
      if (!s) return;
      const input = prompt('Nhập điểm trung bình mới cho học sinh ' + s.name + ':', String(s.averageScore));
      if (input !== null) {
        const val = parseFloat(input);
        if (!isNaN(val) && val >= 0 && val <= 10) {
          s.averageScore = val;
          if (val < 5.0) s.status = 'Cần chú ý';
          else if (val >= 8.0) s.status = 'Tốt';
          else s.status = 'Ổn định';
          persist();
          render();
        } else {
          alert('Điểm không hợp lệ! Vui lòng nhập từ 0 đến 10.');
        }
      }
    }

    // Khởi chạy ban đầu
    window.addEventListener('DOMContentLoaded', () => {
      render();
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'QUAN_TRI_HOC_TAP_HOA_HOC_THPT.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
