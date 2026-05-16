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
      window.location.href = 'dashboard.html';
    } else {
      const msg = await response.text();
      showError(msg || 'Invalid credentials. Please try again.');
    }
  } catch (err) {
    showError('Server connection failed. Is the backend running?');
  }
}

/* ── Password visibility toggle (login page only) ── */
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
    document.getElementById('profileId').textContent   = studentNumber;
    document.getElementById('profileRole').textContent = role;

    const avatar = document.getElementById('avatar');
    if (avatar && studentName) {
      avatar.textContent = studentName.charAt(0).toUpperCase();
    }
  }

  /* ── Dynamic greeting ── */
  const greetingEl = document.getElementById('dynamicGreeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    greetingEl.textContent =
      hour < 12 ? 'Good morning'
      : hour < 18 ? 'Good afternoon'
      : 'Good evening';
  }
});

/* ── Admin — load pending admissions on page load ── */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('admissionTableBody')) {
    loadPendingAdmissions();
  }
});

/* ── Admin — fetch & render applicants ── */
async function loadPendingAdmissions() {
  const tableBody = document.getElementById('admissionTableBody');
  if (!tableBody) return;

  tableBody.innerHTML =
    "<tr><td colspan='5' style='text-align:center;color:#888;'>Loading applications…</td></tr>";

  try {
    const response = await fetch(`${BASE_URL}/api/admissions`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const admissions = await response.json();

    tableBody.innerHTML = '';

    if (!admissions.length) {
      tableBody.innerHTML =
        "<tr><td colspan='5' style='text-align:center;color:#888;'>No applications found.</td></tr>";
      return;
    }

    admissions.forEach(adm => {
      const firstName  = adm.personalData?.firstName    || '';
      const lastName   = adm.personalData?.lastName     || '';
      const email      = adm.personalData?.emailAddress || 'N/A';
      const isApproved = adm.admissionData?.isConfirmed === true;
      const statusText  = isApproved ? 'APPROVED' : 'PENDING';
      const statusClass = isApproved ? 'status-approved' : 'status-pending';

      const actionContent = isApproved
        ? `<span class="processed-label">✔ Processed</span>`
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
      `<tr><td colspan='5' style='color:red;text-align:center;'>Error: ${error.message}</td></tr>`;
  }
}

/* ── Admin — approve or reject an applicant ── */
async function updateStatus(admissionId, status) {
  const action = status === 'APPROVED' ? 'approve' : 'reject';
  if (!confirm(`Are you sure you want to ${action} this applicant?`)) return;

  try {
    const response = await fetch(
      `${BASE_URL}/api/registration/${admissionId}/validate`,
      {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ status })
      }
    );

    if (response.ok) {
      showPopup(
        status === 'APPROVED'
          ? '✅ Application approved! The student may now claim credentials in the portal.'
          : '🗑 Application has been rejected.',
        status === 'APPROVED' ? 'success' : 'error'
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
   Requires in HTML: #darkOverlay, #errorPopup, #errorMessage,
                     #popupTitle, #popupOkBtn
   ================================================================ */

const POPUP_STYLES = {
  success: { border: '#22c55e', title: '✅ Success',        btn: '#22c55e', color: '#166534' },
  confirm: { border: '#f97316', title: '❓ Confirm Action', btn: '#f97316', color: '#9a3412' },
  error  : { border: '#ef4444', title: '⚠ Error',           btn: '#ef4444', color: '#991b1b' },
};

function _applyPopupStyle(type) {
  const style  = POPUP_STYLES[type] || POPUP_STYLES.error;
  const popup  = document.getElementById('errorPopup');
  const title  = document.getElementById('popupTitle');
  const okBtn  = document.getElementById('popupOkBtn');

  if (popup)  popup.style.borderLeftColor = style.border;
  if (title) { title.innerHTML = style.title; title.style.color = style.color; }
  if (okBtn) { okBtn.style.background = style.btn; }
}

function showError(msg) {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  const msgEl   = document.getElementById('errorMessage');

  if (!popup || !msgEl) { alert(msg); return; }

  msgEl.innerText = msg;
  _applyPopupStyle('error');
  if (overlay) overlay.style.display = 'block';
  popup.style.display = 'block';
}

function showPopup(message, type = 'error') {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  const msgEl   = document.getElementById('errorMessage');

  if (!popup || !msgEl) { alert(message); return; }

  msgEl.innerText = message;
  _applyPopupStyle(type);
  if (overlay) overlay.style.display = 'block';
  popup.style.display = 'block';
}

function closePopup() {
  const overlay = document.getElementById('darkOverlay');
  const popup   = document.getElementById('errorPopup');
  if (overlay) overlay.style.display = 'none';
  if (popup)   popup.style.display   = 'none';
}

/* Alias for any older onclick="closeError()" in HTML */
function closeError() { closePopup(); }