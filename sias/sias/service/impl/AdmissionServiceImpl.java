package com.system.sias.service.impl;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.entity.Admission;
import com.system.sias.entity.Student;
import com.system.sias.exception.ResourceNotFoundException;
import com.system.sias.mapper.AdmissionMapper;
import com.system.sias.repository.AdmissionRepository;
import com.system.sias.repository.StudentRepository;
import com.system.sias.service.AdmissionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor

public class AdmissionServiceImpl implements AdmissionService {

    private AdmissionRepository admissionRepository;
    private StudentRepository studentRepository;


    @Override
    public AdmissionDto applyForAdmission(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student with Id:" + studentId + "not found."));

        Admission admission = new Admission();
        admission.setStudent(student);
        admission.setAdmissionDate(LocalDate.now());
        admission.setStatus("PENDING");

        Admission savedAdmission = admissionRepository.save(admission);
        return AdmissionMapper.mapToAdmissionDto(savedAdmission);
    }

    @Override
    public AdmissionDto updateAdmissionStatus(Long admissionId, String status) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission record with Id: " + admissionId + " does not exist."));

        String upperStatus = status.toUpperCase();

        if(upperStatus.equals("APPROVED") || upperStatus.equals("REJECTED") || upperStatus.equals("PENDING")){
            admission.setStatus(upperStatus);
        } else {
            throw new IllegalArgumentException("Invalid status: " + status + ". Use PENDING, APPROVED, or REJECTED");
        }

        Admission updatedAdmission = admissionRepository.save(admission);
        return AdmissionMapper.mapToAdmissionDto(updatedAdmission);
    }

    @Override
    public boolean isStudentApproved(Long studentId){
        Admission admission = admissionRepository.findByStudent_Id(studentId);
        return admission != null && "APPROVED".equalsIgnoreCase(admission.getStatus());
    }
}
