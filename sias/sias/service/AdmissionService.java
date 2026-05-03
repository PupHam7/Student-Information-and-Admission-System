package com.system.sias.service;

import com.system.sias.dto.AdmissionDto;

public interface AdmissionService {
    AdmissionDto applyForAdmission(Long studentId);
    AdmissionDto updateAdmissionStatus(Long admissionId, String status);

    boolean isStudentApproved(Long studentId);
}

