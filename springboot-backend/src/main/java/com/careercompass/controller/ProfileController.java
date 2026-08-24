package com.careercompass.controller;

import com.careercompass.model.StudentProfile;
import com.careercompass.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private StudentProfileRepository profileRepository;

    @GetMapping("/default")
    public ResponseEntity<StudentProfile> getDefaultProfile() {
        StudentProfile emptyProfile = new StudentProfile();
        emptyProfile.setTechnicalSkills(Collections.emptyList());
        emptyProfile.setSoftSkills(Collections.emptyList());
        return ResponseEntity.ok(emptyProfile);
    }

    @PostMapping("/save")
    public ResponseEntity<StudentProfile> saveProfile(@RequestBody StudentProfile profile) {
        StudentProfile saved = profileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<StudentProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
    }
}
