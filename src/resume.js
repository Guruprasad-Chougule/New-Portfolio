// ════════════════════════════════════════════════════════════════════════════
//  RESUME.JS — Single source of truth for the entire portfolio
//
//  This file is imported by BOTH the React UI and the chatbot API.
//  Update this file → the website updates AND the chatbot updates.
//  No code changes needed. Commit & push → Vercel redeploys → done.
// ════════════════════════════════════════════════════════════════════════════

export const CONTACT = {
  name: "Guruprasad Chougule",
  title: "Quality Assurance, Test Automation & CSV Engineer",
  tagline: "GxP CSV Validation Engineer · 3 Years · Life Sciences IT",
  email: "guruprasadyc20@gmail.com",
  phone: "+91 8217703368",
  phoneRaw: "+918217703368",
  linkedin: "https://linkedin.com/in/guruprasadchougule",
  github: "https://github.com/Guruprasad-Chougule",
  portfolio: "https://guruprasadchougule.vercel.app",
  // RESUME WORKFLOW (zero-friction updates):
  // 1. Upload latest resume.pdf to Google Drive (replace the existing file to keep same ID)
  // 2. Share → "Anyone with the link" → Viewer
  // 3. Copy the file ID from the share URL (the long string between /d/ and /view)
  // 4. Paste it below — no GitHub commit needed for future updates, just replace the Drive file!
  resume: "https://drive.google.com/file/d/1ygAcwC7dld6zppzeHq3j5-gHDRbOY7eI/view",
  location: "Bangalore, India",
  status: "Open to opportunities",
};

export const SUMMARY = `Quality Assurance and Test Automation Engineer with 3 years of hands-on experience delivering software testing for Life Sciences ERP, Microsoft Power Apps, and Web platforms. Proficient in Selenium WebDriver, Core Java, TestNG, Maven, SQL, and REST API testing with Postman across Functional, Regression, SIT, UAT, and Smoke cycles. Specialized expertise in compliance-driven testing such as 21 CFR Part 11, GAMP 5, ALCOA Plus, and the qualification lifecycle including Installation, Operational, and Performance Qualification, Requirements Traceability, and Validation Summary Reports. Currently serving as Primary QA Owner on the Olympus Global Ship Hold Center program, where I have authored 400+ test scripts and achieved 100% on-time Go-Live over four major releases with zero release slippage. Strong in JIRA defect handling, Risk-Based Methodology, Root Cause Analysis, and cross-functional collaboration with global teams. Seeking QA Engineer, Senior QA Engineer, QA Lead, Test Automation Engineer, and Senior Validation Engineer roles across regulated and product-driven organizations including Pharma, Healthcare, Finance, and Insurance domains.`;

export const STATS = [
  { val: "3+", label: "Years Experience" },
  { val: "400+", label: "Test Scripts Authored" },
  { val: "100%", label: "On-Time Go-Live" },
  { val: "60%", label: "Manual Effort Reduction" },
  { val: "15+", label: "Compliance Gaps Closed" },
  { val: "5", label: "Global Regions Supported" },
];

