package com.careercompass.controller;

import com.careercompass.model.StudentProfile;
import com.careercompass.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private StudentProfileRepository profileRepository;

    @GetMapping("/default")
    public ResponseEntity<StudentProfile> getDefaultProfile() {
        StudentProfile defaultStudent = new StudentProfile(
                "Kajal Shah",
                "kajal.shah@university.edu",
                "National Institute of Technology",
                "B.Tech Computer Science and Engineering",
                "8.2",
                "2026",
                "Java Backend Developer",
                "Microsoft",
                "Software Engineer",
                Arrays.asList("Java", "SQL", "DSA", "Git", "MySQL", "OOP", "DBMS"),
                Arrays.asList("Problem Solving", "Analytical Thinking", "Team Collaboration")
        );
        return ResponseEntity.ok(defaultStudent);
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
