// File: com/system/sias/repository/ApplicantRepository.java
package com.system.sias.repository;

import com.system.sias.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    Optional<Applicant> findByControlNumber(String controlNumber);
}