export const SKILLS = {
  "Automation & Programming": [
    { name: "Selenium WebDriver", level: 5, years: "3 yrs", desc: "Built TestNG + Maven automation suites for regression cycles. Reduced manual testing effort by ~60% over 4 major release cycles." },
    { name: "Core Java", level: 5, years: "3 yrs", desc: "Primary language for Selenium automation frameworks. OOP design patterns, exception handling, and data-driven test architectures." },
    { name: "Python", level: 4, years: "2 yrs", desc: "Used for API automation and data validation scripts. Currently upskilling toward Pytest framework in my AI-augmented QA roadmap." },
    { name: "TestNG", level: 5, years: "3 yrs", desc: "Annotation-driven test orchestration: parallel execution, data providers, listeners, and HTML reporting for regression suites." },
    { name: "Maven", level: 4, years: "3 yrs", desc: "Build automation and dependency management for Java test projects. POM configuration and surefire reporting integration." },
    { name: "Pytest", level: 3, years: "Learning", desc: "Currently learning as part of Phase 1 of my AI-Augmented QA roadmap. Fixtures, parametrization, and modern Python testing patterns." },
    { name: "SQL", level: 4, years: "3 yrs", desc: "Database verification for ERP and Power Apps workflows. Complex joins, stored procedure validation, and data migration QA." },
    { name: "REST API Testing", level: 5, years: "3 yrs", desc: "Validated backend service integrations, JSON payloads, and authentication flows for shipment and CAPA workflows." },
    { name: "Postman", level: 5, years: "3 yrs", desc: "API request building, environment management, collection runs, and Newman CI integration for automated API regression." },
  ],
  "Testing Types": [
    { name: "Manual Testing", level: 5, years: "3 yrs", desc: "Exploratory and scripted testing across Web, ERP, and Power Apps. Authored 400+ test scripts with 100% traceability in JIRA." },
    { name: "Automation Testing", level: 5, years: "3 yrs", desc: "Selenium + TestNG automation framework design. Page Object Model, data-driven tests, and CI/CD integration." },
    { name: "Functional", level: 5, years: "3 yrs", desc: "End-to-end functional verification against User Requirement Specifications across 4 major releases of the Global Ship Hold Center." },
    { name: "Regression", level: 5, years: "3 yrs", desc: "Sanity and regression cycles after every production deployment, preventing post-release defects and sustaining a clean release history." },
    { name: "Smoke", level: 5, years: "3 yrs", desc: "Quick health-check suite to verify critical paths after each build deployment before deeper testing begins." },
    { name: "Sanity", level: 5, years: "3 yrs", desc: "Focused validation on specific functionality after a fix to confirm the change works and didn't break anything else." },
    { name: "SIT", level: 5, years: "3 yrs", desc: "System Integration Testing across Power Apps, ERP layers, and external services. Validated data flow and contract compliance." },
    { name: "UAT", level: 4, years: "3 yrs", desc: "Coordinated User Acceptance Testing with global business stakeholders in Americas, APAC, and EMEA." },
    { name: "Test Case Design", level: 5, years: "3 yrs", desc: "BTM-based scenarios with full Requirements Traceability Matrix coverage. Risk-based prioritization for GxP-governed projects." },
    { name: "Defect Management", level: 5, years: "3 yrs", desc: "Full defect lifecycle in JIRA — logging, prioritization, RCA collaboration with devs, and post-fix verification." },
  ],
  "Platforms & Applications": [
    { name: "Microsoft Power Apps", level: 5, years: "3 yrs", desc: "Primary platform for Olympus account — Global Ship Hold Center, FCAT, NCR/CAPA workflows all built and validated on Power Apps." },
    { name: "PeopleSoft HCM", level: 3, years: "1 yr", desc: "Human Capital Management module testing — payroll, benefits, and employee data workflows." },
    { name: "Hexagon EAM", level: 4, years: "1 yr", desc: "Operational Qualification testing across multiple Enterprise Asset Management modules with 100% data integrity validation." },
    { name: "Microsoft Power BI", level: 3, years: "2 yrs", desc: "Dashboard validation, data source verification, and visualization accuracy for compliance reporting." },
    { name: "Web Applications", level: 5, years: "3 yrs", desc: "Cross-browser testing on Chrome, Firefox, Edge. Responsive design verification and accessibility checks." },
    { name: "ERP Systems", level: 4, years: "3 yrs", desc: "Enterprise Resource Planning workflow validation — order-to-cash, shipment holds, change control, and master data." },
    { name: "Agile PLM", level: 3, years: "2 yrs", desc: "Product Lifecycle Management — change requests, BOM validation, and document control workflows for regulated industries." },
  ],
  "Compliance & Validation": [
    { name: "21 CFR Part 11", level: 5, years: "3 yrs", desc: "FDA regulation for electronic records and signatures. Closed 15+ compliance gaps across pharmaceutical Power Apps platforms." },
    { name: "GAMP 5", level: 5, years: "3 yrs", desc: "Good Automated Manufacturing Practice — risk-based validation approach used across all GxP-governed Olympus projects." },
    { name: "ALCOA Plus", level: 5, years: "3 yrs", desc: "Data Integrity principles: Attributable, Legible, Contemporaneous, Original, Accurate — plus Complete, Consistent, Enduring, Available." },
    { name: "EU Annex 11", level: 4, years: "2 yrs", desc: "European regulation for computerised systems in GxP environments. Risk management and supplier qualification expertise." },
    { name: "Computer System Validation", level: 5, years: "3 yrs", desc: "Owned end-to-end CSV deliverables for 5 GxP-governed projects across four major releases with zero compliance escalations." },
    { name: "IQ / OQ / PQ", level: 5, years: "3 yrs", desc: "Installation, Operational, and Performance Qualification — full qualification lifecycle for FDA-regulated enterprise systems." },
    { name: "CAPA", level: 5, years: "3 yrs", desc: "Corrective and Preventive Action workflow validation. Validated CAPA 2.0 enhancements with zero impact on legacy process flows." },
    { name: "NCR", level: 5, years: "3 yrs", desc: "Non-Conformance Report remediation. Closed 15+ compliance gaps aligned to GxP and ALCOA Plus principles." },
    { name: "Audit Readiness", level: 5, years: "3 yrs", desc: "Ensured 100% audit readiness for JIRA workflows, qualification artifacts, and project deliverables across multiple FDA-style reviews." },
    { name: "Validation Summary Report", level: 5, years: "3 yrs", desc: "Drafted Test Summary Reports and Validation Summary Reports for every SDLC phase across 4 major releases." },
  ],
  "Tools": [
    { name: "JIRA", level: 5, years: "3 yrs", desc: "Primary test management tool — test execution, defect tracking, traceability matrix, and Agile sprint workflows." },
    { name: "Microsoft Office Suite", level: 5, years: "5+ yrs", desc: "Excel for test data, Word for protocols and reports, PowerPoint for status decks to global stakeholders." },
    { name: "Microsoft Copilot", level: 4, years: "1 yr", desc: "AI-augmented test case generation, documentation drafting, and prompt engineering for productivity gains." },
    { name: "Git", level: 4, years: "3 yrs", desc: "Version control for test scripts and frameworks. Branching strategies, merge conflict resolution, code reviews." },
    { name: "GitHub", level: 4, years: "3 yrs", desc: "Repository management for automation projects. Issues, pull requests, and Actions for CI/CD." },
    { name: "E-Signature Platforms", level: 4, years: "2 yrs", desc: "Validated electronic signature integration under 21 CFR Part 11. Resolved P1 e-sig defects through structured RCA." },
  ],
  "Methodologies": [
    { name: "Agile Scrum", level: 5, years: "3 yrs", desc: "Daily standups, sprint planning, retros. Partnered with global stakeholders in Americas, APAC, and EMEA under Agile delivery cadence." },
    { name: "Waterfall", level: 4, years: "2 yrs", desc: "Sequential SDLC for regulated environments where traceability and gated phases matter more than iteration speed." },
    { name: "V-Model", level: 4, years: "2 yrs", desc: "Validation lifecycle that maps each development phase to a testing phase — ideal for GxP-regulated medical device software." },
    { name: "STLC", level: 5, years: "3 yrs", desc: "Software Testing Life Cycle — requirements analysis, test planning, design, execution, closure. Full ownership across releases." },
    { name: "SDLC", level: 5, years: "3 yrs", desc: "Drafted Test Summary Reports for every SDLC phase. Embedded QA participation from requirements through production." },
    { name: "Risk-Based Testing", level: 5, years: "3 yrs", desc: "Prioritized test coverage based on impact and likelihood. Risk-based scenarios across all 4 major releases." },
    { name: "BTM-based Test Design", level: 5, years: "3 yrs", desc: "Business Test Matrix approach — derives test scenarios from business workflows, ensuring full functional coverage." },
  ],
};

