package com.system.sias.repository;

import com.system.sias.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByControlNumber(String controlNumber);
    Optional<Admission> findByEmail(String email);

    Admission findByStudent_Id(Long studentId);
}