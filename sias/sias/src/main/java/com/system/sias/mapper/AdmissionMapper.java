package com.system.sias.mapper;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.entity.Admission;

public class AdmissionMapper {

    public static AdmissionDto mapToAdmissionDto(Admission admission){
        return new AdmissionDto(
                admission.getId(),
                admission.getAdmissionDate(),
                admission.getStatus(),
                admission.getStudent().getId()
        );
    }
}