export const EXPERIENCE = [
  {
    role: "Product Test Specialist",
    company: "Cognizant Technology Solutions",
    client: "Olympus · Life Sciences",
    period: "June 2023 — Present",
    location: "Bangalore, India",
    grade: "Service Line: Quality Engineering & Assurance · Sub-Track: Product Testing · Grade A",
    points: [
      "Owned end-to-end QA and CSV deliverables for 5 GxP-governed projects across four major releases (v1.0 through v4.0), achieving 100% on-time Go-Live with zero compliance escalations.",
      "Authored and ran 400+ test scripts covering Functional, Regression, SIT, UAT, OQ, and Risk-Based scenarios on Power Apps, ERP, and Web layers while sustaining 100% traceability in JIRA.",
      "Designed Selenium WebDriver + TestNG automation suites for regression cycles, reducing manual testing effort by ~60% over 4 major release cycles.",
      "Executed REST API testing with Postman to validate backend service integrations, JSON response payloads, and authentication flows for shipment and CAPA workflows.",
      "Remediated NCRs and closed 15+ compliance gaps aligned to 21 CFR Part 11, GAMP 5, and ALCOA Plus principles.",
      "Resolved P1 production defects involving electronic signature integration and workflow failures through structured RCA, enabling Go-Live within 1-2 days and preventing release slippage.",
      "Led KT sessions on data migration practices and partnered with global stakeholders in Americas, APAC, and EMEA under Agile delivery cadence.",
    ],
  },
];

