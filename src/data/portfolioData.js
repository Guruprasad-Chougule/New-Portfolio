// ===================== PORTFOLIO DATA =====================

export const PERSONAL = {
  name: "Guruprasad Chougule",
  firstName: "Guruprasad",
  role: "Quality Assurance Engineer",
  tagline: "QA Engineer | Automation | GxP Specialist",
  summary: "Quality Assurance Engineer with 3+ years of experience in Computer System Validation (CSV/CSA), GxP Life Sciences, PeopleSoft HCM testing, Power Apps, Selenium automation, and API testing. Strong in Agile, JIRA, and compliance (21 CFR Part 11). Aspires to become QA Lead in Healthcare domain.",
  experience: "3+",
  domain: "Life Sciences & GxP",
  email: "guruprasad@example.com",
  linkedin: "https://linkedin.com/in/guruprasad-chougule",
  location: "Bengaluru, India",

  // ── Resume config ── update ONLY these two lines whenever needed ──
  resumeUrl: "https://drive.google.com/uc?export=download&id=1Sq7eMI4moIZf_V_D1nk1KRg8QKfXpda5",
  resumeLabel: "Download Resume",
};

export const SKILLS = [
  {
    category: "Testing",
    icon: "🧪",
    color: "#00d4ff",
    items: [
      { name: "Manual Testing", level: 95 },
      { name: "Regression Testing", level: 90 },
      { name: "UAT / SIT", level: 88 },
      { name: "CSV / CSA Validation", level: 92 },
      { name: "API Testing", level: 80 },
    ],
  },
  {
    category: "Automation",
    icon: "⚙️",
    color: "#7b2fff",
    items: [
      { name: "Selenium WebDriver", level: 85 },
      { name: "Java", level: 80 },
      { name: "TestNG", level: 82 },
      { name: "Maven", level: 78 },
    ],
  },
  {
    category: "Tools & Platforms",
    icon: "🛠️",
    color: "#00fff5",
    items: [
      { name: "JIRA / Azure DevOps", level: 90 },
      { name: "Power Apps", level: 75 },
      { name: "Power BI", level: 70 },
      { name: "PeopleSoft HCM", level: 72 },
    ],
  },
  {
    category: "GxP Compliance",
    icon: "🔬",
    color: "#ff0080",
    items: [
      { name: "GxP / 21 CFR Part 11", level: 92 },
      { name: "GAMP 5", level: 88 },
      { name: "CAPA / NCR", level: 85 },
      { name: "IQ / OQ / PQ", level: 87 },
    ],
  },
  {
    category: "AI Tools",
    icon: "🤖",
    color: "#00d4ff",
    items: [
      { name: "Generative AI", level: 72 },
      { name: "GitHub Copilot", level: 68 },
    ],
  },
];

