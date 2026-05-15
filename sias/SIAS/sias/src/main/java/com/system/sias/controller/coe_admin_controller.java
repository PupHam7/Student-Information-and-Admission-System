package com.system.sias.controller;

import com.system.sias.entity.coe_admin;
import com.system.sias.repository.coe_admin_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coestudentinfo")
@CrossOrigin(origins = "*")
public class coe_admin_controller {

    @Autowired
    private coe_admin_repository repo;

    /**
     * GET /api/coestudentinfo/{id}
     * Returns COE admission info by primary key.
     */
    @GetMapping("/{id}")
    public ResponseEntity<coe_admin> getStudentById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/coestudentinfo/by-admission/{id}
     *
     * FIX: Previous mapping was @GetMapping("/api/admission/{id}") which — under
     *      the base path /api/coestudentinfo — resolved to the nonsensical URL
     *      /api/coestudentinfo/api/admission/{id} (always a 404).
     *      Corrected to a sensible relative path.
     *
     * NOTE: No frontend currently calls this endpoint. If you don't need it,
     *       this method can be removed.
     */
    @GetMapping("/by-admission/{id}")
    public ResponseEntity<coe_admin> getByAdmissionId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}