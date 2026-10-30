export const profile = {
  name: "Sai Koushik Korada",
  headline: "AI Full Stack Engineer",
  email: "koushikkorada27@gmail.com",
  phone: "+91 7995824375",
  github: "https://github.com/koushikkorada355",
  linkedin: "https://www.linkedin.com/in/koushik-korada-02187a305/",
  leetcode: "https://leetcode.com/u/koushik_korada27/",
  gfg: "https://www.geeksforgeeks.org/profile/koushikkrujk?tab=activity",
  resume: "/Koushik_Korada.pdf",
};

export const skillGroups = [
  {
    title: "Programming Languages",
    items: ["C++", "Python", "JavaScript"],
  },
  {
    title: "Backend & APIs",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST API Design",
      "JWT Authentication",
      "Microservices",
    ],
  },
  {
    title: "Databases & Storage",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  },
  {
    title: "AI & Generative AI",
    items: [
      "LangGraph",
      "LangChain",
      "LLM Integration",
      "Tool Calling",
      "RAG",
      "Agent State & Memory",
    ],
  },
  {
    title: "Frontend",
    items: ["React.js", "Redux", "Tailwind CSS"],
  },
  {
    title: "Systems & Messaging",
    items: ["Apache Kafka", "Event-Driven Architecture", "Distributed Locking"],
  },
  {
    title: "Developer Tools & Infra",
    items: ["Git", "Docker", "Docker Compose", "Postman", "Swagger", "Vercel", "Render"],
  },
  {
    title: "Software Engineering",
    items: [
      "Data Structures & Algorithms",
      "System Design",
      "Alembic Migrations",
      "Pytest",
      "GitHub Copilot",
    ],
  },
];

export const engineeringFocus = [
  {
    title: "Full-stack application delivery",
    body: "Shipping features end to end — React clients backed by FastAPI and Node.js/Express services. The same MERN workflow I sharpened during my 120-hour SmartBridge virtual internship, now applied in projects with real databases and real constraints.",
  },
  {
    title: "Backend engineering & API design",
    body: "Designing REST APIs around domain rules — versioned endpoints, JWT flows, and contract clarity — so a growing codebase doesn't turn into a pile of special cases.",
  },
  {
    title: "Event-driven & distributed systems",
    body: "Building services that coordinate through Kafka topics instead of direct calls, with Redis-backed distributed locks keeping concurrent operations correct.",
  },
  {
    title: "GenAI, RAG & agentic workflows",
    body: "Designing LangGraph state machines with tool calling, memory, and conditional routing — and grounding LLM answers with retrieval rather than trusting raw generation.",
  },
];

export const experience = {
  role: "Virtual Intern — Full Stack Developer (MERN Stack)",
  org: "SmartBridge Educational Services Pvt. Ltd.",
  partner: "in collaboration with APSCHE (Govt. of Andhra Pradesh)",
  period: "2026",
  meta: "2 months · 120 hours · Short-Term Virtual Internship Program",
  points: [
    "Worked hands-on across the MERN stack — MongoDB, Express.js, React, and Node.js — through SmartBridge's structured virtual internship.",
    "Built and practiced full-stack feature development and API integration patterns that my e-commerce microservices platform directly builds on.",
    "Completed the APSCHE-endorsed industry track with verified completion (credentials vault).",
  ],
};

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyLink: string;
};

export const certificates: Certificate[] = [
  {
    title: "Certificate of Completion — Full Stack Developer (MERN Stack)",
    issuer: "SmartBridge × APSCHE",
    date: "2026",
    credentialId: "VIP-FSD-2026-1696",
    verifyLink:
      "https://myskillwallet.ai/certificate/6a10282e8e05517a37e494f1/6a193a98be9cdd9a90de202c",
  },
  {
    title: "Foundations of Deep Learning: Concepts and Applications",
    issuer: "NPTEL",
    date: "2026",
    credentialId: "NOC26CS01S95080018504835467",
    verifyLink:
      "https://nptel.ac.in/noc/E_Certificate/NOC26CS01S95080018504835467",
  },
  {
    title: "Statistical Foundation for Big Data Analysis",
    issuer: "NPTEL",
    date: "2026",
    credentialId: "NOC26CS09S65080024304835467",
    verifyLink:
      "https://nptel.ac.in/noc/E_Certificate/NOC26CS09S65080024304835467",
  },
  {
    title: "Cloud Computing",
    issuer: "NPTEL",
    date: "2025",
    credentialId: "NPTEL25CS107S3369701673",
    verifyLink:
      "https://archive.nptel.ac.in/content/noc/NOC25/SEM2/Ecertificates/106/noc25-cs107/Course/NPTEL25CS107S336970167310795652.pdf",
  },
  {
    title: "Artificial Intelligence: Search Methods for Problem Solving",
    issuer: "NPTEL",
    date: "2025",
    credentialId: "NPTEL25CS88S3469701707",
    verifyLink:
      "https://archive.nptel.ac.in/content/noc/NOC25/SEM2/Ecertificates/106/noc25-cs88/Course/NPTEL25CS88S346970170710795652.pdf",
  },
];

