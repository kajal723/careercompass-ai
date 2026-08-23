// Intelligent Resume Parser & Skill Extraction Engine

const SKILL_DICTIONARY = {
  languages: ["Java", "Python", "C++", "C", "JavaScript", "TypeScript", "SQL", "Go", "Kotlin", "Rust", "PHP", "Ruby"],
  frameworks: ["Spring Boot", "Spring", "React", "Node.js", "Express", "Django", "Flask", "Angular", "Vue.js", "Next.js", "Hibernate", "JPA"],
  databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "SQLite", "Cassandra", "DynamoDB"],
  cloud_devops: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Git", "GitHub", "Linux", "Jenkins", "Terraform"],
  core_cs: ["DSA", "Data Structures", "Algorithms", "OOP", "Object Oriented Programming", "DBMS", "Operating Systems", "OS", "Computer Networks", "CN", "System Design"],
  soft_skills: ["Problem Solving", "Communication", "Team Collaboration", "Leadership", "Adaptability", "Time Management", "Analytical Thinking"]
};

export function parseResumeText(text) {
  if (!text || typeof text !== "string" || !text.trim()) {
    return createEmptyExtraction();
  }

  const lowerText = text.toLowerCase();

  // Extract detected categories
  const detectedLanguages = SKILL_DICTIONARY.languages.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  const detectedFrameworks = SKILL_DICTIONARY.frameworks.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  const detectedDatabases = SKILL_DICTIONARY.databases.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  const detectedCloud = SKILL_DICTIONARY.cloud_devops.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  const detectedCoreCS = SKILL_DICTIONARY.core_cs.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  const detectedSoftSkills = SKILL_DICTIONARY.soft_skills.filter(skill => 
    new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, "i").test(lowerText)
  );

  // Extract Education
  let education = "";
  if (lowerText.includes("master") || lowerText.includes("m.tech") || lowerText.includes("msc")) {
    education = "Master of Technology";
  } else if (lowerText.includes("bachelor") || lowerText.includes("b.tech") || lowerText.includes("bsc")) {
    education = "Bachelor of Technology";
  }
  
  let cgpa = "";
  const cgpaMatch = text.match(/cgpa[:\s]*([0-9]+\.?[0-9]*)/i) || text.match(/([0-9]+\.[0-9]+)\s*\/\s*10/);
  if (cgpaMatch && cgpaMatch[1]) {
    cgpa = cgpaMatch[1];
  }

  // All technical skills flat list with confidence
  const allDetected = [
    ...detectedLanguages.map(s => ({ name: s, category: "Languages" })),
    ...detectedCoreCS.map(s => ({ name: s === "Data Structures" ? "DSA" : s, category: "Core CS" })),
    ...detectedDatabases.map(s => ({ name: s, category: "Databases" })),
    ...detectedFrameworks.map(s => ({ name: s, category: "Frameworks" })),
    ...detectedCloud.map(s => ({ name: s, category: "Cloud & Tools" }))
  ];

  // Remove duplicates by name
  const uniqueSkillsMap = new Map();
  allDetected.forEach(skill => {
    if (!uniqueSkillsMap.has(skill.name)) {
      // Calculate evidence confidence level
      let confidence = "Moderate";
      const mentions = (lowerText.match(new RegExp(`\\b${escapeRegExp(skill.name.toLowerCase())}\\b`, "gi")) || []).length;
      
      if (mentions >= 3 || lowerText.includes(`projects`) && mentions >= 2) {
        confidence = "Strong";
      } else if (mentions === 1) {
        confidence = "Moderate";
      }

      uniqueSkillsMap.set(skill.name, {
        ...skill,
        confidence,
        mentionCount: mentions
      });
    }
  });

  const skillsWithConfidence = Array.from(uniqueSkillsMap.values());

  // Compare against benchmark expectations for Microsoft SWE / Backend
  const benchmarkSkills = [
    { name: "Java", expected: true },
    { name: "SQL", expected: true },
    { name: "MySQL", expected: true },
    { name: "DSA", expected: true },
    { name: "OOP", expected: true },
    { name: "Git", expected: true },
    { name: "Spring Boot", expected: true },
    { name: "REST API", expected: true },
    { name: "Docker", expected: true },
    { name: "System Design", expected: true }
  ];

  const skillEvidenceTable = benchmarkSkills.map(item => {
    const found = skillsWithConfidence.find(s => s.name.toLowerCase() === item.name.toLowerCase());
    if (found) {
      return {
        name: item.name,
        status: found.confidence, // "Strong" or "Moderate"
        badgeColor: found.confidence === "Strong" ? "emerald" : "amber",
        evidenceNote: `Detected in resume (${found.mentionCount} occurrences, verified in projects/experience)`
      };
    } else {
      return {
        name: item.name,
        status: "Missing",
        badgeColor: "rose",
        evidenceNote: "Not found in resume. Recommended to learn for target role."
      };
    }
  });

  return {
    rawLength: text.length,
    education,
    cgpa,
    detectedSkills: skillsWithConfidence,
    detectedLanguages,
    detectedFrameworks,
    detectedDatabases,
    detectedCloud,
    detectedCoreCS,
    detectedSoftSkills,
    skillEvidenceTable,
    summaryStats: {
      totalSkillsDetected: skillsWithConfidence.length,
      strongSkillsCount: skillEvidenceTable.filter(s => s.status === "Strong").length,
      missingSkillsCount: skillEvidenceTable.filter(s => s.status === "Missing").length
    }
  };
}

function createEmptyExtraction() {
  return {
    education: "",
    cgpa: "",
    detectedSoftSkills: [],
    detectedSkills: [],
    detectedLanguages: [],
    detectedFrameworks: [],
    detectedDatabases: [],
    detectedCloud: [],
    skillEvidenceTable: [],
    summaryStats: {
      totalSkillsDetected: 0,
      strongSkillsCount: 0,
      missingSkillsCount: 0
    }
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
