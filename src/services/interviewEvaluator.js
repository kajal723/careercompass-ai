// Real-time AI Mock Interview Evaluator & Adaptive Question Engine

export function evaluateStudentAnswer(question, answerText) {
  if (!answerText || answerText.trim().length === 0) {
    return {
      score: 35,
      technicalAccuracy: 30,
      conceptualDepth: 30,
      communication: 40,
      completeness: 30,
      strength: "Attempted the question.",
      improvement: "Answer was too brief. Provide technical specifics, internal mechanics, and real-world examples.",
      modelAnswer: question.idealAnswerOutline
    };
  }

  const cleanAnswer = answerText.toLowerCase();
  const wordCount = answerText.trim().split(/\s+/).length;

  // 1. Keyword & Semantic matching
  const targetKeywords = question.keywords || [];
  let matchedKeywordCount = 0;
  targetKeywords.forEach(kw => {
    if (cleanAnswer.includes(kw.toLowerCase())) {
      matchedKeywordCount++;
    }
  });

  const keywordCoverageRatio = targetKeywords.length > 0 ? (matchedKeywordCount / targetKeywords.length) : 0.7;

  // 2. Length and structure bonus
  let lengthFactor = 0.5;
  if (wordCount > 120) lengthFactor = 1.0;
  else if (wordCount > 60) lengthFactor = 0.85;
  else if (wordCount > 25) lengthFactor = 0.70;

  // 3. Category-specific evaluation
  let technicalAccuracy = 0;
  let conceptualDepth = 0;
  let communication = 0;
  let completeness = 0;

  if (question.category === "HR") {
    // Look for STAR keywords
    const hasStarMarkers = cleanAnswer.includes("situation") || cleanAnswer.includes("task") || cleanAnswer.includes("action") || cleanAnswer.includes("result") || cleanAnswer.includes("because") || cleanAnswer.includes("learned");
    const starBonus = hasStarMarkers ? 15 : 5;

    communication = Math.min(95, Math.round(75 + (keywordCoverageRatio * 15) + starBonus));
    conceptualDepth = Math.min(92, Math.round(70 + (keywordCoverageRatio * 20)));
    technicalAccuracy = Math.min(90, Math.round(75 + (lengthFactor * 15)));
    completeness = Math.min(95, Math.round(65 + (lengthFactor * 25)));
  } else {
    // Technical / DSA / System Design
    technicalAccuracy = Math.min(96, Math.round(55 + (keywordCoverageRatio * 35) + (lengthFactor * 10)));
    conceptualDepth = Math.min(94, Math.round(50 + (keywordCoverageRatio * 30) + (lengthFactor * 15)));
    communication = Math.min(95, Math.round(65 + (lengthFactor * 25)));
    completeness = Math.min(92, Math.round(50 + (keywordCoverageRatio * 25) + (lengthFactor * 20)));
  }

  // Calculate weighted overall score
  const rubric = question.evaluationRubric || {
    technicalAccuracyWeight: 0.4,
    conceptualDepthWeight: 0.3,
    communicationWeight: 0.2,
    completenessWeight: 0.1
  };

  const overallScore = Math.round(
    technicalAccuracy * rubric.technicalAccuracyWeight +
    conceptualDepth * rubric.conceptualDepthWeight +
    communication * rubric.communicationWeight +
    completeness * rubric.completenessWeight
  );

  // Generate tailored strengths and improvements
  let strength = "Good fundamental understanding of the core concept.";
  let improvement = "Explain internal execution and edge cases in greater detail.";

  if (question.id === "q-tech-01") {
    if (cleanAnswer.includes("thread safe") || cleanAnswer.includes("synchron")) {
      strength = "Good grasp of thread safety and why concurrent access causes problems in standard HashMaps.";
    }
    if (!cleanAnswer.includes("cas") && !cleanAnswer.includes("bucket")) {
      improvement = "Mention CAS (Compare-And-Swap) operations and Java 8 bucket-level synchronization for a full 100/100 answer.";
    } else {
      improvement = "Solid technical depth. Consider contrasting performance overhead with synchronized collections.";
    }
  } else if (question.id === "q-hr-02") {
    if (cleanAnswer.includes("result") || cleanAnswer.includes("outcome") || cleanAnswer.includes("%")) {
      strength = "Excellent quantification of outcomes and clear problem definition.";
    } else {
      strength = "Clear explanation of technical hurdles faced during project development.";
      improvement = "Use explicit STAR format with quantitative metrics (e.g. '% latency reduction', 'bug resolution time').";
    }
  } else {
    if (overallScore >= 80) {
      strength = "Strong conceptual grasp with accurate terminology and structured explanation.";
      improvement = "Deepen discussion on performance trade-offs, scaling limits, or corner cases.";
    } else {
      strength = "Demonstrates good intuition and direction.";
      improvement = `Incorporate key terms like: ${targetKeywords.slice(0, 3).join(", ")} to demonstrate enterprise depth.`;
    }
  }

  return {
    score: overallScore,
    technicalAccuracy,
    conceptualDepth,
    communication,
    completeness,
    strength,
    improvement,
    modelAnswer: question.idealAnswerOutline
  };
}

