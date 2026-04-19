package com.system.sias.service;

import com.system.sias.entities.Student;
import com.system.sias.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org .springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public Student registerStudent(Student student) {
        if  (student.getStatus() == null) {
            student.setStatus("Pending");
        }
        return studentRepository.save(student);
    }
}
