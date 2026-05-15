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

import com.system.sias.repository.coe_sched_repository;
import com.system.sias.entity.coe_sched;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/coestudsched")
@CrossOrigin(origins = "*")
public class coe_sched_controller {

    @Autowired
    private coe_sched_repository repo;

    @GetMapping // your custom endpoint
    public List<coe_sched> getAllSchedules() {
        return repo.findAll();
    }
}
