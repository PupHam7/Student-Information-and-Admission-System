package com.system.sias.service;

import com.system.sias.dto.AdmissionRequestDTO;
import com.system.sias.entity.Applicant;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface AdmissionService {
    String saveApplication(AdmissionRequestDTO dto);
    Applicant findByControlNumber(String controlNumber);

    List<Applicant> findAll();
}
