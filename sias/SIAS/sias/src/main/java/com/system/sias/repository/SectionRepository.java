package com.system.sias.repository;

import com.system.sias.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    // All sections for a given period (e.g. "1-1")
    List<Section> findByPeriodKeyOrderByEnrolledAsc(String periodKey);

    // Check if any sections exist at all (used by seeder)
    boolean existsByPeriodKey(String periodKey);
}
