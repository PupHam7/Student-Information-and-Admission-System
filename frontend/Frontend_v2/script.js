/* ================================================================
   script.js  —  shared across login, dashboard, and admin pages
   ================================================================ */

const BASE_URL = 'http://localhost:8080';

/* ── Role select ── */
function selectRole(role) {
  localStorage.setItem('selectedRole', role);
  window.location.href = 'login.html';
}

/* ── Login ── */
async function handleLogin(event) {
  event.preventDefault();
  const studentNumber = document.getElementById('userId').value.trim();
  const password      = document.getElementById('password').value;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ studentNumber, password })
    });

    if (response.ok) {
      const student = await response.json();
      localStorage.setItem('studentId',   student.studentNumber);
      localStorage.setItem('studentName', `${student.firstName} ${student.lastName}`);
      // NOTE: isConfirmed is NOT a field on official_student — removed from here.
      window.location.href = 'dashboard.html';
    } else {
      const msg = await response.text();
      showError(msg || 'Invalid credentials. Please try again.');
    }
  } catch (err) {
    showError('Server connection failed. Is the backend running?');
  }
}

/* ── Password visibility toggle (login page only) ──
   MUST be inside DOMContentLoaded so we don't crash on pages
   that don't have #password / #togglePassword (e.g. admin-dashboard). */
document.addEventListener('DOMContentLoaded', function () {
  const passwordInput = document.getElementById('password');
  const toggleBtn     = document.getElementById('togglePassword');

  if (passwordInput && toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type    = 'text';
        toggleBtn.textContent = '👁️‍🗨️';
      } else {
        passwordInput.type    = 'password';
        toggleBtn.textContent = '👁';
      }
    });
  }
});

/* ── Dashboard helpers ── */
function show(name, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('hidden');
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

/* ── Dashboard — populate profile on load ── */
document.addEventListener('DOMContentLoaded', function () {
  const role          = localStorage.getItem('selectedRole') || 'Student';
  const studentNumber = localStorage.getItem('studentId');
  const studentName   = localStorage.getItem('studentName');

  const welcomeText = document.getElementById('welcomeName');
  if (welcomeText) {
    welcomeText.textContent = studentName ? studentName.split(' ')[0] : 'Student';
  }

  if (document.getElementById('profileId')) {
    if (!studentNumber) {
      window.location.href = 'index.html';
      return;
    }
    document.getElementById('profileId').textContent  = studentNumber;
    document.getElementById('profileRole').textContent = role;

    const avatar = document.getElementById('avatar');
    if (avatar && studentName) {
      avatar.textContent = studentName.charAt(0).toUpperCase();
    }
  }
});

/* ── Admin — load pending admissions on page load ──
   Guarded: only runs if the admissions table body exists on this page. */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('admissionTableBody')) {
    loadPendingAdmissions();
  }
});

/* ── Admin — fetch & render applicants ── */
async function loadPendingAdmissions() {
  const tableBody = document.getElementById('admissionTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = "<tr><td colspan='5'>Loading applications…</td></tr>";

  try {
    const response = await fetch(`${BASE_URL}/api/admissions`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const admissions = await response.json();
    console.log('Admissions data:', admissions);

    tableBody.innerHTML = '';

    if (!admissions.length) {
      tableBody.innerHTML =
        "<tr><td colspan='5'>No applications found in the database.</td></tr>";
      return;
    }

    admissions.forEach(adm => {
      // The backend returns Applicant objects; name/email live in personalData
      const firstName   = adm.personalData?.firstName   || '';
      const lastName    = adm.personalData?.lastName    || '';
      const email       = adm.personalData?.emailAddress || 'N/A';
      const isApproved  = adm.admissionData?.isConfirmed === true;
      const statusText  = isApproved ? 'APPROVED' : 'PENDING';
      const statusClass = isApproved ? 'status-approved' : 'status-pending';

      const actionContent = isApproved
        ? `<span class="processed-label">Processed</span>`
        : `<button class="approve-btn" onclick="updateStatus(${adm.id}, 'APPROVED')">Approve</button>
           <button class="reject-btn"  onclick="updateStatus(${adm.id}, 'REJECTED')">Reject</button>`;

      tableBody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${adm.id ?? 'N/A'}</td>
          <td>${firstName} ${lastName}</td>
          <td>${email}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${actionContent}</td>
        </tr>`);
    });

  } catch (error) {
    console.error('loadPendingAdmissions error:', error);
    tableBody.innerHTML =
      `<tr><td colspan='5' style='color:red;'>Error: ${error.message}</td></tr>`;
  }
}

/* ── Admin — approve or reject an applicant ── */
async function updateStatus(admissionId, status) {
  const action = status === 'APPROVED' ? 'approve' : 'reject';
  if (!confirm(`Are you sure you want to ${action} this student?`)) return;

  try {
    const response = await fetch(
      `${BASE_URL}/api/registration/${admissionId}/validate`,
      {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ status })   // FIX: was missing — backend needs the decision
      }
    );

    if (response.ok) {
      showPopup(
        'Application processed successfully. Student can now claim credentials in the portal.',
        'success'
      );
      loadPendingAdmissions();
    } else {
      const err = await response.json().catch(() => ({}));
      showPopup('Error: ' + (err.message || 'Failed to update status.'), 'error');
    }
  } catch (error) {
    console.error('updateStatus error:', error);
    showPopup('Server connection failed. Please check if the backend is running.', 'error');
  }
}

/* ================================================================
   Popup / Error helpers
   Used by login.html (showError) and admin-dashboard.html (showPopup).
   Both pages must have: #darkOverlay, #errorPopup, #errorMessage, #popupTitle
   ================================================================ */

function showError(msg) {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  const msgEl   = document.getElementById('errorMessage');
  const title   = document.getElementById('popupTitle');

  if (!popup || !msgEl) { alert(msg); return; }   // safe fallback

  msgEl.innerText = msg;
  if (title) { title.innerHTML = '⚠ Error'; title.style.color = 'red'; }
  if (overlay) overlay.style.display = 'block';
  popup.style.display = 'block';
}

function showPopup(message, type = 'error') {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  const msgEl   = document.getElementById('errorMessage');
  const title   = document.getElementById('popupTitle');

  if (!popup || !msgEl) { alert(message); return; }  // safe fallback

  msgEl.innerText = message;
  if (overlay) overlay.style.display = 'block';
  popup.style.display = 'block';

  if (title) {
    if      (type === 'success') { title.innerHTML = '✅ Success';        title.style.color = 'green';   }
    else if (type === 'confirm') { title.innerHTML = '❓ Confirm Action'; title.style.color = '#ff9800'; }
    else                         { title.innerHTML = '⚠ Error';           title.style.color = 'red';     }
  }
}

function closePopup() {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  if (overlay) overlay.style.display = 'none';
  if (popup)   popup.style.display   = 'none';
}

// Alias kept for any older onclick="closeError()" in HTML
function closeError() { closePopup(); }
