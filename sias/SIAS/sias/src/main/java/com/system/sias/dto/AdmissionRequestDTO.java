package com.system.sias.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AdmissionRequestDTO {
    private String controlNumber;

    // Personal Data
    private String lastName;
    private String firstName;
    private String middleName;
    private String nameExtension;
    private LocalDate dateOfBirth;
    private String sex;
    private String mobileNumber;
    private String emailAddress;
    private String civilStatus;
    private String birthPlace;
    private String height;
    private String religion;
    private String religionOther;
    private String weight;
    private String nationality;


    // Family Background
    //Father
    private String fatherName;
    private String fatherLastName;
    private String fatherFirstName;
    private String fatherMiddleName;
    private String fatherMobile;
    private String fatherOccupation;
    private String fatherIncome;
    // Mother
    private String motherName;
    private String motherLastName;
    private String motherFirstName;
    private String motherMiddleName;
    private String motherMobile;
    private String motherOccupation;
    private String motherIncome;
    //Guardian
    private String guardianName;
    private String guardianRelationship;
    private String guardianContact;
    private String guardianRelationshipOther;
    //Emergency Contact
    private String emergencyContactName;
    private String emergencyContactNo;

    // Home Address
    private HomeAddressDTO homeAddress;
    private String presentCountry;
    private String presentRegion;
    private String presentProvince;
    private String presentMunicipality;
    private String presentBarangay;
    private String presentStreet;
    private Boolean isGida;

    // Admission Data
    private String admissionLevel;
    private String admissionType;
    private String lrn;
    private String choice1;
    private String choice2;
    private String choice3;
    private String lastSchoolName;
    private String lastSchoolAddress;
    private String campus;


    private String lastYearAttended;
    private String lastYearLevel;
    private String gwa;
    private String programOrStrand;
    private String appliedYearLevel;
    private Boolean isConfirmed;
}
