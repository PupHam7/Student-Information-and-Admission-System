package com.system.sias.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class HomeAddressDTO {
    private String country;
    private String region;
    private String province;
    private String municipality;
    private String barangay;
    private String street;
    private Boolean useHomeAsPresent;



}
