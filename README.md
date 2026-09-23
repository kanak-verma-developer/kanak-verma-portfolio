# Kanak Verma — Portfolio

Personal developer portfolio of **Kanak Verma** — Full Stack Developer & AI/ML Engineer, B.Tech Data Science student at Moradabad Institute of Technology.

Built with **React 18 + Vite**, featuring a resume-trained AI assistant ("Kanak AI"), a live resume viewer, and a categorized certificates & achievements showcase.

---

## ✨ Features

- **Kanak AI chatbot** — answers visitor questions about skills, projects, internships, education, certifications and contact info. Trained directly on Kanak's resume, with a smart fallback search so it can answer even loosely-phrased questions. Optionally upgradeable to a real Gemini-powered AI (see [Connecting a real AI](#-connecting-a-real-ai-google-gemini) below).
- **Resume viewer** — inline PDF preview, view-only (no download button), with a "Print" option and one-tap "Ask AI about resume".
- **Certificates & Achievements gallery** — organized into three categories (Certifications, Achievements & Awards, Leadership & Recommendations), view-only full-screen preview.
- **Contact form** — sends real emails via EmailJS (see setup below), plus direct WhatsApp, Call, Email, LinkedIn and GitHub contact cards.
- **Command Palette** (Ctrl/Cmd + K), **Focus Mode**, **Recruiter Mode**, mobile bottom nav, and a few playful extras (Easter egg, hidden dev dashboard).
- **Dark / Light / Neon** theme system, fully responsive, PWA-installable.
- **SEO-ready** — meta tags, Open Graph/Twitter cards, JSON-LD structured data, sitemap.xml, robots.txt.

---

## 🧱 Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React 18, Vite 6, plain CSS (custom design system) |
| Icons      | lucide-react                                   |
| Contact form | EmailJS                                      |
| AI backend | Google Gemini (via a Vercel serverless function) |
| Deployment | Vercel (recommended)                           |

---

## 📁 Project Structure

```
portfolio/
├── api/
│   └── ask.js              # Serverless proxy — keeps the Gemini API key server-side only
├── public/
│   ├── certificates/       # Certificate & achievement images
│   ├── images/             # Hero, about, avatar photos
│   ├── resume.pdf          # Resume shown in the in-app viewer
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.jsx             # Entire app (components, content data, chatbot logic)
│   └── styles.css           # Design system + all component styles
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal (typically `http://localhost:5173`).

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

---

## ✉️ Setting Up the Contact Form (EmailJS)

The contact form is wired to send real emails via [EmailJS](https://www.emailjs.com) (free tier: 200 emails/month).

1. Create a free EmailJS account and connect your Gmail as an **Email Service** → copy the **Service ID**.
2. Create an **Email Template** with fields `{{from_name}}`, `{{from_email}}`, `{{message}}` → copy the **Template ID**.
3. Copy your **Public Key** from Account → General.
4. In `src/main.jsx`, replace the placeholders near the top of the file:
   ```js
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```
   These are public-facing keys by EmailJS's own design (not secrets) — it's safe to keep them in the frontend.

Until configured, the form still works cosmetically but won't deliver email — the hidden dev dashboard (Ctrl/Cmd + Shift + D) shows a live "NOT CONFIGURED" / "EMAILJS READY" status for this.

---

## 🤖 Connecting a Real AI (Google Gemini)

By default, "Kanak AI" runs on a rule-based engine trained on Kanak's resume/portfolio data — fast, free, and always available. You can optionally upgrade it to real Gemini-powered answers.

A ready-made serverless proxy lives at **`api/ask.js`**. It keeps your Gemini API key on the server only — **never** in frontend code, so it can never be seen or stolen via a browser's DevTools.

### One-time setup
1. Get a free Gemini API key: https://aistudio.google.com/app/apikey
2. Push this project to a GitHub repository.
3. Import that repo into [Vercel](https://vercel.com) (free tier is enough — it auto-detects the Vite build and the `api/ask.js` function).
4. In your Vercel project → **Settings → Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: *(paste your key — only in the Vercel dashboard, never in code or version control)*
5. Redeploy. Your endpoint is now live at `https://your-site.vercel.app/api/ask`.
6. `src/main.jsx` already points to `AI_BACKEND_URL = '/api/ask'` — no code change needed.

### How the fallback works
- Locally (`npm run dev`), `/api/ask` doesn't exist, so Kanak AI automatically uses its built-in rule-based answers — nothing breaks.
- Once deployed with `GEMINI_API_KEY` set, every chat question is answered by Gemini, grounded in the resume/portfolio facts inside `api/ask.js`'s `SYSTEM_CONTEXT` block (edit this whenever the resume changes).
- If the Gemini call ever fails (quota, network, misconfiguration), it silently falls back to the rule-based answers — visitors never see an error.

### Testing locally with the real AI
Install the Vercel CLI and run `vercel dev` instead of `npm run dev`. Create a local `.env` file with:
```
GEMINI_API_KEY=your_key_here
```
This file is for local use only and is already excluded via `.gitignore` — never commit it.

---

## 🌐 Deploying to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then import the repository at [vercel.com/new](https://vercel.com/new) — Vercel handles the rest automatically. Add the `GEMINI_API_KEY` environment variable (see above) if you want the real-AI chatbot live.

---

## 🎨 Customizing Content

All content lives as plain data structures near the top of `src/main.jsx` — no need to touch component logic to update text:

| What to edit                          | Where                                    |
|----------------------------------------|-------------------------------------------|
| Contact details, social links          | `CONTACT_EMAIL`, `WHATSAPP_NUMBER`, `LINKEDIN_URL`, `GITHUB_USERNAME` |
| Projects shown in Project Lab          | `projects` array                          |
| Skills & proficiency                   | `skills` array                            |
| Certificates & achievements            | `certificates` array (add images to `public/certificates/`) |
| Internships, resume projects, education| `internships`, `resumeProjects`, `educationInfo` |
| Testimonials                           | `testimonials` array                      |
| Notes / blog posts                     | notes array (search for the `notes` const)|

Design tokens (colors, fonts, spacing) live at the top of `src/styles.css` under `:root`.

---

## 📄 License

This project is personal portfolio code belonging to Kanak Verma. Feel free to use it as a structural reference for your own portfolio, but please don't republish Kanak's personal content (name, resume, certificates, photos) as your own.
