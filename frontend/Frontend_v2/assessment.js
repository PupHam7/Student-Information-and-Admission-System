if (!localStorage.getItem('studentId')) {
    alert("Please login first.");
    window.location.href = 'index.html';
}

(function checkAuth() {
    const sessionUser = localStorage.getItem('studentId');
    const path = window.location.href;
    
    // Add !path.endsWith('index.html') or .includes('index.html') to the list of allowed pages
    if (!sessionUser && 
        !path.includes('login.html') && 
        !path.includes('register.html') && 
        !path.includes('index.html') && // <--- ADD THIS
        path !== window.location.origin + '/' // <--- AND THIS (for the base URL)
    ) {
        window.location.href = 'login.html';
    }
})();


window.onload = function () {
  // Start the chain by loading admission data first
  loadAdmission();
};

const loggedInStudentId = localStorage.getItem('studentId');

function loadAdmission() {
  if (!loggedInStudentId) {
    console.error("No student ID found. Please log in.");
    window.location.href = 'login.html';
    return;
  }

  fetch(`http://localhost:8080/api/official-students/student/${loggedInStudentId}`)
    .then(res => {
      if (!res.ok) {
        // If the record isn't in official_students, admission is likely still pending
        document.body.innerHTML = `
            <div style="text-align:center; margin-top:50px; font-family: sans-serif;">
                <h2 style="color: #003366;">Admission Pending</h2>
                <p>Your record is not yet validated. You cannot access Assessment until the Admin approves your admission.</p>
                <button onclick="window.location.href='dashboard.html'" 
                        style="padding:10px 20px; cursor:pointer;">Back to Dashboard</button>
            </div>`;
        throw new Error("Student not officially enrolled.");
      }
      return res.json();
    })
    .then(data => {
      console.log("Official Student Data:", data);

      // 1. Map basic info to the UI
      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value ?? "N/A";
      };

      setText("student_id", data.student.id); 
      setText("First_name", `${data.student.lastName}, ${data.student.firstName}`);
      setText("course", data.course);          
      setText("department", data.department);
      setText("courseYear", `${data.course} - ${data.yearLevel}`);
      setText("sex", data.sex);
      

      setText("validated", "Yes");

      // 2. Map the Period (Semester and Academic Year)
      const periodSelect = document.getElementById("period");
      if (periodSelect) {
        const periodText = `${data.semester} Semester AY ${data.academicYear}`;
        periodSelect.innerHTML = `<option value="${periodText}">${periodText}</option>`;
      }

      // 3. Update the Action Button logic
      const btn = document.getElementById("actionBtn");
      const message = document.getElementById("enrollMessage");

      if (message) {
        message.innerText = "You are officially enrolled for this term.";
        message.style.color = "green";
      }

      if (btn) {
        btn.textContent = "View COE";
        btn.onclick = goToCOE;
        btn.style.backgroundColor = "#28a745"; // Success Green
        btn.style.opacity = "1";
        btn.disabled = false;
      }

      // 4. INTEGRATION: Load the schedule specific to this student's section
      if (data.section) {
        loadSchedule(data.section);
      } else {
        console.warn("No section assigned to this student.");
        loadSchedule(null); 
      }
    })
    .catch(err => {
      console.log("Admission Check:", err.message);
    });
}

function loadSchedule(sectionName) {
    // If no section is provided, we fetch all as a fallback or show empty
    const url = sectionName 
        ? `http://localhost:8080/api/schedules/section/${sectionName}`
        : "http://localhost:8080/api/schedules";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const tableBody = document.getElementById("scheduleTable");
        if (!tableBody) return;
        
        tableBody.innerHTML = "";
        let totalUnits = 0;

        if (data.length === 0) {
          tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No subjects found for this section.</td></tr>";
        } else {
          data.forEach(s => {
            const row = `
              <tr>
                <td>${s.code}</td>
                <td>${s.subject}</td>
                <td>${s.description}</td>
                <td style="text-align:center;">${s.units}</td>
                <td>${s.schedule}</td>
                <td>${s.instructor}</td>
                <td>${s.section}</td>
              </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
            totalUnits += Number(s.units || 0);
          });
        }
        
        const totalEl = document.getElementById("totalUnits");
        if (totalEl) totalEl.innerText = totalUnits;
      })
      .catch(err => {
        console.error("Schedule Load Error:", err);
        const tableBody = document.getElementById("scheduleTable");
        if (tableBody) tableBody.innerHTML = "<tr><td colspan='7' style='color:red;'>Error loading schedules.</td></tr>";
      });
}

/* =========================
   UI & NAVIGATION
========================= */

function goToCOE() {
  window.location.href = "coe.html";
}

function handleEnroll() {
  // Since the Admin already approved the admission (moving the student to OfficialStudent),
  // this modal can serve as a final confirmation to view the printable certificate.
  document.getElementById("modalOverlay")?.classList.remove("hidden");
}

function confirmEnroll() {
  window.location.href = "coe.html";
}

function goBack() {
  document.getElementById("modalOverlay")?.classList.add("hidden");
}

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('hidden');
}