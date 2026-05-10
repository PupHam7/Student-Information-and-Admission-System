package com.system.sias.service.impl;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.entity.Admission;
import com.system.sias.entity.OfficialStudent;
import com.system.sias.entity.Student;
import com.system.sias.exception.ResourceNotFoundException;
import com.system.sias.mapper.AdmissionMapper;
import com.system.sias.repository.AdmissionRepository;
import com.system.sias.repository.OfficialStudentRepository;
import com.system.sias.repository.StudentRepository;
import com.system.sias.repository.StudentScheduleRepository;
import com.system.sias.service.AdmissionService;
import com.system.sias.service.EmailService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Service
@AllArgsConstructor
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;
    private final OfficialStudentRepository officialStudentRepository;
    private final StudentScheduleRepository studentScheduleRepository;

    @Override
    public AdmissionDto applyForAdmission(AdmissionDto admissionDto){
        Admission admission = new Admission();

        // 2. Map fields from the DTO (the frontend form) to the Entity
        admission.setFirstName(admissionDto.getFirstName());
        admission.setLastName(admissionDto.getLastName());
        admission.setMiddleName(admissionDto.getMiddleName());
        admission.setEmail(admissionDto.getEmail());
        admission.setContactNumber(admissionDto.getContactNumber());
        admission.setSex(admissionDto.getSex());
        admission.setDateOfBirth(admissionDto.getDateOfBirth());
        admission.setCivilStatus(admissionDto.getCivilStatus());
        admission.setNationality(admissionDto.getNationality());
        admission.setReligion(admissionDto.getReligion());
        admission.setHeight(admissionDto.getHeight());
        admission.setWeight(admissionDto.getWeight());
        admission.setBirthPlace(admissionDto.getBirthPlace());

        admission.setHomeCountry(admissionDto.getHomeCountry());
        admission.setHomeRegion(admissionDto.getHomeRegion());
        admission.setHomeProvince(admissionDto.getHomeProvince());
        admission.setHomeMunicipality(admissionDto.getHomeMunicipality());
        admission.setHomeBarangay(admissionDto.getHomeBarangay());
        admission.setHomeStreet(admissionDto.getHomeStreet());

        admission.setFatherName(admissionDto.getFatherName());
        admission.setFatherMobile(admissionDto.getFatherMobile());
        admission.setFatherIncome(admissionDto.getFatherIncome());
        admission.setMotherName(admissionDto.getMotherName());
        admission.setMotherMobile(admissionDto.getMotherMobile());
        admission.setMotherIncome(admissionDto.getMotherIncome());
        admission.setGuardianName(admissionDto.getGuardianName());
        admission.setEmergencyContact(admissionDto.getEmergencyContact());

        admission.setControlNumber(admissionDto.getControlNumber());
        admission.setProgram(admissionDto.getProgram());
        admission.setDepartment(admissionDto.getDepartment());
        admission.setYearLevel(admissionDto.getYearLevel());
        admission.setAdmissionType(admissionDto.getAdmissionType());
        admission.setLrn(admissionDto.getLrn());
        admission.setGwa(admissionDto.getGwa());
        admission.setLastSchoolAttended(admissionDto.getLastSchoolAttended());
        admission.setStatus(admissionDto.getStatus());

        // Set initial status
        admission.setStatus("PENDING");
        admission.setApplicationDate(LocalDate.now());

        // 3. Save to database
        Admission savedAdmission = admissionRepository.save(admission);

        // 4. Return as DTO
        return AdmissionMapper.mapToAdmissionDto(savedAdmission);
    }

    @Override
    public AdmissionDto updateAdmissionStatus(Long admissionId, String status) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission record not found."));

        String upperStatus = status.toUpperCase();

        // 1. SAFE RETRIEVAL: Check if student exists
        Student student = admission.getStudent();

        if (upperStatus.equals("APPROVED")) {
            if (!"APPROVED".equals(admission.getStatus())) {

                // 2. THE FIX: If no student account is linked, create one now
                if (student == null) {
                    student = new Student();
                    student.setFirstName(admission.getFirstName());
                    student.setLastName(admission.getLastName());
                    student.setEmail(admission.getEmail());

                    admission.setStudent(student); // Link it to the admission
                }

                // 3. Generate credentials
                String generatedID = "2024" + String.format("%04d", new java.security.SecureRandom().nextInt(10000));
                String randomPassword = String.valueOf(100000 + new java.security.SecureRandom().nextInt(900000));

                student.setStudentNumber(generatedID);
                student.setPassword(randomPassword);

                // 4. Save the student first
                studentRepository.save(student);

                // 5. Send email
                try {
                    emailService.sendCredentialsEmail(
                            student.getEmail(),
                            student.getFirstName(),
                            generatedID,
                            randomPassword
                    );
                } catch (Exception e) {
                    System.err.println("Email failed: " + e.getMessage());
                }

                // 6. Create enrollment record
                OfficialStudent official = new OfficialStudent();
                official.setStudent(student);

// Fix the Header blanks:
                official.setSex(admission.getSex()); // Pulls "Male/Female" from Admission form
                official.setCourse(admission.getProgram()); // Sets full course name

// MANUAL FIX for Department:
// Instead of "Goa (Main Campus)", set the actual College name
                if (admission.getProgram().contains("Information Technology")) {
                    official.setDepartment("College of Information and Communications Technology");
                } else {
                    official.setDepartment(admission.getDepartment());
                }

                official.setSection("BSIT-2A");
                official.setSemester("Second");
                official.setAcademicYear("2025-2026");
                official.setDateEnrolled(LocalDate.now().toString());

                officialStudentRepository.save(official);
            }
            admission.setStatus("APPROVED");

        } else if (upperStatus.equals("REJECTED")) {
            admission.setStatus("REJECTED");
            // Handle rejection email if student exists
            if (student != null) {
                try {
                    emailService.sendRejectionEmail(student.getEmail(), student.getFirstName());
                } catch (Exception e) {
                    System.err.println("Rejection email failed: " + e.getMessage());
                }
            }
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