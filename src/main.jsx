import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown, ArrowUpRight, Award, Bot, BrainCircuit, BriefcaseBusiness, Check,
  ChevronRight, Code2, Command, Cpu, Database, Download, ExternalLink, FileText,
  Github, Globe2, GraduationCap, Layers3, Linkedin, Mail, MapPin, Menu, Moon,
  Network, Rocket, Search, Send, Sparkles, Sun, Terminal, UserRound, X, Zap,
  ThermometerSun, Gauge, Printer, Users, Workflow, ClipboardList,
  PlayCircle, FileSearch, Loader2,
  Home, Star, GitFork, BadgeCheck, BarChart3, Eye, EyeOff, Trophy,
  Maximize2, Image as ImageIcon, ShieldCheck, Activity, Wand2, MessageCircle, BookOpen, ChevronDown, Phone
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import './styles.css';

// ⚠️ Replace with your own EmailJS credentials (emailjs.com → free plan works fine)
const EMAILJS_SERVICE_ID = 'service_s2k9ivr';
const EMAILJS_TEMPLATE_ID = 'qb1w39h';
const EMAILJS_PUBLIC_KEY = '9lVCRzmMx6VRbZdq_';

// ⚠️ Your public GitHub username — repos are pulled live, no API key needed.
const GITHUB_USERNAME = 'kanak-verma-developer';

// ⚠️ OPTIONAL: a webhook URL (Zapier / Make / Pipedream) that forwards to Email or SMS.
// Leave empty to disable. See README → "Instant Email/SMS alerts" for setup steps.
const NOTIFY_WEBHOOK_URL = '';

// ⚠️ Serverless proxy that calls Google Gemini (see /api/ask.js) so the real API key
// stays on the server, never in this frontend file. Works automatically once this
// project is deployed on Vercel with a GEMINI_API_KEY environment variable set
// (see the setup comment at the top of /api/ask.js). Until then — or if that call
// ever fails — Kanak AI automatically falls back to the built-in rule-based answers,
// so the chatbot never breaks for visitors.
// NEVER put a real AI API key directly in this file — it would be visible to every visitor.
const AI_BACKEND_URL = '/api/ask';

// Contact / profile links used across the header, hero and contact section — edit once here.
const CONTACT_EMAIL = 'kanak0205mbd@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/kanak-verma-b50730368/';
// ⚠️ Add your WhatsApp number with country code, digits only (e.g. 91XXXXXXXXXX for India). Leave empty to hide the button.
const WHATSAPP_NUMBER = '917983639253';
const GITHUB_PROFILE_URL = (GITHUB_USERNAME && GITHUB_USERNAME!=='YOUR_GITHUB_USERNAME') ? `https://github.com/${GITHUB_USERNAME}` : 'https://github.com/';

const projects = [
  { title:'HeatShield AI', type:'AI / ML', year:'2026', description:'AI-powered heat-risk intelligence platform with environmental insights, prediction and actionable recommendations.', tags:['Python','Machine Learning','Flask','React','REST API'], accent:'violet', github:'#', demo:'#', banner:'/images/projects/heatshield-banner.jpg',
    pipeline:['Problem','Data','ML Model','API','Dashboard','Prediction'],
    pipelineDetail:{
      'Problem':'Heatwaves are getting more frequent and people lack a simple, local way to gauge personal risk before stepping out.',
      'Data':'Environmental inputs — temperature, humidity and time of day — are collected and cleaned for the model.',
      'ML Model':'A trained model maps the input conditions to a heat-risk score, calibrated against real weather patterns.',
      'API':'A Flask REST API wraps the model so any client can request a prediction with a simple POST call.',
      'Dashboard':'A React dashboard visualises the current risk level and historical trend for the user.',
      'Prediction':'The final output is a risk band (Low/Moderate/High/Severe) plus a plain-language recommendation.'
    },
    caseStudy:{
      problem:'People don\u2019t have a fast, personal way to know how risky the current heat actually is for them.',
      approach:'Started with a simple rule-based baseline, then layered in a trained model once enough sample data existed to validate it.',
      architecture:'Python + scikit-learn model → Flask REST API → React dashboard for live visualisation and recommendations.',
      result:'A working demo that turns a raw temperature reading into a clear risk band and an actionable recommendation in under a second.',
      future:'Add live weather API integration, humidity/UV inputs and location-based alerts.'
    }
  },
  { title:'MIT Campus Intelligence & Navigation System', type:'Smart Campus', year:'2026', description:'Major 4th-year project (software + hardware) — a campus intelligence platform for navigation, rooms, faculty cabins, timetables and smart campus information. Currently in progress; Kanak is the team lead.', tags:['React','Python','AI/ML','Computer Vision','IoT'], accent:'cyan', github:'#', demo:'#', banner:'/images/projects/mit-campus-banner.jpg', status:'In progress — 4th year major project · Team Lead',
    pipeline:['Problem','Campus Data','Navigation Engine','API','React UI','Live Info'],
    pipelineDetail:{
      'Problem':'New students and visitors struggle to find rooms, faculty cabins and schedules on a large campus.',
      'Campus Data':'Building maps, room lists, faculty cabins and timetables are structured into a queryable dataset.',
      'Navigation Engine':'A routing layer resolves the shortest, most understandable path between two campus points.',
      'API':'A backend service exposes search, routing and timetable lookups to the frontend.',
      'React UI':'A clean interface lets users search a room, faculty member or class and see the route.',
      'Live Info':'The system surfaces the final result — directions, timing and any relevant live info.'
    },
    caseStudy:{
      problem:'Navigating a large campus and finding accurate faculty/timetable info is slow for newcomers.',
      approach:'Modelled the campus as structured data first, then layered search and routing on top of it.',
      architecture:'Structured campus dataset → routing/search backend → React frontend with search-first UX.',
      result:'Currently in development as Kanak\'s 4th-year major project (software + hardware) — core navigation and search flows are functional, with Kanak leading the team.',
      future:'Add live occupancy via computer vision and IoT sensors for real-time room availability.'
    }
  },
  { title:'AI Smart Queue', type:'Computer Vision', year:'2026', description:'Computer-vision concept for estimating crowd levels and supporting smarter queue management.', tags:['YOLOv8','OpenCV','Python','Streamlit'], accent:'pink', github:'https://github.com/kanak-verma-developer/AI_Queue_Management', demo:'#', banner:'/images/projects/ai-queue-banner.jpg',
    pipeline:['Problem','Video Feed','YOLOv8 Detection','Crowd Count','Streamlit UI','Insight'],
    pipelineDetail:{
      'Problem':'Long, unpredictable queues create a poor experience with no visibility into current crowd levels.',
      'Video Feed':'A camera feed (or sample footage) is ingested as input frames.',
      'YOLOv8 Detection':'YOLOv8 detects and localises people within each frame in real time.',
      'Crowd Count':'Detections are aggregated into a live crowd/queue-length estimate.',
      'Streamlit UI':'A lightweight Streamlit app displays the current count and trend.',
      'Insight':'The system flags when a queue is building up so action can be taken early.'
    },
    caseStudy:{
      problem:'Staff and visitors have no easy way to see how busy a queue or space currently is.',
      approach:'Used a pre-trained YOLOv8 model for person detection rather than training from scratch, to move fast.',
      architecture:'Video input → OpenCV frame processing → YOLOv8 detection → Streamlit dashboard.',
      result:'A working concept that turns raw video into a live, readable crowd-level indicator.',
      future:'Add multi-camera support and historical analytics for peak-time prediction.'
    }
  },
  { title:'Vehicle Service Management', type:'Pega', year:'2026', description:'Workflow-oriented Pega application blueprint for vehicle service requests, customer information and operations.', tags:['Pega','Workflow','App Development'], accent:'blue', github:'https://github.com/kanak-verma-developer/NIP-VehicleService-KanakVerma', demo:'#', banner:'/images/projects/vehicle-service-banner.jpg',
    pipeline:['Problem','Case Design','Pega Workflow','Business Rules','App UI','Resolution'],
    pipelineDetail:{
      'Problem':'Vehicle service requests and customer data were handled without a structured, trackable workflow.',
      'Case Design':'Service requests are modelled as Pega cases with clear stages and ownership.',
      'Pega Workflow':'A guided workflow moves each case through intake, diagnosis, service and closure.',
      'Business Rules':'Rules automate routing, approvals and notifications at each stage.',
      'App UI':'A Pega application UI lets staff and customers track a request end-to-end.',
      'Resolution':'The case closes with a clear resolution and record for future reference.'
    },
    caseStudy:{
      problem:'Vehicle service requests lacked a consistent, trackable process from intake to resolution.',
      approach:'Modelled the real-world service process as a Pega case lifecycle before building any screens.',
      architecture:'Pega case type → stage-based workflow → business rules engine → operational UI.',
      result:'A structured application blueprint where every request follows a consistent, auditable path.',
      future:'Add SLA-based escalation and integration with a parts-inventory system.'
    }
  }
];

