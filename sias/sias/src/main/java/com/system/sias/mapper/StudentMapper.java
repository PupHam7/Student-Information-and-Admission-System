package com.system.sias.mapper;

import com.system.sias.dto.StudentDto;
import com.system.sias.entity.Student;

public class StudentMapper {

    public static StudentDto mapToStudentDto(Student student){
        return new StudentDto(
                student.getId(),
                student.getStudentNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getPassword(),
                student.getEmail(),
                student.getSex()
        );
    }

    public static Student mapToStudent(StudentDto studentDto){
        Student student = new Student();
        student.setId(studentDto.getId());
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPassword(studentDto.getPassword());
        return student;
    }
}
