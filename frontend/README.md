# Vela — AI Resume & Job Matching Platform

> **Where Talent meets opportunity**

Vela is an AI-powered resume and job matching platform designed to help candidates understand how well their resume matches a job and improve it before applying.

The platform combines **resume parsing, ATS scoring, semantic matching, skill extraction, missing-skill detection, and AI-powered resume improvement** into one experience.

## 📌 Status

**Currently in development 🚧 — frontend only, pre-backend.**

Right now this repo contains the landing page and the early candidate portal UI. There is no backend, database, or AI service yet — those are planned (see Roadmap).

## 🚀 Planned Features

### Candidate

* 📄 Resume upload
* ✨ AI-powered resume improvement
* 🎯 ATS score
* 🔍 Resume-to-job matching
* 🧠 Semantic job matching
* 🛠️ Skill extraction
* ⚠️ Missing skills detection
* 💼 Personalized job recommendations
* 📊 Skills graph
* 💡 AI career advice
* 📁 Resume/portfolio management

### Recruiter

* 📝 Create and manage job postings
* 🤖 AI-powered candidate ranking
* 🎯 Candidate-job matching
* 📅 Interview scheduling
* 📊 Recruitment dashboard

### Company

* 👥 Manage recruiters
* 📈 Hiring analytics
* 🔄 Hiring pipeline management

### AI Capabilities (planned)

Vela is designed to handle AI-specific tasks directly within the platform rather than relying on external AI chat interfaces.

* Resume parsing
* Semantic search
* Text embeddings
* Cosine similarity
* ATS scoring
* Skill extraction
* Missing skill detection
* AI resume improvement
* Interview question generation
* Candidate ranking

## 🛠️ Tech Stack

### Currently using

* React.js
* Vite
* React Router
* Tailwind CSS
* react-hot-toast

### Planned

* **Backend:** Node.js, Express.js, MongoDB, JWT Authentication, REST APIs
* **AI / ML:** Python, Sentence Transformers, embeddings, semantic similarity, NLP
* **Infrastructure:** Docker, Redis, Cloudinary, AWS
* **Frontend additions:** Framer Motion, Axios, Lucide React (as needed)

## ⚙️ Getting Started


Setup instructions coming once the backend is in place.
```



## 🎨 Design system

* **Colors:** ink navy `#0F1A2B`, soft slate `#3C4A5E`, warm paper `#EEF0EC`, brass accent `#C98A3E`, harbor teal `#5C7A6E`, brick `#A6503E` (alerts)
* **Fonts:** Fraunces (headings), Inter (body), JetBrains Mono (data/labels)
* **Theme:** wayfinding/cartography metaphor — route diagrams, coordinate-style chips, plotted match scores

## 📁 Project structure

```
src/
  components/
    layout/       Navbar, CandidateLayout (sidebar shell), etc.
  pages/
    candidate/    Routed candidate portal screens
  data/
    candidateNav.js   Sidebar nav config
```

**Conventions:**
* `pages/` = anything with its own route
* `components/` = reusable pieces/sections with no route of their own
* Colors as Tailwind arbitrary values matching the palette above (no `tailwind.config.js` theme extension yet)

## 🧠 How Vela will work (once the backend/AI pieces are built)

```text
Resume
   ↓
Resume Parsing
   ↓
Skill & Information Extraction
   ↓
Job Description
   ↓
Text Embeddings
   ↓
Semantic Similarity
   ↓
ATS & Match Score
   ↓
Missing Skills Detection
   ↓
AI Resume Improvement
   ↓
Better Job Match
```

The matching system is designed to evaluate required skills, preferred skills, experience, keywords, resume structure, semantic similarity, missing skills, and job-specific relevance — surfaced as a match/ATS score with actionable recommendations.

## 🗺️ Roadmap

* [x] Landing page (React, responsive)
* [x] Candidate portal — sidebar layout + navigation scaffold
* [ ] Auth (signup/login UI exists; not yet connected to a backend)
* [ ] Candidate dashboard (full build-out)
* [ ] Resume upload
* [ ] Resume parsing
* [ ] ATS scoring engine
* [ ] Job matching
* [ ] Skill extraction
* [ ] Missing skill detection
* [ ] AI resume improvement
* [ ] Job recommendation system
* [ ] Skills graph
* [ ] Recruiter portal
* [ ] AI candidate ranking
* [ ] Interview scheduling
* [ ] Company portal
* [ ] Admin portal
* [ ] Backend (Express + MongoDB)
* [ ] AI/ML service
* [ ] Production deployment

## 🎯 Project goal

The goal of Vela is to make the job-search process more intelligent by helping candidates understand **why** they match a job, **what they are missing**, and **how they can improve their resume**.

For recruiters, Vela aims to reduce manual resume screening by ranking candidates according to job relevance.

## 👨‍💻 Author

**Tabish Hassan Soomra**
GitHub: [codebytabish](https://github.com/codebytabish)

---

⭐ If you find this project interesting, consider giving the repository a star.