const skills = [
  ['Python','Programming & automation',Code2,90],['React.js','Frontend development',Globe2,85],['Flask','Backend & APIs',Layers3,75],['JavaScript','Interactive web apps',Code2,85],
  ['AI / ML','Models & experimentation',BrainCircuit,80],['Computer Vision','YOLOv8 & OpenCV',Sparkles,70],['REST APIs','Integration & data flow',Network,80],['Databases','Foundational knowledge',Database,65],
  ['Pega','Workflow application',BriefcaseBusiness,70],['Git / GitHub','Version control',Github,80],['Cloud','Azure / deployment exposure',Rocket,55],['Data Science','Analytics mindset',Cpu,75]
];


const journey = [
  {date:'2023 — 2027', title:'B.Tech · CSE (Data Science)', text:'Moradabad Institute of Technology — building foundations in computer science, data and software engineering.', icon:GraduationCap},
  {date:'2025 — 2026', title:'Internships & technical training', text:'Hands-on exposure to software, cloud and application development through structured internship and training experiences.', icon:BriefcaseBusiness},
  {date:'2026', title:'Project-led AI & Web Development', text:'Building practical projects across AI/ML, computer vision, React, Python, Flask and APIs.', icon:Rocket},
  {date:'Now', title:'Open to opportunities', text:'Looking for environments where I can contribute, learn quickly and ship useful software.', icon:Zap}
];

const achievements = [
  ['1st Prize','MIT Tech Club Web Crackers','Competition / Web'],
  ['Team Lead','Major project leadership','Campus / Product'],
  ['AI Projects','ML + Computer Vision builds','Technical'],
  ['Pega NIP','Vehicle Service Management','Application development']
];

// ⚠️ Placeholder testimonials — replace with real ones from professors, teammates, or mentors.
const testimonials = [
  { quote:'Kanak picks up new tools fast and actually ships working demos, not just slides.', name:'Project Teammate', role:'MIT Tech Club' },
  { quote:'Clear thinker under pressure — broke down a messy campus-navigation problem into something buildable.', name:'Faculty Mentor', role:'Moradabad Institute of Technology' },
  { quote:'Good instinct for keeping a first version simple before adding complexity.', name:'Internship Supervisor', role:'Technical Training Program' }
];

// ⚠️ Placeholder notes/blog posts — replace with real short write-ups whenever you want.
const notes = [
  { title:'What I learned building HeatShield AI', date:'Aug 2026', excerpt:'Starting with a simple rule-based risk model before reaching for ML — and why that order mattered.', body:"I started HeatShield AI wanting to jump straight to a trained model. Instead I began with a plain rule-based function (temperature thresholds → risk labels), shipped that first, then layered prediction on top once the basic product actually worked end-to-end. It meant I always had something demoable, and debugging stayed simple because I could isolate 'is the rule wrong' from 'is the model wrong'." },
  { title:'Debugging a messy campus-navigation dataset', date:'Jun 2026', excerpt:'Real-world location data is inconsistent — here is how I cleaned and structured it for the navigator.', body:'Campus building/room data came from several inconsistent sources — some rooms had two names, some floors were numbered differently. Rather than writing one giant cleanup script, I normalized data in small stages (names → floors → coordinates) and wrote quick sanity checks after each stage. Slower up front, far fewer surprises later.' },
  { title:'Why I keep a "Project Lab" view on every project', date:'Apr 2026', excerpt:'Showing the pipeline, not just the final result, made my projects easier for others to understand.', body:"Early versions of my portfolio only showed final screenshots. Recruiters and teammates kept asking 'how does it actually work end to end?' — so I started documenting each project as a pipeline (Problem → Data → Model/Logic → API → Output). It takes longer to prepare, but conversations about my projects got much more concrete." }
];
const radarSkills = ['Python','React.js','AI / ML','Computer Vision','REST APIs','Pega'];

// ---------- Resume-sourced knowledge (used by Kanak AI chatbot for accurate, up-to-date answers) ----------
const PHONE_NUMBER = '7983639253';
const resumeSummary = "Kanak Verma is a Full Stack Developer and AI/ML Engineer — a B.Tech Data Science student with hands-on experience building responsive web applications and AI-powered products. Strong foundation in Python, JavaScript, React.js, Node.js, Flask, REST APIs, SQL, Git/GitHub and Microsoft Azure, with project experience in AI/ML, computer vision and RAG-based applications. He is currently seeking Software Development, Full Stack Development or AI/ML opportunities.";
const resumeSkills = ['Python','JavaScript','HTML5','CSS3','React.js','Tailwind CSS','Responsive Design','Flask','Node.js','Express.js','REST APIs','SQL','SQLite3','YOLOv8','OpenCV','RAG','NLP','Machine Learning','Microsoft Azure','Git','GitHub','Pega','VS Code'];
const internships = [
  { role:'National Internship Program — Pega Developer', company:'Pegasystems Worldwide India × SmartBridge (via AICTE)', mode:'Remote', duration:'Aug 2026 – Sep 2026', points:['Completed 60 hours of industry-integrated learning with hands-on exposure to workflow automation and low-code technologies.','Worked on real-world project implementation using the Pega platform.'] },
  { role:'Frontend Developer Intern', company:'IBM (via AICTE)', mode:'Remote', duration:'Aug 2025 – Oct 2025', points:['Developed 5+ responsive web application modules using React.js, Tailwind CSS and JavaScript, improving UI consistency across 3 workflows.','Integrated frontend components with 8+ REST API endpoints and resolved 10+ cross-team issues in an Agile development environment.','Used Git and GitHub for collaborative source-code management and earned the IBM Web Development Fundamentals Badge.'] },
  { role:'Cloud Computing Intern', company:'Microsoft Elevate (via AICTE)', mode:'Remote', duration:'Mar 2025 – May 2025', points:['Configured and tested virtual machines, storage and resource groups on Microsoft Azure across multiple cloud services.','Worked with Azure resource lifecycle management, deployment configuration and cloud infrastructure fundamentals.','Completed all program milestones and received the Microsoft Azure Internship Certificate.'] }
];
const resumeProjects = [
  { name:'CarbonIQ — AI Carbon Footprint Chatbot', tech:'Python, Flask, IBM Granite NLP, RAG, JavaScript', points:['Built a full-stack AI chatbot with Flask, RAG-based knowledge retrieval and NLP across 10+ carbon-related domains.','Optimized retrieval over a 500+ entry knowledge base to keep average query response time under 2 seconds.','Added voice interaction and a responsive 3D Earth/particle visualizer.'], demo:'carboniq-6j7c.onrender.com' },
  { name:'AI Smart Queue Management System', tech:'Python, YOLOv8, OpenCV, Streamlit, SQLite3', points:['Built a real-time people-detection pipeline using YOLOv8 and OpenCV, processing live camera feeds at 20+ FPS in testing.','Developed a Streamlit dashboard for live statistics, trends and historical queue data with automated PDF and CSV reporting.','Implemented SQLite-based audit trails and automated queue monitoring for multiple people in a frame.'], demo:null },
  { name:'HeatShield AI — Heat-Risk Intelligence Platform', tech:'Python, Machine Learning, Flask, React, REST API', points:['Built an AI-powered platform delivering environmental heat-risk insights, predictions and actionable recommendations.','Started with a rule-based risk-scoring engine, then layered a trained ML model on top for improved prediction accuracy.','Connected a Flask backend to a React frontend via REST APIs for real-time risk visualization.'], demo:null }
];
const educationInfo = { degree:'B.Tech — Data Science', duration:'2023 – 2027', institute:'Moradabad Institute of Technology, Uttar Pradesh', cgpa:'7.0+' };
const leadership = [
  'Team Lead for a major campus-intelligence project, coordinating design, development and delivery.',
  'Campus Ambassador — BECon 2026, Entrepreneurship Development Cell, IIT Delhi (Dec 2025 – Feb 2026).',
  'Coordinator, SecureX Cyber Society — college cybersecurity society, leading awareness initiatives and peer learning.',
  '1st Prize, Web Crackers — MIT Tech Club, Moradabad Institute of Technology (2025–26).'
];
const resumeCertifications = [
  'National Internship Program (Pega) — Pegasystems Worldwide India × SmartBridge (AICTE)',
  'Introduction to Data Science & Python for Data Science and AI — IBM (Coursera)',
  'App Development on Pega Platform — Pega Academy',
  'Microsoft Azure Internship Certificate — Microsoft Elevate (AICTE)',
  'Web Development Fundamentals Badge — IBM (AICTE)'
];
const certificates = [
  // Certifications — courses & training completions
  { title:'Claude Code in Action', issuer:'Anthropic', date:'Mar 2026', file:'/certificates/claude-code-in-action.png', category:'Certifications' },
  { title:'Microsoft Azure — 25-Hour Course', issuer:'Microsoft Elevate × AICTE', date:'Feb 2026', file:'/certificates/microsoft-azure-course.png', category:'Certifications' },
  { title:'Microsoft Azure — Internship Completion', issuer:'Microsoft Elevate × AICTE', date:'Feb 2026', file:'/certificates/microsoft-azure-internship.png', category:'Certifications' },
  { title:'Frontend Web Development', issuer:'Edunet Foundation × IBM SkillsBuild × AICTE', date:'Sep 2025', file:'/certificates/edunet-frontend-webdev.png', category:'Certifications' },
  { title:'National Internship Program — Pega', issuer:'Pegasystems × SmartBridge × AICTE', date:'Sep 2026', file:'/certificates/pega-national-internship.png', category:'Certifications' },
  // Achievements & awards
  { title:'Web Crackers — 1st Prize', issuer:'MIT Tech Club', date:'2025–26', file:'/certificates/web-crackers-1st-prize.png', category:'Achievements & Awards' },
  { title:'Intellitools AI Workshop', issuer:'CSSS · Moradabad Institute of Technology', date:'May 2025', file:'/certificates/mit-csss-intellitools-ai.png', category:'Achievements & Awards' },
  { title:'Hobbies Club Event — 3rd Position', issuer:'Moradabad Institute of Technology', date:'Nov 2023', file:'/certificates/hobbies-club-appreciation.png', category:'Achievements & Awards' },
  { title:'Creative Vision (Poster Making) — 3rd Prize', issuer:'Hobbies Club · Moradabad Institute of Technology', date:'Apr 2024', file:'/certificates/hobbies-club-3rd-prize-2024.png', category:'Achievements & Awards' },
  { title:'Technovation & Roboshow', issuer:'MIT Tech Club', date:'2025', file:'/certificates/mit-techclub-technovation-roboshow.png', category:'Achievements & Awards' },
  { title:'Samagra 2025 — Techno-Cultural Fest', issuer:'Institute of Technology & Science, Ghaziabad', date:'Apr 2025', file:'/certificates/samagra-2025-its-ghaziabad.png', category:'Achievements & Awards' },
  { title:'Pixel Vinayka — 3rd Position', issuer:'AIML Student\'s Society, MIT', date:'Aug 2025', file:'/certificates/aimlss-pixel-vinayka-3rd.png', category:'Achievements & Awards' },
  { title:'Matdata Jagrukta Abhiyan — 2nd Position', issuer:'NSS × SWEEP, MIT Moradabad', date:'Apr 2024', file:'/certificates/nss-sweep-voter-awareness.png', category:'Achievements & Awards' },
  // Leadership & recommendations
  { title:'Campus Ambassador — Letter of Recommendation', issuer:'eDC, IIT Delhi', date:'Feb 2026', file:'/certificates/edc-iit-delhi-lor.png', category:'Leadership & Recommendations' },
  { title:'BECon 2026 — Campus Ambassador', issuer:'eDC, IIT Delhi', date:'Feb 2026', file:'/certificates/becon-2026-participation.png', category:'Leadership & Recommendations' }
];
const certCategories = ['Certifications','Achievements & Awards','Leadership & Recommendations'];

