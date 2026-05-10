package com.system.sias.controller;

import com.system.sias.dto.AdmissionDto;
import com.system.sias.dto.ApiResponse;
import com.system.sias.entity.Admission;
import com.system.sias.service.AdmissionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@CrossOrigin(origins = "*")
@AllArgsConstructor

public class AdmissionController {

    private AdmissionService admissionService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<AdmissionDto>> submitAdmission(@RequestBody AdmissionDto admissionDto) {
        AdmissionDto savedDto = admissionService.applyForAdmission(admissionDto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Application Submitted Successfully", savedDto),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<AdmissionDto> updateStatus(@PathVariable("id") Long admissionId,
                                                     @RequestParam String status) {
        AdmissionDto updated = admissionService.updateAdmissionStatus(admissionId, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<AdmissionDto>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }


}
