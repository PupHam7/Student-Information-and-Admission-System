package com.system.sias.repository;

import com.system.sias.entity.coe_sched; // Use coe_sched instead of sched_assess
import org.springframework.data.jpa.repository.JpaRepository;

public interface sched_repository extends JpaRepository<coe_sched, Integer> {
}