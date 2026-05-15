package com.system.sias.mapper;

import com.system.sias.dto.AdmissionRequestDTO;
import com.system.sias.entity.*;
import org.springframework.stereotype.Component;

@Component
public class AdmissionMapper {

    public Applicant toEntity(AdmissionRequestDTO dto) {
        Applicant applicant = new Applicant();
        applicant.setControlNumber(dto.getControlNumber());

        PersonalData pd = new PersonalData();
        pd.setApplicant(applicant);
        pd.setLastName(dto.getLastName());
        pd.setFirstName(dto.getFirstName());
        pd.setMiddleName(dto.getMiddleName());
        pd.setNameExtension(dto.getNameExtension());
        pd.setDateOfBirth(dto.getDateOfBirth());
        pd.setSex(dto.getSex());
        pd.setEmailAddress(dto.getEmailAddress());
        pd.setMobileNumber(dto.getMobileNumber());
        pd.setCivilStatus(dto.getCivilStatus());
        pd.setBirthPlace(dto.getBirthPlace());
        pd.setHeight(dto.getHeight());
        pd.setWeight(dto.getWeight());
        pd.setReligion(dto.getReligion());
        pd.setNationality(dto.getNationality());

        if (dto.getHomeAddress() != null) {
            pd.setHomeCountry(dto.getHomeAddress().getCountry());
            pd.setHomeRegion(dto.getHomeAddress().getRegion());
            pd.setHomeProvince(dto.getHomeAddress().getProvince());
            pd.setHomeMunicipality(dto.getHomeAddress().getMunicipality());
            pd.setHomeBarangay(dto.getHomeAddress().getBarangay());
            pd.setHomeStreet(dto.getHomeAddress().getStreet());
            pd.setPresentCountry(dto.getPresentCountry());
            pd.setPresentRegion(dto.getPresentRegion());
        }
        applicant.setPersonalData(pd);

        // Map Family Background
        FamilyBackground fb = new FamilyBackground();
        fb.setApplicant(applicant);
        //Father
        fb.setFatherName(dto.getFatherName());
        fb.setFatherLastName(dto.getFatherLastName());
        fb.setFatherFirstName(dto.getFatherFirstName());
        fb.setFatherMiddleName(dto.getFatherMiddleName());
        fb.setFatherMobile(dto.getFatherMobile());
        fb.setFatherOccupation(dto.getFatherOccupation());
        fb.setFatherIncome(dto.getFatherIncome());

        //Mother
        fb.setMotherName(dto.getMotherName());
        fb.setMotherLastName(dto.getMotherLastName());
        fb.setMotherFirstName(dto.getMotherFirstName());
        fb.setMotherMiddleName(dto.getMotherMiddleName());
        fb.setMotherMobile(dto.getMotherMobile());
        fb.setMotherOccupation(dto.getMotherOccupation());
        fb.setMotherIncome(dto.getMotherIncome());

        //Guardian
        fb.setGuardianName(dto.getGuardianName());
        fb.setGuardianMobile(dto.getGuardianContact());
        fb.setGuardianRelationship(dto.getGuardianRelationship());
        fb.setGuardianRelationshipOther(dto.getGuardianRelationshipOther());
        //Emergency Contact
        fb.setEmergencyContactName(dto.getEmergencyContactName());
        fb.setEmergencyMobile(dto.getEmergencyContactNo());
        applicant.setFamilyBackground(fb);

        //Admission Mapper
        AdmissionData ad = new AdmissionData();
        ad.setApplicant(applicant);

        ad.setAdmissionLevel(dto.getAdmissionLevel());
        ad.setApplicantType(dto.getAdmissionType());

        ad.setLrn(dto.getLrn());

        ad.setPreferredCourse1(dto.getChoice1());
        ad.setPreferredCourse2(dto.getChoice2());
        ad.setPreferredCourse3(dto.getChoice3());

        ad.setLastSchoolName(dto.getLastSchoolName());
        ad.setLastSchoolAddress(dto.getLastSchoolAddress());
        ad.setCampus(dto.getCampus());
        ad.setLastYearAttended(dto.getLastYearAttended());
        ad.setLastYearLevel(dto.getLastYearLevel());
        ad.setGwa(dto.getGwa());
        ad.setProgramOrStrand(dto.getProgramOrStrand());
        ad.setAppliedYearLevel(dto.getAppliedYearLevel());
        ad.setIsConfirmed(dto.getIsConfirmed());
        applicant.setAdmissionData(ad);

        pd.setApplicant(applicant);
        applicant.setPersonalData(pd);

        return applicant;
    }
}