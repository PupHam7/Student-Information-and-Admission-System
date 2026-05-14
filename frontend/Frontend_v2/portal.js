/* ================================================================
   portal.js  —  Status Portal
   
   Flow:
   1. Student enters control number + last name → "Check Status"
      → GET /api/admissions/status/{controlNumber}?lastName={lastName}
      → Shows applicant info + approval badge
 
   2. If admission is APPROVED → "Generate Student ID & Password" button is enabled
      → GET /api/registration/claim?controlNumber=...&lastName=...
      → Displays student number + password
      → Student uses these to log in at the main portal (index.html)
 
   3. If admission is PENDING → button is disabled with a clear message
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
 
    // Keep control number values between sections for the claim step
    let cachedControlNumber = '';
    let cachedLastName      = '';
 
    /* ── Enable/disable Check Status button based on input ── */
    function validateInputs() {
        const ctrl = controlInput.value.trim();
        const last = nameInput.value.trim();
        submitBtn.disabled = !(ctrl.length >= 1 && last.length >= 2);
    }
 
    controlInput.addEventListener('input', validateInputs);
    nameInput.addEventListener('input', validateInputs);
 
    /* ── Auto-uppercase last name field ── */
    nameInput.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });
 
    /* ================================================================
       CHECK STATUS — button click
    ================================================================ */
    submitBtn.addEventListener('click', async function () {
 
        const controlNumber = controlInput.value.trim();
        const lastName      = nameInput.value.trim();
 
        submitBtn.disabled   = true;
        submitBtn.textContent = 'Checking…';
 
        try {
            // FIX: Correct endpoint — was "/api/v1/admission/status/..." which doesn't exist.
            //      Also now passes lastName for server-side validation.
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
 
            // Cache for use in the claim step
            cachedControlNumber = controlNumber;
            cachedLastName      = lastName;
 
            /* ── Populate applicant info ── */
            const fullName = [applicant.firstName, applicant.middleName, applicant.lastName]
                .filter(Boolean).join(' ');
 
            document.getElementById('displayName').textContent      = fullName;
            document.getElementById('displayControlNo').textContent = applicant.controlNumber;
 
            // Show preferred course if available
            const courseSpan = document.getElementById('course1Choice');
            if (courseSpan) {
                courseSpan.textContent = applicant.preferredCourse
                    ? `1st Choice: ${applicant.preferredCourse}`
                    : 'Result not yet available.';
            }
 
            /* ── Show approval status badge ── */
            renderApprovalStatus(applicant.isConfirmed);
 
            /* ── Enable / disable credential button based on approval ── */
            if (applicant.isConfirmed) {
                generateBtn.disabled  = false;
                generateBtn.title     = '';
                generateBtn.style.opacity = '1';
                document.getElementById('enrollPromptMsg').textContent =
                    'Your admission is approved! Generate your login credentials below.';
            } else {
                generateBtn.disabled  = true;
                generateBtn.title     = 'Wait for admin approval first.';
                generateBtn.style.opacity = '0.45';
                document.getElementById('enrollPromptMsg').textContent =
                    'Your application is still under review. Please check back later.';
            }
 
            /* ── Show status section ── */
            loginSection.style.display  = 'none';
            statusSection.style.display = 'block';
 
            // Re-initialize Lucide icons for the newly visible section
            if (typeof lucide !== 'undefined') lucide.createIcons();
 
        } catch (error) {
            console.error('Portal check error:', error);
            showPortalError('Server error. Please check if the backend is running.');
            resetSubmitBtn();
        }
    });
 
    /* ================================================================
       GENERATE CREDENTIALS — button click
    ================================================================ */
    generateBtn.addEventListener('click', async function () {
 
        generateBtn.disabled   = true;
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
                generateBtn.disabled   = false;
                generateBtn.textContent = 'Generate Student ID & Password';
                return;
            }
 
            const student = await response.json();
 
            // Hide the button area, show credentials
            document.getElementById('preGenerate').style.display = 'none';
            credDisplay.style.display = 'block';
 
            credDisplay.innerHTML = `
                <div style="background:#fffbeb;border:1px solid #fde68a;
                            padding:16px;border-radius:8px;margin-top:8px;">
                    <h4 style="color:#92400e;margin:0 0 12px;">✅ Enrollment Credentials</h4>
                    <p style="margin:6px 0;">
                        <strong>Student ID:</strong>
                        <span style="color:#1e40af;font-size:1.1em;font-weight:700;">
                            ${student.studentNumber}
                        </span>
                    </p>
                    <p style="margin:6px 0;">
                        <strong>Password:</strong>
                        <span style="color:#1e40af;font-size:1.1em;font-weight:700;">
                            ${student.password}
                        </span>
                    </p>
                    <small style="display:block;margin-top:12px;color:#b45309;line-height:1.5;">
                        ⚠️ Save these credentials now. Use your <strong>Student ID</strong>
                        and <strong>Password</strong> to log in at the main enrollment portal.
                    </small>
                    <a href="index.html"
                       style="display:inline-block;margin-top:14px;padding:8px 18px;
                              background:#003366;color:#fff;border-radius:6px;
                              text-decoration:none;font-size:14px;">
                        Go to Login →
                    </a>
                </div>`;
 
        } catch (error) {
            console.error('Claim error:', error);
            showPortalError('Could not connect to the system. Please try again.');
            generateBtn.disabled   = false;
            generateBtn.textContent = 'Generate Student ID & Password';
        }
    });
 
    /* ── Helpers ── */
 
    function resetSubmitBtn() {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Check Status';
    }
 
    function showPortalError(msg) {
        const existing = document.getElementById('portalErrorMsg');
        if (existing) existing.remove();
 
        const div = document.createElement('div');
        div.id = 'portalErrorMsg';
        div.style.cssText =
            'background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;' +
            'padding:10px 14px;border-radius:6px;margin-top:12px;font-size:14px;';
        div.textContent = '⚠ ' + msg;
 
        // Append after the submit button
        submitBtn.insertAdjacentElement('afterend', div);
    }
 
    function renderApprovalStatus(isConfirmed) {
        const existing = document.getElementById('approvalBadge');
        if (existing) existing.remove();
 
        const badge = document.createElement('div');
        badge.id = 'approvalBadge';
 
        if (isConfirmed) {
            badge.style.cssText =
                'background:#d1fae5;border:1px solid #6ee7b7;color:#065f46;' +
                'padding:8px 14px;border-radius:6px;margin-top:10px;font-size:14px;font-weight:600;';
            badge.textContent = '✅ Admission Status: APPROVED';
        } else {
            badge.style.cssText =
                'background:#fef9c3;border:1px solid #fde047;color:#713f12;' +
                'padding:8px 14px;border-radius:6px;margin-top:10px;font-size:14px;font-weight:600;';
            badge.textContent = '⏳ Admission Status: PENDING — Under review';
        }
 
        const contentDiv = document.querySelector('#statusSection .card-content');
        if (contentDiv) contentDiv.appendChild(badge);
    }
});