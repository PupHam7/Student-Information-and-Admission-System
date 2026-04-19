package com.system.sias.exception;

import com.system.sias.dto.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ApiResponse<String> handleGeneralException(Exception ex) {
        return new ApiResponse<>("error", "An unexpected error occured: " + ex.getMessage(), null);
    }
    // will add other handlers later
}
