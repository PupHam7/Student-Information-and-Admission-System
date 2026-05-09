package com.system.sias.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AdmissionDto {
    private Long id;
    // Personal Data
    private String firstName;
    private String lastName;
    private String middleName;
    private String email;
    private String contactNumber;
    private String sex;
    private LocalDate dateOfBirth;
    private String civilStatus;
    private String nationality;

    // Family Background
    private String fatherName;
    private String motherName;
    private String guardianName;
    private String emergencyContact;

    // Academic/Admission Data
    private String controlNumber;
    private String program;
    private String department;
    private String yearLevel;
    private String admissionType;
    private String lrn;
    private Double gwa;
    private String lastSchoolAttended;

    private String status;
}