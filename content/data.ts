/**
 * content/data.ts — single source of truth for everything the site says about Atanu.
 *
 * Sourcing rule: every fact below comes from one of
 *   [LI]  content/linkedin.pdf (LinkedIn export, Oct 2026)
 *   [CV]  public/resume.pdf (Atanu's résumé, Oct 2026)
 *   [GH]  public GitHub API / READMEs for user `techatanu` (fetched 2026-10-19)
 *   [SPEC] PORTFOLIO_SPEC.md or Atanu's answers at a checkpoint
 *   [DRAFT] copy written in Atanu's voice from the facts above — needs his approval
 * Anything unknown is marked `TODO(atanu): …` and must be resolved before launch.
 */

export type SkillGroup =
  | "Machine Learning & AI"
  | "Data & Analytics"
  | "Languages"
  | "Full-Stack & APIs"
  | "Tools & Deployment"
  | "Spoken Languages";

/** Colour family used to tell groups / kinds apart (maps to design tokens in globals.css). */
export type Accent = "teal" | "glow" | "amber" | "muted";

/** Classification of the project's existing tags — drives the filter chips. */
export type ProjectCategory = "ai-ml" | "full-stack" | "data" | "systems" | "dsa";

export type Project = {
  slug: string;
  category: ProjectCategory;
  /** One short result line copied from this project's own `results`; omit when there's no metric. */
  headline?: string;
  title: string;
  oneLiner: string;
  /** Short tag line shown on the exhibit card, e.g. "Audio ML · Solo". */
  tags: string;
  problem: string;
  /** Bullet points — always rendered on the card and the case-study page. */
  approach: string[];
  stack: string[];
  /** Only numbers that appear in the repo's own README/reports or the résumé. */
  results: string[];
  next: string[];
  /** Every project shows its GitHub repo and, when it exists, a live demo. */
  repo: string;
  live?: string;
  /** Shown in place of the demo button when there is no live demo yet. */
  demoNote?: string;
  image: string; // screenshots go in /public/projects/<slug>.webp (Phase 5)
  featured: boolean;
  /** Cover art family when it should differ from `category` (keeps covers in a row from repeating). */
  motif?: ProjectCategory;
  /** Solo or team, and what Atanu personally did — keeps credit honest. */
  role: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  org: string;
  detail: string;
  kind: "education" | "experience" | "certification" | "event";
};

// ─────────────────────────────────────────────────────────────── profile
export const profile = {
  name: "Atanu Adhikari", // [LI] [CV]
  shortName: "Atanu", // [SPEC]
  role: "AI/ML Engineer · Full-Stack Developer", // [SPEC] checkpoint 0 answer (a)
  /** LinkedIn headline, shortened for the hero. [LI] */
  headline: "Machine learning, LLM agents and full-stack web apps — built end to end.",
  tagline: "I build end-to-end AI/ML projects — from data and models to deployed apps.", // [LI] [CV]
  education: "B.Tech, Computer Science & Artificial Intelligence · Newton School of Technology", // [CV] [LI]
  year: "3rd year", // [CV]
  location: "Rishihood University, Sonipat, Haryana", // [SPEC] [CV]
  email: "atanuadhikari5@gmail.com", // [SPEC] [LI] [CV]
  github: "https://github.com/techatanu", // [GH] [CV]
  linkedin: "https://www.linkedin.com/in/atanu-adhikari-3298492ab", // [LI] [CV] [GH]
  resumeUrl: "/resume.pdf", // [CV] — a copy of docs/Atanu_Resume2.pdf (Nov 2026); replace the file, keep the name
  /** File name the browser saves the résumé as. */
  resumeFileName: "Atanu_Adhikari_Resume.pdf",
  openTo: "Remote AI/ML internships · Full-stack roles", // [SPEC] [LI] [CV]
  domain: "https://atanu.online", // [SPEC]
  spokenLanguages: ["English", "Hindi", "Bengali"], // [CV]
} as const;

// ─────────────────────────────────────────────────────────────── site settings
export const site = {
  /** Ambient sound toggle: present, OFF by default ([SPEC] answer d). Audio is generated with Web Audio — no third-party files. */
  sound: { enabled: true, defaultOn: false, label: { on: "SOUND ON", off: "SOUND OFF" } },
} as const;

