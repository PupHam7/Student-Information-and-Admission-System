/* ================================================================
   coe.js  —  Certificate of Enrollment

   Depends on official_student fields:
     studentNumber, firstName, lastName, course, department,
     yearLevel, sem, academicyear, dateenrolled, section

   API endpoint (added in SchedulingController.java):
     GET /api/official-students/student/{studentNumber}
   Schedule endpoint (existing in SchedulingController.java):
     GET /api/subjects?period={periodKey}&section={sectionId}
================================================================ */

const BASE_URL  = 'http://localhost:8080';
const studentId = localStorage.getItem('studentId');

/* ── Auth guard ── */
if (!studentId) {
  alert('Please login first.');
  window.location.href = 'index.html';
}

/* ── Entry point ── */
window.onload = function () {
  setLoadingState();
  loadOfficialData();
};

function setLoadingState() {
  ['semesterAY','student_id','first_name','course','department','enrollmentDate','courseYear']
    .forEach(id => setEl(id, '—'));
  const tbody = document.getElementById('scheduleTable');
  if (tbody) tbody.innerHTML =
    `<tr><td colspan="7" style="text-align:center;color:#888;">Loading schedule…</td></tr>`;
}

/* ── Label helpers ── */
const YEAR_LABELS = { '1':'1st Year', '2':'2nd Year', '3':'3rd Year', '4':'4th Year' };
const SEM_LABELS  = { '1':'First',    '2':'Second',   '3':'Summer'                   };

function yearLabel(raw) { return YEAR_LABELS[raw] || raw || 'N/A'; }
function semLabel(raw)  { return SEM_LABELS[raw]  || raw || 'N/A'; }
function toPeriodKey(yearLevel, sem) { return `${yearLevel}-${sem}`; }

/* ── Main data loader ── */
async function loadOfficialData() {
  try {
    // FIX (from previous session): URL now matches the new endpoint in
    // SchedulingController — GET /api/official-students/student/{studentNumber}
    const res = await fetch(
      `${BASE_URL}/api/registration/student/${studentId}`
    );

    if (!res.ok) {
      showAdmissionPending();
      return;
    }

    const data = await res.json();
    console.log('COE student data:', data);

    /* ── Populate header ── */
    setEl('student_id',     data.studentNumber);
    setEl('first_name',     `${data.lastName}, ${data.firstName}`);
    setEl('course',         data.course       || 'N/A');
    setEl('department',     data.department   || 'N/A');
    setEl('courseYear',     yearLabel(data.yearLevel));
    setEl('enrollmentDate', data.dateenrolled || 'N/A');
    setEl('semesterAY',
      data.sem && data.academicyear
        ? `${semLabel(data.sem)} Semester, Academic Year ${data.academicyear}`
        : 'Not yet enrolled');

    /* ── Load schedule ── */
    if (data.section && data.yearLevel && data.sem) {
      await loadSchedule(toPeriodKey(data.yearLevel, data.sem), data.section);
    } else {
      const tbody = document.getElementById('scheduleTable');
      if (tbody) tbody.innerHTML =
        `<tr><td colspan="7" style="text-align:center;color:#888;">
           No section assigned yet. Please complete enrollment via the Scheduling page.
         </td></tr>`;
    }

  } catch (err) {
    console.error('COE loadOfficialData error:', err);
    showAdmissionPending();
  }
}

/* ── Schedule loader ── */
async function loadSchedule(periodKey, sectionId) {
  const tbody   = document.getElementById('scheduleTable');
  const totalEl = document.getElementById('totalUnits');

  try {
    const res = await fetch(
      `${BASE_URL}/api/subjects` +
      `?period=${encodeURIComponent(periodKey)}&section=${encodeURIComponent(sectionId)}`
    );
    if (!res.ok) throw new Error(`Schedule API error: ${res.status}`);

    const subjects = await res.json();
    console.log('COE subjects:', subjects);

    if (!tbody) return;
    tbody.innerHTML = '';
    let total = 0;

    if (!subjects.length) {
      tbody.innerHTML =
        `<tr><td colspan="7" style="text-align:center;color:#888;">
           No subjects found for this section and period.
         </td></tr>`;
      if (totalEl) totalEl.textContent = '0';
      return;
    }

    subjects.forEach((s, i) => {
      total += Number(s.units || 0);
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${i + 1}</td>
          <td>${s.code}</td>
          <td>${s.name}</td>
          <td style="text-align:center">${s.units}</td>
          <td>${s.day} ${s.timeStart}–${s.timeEnd}</td>
          <td>${s.instructor}</td>
          <td>Section ${sectionId}</td>
        </tr>`);
    });

    if (totalEl) totalEl.textContent = total;

  } catch (err) {
    console.error('COE loadSchedule error:', err);
    if (tbody) tbody.innerHTML =
      `<tr><td colspan="7" style="color:red;text-align:center;">
         Failed to load schedule. Please try refreshing.
       </td></tr>`;
  }
}

/* ── Admission pending screen ── */
function showAdmissionPending() {
  document.body.innerHTML = `
    <div style="text-align:center;margin-top:80px;font-family:sans-serif;color:#003366;">
      <h2 style="margin-bottom:12px;">⏳ Admission Pending</h2>
      <p style="color:#555;max-width:400px;margin:0 auto 24px;">
        Your record is not yet validated. The COE will be available once
        the Admin approves your admission.
      </p>
      <button onclick="window.location.href='dashboard.html'"
        style="padding:10px 24px;background:#003366;color:#fff;
               border:none;border-radius:6px;cursor:pointer;font-size:14px;">
        Back to Dashboard
      </button>
    </div>`;
}

/* ── Shared helper ── */
function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = (value && value !== '') ? value : 'N/A';
}

/* ── Navigation & print ── */
function goAssessment() { window.location.href = 'assessment.html'; }
function printCOE()     { window.print(); }
function toggleMenu()   { /* sidebar handled by CSS in coe layout */ }