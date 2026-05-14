package com.system.sias.repository;

import com.system.sias.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {

    /** All enrollments for a specific section (e.g. sectionTable = "1A1") */
    List<StudentEnrollment> findBySectionTableOrderByEnrolledAtDesc(String sectionTable);

    /** All enrollments for a given period (e.g. "1-1") */
    List<StudentEnrollment> findByPeriodKeyOrderByEnrolledAtDesc(String periodKey);

    /** Count how many students are in a specific section table */
    long countBySectionTable(String sectionTable);

    /** Check if a student name already enrolled in the same section */
    boolean existsBySectionTableAndStudentName(String sectionTable, String studentName);
}
