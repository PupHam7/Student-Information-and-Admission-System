package com.system.sias.controller;

import com.system.sias.dto.ApiResponse;
import com.system.sias.dto.LoginRequest;
import com.system.sias.dto.StudentDto;
import com.system.sias.mapper.StudentMapper;
import com.system.sias.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<StudentDto>> login(@RequestBody LoginRequest loginRequest) {
        return studentRepository.findByStudentNumber(loginRequest.getUserId())
                .map(student -> {
                    // 2. Check the password
                    if (student.getPassword().equals(loginRequest.getPassword())) {
                        StudentDto dto = StudentMapper.mapToStudentDto(student);
                        return ResponseEntity.ok(
                                new ApiResponse<>(true, "Login successful", dto)
                        );
                    } else {
                        // Wrong password case
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse<StudentDto>(false, "Invalid Password", null));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<StudentDto>(false, "Invalid Student ID", null)));
    }
}