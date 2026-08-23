// What-If Career Readiness Simulator Engine

export const simulationOptions = [
  {
    id: "sim-spring-boot",
    title: "Master Spring Boot Framework",
    category: "Technical Skill",
    delta: 6,
    impact: "+6%",
    tag: "Critical P0 Gap",
    description: "Completing Spring Boot fundamentals & Dependency Injection architecture closes your largest enterprise framework gap.",
    enabledDefault: false
  },
  {
    id: "sim-rest-api",
    title: "Learn REST API Architecture & JWT",
    category: "Technical Skill",
    delta: 4,
    impact: "+4%",
    tag: "High Priority",
    description: "Designing REST endpoints and implementing stateless authentication gives you production-ready backend API skills.",
    enabledDefault: false
  },
  {
    id: "sim-project",
    title: "Build 'Production-Ready E-Commerce REST API' Project",
    category: "Portfolio Project",
    delta: 6,
    impact: "+6%",
    tag: "High Resume Impact",
    description: "Adding an enterprise-grade GitHub project with Docker, MySQL, and JWT proves applied engineering ability to interviewers.",
    enabledDefault: false
  },
  {
    id: "sim-mock-interview",
    title: "Complete AI Mock Interview with Score > 80",
    category: "Interview Mastery",
    delta: 3,
    impact: "+3%",
    tag: "Confidence & Articulation",
    description: "Practicing live technical verbalization and STAR behavioral responses improves interview readiness under pressure.",
    enabledDefault: false
  },
  {
    id: "sim-dsa-50",
    title: "Solve 50 Targeted DSA Mediums (Trees/Graphs)",
    category: "Algorithmic Depth",
    delta: 4,
    impact: "+4%",
    tag: "Coding OA Readiness",
    description: "Targeted practice on Microsoft & Amazon high-frequency patterns increases your Online Assessment pass rate.",
    enabledDefault: false
  },
  {
    id: "sim-docker",
    title: "Containerize Portfolio with Docker & Docker Compose",
    category: "DevOps / Cloud",
    delta: 3,
    impact: "+3%",
    tag: "DevOps Polish",
    description: "Packaging backend applications into reproducible containers demonstrates modern cloud engineering readiness.",
    enabledDefault: false
  }
];

export function calculateSimulatedReadiness(baseReadiness = 68, activeSimulationIds = []) {
  const activeOptions = simulationOptions.filter(opt => activeSimulationIds.includes(opt.id));
  const totalGain = activeOptions.reduce((acc, curr) => acc + curr.delta, 0);
  const simulatedScore = Math.min(96, baseReadiness + totalGain);

  return {
    baseReadiness,
    simulatedScore,
    totalGain,
    activeOptionsCount: activeOptions.length,
    gainBreakdown: activeOptions.map(opt => ({
      title: opt.title,
      gain: opt.impact,
      category: opt.category
    }))
  };
}
