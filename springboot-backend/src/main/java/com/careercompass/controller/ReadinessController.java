package com.careercompass.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/readiness")
@CrossOrigin(origins = "*")
public class ReadinessController {

    @GetMapping("/score")
    public ResponseEntity<Map<String, Object>> getReadinessScore(
            @RequestParam(defaultValue = "Microsoft") String company,
            @RequestParam(defaultValue = "Software Engineer") String role) {

        Map<String, Object> response = new HashMap<>();
        response.put("overallReadiness", 78);
        response.put("targetCompany", company);
        response.put("targetRole", role);
        response.put("alignmentLabel", "High Skill Alignment");

        List<Map<String, Object>> pillars = new ArrayList<>();
        pillars.add(createPillar("Technical Skills", 82, "#6366f1", "Strong Core Java, OOP & SQL knowledge"));
        pillars.add(createPillar("DSA / Problem Solving", 71, "#3b82f6", "180+ problems solved; needs Tree & Graph mastery"));
        pillars.add(createPillar("Applied Projects", 75, "#10b981", "2 desktop/CLI projects; needs REST API & Docker"));
        pillars.add(createPillar("Communication", 81, "#f59e0b", "Clear articulation, needs STAR method polish"));
        pillars.add(createPillar("Resume & Evidence", 88, "#8b5cf6", "Structured format with verified internship & certs"));
        pillars.add(createPillar("Interview Readiness", 70, "#ec4899", "Recent adaptive mock interview score feedback"));

        response.put("pillars", pillars);
        response.put("topSkillGap", "Spring Boot");
        response.put("nextBestAction", "Complete Spring Boot REST API module (Roadmap Week 1-2)");

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createPillar(String name, int score, String color, String summary) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("score", score);
        map.put("color", color);
        map.put("summary", summary);
        return map;
    }
}
