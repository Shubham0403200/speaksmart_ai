### 🚀Phase-wise roadmap & checklists (All 3 features — no-login, free)


# 🧱 PHASE 1 — PROJECT SETUP & FOUNDATIONS

**Goal:** Repo, infra, shared UI & core components ready. All features will plug into this.

* [ ] Create project: **Next.js + TypeScript + Tailwind + ShadCN UI**
* [ ] GitHub repo + CI (basic)
* [ ] ESLint, Prettier, Husky
* [ ] Env vars: `OPENAI_KEY`, `WHISPER_KEY` (if separate), `CLOUDINARY/S3`, `SENDGRID`
* [ ] Folder structure:

  ```
  /app
    /ielts
    /interview
    /conversation
    /api
  /components
  /lib
  /utils
  ```
* [ ] Basic pages:

  * `/` Landing — choose IELTS / Interview / Conversation
  * `/ielts` — IELTS flow page
  * `/interview` — Interview flow page
  * `/conversation` — General speaking page
  * `/result` — generic result page (reused)
* [ ] Global components (reusable):

  * Header, Footer, Modal
  * RecordButton (start/stop, waveform)
  * Waveform/Timer component
  * QuestionCard
  * FeedbackCard
  * ProgressBar
  * Toasts / Alerts
* [ ] Add privacy notice + short data retention text on footer/landing

---

# 🎙 PHASE 2 — CORE AUDIO + STT + STORAGE

**Goal:** Reliable recording + transcription pipeline used by all features.

* [ ] Implement client-side recording with `MediaRecorder` (large, mobile-friendly button)
* [ ] Convert audio to accepted format (.webm/.wav) and small chunks if needed
* [ ] API endpoint `POST /api/upload-audio`

  * Accept audio blob, store temporarily (Cloudinary/S3 + retention policy)
  * Call Whisper (OpenAI) or another STT and return transcript + confidence
  * Return `{ transcript, confidence, audioUrl, sessionId }`
* [ ] Show transcript immediately in UI with confidence warning if low
* [ ] Add retry/re-record flow in UI
* [ ] Add server-side cleanup job (auto-delete audio after 7 days)

---

# 🧠 PHASE 3 — LLM EVALUATION & PROMPT LAYER

**Goal:** Centralized evaluation logic & prompts for all three modules.

* [ ] Create `lib/evaluator` with functions:

  * `evaluateIELTS({part, question, transcript})`
  * `evaluateInterview({jobTitle, question, transcript, language})`
  * `evaluateConversation({topic, transcript, language, history})`
* [ ] Design consistent JSON outputs (so front-end can render easily):

  ```json
  {
    "status":"ok",
    "score": 7.5,
    "classification": "good|needs_improvement",
    "strengths":["..."],
    "improvements":["..."],
    "model_answer":"...",
    "follow_up":"...",           // for conversation module
    "youtube_suggestions":[]
  }
  ```
* [ ] Implement few-shot examples & constraints per prompt for stability
* [ ] Add fallback logic: if STT confidence < threshold, ask user to re-record

---

# 🧭 PHASE 4 — IELTS MODULE (Parts 1, 2, 3 — all run in one session)

**Goal:** Full, sequential IELTS speaking test with per-question evaluation and final report.

* [ ] Flow states:

  * Intro → Part 1 (3–5 short Qs) → Part 2 (cue card: 1 prep min + speak 1–2 min) → Part 3 (2–4 follow-ups) → Summary
* [ ] Implement question bank (seed sample questions; pull more later)
* [ ] For each question:

  * Record → upload → STT → evaluateIELTS → show feedback
* [ ] Part 2 specifics:

  * Show cue card UI with prep timer and speaking timer
  * Allow recording the full response in one blob
* [ ] After all parts:

  * Aggregate scores (average or weighted) → overall band estimate
  * Generate session JSON & PDF
* [ ] PDF includes:

  * Part-wise feedback, overall band, band-9 model answers, improvement checklist, YT links
* [ ] UI elements:

  * Progress bar showing Part 1 → 2 → 3
  * “Re-record” and “Skip” options
  * Helpful hints for each part (e.g., “Use linking words”)

---

# 💼 PHASE 5 — JOB INTERVIEW MODULE

**Goal:** Generate job-specific Qs, run sequential interview, correct bad answers & give model replies.

* [ ] Pre-form (optional inputs, no login):

  * Name (optional), Email (optional), Job Title (mandatory for question generation), Language choice (Hindi/English)
* [ ] `POST /api/generate-interview-questions`:

  * Use LLM to generate 10–15 tailored questions for the provided job title
  * Return array of `{id, question, difficulty}`
* [ ] Interview loop:

  * Show question → student records → upload → STT → evaluateInterview
  * If `classification === "good"` → show praise, score, move next
  * If `classification === "needs_improvement"` → show corrected model answer, 3 improvement tips, and offer “Try again” or “See sample answer”
* [ ] End of session:

  * Aggregate average score, strengths, top 3 areas to improve
  * Offer PDF download (same pattern as IELTS)
* [ ] Bonus UX:

  * Toggle: “Practice behavioral” vs “Technical”
  * Option to mark a question for review (human teacher later)
  * Confidence meter based on prosody/pause (optional future)

---

