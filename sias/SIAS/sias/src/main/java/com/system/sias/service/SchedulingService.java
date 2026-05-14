package com.system.sias.service;

import com.system.sias.entity.EnrollmentRecord;
import com.system.sias.entity.Section;
import com.system.sias.entity.Subject;
import com.system.sias.entity.official_student;
import com.system.sias.repository.EnrollmentRecordRepository;
import com.system.sias.repository.SectionRepository;
import com.system.sias.repository.SubjectRepository;
import com.system.sias.repository.official_student_repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SchedulingService {

    private final SectionRepository           sectionRepo;
    private final SubjectRepository           subjectRepo;
    private final EnrollmentRecordRepository  enrollmentRepo;
    private final official_student_repository officialRepo;   // FIX: added to update student after enrollment

    @PersistenceContext
    private EntityManager em;

    // Section table suffixes — extend if you add more year levels / semesters
    private static final Map<String, String> TABLE_SUFFIX = Map.of(
            "1-1:A", "1a1",  "1-1:B", "1b1",
            "1-2:A", "1a2",  "1-2:B", "1b2",
            "2-1:A", "2a1",  "2-1:B", "2b1",
            "2-2:A", "2a2",  "2-2:B", "2b2"
    );

    public SchedulingService(SectionRepository sectionRepo,
                             SubjectRepository subjectRepo,
                             EnrollmentRecordRepository enrollmentRepo,
                             official_student_repository officialRepo) {
        this.sectionRepo    = sectionRepo;
        this.subjectRepo    = subjectRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.officialRepo   = officialRepo;   // FIX: now injected
    }

    // ── Sections ─────────────────────────────────────────────────────────────

    public List<Section> getSectionsByPeriod(String periodKey) {
        return sectionRepo.findByPeriodKeyOrderByEnrolledAsc(periodKey);
    }

    // ── Subjects ─────────────────────────────────────────────────────────────

    public List<Subject> getSubjectsByPeriod(String periodKey) {
        return subjectRepo.findByPeriodKey(periodKey);
    }

    public List<Subject> getSubjectsByPeriodAndSection(String periodKey, String sectionId) {
        return subjectRepo.findByPeriodKeyAndSectionId(periodKey, sectionId);
    }

    // ── Enrollment ───────────────────────────────────────────────────────────

    @Transactional
    public EnrollmentRecord saveEnrollment(String periodKey,
                                           String sectionId,
                                           List<String> subjectCodes,
                                           int totalUnits,
                                           String studentId,
                                           String studentName) {

        // 1. Locate and validate the section
        List<Section> sections = sectionRepo.findByPeriodKeyOrderByEnrolledAsc(periodKey);
        Section target = sections.stream()
                .filter(s -> s.getSectionId().equals(sectionId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Section " + sectionId + " not found for period " + periodKey));

        // 2. Capacity check
        if (target.getEnrolled() >= target.getCapacity()) {
            throw new IllegalStateException(
                    "Section " + target.getName() + " is already full. " +
                            "Capacity: " + target.getCapacity() + " students.");
        }

        // 3. Look up full subject details for each code
        List<Subject> allSubjects = subjectRepo.findByPeriodKeyAndSectionId(periodKey, sectionId);

        List<String> names       = new ArrayList<>();
        List<String> unitsList   = new ArrayList<>();
        List<String> days        = new ArrayList<>();
        List<String> starts      = new ArrayList<>();
        List<String> ends        = new ArrayList<>();
        List<String> rooms       = new ArrayList<>();
        List<String> instructors = new ArrayList<>();

        for (String code : subjectCodes) {
            Subject match = allSubjects.stream()
                    .filter(s -> s.getCode().equals(code))
                    .findFirst().orElse(null);

            if (match != null) {
                names.add(match.getName());
                unitsList.add(String.valueOf(match.getUnits()));
                days.add(match.getDay());
                starts.add(match.getTimeStart());
                ends.add(match.getTimeEnd());
                rooms.add(match.getRoom());
                instructors.add(match.getInstructor());
            } else {
                names.add("Unknown"); unitsList.add("0");
                days.add("-"); starts.add("-"); ends.add("-");
                rooms.add("-"); instructors.add("-");
            }
        }

        // 4. Resolve per-section table name
        String key    = periodKey + ":" + sectionId;
        String suffix = TABLE_SUFFIX.get(key);
        if (suffix == null) {
            throw new IllegalArgumentException(
                    "No section table for period=" + periodKey + " section=" + sectionId);
        }

        // 5. Insert into the dedicated per-section table
        String insertSql = """
                INSERT INTO enrolled_%s (
                    student_name, subject_codes, subject_names,
                    units, day, time_start, time_end,
                    room, instructor, total_units, enrolled_at
                ) VALUES (
                    :studentName, :codes, :names,
                    :units, :day, :timeStart, :timeEnd,
                    :room, :instructor, :totalUnits, :now
                )
                """.formatted(suffix);

        em.createNativeQuery(insertSql)
                .setParameter("studentName", studentName)
                .setParameter("codes",       String.join("|", subjectCodes))
                .setParameter("names",       String.join("|", names))
                .setParameter("units",       String.join("|", unitsList))
                .setParameter("day",         String.join("|", days))
                .setParameter("timeStart",   String.join("|", starts))
                .setParameter("timeEnd",     String.join("|", ends))
                .setParameter("room",        String.join("|", rooms))
                .setParameter("instructor",  String.join("|", instructors))
                .setParameter("totalUnits",  totalUnits)
                .setParameter("now",         LocalDateTime.now())
                .executeUpdate();

        // 6. Save to shared enrollment_records table
        EnrollmentRecord record = new EnrollmentRecord();
        record.setStudentId(studentId);
        record.setStudentName(studentName);
        record.setPeriodKey(periodKey);
        record.setSectionId(sectionId);
        record.setSubjectCodes(String.join(",", subjectCodes));
        record.setTotalUnits(totalUnits);
        record.setEnrolledAt(LocalDateTime.now());
        EnrollmentRecord saved = enrollmentRepo.save(record);

        // 7. Increment enrolled count on the section
        target.setEnrolled(target.getEnrolled() + 1);
        sectionRepo.save(target);

        // 8. FIX: Update official_student with the enrolled section, sem, and yearLevel.
        //
        //    This is the critical step that makes assessment.js work correctly.
        //    Previously this was missing — official_student.section stayed null forever,
        //    so the assessment page always showed the "Enroll" button even after enrollment.
        //
        //    periodKey format: "${yearLevel}-${sem}"  e.g. "1-1", "2-2"
        //    Split it to extract the numeric year and sem values.
        if (studentId != null && !studentId.isBlank()) {
            String[] parts   = periodKey.split("-", 2);
            String yearLevel = parts[0];                             // "1", "2", etc.
            String sem       = parts.length > 1 ? parts[1] : "1";  // "1", "2", etc.
            String today     = LocalDate.now().toString();          // "2025-05-13"

            Optional<official_student> studentOpt = officialRepo.findByStudentNumber(studentId);
            studentOpt.ifPresent(student -> {
                student.setSection(sectionId);      // e.g. "A"
                student.setYearLevel(yearLevel);    // e.g. "1"  (matches Scheduling.html values)
                student.setSem(sem);                // e.g. "1"  (fixes toPeriodKey on assessment page)
                if (student.getDateenrolled() == null || student.getDateenrolled().isBlank()) {
                    student.setDateenrolled(today); // only set first enrollment
                }
                officialRepo.save(student);
            });
        }

        return saved;
    }

    // ── Utility queries ───────────────────────────────────────────────────────

    public List<EnrollmentRecord> getAllEnrollments() {
        return enrollmentRepo.findAllByOrderByEnrolledAtDesc();
    }

    public List<EnrollmentRecord> getEnrollmentsBySection(String periodKey, String sectionId) {
        return enrollmentRepo.findByPeriodKeyAndSectionId(periodKey, sectionId);
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> getStudentsBySection(String periodKey, String sectionId) {
        String suffix = TABLE_SUFFIX.get(periodKey + ":" + sectionId);
        if (suffix == null) {
            throw new IllegalArgumentException(
                    "No section table for period=" + periodKey + " section=" + sectionId);
        }
        String sql = """
                SELECT id, student_name, subject_codes, subject_names,
                       units, day, time_start, time_end,
                       room, instructor, total_units, enrolled_at
                FROM enrolled_%s
                ORDER BY enrolled_at DESC
                """.formatted(suffix);
        return em.createNativeQuery(sql).getResultList();
    }
}