// ---------- Universal knowledge index for Kanak AI's smart fallback ----------
// Every fact below (projects, skills, internships, certificates, leadership, education) is
// indexed here so that even off-pattern questions can be matched to the closest real answer,
// instead of falling back to a generic "I don't know" reply.
const knowledgeIndex = [
  ...resumeProjects.map(p=>({ text:`${p.name} ${p.tech} ${p.points.join(' ')}`, answer:`${p.name} — built with ${p.tech}. ${p.points.join(' ')}${p.demo?` Live demo: ${p.demo}`:''}` })),
  ...projects.map(p=>({ text:`${p.title} ${p.type} ${p.description} ${p.tags.join(' ')}`, answer:`${p.title} (${p.type}, ${p.year}) — ${p.description} Built with ${p.tags.join(', ')}.` })),
  ...internships.map(i=>({ text:`${i.role} ${i.company} ${i.mode} ${i.points.join(' ')}`, answer:`${i.role} — ${i.company} (${i.mode}, ${i.duration}). ${i.points.join(' ')}` })),
  ...certificates.map(c=>({ text:`${c.title} ${c.issuer} ${c.category}`, answer:`${c.title} — ${c.issuer} (${c.date}), under ${c.category}.` })),
  ...skills.map(sk=>({ text:`${sk[0]} ${sk[1]}`, answer:`${sk[0]} — ${sk[1]}. Kanak rates this around ${sk[3]}/100 in hands-on proficiency.` })),
  ...resumeSkills.map(sk=>({ text:sk, answer:`Yes, Kanak has hands-on experience with ${sk}.` })),
  { text:'leadership campus ambassador club society secure secex iit delhi becon', answer: `Leadership: ${leadership.join(' ')}` },
  { text:'education cgpa degree college university moradabad institute technology', answer:`${educationInfo.degree} (${educationInfo.duration}) at ${educationInfo.institute}. CGPA: ${educationInfo.cgpa}.` },
  { text:'certification badge azure ibm microsoft elevate', answer:`Certifications: ${resumeCertifications.join('; ')}.` }
];
const searchKnowledge = s=>{
  const words = s.split(/[^a-z0-9]+/).filter(w=>w.length>2);
  if(!words.length) return null;
  let best=null, bestScore=0;
  for(const item of knowledgeIndex){
    const lower = item.text.toLowerCase();
    let score=0;
    for(const w of words) if(lower.includes(w)) score++;
    if(score>bestScore){ bestScore=score; best=item; }
  }
  return bestScore>=1 ? best.answer : null;
};

