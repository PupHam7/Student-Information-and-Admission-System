package com.system.sias.controller;

import java.util.List;

import com.system.sias.entities.Student;
import com.system.sias.repository.StudentRepository;
import com.system.sias.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public ApiResponse<List<Student>> getAllStudents(){
        List<Student> students = studentRepository.findAll();
        return new ApiResponse<>("success", "Student retrieved", students);
    }

    @PostMapping
    public ApiResponse<Student> createStudent(@RequestBody Student student){
        Student savedStudent = studentRepository.save(student);
        return new ApiResponse<>("success", "Student created successfully", savedStudent);
    }
}
