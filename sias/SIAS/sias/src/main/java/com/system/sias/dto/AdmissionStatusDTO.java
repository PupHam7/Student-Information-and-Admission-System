package com.system.sias.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class AdmissionStatusDTO {
    private Long id;
    private String controlNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private boolean isConfirmed;


    public void setPreferredCourse(String preferredCourse1) {
    }

    public void setIsConfirmed(boolean confirmed) {
    }
}