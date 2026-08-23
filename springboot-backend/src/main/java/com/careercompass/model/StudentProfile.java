package com.careercompass.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String university;
    private String degree;
    private String cgpa;
    private String graduationYear;
    private String preferredCareer;
    private String targetCompany;
    private String targetRole;

    @ElementCollection
    private List<String> technicalSkills;

    @ElementCollection
    private List<String> softSkills;

    public StudentProfile() {}

    public StudentProfile(String name, String email, String university, String degree, String cgpa, String graduationYear, String preferredCareer, String targetCompany, String targetRole, List<String> technicalSkills, List<String> softSkills) {
        this.name = name;
        this.email = email;
        this.university = university;
        this.degree = degree;
        this.cgpa = cgpa;
        this.graduationYear = graduationYear;
        this.preferredCareer = preferredCareer;
        this.targetCompany = targetCompany;
        this.targetRole = targetRole;
        this.technicalSkills = technicalSkills;
        this.softSkills = softSkills;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getPreferredCareer() { return preferredCareer; }
    public void setPreferredCareer(String preferredCareer) { this.preferredCareer = preferredCareer; }

    public String getTargetCompany() { return targetCompany; }
    public void setTargetCompany(String targetCompany) { this.targetCompany = targetCompany; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public List<String> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<String> technicalSkills) { this.technicalSkills = technicalSkills; }

    public List<String> getSoftSkills() { return softSkills; }
    public void setSoftSkills(List<String> softSkills) { this.softSkills = softSkills; }
}
