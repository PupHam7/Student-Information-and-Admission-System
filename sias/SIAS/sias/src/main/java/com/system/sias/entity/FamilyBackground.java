package com.system.sias.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "family_background")
@Data
@NoArgsConstructor
public class FamilyBackground {

    @Id
    @Column(name = "applicant_id")
    private Long id;

    @OneToOne
    @MapsId
    @JsonIgnore
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    // Father
    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "father_last_name")
    private String fatherLastName;

    @Column(name = "father_first_name")
    private String fatherFirstName;

    @Column(name = "father_middle_name")
    private String fatherMiddleName;

    @Column(name = "father_mobile")
    private String fatherMobile;

    @Column(name = "father_occupation")
    private String fatherOccupation;

    @Column(name = "father_income")
    private String fatherIncome;

    // Mother
    @Column(name = "mother_name")
    private String motherName;

    @Column(name = "mother_last_name")
    private String motherLastName;

    @Column(name = "mother_first_name")
    private String motherFirstName;

    @Column(name = "mother_middle_name")
    private String motherMiddleName;

    @Column(name = "mother_mobile")
    private String motherMobile;

    @Column(name = "mother_occupation")
    private String motherOccupation;

    @Column(name = "mother_income")
    private String motherIncome;

    // Guardian
    @Column(name = "guardian_name")
    private String guardianName;

    @Column(name = "guardian_mobile")
    private String guardianMobile;

    @Column(name = "guardian_relationship")
    private String guardianRelationship;

    @Column(name = "guardian_relationship_other")
    private String guardianRelationshipOther;

    // Emergency Contact
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_mobile")
    private String emergencyMobile;

    @Column(name = "emergency_relationship")
    private String emergencyRelationship;


}
