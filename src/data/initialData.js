/// Default profile for a NEW user.
// No predefined person's information is loaded automatically.

export const defaultStudentProfile = {
  id: "",
  name: "",
  headline: "",
  email: "",
  phone: "",

  education: "",
  degree: "",
  university: "",
  cgpa: "",
  graduationYear: "",
  location: "",

  preferredCareer: "",
  targetCompany: "",
  targetRole: "",

  // User-provided / resume-extracted skills
  technicalSkills: [],
  softSkills: [],

  // User projects
  projects: [],

  // User certifications
  certifications: [],

  // User internship/experience
  internships: [],

  // Achievements
  achievements: [],

  // Coding profiles
  codingProfiles: {},

  // Resume text
  resumeTextSample: ""
};


// Sample profiles can still be kept for DEMO/TESTING.
// They should NOT be used as the default profile.

export const sampleAlternativeProfiles = [
  {
    id: "student-rohan-02",
    name: "Rohan Verma",
    headline: "Frontend & Full Stack Enthusiast | React & Node.js Developer",
    degree: "B.Tech Information Technology",
    university: "VIT Vellore",
    cgpa: "7.9",
    preferredCareer: "Full Stack Developer",
    targetCompany: "Amazon",
    targetRole: "Software Development Engineer",

    technicalSkills: [
      {
        name: "JavaScript",
        level: "Advanced",
        category: "Languages",
        evidenceCount: 4,
        verified: true
      },
      {
        name: "React",
        level: "Advanced",
        category: "Frontend",
        evidenceCount: 3,
        verified: true
      },
      {
        name: "Node.js",
        level: "Intermediate",
        category: "Backend",
        evidenceCount: 2,
        verified: true
      },
      {
        name: "MongoDB",
        level: "Intermediate",
        category: "Databases",
        evidenceCount: 2,
        verified: true
      },
      {
        name: "HTML/CSS",
        level: "Advanced",
        category: "Frontend",
        evidenceCount: 3,
        verified: true
      },
      {
        name: "Git",
        level: "Intermediate",
        category: "Tools",
        evidenceCount: 2,
        verified: true
      },
      {
        name: "DSA",
        level: "Basic",
        category: "Core CS",
        evidenceCount: 1,
        verified: false
      }
    ],

    projects: [
      {
        id: "rp1",
        title: "Social Networking Feed App",
        techStack: [
          "React",
          "Node.js",
          "Express",
          "MongoDB"
        ],
        description:
          "Real-time feed with image uploads, likes, and socket.io live chat."
      }
    ]
  },

  {
    id: "student-priya-03",
    name: "Priya Sharma",
    headline: "Data Science & AI Aspirant | Python & Machine Learning",
    degree: "B.Tech Data Science",
    university: "IIIT Hyderabad",
    cgpa: "8.7",
    preferredCareer: "Data Analyst / ML Engineer",
    targetCompany: "Google",
    targetRole: "Software Engineer - Data/ML",

    technicalSkills: [
      {
        name: "Python",
        level: "Advanced",
        category: "Languages",
        evidenceCount: 4,
        verified: true
      },
      {
        name: "SQL",
        level: "Advanced",
        category: "Databases",
        evidenceCount: 3,
        verified: true
      },
      {
        name: "Pandas/NumPy",
        level: "Advanced",
        category: "Data Science",
        evidenceCount: 3,
        verified: true
      },
      {
        name: "Scikit-Learn",
        level: "Intermediate",
        category: "Machine Learning",
        evidenceCount: 2,
        verified: true
      },
      {
        name: "Tableau",
        level: "Intermediate",
        category: "Analytics",
        evidenceCount: 2,
        verified: true
      },
      {
        name: "DSA",
        level: "Intermediate",
        category: "Core CS",
        evidenceCount: 2,
        verified: true
      }
    ],

    projects: [
      {
        id: "pp1",
        title: "Customer Churn Prediction Engine",
        techStack: [
          "Python",
          "Scikit-Learn",
          "FastAPI",
          "Streamlit"
        ],
        description:
          "Supervised ML model achieving 89% ROC-AUC on telecom churn dataset."
      }
    ]
  }
];