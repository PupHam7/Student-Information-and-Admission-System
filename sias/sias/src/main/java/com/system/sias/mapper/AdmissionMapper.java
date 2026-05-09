package com.system.sias.mapper;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.entity.Admission;

public class AdmissionMapper {
    public static AdmissionDto mapToAdmissionDto(Admission admission) {
        AdmissionDto dto = new AdmissionDto();
        dto.setId(admission.getId());
        dto.setFirstName(admission.getFirstName());
        dto.setLastName(admission.getLastName());
        dto.setMiddleName(admission.getMiddleName());
        dto.setEmail(admission.getEmail());
        dto.setContactNumber(admission.getContactNumber());
        dto.setSex(admission.getSex());
        dto.setDateOfBirth(admission.getDateOfBirth());
        dto.setCivilStatus(admission.getCivilStatus());
        dto.setNationality(admission.getNationality());

        dto.setFatherName(admission.getFatherName());
        dto.setMotherName(admission.getMotherName());
        dto.setGuardianName(admission.getGuardianName());
        dto.setEmergencyContact(admission.getEmergencyContact());

        dto.setControlNumber(admission.getControlNumber());
        dto.setProgram(admission.getProgram());
        dto.setDepartment(admission.getDepartment());
        dto.setYearLevel(admission.getYearLevel());
        dto.setAdmissionType(admission.getAdmissionType());
        dto.setLrn(admission.getLrn());
        dto.setGwa(admission.getGwa());
        dto.setLastSchoolAttended(admission.getLastSchoolAttended());

        dto.setStatus(admission.getStatus());
        return dto;
    }
}
