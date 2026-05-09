package com.system.sias.service;

import com.system.sias.dto.AdmissionDto;

import java.util.List;

public interface AdmissionService {
    AdmissionDto applyForAdmission(Long studentId);
    AdmissionDto updateAdmissionStatus(Long admissionId, String status);

    List<AdmissionDto> getAllAdmissions();
    boolean isStudentApproved(Long studentId);
}

