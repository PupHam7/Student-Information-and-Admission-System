package com.system.sias.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(
    name = "sections",
    uniqueConstraints = @UniqueConstraint(columnNames = {"period_key", "section_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period_key", nullable = false, length = 20)
    private String periodKey;       // e.g. "1-1", "2-summer"

    @Column(name = "section_id", nullable = false, length = 1)
    private String sectionId;       // "A", "B", "C", "D"

    @Column(nullable = false, length = 50)
    private String name;            // "Section A"

    @Column(nullable = false)
    private int enrolled;

    @Column(nullable = false)
    private int capacity = 40;      // maximum students per section (default: 10)
}
