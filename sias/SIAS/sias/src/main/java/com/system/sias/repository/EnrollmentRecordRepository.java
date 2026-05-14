package com.system.sias.repository;

import com.system.sias.entity.EnrollmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRecordRepository extends JpaRepository<EnrollmentRecord, Long> {

    List<EnrollmentRecord> findByPeriodKeyAndSectionId(String periodKey, String sectionId);

    List<EnrollmentRecord> findAllByOrderByEnrolledAtDesc();
}
