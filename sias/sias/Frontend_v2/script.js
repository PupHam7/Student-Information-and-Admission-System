(function checkAuth() {
    const sessionUser = localStorage.getItem('studentId');
    if (!sessionUser && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
})();

/* ── Role select ── */
function selectRole(role) {
  localStorage.setItem('selectedRole', role);
  window.location.href = 'login.html';
}

/* ── Login ── */
async function handleLogin(e) {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });

    const result = await response.json();

    if (result.success) {
      // SUCCESS: Save the database ID (pk) and redirect
      localStorage.setItem('studentId', result.data.id); 
      localStorage.setItem('userId', result.data.studentNumber);
      localStorage.setItem('firstName', result.data.firstName);
      window.location.href = 'dashboard.html';
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Connection failed:", error);
    alert("Backend server is not responding.");
  }
}

/* ── Dashboard ── */
function show(name, btn) {
  document.querySelectorAll('.sec').forEach(function(s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('sec-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('hidden');
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

/* ── On page load ── */
document.addEventListener('DOMContentLoaded', function () {
  const firstName = localStorage.getItem('firstName');
  const role = localStorage.getItem('selectedRole') || 'Student';
  const studentNumber = localStorage.getItem('userId'); // The Student Number used for login

const welcomeText = document.getElementById('welcomeName');
  if (welcomeText) {
      welcomeText.textContent = firstName ? firstName : "Student";
  }

  // Update Badge
  const badge = document.getElementById('roleBadge');
  if (badge) badge.textContent = role;

  // Update Profile Info in Dashboard
  if (document.getElementById('profileId')) {
    if (!studentNumber) { 
        window.location.href = 'index.html'; 
        return; 
    }
    
    // Display the Student Number and Name
    document.getElementById('profileId').textContent = studentNumber;
    document.getElementById('profileRole').textContent = role;
    
    // Display initials in the avatar
    const avatar = document.getElementById('avatar');
    if (avatar && firstName) {
        avatar.textContent = firstName.charAt(0).toUpperCase();
    }
  }
});

async function handleRegistration(e) {
  e.preventDefault();
  const messageDiv = document.getElementById('regMessage');
  messageDiv.textContent = "Processing...";
  messageDiv.style.color = "blue";

  const studentData = {
    firstName: document.getElementById('regFirstName').value.trim(),
    lastName: document.getElementById('regLastName').value.trim(),
    email: document.getElementById('regEmail').value.trim()
  };

  try {
    // Step A: Create the Student
    const studentResponse = await fetch('http://localhost:8080/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    const studentResult = await studentResponse.json();

    if (studentResponse.ok) {
      const studentId = studentResult.id; // Get the generated ID from backend

      // Step B: Create the Admission Application
      const admissionResponse = await fetch(`http://localhost:8080/api/admissions/apply/${studentId}`, {
        method: 'POST'
      });

      if (admissionResponse.ok) {
        messageDiv.style.color = "green";
        messageDiv.textContent = "Success! Your application is PENDING. Please check your email for updates.";
        // Optional: Redirect to home after 3 seconds
        setTimeout(() => { window.location.href = 'index.html'; }, 4000);
      } else {
        throw new Error("Failed to submit admission application.");
      }
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Error: " + (studentResult.message || "Email might already be registered.");
    }
  } catch (error) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Connection Error: Is the backend running?";
    console.error(error);
  }
}

async function loadPendingAdmissions() {
    const tableBody = document.getElementById('admissionTableBody');
    tableBody.innerHTML = "<tr><td colspan='5'>Loading applications...</td></tr>";

    try {
        const response = await fetch('http://localhost:8080/api/admissions');
        const admissions = await response.json();

        tableBody.innerHTML = ""; // Clear loading message

        admissions.forEach(adm => {
            const row = `
                <tr>
                    <td>${adm.id}</td>
                    <td>${adm.student.firstName} ${adm.student.lastName}</td>
                    <td>${adm.student.email}</td>
                    <td class="status-${adm.status.toLowerCase()}">${adm.status}</td>
                    <td>
                        ${adm.status === 'PENDING' ? 
                            `<button class="approve-btn" onclick="updateStatus(${adm.id}, 'APPROVED')">Approve</button>
                            <button class="reject-btn" onclick="updateStatus(${adm.id}, 'REJECTED')">Reject</button>` : 
                            '<span style="color:gray italic">Processed</span>'}
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error("Error fetching admissions:", error);
        tableBody.innerHTML = "<tr><td colspan='5' style='color:red;'>Failed to load data. Is the backend running?</td></tr>";
    }
}

async function updateStatus(admissionId, status) {
    const action = status === 'APPROVED' ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${action} this student?`)) return;

    try {
        const response = await fetch(`http://localhost:8080/api/admissions/${admissionId}/status?status=${status}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert(`Student ${status.toLowerCase()} successfully!`);
            loadPendingAdmissions(); // Refresh the table
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Connection failed.");
    }
}

document.addEventListener('DOMContentLoaded', loadPendingAdmissions);