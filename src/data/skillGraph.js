// Skill Taxonomy, Dependency Graph, Gap-Closing Projects, and Dynamic Roadmap Templates

export const skillDependencyGraph = {
  "Spring Boot": {
    prerequisites: ["Java", "OOP"],
    unlocks: ["REST API", "Microservices", "Spring Security", "JWT Authentication"],
    importance: "Critical for modern Java Enterprise & Cloud Backends",
    rationale: "Spring Boot is your highest priority because it is required by your target Microsoft Software Engineer role and builds directly on your existing Java & OOP knowledge."
  },
  "REST API": {
    prerequisites: ["Java", "HTTP Protocols"],
    unlocks: ["Microservices", "Full Stack Integration", "API Gateways"],
    importance: "Fundamental communication standard for modern web services",
    rationale: "REST API architecture is universally required for enterprise software engineering and enables communication between frontend clients and backend microservices."
  },
  "Docker": {
    prerequisites: ["Operating Systems", "Linux Basics"],
    unlocks: ["Kubernetes", "CI/CD Pipelines", "Cloud Deployment"],
    importance: "Industry standard for containerization and reproducible runtime environments",
    rationale: "Docker containerization eliminates 'works on my machine' issues and is required for microservice deployment in cloud platforms like Microsoft Azure."
  },
  "System Design": {
    prerequisites: ["DBMS", "Operating Systems", "Computer Networks"],
    unlocks: ["Distributed Systems", "High Scalability", "Architectural Leadership"],
    importance: "Crucial for tech giant interviews (Microsoft L59/Amazon SDE-1)",
    rationale: "System Design connects your low-level DBMS and networking fundamentals into high-level architecture (caching, load balancing, sharding)."
  },
  "Microservices": {
    prerequisites: ["Spring Boot", "REST API", "Docker"],
    unlocks: ["Service Meshes", "Event-Driven Architecture (Kafka)"],
    importance: "Standard architecture for scalable enterprise cloud applications",
    rationale: "Microservices build upon Spring Boot and Docker to create independently deployable resilient services."
  }
};

