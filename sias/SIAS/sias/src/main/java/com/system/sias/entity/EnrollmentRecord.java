package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollment_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── NEW: student ID (e.g. "2024-00123") ──────────────────────────────────
    @Column(name = "student_id", length = 9)
    private String studentId;

    @Column(name = "student_name", length = 30)
    private String studentName;

    @Column(name = "period_key", nullable = false, length = 20)
    private String periodKey;

    @Column(name = "section_id", nullable = false, length = 1)
    private String sectionId;

    @Column(name = "enrolled_at", nullable = false)
    private LocalDateTime enrolledAt = LocalDateTime.now();

    @Column(name = "total_units", nullable = false)
    private int totalUnits;

    // Stored as a comma-separated string in PostgreSQL
    @Column(name = "subject_codes", nullable = false, length = 500)
    private String subjectCodes;   // e.g. "CS101,MATH111,ENG101"
}