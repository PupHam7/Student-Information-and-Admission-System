package com.system.sias.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "personal_data")
@Data
@NoArgsConstructor
public class PersonalData {

    @Id
    @Column(name = "applicant_id")
    private Long id;

    @OneToOne
    @MapsId
    @JsonIgnore
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "name_extension")
    private String nameExtension;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String sex;

    private String height;
    private String weight;
    private String religion;

    @Column(name = "religion_other")
    private String religionOther;

    @Column(name = "civil_status", nullable = false)
    private String civilStatus;

    @Column(name = "birth_place", columnDefinition = "TEXT")
    private String birthPlace;

    // Home Address
    @Column(name = "home_country")
    private String homeCountry;

    @Column(name = "home_region")
    private String homeRegion;

    @Column(name = "home_province")
    private String homeProvince;

    @Column(name = "home_municipality")
    private String homeMunicipality;

    @Column(name = "home_barangay")
    private String homeBarangay;

    @Column(name = "home_street", columnDefinition = "TEXT")
    private String homeStreet;

    @Column(name = "use_home_as_present")
    private Boolean useHomeAsPresent;

    // Present Address
    @Column(name = "present_country")
    private String presentCountry;

    @Column(name = "present_region")
    private String presentRegion;

    @Column(name = "present_province")
    private String presentProvince;

    @Column(name = "present_municipality")
    private String presentMunicipality;

    @Column(name = "present_barangay")
    private String presentBarangay;

    @Column(name = "present_street", columnDefinition = "TEXT")
    private String presentStreet;

    @Column(name = "is_gida")
    private Boolean isGida;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "email_address")
    private String emailAddress;

    private String nationality;

    @Column(name = "has_dual_citizenship")
    private Boolean hasDualCitizenship;

    @Column(name = "second_nationality")
    private String secondNationality;

    @Column(name = "member_of_ip")
    private Boolean memberOfIp;

    @Column(name = "ip_group_name")
    private String ipGroupName;

    @Column(name = "is_pwd")
    private Boolean isPwd;

    @Column(name = "is_working_student")
    private Boolean isWorkingStudent;


}
