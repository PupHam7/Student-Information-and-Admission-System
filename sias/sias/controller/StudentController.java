package com.system.sias.controller;

import com.system.sias.dto.ApiResponse;
import com.system.sias.dto.StudentDto;
import com.system.sias.service.StudentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private StudentService studentService;

    //Build Add Student REST API
    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody StudentDto studentDto){
        StudentDto savedStudent = studentService.createStudent(studentDto);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    //Build Get Student REST API
    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable("id") Long studentId){
        StudentDto studentDto = studentService.getStudentById(studentId);
        return ResponseEntity.ok(new ApiResponse<> (true, "Student retrieved succesfully", studentDto));
    }

    //Build Get All Student REST API
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents(){
        List<StudentDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(new ApiResponse<>(true, "All students retrieved", students));
    }

    //Build Update Student REST API
    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(@PathVariable("id") Long studentId, @Valid @RequestBody StudentDto updatedStudent){
        StudentDto studentDto = studentService.updateStudent(studentId, updatedStudent);
        return ResponseEntity.ok(new ApiResponse<> (true, "Student updated succesfully", studentDto));
    }

    //Build Delete Student REST API
    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<String>> deleteStudent(@PathVariable("id") Long studentId){
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Student removed successfuly", "Deleted ID: " + studentId));
    }
}
