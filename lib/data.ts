export type Course = {
  slug: string;
  code: string;
  image: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  shortName: string;
  short: string;
  summary: string;
  outcomes: string[];
  syllabus: { module: string; detail: string }[];
  roles: string[];
  tools: string[];
};

export const courses: Course[] = [
  {
    slug: "certificate-generative-ai-applied-ai-tools",
    code: "FX-L1",
    image: "/images/courses/genai.jpg",
    shortName: "Generative AI & Applied Tools",
    level: 1,
    title: "Certificate in Generative AI & Applied AI Tools",
    short: "Foundations of generative AI and the applied tool stack, from first prompt to first shipped workflow.",
    summary:
      "The launchpad. Learn how large language models actually work, master prompt engineering, and put modern AI tools to work on real tasks: documents, images, data, and everyday automation.",
    outcomes: [
      "Understand how LLMs, diffusion models, and multimodal AI work under the hood",
      "Write structured, reliable prompts for text, image, and data tasks",
      "Automate real workflows with applied AI tools",
      "Build and present a personal AI-powered capstone project",
    ],
    syllabus: [
      { module: "AI Foundations", detail: "How models learn: tokens, training, inference, and the modern AI landscape" },
      { module: "Prompt Engineering", detail: "Structured prompting, few-shot patterns, and evaluation of outputs" },
      { module: "Applied AI Tools", detail: "Hands-on labs across writing, image, audio, data, and productivity tools" },
      { module: "Responsible AI", detail: "Hallucinations, bias, privacy, and verifying AI output" },
      { module: "Capstone", detail: "Design and ship an AI-assisted project end to end" },
    ],
    roles: ["AI-Ready Professional", "Prompt Specialist", "AI Productivity Lead"],
    tools: ["ChatGPT", "Claude", "Gemini", "Midjourney", "Notebook LM"],
  },
  {
    slug: "advanced-certificate-generative-ai-pipelines-rag",
    code: "FX-L2",
    image: "/images/courses/rag.jpg",
    shortName: "GenAI Pipelines & RAG",
    level: 2,
    title: "Advanced Certificate in Generative AI Pipelines & RAG Systems",
    short: "Build retrieval-augmented systems that ground AI in your own data: pipelines, embeddings, and evaluation.",
    summary:
      "Move from using AI to building with it. Work with APIs, embeddings, and vector databases to build retrieval-augmented generation systems that answer from real documents, reliably and measurably.",
    outcomes: [
      "Call and orchestrate LLM APIs in Python",
      "Design embedding + vector-store retrieval over private data",
      "Build production-shaped RAG pipelines with chunking and reranking",
      "Evaluate and improve answer quality systematically",
    ],
    syllabus: [
      { module: "Python for AI", detail: "The working toolkit: APIs, JSON, notebooks, and environments" },
      { module: "Embeddings & Vector Search", detail: "Semantic similarity, chunking strategies, and vector databases" },
      { module: "RAG Architecture", detail: "Retrieval pipelines, context assembly, citations, and guardrails" },
      { module: "Evaluation", detail: "Measuring faithfulness, relevance, and regression testing pipelines" },
      { module: "Capstone", detail: "A domain Q&A system grounded in a real document corpus" },
    ],
    roles: ["AI Application Developer", "RAG Engineer", "Data & AI Analyst"],
    tools: ["Python", "LangChain", "Chroma", "Pinecone", "OpenAI / Claude APIs"],
  },
  {
    slug: "professional-certificate-ai-agents-automation-deployment",
    code: "FX-L3",
    image: "/images/courses/agents.jpg",
    shortName: "AI Agents & Deployment",
    level: 3,
    title: "Professional Certificate in AI Agents, Automation & Deployment",
    short: "Design autonomous agents with tools and memory, then deploy them as real products.",
    summary:
      "The frontier skill set. Build AI agents that plan, use tools, and act across systems, then containerize, deploy, and monitor them like the production software they are.",
    outcomes: [
      "Architect single- and multi-agent systems with tool use and memory",
      "Automate multi-step business workflows end to end",
      "Deploy agents behind APIs with authentication and rate limits",
      "Monitor, log, and continuously improve deployed agents",
    ],
    syllabus: [
      { module: "Agent Architectures", detail: "Planning loops, tool use, memory, and multi-agent orchestration" },
      { module: "Workflow Automation", detail: "Connecting agents to email, sheets, CRMs, and internal APIs" },
      { module: "Backend & APIs", detail: "FastAPI services, webhooks, and secure integrations" },
      { module: "Deployment", detail: "Docker, cloud hosting, CI, and cost control" },
      { module: "Observability", detail: "Tracing, evals in production, and failure recovery" },
      { module: "Capstone", detail: "A deployed agent product with a live demo" },
    ],
    roles: ["AI Agent Engineer", "Automation Architect", "AI Product Engineer"],
    tools: ["LangGraph", "CrewAI", "FastAPI", "Docker", "MCP"],
  },
  {
    slug: "professional-certificate-foundation-models-fmops",
    code: "FX-L4A",
    image: "/images/courses/fmops.jpg",
    shortName: "Foundation Models & FMOps",
    level: 4,
    title: "Professional Certificate in Generative AI, Foundation Models & FMOps",
    short: "Fine-tuning, serving, and operating foundation models: the MLOps of the generative era.",
    summary:
      "Go beneath the API. Fine-tune open models, serve them efficiently, and run the operational discipline (FMOps) that keeps foundation-model systems fast, safe, and affordable at scale.",
    outcomes: [
      "Fine-tune open-weight models with LoRA and QLoRA",
      "Serve models efficiently with quantization and batching",
      "Design FMOps pipelines: versioning, evals, rollout, rollback",
      "Optimize cost and latency for production model serving",
    ],
    syllabus: [
      { module: "Foundation Models", detail: "Architectures, scaling laws, and the open-weights ecosystem" },
      { module: "Fine-Tuning", detail: "LoRA/QLoRA, dataset curation, and instruction tuning" },
      { module: "Serving & Inference", detail: "Quantization, vLLM, GPUs, and latency engineering" },
      { module: "FMOps", detail: "Model registries, eval gates, monitoring, and safe rollout" },
      { module: "Capstone", detail: "A fine-tuned, served, monitored model for a real use case" },
    ],
    roles: ["ML Engineer (GenAI)", "FMOps Engineer", "AI Infrastructure Engineer"],
    tools: ["PyTorch", "Hugging Face", "vLLM", "Weights & Biases", "LoRA"],
  },
  {
    slug: "certification-aws-generative-ai-practitioner",
    code: "FX-L4B",
    image: "/images/courses/aws.jpg",
    shortName: "AWS Generative AI",
    level: 4,
    title: "Certification Program in AWS Generative AI & AI Practitioner Readiness",
    short: "Cloud-scale generative AI on AWS, aligned to the AWS AI Practitioner certification path.",
    summary:
      "Take your AI skills to the cloud that runs enterprise. Build with Amazon Bedrock and SageMaker, architect secure GenAI solutions on AWS, and prepare for the AWS Certified AI Practitioner exam.",
    outcomes: [
      "Build generative AI applications with Amazon Bedrock",
      "Train and deploy models with SageMaker",
      "Architect secure, cost-aware GenAI solutions on AWS",
      "Prepare for the AWS Certified AI Practitioner exam",
    ],
    syllabus: [
      { module: "AWS AI Landscape", detail: "Bedrock, SageMaker, Q, and the AWS AI service map" },
      { module: "Building on Bedrock", detail: "Model access, knowledge bases, agents, and guardrails" },
      { module: "SageMaker Workflows", detail: "Training, tuning, and deploying custom models" },
      { module: "Cloud Architecture", detail: "Security, IAM, networking, and cost optimization for AI workloads" },
      { module: "Exam Readiness", detail: "AWS AI Practitioner domains, practice tests, and strategy" },
    ],
    roles: ["Cloud AI Engineer", "AWS AI Practitioner", "Solutions Architect (AI)"],
    tools: ["Amazon Bedrock", "SageMaker", "AWS Lambda", "IAM", "CloudWatch"],
  },
];

