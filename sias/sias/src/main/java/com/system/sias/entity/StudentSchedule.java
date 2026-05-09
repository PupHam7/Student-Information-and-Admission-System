package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_schedules")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;         // e.g., "IT101"
    private String subject;      // e.g., "Java Programming"
    private String description;
    private Double units;
    private String schedule;     // e.g., "MW 9:00AM-10:30AM"
    private String instructor;
    private String section;

    @Column(name = "academic_year")
    private String academicYear;

    private String semester;
}