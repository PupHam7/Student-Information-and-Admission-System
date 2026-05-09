package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "official_students")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfficialStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String course;
    private String department;

    @Column(name = "year_level")
    private String yearLevel;

    private String section;
    private String semester;

    @Column(name = "academic_year")
    private String academicYear;

    @Column(name = "date_enrolled")
    private String dateEnrolled;
}