package com.system.sias.controller;

import com.system.sias.entity.EnrollmentRecord;
import com.system.sias.entity.Section;
import com.system.sias.entity.Subject;
import com.system.sias.repository.official_student_repository;
import com.system.sias.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api") // FIX: Removed /scheduling to match Scheduling.html
@CrossOrigin(origins = "*") // Allows all frontend origins for development
public class SchedulingController {

    private final SchedulingService schedulingService;
    private final official_student_repository officialRepo;

    @Autowired
    public SchedulingController(SchedulingService schedulingService, official_student_repository officialRepo) {
        this.schedulingService = schedulingService;
        this.officialRepo = officialRepo;
    }

    // Matches: http://localhost:8080/api/sections?period=2-2
    @GetMapping("/sections")
    public ResponseEntity<List<Section>> getSections(@RequestParam String period) {
        List<Section> sections = schedulingService.getSectionsByPeriod(period);
        return ResponseEntity.ok(sections);
    }

    // Matches: http://localhost:8080/api/subjects?period=2-2&section=A
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getSubjects(
            @RequestParam String period,
            @RequestParam String section) { // Changed param name to 'section'
        List<Subject> subjects = schedulingService.getSubjectsByPeriodAndSection(period, section);
        return ResponseEntity.ok(subjects);
    }

    // Matches: http://localhost:8080/api/enroll
    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(@RequestBody Map<String, Object> body) {
        String periodKey   = (String) body.get("periodKey");
        String sectionId   = (String) body.get("sectionId");
        String studentId   = (String) body.getOrDefault("studentId", "");
        String studentName = (String) body.getOrDefault("studentName", "");

        // Use Number handling to avoid ClassCastException if JS sends numeric values
        int totalUnits = ((Number) body.get("totalUnits")).intValue();

        @SuppressWarnings("unchecked")
        List<String> subjectCodes = (List<String>) body.get("subjectCodes");

        try {
            EnrollmentRecord saved = schedulingService.saveEnrollment(
                    periodKey, sectionId, subjectCodes, totalUnits, studentId, studentName);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}