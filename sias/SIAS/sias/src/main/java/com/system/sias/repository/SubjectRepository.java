package com.system.sias.repository;

import com.system.sias.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    // All subjects for a given period AND section (e.g. "1-1", "A")
    List<Subject> findByPeriodKeyAndSectionId(String periodKey, String sectionId);

    // All subjects for a given period (used internally)
    List<Subject> findByPeriodKey(String periodKey);

    // Count used by seeder to decide whether to insert seed data
    long countByPeriodKey(String periodKey);
}
