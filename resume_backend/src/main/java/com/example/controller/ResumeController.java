package com.example.controller;

//
//Source code recreated from a .class file by IntelliJ IDEA
//(powered by FernFlower decompiler)
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.util.ResumeTextExtractor;

@RestController
@RequestMapping("/api")  // Base path
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {
    @Value("${huggingface.api.url}")
    private String huggingFaceApiUrl;
    
    @Value("${huggingface.api.key}")
    private String huggingFaceApiKey;
    
    private final RestTemplate restTemplate;

    public ResumeController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/upload-resume")  // Correct endpoint path
    public ResponseEntity<?> uploadResume(@RequestParam("resume") MultipartFile resume, @RequestParam("jobDescription") String jobDescription) {
        String resumeText = ResumeTextExtractor.extractText(resume);
        List<String> suggestions = this.getHuggingFaceKeywords(resumeText, jobDescription);
        return ResponseEntity.ok(suggestions);
    }
    
    private List<String> getHuggingFaceKeywords(String resumeText, String jobDescription) {
        try {
            String payload = "{\"inputs\": \"Resume: " + resumeText + "\\nJob Description: " + jobDescription + "\",\"parameters\": {\"candidate_labels\": [\"skills\", \"experience\", \"technologies\", \"qualifications\", \"responsibilities\"]}}";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + this.huggingFaceApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = this.restTemplate.exchange(this.huggingFaceApiUrl, HttpMethod.POST, request, String.class);
            return Collections.singletonList(response.getBody());
        } catch (Exception e) {
            return Collections.singletonList("Error calling Hugging Face API: " + e.getMessage());
        }
    }
}
