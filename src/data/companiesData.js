// Company Competency Models, Role Specifications & Evaluation Weights

export const companiesData = [
  {
    id: "microsoft",
    name: "Microsoft",
    logoText: "MSFT",
    color: "#00A4EF",
    tagline: "Empower every person and organization on the planet to achieve more.",
    roles: [
      {
        id: "microsoft-swe",
        title: "Software Engineer",
        level: "L59 / New Grad (SDE I)",
        department: "Cloud + AI / Core Engineering",
        requiredSkills: [
          { name: "DSA", weight: 30, category: "Core CS", description: "Trees, Graphs, DP, HashMaps, Two Pointers" },
          { name: "Java/C++", weight: 20, category: "Languages", description: "Deep OOP, Memory Management, Concurrency" },
          { name: "OOP", weight: 15, category: "Core CS", description: "Design Principles, Polymorphism, SOLID" },
          { name: "DBMS", weight: 10, category: "Core CS", description: "ACID, Indexing, Joins, Normalization" },
          { name: "Operating Systems", weight: 10, category: "Core CS", description: "Processes, Threads, Virtual Memory, Deadlocks" },
          { name: "Computer Networks", weight: 5, category: "Core CS", description: "TCP/IP, HTTP/HTTPS, DNS, Sockets" },
          { name: "System Design", weight: 5, category: "Architecture", description: "Basic High-Level System Components & Scalability" },
          { name: "Problem Solving", weight: 5, category: "Soft Skills", description: "Analytical clarity and structured problem decomposition" }
        ],
        frameworksPreferred: ["Spring Boot", "REST APIs", ".NET Core", "Docker"],
        interviewRounds: [
          { name: "Round 1: Online Assessment", type: "DSA / Codility (2-3 medium coding problems)" },
          { name: "Round 2: Technical Interview 1", type: "Data Structures & Core CS fundamentals (Java/C++)" },
          { name: "Round 3: Technical Interview 2", type: "Problem Solving, Live Coding & System Architecture" },
          { name: "Round 4: AA (As-Appropriate) / Bar Raiser", type: "Behavioral, Cultural fit & Project deep dive" }
        ],
        hiringBarFocus: "Clean code readability, edge case handling, and strong grasp of underlying OS/Memory models."
      },
      {
        id: "microsoft-cloud",
        title: "Cloud Solution Engineer",
        level: "Azure Core",
        requiredSkills: [
          { name: "Cloud Deployment", weight: 25, category: "Cloud" },
          { name: "Computer Networks", weight: 20, category: "Core CS" },
          { name: "Operating Systems", weight: 20, category: "Core CS" },
          { name: "Java/Python", weight: 15, category: "Languages" },
          { name: "Docker/Kubernetes", weight: 20, category: "DevOps" }
        ]
      }
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    logoText: "AMZN",
    color: "#FF9900",
    tagline: "Earth's most customer-centric company.",
    roles: [
      {
        id: "amazon-sde",
        title: "Software Development Engineer (SDE I)",
        level: "L4 New Grad",
        department: "AWS / Retail Consumer",
        requiredSkills: [
          { name: "DSA", weight: 35, category: "Core CS", description: "Graphs, Binary Search, Heaps, String algorithms" },
          { name: "Java/C++", weight: 20, category: "Languages", description: "Collections, Thread Safety, Exception handling" },
          { name: "System Design / OOD", weight: 15, category: "Architecture", description: "Object-Oriented Design patterns (Factory, Strategy, Singleton)" },
          { name: "DBMS", weight: 10, category: "Core CS", description: "Transactions, NoSQL vs SQL, Sharding" },
          { name: "Operating Systems", weight: 10, category: "Core CS", description: "Multithreading, Concurrency, Mutex" },
          { name: "Amazon Leadership Principles", weight: 10, category: "Behavioral", description: "Customer Obsession, Ownership, Bias for Action, Deliver Results" }
        ],
        frameworksPreferred: ["Spring Boot", "REST APIs", "AWS SDK", "Microservices"],
        interviewRounds: [
          { name: "Round 1: Online Assessment (OA)", type: "2 LeetCode Mediums + Work Style Assessment" },
          { name: "Round 2: Technical Interview 1", type: "DSA & Problem Solving + 1 LP Behavioral Question" },
          { name: "Round 3: Technical Interview 2", type: "Object Oriented Design (OOD) + 1 LP Question" },
          { name: "Round 4: Bar Raiser", type: "Comprehensive Problem Solving & Deep LP Drill" }
        ],
        hiringBarFocus: "Deep adherence to 16 Leadership Principles combined with optimal O(N) DSA solutions."
      }
    ]
  },
  {
    id: "google",
    name: "Google",
    logoText: "GOOG",
    color: "#EA4335",
    tagline: "Organize the world's information and make it universally accessible and useful.",
    roles: [
      {
        id: "google-swe",
        title: "Software Engineer (L3)",
        level: "L3 University Graduate",
        department: "Search / YouTube / Cloud / Android",
        requiredSkills: [
          { name: "DSA", weight: 45, category: "Core CS", description: "Complex Dynamic Programming, Graphs (BFS/DFS/Dijkstra), Trie, Geometry" },
          { name: "Java/C++/Python", weight: 20, category: "Languages", description: "Idiomatic syntax, Time/Space efficiency" },
          { name: "Operating Systems & Concurrency", weight: 15, category: "Core CS", description: "Paging, Memory Hierarchy, Race conditions" },
          { name: "Computer Networks", weight: 10, category: "Core CS", description: "Network protocols, Latency, Bandwidth limits" },
          { name: "Googleyness & Leadership", weight: 10, category: "Behavioral", description: "Intellectual humility, doing right thing, collaborative communication" }
        ],
        frameworksPreferred: ["gRPC", "Protocol Buffers", "Distributed Systems"],
        interviewRounds: [
          { name: "Round 1: Google Online Challenge", type: "2 algorithmic puzzle problems (60 mins)" },
          { name: "Round 2: Coding Round 1", type: "Hard DSA problem on Google Docs / CoderPad" },
          { name: "Round 3: Coding Round 2", type: "Algorithm optimization, Corner cases, Trade-offs" },
          { name: "Round 4: Coding Round 3", type: "Data structure composition and asymptotic proofs" },
          { name: "Round 5: Googleyness & Leadership", type: "Behavioral situational judgment" }
        ],
        hiringBarFocus: "Mathematical rigour, absolute optimal complexity, and crystal-clear thought verbalization."
      }
    ]
  },
  {
    id: "tcs",
    name: "TCS Digital / Ninja",
    logoText: "TCS",
    color: "#0078D7",
    tagline: "Building on belief.",
    roles: [
      {
        id: "tcs-digital",
        title: "Digital Software Engineer",
        level: "Digital Cadre",
        department: "Enterprise Transformation",
        requiredSkills: [
          { name: "Java/Python", weight: 25, category: "Languages", description: "Basic syntax, loops, OOP concepts" },
          { name: "SQL / DBMS", weight: 25, category: "Databases", description: "Queries, Joins, Triggers, Views" },
          { name: "DSA", weight: 20, category: "Core CS", description: "Arrays, Strings, Stacks, Queues, Sorting" },
          { name: "Web Basics (HTML/CSS/JS)", weight: 15, category: "Frontend", description: "Web standards, DOM manipulation" },
          { name: "Communication & Aptitude", weight: 15, category: "Soft Skills", description: "Quantitative, Verbal, Professional demeanor" }
        ],
        frameworksPreferred: ["Spring Boot", "MySQL", "Git"],
        interviewRounds: [
          { name: "Round 1: National Qualifier Test (NQT)", type: "Cognitive, Verbal + Advanced Coding (2 problems)" },
          { name: "Round 2: Technical Interview", type: "Core Java/SQL, Final year project explanation" },
          { name: "Round 3: Managerial & HR", type: "Relocation flexibility, Communication, Company awareness" }
        ],
        hiringBarFocus: "Solid project explanation, error-free SQL/Java basics, and adaptable team attitude."
      }
    ]
  },
  {
    id: "meta",
    name: "Meta",
    logoText: "META",
    color: "#0668E1",
    tagline: "Give people the power to build community and bring the world closer together.",
    roles: [
      {
        id: "meta-swe",
        title: "Software Engineer (E3)",
        level: "E3 University Grad",
        department: "Infrastructure / Family of Apps",
        requiredSkills: [
          { name: "DSA", weight: 45, category: "Core CS", description: "High-speed coding: 2 LeetCode mediums in 35 mins" },
          { name: "Java/C++/Python", weight: 25, category: "Languages", description: "Bug-free clean code" },
          { name: "OOP & Architecture", weight: 15, category: "Core CS", description: "Modular code organization" },
          { name: "Behavioral / Values", weight: 15, category: "Behavioral", description: "Move fast, Be bold, Focus on impact" }
        ]
      }
    ]
  },
  {
    id: "adobe",
    name: "Adobe",
    logoText: "ADBE",
    color: "#FF0000",
    tagline: "Changing the world through digital experiences.",
    roles: [
      {
        id: "adobe-mts",
        title: "Member of Technical Staff",
        level: "MTS 1",
        department: "Creative Cloud / Experience Platform",
        requiredSkills: [
          { name: "DSA", weight: 35, category: "Core CS", description: "Algorithms, Trees, Graphs, Bit manipulation" },
          { name: "C++/Java", weight: 25, category: "Languages", description: "Memory management, OOP, STL/Collections" },
          { name: "Operating Systems", weight: 15, category: "Core CS", description: "Memory layout, Pointers, Concurrency" },
          { name: "DBMS / SQL", weight: 15, category: "Core CS", description: "Data indexing and storage" },
          { name: "Problem Solving", weight: 10, category: "Soft Skills", description: "Algorithmic thinking" }
        ]
      }
    ]
  }
];

export const careerRolesTaxonomy = [
  {
    id: "role-java-backend",
    title: "Java Backend Developer",
    category: "Backend Development",
    salaryRange: "₹8 LPA - ₹18 LPA",
    demandLevel: "Very High",
    requiredSkills: ["Java", "Spring Boot", "REST API", "MySQL", "Docker", "Git", "DSA", "DBMS"],
    recommendedAction: "Build a production-grade REST API with Spring Boot, JWT, and Docker."
  },
  {
    id: "role-swe",
    title: "Software Engineer",
    category: "General Software Engineering",
    salaryRange: "₹10 LPA - ₹25 LPA",
    demandLevel: "Extremely High",
    requiredSkills: ["DSA", "Java/C++", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design"],
    recommendedAction: "Practice medium-to-hard DSA topics and study operating-system concurrency and memory management."
  },
  {
    id: "role-fullstack",
    title: "Full Stack Developer",
    category: "Web Engineering",
    salaryRange: "₹7 LPA - ₹16 LPA",
    demandLevel: "High",
    requiredSkills: ["Java/Node.js", "React", "REST API", "MySQL/MongoDB", "HTML/CSS", "Git", "Docker"],
    recommendedAction: "Learn component architecture and build a full-stack dashboard connected to a production API."
  },
  {
    id: "role-data-analyst",
    title: "Data Analyst",
    category: "Data & Analytics",
    salaryRange: "₹6 LPA - ₹12 LPA",
    demandLevel: "Moderate",
    requiredSkills: ["SQL", "Python", "Pandas", "PowerBI/Tableau", "Statistics", "Excel"],
    recommendedAction: "Build an exploratory data analysis dashboard using Python and a data visualization tool."
  },
  {
    id: "role-cloud-engineer",
    title: "Cloud / DevOps Engineer",
    category: "Cloud Infrastructure",
    salaryRange: "₹8 LPA - ₹18 LPA",
    demandLevel: "High",
    requiredSkills: ["Linux", "AWS/Azure", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Terraform"],
    recommendedAction: "Begin with Linux command-line mastery and deploy a containerized service through a CI/CD pipeline."
  }
];
