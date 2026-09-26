// One-off: seed the `portfolio` table (id = 1) from the resume content.
// Run with: npx tsx scripts/seed-portfolio.ts
import { prisma } from "@/database/lib/prisma";
import { normalizePortfolio, type Portfolio } from "@/app/_portfolio/content";

const content: Portfolio = {
  profile: {
    name: "Thilak Vikram R",
    role: "Full Stack Developer",
    tagline:
      "Software Developer with 4 years of experience across full-stack development, API integration, and data analytics.",
    badge: "Available for new opportunities",
    email: "thilakvikram13@gmail.com",
    github: "https://github.com/ThilakVikram",
    linkedin: "https://www.linkedin.com/in/thilakvikramr1107",
  },
  sections: [
    {
      id: "about",
      type: "about",
      title: "About me",
      visible: true,
      body:
        "Software Developer with 4 years of professional experience, including 1.5 years in full-stack development and 2.5 years in data analytics. Experienced in web application development, backend engineering, ERP solutions, API integration, and business process automation. Combines software engineering and analytical expertise to deliver scalable, maintainable, and business-focused solutions.",
      stats: [
        { value: "4+", label: "Years experience" },
        { value: "1.5+", label: "Years full-stack dev" },
        { value: "2.5+", label: "Years data analytics" },
      ],
    },
    {
      id: "skills",
      type: "skills",
      title: "Skills & tools",
      visible: true,
      groups: [
        { name: "Languages", items: ["JavaScript", "Python", "TypeScript", "HTML", "CSS", "SQL"] },
        { name: "Frameworks & Libraries", items: ["Django", "Django REST Framework", "Angular", "React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"] },
        { name: "Databases", items: ["MySQL", "PostgreSQL", "SQLite"] },
        { name: "Automation & DevOps", items: ["Puppeteer", "Playwright", "Docker", "AWS EC2", "Git", "GitHub"] },
      ],
    },
    {
      id: "projects",
      type: "projects",
      title: "Featured projects",
      visible: true,
      items: [
        {
          title: "Bodygraph Manager — Gym Management Web Application",
          description:
            "Full-stack gym management app with role-based access for Admin, Receptionist, Trainer, and Member. Server-side authorized member, trainer, membership, attendance, payment, workout, diet, and inventory modules, an analytics dashboard (Recharts), invoice/PDF receipts, audit logs, reports, and CSV exports.",
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma ORM", "SQLite"],
          // Actual repo URL wasn't recoverable from the resume PDF text - fill in before publishing.
          href: "",
        },
      ],
    },
    {
      id: "services",
      type: "services",
      title: "Services",
      visible: true,
      intro: "Here's how I can help you ship.",
      items: [
        {
          title: "Full-Stack Web Apps",
          description: "Scalable web applications built with Django, Next.js and REST APIs, backed by MySQL/PostgreSQL.",
          features: ["Django & DRF", "Next.js & React", "REST APIs"],
          href: "",
          cta: "Learn more",
        },
        {
          title: "API & Systems Integration",
          description: "Connecting internal systems to third-party platforms for automated data sync.",
          features: ["Amazon SP-API", "Zoho Analytics & Inventory", "Data pipelines"],
          href: "",
          cta: "Learn more",
        },
        {
          title: "Data & Automation",
          description: "Web scraping, BI dashboards and workflow automation that turn raw data into decisions.",
          features: ["Puppeteer / Playwright", "SQL reporting", "Zoho Creator & Deluge"],
          href: "",
          cta: "Learn more",
        },
      ],
    },
    {
      id: "experience",
      type: "experience",
      title: "Experience",
      visible: true,
      items: [
        {
          period: "Mar 2025 — Present",
          role: "Full Stack Developer",
          company: "iTrend Solutions, Chennai",
          note:
            "Built and maintained a Django-based application for structured sales and business data. Developed REST APIs with Django ORM serving an Angular frontend from MySQL. Managed local/production databases, built a data integration pipeline for third-party data, and integrated Amazon SP-API, Zoho Analytics API, and Zoho Inventory API for automated data sync.",
        },
        {
          period: "Feb 2022 — Nov 2024",
          role: "Data Analyst & Procurement",
          company: "iTrend Solutions, Chennai",
          note:
            "Managed international procurement via Alibaba from quotation through purchase order completion. Built web scraping solutions with Node.js, Puppeteer, and Playwright, and analyzed Amazon marketplace/sales data. Built BI dashboards and SQL reports in Zoho Analytics, and developed custom Zoho Creator/Deluge applications integrating Zoho Inventory.",
        },
      ],
    },
    {
      id: "education",
      type: "text",
      title: "Education & Certifications",
      visible: true,
      body:
        "B.Sc in Computer Science — Prince Shri Venkateshwara Arts and Science College, Gowrivakkam, Chennai\n\nJavaScript: From Beginner to Advanced — Udemy (Jul 2023 – Dec 2023)\nFull Stack Python Development — Besant Technologies (Sep 2024 – Mar 2025)",
    },
    {
      id: "contact",
      type: "contact",
      title: "Let's build something together.",
      visible: true,
      eyebrow: "What's next?",
      body: "My inbox is always open — whether you have a project in mind, a question, or just want to say hi.",
    },
  ],
};

async function main() {
  const normalized = normalizePortfolio(content);
  await prisma.portfolio.upsert({
    where: { id: 1 },
    create: { id: 1, content: normalized },
    update: { content: normalized },
  });
  console.log("Portfolio row (id=1) saved.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