// ─────────────────────────────────────────────────────────────── chapters (HUD labels + headings)
export const chapters = [
  // `hud` is the small section number above each heading; `title` is the heading recruiters scan for.
  { id: "hero", hud: "00", title: "Intro" },
  { id: "origin", hud: "01", title: "About" },
  { id: "skills", hud: "02", title: "Skills & Tools" },
  { id: "artifacts", hud: "03", title: "Selected Projects" },
  { id: "timeline", hud: "04", title: "Experience & Milestones" },
  { id: "singularity", hud: "05", title: "What I'm Looking For" },
  { id: "contact", hud: "06", title: "Contact" },
] as const;

// ─────────────────────────────────────────────────────────────── nav + shared UI labels  [DRAFT]
export const nav = {
  skipLink: "Skip to content",
  // `mobile: false` links are hidden on phones so the bar fits on one line.
  links: [
    { label: "About", href: "#origin", mobile: false },
    { label: "Skills", href: "#skills", mobile: false },
    { label: "Projects", href: "#artifacts", mobile: true },
    { label: "Experience", href: "#timeline", mobile: false },
    { label: "Contact", href: "#contact", mobile: false }, // phones reach contact via the hero CTAs
  ],
  resume: { label: "Résumé", href: profile.resumeUrl },
};

export const labels = {
  featured: "Featured case study",
  liveCount: "live demos",
  projectCount: "projects",
  problem: "Problem",
  approach: "Approach",
  results: "Results",
  next: "What's next",
  stack: "Stack",
  role: "Role",
  repo: "GitHub",
  live: "Live demo",
  view: "View", // cursor label over project exhibits
  caseStudy: "Read case study",
};

// ─────────────────────────────────────────────────────────────── CH.00 hero  [DRAFT]
export const hero = {
  name: profile.name,
  role: profile.role,
  /** Small line above the name: who / where, for a 10-second scan. [CV] [LI] */
  credential: "B.Tech CS & AI · Newton School of Technology · 3rd year",
  /** One-sentence pitch under the role. [LI] summary + [CV] summary. */
  summary:
    "I build end-to-end AI/ML projects — from data and models to deployed apps — with Python, scikit-learn, PyTorch, LangGraph and React.",
  badge: "Open to remote AI/ML internships",
  primaryCta: "Email me",
  scrollCue: "Scroll down",
  portraitAlt: "Portrait of Atanu Adhikari",
};

// ─────────────────────────────────────────────────────────────── CH.01 origin  [DRAFT]
export const origin = {
  paragraphs: [
    // [CV] [LI] education, year, summary.
    "I'm a third-year B.Tech student in Computer Science & Artificial Intelligence at Newton School of Technology, Rishihood University. I build end-to-end AI/ML projects — from raw data and models to deployed applications.",
    // [CV] summary: classical ML, DL, LLM agents, full-stack; "Reports honest, reproducible metrics."
    "My work spans classical machine learning (scikit-learn), deep learning (PyTorch), LLM agents and RAG (LangGraph, ChromaDB) and full-stack web apps (FastAPI, React, Node.js). I care about honest, reproducible evaluation — I report the realistic number, not the flattering one.",
    // TODO(atanu): the "why AI" moment is yours to tell — what first pulled you in? One or two sentences.
    "TODO(atanu): what drew you to AI/ML — a moment, a problem, a person.",
    // [LI] [CV] DevClub role.
    "Outside coursework, I'm Acting Executive of DevClub at Newton School of Technology × Rishihood University.",
  ],
  /** "At a glance" facts for a quick recruiter scan. */
  facts: [
    { label: "Education", value: "B.Tech, Computer Science & AI · Newton School of Technology · 2024 – 2028" }, // [LI] [CV]
    { label: "Location", value: "Rishihood University, Sonipat, Haryana · IST (UTC+5:30)" }, // [SPEC] [CV]
    { label: "Focus", value: "Machine learning · LLM agents & RAG · Full-stack web apps" }, // [LI] headline
    { label: "Open to", value: profile.openTo }, // [SPEC] [LI]
  ],
};

// ─────────────────────────────────────────────────────────────── CH.02 skills
// Sources: [CV] skills table; [LI] skills; [GH] profile README badges + repo READMEs.
/** UI copy for the interactive skills grid.  [DRAFT] */
export const skillsUi = {
  hint: "Hover or tap a skill to see where I've used it. The small number is how many of my projects use it.",
  usedIn: "Used in",
  notInProjects: "Part of my toolkit — not in one of the featured projects yet.",
};