export const gapClosingProjects = [
  {
    id: "proj-ecommerce-api",
    title: "Production-Ready E-Commerce REST API",
    subtitle: "Enterprise Java Backend with JWT Security, MySQL & Docker Containerization",
    targetRole: "Java Backend Developer / Microsoft SWE",
    difficulty: "Intermediate to Advanced",
    duration: "3–4 Weeks",
    resumeImpact: "High (Top 5% Placement Portfolio)",
    category: "Cloud / Backend Microservices",
    description: "Architect and deploy a high-throughput, secure RESTful e-commerce backend handling product catalogs, shopping cart sessions, idempotent order placement, and RBAC authentication.",
    skillsGained: ["Spring Boot", "REST APIs", "JWT Authentication", "MySQL", "Docker", "JPA / Hibernate", "Unit Testing (JUnit 5 / Mockito)"],
    addressesGaps: ["Spring Boot", "REST API", "Docker", "Authentication"],
    architectureHighlights: [
      "Layered Clean Architecture (Controller, Service, Repository, DTO)",
      "Stateless JWT Authentication with Spring Security 6 & Role-based Access Control (RBAC)",
      "Database connection pooling (HikariCP) & transactional integrity with pessimistic locking for inventory deduction",
      "Global Exception Handling with standardized RFC 7807 problem details",
      "Multi-stage Dockerfile build optimized for lightweight Alpine container execution"
    ],
    milestones: [
      { week: 1, title: "Domain Modeling & Entity Relations", details: "Design MySQL schemas with JPA entities for Users, Roles, Products, Orders, and OrderItems." },
      { week: 2, title: "RESTful Endpoints & Validation", details: "Implement CRUD controllers with @Valid request bodies, pagination, and sorting." },
      { week: 3, title: "Spring Security & JWT Auth", details: "Create authentication filters, password hashing with BCrypt, and token validation." },
      { week: 4, title: "Dockerization & Integration Tests", details: "Write unit & integration tests, create Docker Compose for app + MySQL, and document OpenAPI/Swagger." }
    ],
    githubStarterTemplate: "https://github.com/careercompass-templates/spring-boot-ecommerce-api"
  },
  {
    id: "proj-url-shortener",
    title: "High-Throughput Distributed URL Shortener & Analytics",
    subtitle: "Scalable URL Redirection Service with Redis Caching & Base62 Encoding",
    targetRole: "Software Engineer / SDE-1",
    difficulty: "Intermediate",
    duration: "2–3 Weeks",
    resumeImpact: "High (System Design & Scalability Proof)",
    category: "Distributed Systems & Caching",
    description: "Design and implement a low-latency URL shortening microservice capable of generating unique hash aliases with Redis distributed caching and rate-limiting.",
    skillsGained: ["Java / Spring Boot", "Redis Caching", "Base62 Encoding", "Rate Limiting", "Docker", "System Design"],
    addressesGaps: ["System Design", "Spring Boot", "Redis / Caching", "Docker"],
    architectureHighlights: [
      "Distributed ID generator using Snowflake timestamp + machine ID algorithm",
      "Base62 bi-directional encoding for collision-free 7-character aliases",
      "Redis LRU cache with 90%+ hit-ratio for top redirected links",
      "Token Bucket rate limiting protecting endpoint against automated crawlers"
    ],
    milestones: [
      { week: 1, title: "Base62 Hashing & Storage", details: "Build core encoder and MySQL storage with unique indices." },
      { week: 2, title: "Redis Cache Layer & Latency Optimization", details: "Implement Cache-Aside pattern in Spring Boot with Redis." },
      { week: 3, title: "Rate Limiter & Docker Deployment", details: "Add Token Bucket interceptor and containerize with Docker Compose." }
    ],
    githubStarterTemplate: "https://github.com/careercompass-templates/distributed-url-shortener"
  },
  {
    id: "proj-task-orchestrator",
    title: "Real-Time Microservices Task Queue & Notification Hub",
    subtitle: "Event-Driven Asynchronous Message Pipeline using Spring Cloud & RabbitMQ",
    targetRole: "Cloud & Backend Engineer",
    difficulty: "Advanced",
    duration: "4 Weeks",
    resumeImpact: "Exceptional (Enterprise Grade)",
    category: "Microservices & Message Queues",
    description: "Build an asynchronous worker engine that processes background batch jobs, sends transactional notifications, and handles message retries with dead-letter queues.",
    skillsGained: ["Spring Cloud", "RabbitMQ / Kafka", "Docker", "Microservices", "Event-Driven Architecture"],
    addressesGaps: ["Microservices", "Message Queues", "Docker", "Cloud"],
    architectureHighlights: [
      "Decoupled Producer-Consumer topology with asynchronous AMQP messaging",
      "Exponential backoff retry policy with Dead Letter Exchange (DLX)",
      "Observability with Spring Boot Actuator and Prometheus metrics"
    ],
    milestones: [
      { week: 1, title: "RabbitMQ Producer & Exchange Setup", details: "Configure Spring AMQP with topic exchanges and bindings." },
      { week: 2, title: "Consumer Worker & Idempotency", details: "Implement resilient listeners with deduplication tokens." },
      { week: 3, title: "Dead Letter Queue & Metrics", details: "Add error handlers, retry queues, and Actuator health endpoints." },
      { week: 4, title: "End-to-End Benchmark & Dockerization", details: "Run JMeter concurrency tests and create Docker swarm setup." }
    ],
    githubStarterTemplate: "https://github.com/careercompass-templates/microservice-task-queue"
  }
];

