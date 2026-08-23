// Comprehensive Mock Interview Question Bank with AI Evaluation Rubrics & Adaptive Tracks

export const interviewQuestionsBank = [
  // ================= TECHNICAL QUESTIONS =================
  {
    id: "q-tech-01",
    category: "Technical",
    subCategory: "Java Core & Concurrency",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "Explain the difference between HashMap and ConcurrentHashMap in Java. How does ConcurrentHashMap achieve thread safety without locking the entire map?",
    context: "Asked frequently in Microsoft, Amazon, and Uber technical rounds.",
    keywords: ["thread safe", "synchronization", "segment locking", "cas", "compare and swap", "bucket lock", "null keys", "rehashing", "concurrency level"],
    idealAnswerOutline: "HashMap is non-synchronized, allows one null key, and is not thread-safe (can result in infinite loops during concurrent resize in older Java or corrupted state). ConcurrentHashMap is thread-safe. Prior to Java 8, it used Segment Locking (ReentrantLock on partitions). From Java 8 onward, it uses CAS (Compare-And-Swap) for empty bucket insertions and synchronized locks on individual bucket heads (Node) plus TreeBins during hash collisions. It never locks the whole table for reads and doesn't allow null keys/values.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.4,
      conceptualDepthWeight: 0.3,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },
  {
    id: "q-tech-02",
    category: "Technical",
    subCategory: "Spring Boot & REST",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "How does Spring Boot's Dependency Injection and Inversion of Control (IoC) work under the hood? What are the key bean scopes in Spring?",
    context: "Core backend architecture question for SDE/Backend roles.",
    keywords: ["ioc container", "applicationcontext", "beanfactory", "singleton", "prototype", "autowired", "reflection", "lifecycle", "postconstruct", "bean definition"],
    idealAnswerOutline: "IoC transfers the responsibility of object instantiation and lifecycle management to the Spring Container (ApplicationContext/BeanFactory). It uses Java Reflection and CGLIB/JDK dynamic proxies to inject dependencies annotated with @Autowired, @Component, or constructors. Major bean scopes: Singleton (one instance per container, default), Prototype (new instance per request), Request (HTTP request lifecycle), Session (HTTP session lifecycle), and Application.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.4,
      conceptualDepthWeight: 0.3,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },
  {
    id: "q-tech-03",
    category: "Technical",
    subCategory: "Database & Transactions",
    difficulty: "Hard",
    companyTarget: "Microsoft",
    question: "What are the ACID properties in relational databases? How do isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) prevent anomalies like Dirty Reads and Phantom Reads?",
    context: "Critical DBMS question for backend and software engineer candidates.",
    keywords: ["atomicity", "consistency", "isolation", "durability", "dirty read", "non-repeatable read", "phantom read", "mvcc", "wal", "locking"],
    idealAnswerOutline: "ACID ensures reliable transaction processing: Atomicity (all or nothing via WAL), Consistency (database rules preserved), Isolation (concurrent execution isolation), Durability (committed changes persist). Isolation levels: Read Uncommitted (allows dirty reads), Read Committed (prevents dirty reads via MVCC/read locks), Repeatable Read (prevents non-repeatable reads by keeping row locks or snapshot), Serializable (prevents phantom reads via range locks/strict serial order).",
    evaluationRubric: {
      technicalAccuracyWeight: 0.4,
      conceptualDepthWeight: 0.3,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },
  {
    id: "q-tech-04",
    category: "Technical",
    subCategory: "Operating Systems",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "What is the difference between a Process and a Thread? How does the operating system handle context switching between them?",
    context: "Standard OS core competency check in Microsoft and Amazon interviews.",
    keywords: ["process", "thread", "address space", "pcb", "tcb", "context switch", "shared memory", "stack", "heap", "overhead", "mmu"],
    idealAnswerOutline: "A process is an executing program instance with its own independent address space (code, data, heap, stack, file descriptors). A thread is the smallest unit of CPU execution inside a process; multiple threads share the same address space, heap, and open files, but have their own registers, program counter, and stack. Context switching between processes requires invalidating TLB and switching page directories via MMU, incurring high overhead; thread context switching is faster because virtual memory mappings remain unchanged.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.4,
      conceptualDepthWeight: 0.3,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },

  // ================= DSA QUESTIONS =================
  {
    id: "q-dsa-01",
    category: "DSA",
    subCategory: "Trees & Graphs",
    difficulty: "Medium",
    companyTarget: "Amazon",
    question: "Given the root of a Binary Tree, describe an optimal algorithm to find the Lowest Common Ancestor (LCA) of two given nodes `p` and `q`. What is the time and space complexity?",
    context: "Standard algorithmic problem asked in Microsoft, Amazon, Google rounds.",
    keywords: ["recursion", "dfs", "postorder", "o(n)", "o(h)", "base case", "left right subtree", "null check", "stack depth"],
    idealAnswerOutline: "Use recursive DFS (post-order traversal). If root is null, or root == p, or root == q, return root. Recursively search left = lca(root.left, p, q) and right = lca(root.right, p, q). If both left and right return non-null, root is the LCA. If only one is non-null, propagate that non-null node upwards. Time Complexity: O(N) where N is number of nodes. Space Complexity: O(H) recursion stack where H is tree height (O(log N) balanced, O(N) worst case skewed).",
    evaluationRubric: {
      technicalAccuracyWeight: 0.45,
      conceptualDepthWeight: 0.25,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },
  {
    id: "q-dsa-02",
    category: "DSA",
    subCategory: "Dynamic Programming",
    difficulty: "Hard",
    companyTarget: "Google",
    question: "How would you solve the 'Longest Increasing Subsequence' (LIS) problem in O(N log N) time using Patience Sorting / Binary Search? Compare it with the O(N^2) DP approach.",
    context: "High-frequency Google and Meta algorithmic question.",
    keywords: ["binary search", "patience sorting", "tails array", "bisect", "o(n log n)", "o(n^2)", "memoization", "lower bound"],
    idealAnswerOutline: "The standard DP approach maintains dp[i] as the LIS ending at index i, iterating through all j < i, yielding O(N^2) time and O(N) space. The optimal O(N log N) solution maintains a dynamic 'tails' array where tails[len] stores the smallest tail of all increasing subsequences of length len. For each number x, use binary search (Arrays.binarySearch or custom lower_bound) to find its insertion spot in tails. If x is greater than all tails, append it; otherwise replace the first element >= x. Final answer is length of tails array.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.45,
      conceptualDepthWeight: 0.25,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },

  // ================= SYSTEM DESIGN QUESTIONS =================
  {
    id: "q-sys-01",
    category: "System Design",
    subCategory: "High Level Architecture",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "How would you design a scalable URL Shortener service (like bit.ly) that can handle 100 million new URLs per day with low latency reads?",
    context: "Foundational System Design question for SDE/Backend roles.",
    keywords: ["base62", "hashing", "counter", "distributed id generator", "snowflake", "redis cache", "nosql", "bloom filter", "load balancer", "cdn", "read heavy"],
    idealAnswerOutline: "1. Capacity estimation: 100M writes/day (~1150 writes/sec), 10:1 read/write ratio (~11,500 reads/sec). 2. Short URL generation: Base62 encoding of a distributed 64-bit unique ID (Twitter Snowflake / Zookeeper sequential counter) yielding 7 alphanumeric characters (62^7 = ~3.5 trillion URLs). 3. Storage: Relational/NoSQL (Cassandra/DynamoDB) storing {shortKey, originalUrl, createdAt, userId}. 4. Caching: Redis cluster caching the top 20% hottest URLs (80/20 rule) to achieve <10ms read latency. 5. Load balancing with Nginx/ALB and 301/302 HTTP redirects.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.35,
      conceptualDepthWeight: 0.35,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },
  {
    id: "q-sys-02",
    category: "System Design",
    subCategory: "Rate Limiting & Reliability",
    difficulty: "Hard",
    companyTarget: "Amazon",
    question: "Design an API Rate Limiter to protect downstream backend microservices from DDoS and abuse. Which algorithm (Token Bucket, Leaky Bucket, Sliding Window Log, Sliding Window Counter) would you choose and why?",
    context: "Critical distributed systems problem for SDE-1/SDE-2 at top tech firms.",
    keywords: ["token bucket", "sliding window counter", "redis", "atomic operations", "lua scripts", "race condition", "http 429", "throughput", "memory footprint"],
    idealAnswerOutline: "I would choose Token Bucket (or Sliding Window Counter for memory efficiency). In Token Bucket, tokens refill at a steady rate r up to capacity C. Requests consume tokens; if empty, return HTTP 429 Too Many Requests. To scale across distributed nodes, use Redis with Lua scripts for atomic token decrement and timestamp calculation to avoid race conditions. Sliding Window Counter offers better memory bounds by interpolating counts between previous and current time windows.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.35,
      conceptualDepthWeight: 0.35,
      communicationWeight: 0.2,
      completenessWeight: 0.1
    }
  },

  // ================= HR & BEHAVIORAL QUESTIONS =================
  {
    id: "q-hr-01",
    category: "HR",
    subCategory: "Introduction & Self-Pitch",
    difficulty: "Easy",
    companyTarget: "Microsoft",
    question: "Tell me about yourself, your academic background, and what inspired you to pursue a career in software engineering.",
    context: "Mandatory opening question in almost every technical & HR interview.",
    keywords: ["b.tech", "cs background", "projects", "java", "passion for problem solving", "internship", "leadership", "continuous learning"],
    idealAnswerOutline: "Structure: Present → Past → Future. 1. Present: Current status (B.Tech CSE student at NIT, core focus on Java backend engineering and scalable system design). 2. Past: Key milestones (built Student & Bank Management systems, solved 180+ DSA problems, interned at TechNova optimizing SQL queries by 25%). 3. Future: Why this company aligns with your passion to build high-impact enterprise software.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.1,
      conceptualDepthWeight: 0.2,
      communicationWeight: 0.5,
      completenessWeight: 0.2
    }
  },
  {
    id: "q-hr-02",
    category: "HR",
    subCategory: "Conflict & Challenge (STAR)",
    difficulty: "Medium",
    companyTarget: "Amazon",
    question: "Describe a challenging technical obstacle or bug you encountered in one of your projects or internships. How did you diagnose it and what was the outcome? (Please use the STAR method).",
    context: "Standard behavioral question evaluating resilience, debugging aptitude, and communication.",
    keywords: ["situation", "task", "action", "result", "star method", "root cause analysis", "debugging", "learning outcome", "metrics"],
    idealAnswerOutline: "Follow STAR: Situation: In the Bank Management project, multithreaded transactions caused intermittent race conditions and inconsistent account balances under simulated concurrent load. Task: Needed to identify the race condition without degrading throughput. Action: Used thread dump analysis and JConsole to identify unsynchronized shared state, refactored to ReentrantLocks with tryLock timeouts and atomic primitives. Result: Zero balance discrepancies across 10,000 simulated threads and reduced lock contention latency by 40%.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.2,
      conceptualDepthWeight: 0.2,
      communicationWeight: 0.4,
      completenessWeight: 0.2
    }
  },
  {
    id: "q-hr-03",
    category: "HR",
    subCategory: "Company Alignment & Motivation",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "Why do you specifically want to join Microsoft over other tech companies, and what value will you bring to our engineering team?",
    context: "Assesses company research, cultural alignment, and genuine motivation.",
    keywords: ["satya nadella", "growth mindset", "empowerment", "azure", "developer tooling", "open source contribution", "values", "culture"],
    idealAnswerOutline: "Highlight Microsoft's culture of Growth Mindset championed by Satya Nadella, its massive global impact across developer platforms (GitHub, TypeScript, VS Code) and enterprise cloud infrastructure (Azure). Emphasize how your strong Java foundation, commitment to clean architecture, and rapid learning velocity will allow you to make meaningful contributions to cloud services while continuously upskilling.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.1,
      conceptualDepthWeight: 0.2,
      communicationWeight: 0.5,
      completenessWeight: 0.2
    }
  },
  {
    id: "q-hr-04",
    category: "HR",
    subCategory: "Failure & Growth",
    difficulty: "Medium",
    companyTarget: "Microsoft",
    question: "Tell me about a time you made a significant mistake or experienced a failure. What did you learn from it and how did you adapt?",
    context: "Evaluates self-awareness, accountability, and psychological maturity.",
    keywords: ["ownership", "mistake", "accountability", "reflection", "corrective action", "growth mindset", "prevention"],
    idealAnswerOutline: "Discuss a genuine technical or academic miscalculation (e.g. Underestimating database index overhead in early internship query optimization, causing slow writes). Explain how you took full ownership without deflecting blame, conducted root cause analysis, implemented proper composite indexing and benchmarking tests, and created a team documentation checklist to prevent recurrence.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.1,
      conceptualDepthWeight: 0.2,
      communicationWeight: 0.5,
      completenessWeight: 0.2
    }
  },
  {
    id: "q-hr-05",
    category: "HR",
    subCategory: "Why Should We Hire You",
    difficulty: "Easy",
    companyTarget: "TCS",
    question: "Why should we hire you for this role? What sets you apart from other candidates with similar academic credentials?",
    context: "Closing elevator pitch assessing confidence, clarity, and unique differentiators.",
    keywords: ["strong core cs", "practical project evidence", "quick learner", "work ethic", "collaboration", "adaptability"],
    idealAnswerOutline: "Synthesize your unique combination: 1. Strong foundational grounding in Core Java, OOP, and Relational databases demonstrated through 180+ DSA problem solutions and Oracle certification. 2. Practical applied project experience building real concurrent and database-backed applications. 3. High adaptability and collaborative attitude proven in internships and hackathons.",
    evaluationRubric: {
      technicalAccuracyWeight: 0.1,
      conceptualDepthWeight: 0.2,
      communicationWeight: 0.5,
      completenessWeight: 0.2
    }
  }
];