export const skills: { group: SkillGroup; accent: Accent; items: string[] }[] = [
  {
    group: "Machine Learning & AI",
    accent: "teal",
    // [LI] skills list (Machine Learning, Deep Learning, NLP, LLMs, RAG, LangGraph, ChromaDB, AI Agents) + [CV]
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "LLMs",
      "RAG",
      "AI Agents",
      "LangGraph",
      "LangChain",
      "scikit-learn",
      "PyTorch",
      "XGBoost",
      "ChromaDB",
      "sentence-transformers",
      "Llama 3.x (Groq)",
    ],
  },
  {
    group: "Data & Analytics",
    accent: "glow",
    items: ["NumPy", "Pandas", "SMOTE", "librosa", "Matplotlib", "Jupyter", "Tableau"], // [CV] [GH]
  },
  {
    group: "Languages",
    accent: "muted",
    items: ["Python", "JavaScript", "TypeScript", "SQL (MySQL)", "HTML", "CSS"], // [CV] [GH] profile README
  },
  {
    group: "Full-Stack & APIs",
    accent: "amber",
    items: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "FastAPI",
      "REST APIs",
      "JWT auth",
      "Streamlit",
      "Gradio",
      "Prisma",
    ], // [LI] [CV] [GH]
  },
  {
    group: "Tools & Deployment",
    accent: "muted",
    items: ["Git", "GitHub Actions", "pytest", "Vercel", "Render", "nginx", "Wireshark"], // [CV] [GH]
  },
  {
    group: "Spoken Languages",
    accent: "muted",
    items: ["English", "Hindi", "Bengali"], // [CV] [LI]
  },
];

