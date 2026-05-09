package com.system.sias.repository;

import com.system.sias.entity.StudentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentScheduleRepository extends JpaRepository<StudentSchedule, Long> {
    // Find schedules by section (common use case)
    List<StudentSchedule> findBySection(String section);
}