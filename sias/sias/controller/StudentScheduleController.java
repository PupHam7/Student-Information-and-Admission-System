package com.system.sias.controller;

import com.system.sias.entity.StudentSchedule;
import com.system.sias.repository.StudentScheduleRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class StudentScheduleController {

    private final StudentScheduleRepository scheduleRepository;

    // Get all schedules
    @GetMapping
    public List<StudentSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Get schedules for a specific section (e.g., "BSIT-1A")
    @GetMapping("/section/{sectionName}")
    public List<StudentSchedule> getBySection(@PathVariable String sectionName) {
        return scheduleRepository.findBySection(sectionName);
    }
}