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
    private String religion;
    private String height;
    private String weight;
    private String birthPlace;

    // Home Address
    private String homeCountry;
    private String homeRegion;
    private String homeProvince;
    private String homeMunicipality;
    private String homeBarangay;
    private String homeStreet;

    // Family Background
    private String fatherName;
    private String fatherMobile;
    private String fatherIncome;
    private String motherName;
    private String motherMobile;
    private String motherIncome;
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