/* ================================================================
   assessment.js  —  Student Assessment / Schedule view

   Flow:
   1. Auth check — redirect to index if not logged in
   2. loadAdmission()
       a. GET /api/official-students/student/{studentId}
          → 404 / error  → "Admission Pending" screen
          → found, section is null → show Enroll button (→ Scheduling.html)
          → found, section is set  → load schedule + show "View COE" button
   3. loadSchedule(periodKey, sectionId)
       GET /api/subjects?period={periodKey}&section={sectionId}

   API base: http://localhost:8080
   Endpoint added in SchedulingController:
     GET /api/official-students/student/{studentNumber}
================================================================ */

const BASE_URL          = 'http://localhost:8080';
const loggedInStudentId = localStorage.getItem('studentId');

/* ── Single auth check ── */
if (!loggedInStudentId) {
  alert('Please login first.');
  window.location.href = 'index.html';
}

/* ── Entry point ── */
window.onload = function () {
  loadAdmission();
};

/* ── Label helpers (match Scheduling.html) ── */
const YEAR_LABELS = { '1':'1st Year', '2':'2nd Year', '3':'3rd Year', '4':'4th Year' };
const SEM_LABELS  = { '1':'First',    '2':'Second',   '3':'Summer'                   };

function yearLabel(raw) { return YEAR_LABELS[raw] || raw || 'N/A'; }
function semLabel(raw)  { return SEM_LABELS[raw]  || raw || 'N/A'; }

/** Builds the period key exactly the way Scheduling.html does: "${year}-${sem}" */
function toPeriodKey(yearLevel, sem) { return `${yearLevel}-${sem}`; }

/* ================================================================
   MAIN LOADER
================================================================ */
async function loadAdmission() {
  showLoading(true);

  try {
    // FIX (from previous session): correct URL now matches the new
    // GET /api/official-students/student/{studentNumber} endpoint
    // added in SchedulingController.java
    const res = await fetch(
      `${BASE_URL}/api/registration/student/${loggedInStudentId}`
    );

    if (!res.ok) {
      showPendingScreen();
      return;
    }

    const data = await res.json();
    console.log('Assessment student data:', data);

    /* ── Populate student info panel ── */
    setEl('First_name',  `${data.lastName}, ${data.firstName}`);
    setEl('courseYear',  `${data.course} — ${yearLabel(data.yearLevel)}`);
    setEl('department',  data.department || 'N/A');
    setEl('sex',         data.sex        || 'N/A');
    setEl('validated',   'Yes');  // being in official_student = admin-approved

    /* ── Period dropdown ── */
    const periodSelect = document.getElementById('period');
    if (periodSelect) {
      if (data.section && data.yearLevel && data.sem) {
        const label = `${semLabel(data.sem)} Semester AY ${data.academicyear || ''}`;
        periodSelect.innerHTML =
          `<option value="${toPeriodKey(data.yearLevel, data.sem)}">${label}</option>`;
      } else {
        periodSelect.innerHTML = `<option>Not yet enrolled</option>`;
      }
    }

    /* ── Decide button state ── */
    if (data.section && data.yearLevel && data.sem) {
      // Enrolled — show subjects + "View COE"
      setEnrolledState();
      await loadSchedule(toPeriodKey(data.yearLevel, data.sem), data.section);
    } else {
      // Approved but not yet scheduled
      setNotEnrolledState();
    }

  } catch (err) {
    console.error('loadAdmission error:', err);
    showPendingScreen();
  } finally {
    showLoading(false);
  }
}