export const services = [
  {
    title: "AI Training & Certification",
    body: "Industry-relevant AI skills through structured learning programs, hands-on labs, and globally recognized certifications: a four-level ladder from first prompt to production.",
    mono: "04 LEVELS · 05 PROGRAMS",
  },
  {
    title: "Generative AI Solutions",
    body: "Learn to build intelligent applications on modern AI models and frameworks: RAG systems, agents, and deployed products, not just theory.",
    mono: "RAG · AGENTS · FMOPS",
  },
  {
    title: "Research & Innovation",
    body: "Explore emerging AI technologies and join cutting-edge innovation projects alongside mentors, from vision AI to autonomous agents.",
    mono: "VISION · LLM · AGENTS",
  },
];

export const careerTracks = [
  {
    title: "AI & Data Roles",
    body: "Data analyst, AI application developer, machine-learning engineer: the core technical pathway.",
    examples: ["Data Analyst", "AI Developer", "ML Engineer"],
  },
  {
    title: "Industry-Specific AI Applications",
    body: "Apply AI inside healthcare, finance, education, retail, and manufacturing. Domain plus AI is the multiplier.",
    examples: ["HealthTech AI", "FinTech AI", "EdTech AI"],
  },
  {
    title: "Generative AI & Advanced Roles",
    body: "Prompt engineering, RAG systems, fine-tuning, and FMOps: the roles born in the last three years.",
    examples: ["Prompt Engineer", "RAG Engineer", "FMOps Engineer"],
  },
  {
    title: "Hybrid & Emerging Roles",
    body: "AI product management, AI-augmented design, automation consulting: where AI meets every other craft.",
    examples: ["AI Product Manager", "Automation Consultant", "AI Trainer"],
  },
];

