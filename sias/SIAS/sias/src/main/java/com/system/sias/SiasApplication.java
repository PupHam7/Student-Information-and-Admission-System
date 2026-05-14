package com.system.sias;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SiasApplication {
	public static void main(String[] args) {
		SpringApplication.run(SiasApplication.class, args);
		System.out.println("PSU Admission System is running on http://localhost:8080");
	}
}