export function generateFinalInterviewReport(interviewSession) {
  const { history = [], interviewType = "Mixed", company = "Microsoft" } = interviewSession;

  if (history.length === 0) {
    return getDefaultReport();
  }

  const totalQuestions = history.length;
  const avgOverallScore = Math.round(
    history.reduce((acc, curr) => acc + (curr.evaluation?.score || 70), 0) / totalQuestions
  );

  const avgTechnical = Math.round(
    history.reduce((acc, curr) => acc + (curr.evaluation?.technicalAccuracy || 0), 0) / totalQuestions
  );
  
  const avgConceptual = Math.round(
    history.reduce((acc, curr) => acc + (curr.evaluation?.conceptualDepth || 0), 0) / totalQuestions
  );

  const avgCommunication = Math.round(
    history.reduce((acc, curr) => acc + (curr.evaluation?.communication || 0), 0) / totalQuestions
  );

  const avgCompleteness = Math.round(
    history.reduce((acc, curr) => acc + (curr.evaluation?.completeness || 0), 0) / totalQuestions
  );

  // Identify strengths & weak areas
  const topicScores = history.map(h => ({
    topic: h.question.subCategory || h.question.category,
    category: h.question.category,
    score: h.evaluation?.score || 70
  }));

  topicScores.sort((a, b) => b.score - a.score);

  const technicalStrength = topicScores[0]?.topic || "No completed interview topics";
  const weakAreas = topicScores
    .filter(t => t.score < 80)
    .map(t => t.topic)
    .slice(0, 3);

  

  return {
    interviewReadinessScore: avgOverallScore,
    radarMetrics: [
      { subject: "Technical", score: avgTechnical, fullMark: 100 },
      { subject: "DSA", score: avgOverallScore, fullMark: 100 },
      { subject: "Communication", score: avgCommunication, fullMark: 100 },
      { subject: "Problem Solving", score: avgOverallScore, fullMark: 100 },
      { subject: "Projects", score: avgOverallScore, fullMark: 100 },
      { subject: "HR & Values", score: avgOverallScore, fullMark: 100 }
    ],
    technicalStrength,
    weakAreas,
    topWeaknesses: [
      { name: "Advanced DSA (Trees & Dynamic Programming)", gap: "Recursion state visualization & O(N log N) patience sorting proofs", priority: "High" },
      { name: "System Design Scalability", gap: "Estimating read/write throughput and cache-aside eviction policies", priority: "High" },
      { name: "Project Architecture Explanation", gap: "Articulating multi-threading concurrency primitives with STAR structure", priority: "Medium" }
    ],
    recommendedNextSteps: [
      "Complete 20 medium DSA problems (focus on Lowest Common Ancestor & Graph traversals)",
      "Practice one System Design question (URL Shortener with Redis caching & Token Bucket)",
      "Reattempt mock interview in 7 days to evaluate retention and response pacing"
    ],
    detailedAnswers: history
  };
}

export function getDefaultReport() {
  return {
    interviewReadinessScore: 0,
    radarMetrics: [
      { subject: "Technical", score: 0, fullMark: 100 },
      { subject: "DSA", score: 0, fullMark: 100 },
      { subject: "Communication", score: 0, fullMark: 100 },
      { subject: "Problem Solving", score: 0, fullMark: 100 },
      { subject: "Projects", score: 0, fullMark: 100 },
      { subject: "HR", score: 0, fullMark: 100 }
    ],
    technicalStrength: "No completed interview topics",
    weakAreas: [],
    topWeaknesses: [],
    recommendedNextSteps: ["Start a mock interview to generate personalized feedback."],
    detailedAnswers: []
  };
}
