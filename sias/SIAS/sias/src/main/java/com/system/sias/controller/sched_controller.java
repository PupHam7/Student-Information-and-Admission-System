/*@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/schedules")
    public List<Map<String, String>> getSchedules() {

        List<Map<String, String>> list = new ArrayList<>();

        // SAMPLE (later this comes from DB)
        Map<String, String> s1 = new HashMap<>();
        s1.put("subject", "CC5");
        s1.put("schedule", "3-5 pm T ITRM3");

        list.add(s1);

        return list;
    }
};*/
package com.system.sias.controller;

import com.system.sias.entity.coe_sched;
import com.system.sias.repository.sched_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*")
public class sched_controller {

    @Autowired
    private sched_repository repo;

    @GetMapping
    public List<coe_sched> getAllSchedules() {
        return repo.findAll();
    }
}
