/* ================================================================
   portal.js  —  Status Portal

   Flow:
   1. Student enters control number + last name → "Check Status"
      → GET /api/admissions/status/{controlNumber}?lastName={lastName}
      → Shows applicant info + approval badge

   2. If APPROVED → "Generate Student ID & Password" enabled
      → GET /api/registration/claim?controlNumber=...&lastName=...
      → Displays student number + password

   3. If PENDING → button disabled with clear message

   KEY FIX:
   The backend returns the Applicant object where isConfirmed lives
   inside admissionData, i.e. applicant.admissionData.isConfirmed.
   The old code read applicant.isConfirmed (always undefined → always
   showed PENDING).  resolveConfirmed() checks every possible location
   and type (boolean true, integer 1, string "true"/"yes"/"approved").
================================================================ */

const BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function () {

  const controlInput  = document.getElementById('controlNumber');
  const nameInput     = document.getElementById('lastName');
  const submitBtn     = document.getElementById('enterPortalBtn');
  const loginSection  = document.getElementById('loginSection');
  const statusSection = document.getElementById('statusSection');
  const generateBtn   = document.getElementById('generateCredsBtn');
  const credDisplay   = document.getElementById('credDisplay');

  let cachedControlNumber = '';
  let cachedLastName      = '';

  /* ── Enable / disable Check Status based on input ── */
  function validateInputs() {
    const ctrl = controlInput.value.trim();
    const last = nameInput.value.trim();
    submitBtn.disabled = !(ctrl.length >= 1 && last.length >= 2);
  }
  controlInput.addEventListener('input', validateInputs);
  nameInput.addEventListener('input', validateInputs);

  /* ── Auto-uppercase last name ── */
  nameInput.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
  });

  /* ── Enter key submits ── */
  [controlInput, nameInput].forEach(el => {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });
  });

  /* ================================================================
     resolveConfirmed(applicant)

     Checks every place the backend might store the approval flag:
       • applicant.admissionData.isConfirmed   ← most likely (nested)
       • applicant.isConfirmed                 ← flat version
       • applicant.admissionData.status        ← some backends use a string
       • applicant.status

     Accepts:  boolean true, integer 1, strings "true"/"yes"/"approved"
     Rejects:  false, 0, null, undefined, "false"/"pending"/"no"
  ================================================================ */
  function resolveConfirmed(applicant) {
    // Log the full response so you can see the exact shape in DevTools
    console.log('Portal applicant response:', JSON.stringify(applicant, null, 2));

    // All candidate values to check, in priority order
    const candidates = [
      applicant?.admissionData?.isConfirmed,   // nested — most common
      applicant?.isConfirmed,                  // flat
      applicant?.admissionData?.status,        // string status in admissionData
      applicant?.status,                       // string status flat
      applicant?.admissionData?.confirmed,     // alternate field name
      applicant?.confirmed,
    ];

    for (const val of candidates) {
      if (val === undefined || val === null) continue;

      // Boolean / number
      if (val === true  || val === 1)  return true;
      if (val === false || val === 0)  return false;

      // String
      if (typeof val === 'string') {
        const v = val.trim().toLowerCase();
        if (['true', 'yes', 'approved', '1'].includes(v)) return true;
        if (['false', 'no', 'pending', 'rejected', '0'].includes(v)) return false;
      }
    }

    // Nothing conclusive found — treat as pending
    console.warn('Portal: could not resolve isConfirmed from response. Defaulting to PENDING.');
    return false;
  }

  /* ================================================================
     CHECK STATUS
  ================================================================ */
  submitBtn.addEventListener('click', async function () {

    const controlNumber = controlInput.value.trim();
    const lastName      = nameInput.value.trim();

    clearPortalError();
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Checking…';

    try {
      const response = await fetch(
        `${BASE_URL}/api/admissions/status/${encodeURIComponent(controlNumber)}` +
        `?lastName=${encodeURIComponent(lastName)}`
      );

      if (!response.ok) {
        const msg = await response.text();
        showPortalError(msg || 'Control number or last name is incorrect.');
        resetSubmitBtn();
        return;
      }

      const applicant = await response.json();

      cachedControlNumber = controlNumber;
      cachedLastName      = lastName;

      /* ── Populate applicant info ── */
      // Name may live at top level or inside personalData
      const firstName  = applicant?.personalData?.firstName  || applicant?.firstName  || '';
      const middleName = applicant?.personalData?.middleName || applicant?.middleName || '';
      const lastName_  = applicant?.personalData?.lastName   || applicant?.lastName   || '';
      const fullName   = [firstName, middleName, lastName_].filter(Boolean).join(' ');

      document.getElementById('displayName').textContent =
        fullName || '(Name not found)';
      document.getElementById('displayControlNo').textContent =
        applicant?.controlNumber || applicant?.admissionData?.controlNumber || controlNumber;

      // Preferred course
      const courseSpan = document.getElementById('course1Choice');
      if (courseSpan) {
        const course = applicant?.preferredCourse
          || applicant?.admissionData?.preferredCourse
          || applicant?.personalData?.preferredCourse;
        courseSpan.textContent = course
          ? `1st Choice: ${course}`
          : 'Result not yet available.';
      }

      /* ── Resolve approval status (the fixed part) ── */
      const isConfirmed = resolveConfirmed(applicant);

      renderApprovalBadge(isConfirmed);

      const promptMsg = document.getElementById('enrollPromptMsg');
      if (isConfirmed) {
        generateBtn.disabled      = false;
        generateBtn.title         = '';
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor  = 'pointer';
        if (promptMsg) promptMsg.textContent =
          'Your admission is approved! Generate your login credentials below.';
      } else {
        generateBtn.disabled      = true;
        generateBtn.title         = 'Wait for admin approval first.';
        generateBtn.style.opacity = '0.45';
        generateBtn.style.cursor  = 'not-allowed';
        if (promptMsg) promptMsg.textContent =
          'Your application is still under review. Please check back later.';
      }

      /* ── Show status section ── */
      loginSection.style.display  = 'none';
      statusSection.style.display = 'block';
      if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
      console.error('Portal check error:', error);
      showPortalError('Server error. Please check if the backend is running.');
      resetSubmitBtn();
    }
  });

  /* ================================================================
     GENERATE CREDENTIALS
  ================================================================ */
  generateBtn.addEventListener('click', async function () {

    if (generateBtn.disabled) return;

    generateBtn.disabled    = true;
    generateBtn.textContent = 'Generating…';

    try {
      const response = await fetch(
        `${BASE_URL}/api/registration/claim` +
        `?controlNumber=${encodeURIComponent(cachedControlNumber)}` +
        `&lastName=${encodeURIComponent(cachedLastName)}`
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        showPortalError(errorMsg || 'Could not generate credentials.');
        generateBtn.disabled    = false;
        generateBtn.textContent = 'Generate Student ID & Password';
        return;
      }

      const student = await response.json();
      console.log('Claim response:', student);

      // Resolve field names — backend may use studentNumber or studentId
      const studentNumber = student.studentNumber || student.studentId || '—';
      const password      = student.password      || student.tempPassword || '—';

      /* ── Hide button row, show credentials ── */
      document.getElementById('preGenerate').style.display = 'none';
      credDisplay.style.display = 'block';

      credDisplay.innerHTML = `
        <div style="
          background:#f0fdf4;
          border:2px solid #86efac;
          padding:20px 18px;
          border-radius:10px;
          animation: fadeUp 0.35s ease;">

          <h4 style="color:#166534; margin:0 0 14px; font-size:15px;">
            ✅ Your Enrollment Credentials
          </h4>

          <div style="
            background:#fff; border:1px solid #d1fae5;
            border-radius:8px; padding:14px 16px; margin-bottom:12px;">
            <p style="margin:0 0 6px; font-size:13px; color:#374151;">Student ID</p>
            <p style="margin:0; font-size:22px; font-weight:800;
                      color:#1e40af; letter-spacing:1px;">
              ${studentNumber}
            </p>
          </div>

          <div style="
            background:#fff; border:1px solid #d1fae5;
            border-radius:8px; padding:14px 16px; margin-bottom:16px;">
            <p style="margin:0 0 6px; font-size:13px; color:#374151;">Password</p>
            <p style="margin:0; font-size:22px; font-weight:800;
                      color:#1e40af; letter-spacing:1px;">
              ${password}
            </p>
          </div>

          <div style="
            background:#fffbeb; border:1px solid #fde68a;
            border-radius:8px; padding:10px 14px; margin-bottom:14px;
            font-size:12px; color:#92400e; line-height:1.6;">
            ⚠️ <strong>Save these now.</strong> Use your Student ID and Password
            to log in at the main enrollment portal.
          </div>

          <a href="index.html" style="
            display:block; text-align:center;
            padding:11px; background:#003366; color:#fff;
            border-radius:8px; text-decoration:none;
            font-size:14px; font-weight:700;">
            Go to Login →
          </a>
        </div>

        <style>
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
          }
        </style>`;

    } catch (error) {
      console.error('Claim error:', error);
      showPortalError('Could not connect to the system. Please try again.');
      generateBtn.disabled    = false;
      generateBtn.textContent = 'Generate Student ID & Password';
    }
  });

  /* ── Helpers ── */

  function resetSubmitBtn() {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Check Status';
  }

  function clearPortalError() {
    const el = document.getElementById('portalErrorMsg');
    if (el) el.remove();
  }

  function showPortalError(msg) {
    clearPortalError();
    const div = document.createElement('div');
    div.id = 'portalErrorMsg';
    div.style.cssText =
      'background:#fef2f2; border:1px solid #fca5a5; color:#991b1b;' +
      'padding:10px 14px; border-radius:6px; margin-top:12px; font-size:14px;';
    div.textContent = '⚠ ' + msg;
    submitBtn.insertAdjacentElement('afterend', div);
  }

  function renderApprovalBadge(isConfirmed) {
    const old = document.getElementById('approvalBadge');
    if (old) old.remove();

    const badge = document.createElement('div');
    badge.id = 'approvalBadge';

    if (isConfirmed) {
      badge.style.cssText =
        'background:#d1fae5; border:1px solid #6ee7b7; color:#065f46;' +
        'padding:8px 14px; border-radius:6px; margin-top:10px;' +
        'font-size:14px; font-weight:700;';
      badge.textContent = '✅ Admission Status: APPROVED';
    } else {
      badge.style.cssText =
        'background:#fef9c3; border:1px solid #fde047; color:#713f12;' +
        'padding:8px 14px; border-radius:6px; margin-top:10px;' +
        'font-size:14px; font-weight:700;';
      badge.textContent = '⏳ Admission Status: PENDING — Under review';
    }

    const contentDiv = document.querySelector('#statusSection .card-content');
    if (contentDiv) contentDiv.appendChild(badge);
  }

});