export type Article = {
  slug: string;
  title: string;
  date: string;
  readMinutes: number;
  tag: string;
  excerpt: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "why-every-student-needs-ai-literacy-in-2026",
    title: "Why Every Student Needs AI Literacy in 2026",
    date: "2026-07-14",
    readMinutes: 6,
    tag: "AI Literacy",
    excerpt:
      "CBSE has made computational thinking and AI part of the mandate. Here is what AI literacy actually means, and why it is closer to reading than to coding.",
    body: [
      "When CBSE issued Circular Acad-15/2026, it confirmed what educators worldwide had been converging on: artificial intelligence is no longer an elective topic for a handful of enthusiasts. It is foundational literacy, in the same category as reading, writing, and arithmetic.",
      "AI literacy is not the same as learning to code. It is the ability to work with intelligent systems critically: to know when a model is likely to be wrong, to recognize bias in outputs, to write instructions that get reliable results, and to understand, at an intuitive level, how these systems learn.",
      "The students who develop this literacy early gain a compounding advantage. They learn faster because they can use AI as a tutor rather than an answer machine. They reason better because they have practiced questioning a confident-sounding system. And they enter the workforce fluent in the tools every industry now runs on.",
      "This is the thinking behind our approach at FutureX AI Lab, and behind VibeKids for grades 3–12: teach the reasoning first, the tools second, and never let the machine do the thinking for the learner.",
    ],
  },
  {
    slug: "from-prompts-to-production-the-new-ai-career-ladder",
    title: "From Prompts to Production: The New AI Career Ladder",
    date: "2026-06-30",
    readMinutes: 8,
    tag: "Careers",
    excerpt:
      "Prompt engineer, RAG engineer, agent engineer, FMOps engineer: the generative-AI era has minted an entirely new career ladder. Here's how the rungs connect.",
    body: [
      "Three years ago, none of these job titles existed at scale: RAG engineer, AI agent engineer, FMOps engineer. Today they appear in thousands of listings, and the ladder between them has become surprisingly well defined.",
      "The first rung is applied fluency: using AI tools expertly and prompting with structure. This alone changes a professional's output, and it is where every learner should start regardless of background.",
      "The second rung is building with AI: calling models through APIs, grounding them in private data with retrieval-augmented generation, and evaluating quality. This is where 'AI user' becomes 'AI developer'.",
      "The third rung is autonomy and deployment: agents that plan and act across systems, shipped behind real APIs with monitoring. The fourth is the deepest layer: fine-tuning and operating foundation models themselves, plus the cloud architecture skills to run them at enterprise scale.",
      "Our four-level certification path mirrors this ladder deliberately. Each level maps to roles that exist in the market right now, because a curriculum should climb the same way a career does.",
    ],
  },
  {
    slug: "what-is-rag-and-why-it-powers-modern-ai-products",
    title: "What Is RAG, and Why It Powers Most Serious AI Products",
    date: "2026-06-12",
    readMinutes: 7,
    tag: "Technology",
    excerpt:
      "Retrieval-augmented generation is the architecture behind almost every AI product that answers from real documents. A plain-language tour of how it works.",
    body: [
      "Ask a raw language model about your company's leave policy and it will guess: fluently, confidently, and often wrongly. Ask a RAG system, and it first retrieves the actual policy document, then answers from what it found, with citations.",
      "That is the whole idea of retrieval-augmented generation: give the model the right context at the right moment, instead of hoping it memorized your world during training.",
      "Under the hood, a RAG pipeline breaks documents into chunks, converts each chunk into an embedding (a numerical fingerprint of its meaning) and stores those in a vector database. When a question arrives, the system finds the chunks whose meaning is closest, assembles them into context, and lets the model answer grounded in evidence.",
      "The engineering craft lies in the details: how you chunk, how you rank, how you detect when the answer isn't in the documents at all. That craft is exactly what our Level 2 program teaches, because in production AI, retrieval quality is answer quality.",
    ],
  },
  {
    slug: "socratic-ai-how-vibey-teaches-without-giving-answers",
    title: "Socratic AI: How Vibey Teaches Without Giving Answers",
    date: "2026-05-28",
    readMinutes: 5,
    tag: "VibeKids",
    excerpt:
      "Most AI tutors hand students the answer. Vibey, the engine inside VibeKids, is built to refuse, and that refusal is where the learning happens.",
    body: [
      "There is a quiet crisis in AI-assisted homework: students paste the question, copy the answer, and learn nothing. The tool that was supposed to accelerate learning short-circuits it instead.",
      "Vibey, the Socratic AI engine inside VibeKids, is designed around a single constraint: it does not give direct answers. It asks the next-smallest question instead: the one that lets the student take the step themselves.",
      "Behind that conversation, the system runs real-time cognitive mapping. It watches how a learner reasons, spots the missing foundational concept that is actually blocking them (often from an earlier grade) and routes practice there before returning to today's problem.",
      "The result reaches teachers and parents as something more useful than a score: a map of how each child thinks, where they are strong, and precisely which gap to close next. That is what AI in education should do: not answer for the child, but teach the child to answer.",
    ],
  },
];

export const socials = {
  facebook: "https://www.facebook.com/FutureXAI",
  instagram: "https://www.instagram.com/futurexailab",
  linkedin: "https://www.linkedin.com/showcase/gtec-futurex",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/vibekids", label: "VibeKids" },
  { href: "/skill-check", label: "Skill Check" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
