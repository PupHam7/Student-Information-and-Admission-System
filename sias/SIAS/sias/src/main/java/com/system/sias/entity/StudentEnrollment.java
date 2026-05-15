package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents one student enrolled in a specific section.
 * Each section has its own table (e.g. enrolled_1a1, enrolled_2b2).
 * The table name is resolved dynamically at runtime via InheritanceType.TABLE_PER_CLASS
 * is NOT used here — instead we use a single entity with a configurable table name
 * set by a @MappedSuperclass pattern controlled by the service layer via native SQL,
 * OR we use one concrete entity per section.
 *
 * For simplicity and JPA compatibility, we use ONE entity mapped to a "template" table
 * called "student_enrollments", and the service uses JDBC / native queries
 * to insert into the correct per-section table.
 *
 * Actual per-section tables are created by the DataSeeder via native DDL.
 */
@Entity
@Table(name = "student_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Which section table this record belongs to, e.g. "1A1", "2B2" */
    @Column(name = "section_table", nullable = false, length = 10)
    private String sectionTable;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "period_key", nullable = false, length = 20)
    private String periodKey;

    @Column(name = "section_id", nullable = false, length = 10)
    private String sectionId;

    @Column(name = "subject_codes", nullable = false, length = 500)
    private String subjectCodes;

    @Column(name = "total_units", nullable = false)
    private int totalUnits;

    @Column(name = "enrolled_at", nullable = false)
    private LocalDateTime enrolledAt = LocalDateTime.now();
}
