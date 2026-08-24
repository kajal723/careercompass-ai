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

export function computeCareerReadinessScore(studentProfile = {}, mockInterviewScore = null) {
  const technicalSkills = studentProfile.technicalSkills || [];
  const projects = studentProfile.projects || [];
  const hasResume = Boolean(studentProfile.resumeTextSample?.trim());
  const technicalSkillsScore = Math.min(100, technicalSkills.length * 10);
  const dsaScore = Math.min(100, technicalSkills.filter((skill) => /dsa|algorithm|data structure/i.test(skill.name || '')).length * 25);
  const projectsScore = Math.min(100, projects.length * 25);
  const communicationScore = Math.min(100, (studentProfile.softSkills || []).length * 20);
  const resumeScore = hasResume ? 100 : 0;
  const interviewReadinessScore = typeof mockInterviewScore === 'number' ? Math.round(mockInterviewScore * 0.92) : 0;

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
    { name: "Technical Skills", score: technicalSkillsScore, fullMark: 100, color: "#6366f1", icon: "Code", summary: technicalSkills.length ? `${technicalSkills.length} skills added to your profile.` : "Add technical skills to calculate this pillar." },
    { name: "DSA / Problem Solving", score: dsaScore, fullMark: 100, color: "#3b82f6", icon: "Binary", summary: "Calculated from DSA and algorithm skills you add." },
    { name: "Applied Projects", score: projectsScore, fullMark: 100, color: "#10b981", icon: "FolderGit2", summary: projects.length ? `${projects.length} project${projects.length === 1 ? '' : 's'} added to your profile.` : "Add projects to calculate this pillar." },
    { name: "Communication", score: communicationScore, fullMark: 100, color: "#f59e0b", icon: "MessageSquare", summary: "Calculated from soft skills you add." },
    { name: "Resume & Evidence", score: resumeScore, fullMark: 100, color: "#8b5cf6", icon: "FileText", summary: hasResume ? "Resume content is available for analysis." : "Upload or paste a resume to calculate this pillar." },
    { name: "Interview Readiness", score: interviewReadinessScore, fullMark: 100, color: "#ec4899", icon: "Users", summary: typeof mockInterviewScore === 'number' ? "Based on your completed mock interview." : "Complete a mock interview to calculate this pillar." }
  ];

  const strongAreas = pillars.filter((pillar) => pillar.score >= 70).map((pillar) => `${pillar.name}: ${pillar.score}% based on your available evidence.`);
  const needsImprovement = pillars.filter((pillar) => pillar.score < 70).map((pillar) => `${pillar.name}: add relevant evidence or complete the related activity.`);
  const recommendedActions = !studentProfile.name && !hasResume
    ? [{ title: "Complete your profile", description: "Add your education, skills, projects, and target role to begin analysis.", priority: "Start here" }]
    : needsImprovement.slice(0, 4).map((item) => ({ title: "Strengthen your evidence", description: item, priority: "Next" }));

  return {
    overallReadiness,
    pillars,
    strongAreas,
    needsImprovement,
    recommendedActions
  };
}

export function computeCompanyComparison(studentProfile) {
  const profileSkills = [
    ...(studentProfile?.technicalSkills || []).map((skill) => skill.name),
    ...(studentProfile?.softSkills || [])
  ];
  return [
    {
      company: "Microsoft",
      role: "Software Engineer",
      readiness: scoreCompany(profileSkills, ["DSA", "Java", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design", "Problem Solving"]),
      matchGrade: "Profile alignment",
      tagline: "Alignment based on the skills currently in your profile.",
      color: "#00A4EF",
      keyGaps: [], strongSkills: profileSkills, focusArea: "Add profile evidence to refine this comparison."
    },
    {
      company: "Amazon",
      role: "Software Development Engineer (SDE I)",
      readiness: scoreCompany(profileSkills, ["DSA", "Java", "System Design", "DBMS", "Operating Systems", "Communication"]),
      matchGrade: "Profile alignment",
      tagline: "Alignment based on the skills currently in your profile.",
      color: "#FF9900",
      keyGaps: [], strongSkills: profileSkills, focusArea: "Add profile evidence to refine this comparison."
    },
    {
      company: "Google",
      role: "Software Engineer (L3)",
      readiness: scoreCompany(profileSkills, ["DSA", "Java", "Operating Systems", "Computer Networks", "Problem Solving"]),
      matchGrade: "Profile alignment",
      tagline: "Alignment based on the skills currently in your profile.",
      color: "#EA4335",
      keyGaps: [], strongSkills: profileSkills, focusArea: "Add profile evidence to refine this comparison."
    },
    {
      company: "TCS Digital",
      role: "Digital Software Engineer",
      readiness: scoreCompany(profileSkills, ["Java", "SQL", "DSA", "OOP", "Communication"]),
      matchGrade: "Profile alignment",
      tagline: "Alignment based on the skills currently in your profile.",
      color: "#0078D7",
      keyGaps: [], strongSkills: profileSkills, focusArea: "Add profile evidence to refine this comparison."
    }
  ];
}

function scoreCompany(profileSkills, requirements) {
  if (!profileSkills.length) return 0;
  const normalized = profileSkills.map((skill) => skill.toLowerCase());
  const matched = requirements.filter((requirement) => normalized.some((skill) => skill.includes(requirement.toLowerCase())));
  return Math.round((matched.length / requirements.length) * 100);
}
