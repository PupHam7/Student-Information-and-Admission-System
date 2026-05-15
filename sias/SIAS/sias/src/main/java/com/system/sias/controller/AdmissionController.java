// File: com/system/sias/controller/AdmissionController.java
package com.system.sias.controller;

import com.system.sias.dto.AdmissionRequestDTO;
import com.system.sias.dto.AdmissionStatusDTO;
import com.system.sias.entity.Applicant;
import com.system.sias.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@CrossOrigin(origins = "*")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    /* ── GET /api/admissions — admin list of all applicants ── */
    @GetMapping
    public ResponseEntity<List<Applicant>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.findAll());
    }

    /* ── POST /api/admissions/submit — new admission form submission ── */
    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody AdmissionRequestDTO request) {
        try {
            String controlNo = admissionService.saveApplication(request);
            return ResponseEntity.ok(controlNo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Submission failed: " + e.getMessage());
        }
    }

    /**
     * GET /api/admissions/status/{controlNumber}?lastName={lastName}
     *
     * Used by portal.js "Check Status" button.
     *
     * FIX 1: Now validates lastName — previously anyone with a control number
     *         could see any applicant's data.
     * FIX 2: Returns isConfirmed so the portal can show approval status
     *         and conditionally enable the "Generate Credentials" button.
     *
     * NOTE: AdmissionStatusDTO needs an `isConfirmed` (boolean) field added to it.
     *       Add: private Boolean isConfirmed; + getter/setter.
     */
    @GetMapping("/status/{controlNumber}")
    public ResponseEntity<?> getStatus(
            @PathVariable String controlNumber,
            @RequestParam String lastName) {

        Applicant applicant;
        try {
            applicant = admissionService.findByControlNumber(controlNumber);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No application found with that Control Number.");
        }

        // Validate last name before returning any personal data
        String storedLastName = applicant.getPersonalData().getLastName();
        if (!storedLastName.equalsIgnoreCase(lastName.trim())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Last name does not match our records.");
        }

        boolean confirmed = applicant.getAdmissionData() != null
                && Boolean.TRUE.equals(applicant.getAdmissionData().getIsConfirmed());

        AdmissionStatusDTO dto = new AdmissionStatusDTO();
        dto.setControlNumber(applicant.getControlNumber());
        dto.setFirstName(applicant.getPersonalData().getFirstName());
        dto.setMiddleName(applicant.getPersonalData().getMiddleName());
        dto.setLastName(applicant.getPersonalData().getLastName());
        dto.setIsConfirmed(confirmed);   // ← NEW — add this field to AdmissionStatusDTO

        // Preferred course is also useful to show in the portal
        if (applicant.getAdmissionData() != null) {
            dto.setPreferredCourse(applicant.getAdmissionData().getPreferredCourse1());
        }

        return ResponseEntity.ok(dto);
    }
}