function App(){
  const [themeMode,setThemeMode]=useState('dark'); // dark | light | neon | midnight | sepia
  const [themeMenuOpen,setThemeMenuOpen]=useState(false);
  const [menu,setMenu]=useState(false);
  const [focusMode,setFocusMode]=useState(false);
  const [devDashboard,setDevDashboard]=useState(false);
  const [analyticsOpen,setAnalyticsOpen]=useState(false);
  const [easterEgg,setEasterEgg]=useState(false);
  const [certOpen,setCertOpen]=useState(null);
  const [openNote,setOpenNote]=useState(null);
  const [visitCount,setVisitCount]=useState(0);
  const [palette,setPalette]=useState(false);
  const [ai,setAi]=useState(false);
  const [activeProject,setActiveProject]=useState(null);
  const [filter,setFilter]=useState('All');
  const [query,setQuery]=useState('');
  const [scroll,setScroll]=useState(0);
  const [typed,setTyped]=useState('');
  const roles=['AI / ML','Full-Stack','Data Science'];
  const [roleIndex,setRoleIndex]=useState(0);
  const [form,setForm]=useState({name:'',email:'',company:'',message:'',website:''});
  const [sendState,setSendState]=useState('idle'); // idle | sending | sent | error
  const [activeStep,setActiveStep]=useState(0);
  const [tab,setTab]=useState('pipeline'); // pipeline | case
  const [temp,setTemp]=useState(38);
  const [recruiter,setRecruiter]=useState(false);
  const [resumeOpen,setResumeOpen]=useState(false);
  const [resumeExists,setResumeExists]=useState(null);
  useEffect(()=>{
    if(!resumeOpen)return;
    let live=true;
    fetch('/resume.pdf',{method:'HEAD'}).then(r=>{
      const type=r.headers.get('content-type')||'';
      if(live)setResumeExists(r.ok&&type.includes('pdf'));
    }).catch(()=>{ if(live)setResumeExists(false) });
    return()=>{live=false};
  },[resumeOpen]);
  const [aiInput,setAiInput]=useState('');
  const [chat,setChat]=useState([]);
  const [skillFilter,setSkillFilter]=useState(null);
  const logoClicks=useRef([]);
  const secretLogoClick=()=>{
    const now=Date.now();
    logoClicks.current=[...logoClicks.current.filter(t=>now-t<2000),now];
    if(logoClicks.current.length>=5){ logoClicks.current=[]; setDevDashboard(true) }
  };

  const radar=useMemo(()=>{
    const n=radarSkills.length, cx=150, cy=150, maxR=95;
    const angleFor=i=>(-90+i*(360/n))*Math.PI/180;
    const valueFor=name=>{ const s=skills.find(s=>s[0]===name); return s?s[3]:50 };
    const pts=radarSkills.map((name,i)=>{
      const v=valueFor(name), a=angleFor(i), r=maxR*(v/100);
      const axisX=cx+maxR*Math.cos(a), axisY=cy+maxR*Math.sin(a);
      const labelR=maxR+28;
      return { x:cx+r*Math.cos(a), y:cy+r*Math.sin(a), name, v, axisX, axisY,
        labelX:cx+labelR*Math.cos(a), labelY:cy+labelR*Math.sin(a),
        anchor: Math.abs(axisX-cx)<8 ? 'middle' : (axisX>cx?'start':'end') };
    });
    const rings=[0.25,0.5,0.75,1].map(f=>radarSkills.map((_,i)=>{ const a=angleFor(i), r=maxR*f; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}` }).join(' '));
    return { pts, rings, cx, cy };
  },[]);

  const risk=useMemo(()=>{
    if(temp<30) return {label:'LOW',pct:22,color:'#86efac',tip:'Comfortable conditions — normal outdoor activity is fine.'};
    if(temp<35) return {label:'MODERATE',pct:48,color:'#fde047',tip:'Stay hydrated and take breaks in shade during peak hours.'};
    if(temp<41) return {label:'HIGH',pct:75,color:'#fb923c',tip:'Stay hydrated. Avoid peak afternoon exposure. Wear light clothing.'};
    return {label:'SEVERE',pct:96,color:'#f87171',tip:'Avoid outdoor exposure. Hydrate constantly. Watch for heat-stroke symptoms.'};
  },[temp]);

  // Small helper so replies don't feel robotic/repetitive on repeated similar questions
  const pick=arr=>arr[Math.floor(Math.random()*arr.length)];

  const answerAI=q=>{
    const raw=q.trim();
    const s=raw.toLowerCase();
    if(!s) return "Ask me anything about Kanak — skills, projects, resume, education or how to get in touch!";

    // ---------- Small talk / greetings (handled first so casual chat feels natural) ----------
    if(/^(hi+|hie|hey+|hello+|yo+|hola|namaste|namaskar|salaam)\b/.test(s) || s==='hi' || s==='hii' || s==='helo')
      return pick([
        "Hey! 👋 I'm Kanak AI. Ask me about Kanak's skills, projects, resume or how to get in touch.",
        "Hello there! Great to see you here. Want to know about Kanak's projects, skills, or experience?",
        "Hi! 😊 I can tell you about Kanak's AI/ML work, full-stack projects, education or contact details — what would you like to know?"
      ]);
    if(/kaise ho|kaisa hai|how are you|how r u|how're you/.test(s))
      return pick([
        "I'm doing great, thanks for asking! 😄 How can I help you learn more about Kanak?",
        "All good on my end! Curious about a specific project or skill of Kanak's?"
      ]);
    if(/^(thanks|thank you|thankyou|shukriya|dhanyavad|tysm|ty)\b/.test(s))
      return pick(["You're welcome! 🙌 Anything else you'd like to know about Kanak?","Anytime! Happy to answer more — projects, skills, resume, contact, all covered."]);
    if(/^(bye|goodbye|see you|alvida|tata)\b/.test(s))
      return "Take care! 👋 Feel free to reach out to Kanak directly via the contact section if you'd like to connect.";
    if(/who are you|what are you|what can you do|your name/.test(s))
      return "I'm Kanak AI — a portfolio assistant. I know all about Kanak's education, skills, projects, achievements, certificates and how to get in touch. Just ask!";
    if(/(joke|funny|lol)/.test(s))
      return "Haha, I'm better at talking code than comedy 😅 — but ask me about Kanak's projects, I promise those are impressive!";
    if(/who (built|made|coded|designed) this|who built the (site|portfolio|website)/.test(s))
      return "Kanak built this entire portfolio himself — React, a custom design system, this AI assistant and all — as a showcase of his full-stack skills.";
    if(/download.*resume|resume.*download/.test(s))
      return "The resume here is view-only (no download button) — but you can read the full PDF in the Resume viewer, or reach out via email/contact form and Kanak can send it directly.";
    if(/what (is this|site is this)|about this (site|portfolio|website)/.test(s))
      return "This is Kanak Verma's personal portfolio — showcasing his projects, skills, internships, certificates and a bit about how he works. Feel free to explore any section, or ask me directly!";

    // ---------- Identity / about ----------
    if(/who is kanak|kanak kaun|about kanak|tell me about (him|kanak)|summary|profile/.test(s))
      return resumeSummary;
    if(/education|college|university|degree|b\.?tech|study|moradabad|cgpa|gpa|marks/.test(s))
      return `${educationInfo.degree} (${educationInfo.duration}) at ${educationInfo.institute}, with a CGPA of ${educationInfo.cgpa}.`;
    if(/location|based|where.*(live|from)|city|country/.test(s))
      return "Kanak is based in Moradabad, Uttar Pradesh, India, and open to remote or on-site opportunities.";
    if(/available|hire|opportunit|open to work/.test(s))
      return "Yes — Kanak is currently seeking Software Development or Full Stack Development opportunities, including internships and full-time roles. Reach out via the contact section anytime!";
    if(/phone|number|call|mobile|whatsapp number/.test(s))
      return `You can reach Kanak by phone/WhatsApp at ${PHONE_NUMBER}, or by email at ${CONTACT_EMAIL}.`;

    // ---------- Internships / work experience (from resume — most accurate source) ----------
    const internshipMatch = internships.find(i => s.includes(i.company.toLowerCase().split(' ')[0]) || (i.company.toLowerCase().includes('ibm') && s.includes('ibm')) || (i.company.toLowerCase().includes('microsoft') && s.includes('microsoft')) || (i.company.toLowerCase().includes('microsoft') && s.includes('azure')));
    if(internshipMatch)
      return `${internshipMatch.role} — ${internshipMatch.company} (${internshipMatch.mode}, ${internshipMatch.duration}). ${internshipMatch.points.join(' ')}`;
    if(/experience|internship|journey|timeline|career|training/.test(s))
      return internships.map(i=>`${i.duration}: ${i.role} — ${i.company}. ${i.points.join(' ')}`).join('\n');

    // ---------- Projects — check resume projects first (accurate names, demos, metrics) ----------
    const resumeProjectMatch = resumeProjects.find(p => {
      const key = p.name.toLowerCase();
      return s.includes(key.split(' ')[0]) || s.includes('carboniq') || (key.includes('nexbot') && s.includes('nexbot')) || (key.includes('queue') && s.includes('queue'));
    });
    if(resumeProjectMatch)
      return `${resumeProjectMatch.name} — built with ${resumeProjectMatch.tech}. ${resumeProjectMatch.points.join(' ')}${resumeProjectMatch.demo?` Live demo: ${resumeProjectMatch.demo}`:''}`;
    const projectMatch = projects.find(p => s.includes(p.title.toLowerCase()) || p.title.toLowerCase().split(' ').some(w=>w.length>4 && s.includes(w)));
    if(projectMatch)
      return `${projectMatch.title} (${projectMatch.type}, ${projectMatch.year}) — ${projectMatch.description} Built with ${projectMatch.tags.join(', ')}. Open the Project Lab card above to see the full pipeline and case study.`;
    if(/project|build|portfolio work|what.*(made|built|created)/.test(s))
      return `Kanak's key projects: ${resumeProjects.map(p=>p.name).join(', ')}, plus concept builds like ${projects.map(p=>p.title).join(', ')}. Ask about any one by name for details!`;

    // ---------- Skills (merges displayed skills + full resume skill list) ----------
    const allSkillNames = Array.from(new Set([...skills.map(sk=>sk[0]), ...resumeSkills]));
    const skillMatch = skills.find(sk => s.includes(sk[0].toLowerCase()));
    if(skillMatch)
      return `${skillMatch[0]} — ${skillMatch[1]}. Kanak rates this around ${skillMatch[3]}/100 in hands-on proficiency.`;
    const resumeSkillMatch = resumeSkills.find(sk => s.includes(sk.toLowerCase()));
    if(resumeSkillMatch)
      return `Yes, Kanak has hands-on experience with ${resumeSkillMatch}, as used across his projects and internships.`;
    if(/skill|tech stack|technolog|stack|tools/.test(s))
      return `Core skills: ${allSkillNames.join(', ')}. Ask about any one of these for more detail!`;

    // ---------- Achievements & leadership ----------
    if(/achievement|award|prize|won|winner|recognition|leadership|ambassador|club|society/.test(s))
      return `${achievements.map(a=>`${a[0]} (${a[1]})`).join('; ')}. Leadership: ${leadership.join(' ')}`;

    // ---------- Certificates (portfolio certificates + resume certifications) ----------
    if(/certificat|certification|course|coursera|badge/.test(s))
      return `Certifications: ${resumeCertifications.join('; ')}. Also see: ${certificates.map(c=>`${c.title} — ${c.issuer} (${c.date})`).join('; ')}.`;

    // ---------- Testimonials ----------
    if(/testimonial|review|feedback|recommend/.test(s)){
      const t=pick(testimonials);
      return `"${t.quote}" — ${t.name}, ${t.role}`;
    }

    // ---------- Resume ----------
    if(/resume|cv/.test(s))
      return `${resumeSummary} Open the Resume viewer to see the full PDF, or ask me about a specific internship, project, skill or certification.`;

    // ---------- Contact ----------
    if(/contact|email|reach|linkedin|github|connect|message|hire me/.test(s)){
      const parts=[`You can email Kanak at ${CONTACT_EMAIL}`, `call/WhatsApp at ${PHONE_NUMBER}`, `connect on LinkedIn (${LINKEDIN_URL})`, `check out the code on GitHub (${GITHUB_PROFILE_URL})`];
      return parts.join(', ')+ '. Or just use the contact form below!';
    }

    // ---------- Smart fallback — search the full knowledge index before giving up ----------
    const smartMatch = searchKnowledge(s);
    if(smartMatch) return smartMatch;

    return pick([
      "I can tell you about Kanak's projects, skills, internships, education, achievements, certifications or how to get in touch — what would you like to know?",
      "Not sure I caught that! Try asking about a specific project (like CarbonIQ or NexBot Pro), a skill (like Python or React), or an internship.",
      "Good question — I might not have that exact info, but I know all about Kanak's projects, skills, internships and contact details. Ask away!"
    ]);
  };
  const askAI=async q=>{
    if(!q.trim())return;
    setChat(c=>[...c,{role:'user',text:q}]);
    setAiInput('');
    if(AI_BACKEND_URL){
      try{
        const res=await fetch(AI_BACKEND_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
        const data=await res.json();
        setChat(c=>[...c,{role:'ai',text:data.answer||answerAI(q)}]);
        return;
      }catch(e){ /* backend unavailable — fall through to rule-based */ }
    }
    setChat(c=>[...c,{role:'ai',text:answerAI(q)}]);
  };

  useEffect(()=>{
    document.documentElement.classList.toggle('light',themeMode==='light');
    document.documentElement.classList.toggle('neon',themeMode==='neon');
    document.documentElement.classList.toggle('midnight',themeMode==='midnight');
    document.documentElement.classList.toggle('sepia',themeMode==='sepia');
  },[themeMode]);

  useEffect(()=>{
    if(!themeMenuOpen)return;
    const close=()=>setThemeMenuOpen(false);
    window.addEventListener('click',close);
    return ()=>window.removeEventListener('click',close);
  },[themeMenuOpen]);

  // Portfolio Analytics (demo) — local visit counter, private/demo only, no backend involved
  useEffect(()=>{
    try{
      const n=parseInt(localStorage.getItem('kv_portfolio_visits')||'0',10)+1;
      localStorage.setItem('kv_portfolio_visits',String(n));
      setVisitCount(n);
    }catch(e){}
  },[]);

  // Optional: ping a webhook once per visit so you get notified (Email/SMS) that someone is on the site
  useEffect(()=>{
    if(!NOTIFY_WEBHOOK_URL)return;
    try{
      if(sessionStorage.getItem('kv_visit_pinged'))return;
      sessionStorage.setItem('kv_visit_pinged','1');
      fetch(NOTIFY_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'visit',time:new Date().toISOString(),page:window.location.href})}).catch(()=>{});
    }catch(e){}
  },[]);

  // Easter Egg — Konami-style code: ↑ ↑ ↓ ↓ ← → ← → k
  useEffect(()=>{
    const seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','k'];
    let pos=0;
    const handler=e=>{
      const key=e.key.length===1?e.key.toLowerCase():e.key;
      if(key===seq[pos]){ pos++; if(pos===seq.length){ setEasterEgg(true); pos=0; setTimeout(()=>setEasterEgg(false),4200) } }
      else pos = key===seq[0] ? 1 : 0;
    };
    window.addEventListener('keydown',handler); return()=>window.removeEventListener('keydown',handler);
  },[]);

  useEffect(()=>{
    let i=0, deleting=false;
    const timer=setInterval(()=>{
      const word=roles[roleIndex];
      if(!deleting){ setTyped(word.slice(0,++i)); if(i===word.length){deleting=true; setTimeout(()=>{},700)} }
      else { setTyped(word.slice(0,--i)); if(i===0){deleting=false; setRoleIndex(v=>(v+1)%roles.length)} }
    }, deleting?55:90);
    return()=>clearInterval(timer)
  },[roleIndex]);
  useEffect(()=>{
    const onScroll=()=>setScroll(Math.min(100,Math.round((window.scrollY/(document.body.scrollHeight-window.innerHeight))*100)));
    window.addEventListener('scroll',onScroll); return()=>window.removeEventListener('scroll',onScroll)
  },[]);
  useEffect(()=>{
    const key=e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(true)}
      if((e.ctrlKey||e.metaKey)&&e.altKey&&e.key.toLowerCase()==='d'){e.preventDefault();setDevDashboard(v=>!v)}
      if(e.key==='Escape'){setPalette(false);setAi(false);setMenu(false);setDevDashboard(false);setAnalyticsOpen(false);setCertOpen(null);setResumeOpen(false);setActiveProject(null)}
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)
  },[]);
  useEffect(()=>{
    const els=document.querySelectorAll('.reveal'); const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
    els.forEach(e=>io.observe(e)); return()=>io.disconnect()
  },[filter]);

  const cats=['All',...new Set(projects.map(p=>p.type))];
  const shown=useMemo(()=>projects.filter(p=>filter==='All'||p.type===filter),[filter]);
  const nav=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false);setPalette(false)};
  const notifyWebhook=payload=>{
    if(!NOTIFY_WEBHOOK_URL)return;
    fetch(NOTIFY_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  };
  const submit=e=>{
    e.preventDefault();
    if(form.website){ // honeypot — a real visitor never fills this hidden field, only bots do
      setSendState('sent'); setForm({name:'',email:'',company:'',message:'',website:''}); setTimeout(()=>setSendState('idle'),4000); return;
    }
    setSendState('sending');
    // Fires immediately so an Email/SMS alert reaches you even if EmailJS isn't configured yet.
    notifyWebhook({type:'contact_form', name:form.name, email:form.email, company:form.company, message:form.message, time:new Date().toISOString()});
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name:form.name, email:form.email, company:form.company, message:form.message, title:'New portfolio contact', time:new Date().toLocaleString()
    }, { publicKey: EMAILJS_PUBLIC_KEY })
      .then(()=>{ setSendState('sent'); setForm({name:'',email:'',company:'',message:'',website:''}); setTimeout(()=>setSendState('idle'),4000); })
      .catch(()=>{
        // Fallback so the message still reaches you even before EmailJS is configured
        const body=encodeURIComponent(`Hi Kanak,\n\nName: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`);
        window.location.href=`mailto:${CONTACT_EMAIL}?subject=Portfolio%20Contact&body=${body}`;
        setSendState('error'); setTimeout(()=>setSendState('idle'),4000);
      });
  };

  return <div className={`app${focusMode?' focusOn':''}${themeMode==='neon'?' neonApp':''}`}>
    <div className="progress" style={{width:`${scroll}%`}}/>
    <div className="noise"/><div className="grid-bg"/>
    <header className="nav">
      <a className="brand" onClick={()=>{nav('home');secretLogoClick()}}><span className="brandMark">K</span><span>Kanak<span className="grad">.</span></span></a>
      <nav className={menu?'links open':'links'}>{['home','about','skills','projects','journey','contact'].map(x=><a key={x} onClick={()=>nav(x)}>{x}</a>)}
        <a className="mobileExtra" onClick={()=>{setResumeOpen(true);setMenu(false)}}><FileSearch size={13}/> Resume</a>
        <a className="mobileExtra" onClick={()=>{setRecruiter(!recruiter);setMenu(false)}}><Users size={13}/> Recruiter mode</a>
        <a className="mobileExtra" onClick={()=>{setFocusMode(!focusMode);setMenu(false)}}><Eye size={13}/> Focus mode</a>
      </nav>
      <div className="navRight">
        <button className={recruiter?'recruiterBtn active':'recruiterBtn'} onClick={()=>setRecruiter(!recruiter)} title="Recruiter mode"><Users size={14}/> Recruiter {recruiter?'ON':'Mode'}</button>
        <button className={focusMode?'iconBtn active':'iconBtn'} onClick={()=>setFocusMode(!focusMode)} title="Focus mode — minimal UI" aria-label="Toggle focus mode">{focusMode?<EyeOff size={16}/>:<Eye size={16}/>}</button>
        <button className="iconBtn" onClick={()=>setResumeOpen(true)} title="View resume" aria-label="View resume"><FileSearch size={16}/></button>
        <button className="iconBtn" onClick={()=>setPalette(true)} title="Command palette" aria-label="Open command palette"><Command size={16}/></button>
        <div className="themePicker" onClick={e=>e.stopPropagation()}>
          <button className="iconBtn" onClick={()=>setThemeMenuOpen(o=>!o)} title="Choose theme" aria-label="Choose theme">
            {({dark:<Moon size={16}/>,light:<Sun size={16}/>,neon:<Wand2 size={16}/>,midnight:<Network size={16}/>,sepia:<BookOpen size={16}/>})[themeMode]}
          </button>
          {themeMenuOpen&&<div className="themeMenu">
            {[['dark','Dark',<Moon size={14}/>],['light','Light',<Sun size={14}/>],['neon','AI Neon',<Wand2 size={14}/>],['midnight','Midnight',<Network size={14}/>],['sepia','Sepia',<BookOpen size={14}/>]].map(([id,label,icon])=>
              <button key={id} className={themeMode===id?'themeOpt active':'themeOpt'} onClick={()=>{setThemeMode(id);setThemeMenuOpen(false)}}>
                <span className={`themeSwatch swatch-${id}`}/>{icon}{label}
              </button>
            )}
          </div>}
        </div>
        <button className="talk" onClick={()=>nav('contact')}>Let's talk <ArrowUpRight size={15}/></button>
        <button className="menuBtn" onClick={()=>setMenu(!menu)} aria-label={menu?'Close menu':'Open menu'}>{menu?<X/>:<Menu/>}</button>
      </div>
    </header>

    {recruiter&&<div className="recruiterBar wrap">
      <div className="recruiterBarInner">
        <span><Users size={14}/> Recruiter Mode — the essentials, fast</span>
        <div className="recruiterLinks">
          <button onClick={()=>nav('skills')}>Skills <ChevronRight size={13}/></button>
          <button onClick={()=>nav('projects')}>Projects <ChevronRight size={13}/></button>
          <button onClick={()=>nav('journey')}>Experience <ChevronRight size={13}/></button>
          <button onClick={()=>setResumeOpen(true)}>Resume <ChevronRight size={13}/></button>
          <button onClick={()=>nav('contact')}>Contact <ChevronRight size={13}/></button>
          <span className="recruiterAvail"><span className="liveDot"/> Available</span>
        </div>
      </div>
    </div>}

    <main>
      <section id="home" className="hero wrap">
        <div className="heroCopy reveal visible">
          <div className="availability"><span className="liveDot"/> Open to internships & opportunities</div>
          <div className="heroMini">HELLO, I'M KANAK <span>✦</span></div>
          <h1>Building <em>smart</em><br/>digital experiences.</h1>
          <div className="roleLine"><span>Focused on</span><strong>{typed}<i className="cursor">_</i></strong></div>
          <p className="heroLead">CSE (Data Science) student who loves turning ideas into practical products using code, AI and modern web technologies.</p>
          <div className="actions"><button className="primary" onClick={()=>nav('projects')}>Explore my work <ArrowUpRight size={17}/></button><button className="secondary" onClick={()=>nav('contact')}>Let's connect <Mail size={16}/></button></div>
          <div className="socials"><a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer"><Github/> GitHub</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a><span className="hint"><Command size={13}/> K to explore</span></div>
        </div>
        <div className="heroVisual reveal visible">
          <div className="radar"><span/><span/><span/></div>
          <div className="portrait"><img src="/images/hero.jpg" alt="Professional portrait"/><div className="scan"/><b className="corner c1"/><b className="corner c2"/><b className="corner c3"/><b className="corner c4"/></div>
          <div className="chip chip1"><BrainCircuit size={17}/><span><b>AI / ML</b><small>Build · Test · Improve</small></span></div>
          <div className="chip chip2"><Code2 size={17}/><span><b>Full Stack</b><small>React · Python · APIs</small></span></div>
          <div className="terminal"><Terminal size={13}/><span>kanak@dev</span><b>~$ ship --ideas</b><i>▋</i></div>
        </div>
      </section>

      <div className="marquee"><div>AI/ML <span>✦</span> FULL-STACK <span>✦</span> DATA SCIENCE <span>✦</span> COMPUTER VISION <span>✦</span> PRODUCT BUILDING <span>✦</span> AI/ML <span>✦</span> FULL-STACK <span>✦</span></div></div>

      <section id="about" className="section wrap">
        <div className="sectionHead reveal"><span>About</span><h2>Curiosity is the start.<br/><em>Building is the habit.</em></h2></div>
        <div className="aboutGrid"><div className="aboutPhoto reveal"><img src="/images/about.jpg" alt="Professional portrait in business attire"/><div className="photoLabel"><UserRound size={14}/> Developer · Learner · Builder</div></div><div className="aboutCopy reveal"><p className="big">I like taking a problem, breaking it down, and turning it into something people can actually use.</p><p>I'm pursuing B.Tech in Computer Science & Engineering (Data Science) at Moradabad Institute of Technology. My interests sit at the intersection of software development, AI/ML and real-world applications.</p><p>I learn best by building: choose a technology, make a working version, understand the gaps, then improve it.</p><div className="statGrid"><div><b>2023–27</b><span>B.Tech Journey</span></div><div><b>AI + WEB</b><span>Core Focus</span></div><div><b>4+</b><span>Featured Builds</span></div><div><b>∞</b><span>Learning Mode</span></div></div></div></div>
      </section>

      <section id="skills" className="section wrap soft">
        <div className="sectionHead split reveal"><div><span>Toolkit</span><h2>Technology I use to<br/><em>turn ideas into products.</em></h2></div><p>Tap a skill to see which projects actually use it.</p></div>
        <div className="skillGrid">{skills.map(([name,desc,Icon,pct],i)=>{
          const matches=projects.filter(p=>p.tags.some(t=>t.toLowerCase().includes(name.split(' ')[0].toLowerCase())||name.toLowerCase().includes(t.toLowerCase())));
          const active=skillFilter===name;
          return <div className={active?'skill open reveal':'skill reveal'} key={name} style={{'--i':i}} onClick={()=>setSkillFilter(active?null:name)}>
            <div className="skillTop"><div className="skillIcon"><Icon size={20}/></div><div><h3>{name}</h3><p>{desc}</p></div><b className="skillPct">{pct}%</b></div>
            <div className="skillBarTrack"><div className="skillBarFill reveal visible" style={{width:active||true?`${pct}%`:0}}/></div>
            {active&&<div className="skillMatches">{matches.length?matches.map(m=><a key={m.title} onClick={e=>{e.stopPropagation();setFilter(m.type);nav('projects')}}>{m.title} <ArrowUpRight size={12}/></a>):<span>Used across general problem-solving, no direct project tag.</span>}</div>}
          </div>
        })}</div>
        <div className="radarWrap reveal">
          <div className="radarHead"><span>Skill radar</span><p>A quick visual snapshot across core areas.</p></div>
          <svg viewBox="0 0 300 300" className="radarChart">
            {radar.rings.map((ring,i)=><polygon key={i} points={ring} className="radarRing"/>)}
            {radar.pts.map((p,i)=><line key={i} x1={radar.cx} y1={radar.cy} x2={p.axisX} y2={p.axisY} className="radarAxis"/>)}
            <polygon points={radar.pts.map(p=>`${p.x},${p.y}`).join(' ')} className="radarShape"/>
            {radar.pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" className="radarDot"/>)}
            {radar.pts.map((p,i)=><text key={i} x={p.labelX} y={p.labelY} className="radarLabel" textAnchor={p.anchor} dominantBaseline="middle">{p.name} · {p.v}%</text>)}
          </svg>
        </div>
        <div className="stackLine reveal"><span>Also exploring</span><b>RAG</b><b>NLP</b><b>IBM Granite</b><b>Azure</b><b>OpenAI-style apps</b><b>IoT</b></div>
      </section>

      <section id="projects" className="section wrap">
        <div className="sectionHead split reveal"><div><span>Selected work</span><h2>Projects with a<br/><em>purpose.</em></h2></div><p>Not just screenshots — each build is a chance to solve a problem, learn a stack and create something explainable.</p></div>
        <div className="filters reveal">{cats.map(c=><button className={filter===c?'active':''} onClick={()=>setFilter(c)} key={c}>{c}</button>)}</div>
        <div className="projectGrid">{shown.map((p,i)=><article className={`project ${p.accent} reveal`} key={p.title} style={{'--i':i}} onClick={()=>{setActiveProject(p);setActiveStep(0);setTab('pipeline')}}><div className="projectTop"><span>{p.type}</span><b>{p.year}</b></div><div className="mock">{p.banner?<img src={p.banner} alt={p.title} className="mockImg"/>:<><div className="mockBar"><i/><i/><i/></div><div className="mockBody"><div className="dashTitle"/><div className="dashCards"><i/><i/><i/></div><div className="dashGraph"><span/><span/><span/><span/><span/><span/></div></div></>}<div className="mockGlow"/></div><div className="projectBody">{p.status&&<div className="statusBadge">{p.status}</div>}<h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="projectCta">View project <ArrowUpRight size={15}/></div></div></article>)}</div>
      </section>

      <section className="section wrap buildSection"><div className="buildCard reveal"><div className="buildOrb"><Network size={48}/></div><div><span className="kicker">How I approach a build</span><h2>Problem → Prototype → <em>Product.</em></h2><p>I care about understanding the problem first, keeping the first version simple, then iterating with better UX, cleaner code and smarter technology.</p></div><div className="process"><div><b>01</b><span>Understand</span></div><div><b>02</b><span>Design</span></div><div><b>03</b><span>Build</span></div><div><b>04</b><span>Improve</span></div></div></div></section>

      <section id="journey" className="section wrap soft">
        <div className="sectionHead reveal"><span>Journey</span><h2>Learning, leading,<br/><em>moving forward.</em></h2></div>
        <div className="journey">{journey.map(({date,title,text,icon:Icon},i)=><div className="journeyItem reveal" key={title}><div className="jDate">{date}</div><div className="jDot"><Icon size={16}/></div><div className="jContent"><h3>{title}</h3><p>{text}</p></div></div>)}</div>
      </section>

      <section className="section wrap achievements"><div className="sectionHead reveal"><span>Highlights</span><h2>Proof of <em>progress.</em></h2></div><div className="achievementGrid">{achievements.map(([big,title,sub],i)=><div className="achievement reveal" key={title}><Award size={19}/><b>{big}</b><h3>{title}</h3><span>{sub}</span></div>)}</div></section>

      <section id="testimonials" className="section wrap soft">
        <div className="sectionHead reveal"><span>Kind words</span><h2>What people I've<br/><em>worked with say.</em></h2></div>
        <div className="testiGrid">{testimonials.map((t,i)=><div className="testiCard reveal" key={i}>
          <Sparkles size={16}/>
          <p>"{t.quote}"</p>
          <div className="testiWho"><b>{t.name}</b><span>{t.role}</span></div>
        </div>)}</div>
      </section>

      <section id="certificates" className="section wrap">
        <div className="sectionHead reveal"><span>Certificates</span><h2>Learning made<br/><em>official.</em></h2></div>
        <p className="certSummary">{certificates.length} certificates, awards & recommendations across {certCategories.filter(cat=>certificates.some(c=>c.category===cat)).length} areas — internships, competitions and leadership.</p>
        {certCategories.map(cat=>{
          const items = certificates.filter(c=>c.category===cat);
          if(!items.length) return null;
          return (
            <div className="certGroup" key={cat}>
              <h3 className="certGroupTitle">{cat}</h3>
              <div className="certGrid">{items.map(c=><div className="certCard reveal" key={c.title} onClick={()=>setCertOpen(c)}>
                <div className="certThumb"><img src={c.file} alt={c.title} loading="lazy" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/><div className="certThumbFallback"><BadgeCheck size={26}/></div></div>
                <div className="certCardBody"><h3>{c.title}</h3><span>{c.issuer} · {c.date}</span>
                <div className="certView"><Maximize2 size={12}/> View certificate</div></div>
              </div>)}</div>
            </div>
          );
        })}
      </section>

      <section id="notes" className="section wrap soft">
        <div className="sectionHead reveal"><span>Notes</span><h2>Short things<br/><em>I've learned.</em></h2></div>
        <div className="notesList">{notes.map((n,i)=><div className="noteCard reveal" key={i}>
          <button className="noteHead" onClick={()=>setOpenNote(openNote===i?null:i)}>
            <div><span className="noteDate">{n.date}</span><h3>{n.title}</h3></div>
            <ChevronDown size={18} className={openNote===i?'noteChevron open':'noteChevron'}/>
          </button>
          <p className="noteExcerpt">{n.excerpt}</p>
          {openNote===i&&<p className="noteBody">{n.body}</p>}
        </div>)}</div>
      </section>

      <section className="section wrap services"><div className="serviceIntro reveal"><span>What I bring</span><h2>Three things I like<br/><em>doing well.</em></h2></div><div className="serviceGrid"><div className="service reveal"><span>01</span><Code2/><h3>Build for the web</h3><p>Clean, responsive interfaces with React, JavaScript, HTML and CSS — focused on clarity and usability.</p></div><div className="service reveal"><span>02</span><BrainCircuit/><h3>Add intelligence</h3><p>ML, computer vision and AI concepts used where they genuinely improve a product or workflow.</p></div><div className="service reveal"><span>03</span><Rocket/><h3>Ship & learn</h3><p>Turn an idea into a working demo, test it, explain it clearly and iterate based on what actually matters.</p></div></div></section>

      <section className="section wrap quote"><div className="quoteBox reveal"><Sparkles/><p>“The goal isn't to know every technology. It's to know how to learn, build and solve.”</p><span>— My approach to engineering</span></div></section>

      <section id="contact" className="section wrap contact"><div className="contactBox reveal"><div className="contactHead"><span>Contact</span><h2>Let's build something<br/><em>worth showing.</em></h2><p>Open to internships, entry-level opportunities, collaborations and practical projects.</p></div><div className="contactLayout"><form onSubmit={submit}>
        <input type="text" name="website" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} className="hpField" tabIndex="-1" autoComplete="off" aria-hidden="true"/>
              <label>Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>
              <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
              <label>Company <span className="optional">(optional)</span><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Where you're reaching out from"/></label>
              <label>Message<textarea required rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me what you'd like to build..."/></label>
              <button className="primary" type="submit" disabled={sendState==='sending'}>
                {sendState==='sending'?<><Loader2 size={16} className="spin"/> Sending...</>:sendState==='sent'?<><Check size={16}/> Message sent successfully</>:<><Send size={16}/> Send message</>}
              </button>
              {sendState==='error'&&<small className="formNote">Direct send isn't configured yet — opening your email app instead.</small>}
            </form><div className="contactSide">{WHATSAPP_NUMBER&&<a className="contactCard whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Kanak, I saw your portfolio and I'd like to connect!")}`} target="_blank" rel="noreferrer"><MessageCircle/><span><small>WhatsApp</small><b>Message me directly</b></span></a>}<a className="contactCard" href={`tel:+${WHATSAPP_NUMBER}`}><Phone/><span><small>Call</small><b>+{WHATSAPP_NUMBER}</b></span></a><a className="contactCard" href={`mailto:${CONTACT_EMAIL}`}><Mail/><span><small>Email</small><b>{CONTACT_EMAIL}</b></span></a><a className="contactCard" href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin/><span><small>LinkedIn</small><b>Connect professionally</b></span></a><a className="contactCard" href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer"><Github/><span><small>GitHub</small><b>Explore my code</b></span></a><div className="location"><MapPin size={15}/> India · Available for opportunities</div></div></div></div></section>
    </main>

    <footer><div><span className="brandSmall">K</span> © {new Date().getFullYear()} Kanak Verma</div><div>Built with React <span>·</span> AI mindset <span>·</span> Curiosity</div><button onClick={()=>nav('home')}><ArrowDown size={14}/> Top</button></footer>

    {palette&&<div className="overlay" onClick={()=>setPalette(false)}><div className="palette" onClick={e=>e.stopPropagation()}><div className="searchBox"><Search size={17}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search or jump to..."/><kbd>ESC</kbd></div><div className="paletteList">{['Home','About','Skills','Projects','Journey','Testimonials','Certificates','Notes','Contact'].filter(x=>x.toLowerCase().includes(query.toLowerCase())).map(x=><button key={x} onClick={()=>nav(x.toLowerCase())}><span><Command size={14}/>{x}</span><ChevronRight size={15}/></button>)}<button onClick={()=>{setAi(true);setPalette(false)}}><span><Bot size={14}/>Ask Kanak AI</span><ChevronRight size={15}/></button></div><small>Tip: press Ctrl/Cmd + K anytime</small></div></div>}
    {activeProject&&<div className="overlay" onClick={()=>setActiveProject(null)}><div className="modal wide" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setActiveProject(null)}><X/></button>
      <span className="kicker">{activeProject.type} · {activeProject.year}</span><h2>{activeProject.title}</h2><p>{activeProject.description}</p>
      <div className="modalTags">{activeProject.tags.map(t=><span key={t}>{t}</span>)}</div>
      <div className="labTabs">
        <button className={tab==='pipeline'?'active':''} onClick={()=>setTab('pipeline')}><Workflow size={13}/> Project Lab</button>
        <button className={tab==='case'?'active':''} onClick={()=>setTab('case')}><ClipboardList size={13}/> Case Study</button>
      </div>
      {tab==='pipeline'&&<div className="labFlow">
        <div className="flowSteps">{activeProject.pipeline.map((s,i)=><React.Fragment key={s}>
          <button className={i===activeStep?'flowStep active':i<activeStep?'flowStep done':'flowStep'} onClick={()=>setActiveStep(i)}>
            <span className="flowIdx">{i+1}</span>{s}
          </button>
          {i<activeProject.pipeline.length-1&&<div className={i<activeStep?'flowArrow done':'flowArrow'}><ChevronRight size={16}/></div>}
        </React.Fragment>)}</div>
        <div className="flowDetail"><PlayCircle size={16}/><p>{activeProject.pipelineDetail[activeProject.pipeline[activeStep]]}</p></div>
        <div className="flowNav"><button disabled={activeStep===0} onClick={()=>setActiveStep(v=>Math.max(0,v-1))}>Back</button><button disabled={activeStep===activeProject.pipeline.length-1} onClick={()=>setActiveStep(v=>Math.min(activeProject.pipeline.length-1,v+1))}>Next step</button></div>
      </div>}
      {tab==='case'&&<div className="caseStudy">
        <div><b>Problem</b><p>{activeProject.caseStudy.problem}</p></div>
        <div><b>Approach</b><p>{activeProject.caseStudy.approach}</p></div>
        <div><b>Architecture</b><p>{activeProject.caseStudy.architecture}</p></div>
        <div><b>Result</b><p>{activeProject.caseStudy.result}</p></div>
        <div><b>Future improvements</b><p>{activeProject.caseStudy.future}</p></div>
      </div>}
      <div className="modalActions"><a href={activeProject.github}>GitHub <Github size={15}/></a><a href={activeProject.demo}>Live demo <ExternalLink size={15}/></a></div>
    </div></div>}
    {!ai&&<button className="aiFab" onClick={()=>setAi(true)} title="Ask Kanak AI" aria-label="Open Kanak AI chat"><Bot size={22}/><span>Ask Kanak AI</span></button>}
    {ai&&<div className="aiPanel">
      <div className="aiHead"><span><img className="aiAvatar" src="/images/avatar.jpg" alt="Kanak"/> Kanak AI</span><button onClick={()=>setAi(false)}><X size={17}/></button></div>
      <div className="aiBody">
        <div className="aiMsg">Hi! I'm the portfolio assistant. Ask me about Kanak's skills, projects, resume or experience.</div>
        {chat.length===0&&['What is Kanak\'s best AI project?','Does Kanak have React experience?','What are his core skills?','How can I contact Kanak?'].map(q=><button className="aiQ" key={q} onClick={()=>askAI(q)}>{q}</button>)}
        {chat.map((m,i)=><div className={m.role==='user'?'aiMsg user':'aiMsg'} key={i}>{m.text}</div>)}
      </div>
      <form className="aiInput" onSubmit={e=>{e.preventDefault();askAI(aiInput)}}><input value={aiInput} onChange={e=>setAiInput(e.target.value)} placeholder="Ask something..."/><button type="submit"><Send size={15}/></button></form>
    </div>}

    {resumeOpen&&<div className="overlay" onClick={()=>setResumeOpen(false)}><div className="modal resumeModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setResumeOpen(false)}><X/></button>
      <span className="kicker">Smart resume</span><h2>Kanak Verma — Resume</h2>
      {resumeExists?<div className="resumeFrameWrap"><iframe title="Resume" src="/resume.pdf" className="resumeFrame"/></div>
        :<><div className="resumeFrameWrap resumeMissing"><FileText size={28}/><p>Resume not added yet.</p><small>Add your file as <code>public/resume.pdf</code> and this preview will show it automatically.</small></div>
        <p className="resumeHint">Not seeing the PDF? Add your file as <code>/public/resume.pdf</code> in the project.</p></>}
      <div className="modalActions">
        <a onClick={()=>document.querySelector('.resumeFrame')?.contentWindow?.print()}><Printer size={15}/> Print</a>
        <a onClick={()=>{setResumeOpen(false);setAi(true);setTimeout(()=>askAI('Does Kanak have React experience?'),200)}}><Bot size={15}/> Ask AI about resume</a>
      </div>
    </div></div>}

    {certOpen&&<div className="overlay" onClick={()=>setCertOpen(null)}><div className="modal certModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setCertOpen(null)}><X/></button>
      <span className="kicker">Certificate</span><h2>{certOpen.title}</h2><p>{certOpen.issuer} · {certOpen.date}</p>
      <div className="certFrameWrap">
        <img src={certOpen.file} alt={certOpen.title} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
        <div className="certFallback"><ImageIcon size={26}/><span>Add this file at <code>{certOpen.file}</code> to show it here.</span></div>
      </div>
    </div></div>}

    {easterEgg&&<div className="easterEgg"><div className="easterInner"><Sparkles size={30}/><h2>KANAK MODE ACTIVATED</h2><p>You found the secret. Nice curiosity — that's the whole point.</p></div></div>}

    {devDashboard&&<div className="overlay" onClick={()=>setDevDashboard(false)}><div className="modal devModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setDevDashboard(false)}><X/></button>
      <span className="kicker"><Activity size={12}/> Hidden dev dashboard</span><h2>System status</h2>
      <div className="devGrid">
        <div className="devRow"><span>Frontend</span><b className="ok">ONLINE</b></div>
        <div className="devRow"><span>Kanak AI</span><b className={AI_BACKEND_URL?'ok':'warn'}>{AI_BACKEND_URL?'REAL AI CONNECTED':'RULE-BASED (demo)'}</b></div>
        <div className="devRow"><span>Contact form</span><b className={EMAILJS_SERVICE_ID==='YOUR_SERVICE_ID'?'warn':'ok'}>{EMAILJS_SERVICE_ID==='YOUR_SERVICE_ID'?'NOT CONFIGURED':'EMAILJS READY'}</b></div>
        <div className="devRow"><span>Instant alerts</span><b className={NOTIFY_WEBHOOK_URL?'ok':'warn'}>{NOTIFY_WEBHOOK_URL?'WEBHOOK ACTIVE':'NOT CONFIGURED'}</b></div>
        <div className="devRow"><span>Theme mode</span><b className="ok">{themeMode.toUpperCase()}</b></div>
        <div className="devRow"><span>Local visit count</span><b className="ok">{visitCount}</b></div>
      </div>
      <button className="secondary devAnalyticsBtn" onClick={()=>{setDevDashboard(false);setAnalyticsOpen(true)}}><BarChart3 size={14}/> Open analytics (demo)</button>
      <small className="resumeHint">Shortcut: Ctrl/Cmd + Alt + D, or click the logo 5× fast. This panel is for you only — visitors won't stumble onto it by accident.</small>
    </div></div>}

    {analyticsOpen&&<div className="overlay" onClick={()=>setAnalyticsOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setAnalyticsOpen(false)}><X/></button>
      <span className="kicker"><BarChart3 size={12}/> Portfolio analytics — demo</span><h2>Visitor snapshot</h2>
      <p>This is a local, demo-only counter stored in this browser — it is <b>not</b> a real cross-visitor analytics system. Wiring up real analytics needs a small backend (or a free tool like Plausible/Vercel Analytics).</p>
      <div className="devGrid">
        <div className="devRow"><span>This browser's visits</span><b className="ok">{visitCount}</b></div>
        <div className="devRow"><span>Resume opened this session</span><b className="ok">{resumeOpen?'Yes, right now':'Not yet'}</b></div>
      </div>
    </div></div>}

    <nav className="bottomNav">
      <button onClick={()=>nav('home')}><Home size={19}/><span>Home</span></button>
      <button onClick={()=>nav('projects')}><Layers3 size={19}/><span>Work</span></button>
      <button onClick={()=>setResumeOpen(true)}><FileSearch size={19}/><span>Resume</span></button>
      <button onClick={()=>nav('contact')}><Mail size={19}/><span>Contact</span></button>
    </nav>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
