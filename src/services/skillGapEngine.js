// Intelligent Skill Gap & Dependency Engine

import { skillDependencyGraph } from "../data/skillGraph";

export function analyzeSkillGaps(studentSkills = [], targetRoleRequirements = []) {
  // Normalize existing skill names into lowercase set
  const studentSkillNames = new Set(
    studentSkills.map(s => (typeof s === "string" ? s : s.name).toLowerCase())
  );

  const strongSkills = [];
  const criticalGaps = [];
  const mediumGaps = [];

  // Evaluate target requirements
  targetRoleRequirements.forEach(req => {
    const reqName = typeof req === "string" ? req : req.name;
    const lowerName = reqName.toLowerCase();
    
    // Check if student has this skill
    const hasSkill = Array.from(studentSkillNames).some(name => 
      lowerName.includes(name) || name.includes(lowerName) || (lowerName.includes("java") && name.includes("java"))
    );

    const depInfo = skillDependencyGraph[reqName] || {
      prerequisites: [],
      unlocks: [],
      importance: "Required competency for targeted role",
      rationale: `${reqName} is a key requirement for your target position.`
    };

    if (hasSkill) {
      strongSkills.push({
        name: reqName,
        category: req.category || "Core Competency",
        weight: req.weight || 15,
        status: "Strong",
        description: req.description || "Demonstrated in student profile & projects."
      });
    } else {
      // Check if prerequisites are satisfied
      const prereqsSatisfied = depInfo.prerequisites.every(pre => 
        Array.from(studentSkillNames).some(name => name.includes(pre.toLowerCase()))
      );

      const gapObject = {
        name: reqName,
        category: req.category || "Missing Skill",
        weight: req.weight || 20,
        status: "Missing",
        isReadyToLearn: prereqsSatisfied,
        prerequisites: depInfo.prerequisites,
        unlocks: depInfo.unlocks,
        importance: depInfo.importance,
        rationale: depInfo.rationale,
        priority: req.weight >= 20 || reqName === "Spring Boot" || reqName === "REST API" ? "Critical" : "Medium"
      };

      if (gapObject.priority === "Critical") {
        criticalGaps.push(gapObject);
      } else {
        mediumGaps.push(gapObject);
      }
    }
  });

  const nextGap = [...criticalGaps, ...mediumGaps][0];
  const nextBestSkill = nextGap ? {
    name: nextGap.name,
    tagline: "Highest-priority gap from your selected role",
    category: nextGap.category,
    priorityScore: nextGap.weight,
    reasons: [nextGap.rationale],
    prerequisitesMet: nextGap.prerequisites.filter((pre) => studentSkillNames.has(pre.toLowerCase())),
    estimatedLearningHours: "Add a learning estimate",
    unlockedCareerBoost: "Calculated after new evidence"
  } : null;

  return {
    criticalGaps,
    mediumGaps,
    strongSkills,
    nextBestSkill,
    totalGapsCount: criticalGaps.length + mediumGaps.length,
    coverageRatio: strongSkills.length + criticalGaps.length + mediumGaps.length ? Math.round((strongSkills.length / (strongSkills.length + criticalGaps.length + mediumGaps.length)) * 100) : 0
  };
}

export function analyzeJobDescriptionText(jdText, studentSkills = []) {
  if (!jdText || jdText.trim().length === 0) {
    return { jobMatchScore: 0, extractedSkills: [], skillComparisons: [], matchedCount: 0, missingCount: 0 };
  }

  const lowerJD = jdText.toLowerCase();
  const knownKeywords = [
    { name: "Java", category: "Languages", weight: 20 },
    { name: "Spring Boot", category: "Frameworks", weight: 25 },
    { name: "REST API", category: "Architecture", weight: 20 },
    { name: "MySQL", category: "Databases", weight: 15 },
    { name: "Docker", category: "DevOps", weight: 10 },
    { name: "Git", category: "Tools", weight: 10 },
    { name: "DSA", category: "Core CS", weight: 15 },
    { name: "Microservices", category: "Architecture", weight: 15 },
    { name: "Python", category: "Languages", weight: 15 },
    { name: "Kubernetes", category: "DevOps", weight: 10 },
    { name: "AWS", category: "Cloud", weight: 15 },
    { name: "Redis", category: "Databases", weight: 10 }
  ];

  // Detect which skills the JD actually asks for
  const detectedJDRequirements = knownKeywords.filter(k => 
    lowerJD.includes(k.name.toLowerCase()) || 
    (k.name === "REST API" && (lowerJD.includes("rest") || lowerJD.includes("api"))) ||
    (k.name === "MySQL" && (lowerJD.includes("sql") || lowerJD.includes("mysql")))
  );

  const activeRequirements = detectedJDRequirements;

  const studentSkillNames = new Set(studentSkills.map(s => (typeof s === "string" ? s : s.name).toLowerCase()));

  let totalWeight = 0;
  let matchedWeight = 0;

  const skillComparisons = activeRequirements.map(req => {
    totalWeight += req.weight;
    const isMatched = Array.from(studentSkillNames).some(sn => 
      sn.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(sn)
    );

    if (isMatched) {
      matchedWeight += req.weight;
      return {
        name: req.name,
        category: req.category,
        status: "Strong",
        badgeColor: "emerald",
        matchPercentage: 100
      };
    } else {
      return {
        name: req.name,
        category: req.category,
        status: "Missing",
        badgeColor: "rose",
        matchPercentage: 0
      };
    }
  });

  const jobMatchScore = Math.round((matchedWeight / totalWeight) * 100);

  return {
    jobMatchScore,
    extractedSkills: activeRequirements.map(r => r.name),
    skillComparisons,
    matchedCount: skillComparisons.filter(s => s.status === "Strong").length,
    missingCount: skillComparisons.filter(s => s.status === "Missing").length
  };
}
