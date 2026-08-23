package com.careercompass.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    @GetMapping("/questions")
    public ResponseEntity<List<Map<String, Object>>> getQuestions(
            @RequestParam(defaultValue = "Mixed") String type,
            @RequestParam(defaultValue = "Microsoft") String company) {

        List<Map<String, Object>> questions = new ArrayList<>();

        Map<String, Object> q1 = new HashMap<>();
        q1.put("id", "q-tech-01");
        q1.put("category", "Technical");
        q1.put("question", "Explain the difference between HashMap and ConcurrentHashMap in Java. How does ConcurrentHashMap achieve thread safety without locking the entire map?");
        q1.put("difficulty", "Medium");
        questions.add(q1);

        Map<String, Object> q2 = new HashMap<>();
        q2.put("id", "q-dsa-01");
        q2.put("category", "DSA");
        q2.put("question", "Given the root of a Binary Tree, describe an optimal algorithm to find the Lowest Common Ancestor (LCA) of two given nodes p and q.");
        q2.put("difficulty", "Medium");
        questions.add(q2);

        Map<String, Object> q3 = new HashMap<>();
        q3.put("id", "q-sys-01");
        q3.put("category", "System Design");
        q3.put("question", "How would you design a scalable URL Shortener service (like bit.ly) handling 100M writes/day with low-latency reads?");
        q3.put("difficulty", "Medium");
        questions.add(q3);

        return ResponseEntity.ok(questions);
    }
}
