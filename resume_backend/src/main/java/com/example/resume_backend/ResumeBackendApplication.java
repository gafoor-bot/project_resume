package com.example.resume_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example")
public class ResumeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResumeBackendApplication.class, args);
	}

}
