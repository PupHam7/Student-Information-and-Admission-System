package com.system.sias.service.impl;

import com.system.sias.dto.StudentDto;
import com.system.sias.entity.Student;
import com.system.sias.exception.ResourceNotFoundException;
import com.system.sias.mapper.StudentMapper;
import com.system.sias.repository.StudentRepository;
import com.system.sias.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final StudentRepository studentRepository;

    @Override
    public StudentDto login(String studentNumber, String password) {
        Student student = studentRepository.findByStudentNumber(studentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Student Number"));

        // Basic password check (Note: In production, use BCrypt)
        if (!student.getPassword().equals(password)) {
            throw new RuntimeException("Invalid Password");
        }

        return StudentMapper.mapToStudentDto(student);
    }
}