// ─────────────────────────────────────────────────────────────── CH.03 projects
// Every project written up so far. Only the ones pinned on GitHub are shown — see `projects` below.
const allProjects: Project[] = [
  {
    slug: "infant-cry-classifier",
    category: "ai-ml",
    headline: "78.6% test accuracy · 38.1% macro F1 (Random Forest, random split)", // from results below
    title: "Infant State Recognition",
    oneLiner: "Classifies a baby's cry into one of 8 need states from 218 hand-built audio features.", // [GH] [CV]
    tags: "Audio ML · Solo",
    problem:
      "Parents often can't tell why a baby is crying. Given a short cry recording, predict the need behind it: hungry, tired, discomfort, belly pain, burping, scared, lonely or cold/hot.", // [GH]
    approach: [
      "Cleaned 512 labelled clips down to 511: silence trimmed at 30 dB, corrupt / too-short / mostly-silent clips dropped.", // [GH]
      "Turned each clip into a 218-dimensional vector — MFCC + deltas, chroma, 40-band log-mel, spectral contrast, tonnetz and more.", // [GH]
      "Handled a 54:1 class imbalance with a stratified split, train-only scaling and balanced class weights.", // [GH] [CV]
      "Benchmarked a cost-sensitive Random Forest (300 trees) against a PyTorch CNN on log-mel spectrograms with SpecAugment and audio augmentation.", // [GH] [CV]
      "Found and quantified two data leaks with grouped cross-validation; added pytest + GitHub Actions CI and a Gradio demo.", // [CV] [GH]
    ],
    stack: ["Python", "librosa", "scikit-learn", "PyTorch", "Pandas", "Gradio", "pytest", "GitHub Actions"], // [GH]
    results: [
      "Random Forest: 78.6% test accuracy, 38.1% test macro F1 on the same 103 test clips.", // [GH] [CV]
      "CNN: 25.8% macro F1 — it lost on every summary metric; ~400 training clips is too little for a network learning from raw spectrograms.", // [GH] [CV]
      "Grouping folds by recording source drops RF macro F1 to ~0.35 — the more realistic number for new babies.", // [GH] leakage table
    ],
    next: [
      "Make the de-duplicated, source-grouped split the main benchmark.", // [GH]
      "Try pretrained audio embeddings (PANNs CNN14 / YAMNet) with a small classifier.", // [GH]
      "Ship the Gradio demo as a Hugging Face Space.", // [GH]
    ],
    repo: "https://github.com/techatanu/Infant-State-Recognition-System",
    // TODO(atanu): Hugging Face Space URL once deployed (README still has a USERNAME/SPACE_NAME placeholder)
    demoNote: "Gradio demo — Hugging Face Space coming soon",
    image: "/projects/infant-cry-classifier.webp",
    featured: false,
    role: "Solo project.", // [LI] [CV]
  },
  {
    slug: "exam-question-analyser",
    category: "ai-ml",
    headline: "71% macro accuracy (Logistic Regression)", // from results below
    title: "Intelligent Exam Question Analyser",
    oneLiner: "Predicts exam-question difficulty and writes improvement reports with an agentic RAG pipeline.", // [GH] [CV]
    tags: "NLP · Agentic RAG · Team of 4 · Apr 2026", // [CV]
    problem: "Judging how hard an exam question is happens by hand — subjective, slow and impossible to scale.", // [GH]
    approach: [
      "Built the dataset (6,200 rows → 1,996 unique) and TF-IDF features.", // [CV]
      "Handled imbalance with SMOTE applied after the train/test split, to avoid leakage.", // [CV]
      "Built a 3-node LangGraph agent (retrieve → analyse → format) over a ChromaDB knowledge base with MiniLM embeddings.", // [CV] [GH]
      "Llama 3.3 via Groq writes grounded five-section improvement reports; both milestones ship as one Streamlit app.", // [CV] [GH]
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "LangGraph", "ChromaDB", "Groq · Llama 3.3", "Streamlit"], // [GH] [CV]
    results: ["Logistic Regression reached 71% macro accuracy vs XGBoost 54.5% and Random Forest 51.8%."], // [CV] [GH]
    next: [],
    repo: "https://github.com/techatanu/Intelligent-Exam-Question-Level-Analysis",
    live: "https://intelligent-exam-question-level-analysis.streamlit.app/", // [GH]
    image: "/projects/exam-question-analyser.webp",
    featured: true,
    // [GH] team table + [CV]
    role: "Team of 4 (GenAI capstone). I built the dataset, TF-IDF + SMOTE model and tuning, then the LangGraph orchestration and PDF-to-ChromaDB ingestion.",
  },
  {
    slug: "github-portfolio-reviewer",
    category: "ai-ml",
    title: "Student GitHub Reviewer",
    oneLiner: "An AI agent that reviews a student's GitHub portfolio.", // [GH] [CV] [LI]
    tags: "LLM agent · Solo",
    problem: "TODO(atanu): one sentence on the problem — why students need their GitHub reviewed.",
    approach: [
      "LangGraph pipeline driving Llama 3.1 on Groq.", // [GH] [CV]
      "Served through a FastAPI backend on Render.", // [GH] [CV]
      "Streamlit UI on top.", // [GH] [CV]
    ],
    stack: ["Python", "LangGraph", "Groq · Llama 3.1", "FastAPI", "Streamlit", "Render"], // [GH] [CV]
    results: [],
    next: [],
    repo: "https://github.com/techatanu/student-github-reviewer",
    // TODO(atanu): live Render / Streamlit URL if it's still up (repo has no README or homepage set)
    demoNote: "TODO(atanu): demo link",
    image: "/projects/github-portfolio-reviewer.webp",
    featured: false,
    role: "Solo project.", // [LI] [CV]
  },
  {
    slug: "meditrack",
    category: "full-stack",
    title: "MediTrack",
    oneLiner: "A personal health-record manager: upload, organise and share medical reports securely.", // [GH]
    tags: "Full-stack · MERN · Solo",
    problem:
      "Medical reports end up scattered across photos, chats and paper files — hard to find exactly when you need them.", // [GH]
    approach: [
      "React + React Router front end on Vercel; Node/Express REST API on Render; MongoDB Atlas.", // [GH] [CV]
      "JWT auth with role-based access (admin / user) and full CRUD for reports.", // [GH] [CV]
      "Filter by doctor, date or category; search by report name.", // [GH]
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"], // [GH]
    results: [],
    next: [],
    repo: "https://github.com/techatanu/MediTrack",
    live: "https://medi-track-lemon.vercel.app", // [GH]
    image: "/projects/meditrack.webp",
    featured: false,
    role: "Solo project.", // [LI] [CV]
  },
  {
    slug: "cognify",
    category: "ai-ml",
    headline: "Launched on Product Hunt", // from results below
    title: "Cognify",
    oneLiner: "An AI career-guidance agent, co-built at Construct Hackathon and launched on Product Hunt.", // [CV] [LI]
    tags: "AI agent · Hackathon · Dec 2025", // [CV]
    problem: "TODO(atanu): the problem Cognify solves, in one sentence.",
    approach: [
      "Asks the user cognitive questions, then suggests careers, roadmaps and colleges.", // [CV]
      "Built during Construct Hackathon and launched on Product Hunt.", // [CV] [LI]
      "TODO(atanu): the part you personally built.",
    ],
    stack: ["JavaScript", "CSS"], // [GH] fork language stats — TODO(atanu): real stack?
    results: ["Launched on Product Hunt."], // [CV] [LI] — TODO(atanu): Product Hunt URL
    next: [],
    repo: "https://github.com/techatanu/Cognify", // [GH] fork of rashmi06an/Cognify
    live: "https://cognify-eight.vercel.app", // [GH]
    image: "/projects/cognify.webp",
    featured: false,
    role: "Hackathon team project. TODO(atanu): team size + your part.",
  },
  {
    slug: "quickcart",
    category: "full-stack",
    title: "QuickCart",
    oneLiner: "A React e-commerce cart with API-fed products and real-time price updates.", // [LI] [CV] [GH]
    tags: "Front end · React · Solo",
    problem: "Many beginner e-commerce projects get the cart experience wrong; I wanted a clean, intuitive one.", // [GH]
    approach: [
      "Products fetched from a mock API; add to cart with quantity control (1–10).", // [GH]
      "Totals update in real time; simulated checkout flow.", // [GH] [CV]
      "React Router navigation, responsive layout, deployed on Vercel.", // [GH]
    ],
    stack: ["React", "React Router", "JavaScript", "CSS"], // [GH]
    results: [],
    next: [],
    repo: "https://github.com/techatanu/E-Commerce_Capstone_Project_Atanu",
    live: "https://ecommerce-three-delta-47.vercel.app", // [GH]
    image: "/projects/quickcart.webp",
    featured: false,
    role: "Solo project.", // [LI] [CV]
  },
  {
    slug: "private-network-platform",
    category: "systems",
    title: "Private Network Service Platform",
    oneLiner: "Own DNS → nginx HTTPS edge → two load-balanced backends, every hop verified.", // [GH]
    tags: "Computer Networks · Team of 3 · Oct 2026",
    problem:
      "Build a private service on three laptops where the network — not the app — is the project, and prove each step works.", // [GH]
    approach: [
      "Private DNS with dnsmasq resolving app.team1.test and api.team1.test.", // [GH]
      "I ran the edge: nginx reverse proxy with TLS termination and load balancing across two backends.", // [GH] team table (Mac 2)
      "Every step proven with dig, curl -v, Wireshark and browser DevTools, plus five deliberate failure scenarios.", // [GH]
    ],
    stack: ["nginx", "dnsmasq", "TLS", "Python", "Wireshark", "Shell"], // [GH]
    results: [],
    next: [],
    repo: "https://github.com/techatanu/cn-project-team1",
    demoNote: "Runs on a private LAN — evidence and captures are in the repo",
    image: "/projects/private-network-platform.webp",
    featured: false,
    role: "Team of 3 (course project). I owned the nginx edge: reverse proxy, TLS termination and load balancer.", // [GH]
  },
  {
    slug: "sentinel",
    category: "ai-ml",
    title: "Sentinel (contributor)",
    oneLiner: "A local-first AI agent that plans file clean-ups and only acts after you approve.", // [GH] upstream README
    tags: "Open source · Contributor",
    problem: "File cleaners either delete by extension or upload your private files to the cloud.", // [GH]
    approach: [
      "A local LLM proposes a structured clean-up plan; a deterministic safety validator checks it before anything runs.", // [GH]
      "Every action is logged and deletes go to Trash, so it can all be undone.", // [GH]
      "TODO(atanu): what your 3 commits changed.",
    ],
    stack: ["Python", "TypeScript", "Next.js", "Tauri"], // [GH] upstream README + language stats
    results: [],
    next: [],
    repo: "https://github.com/techatanu/Sentinel", // [GH] Atanu's fork (the pinned repo) of Mystic-commits/Sentinel
    live: "https://sentinel-ten-black.vercel.app/", // [GH] homepage on Atanu's fork
    image: "/projects/sentinel.webp",
    featured: false,
    motif: "systems",
    role: "Contributor to Mystic-commits/Sentinel. TODO(atanu): your part.",
  },
  {
    slug: "blinkit-dashboard",
    category: "data",
    title: "Blinkit Outlet Dashboard",
    oneLiner: "Tableau dashboard on Blinkit grocery outlets: sales KPIs, outlet size/type and establishment trends.", // [GH]
    tags: "Data viz · Tableau · Solo",
    problem: "Turn raw outlet data into a view of how Blinkit's network performs and grows.", // [GH]
    approach: [
      "Prepared the dataset in Excel and built a packaged Tableau workbook.", // [GH]
      "Views for overall KPIs, outlet establishment trends and outlet size distribution.", // [GH]
      "Interactive filters for drilling into regions and outlet types.", // [GH]
    ],
    stack: ["Tableau", "Excel"], // [GH]
    results: [],
    next: [],
    repo: "https://github.com/techatanu/Blinkit_Tableau_Dashboard",
    // TODO(atanu): Tableau Public link if published
    demoNote: "TODO(atanu): Tableau Public link — chart exports are in the repo",
    image: "/projects/blinkit-dashboard.webp",
    featured: false,
    role: "Solo project.", // [GH]
  },
  {
    slug: "uber-dashboard",
    category: "data",
    title: "Uber Trip Analytics",
    oneLiner: "Tableau dashboard on Uber trips: demand peaks by hour, revenue by category and high-earning routes.", // [GH]
    tags: "Data viz · Tableau · Solo",
    problem: "Which hours, ride categories and routes actually earn the most?", // [GH]
    approach: [
      "Cleaned the raw trip sheet down to 721 analysed trips.", // [GH]
      "Charts for hourly revenue vs trip volume, revenue by ride category and top routes by revenue.", // [GH]
      "Static PNG exports so the work can be reviewed without Tableau.", // [GH]
    ],
    stack: ["Tableau", "Excel", "Python"], // [GH]
    results: ["Daytime and early evening carry the most trips; the Comfort category leads in both trips and revenue."], // [GH]
    next: [],
    repo: "https://github.com/techatanu/Uber_dashboard",
    // TODO(atanu): Tableau Public link if published
    demoNote: "TODO(atanu): Tableau Public link — chart exports are in the repo",
    image: "/projects/uber-dashboard.webp",
    featured: false,
    role: "Solo project.", // [GH]
  },
  {
    // [GH] repo README + file tree, fetched 2026-11-13: 20 problem folders, all Python.
    slug: "neetcode-submissions",
    category: "dsa",
    headline: "20 problems solved so far, all in Python.",
    title: "NeetCode Solutions",
    oneLiner: "My solutions to NeetCode data-structures and algorithms problems, kept in one public repo.", // [GH]
    tags: "DSA · Python · Solo",
    problem: "TODO(atanu): one line on why you practise DSA here (interview prep, a study plan, a goal).",
    approach: [
      "Every solution I submit on NeetCode.io is synced to this repo automatically.", // [GH] README
      "Organised by topic folder, then problem, with one file per submission.", // [GH] README
      "Covers problems such as two-integer-sum, binary-search, valid-sudoku and invert-a-binary-tree.", // [GH] tree
    ],
    stack: ["Python"], // [GH]
    results: ["20 problems solved so far, all in Python."], // [GH] tree, 2026-11-13
    next: [],
    repo: "https://github.com/techatanu/neetcode-submissions",
    demoNote: "Code only — no live demo",
    image: "/projects/neetcode-submissions.webp",
    featured: false,
    role: "Solo.", // [GH] not a fork
  },
  {
    // [CV] Atanu_Resume2.pdf + [GH] Flight_Delay_Risk README (results/metrics.csv), fetched 2026-11-13.
    slug: "flight-delay-risk",
    category: "ai-ml",
    motif: "data",
    headline: "Rolling Platt scaling cut December calibration error (ECE) from 0.102 to 0.047.", // [CV] [GH]
    title: "Flight Delay Risk Prediction",
    oneLiner:
      "Predicts, the night before, whether a New York departure will arrive 15+ minutes late — then checks which flights a small reschedule would help.", // [GH]
    tags: "Tabular ML · Calibration · Oct 2026", // [CV] date
    problem:
      "Flag the flights likely to arrive 15+ minutes late using only what is known by the end of the previous day: the published schedule and earlier days' outcomes.", // [GH]
    approach: [
      "336,776 New York departures from 2013 (nycflights13); the label is an arrival 15+ minutes late.", // [GH]
      "Past-only features from the schedule and earlier dates, with a leakage test in the feature notebook.", // [GH]
      "Chronological split: train Jan–Sep, validate Oct–Nov, and score December only once.", // [GH]
      "Logistic regression vs XGBoost, tuned and calibrated on validation, plus a rolling Platt recalibration on the previous 28 days.", // [GH] [CV]
      "A what-if analysis of moving high-risk flights by up to ±2 hours.", // [GH]
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "Jupyter"], // [CV]
    results: [
      "Validation PR-AUC: logistic regression 0.297, XGBoost 0.276.", // [CV] [GH]
      "December test PR-AUC 0.468 (XGBoost) against 0.335 for a constant prior.", // [GH]
      "Rolling Platt recalibration brought December ECE from 0.102 to 0.047.", // [CV] [GH]
      "Of 1,979 flights with risk ≥ 0.5, only 133 had a move of up to ±2 h that cut predicted risk by 0.05 or more.", // [GH]
    ],
    next: [],
    repo: "https://github.com/techatanu/Flight_Delay_Risk", // [CV] link
    demoNote: "Notebooks, report and slides are in the repo",
    image: "/projects/flight-delay-risk.webp",
    featured: false,
    // TODO(atanu): solo or team? The README says "we" — say who did what.
    role: "TODO(atanu): solo or team project, and what you built.",
  },
];

/**
 * The repos pinned on github.com/techatanu, in profile order (re-fetched 2026-11-13).
 * The site shows these and nothing else: to change the list, change the pins and update this.
 */
export const pinnedRepos = [
  "Intelligent-Exam-Question-Level-Analysis",
  "Infant-State-Recognition-System",
  "MediTrack",
  "Uber_dashboard",
  "Flight_Delay_Risk",
  "Sentinel",
];

export const projects: Project[] = pinnedRepos.flatMap(
  (name) => allProjects.find((p) => p.repo.endsWith(`/${name}`)) ?? [],
);

/** Case-study pages at /projects/<slug>/.  [DRAFT] UI copy */
export const caseStudy = {
  back: "All projects",
  glance: "At a glance",
  category: "Category",
  categories: {
    "ai-ml": "AI & Machine Learning",
    "full-stack": "Full-stack web",
    data: "Data visualisation",
    dsa: "Data structures & algorithms",
    systems: "Systems & networking",
  } satisfies Record<ProjectCategory, string>,
  prev: "Previous project",
  next: "Next project",
  noMetrics: "No headline metric for this one — see the repo for details.",
  moreProjects: "More projects", // aria-label of the prev/next nav
  filterLabel: "Filter projects by category", // aria-label of the filter chip group
};

// ─────────────────────────────────────────────────────────────── /quick/ — 60-second recruiter view  [DRAFT]
export const quickView = {
  href: "/quick/",
  navLabel: "Quick view",
  heroLink: "60-second view",
  title: "60-second view",
  intro: "Everything you need to evaluate me, on one page.",
  sections: {
    projects: "Key projects",
    skills: "Core skills",
    experience: "Experience & milestones",
    contact: "Contact",
  },
  /** Which projects lead the quick view (editorial choice — Atanu can reorder). */
  topProjects: ["exam-question-analyser", "flight-delay-risk", "infant-cry-classifier"],
  /** Skill groups shown on the quick view (compact). */
  skillGroups: ["Machine Learning & AI", "Data & Analytics", "Languages", "Full-Stack & APIs"] satisfies SkillGroup[],
  print: "Print / save as PDF",
  fullSite: "See the full experience",
  allProjects: "All projects", // count is added by the component
};

// ─────────────────────────────────────────────────────────────── SEO
export const seo = {
  title: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
  description: `${profile.name} — ${profile.role}. I build end-to-end AI/ML projects, from data and models to deployed apps. Open to remote AI/ML internships and full-stack roles.`,
  ogAlt: `${profile.name} — ${profile.role}`,
  /** Share image, generated at build time by src/app/og.png/route.tsx. */
  ogImage: { url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` },
  /** JSON-LD Person.affiliation [CV] [LI] */
  affiliation: "Newton School of Technology, Rishihood University",
};

// ─────────────────────────────────────────────────────────────── CH.04 timeline
export const timeline: TimelineItem[] = [
  {
    date: "Aug 2024",
    title: "Started B.Tech, Computer Science & AI",
    org: "Newton School of Technology · Rishihood University",
    detail: "Four-year programme, Aug 2024 – Aug 2028.", // [LI] [CV]
    kind: "education",
  },
  {
    date: "Nov 2025 — now",
    title: "AI/ML & Full-Stack Developer (project-based)",
    org: "Self-directed · Remote",
    detail: "ML models, LLM apps and AI agents, plus MERN apps deployed end to end.", // [LI] [CV]
    kind: "experience",
  },
  {
    date: "Dec 2025",
    title: "Construct Hackathon — Cognify",
    org: "Construct Hackathon",
    detail: "Co-built an AI career-guidance agent; launched on Product Hunt.", // [CV] [LI]
    kind: "event",
  },
  {
    date: "Apr 2026",
    title: "GenAI capstone — Intelligent Exam Question Analyser",
    org: "Newton School of Technology",
    detail: "Team of 4; difficulty model + agentic RAG pipeline, live on Streamlit.", // [CV] [GH]
    kind: "event",
  },
  {
    date: "TODO(atanu)",
    title: "Acting Executive, DevClub",
    org: "Newton School of Technology × Rishihood University",
    detail: "TODO(atanu): one line on what you do there.", // [LI] [CV] role only
    kind: "experience",
  },
  {
    date: "TODO(atanu)",
    title: "Introduction to Generative AI",
    org: "TODO(atanu): issuer",
    detail: "Certification.", // [LI] [CV]
    kind: "certification",
  },
];

// ─────────────────────────────────────────────────────────────── CH.05 what I'm looking for  [DRAFT — Atanu approves]
export const manifesto: { label: string; text: string }[] = [
  {
    label: "Looking for",
    // [SPEC] [LI] "looking for a remote AI/ML or full-stack internship"
    text: "A remote AI/ML internship where I can contribute to real models, data pipelines and LLM applications from day one. Also open to full-stack roles.",
  },
  {
    label: "What I bring",
    // [CV] end-to-end projects: data cleaning, features, evaluation, deployment (Streamlit, Render, Vercel)
    text: "End-to-end ownership: data cleaning, feature engineering, model training and evaluation, then shipping it as a working app or API.",
  },
  {
    label: "How I work",
    // [GH] Infant classifier leakage check + [CV] "Reports honest, reproducible metrics"
    text: "Honest, reproducible results. I check for data leakage, compare against baselines and document what didn't work.",
  },
  {
    label: "Next I want to learn",
    // [GH] Infant README next steps (pretrained audio models) — framed as a goal, not a claim
    text: "Pretrained models and transfer learning for small datasets, and building reliable LLM agents for production.",
  },
];

// ─────────────────────────────────────────────────────────────── CH.06 contact  [DRAFT]
// Layout: Figma "Transmission (Minimal Centred)" — chosen at checkpoint 1.
export const contact = {
  heading: "Let's work together.",
  body: "Hiring for an AI/ML or full-stack internship? I'd love to hear from you.",
  emailLabel: "Email",
  copyLabel: "Copy email",
  copiedLabel: "Copied ✓",
  links: [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Résumé (PDF)", href: profile.resumeUrl },
  ],
  // The Figma cards had invented stats (availability dates, response times); these are sourced facts.
  signals: [
    { label: "Availability", value: "Remote AI/ML internships", detail: "Also open to full-stack roles." }, // [SPEC] [LI] [CV]
    {
      label: "Focus",
      value: "ML models · LLM agents · Full-stack",
      detail: "Python, scikit-learn, PyTorch, LangGraph, React.", // [LI] [CV]
    },
    { label: "Based in", value: "Sonipat, Haryana", detail: "Rishihood University · IST (UTC+5:30)" }, // [SPEC] [CV]
  ],
  footerLabel: "Based at",
};

// ─────────────────────────────────────────────────────────────── boot loader
export const boot = {
  line: "INITIALIZING SIGNAL…",
  name: profile.name,
};
