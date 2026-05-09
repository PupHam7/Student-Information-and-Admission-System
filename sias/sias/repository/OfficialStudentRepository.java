package com.system.sias.repository;

import com.system.sias.entity.OfficialStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfficialStudentRepository extends JpaRepository<OfficialStudent, Long> {
    // You can find a student's official record by their main Student ID
    OfficialStudent findByStudentId(Long studentId);
}