// /api/ask.js — Vercel serverless function (Node.js runtime)
//
// WHY THIS FILE EXISTS:
// The Gemini API key must NEVER be placed in frontend code (src/main.jsx), because
// frontend code runs in every visitor's browser and can be read via DevTools.
// This file runs only on the server, so the key stays hidden.
//
// SETUP (one-time):
// 1. Get a free API key: https://aistudio.google.com/app/apikey
// 2. Deploy this project to Vercel (vercel.com — free tier is fine).
// 3. In your Vercel project → Settings → Environment Variables, add:
//      Name:  GEMINI_API_KEY
//      Value: <paste your key here>
//    (Do this in the Vercel dashboard only — never in code, never in chat, never in GitHub.)
// 4. Redeploy. This endpoint will then be live at: https://your-site.vercel.app/api/ask
// 5. In src/main.jsx, AI_BACKEND_URL is already set to '/api/ask' — no further change needed.
//
// If GEMINI_API_KEY is missing or the request fails for any reason, the frontend
// automatically falls back to the built-in rule-based "Kanak AI" answers — so the
// chatbot never breaks for visitors even if this endpoint is misconfigured.

const SYSTEM_CONTEXT = `You are "Kanak AI", the assistant embedded in Kanak Verma's personal portfolio website.
Answer ONLY using the facts below. Always reply in English, in a friendly, concise way (2-5 sentences max).
If someone greets you (hi/hello/hey), reply warmly and briefly, then invite them to ask about Kanak.
If asked something not covered by these facts, politely say you don't have that specific detail and suggest
contacting Kanak directly (email/phone/LinkedIn/contact form). Never invent facts that aren't listed here.

ABOUT:
Kanak Verma — Full Stack Developer, AI/ML Engineer, B.Tech Data Science student.
Based in Moradabad, Uttar Pradesh, India. Phone/WhatsApp: 7983639253. Email: kanak0205mbd@gmail.com.
GitHub: github.com/kanak-verma-developer. LinkedIn: linkedin.com/in/kanak-verma-b50730368.
Currently seeking Software Development, Full Stack Development or AI/ML opportunities.

EDUCATION:
B.Tech — Data Science, 2023–2027, Moradabad Institute of Technology, Uttar Pradesh. CGPA: 7.0+.

TECHNICAL SKILLS:
Languages: Python, JavaScript, HTML5, CSS3.
Frontend: React.js, Tailwind CSS, Responsive Design.
Backend: Flask, Node.js, Express.js, REST APIs.
Database: SQL, SQLite3.
AI/ML: YOLOv8, OpenCV, RAG, NLP, Machine Learning.
Cloud & Tools: Microsoft Azure, Git, GitHub, Pega, VS Code.

INTERNSHIPS:
1. National Internship Program — Pega Developer — Pegasystems Worldwide India × SmartBridge (via AICTE), Remote,
   Aug 2026 – Sep 2026. Completed 60 hours of industry-integrated learning with hands-on exposure to workflow
   automation and low-code technologies, including real-world project implementation on the Pega platform.
2. Frontend Developer Intern — IBM (via AICTE), Remote, Aug 2025 – Oct 2025.
   Developed 5+ responsive web app modules using React.js, Tailwind CSS and JavaScript, improving UI consistency
   across 3 workflows. Integrated frontend with 8+ REST API endpoints, resolved 10+ cross-team issues in Agile.
   Used Git/GitHub for collaborative source control; earned the IBM Web Development Fundamentals Badge.
3. Cloud Computing Intern — Microsoft Elevate (via AICTE), Remote, Mar 2025 – May 2025.
   Configured and tested virtual machines, storage and resource groups on Microsoft Azure across multiple cloud
   services. Worked with Azure resource lifecycle management, deployment configuration and cloud infrastructure
   fundamentals. Completed all program milestones and received the Microsoft Azure Internship Certificate.

PROJECTS:
1. CarbonIQ — AI Carbon Footprint Chatbot (Python, Flask, IBM Granite NLP, RAG, JavaScript).
   Full-stack AI chatbot with RAG-based knowledge retrieval and NLP across 10+ carbon-related domains, optimized
   retrieval over a 500+ entry knowledge base keeping average query response under 2 seconds. Includes voice
   interaction and a responsive 3D Earth/particle visualizer. Live demo: carboniq-6j7c.onrender.com
2. AI Smart Queue Management System (Python, YOLOv8, OpenCV, Streamlit, SQLite3).
   Real-time people-detection pipeline processing live camera feeds at 20+ FPS in testing. Streamlit dashboard for
   live statistics, trends and historical queue data with automated PDF/CSV reporting and SQLite-based audit trails.
3. HeatShield AI — Heat-Risk Intelligence Platform (Python, Machine Learning, Flask, React, REST API).
   AI-powered platform delivering environmental heat-risk insights, predictions and actionable recommendations.
   Started with a rule-based risk-scoring engine, then layered a trained ML model for improved accuracy. Flask
   backend connected to a React frontend via REST APIs for real-time risk visualization.
Other concept builds shown in the portfolio's Project Lab: MIT Campus Intelligence & Navigation System, NexBot
Pro (AI SaaS dashboard), and a Pega-based Vehicle Service Management application.

LEADERSHIP & ACHIEVEMENTS:
Team Lead for a major campus-intelligence project, coordinating design, development and delivery.
Campus Ambassador — BECon 2026, Entrepreneurship Development Cell, IIT Delhi (Dec 2025 – Feb 2026).
Coordinator, SecureX Cyber Society — college cybersecurity society, leading awareness initiatives and peer learning.
1st Prize, Web Crackers — MIT Tech Club, Moradabad Institute of Technology (2025–26).

CERTIFICATIONS:
National Internship Program (Pega) — Pegasystems Worldwide India × SmartBridge (AICTE).
Introduction to Data Science & Python for Data Science and AI — IBM (Coursera).
App Development on Pega Platform — Pega Academy.
Microsoft Azure Internship Certificate — Microsoft Elevate (AICTE).
Web Development Fundamentals Badge — IBM (AICTE).

SITE NOTES:
This portfolio website was built entirely by Kanak himself using React, a custom design system and this AI assistant.
The resume is view-only in the site (no download button) — visitors can read the full PDF in the Resume viewer, or
contact Kanak directly for a copy.`;

export default async function handler(req, res) {
  // Basic CORS so the frontend can call this from any deployed origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured: missing GEMINI_API_KEY environment variable' });
  }

  let question = '';
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    question = (body && body.question) || '';
  } catch (e) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Missing question' });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: question }] }],
          systemInstruction: { role: 'system', parts: [{ text: SYSTEM_CONTEXT }] },
          generationConfig: { temperature: 0.4, maxOutputTokens: 300 }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      return res.status(502).json({ error: 'Gemini API error', detail: errText.slice(0, 300) });
    }

    const data = await geminiRes.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!answer) return res.status(502).json({ error: 'No response text from model' });

    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Gemini API' });
  }
}
