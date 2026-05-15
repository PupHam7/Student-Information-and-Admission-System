package com.system.sias.controller;

import com.system.sias.entity.official_student;
import com.system.sias.entity.Applicant;
import com.system.sias.repository.ApplicantRepository;
import com.system.sias.repository.official_student_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/registration")
@CrossOrigin(origins = "*")
public class official_student_controller {

    @Autowired
    private ApplicantRepository applicantRepo;

    @Autowired
    private official_student_repository officialRepo;

    /**
     * PUT /api/registration/{id}/validate
     *
     * Called by admin-dashboard.js "Approve" button via updateStatus().
     *
     * FIX 1: Now idempotent — if an official_student record already exists for
     *         this applicant, it returns the existing one instead of creating a
     *         duplicate. Clicking Approve twice is now safe.
     *
     * FIX 2: Stores sem = null and section = null initially. These are set
     *         when the student actually enrolls via Scheduling.html
     *         (SchedulingService.saveEnrollment() fills them in).
     *         Previously: sem was "1st Semester" which broke toPeriodKey() on
     *         every frontend page (expected "1" or "2").
     *
     * FIX 3: Sets dateenrolled, yearLevel from admissionData correctly.
     */
    @PutMapping("/{id}/validate")
    public ResponseEntity<?> validateAndRegister(@PathVariable Long id) {

        // 1. Fetch applicant
        Applicant applicant = applicantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + id));

        // 2. Generate the deterministic student number early so we can check duplicates
        String studentNumber = "2024" + String.format("%05d", id);

        // 3. IDEMPOTENCY CHECK — if already approved, return the existing record
        Optional<official_student> existing = officialRepo.findByStudentNumber(studentNumber);
        if (existing.isPresent()) {
            // Still re-mark isConfirmed in case it was somehow reset
            applicant.getAdmissionData().setIsConfirmed(true);
            applicantRepo.save(applicant);
            return ResponseEntity.ok(existing.get());
        }

        // 4. Mark as confirmed in admission data
        applicant.getAdmissionData().setIsConfirmed(true);
        applicantRepo.save(applicant);

        // 5. Build the official student record
        official_student official = new official_student();

        // Personal data
        official.setFirstName(applicant.getPersonalData().getFirstName());
        official.setLastName(applicant.getPersonalData().getLastName());
        official.setSex(applicant.getPersonalData().getSex());

        // Admission data
        official.setCourse(applicant.getAdmissionData().getPreferredCourse1());

        // yearLevel from admissionData — form stores values "1","2","3","4"
        official.setYearLevel(applicant.getAdmissionData().getAppliedYearLevel());

        // FIX: sem and section start as null — SchedulingService fills them on enrollment
        // The old code stored "1st Semester" which broke toPeriodKey("1","1st Semester")
        official.setSem(null);
        official.setSection(null);

        // Academic year — update this string at the start of each school year
        official.setAcademicyear("2025-2026");

        // Department — derive from course name as a best-effort mapping.
        // TODO: Add a dept field to AdmissionData or a course-to-dept config table
        //       for a proper mapping. Current mapping covers BSIT/BSCS → CEC etc.
        official.setDepartment(deriveDepartment(applicant.getAdmissionData().getPreferredCourse1()));

        // Date of approval (not enrollment — enrollment date is set in SchedulingService)
        official.setDateenrolled(null); // set when student completes Scheduling.html

        // 6. Credentials — deterministic student number, random password
        official.setStudentNumber(studentNumber);
        Random random = new Random();
        official.setPassword(String.valueOf(100000 + random.nextInt(900000)));

        // 7. Save
        official_student saved = officialRepo.save(official);
        return ResponseEntity.ok(saved);
    }

    /**
     * GET /api/registration/{id}
     * Returns the Applicant (admission) record for admin review.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicantById(@PathVariable Long id) {
        return applicantRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/registration/student/{studentNumber}
     *
     * Used by assessment.js and coe.js to load the logged-in student's record.
     * Returns the official_student object including section, sem, yearLevel —
     * which are updated by SchedulingService.saveEnrollment() after enrollment.
     *
     * Frontend stores studentNumber (e.g. "202400001") in localStorage as 'studentId'.
     */
    @GetMapping("/student/{studentNumber}")
    public ResponseEntity<?> getByStudentNumber(@PathVariable String studentNumber) {
        Optional<official_student> student =
                officialRepo.findByStudentNumber(studentNumber);

        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Student not found. Admission may still be pending.");
    }

    /**
     * GET /api/registration/claim?controlNumber=...&lastName=...
     *
     * Called by portal.js "Generate Credentials" button.
     *
     * FIX: Previously used findByFirstNameAndLastName() which breaks for students
     *      who share a name. Now uses the deterministic student number
     *      ("2024" + zero-padded applicant ID) which is always unique.
     */
    @GetMapping("/claim")
    public ResponseEntity<?> claimCredentials(
            @RequestParam String controlNumber,
            @RequestParam String lastName) {

        // 1. Look up by control number
        Optional<Applicant> applicantOpt = applicantRepo.findByControlNumber(controlNumber);
        if (applicantOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invalid Control Number.");
        }

        Applicant applicant = applicantOpt.get();

        // 2. Validate last name
        if (!applicant.getPersonalData().getLastName().equalsIgnoreCase(lastName.trim())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Last name does not match our records.");
        }

        // 3. Check admin approval
        if (applicant.getAdmissionData() == null
                || !Boolean.TRUE.equals(applicant.getAdmissionData().getIsConfirmed())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Application is still pending admin approval.");
        }

        // 4. Deterministic lookup — much safer than name matching
        String studentNumber = "2024" + String.format("%05d", applicant.getId());
        return officialRepo.findByStudentNumber(studentNumber)
                .map(student -> ResponseEntity.ok((Object) student))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Credentials not ready. Please contact the registrar."));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Best-effort course → department mapping.
     * Extend this map as needed for your actual PSU programs.
     */
    private String deriveDepartment(String course) {
        if (course == null) return null;
        String c = course.toUpperCase();
        if (c.contains("INFORMATION TECHNOLOGY") || c.contains("COMPUTER SCIENCE")
                || c.contains("COMPUTER ENGINEERING") || c.contains("ELECTRONICS")) {
            return "CEC";
        } else if (c.contains("BUSINESS") || c.contains("ACCOUNTANCY")
                || c.contains("MANAGEMENT") || c.contains("ENTREPRENEURSHIP")) {
            return "CBME";
        } else if (c.contains("EDUCATION") || c.contains("TEACHING")) {
            return "CTE";
        } else if (c.contains("NURSING") || c.contains("MIDWIFERY")
                || c.contains("HEALTH")) {
            return "CHN";
        } else if (c.contains("AGRICULTURE") || c.contains("FISHERIES")) {
            return "CAFAS";
        } else if (c.contains("ENGINEERING") || c.contains("ARCHITECTURE")) {
            return "CE";
        }
        return null; // Unknown — let admin update manually
    }
}