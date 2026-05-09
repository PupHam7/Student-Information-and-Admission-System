package com.system.sias.controller;

import com.system.sias.entity.OfficialStudent;
import com.system.sias.repository.OfficialStudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official-students")
@AllArgsConstructor
@CrossOrigin(origins = "*") // Allows your frontend to talk to this controller
public class OfficialStudentController {

    private final OfficialStudentRepository officialStudentRepository;

    // GET official record by the Student's login ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<OfficialStudent> getOfficialRecord(@PathVariable Long studentId) {
        OfficialStudent official = officialStudentRepository.findByStudentId(studentId);
        if (official == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(official);
    }

    // GET official record by the record's primary ID (for admin/COE search)
    @GetMapping("/{id}")
    public ResponseEntity<OfficialStudent> getById(@PathVariable Long id) {
        return officialStudentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}