export const PROJECTS = [
  { title: "Global Ship Hold Center", tag: "Power Apps · JIRA · Selenium · 21 CFR Part 11",
    period: "Mar 2024 — Present", role: "Primary QA Owner",
    achievement: "100% on-time Go-Live across 4 releases (v1.0–v4.0)",
    color: "#7af0c8", icon: "⚓",
    desc: "Microsoft Power Apps platform managing shipment holds for medical devices across global regions, validated under 21 CFR Part 11 and GAMP 5 standards. Drove regulatory adherence and NCR remediation with 100% audit readiness across JIRA workflows and qualification artifacts." },
  { title: "Field Corrective Action Tracker (FCAT)", tag: "Power Apps · JIRA · CAPA · NCR",
    period: "Apr 2025 — May 2025", role: "QA Engineer",
    achievement: "Validated across 5 global regions",
    color: "#8b7fe5", icon: "🛡️",
    desc: "Power Apps tool for monitoring Field Corrective Actions and Non-Conformance workflows across Americas, APAC, EMEA, China, and Japan. Built end-to-end test scripts and managed full defect lifecycle in JIRA." },
  { title: "Agile NCR & CAPA 2.0 Enhancement", tag: "JIRA · Agile · Regression Testing",
    period: "Aug 2024 — Mar 2025", role: "QA Engineer",
    achievement: "Zero impact on legacy process flows",
    color: "#d4af37", icon: "⚙️",
    desc: "Validated CAPA 2.0 enhancements covering new fields, workflows, and role configurations — ensuring zero impact on legacy process flows. Delivered functional and regression coverage for the complete NCR and CAPA journey." },
  { title: "Hexagon EAM Data Migration", tag: "JIRA · OQ · SQL · Data Migration",
    period: "Mar 2025 — Apr 2025", role: "QA Engineer",
    achievement: "100% data integrity validation",
    color: "#f06b8b", icon: "🗄️",
    desc: "Operational Qualification testing across multiple Enterprise Asset Management modules to verify system functionality against regulatory expectations." },
  { title: "JIRA Platform Enhancement", tag: "JIRA · Workflow Configuration · Test Management",
    period: "Mar 2025 — Apr 2025", role: "QA Engineer",
    achievement: "Formal qualification cycle delivered",
    color: "#5ec8ff", icon: "🔧",
    desc: "Custom field configurations and workflow updates qualified through formal qualification cycles, ensuring traceability across change control." },
];

