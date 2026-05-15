package com.system.sias.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admission_data")
@Data
@NoArgsConstructor
public class AdmissionData {

    @Id
    @Column(name = "applicant_id")
    private Long id;

    @OneToOne
    @MapsId
    @JsonIgnore
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @Column(name = "admission_level", nullable = false)
    private String admissionLevel;

    @Column(name = "applicant_type")
    private String applicantType;

    // Last School Attended
    @Column(name = "last_school_name", columnDefinition = "TEXT")
    private String lastSchoolName;

    @Column(name = "last_school_address", columnDefinition = "TEXT")
    private String lastSchoolAddress;

    @Column(name = "last_year_attended")
    private String lastYearAttended;

    @Column(name = "last_year_level")
    private String lastYearLevel;

    private String gwa;

    @Column(name = "program_or_strand")
    private String programOrStrand;

    // Current Application Details
    @Column(name = "applied_year_level")
    private String appliedYearLevel;

    private String lrn;
    private String campus;

    @Column(name = "preferred_course_1", nullable = false)
    private String preferredCourse1;

    @Column(name = "preferred_course_2")
    private String preferredCourse2;

    @Column(name = "preferred_course_3")
    private String preferredCourse3;

    @Column(name = "is_confirmed")
    private Boolean isConfirmed;

    //status = pending, approved, rejected
}
