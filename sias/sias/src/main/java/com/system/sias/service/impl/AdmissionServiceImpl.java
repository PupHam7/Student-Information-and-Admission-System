package com.system.sias.service.impl;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.entity.Admission;
import com.system.sias.entity.Student;
import com.system.sias.exception.ResourceNotFoundException;
import com.system.sias.mapper.AdmissionMapper;
import com.system.sias.repository.AdmissionRepository;
import com.system.sias.repository.StudentRepository;
import com.system.sias.service.AdmissionService;
import com.system.sias.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    @Override
    public AdmissionDto applyForAdmission(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student with Id: " + studentId + " not found."));

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
                .orElseThrow(() -> new ResourceNotFoundException("Admission record not found."));

        String upperStatus = status.toUpperCase();
        Student student = admission.getStudent(); // Retrieve student for email usage

        if (upperStatus.equals("APPROVED")) {
            // Only generate credentials if not already approved
            if (!"APPROVED".equals(admission.getStatus())) {
                String generatedID = "2024" + String.format("%04d", new SecureRandom().nextInt(10000));
                String randomPassword = String.valueOf(100000 + new SecureRandom().nextInt(900000));

                student.setStudentNumber(generatedID);
                student.setPassword(randomPassword);
                studentRepository.save(student);

                try {
                    emailService.sendCredentialsEmail(
                            student.getEmail(),
                            student.getFirstName(),
                            generatedID,
                            randomPassword
                    );
                } catch (Exception e) {
                    System.err.println("Failed to send approval email: " + e.getMessage());
                }
            }
            admission.setStatus("APPROVED");

        } else if (upperStatus.equals("REJECTED")) {
            admission.setStatus("REJECTED");

            // Trigger the rejection email logic
            try {
                emailService.sendRejectionEmail(
                        student.getEmail(),
                        student.getFirstName()
                );
            } catch (Exception e) {
                System.err.println("Failed to send rejection email: " + e.getMessage());
            }

        } else if (upperStatus.equals("PENDING")) {
            admission.setStatus("PENDING");
        } else {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        Admission updatedAdmission = admissionRepository.save(admission);
        return AdmissionMapper.mapToAdmissionDto(updatedAdmission);
    }

    @Override
    public List<AdmissionDto> getAllAdmissions() {
        List<Admission> admissions = admissionRepository.findAll();
        return admissions.stream()
                .map(AdmissionMapper::mapToAdmissionDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isStudentApproved(Long studentId) {
        Admission admission = admissionRepository.findByStudent_Id(studentId);
        return admission != null && "APPROVED".equalsIgnoreCase(admission.getStatus());
    }
}