export const dynamicRoadmapTemplate = [
  {
    weekNumber: 1,
    title: "Spring Boot Core & Dependency Injection",
    status: "in-progress",
    focus: "Framework Foundations",
    hoursRequired: "12 Hours",
    description: "Transition from standalone Java to Spring Boot enterprise framework. Master Inversion of Control (IoC), Beans, and Annotations.",
    keyTopics: [
      "Spring Boot architecture & Spring Initializr",
      "@Component, @Service, @Repository, @Controller vs @RestController",
      "Dependency Injection: Constructor vs Setter injection",
      "Application properties and profiles (dev/prod)"
    ],
    deliverable: "Create a functional Spring Boot service exposing health and metadata endpoints.",
    completed: true
  },
  {
    weekNumber: 2,
    title: "RESTful API Architecture & Validation",
    status: "in-progress",
    focus: "API Engineering",
    hoursRequired: "14 Hours",
    description: "Design standard HTTP REST APIs with proper HTTP verbs (GET, POST, PUT, DELETE), status codes, and request body validation.",
    keyTopics: [
      "HTTP Methods, Idempotency, and HTTP Status Codes (200, 201, 400, 404, 500)",
      "@PathVariable, @RequestParam, @RequestBody mapping",
      "Bean validation with Hibernate Validator (@NotNull, @Size, @Email)",
      "Centralized Exception Handling with @ControllerAdvice and @ExceptionHandler"
    ],
    deliverable: "Build CRUD endpoints for an e-commerce catalog with comprehensive validation.",
    completed: false
  },
  {
    weekNumber: 3,
    title: "Database Integration: Spring Data JPA & MySQL",
    status: "pending",
    focus: "Data Persistence",
    hoursRequired: "15 Hours",
    description: "Connect Spring Boot to MySQL database using Spring Data JPA, Hibernate ORM, and connection pooling.",
    keyTopics: [
      "Entity mapping: @Entity, @Table, @Id, @GeneratedValue",
      "Relationships: @OneToMany, @ManyToOne, @ManyToMany with FetchType.LAZY",
      "Repository pattern with JpaRepository & custom JPQL queries",
      "Database transactions with @Transactional and ACID consistency"
    ],
    deliverable: "Persist relational data with cascade rules and optimize query joins.",
    completed: false
  },
  {
    weekNumber: 4,
    title: "Security & JWT Stateless Authentication",
    status: "pending",
    focus: "Security & Auth",
    hoursRequired: "16 Hours",
    description: "Secure your backend APIs using Spring Security 6, BCrypt password hashing, and JSON Web Tokens (JWT).",
    keyTopics: [
      "Spring Security filter chain architecture",
      "BCrypt password hashing and user authentication",
      "JWT generation, signing with HMAC256, and claims extraction",
      "Custom OncePerRequestFilter for bearer token validation"
    ],
    deliverable: "Implement secure User Login, Registration, and Protected Admin endpoints.",
    completed: false
  },
  {
    weekNumber: 5,
    title: "Containerization with Docker",
    status: "pending",
    focus: "DevOps & Deployment",
    hoursRequired: "10 Hours",
    description: "Package the Spring Boot application and MySQL database into portable, isolated Docker containers.",
    keyTopics: [
      "Dockerfile syntax: FROM, WORKDIR, COPY, RUN, ENTRYPOINT",
      "Multi-stage builds to optimize image size (<150MB)",
      "Docker Compose for multi-container orchestration (App + MySQL + Redis)",
      "Volume mounting for persistent database data"
    ],
    deliverable: "Run your entire backend ecosystem in 1-click via docker-compose up.",
    completed: false
  },
  {
    weekNumber: 6,
    title: "Build Portfolio Gap-Closing Project",
    status: "pending",
    focus: "Capstone Project",
    hoursRequired: "20 Hours",
    description: "Synthesize all learned skills into a production-grade 'E-Commerce REST API' ready for your resume and GitHub.",
    keyTopics: [
      "End-to-end integration: Auth + Catalog + Order Flow + Docker",
      "Unit & Integration testing with JUnit 5 and Mockito",
      "OpenAPI 3 / Swagger API interactive documentation",
      "Professional GitHub README with architecture diagrams"
    ],
    deliverable: "Publish clean GitHub repository with live demo video and test suite.",
    completed: false
  },
  {
    weekNumber: 7,
    title: "High-Frequency DSA & Core CS Polish",
    status: "pending",
    focus: "Technical Interviews",
    hoursRequired: "18 Hours",
    description: "Sharpen high-priority interview algorithmic patterns targeted by Microsoft (Trees, Graphs, HashMaps, OS & Concurrency).",
    keyTopics: [
      "Binary Trees, BST, Lowest Common Ancestor (LCA)",
      "Graph traversals (BFS, DFS, Dijkstra, Cycle Detection)",
      "Operating Systems: Process vs Thread, Deadlocks, Virtual Memory",
      "DBMS: Indexing, ACID, Normalization, Query Tuning"
    ],
    deliverable: "Solve 25 targeted LeetCode Mediums and pass core CS revision tests.",
    completed: false
  },
  {
    weekNumber: 8,
    title: "AI Mock Interviews & Placement Readiness",
    status: "pending",
    focus: "Interview Mastery",
    hoursRequired: "14 Hours",
    description: "Conduct adaptive technical and HR mock interviews on CareerCompass AI, review feedback, and fine-tune behavioral STAR stories.",
    keyTopics: [
      "Technical live coding & verbalization of algorithm complexity",
      "System design explanation of URL shortener / caching",
      "HR behavioral mastery: STAR method on challenging projects",
      "Confidence building, tone, and pacing"
    ],
    deliverable: "Achieve 85%+ Interview Readiness Score across Technical and HR rounds.",
    completed: false
  }
];
