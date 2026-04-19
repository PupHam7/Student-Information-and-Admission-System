package com.system.sias.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="Student")

public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @NotBlank(message = "First name is required")
    private String studentName;

    @Email(message = "Please provie a valid email address")
    @Column(name="studentEmail", unique = true)
    private String email;

    private String status;
}

