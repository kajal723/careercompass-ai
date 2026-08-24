// Empty profile shape for a new user. All personal fields are user-provided.

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