/* ================================================================
   SCHEDULE LOADER
================================================================ */
async function loadSchedule(periodKey, sectionId) {
  const tbody   = document.getElementById('scheduleTable');
  const totalEl = document.getElementById('totalUnits');
  if (!tbody) return;

  tbody.innerHTML =
    `<tr><td colspan="7" style="text-align:center;color:#888;">Loading subjects…</td></tr>`;

  try {
    const res = await fetch(
      `${BASE_URL}/api/subjects` +
      `?period=${encodeURIComponent(periodKey)}&section=${encodeURIComponent(sectionId)}`
    );
    if (!res.ok) throw new Error(`Subjects API error: ${res.status}`);

    const subjects = await res.json();
    console.log('Assessment subjects:', subjects);

    tbody.innerHTML = '';
    let total = 0;

    if (!subjects.length) {
      tbody.innerHTML =
        `<tr><td colspan="7" style="text-align:center;color:#888;">
           No subjects found for this period and section.
         </td></tr>`;
      if (totalEl) totalEl.textContent = '0';
      return;
    }

    subjects.forEach(s => {
      total += Number(s.units || 0);
      // Subject entity: code, name, units, day, timeStart, timeEnd, room, instructor
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${s.code}</td>
          <td>${s.code}</td>
          <td>${s.name}</td>
          <td>${s.units}</td>
          <td>${s.day} ${s.timeStart}–${s.timeEnd}</td>
          <td>${s.instructor}</td>
          <td>Section ${sectionId}</td>
        </tr>`);
    });

    if (totalEl) totalEl.textContent = total;

  } catch (err) {
    console.error('loadSchedule error:', err);
    tbody.innerHTML =
      `<tr><td colspan="7" style="color:red;text-align:center;">
         Failed to load schedule. Please refresh and try again.
       </td></tr>`;
  }
}

/* ================================================================
   UI STATE HELPERS
================================================================ */

function setEnrolledState() {
  const message = document.getElementById('enrollMessage');
  const btn     = document.getElementById('actionBtn');

  if (message) {
    message.textContent      = 'You are officially enrolled for this term.';
    message.style.color      = 'green';
    message.style.fontWeight = 'bold';
    message.style.textAlign  = 'center';
  }
  if (btn) {
    btn.textContent = 'View COE';
    btn.className   = 'view-coe-btn';
    btn.onclick     = goToCOE;
  }
}

function setNotEnrolledState() {
  const message = document.getElementById('enrollMessage');
  const btn     = document.getElementById('actionBtn');
  const tbody   = document.getElementById('scheduleTable');
  const totalEl = document.getElementById('totalUnits');

  if (message) {
    message.textContent      = 'You have not enrolled yet for this term. Click Enroll to proceed.';
    message.style.color      = '#c49000';
    message.style.fontWeight = 'bold';
    message.style.textAlign  = 'center';
  }
  if (btn) {
    btn.textContent = 'Enroll';
    btn.className   = 'enroll-btn';
    btn.onclick     = () => { window.location.href = 'Scheduling.html'; };
  }
  if (tbody) tbody.innerHTML =
    `<tr><td colspan="7" style="text-align:center;color:#888;">No subjects enrolled yet.</td></tr>`;
  if (totalEl) totalEl.textContent = '0';
}

function showPendingScreen() {
  document.body.innerHTML = `
    <div style="text-align:center;margin-top:80px;font-family:sans-serif;color:#003366;">
      <h2 style="margin-bottom:12px;">⏳ Admission Pending</h2>
      <p style="color:#555;max-width:400px;margin:0 auto 24px;">
        Your record is not yet validated. You cannot access the Assessment page
        until the Admin approves your admission.
      </p>
      <button onclick="window.location.href='dashboard.html'"
        style="padding:10px 24px;background:#003366;color:#fff;
               border:none;border-radius:6px;cursor:pointer;font-size:14px;">
        Back to Dashboard
      </button>
    </div>`;
}

function showLoading(visible) {
  const el = document.getElementById('loadingIndicator');
  if (el) el.style.display = visible ? 'block' : 'none';
}

function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? 'N/A';
}

/* ================================================================
   MODAL / NAVIGATION
================================================================ */
function goToCOE()     { window.location.href = 'coe.html'; }
function handleEnroll() { document.getElementById('modalOverlay')?.classList.remove('hidden'); }
function confirmEnroll() { window.location.href = 'coe.html'; }
function goBack()      { document.getElementById('modalOverlay')?.classList.add('hidden'); }
function toggleMenu()  {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('hidden');
}