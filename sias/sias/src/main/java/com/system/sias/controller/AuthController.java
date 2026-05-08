package com.system.sias.controller;

import com.system.sias.dto.ApiResponse;
import com.system.sias.dto.LoginRequest;
import com.system.sias.dto.StudentDto;
import com.system.sias.entity.Student;
import com.system.sias.mapper.StudentMapper;
import com.system.sias.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<StudentDto>> login(@RequestBody LoginRequest loginRequest) {
        return studentRepository.findByStudentNumber(loginRequest.getUserId())
                .map(student -> {
                    StudentDto dto = StudentMapper.mapToStudentDto(student);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", dto));
                })
                .orElse(ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Invalid Student ID", null)));
    }
}