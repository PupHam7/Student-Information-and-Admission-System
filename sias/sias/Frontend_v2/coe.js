if (!localStorage.getItem('studentId')) {
    alert("Please login first.");
    window.location.href = 'index.html';
}

const studentId = localStorage.getItem('studentId');

window.onload = function () {
    loadOfficialData();
};

async function loadOfficialData() {
    if (!studentId) return;

    try {
        const response = await fetch(`http://localhost:8080/api/official-students/student/${studentId}`);
        if (!response.ok) throw new Error("Record not found.");
        
        const data = await response.json();
        
        // DEBUG: Right-click your page, select "Inspect", and look at "Console"
        // This will show you EXACTLY what the backend is sending.
        console.log("Student Data from API:", data);

        const safeSet = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value && value !== "" ? value : "N/A";
        };

        safeSet("first_name", `${data.student.lastName}, ${data.student.firstName}`);
        safeSet("student_id", data.student.studentNumber);

        safeSet("course", data.course);
        safeSet("department", data.department);
        safeSet("courseYear", data.yearLevel);
        safeSet("enrollmentDate", data.dateEnrolled);

        const semesterAY = document.getElementById("semesterAY");
        if (semesterAY) {
            semesterAY.innerText = `${data.semester} Semester AY ${data.academicYear}`;
        }

        if (data.section) {
            loadCOESchedule(data.section, data.semester);
        }

    } catch (error) {
        console.error("COE Error:", error);
    }
}

async function loadCOESchedule(section, semester) {
    try {
        const res = await fetch(`http://localhost:8080/api/schedules/section/${section}`);
        const subjects = await res.json();
        
        const tableBody = document.getElementById("scheduleTable");
        if (!tableBody) return;
        
        tableBody.innerHTML = "";
        let totalUnits = 0;

        // Filter for the current term
        const filteredData = subjects.filter(s => s.semester === semester);

        filteredData.forEach(s => {
            tableBody.innerHTML += `
                <tr>
                    <td>${s.code}</td>
                    <td>${s.subject}</td>
                    <td>${s.description}</td>
                    <td style="text-align:center;">${s.units}</td>
                    <td>${s.schedule}</td>
                    <td>${s.instructor}</td>
                    <td>${s.section}</td>
                </tr>`;
            totalUnits += Number(s.units || 0);
        });

        const totalEl = document.getElementById("totalUnits");
        if (totalEl) totalEl.innerText = totalUnits;

    } catch (err) {
        console.error("Schedule Error:", err);
    }
}

function printCOE() { window.print(); }
function goAssessment() { window.location.href = "assessment.html"; }
function toggleMenu() { console.log("Menu toggled"); }