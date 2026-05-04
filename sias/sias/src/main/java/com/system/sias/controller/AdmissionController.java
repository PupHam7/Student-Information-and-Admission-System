package com.system.sias.controller;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.dto.ApiResponse;
import com.system.sias.entity.Admission;
import com.system.sias.service.AdmissionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admissions")
@AllArgsConstructor

public class AdmissionController {

    private AdmissionService admissionService;

    @PostMapping("/apply/{studentId}")
    public ResponseEntity<ApiResponse<AdmissionDto>> applyForAdmission(@PathVariable Long studentId) {
        AdmissionDto admissionDto = admissionService.applyForAdmission(studentId);
        return new ResponseEntity<>(new ApiResponse<>(true, "Admission application submitted", admissionDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdmissionDto>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        AdmissionDto updated = admissionService.updateAdmissionStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Admission status updated to " + status, updated));
    }
}