export const EXPERIENCE = [
  {
    company: "Cognizant Technology Solutions",
    role: "Product Test Specialist",
    period: "Aug 2022 – Present",
    duration: "3 Years",
    location: "Bengaluru, India",
    client: "Olympus Corporation",
    domain: "Life Sciences / GxP",
    highlights: [
      "Primary QA Owner for 5+ GxP-regulated projects including GSHC, FCAT Tool, and HxGN EAM",
      "Executed 400+ test scripts across SIT, UAT, and Regression cycles with zero critical escapes",
      "Led RCA investigations and resolved 15+ production defects with documented corrective actions",
      "Collaborated with global stakeholders across US, EU, and APAC for compliance sign-off",
      "Authored and reviewed IQ/OQ/PQ protocols, test plans, and CSV documentation per GAMP 5",
      "Managed CAPA and NCR processes in alignment with 21 CFR Part 11 regulatory requirements",
    ],
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: "GSHC",
    subtitle: "Global Service Hub Compliance",
    role: "Primary QA Owner",
    color: "#00d4ff",
    icon: "🏥",
    description: "End-to-end QA ownership of GxP-regulated healthcare service management system for global Olympus operations.",
    details: "Led validation activities including IQ/OQ/PQ protocol authoring, test execution, and compliance documentation for a mission-critical GxP application serving 8+ global sites.",
    tech: ["CSV", "GxP", "JIRA", "Selenium", "21 CFR Part 11"],
    achievements: ["Zero critical defects post go-live", "100% compliance with regulatory requirements", "Reduced test cycle time by 25%"],
  },
  {
    id: 2,
    title: "FCAT Tool",
    subtitle: "Field Corrective Action Tracking",
    role: "QA Lead",
    color: "#7b2fff",
    icon: "🔧",
    description: "Validation and testing of a critical field corrective action tracking system for medical device post-market surveillance.",
    details: "Designed comprehensive test strategy covering regulatory workflows, audit trails, and electronic signatures in compliance with FDA 21 CFR Part 11 requirements.",
    tech: ["Power Apps", "UAT", "GAMP 5", "CAPA", "Azure DevOps"],
    achievements: ["Validated 200+ test cases", "E-signature compliance verified", "Passed FDA audit requirements"],
  },
  {
    id: 3,
    title: "JIRA Enhancements",
    subtitle: "QA Process Optimization",
    role: "QA Automation Engineer",
    color: "#00fff5",
    icon: "📋",
    description: "Enhanced JIRA workflows and dashboards to improve defect tracking, sprint velocity, and reporting for QA teams.",
    details: "Implemented custom JIRA workflows, automated report generation, and integrated with Azure DevOps for seamless CI/CD pipeline defect tracking across 6 global teams.",
    tech: ["JIRA", "Automation", "Power BI", "API Testing", "Agile"],
    achievements: ["50% faster defect reporting", "Custom dashboards for 6 teams", "Real-time compliance metrics"],
  },
  {
    id: 4,
    title: "HxGN EAM",
    subtitle: "Enterprise Asset Management",
    role: "QA Engineer",
    color: "#ff0080",
    icon: "🏭",
    description: "System testing and validation of HxGN Enterprise Asset Management system for Life Sciences manufacturing.",
    details: "Executed SIT and UAT for complex asset management workflows, equipment qualification, and maintenance scheduling modules in GxP manufacturing environment.",
    tech: ["SIT", "UAT", "GxP", "Regression", "TestNG"],
    achievements: ["400+ test scripts executed", "Cross-module integration verified", "Production-ready certification"],
  },
  {
    id: 5,
    title: "CAPA/NCR Enhancement",
    subtitle: "Corrective Action Management",
    role: "QA Specialist",
    color: "#00d4ff",
    icon: "⚡",
    description: "Enhancement and re-validation of CAPA and Non-Conformance Report management system for regulatory compliance.",
    details: "Managed complete re-validation lifecycle including risk assessment, protocol design, and execution for enhanced CAPA workflows meeting ISO 13485 and GMP requirements.",
    tech: ["CAPA", "NCR", "CSV", "Risk Assessment", "GAMP 5"],
    achievements: ["Full regulatory compliance", "Streamlined investigation workflows", "Audit trail integrity verified"],
  },
];

export const CERTIFICATIONS = [
  {
    title: "Microsoft Azure AZ-900",
    subtitle: "Azure Fundamentals",
    issuer: "Microsoft",
    color: "#0078d4",
    icon: "☁️",
    year: "2023",
    badge: "AZ-900",
  },
  {
    title: "Google Cloud Digital Leader",
    subtitle: "Cloud Fundamentals",
    issuer: "Google Cloud",
    color: "#4285f4",
    icon: "🌐",
    year: "2023",
    badge: "CDL",
  },
  {
    title: "Oracle AI Foundations",
    subtitle: "AI & Machine Learning",
    issuer: "Oracle",
    color: "#f80000",
    icon: "🤖",
    year: "2024",
    badge: "OAI",
  },
];

export const ACHIEVEMENTS = [
  {
    title: "Hackathon Top Performer",
    description: "Ranked among top performers in Cognizant's internal innovation hackathon for developing an AI-powered QA automation framework.",
    icon: "🏆",
    color: "#f59e0b",
    year: "2024",
  },
  {
    title: "Best Project Award",
    description: "Recognized for excellence in delivery and quality compliance on the GSHC project, achieving zero critical defects post go-live.",
    icon: "⭐",
    color: "#00d4ff",
    year: "2023",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
