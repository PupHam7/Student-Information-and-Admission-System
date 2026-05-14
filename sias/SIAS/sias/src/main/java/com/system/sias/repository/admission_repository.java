package com.system.sias.repository;

import com.system.sias.entity.coe_admin; // Import the correct entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface admission_repository extends JpaRepository<coe_admin, Long> {
    // This checks if the applicant is validated in the admission table
    boolean existsByIdAndValidatedTrue(Long id);
}