package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(
        name = "subjects",
        uniqueConstraints = {
                // No two subjects in the same section can share the same subject code
                @UniqueConstraint(
                        name  = "uq_subject_code_per_section",
                        columnNames = {"period_key", "section_id", "code"}
                ),
                // No room can be double-booked at the same day/time
                @UniqueConstraint(
                        name  = "uq_no_room_overlap",
                        columnNames = {"day", "time_start", "time_end", "room"}
                ),
                // No instructor can teach two classes at the same day/time
                @UniqueConstraint(
                        name  = "uq_no_instructor_overlap",
                        columnNames = {"day", "time_start", "time_end", "instructor"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period_key", nullable = false, length = 20)
    private String periodKey;

    @Column(name = "section_id", nullable = false, length = 5)
    private String sectionId;   // "A" or "B" — each section has its own schedule

    @Column(nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int units;

    @Column(nullable = false, length = 30)
    private String day;

    @Column(name = "time_start", nullable = false, length = 5)
    private String timeStart;       // stored as "HH:mm" string

    @Column(name = "time_end", nullable = false, length = 5)
    private String timeEnd;

    @Column(nullable = false, length = 50)
    private String room;

    @Column(nullable = false, length = 100)
    private String instructor;
}