export const CERTIFICATIONS = [
  { name: "Microsoft Azure Fundamentals AZ-900", issuer: "Microsoft", year: "2023", note: "Cloud Concepts & Services", icon: "☁️" },
  { name: "Google Cloud Digital Leader", issuer: "Google Cloud", year: "2023", note: "Digital Transformation Strategy", icon: "🌐" },
  { name: "Oracle AI Foundations Associate", issuer: "Oracle", year: "2023", note: "Ranked Top 150 of 3000+ participants", icon: "🧠" },
  { name: "OSP Product Testing with Selenium", issuer: "Cognizant", year: "2023", note: "Product-level automation training", icon: "🧪" },
  { name: "Selenium WebDriver with Java", issuer: "Online Learning", year: "2023", note: "Basic, Advanced & Framework training", icon: "⚡" },
];

export const LEARNING = [
  { phase: "Phase 1", item: "Python + Pytest", status: "Active" },
  { phase: "Phase 2", item: "Playwright Automation", status: "Next" },
  { phase: "Phase 2", item: "ISTQB AI Testing Certification", status: "Next" },
  { phase: "Phase 3", item: "LangChain + OpenAI API for Test Generation", status: "Planned" },
  { phase: "Phase 4", item: "AWS Cloud Practitioner", status: "Planned" },
];

export const AWARDS = [
  { title: "Top Performer", event: "Cognizant Hackathon 2023", note: "Recognized for Selenium, Java, and SQL automation solutions", icon: "🏆" },
  { title: "Best Project of the Year", event: "College Project Exhibition 2022", note: "Innovative IoT-based Smart Agriculture System", icon: "🌾" },
];

export const EDUCATION = {
  degree: "Bachelor of Engineering — Mechanical Engineering",
  school: "BLDEA V. P. Dr. P. G. Halakatti College of Engineering and Technology, Vijayapura",
  affiliation: "Affiliated to Visvesvaraya Technological University (VTU)",
  year: "Graduated 2022",
  cgpa: "CGPA: 7.54 / 10",
};

