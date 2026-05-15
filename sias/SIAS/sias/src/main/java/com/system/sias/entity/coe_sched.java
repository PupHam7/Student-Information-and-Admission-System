package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "student_schedule")
public class coe_sched {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String code;
    private String subject;
    private String description;
    private Double units;
    private String schedule;
    private String instructor;
    private String section;

}

