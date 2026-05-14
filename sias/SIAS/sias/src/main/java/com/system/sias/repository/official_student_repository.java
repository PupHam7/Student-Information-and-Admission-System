package com.system.sias.repository;

import com.system.sias.entity.official_student; // Ensure this matches your new package
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface official_student_repository extends JpaRepository<official_student, Long> {

    /**
     * Finds a student by their unique student number.
     * This will be used by the Portal Login and Scheduling modules.
     */
    Optional<official_student> findByStudentNumber(String studentNumber);

    Optional<official_student> findByFirstNameAndLastName(String firstName, String lastName);

    /**
     * Checks if a student number already exists in the system.
     */
    boolean existsByStudentNumber(String studentNumber);
}