export const BLOG_POSTS = [
  { id: 1, tag: "GxP · CSV", date: "Mar 2024", readTime: "6 min read", icon: "🔬", color: "#7af0c8",
    title: "How I Caught a Critical IQ Protocol Gap Before FDA Audit",
    problem: "During a pre-audit review of a Power Apps Global Ship Hold system, I discovered that the Installation Qualification protocol had been executed against a staging environment — not production. This meant the entire IQ evidence package was invalid under 21 CFR Part 11.",
    root: "The root cause was a missing environment tag in the test execution checklist. The team assumed 'current system' referred to production, but the Selenium scripts were pointing to a staging URL hardcoded months earlier.",
    fix: "I introduced an environment-assertion step at the very top of every automation script — it reads the active system URL, validates it against a config-driven allowlist, and fails loudly with a blocking error if there's a mismatch. The client passed their audit with zero observations related to CSV.",
    tags: ["21 CFR Part 11", "IQ/OQ/PQ", "GxP", "Selenium"] },
  { id: 2, tag: "Automation · Stability", date: "Jan 2024", readTime: "5 min read", icon: "⚡", color: "#8b7fe5",
    title: "Killing Flaky Tests in a Legacy Selenium Suite",
    problem: "A regression suite had a 35% flakiness rate — tests were randomly failing on CI but passing locally. The team had lost trust in the suite and was manually re-running pipelines 3-4 times per deployment.",
    root: "Three compounding issues: implicit waits mixed with explicit waits, tests sharing mutable global state through static session objects, and hardcoded pixel-based locators breaking when the UI was responsive.",
    fix: "I replaced all implicit waits with a custom ExpectedConditions wrapper using exponential backoff. Shared state was eliminated via a ThreadLocal WebDriver factory. Locators migrated to data-testid attributes. Flakiness dropped from 35% to under 2% in three weeks.",
    tags: ["Selenium", "TestNG", "CI/CD", "WebDriver"] },
  { id: 3, tag: "API · Security", date: "Nov 2023", readTime: "4 min read", icon: "🔒", color: "#d4af37",
    title: "Catching an Auth Token Leakage in an API Payload",
    problem: "During REST API regression testing with Postman, I noticed that a history endpoint was returning a full JWT access token in the response body — not just the booking data. This token had a 24-hour TTL and could be used to impersonate any user.",
    root: "A developer had added the token to the response during a debugging session, and the field was never removed before the PR merged. No automated test was asserting the shape of the response payload.",
    fix: "I added a negative assertion layer to every API test: alongside verifying expected fields, tests now explicitly assert that sensitive fields are absent from responses. A JSON schema validation step was introduced in Postman/Newman. The security fix was patched same-day.",
    tags: ["API Security", "Postman", "JWT", "Schema Validation"] },
  { id: 4, tag: "P1 Defect · E-Signature", date: "Sep 2023", readTime: "7 min read", icon: "✍️", color: "#5ec8ff",
    title: "Resolving a P1 E-Signature Failure 24 Hours Before Go-Live",
    problem: "A Priority-1 production defect surfaced 24 hours before Go-Live: electronic signature submission was silently failing for ~8% of users under load. Without a fix, the release would have slipped, breaking compliance commitments to the client.",
    root: "Through structured RCA with developers and Functional SMEs, we traced it to a race condition in the signature-verification microservice — under high concurrency, the cert validation call timed out but the front-end treated the timeout as success.",
    fix: "I drafted a reproducible load-condition test script that triggered the bug 9/10 times. The dev team patched the timeout handling and added an explicit retry. I re-ran the script post-fix to confirm 0% failure across 500 concurrent users. Go-Live happened on schedule with zero release slippage.",
    tags: ["RCA", "E-Signature", "21 CFR Part 11", "P1 Resolution"] },
];

