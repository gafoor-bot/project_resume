package com.example.util;

//
//Source code recreated from a .class file by IntelliJ IDEA
//(powered by FernFlower decompiler)
//

import java.io.IOException;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.web.multipart.MultipartFile;

public class ResumeTextExtractor {
 public ResumeTextExtractor() {
 }

 public static String extractText(MultipartFile file) {
     Tika tika = new Tika();

     try {
         return tika.parseToString(file.getInputStream());
     } catch (TikaException | IOException e) {
         return "Error extracting text from resume: " + ((Exception)e).getMessage();
     }
 }
}
