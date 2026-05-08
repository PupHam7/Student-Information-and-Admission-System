package com.system.sias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionDto {
    private Long id;
    private StudentDto student;
    private LocalDate admissionDate;
    private String status;
}
