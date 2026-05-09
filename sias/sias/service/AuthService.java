package com.system.sias.service;

import com.system.sias.dto.StudentDto;

public interface AuthService {
    StudentDto login(String studentNumber, String password);
}