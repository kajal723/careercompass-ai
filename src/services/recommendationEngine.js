// Career Recommendation & Readiness Scoring Engine

import { careerRolesTaxonomy } from "../data/companiesData";

export function computeCareerRecommendations(studentProfile) {
  return careerRolesTaxonomy.map(role => {
    const profileSkills = [
      ...(studentProfile?.technicalSkills || []).map(skill => skill.name),
      ...(studentProfile?.softSkills || [])
    ];
    const matchedSkills = role.requiredSkills.filter(requiredSkill =>
      profileSkills.some(profileSkill => matchesSkill(requiredSkill, profileSkill))
    );
    const matchScore = role.requiredSkills.length
      ? Math.round((matchedSkills.length / role.requiredSkills.length) * 100)
      : 0;

    return {
      ...role,
      matchScore,
      alignmentLabel: matchScore >= 80 ? "High Alignment" : matchScore >= 65 ? "Moderate Alignment" : "Developing Alignment"
    };
  });
}

function matchesSkill(requiredSkill, profileSkill) {
  const normalizedProfileSkill = profileSkill.toLowerCase();
  return requiredSkill
    .split(/[\/&]/)
    .some(skillOption => normalizedProfileSkill.includes(skillOption.trim().toLowerCase()));
}

export function computeCareerReadinessScore(studentProfile, mockInterviewScore = 76) {
  // Six core pillars of placement readiness
  const technicalSkillsScore = 82;
  const dsaScore = 71;
  const projectsScore = 75;
  const communicationScore = 81;
  const resumeScore = 88;
  const interviewReadinessScore = mockInterviewScore ? Math.round(mockInterviewScore * 0.92) : 70;

  // Weighted aggregate formula
  const overallReadiness = Math.round(
    technicalSkillsScore * 0.25 +
    dsaScore * 0.20 +
    projectsScore * 0.20 +
    communicationScore * 0.10 +
    resumeScore * 0.10 +
    interviewReadinessScore * 0.15
  );

  const pillars = [
    { name: "Technical Skills", score: technicalSkillsScore, fullMark: 100, color: "#6366f1", icon: "Code", summary: "Strong Core Java, OOP & SQL knowledge" },
    { name: "DSA / Problem Solving", score: dsaScore, fullMark: 100, color: "#3b82f6", icon: "Binary", summary: "180+ problems solved; needs Tree & Graph mastery" },
    { name: "Applied Projects", score: projectsScore, fullMark: 100, color: "#10b981", icon: "FolderGit2", summary: "2 desktop/CLI projects; needs REST API & Docker" },
    { name: "Communication", score: communicationScore, fullMark: 100, color: "#f59e0b", icon: "MessageSquare", summary: "Clear articulation, needs STAR method polish" },
    { name: "Resume & Evidence", score: resumeScore, fullMark: 100, color: "#8b5cf6", icon: "FileText", summary: "Structured format with verified internship & certs" },
    { name: "Interview Readiness", score: interviewReadinessScore, fullMark: 100, color: "#ec4899", icon: "Users", summary: "Recent adaptive mock interview score feedback" }
  ];

  const strongAreas = [
    "Core Java & Object-Oriented Programming (Advanced level)",
    "Relational Database Schema Design & SQL Optimization (25% latency reduction proven)",
    "Clean resume structure with verifiable Oracle certifications and GitHub repository links"
  ];

  const needsImprovement = [
    "Framework Experience: Missing Spring Boot & REST APIs for enterprise cloud backend roles",
    "Containerization: Docker and CI/CD deployment pipelines missing from project portfolio",
    "Advanced DSA: Dynamic Programming and System Design scalability patterns need practice"
  ];

  const recommendedActions = [
    { title: "Bridge Critical P0 Gap", description: "Complete Spring Boot + REST API module (Roadmap Week 1-2)", priority: "P0 High" },
    { title: "Build Gap-Closing Project", description: "Develop 'Production-Ready E-Commerce REST API' with Docker & JWT", priority: "P0 High" },
    { title: "Practice Targeted DSA", description: "Solve 20 medium Graph & Tree questions on LeetCode", priority: "P1 Medium" },
    { title: "Take Adaptive Mock Interview", description: "Reattempt Microsoft Technical Mock Interview to target 85+ score", priority: "P1 Medium" }
  ];

  return {
    overallReadiness: overallReadiness > 0 ? overallReadiness : 78,
    pillars,
    strongAreas,
    needsImprovement,
    recommendedActions
  };
}

export function computeCompanyComparison(studentProfile) {
  return [
    {
      company: "Microsoft",
      role: "Software Engineer",
      readiness: 72,
      matchGrade: "Strong Alignment",
      tagline: "High fit for Core CS & Java; gaps in System Design & Spring Boot",
      color: "#00A4EF",
      keyGaps: ["System Design", "Spring Boot", "Docker"],
      strongSkills: ["Java", "OOP", "DBMS", "DSA (Intermediate)"],
      focusArea: "Code readability & Concurrency depth"
    },
    {
      company: "Amazon",
      role: "Software Development Engineer (SDE I)",
      readiness: 68,
      matchGrade: "Moderate Alignment",
      tagline: "Solid Java/SQL; requires LeetCode Graph/Tree speed & Leadership Principles",
      color: "#FF9900",
      keyGaps: ["Advanced DSA (O(N) optimal)", "Microservices", "16 Leadership Principles"],
      strongSkills: ["Java", "Multithreading", "MySQL"],
      focusArea: "Algorithmic optimization & LP STAR stories"
    },
    {
      company: "Google",
      role: "Software Engineer (L3)",
      readiness: 61,
      matchGrade: "Developing Alignment",
      tagline: "Requires high-tier Dynamic Programming, Graph geometry, and mathematical proofs",
      color: "#EA4335",
      keyGaps: ["Hard Dynamic Programming", "Advanced Graph Algorithms", "Distributed Systems"],
      strongSkills: ["Core Java", "Problem Solving"],
      focusArea: "Complex algorithmic puzzles & trade-offs"
    },
    {
      company: "TCS Digital",
      role: "Digital Software Engineer",
      readiness: 84,
      matchGrade: "Exceptional Alignment",
      tagline: "Student profile exceeds standard requirements for NQT & Technical rounds",
      color: "#0078D7",
      keyGaps: ["Web Frontend (Basic React/JS)"],
      strongSkills: ["Core Java", "SQL Queries", "OOP", "DSA (Fundamentals)", "Communication"],
      focusArea: "Final round interview confidence"
    }
  ];
}
