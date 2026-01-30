// Resume Knowledge Base for AI Search
const resumeData = {
    "name": "Shreya Khanna",
    "role": "Product Manager",
    "location": "San Jose, CA",
    "contact": {
        "email": "shreyakhanna06@gmail.com",
        "phone": "773-312-6498",
        "linkedin": "linkedin.com/in/shreyakhanna06"
    },
    "summary": "Full-stack 'super IC' PM driving product vision and strategy and delivery with deep technical and execution skills, a 0 to 1 builder across Enterprise SaaS, FinTech, and E-commerce platforms - who actively leverages AI in daily workflows to move faster and ship smarter.",
    "experience": [
        {
            "company": "Global Holdings LLC",
            "role": "Product Manager, Global Prime",
            "duration": "Jul 2024 - Nov 2025",
            "industry": "Financial Services / Payment Processor",
            "companySize": "~$15B annual transactions",
            "achievements": [
                "Drove product strategy and roadmap for Global Prime, grounded in voice of the customer and behavioral analytics to prioritize features that lifted engagement and retention across 5 Debt Settlement Partners (DSPs); strengthened platform performance.",
                "Led product discovery and business case development to launch Prime Express (configuration-only tier), introducing subscription pricing, reducing onboarding time by ~75%, and securing executive buy-in for a new revenue stream.",
                "Re-architected the settlement module into a configurable, modular workflow; shipped an MVP in one quarter that boosted processing velocity and contributed to ~8.8% YoY growth in settlement accounts and revenue.",
                "Defined standardized, REST-based APIs for high-impact partner integrations comprising data ingestions/syncs across CRMs- Salesforce and like, eliminating 40% of manual ingestion effort, and improving data accuracy.",
                "Transformed partner data access from legacy, engineering‑dependent reporting to a secure, self-serve model (delivered on Snowflake), eliminating reporting bottlenecks, reducing ad‑hoc engineering requests by ~60%, and enabling near real‑time insights for DSPs.",
                "Collaborated cross-functionally with engineering/operations, legal, security and external clients to consolidate feature requirements through clear documentation, acceptance criteria, and feedback-driven iteration while ensuring governance and privacy compliance."
            ],
            "skills": ["Product Strategy", "Business Case Development", "API Design", "Salesforce", "Snowflake", "Agile", "Stakeholder Management"]
        },
        {
            "company": "Monica & Andy, Inc.",
            "role": "Product Manager, E-commerce",
            "duration": "May 2023 - Jan 2024",
            "industry": "Organic Baby Apparel",
            "companyRanking": "#10 apparel startup by Tracxn",
            "platform": "Shopify",
            "achievements": [
                "Directed the B2C consumer-facing roadmap, prioritizing friction-reducing features based on behavioral data and customer needs to drive a web/mobile site conversion from 1.8% to 3%.",
                "Increased repeat purchases by 20% by launching a loyalty program and iterating via A/B testing to strengthen engagement and retention across the customer lifecycle.",
                "Conducted Market Analysis, ROI, and Cost Analysis with product analytics tools (Tableau, SQL, Google Analytics) to optimize operating budgets in marketing spend by 16% per channel, translating these insights into forward-looking Go-To-Market Strategy (GTM)."
            ],
            "skills": ["E-commerce", "Shopify", "A/B Testing", "Product Analytics", "Tableau", "SQL", "Google Analytics", "Loyalty Programs", "Conversion Optimization"]
        },
        {
            "company": "Hewlett Packard Enterprise (HPE) - Aruba Networks",
            "role": "Product Owner & Software Engineer",
            "duration": "Jan 2019 - Jul 2022",
            "industry": "Enterprise Hardware / Networking",
            "achievements": [
                "Drove ideation-to-launch of the Remote Console Session across Aruba networking devices-controllers and access points by coordinating requirements with hardware and firmware teams.",
                "Scoped and delivered a Troubleshooting Tools MVP that streamlined customer workflows and reduced customer support tickets by 20% through stakeholder alignment, backlog prioritization, and blocker resolution."
            ],
            "skills": ["Hardware Integration", "Firmware Coordination", "Customer Support", "MVP Development", "Stakeholder Alignment"]
        }
    ],
    "education": [
        {
            "degree": "Master of Engineering Management",
            "major": "Product Management",
            "institution": "Northwestern University",
            "location": "Illinois, US",
            "duration": "Sep 2022 - Dec 2023",
            "additionalRole": "Research Associate (Large Language Models for Supply Chain Optimization)"
        },
        {
            "degree": "Bachelor of Technology",
            "major": "Computer Science and Engineering",
            "institution": "SRM Institute of Science and Technology",
            "location": "Chennai, India",
            "duration": "Jun 2015 - May 2019"
        }
    ],
    "skills": {
        "technical": ["SQL", "Python", "UI/UX Design", "Experimentation (A/B Testing)", "Tableau", "Power BI", "Google Analytics"],
        "tools": ["JIRA", "Confluence", "Figma", "Postman", "Trello", "Git", "Jenkins", "Shopify", "Datadog", "Salesforce", "Snowflake"],
        "execution": ["Agile methodologies (Scrum/Kanban)", "Stakeholder Negotiation", "SDLC Management", "Product Lifecycle Management"]
    },
    "keyMetrics": {
        "conversionImprovement": "67% (1.8% to 3%)",
        "onboardingReduction": "75%",
        "yoyGrowth": "8.8%",
        "repeatPurchaseIncrease": "20%",
        "supportTicketReduction": "20%",
        "manualEffortReduction": "40%",
        "engineeringRequestReduction": "60%",
        "marketingOptimization": "16%"
    }
};

// System prompt for the AI
const systemPrompt = `You are an AI assistant for Shreya Khanna's portfolio website. Your role is to answer questions about Shreya's professional experience, skills, and background based ONLY on the information provided in her resume.

Guidelines:
- Be professional, concise, and helpful
- Only use information from the resume data provided
- If asked about something not in the resume, politely say you don't have that information
- Highlight specific achievements and metrics when relevant
- Use a friendly but professional tone
- Keep responses focused and to the point (2-3 paragraphs max)
- When mentioning companies or projects, include relevant context

Resume Data:
${JSON.stringify(resumeData, null, 2)}`;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { resumeData, systemPrompt };
}
