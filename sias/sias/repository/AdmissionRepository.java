package com.system.sias.repository;

import com.system.sias.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmissionRepository extends JpaRepository<Admission, Long>{

    Admission findByStudent_Id(Long studentId);
}
