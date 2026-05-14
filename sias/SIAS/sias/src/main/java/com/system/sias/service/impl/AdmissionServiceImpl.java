package com.system.sias.service.impl;

import com.system.sias.dto.AdmissionRequestDTO;
import com.system.sias.entity.Applicant;
import com.system.sias.exception.ResourceNotFoundException;
import com.system.sias.mapper.AdmissionMapper;
import com.system.sias.repository.ApplicantRepository;
import com.system.sias.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdmissionServiceImpl implements AdmissionService {

    @Autowired
    private ApplicantRepository applicantRepository;

    @Autowired
    private AdmissionMapper admissionMapper;

    @Override
    @Transactional
    public String saveApplication(AdmissionRequestDTO dto) {
        Applicant applicant = admissionMapper.toEntity(dto);
        Applicant saved = applicantRepository.save(applicant);
        return saved.getControlNumber();
    }

    @Override
    public Applicant findByControlNumber(String controlNumber) {
        return applicantRepository.findByControlNumber(controlNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with Control No: " + controlNumber));
    }

    @Override
    public List<Applicant> findAll() {
        // This calls the built-in JpaRepository method to fetch all rows
        return applicantRepository.findAll();
    }
}
