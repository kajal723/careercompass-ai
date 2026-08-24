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
        response.put("overallReadiness", 0);
        response.put("targetCompany", company);
        response.put("targetRole", role);
        response.put("alignmentLabel", "Not yet calculated");

        List<Map<String, Object>> pillars = new ArrayList<>();
        pillars.add(createPillar("Technical Skills", 0, "#6366f1", "Add technical skills to calculate this pillar."));
        pillars.add(createPillar("DSA / Problem Solving", 0, "#3b82f6", "Add problem-solving evidence to calculate this pillar."));
        pillars.add(createPillar("Applied Projects", 0, "#10b981", "Add projects to calculate this pillar."));
        pillars.add(createPillar("Communication", 0, "#f59e0b", "Add communication evidence to calculate this pillar."));
        pillars.add(createPillar("Resume & Evidence", 0, "#8b5cf6", "Upload a resume to calculate this pillar."));
        pillars.add(createPillar("Interview Readiness", 0, "#ec4899", "Complete an interview to calculate this pillar."));

        response.put("pillars", pillars);
        response.put("topSkillGap", null);
        response.put("nextBestAction", null);

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