# 🗣 PHASE 6 — GENERAL SPEAKING / CONVERSATION MODULE

**Goal:** Open conversation practice on a chosen topic with back-and-forth evaluation.

* [ ] Pre-form: topic, language, name/email optional
* [ ] Conversation loop architecture:

  * System generates an opening prompt/question
  * User records response → STT → evaluateConversation → feedback + follow-up question
  * Keep `history` context so LLM can generate relevant follow-ups (limit tokens)
  * Stop after N turns (configurable, e.g., 6 turns) or when user ends
* [ ] Each turn returns:

  * Short feedback (1–2 lines), improvement tips, next question
* [ ] At session end:

  * Summary PDF with turn-by-turn feedback + overall tips
* [ ] UX niceties:

  * Allow user to choose conversation style: casual / professional / exam
  * “Repeat follow-up” button to practice the same follow-up again

---

# 🧾 PHASE 7 — AGGREGATE REPORTING & DOWNLOADS

**Goal:** Unified session summary format + PDF/email capability.

* [ ] Server/Client code to merge session feedback into single summary JSON
* [ ] Client-side `jsPDF` template for immediate download (no email required)
* [ ] `POST /api/send-report` (optional): send report PDF if user provided email
* [ ] Share button: WhatsApp share link to the PDF or result page (encourage viral growth)
* [ ] Include a CTA in the PDF linking to your YouTube / course

---

# 🔎 PHASE 8 — TESTING, QA & PROMPT TUNING

**Goal:** Ensure model outputs are reliable, test accents, and measure UX metrics.

* [ ] Functional testing:

  * Record/upload/transcribe cycle works on Chrome, Safari (iOS), Android browsers
  * Part 2 timers and recording blobs work reliably
* [ ] LLM QA:

  * Compare AI band scores to 10 human-labeled samples; adjust prompt
  * Tune thresholds for “good” vs “needs_improvement”
* [ ] Edge cases:

  * Low audio quality handling (auto-request re-record)
  * Mixed Hindi-English inputs (whisper handles it) — ensure prompts handle code-mixing
* [ ] Collect in-app feedback per session (thumbs up/down)
* [ ] Track metrics: sessions, completions, downloads, shares, helpfulness %

---

# 🛡️ PHASE 9 — PRIVACY, COST CONTROL & RETENTION

**Goal:** Keep user trust, control API spend, GDPR-lite care.

* [ ] Privacy note on landing + “We delete audio after 7 days” message
* [ ] Implement server-side deletion cron or Cloudinary retention
* [ ] Add request throttling / rate limits per IP to save costs
* [ ] Show “estimated processing time” while LLM works
* [ ] Add admin dashboard (simple) to monitor token usage and errors

---

# 🚀 PHASE 10 — DEPLOY & LAUNCH (NO-LOGIN ALPHA)

**Goal:** Get public traffic & feedback.

* [ ] Deploy to Vercel (or Render)
* [ ] Connect custom domain, SSL
* [ ] Add Google Analytics / PostHog
* [ ] Launch invite: Whatsapp / Telegram / YouTube community
* [ ] Collect initial user feedback, iterate weekly

---

# 📈 FUTURE / POST-VALIDATION UPGRADES (when ready)

* [ ] Add optional login & user dashboard (progress tracking)
* [ ] Add teacher review panel (paid feature)
* [ ] Add subscription gating (freemium)
* [ ] Add real-time conversational mode (WebRTC + GPT Realtime)
* [ ] Add pronunciation visualizer (spectrogram / phoneme)
* [ ] Localize UI fully in Hindi + other languages

---

# 🕒 Suggested timeline (practical)

* Phase 1: 2–3 days
* Phase 2: 3–4 days
* Phase 3: 2 days
* Phase 4 (IELTS): 4–6 days
* Phase 5 (Interview): 3–5 days (can reuse evaluator & recorder)
* Phase 6 (Conversation): 2–4 days
* Phase 7 (PDF + Email): 1–2 days
* Phase 8 (QA + Tuning): continuous; first pass 3 days
* Launch: 1 day
  **Total MVP (all 3 features): ~3–4 weeks** (if you iterate fast)

---

# ✅ Ready-to-use checkboxes (copy-paste friendly)

You can paste these into a task manager:

* [ ] Project skeleton & global components
* [ ] Client-side recorder + upload endpoint
* [ ] Whisper STT integration
* [ ] Central evaluator functions (IELTS / Interview / Conversation)
* [ ] IELTS flow (Parts 1–3) + PDF
* [ ] Interview flow (generate Qs + per-Q eval + corrections) + PDF
* [ ] Conversation flow (multi-turn) + PDF
* [ ] Frontend UX & accessibility polish
* [ ] Analytics, retention, throttling
* [ ] Deploy & share with students

---

If you want, I can **immediately** deliver one of the following next (pick one) and I’ll produce it in this reply:

1. Exact **API contract JSON schemas** for the endpoints used by all three flows (so devs can start wiring front-end to backend).
2. A complete **React/Next.js page wireframe** (component hierarchy + sample JSX structure) for the IELTS flow (Parts 1–3).
3. A set of tightly tuned **LLM prompt templates** (few-shot) for IELTS band scoring, interview evaluation, and conversational feedback.

Which one do you want now?
