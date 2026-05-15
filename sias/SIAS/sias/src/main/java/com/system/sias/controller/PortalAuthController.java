package com.system.sias.controller;

import com.system.sias.repository.official_student_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")   // FIX: was hardcoded "http://127.0.0.1:5500" — broke any other origin
public class PortalAuthController {

    @Autowired
    private official_student_repository officialRepo;

    /**
     * POST /api/auth/login
     *
     * Body: { "studentNumber": "202400001", "password": "123456" }
     *
     * Returns the full official_student object on success (script.js stores
     * studentNumber and name from the response).
     *
     * NOTE: Passwords are currently stored as plain text. For production,
     *       hash them with BCrypt and use passwordEncoder.matches() here.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String sno  = credentials.get("studentNumber");
        String pass = credentials.get("password");

        if (sno == null || sno.isBlank() || pass == null || pass.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Student number and password are required.");
        }

        return officialRepo.findByStudentNumber(sno)
                .map(student -> {
                    if (student.getPassword().equals(pass)) {
                        return ResponseEntity.ok(student);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .<Object>body("Invalid password.");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No account found with that Student ID."));
    }
}