package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "admission")
public class coe_admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String sex;
    private String department;

    @Column(name = "program")
    private String course;

    private String section;

    @Column(name = "year_level")
    private String yearLevel;

    private boolean validated;

    // Matching the column name exactly as you specified: "dateenrolled"
    @Column(name = "dateenrolled")
    private String dateEnrolled;

    private String sem;

    @Column(name = "academic_year")
    private String academicyear;

}