export const education = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    school: "RGUKT (IIIT), Srikakulam",
    period: "2023 — Present",
    detail: "CGPA 9.0 / 10",
  },
  {
    degree: "Pre-University Course (PUC), Applied Sciences",
    school: "RGUKT (IIIT), Srikakulam",
    period: "2021 — 2023",
    detail: "CGPA 9.67 / 10",
  },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  approach: string[];
  stack: string[];
  repo: string;
  demo?: string;
  dimension: string;
};

export const projects: Project[] = [
  {
    id: "healthcareai",
    title: "MediConnect — AI-Native Medical Scheduling",
    tagline:
      "A LangGraph assistant and a production-style FastAPI booking engine operating over one shared domain layer — two engineering concerns, one coherence.",
    problem:
      "Healthcare chatbots demo well and then double-book patients. This platform separates the assistant from the booking engine so neither can break the other.",
    approach: [
      "LangGraph pipeline (classify → safety → scope → clarify → tool-route) with a dedicated human-transfer node — out-of-scope requests get handed off, never improvised.",
      "An MCP capability registry exposes the platform's real booking actions as tools, so the agent calls the same verified services the UI does.",
      "Slot races decided by the database: one committer wins, the loser gets a 409 with available alternatives — no application locks.",
      "Multi-hospital tenant isolation, with audit, operational, and capability events joinable by a single correlation_id — covered by pytest suites.",
    ],
    stack: [
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "LangChain",
      "LangGraph",
      "MCP",
      "React",
      "Vite",
      "Tailwind",
      "Docker Compose",
      "Pytest",
    ],
    repo: "https://github.com/koushikkorada355/HealthCareAi",
    demo: "https://health-care-ai-nu.vercel.app",
    dimension: "AI + production systems",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Microservices Platform",
    tagline:
      "Nine independently deployable Node.js services that behave like one platform — coordinated by Kafka, governed at the gateway.",
    problem:
      "Splitting an e-commerce monolith creates a harder problem: making nine services coherent. This project answers that coordination question.",
    approach: [
      "Nine services — gateway, auth, products, cart, orders, inventory, payments, notifications, search — each with its own datastore and Docker lifecycle.",
      "Orders advance through a Kafka saga. No service ever calls another directly — state changes propagate as events.",
      "Redis serves three roles at once: TTL-backed cart storage, gateway rate limiting, and distributed locks that make concurrent stock reservation race-free.",
      "Polyglot persistence by ownership — MongoDB for auth and products, MySQL + Sequelize for orders and inventory.",
    ],
    stack: [
      "Node.js",
      "Express.js",
      "Apache Kafka",
      "MongoDB",
      "MySQL",
      "Redis",
      "JWT",
      "Docker Compose",
      "Cloudinary",
    ],
    repo: "https://github.com/koushikkorada355/EcommerceBackend",
    dimension: "distributed systems",
  },
  {
    id: "chatai",
    title: "ChatAI — Conversational Platform with RAG",
    tagline:
      "Every conversation is a compiled LangGraph graph — summarized, grounded in your documents, and checkpointed to survive restarts.",
    problem:
      "Chatbots lose context as they grow, hallucinate about user documents, and bolt auth on last. This platform fixes all three in one assistant loop.",
    approach: [
      "A compiled LangGraph StateGraph: the summarize node compresses aging history, a conditional edge routes tool calls back through the ToolNode, and the memory node persists each turn.",
      "PDF RAG — documents stored, chunked, and embedded into a document_chunks layer, so answers come from retrieved context rather than guesses.",
      "Human-approval and tool-affecting actions route through dedicated graph nodes and endpoints, keeping risky operations explicit and auditable.",
      "JWT-secured FastAPI APIs over PostgreSQL models for users, conversations, messages, memories, and documents — React client on top.",
    ],
    stack: [
      "Python",
      "LangGraph",
      "LangChain",
      "FastAPI",
      "PostgreSQL",
      "JWT",
      "React",
      "Vite",
      "Docker",
    ],
    repo: "https://github.com/koushikkorada355/chatAi",
    demo: "https://chat-ai-chi-umber.vercel.app",
    dimension: "GenAI application",
  },
];

export const achievements = [
  {
    stat: "1,657",
    title: "Problems solved across both platforms",
    body: "LeetCode: 1,308 solved — 812 Medium and 210 Hard. GeeksforGeeks: 349 solved.",
    link: profile.leetcode,
    linkLabel: "LeetCode profile",
  },
  {
    stat: "13,966",
    title: "LeetCode global rank",
    body: "Contest rating 1,768 — top 9.87% of participants over 26 contests, plus a 500-day daily-challenge badge.",
    link: profile.leetcode,
    linkLabel: "View contests",
  },
  {
    stat: "#8",
    title: "Institute rank on GeeksforGeeks",
    body: "Coding score 1,433 with a 153-day Probability-of-the-Day solving streak.",
    link: profile.gfg,
    linkLabel: "GFG profile",
  },
];
