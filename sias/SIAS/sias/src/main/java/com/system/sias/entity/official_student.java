package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "official_student")
public class official_student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_number", unique = true)
    private String studentNumber;

    @Column(name = "password")
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String sex;
    private Integer age;
    private String course;
    private String department;

    @Column(name = "year_level")
    private String yearLevel;

    private String sem;

    @Column(name = "academic_year")
    private String academicyear;

    @Column(name = "dateenrolled")
    private String dateenrolled;
    private String section;

}