// ════════════════════════════════════════════════════════════════════════════
//  TESTIMONIALS — Real recommendations from colleagues/managers
//  HOW TO COLLECT:
//   1. Message 3-5 colleagues on LinkedIn: "Hi [Name], could you write 2-3
//      sentences about working with me on [project]? Focus on a specific
//      impact you remember. I'm building my portfolio."
//   2. Replace the placeholders below with real quotes.
//   3. Optional: ask if they're okay being publicly named (most say yes).
//   4. If they prefer anonymity, use role only: "Senior QA Lead, Cognizant".
// ════════════════════════════════════════════════════════════════════════════
export const TESTIMONIALS = [
  {
    quote: "Guru consistently went above and beyond on the Global Ship Hold Center program. His attention to compliance detail caught issues that would have caused real audit problems — I'd happily work with him again.",
    name: "Pending — Add a real teammate",
    role: "Senior QA Lead",
    company: "Cognizant · Olympus Account",
    initials: "TM", // placeholder initials shown as avatar
    color: "#7af0c8",
  },
  {
    quote: "One of the most thorough validation engineers I've worked with. Guru takes ownership of the entire CSV lifecycle and his test scripts are textbook quality — clear, traceable, and audit-ready.",
    name: "Pending — Add a real teammate",
    role: "QA Manager",
    company: "Cognizant",
    initials: "PM",
    color: "#d4af37",
  },
  {
    quote: "Guru's structured RCA on the P1 e-signature defect saved our Go-Live. He stayed calm under pressure, reproduced the bug, and partnered with dev to ship a fix in 24 hours. Top tier.",
    name: "Pending — Add a real teammate",
    role: "Functional SME",
    company: "Olympus",
    initials: "FS",
    color: "#8b7fe5",
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  buildSystemPrompt() — feeds the LLM ALL of Guru's info as context
//  Called by /api/chat.js — anytime you update the data above, the bot
//  automatically knows the new info on the next deploy.
// ════════════════════════════════════════════════════════════════════════════

export function buildSystemPrompt() {
  const skillLines = Object.entries(SKILLS)
    .map(([cat, items]) => `- ${cat}: ${items.map(s => s.name).join(", ")}`)
    .join("\n");

  const expLines = EXPERIENCE.map((e) =>
    `- ${e.role} at ${e.company} (${e.client}) | ${e.period} | ${e.location}\n  ${e.points.map(p => "  • " + p).join("\n")}`
  ).join("\n\n");

  const projectLines = PROJECTS.map((p, i) =>
    `${i + 1}. ${p.title} (${p.period}, role: ${p.role}) — ${p.desc} Tech: ${p.tag}. Achievement: ${p.achievement}`
  ).join("\n");

  const certLines = CERTIFICATIONS.map((c) =>
    `- ${c.name} (${c.issuer}, ${c.year}) — ${c.note}`
  ).join("\n");

  const learningLines = LEARNING.map((l) => `- ${l.phase}: ${l.item} (${l.status})`).join("\n");
  const awardLines = AWARDS.map((a) => `- ${a.title} — ${a.event}. ${a.note}`).join("\n");
  const blogLines = BLOG_POSTS.map((b, i) =>
    `${i + 1}. "${b.title}" (${b.date}) — Problem: ${b.problem} Root cause: ${b.root} Fix: ${b.fix}`
  ).join("\n\n");

  return `You are QAIX, an AI assistant living inside ${CONTACT.name}'s portfolio website. Your sole purpose is to answer visitor questions about ${CONTACT.name} accurately, helpfully, and conversationally.

# ABOUT GURUPRASAD
Name: ${CONTACT.name}
Title: ${CONTACT.title}
Location: ${CONTACT.location}
Status: ${CONTACT.status}
Email: ${CONTACT.email}
Phone: ${CONTACT.phone}
LinkedIn: ${CONTACT.linkedin}
GitHub: ${CONTACT.github}

# PROFESSIONAL SUMMARY
${SUMMARY}

# KEY METRICS
${STATS.map(s => `- ${s.val} ${s.label}`).join("\n")}

# SKILLS
${skillLines}

# EXPERIENCE
${expLines}

# PROJECTS
${projectLines}

# CERTIFICATIONS
${certLines}

# CURRENTLY LEARNING (Roadmap to AI-Augmented QA Engineer)
${learningLines}

# AWARDS
${awardLines}

# EDUCATION
${EDUCATION.degree}
${EDUCATION.school} (${EDUCATION.affiliation})
${EDUCATION.year} · ${EDUCATION.cgpa}

# BLOG POSTS (Problem → Root Cause → Fix breakdowns)
${blogLines}

# RULES FOR YOUR RESPONSES
1. Always answer as if you ARE QAIX — Guruprasad's AI assistant. Refer to him as "Guru" or "Guruprasad" (never "I" or "me").
2. Keep responses CONCISE — 2-4 sentences for simple questions, up to 6-8 sentences for complex ones. Never write essays.
3. Use **bold** to highlight key terms, technologies, and numbers. Use bullet points for lists.
4. If asked something not in your knowledge above (e.g. salary, personal life, opinions on competitors), politely redirect: "Best to ask Guru directly — drop an email at ${CONTACT.email} or message on LinkedIn."
5. If asked something completely unrelated to Guru (e.g. "what's the weather", "write me code"), politely decline: "I'm focused on helping people learn about Guru. I can tell you about his work, skills, projects, or how to reach him."
6. Be warm and conversational. Use emojis sparingly (1 per message max, optional).
7. Never invent facts. If you don't know, say so and suggest the visitor contact him directly.
8. End responses with a helpful nudge when appropriate (e.g. "Want me to tell you about his projects?").`;
}
