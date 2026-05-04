package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admission")
public class Admission extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name ="admission_date")
    private LocalDate admissionDate;

    @Column(name = "status")
    private String status;

    @OneToOne
    @JoinColumn(name = "student_id", referencedColumnName =  "id")
    private Student student;


}
