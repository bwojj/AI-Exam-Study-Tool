# AI Exam Study Tool
### Turn your own class materials into a fresh practice exam.

---

## What This Is

Most "practice exam" sites give you generic questions that have nothing to do with what your professor actually taught. This app reads the PDFs, slides, and notes you already have — the ones from your own class — and generates new practice questions in the same style and difficulty, on the same topics, without ever just handing back the original problems verbatim.

The backend is a FastAPI service that uses LangChain to drive Google's Gemini model, structured around three problem styles (multiple choice, short answer, and mixed format) and four difficulty levels. The frontend is React. Users upload files, configure a test, take it in a focused testing UI (with full math/LaTeX rendering and a math-aware answer input), and get instant grading and feedback — including for free-response math and theory answers, which are checked by the LLM rather than exact string matching.

---

## Live App

The app is deployed and live at **[https://ai-exam-study-tool.vercel.app](https://ai-exam-study-tool.vercel.app/)**.

---

## User Guide

You do not need to know how to code to use this app. Here is how it works:

1. **Create an account** — go to the app and register with a username and password.
2. **Upload your materials** — drag in PDFs, slides, or other class files in the Library view.
3. **Configure your test** — name it, choose how many questions (10–60), pick a difficulty (Mixed, Foundational, Advanced, Exam-grade), and pick a style (Multiple choice, Short answer, or Mixed format).
4. **Generate** — the AI reads every uploaded file and produces a new set of questions, on the same topics and at the same difficulty as your real material — never the original problems copied verbatim.
5. **Take the test** — answer one question at a time. Math and science answers get a dedicated math input (built on MathLive) with full LaTeX/KaTeX rendering for square roots, exponents, integrals, and more.
6. **Get graded instantly** — short-answer and math responses are checked by the LLM (not just string-matched), so partial reasoning and equivalent forms of an answer are recognized. Each question includes an explanation of the correct answer.
7. **Review past tests** — every generated test is saved. The Generated Tests page lists everything you've made, with accuracy tracked per attempt.

---

## Tech Stack

| Technology | Why It Was Used |
|------------|-----------------|
| **FastAPI** | Lightweight, async-first Python framework for the API. Pairs cleanly with LangChain's async chains for streaming LLM calls without blocking the server. |
| **LangChain** | Orchestrates the prompt → structured-output pipeline for both question generation and answer checking, so the LLM's response is parsed directly into typed Pydantic models instead of hand-rolled JSON parsing. |
| **Google Gemini (`gemini-2.5-flash`)** | The underlying LLM. Fast and inexpensive enough to generate a full exam (with image inputs for scanned notes) in a few seconds, while still being capable of structured, multi-step reasoning. |
| **SQLAlchemy** | ORM for the `User` and `GeneratedTests` tables. Swaps between SQLite (local dev) and PostgreSQL (production) purely based on the `DATABASE_URL` env var. |
| **PostgreSQL** | Production database, hosted on Railway alongside the API. |
| **python-jose + Passlib/bcrypt** | Hand-rolled JWT auth (not a framework like Django's), since the API surface is small enough that a custom auth router was simpler than pulling in a full auth library. |
| **React 19** | Frontend framework, chosen for component reuse across the multi-step upload → configure → test → review flow. |
| **Vite** | Frontend build tool and dev server — fast HMR while iterating on the testing UI. |
| **Tailwind CSS v4** | Utility-first styling for the app shell and layout. |
| **MathLive** | Powers the math answer input (`<math-field>`) so students can type real LaTeX-style math (exponents, square roots, fractions) instead of plain text approximations. |
| **react-markdown + remark-math + rehype-katex** | Renders LLM-generated questions and explanations as Markdown with embedded LaTeX math, so generated content (code blocks, formulas, formatting) displays correctly rather than as raw text. |
| **Railway** | Backend hosting. Simple GitHub-based deploys for the FastAPI service and its PostgreSQL database. |
| **Vercel** | Frontend hosting. Deploys the Vite/React build in seconds on every push. |

---

## Project Structure

```
AI-Exam-Study-Tool/
├── backend/
│   ├── main.py                ← FastAPI app, upload/generate, grading, and test endpoints
│   ├── auth.py                ← JWT auth router (register, login, logout)
│   ├── database.py            ← SQLAlchemy engine/session setup (SQLite locally, Postgres in prod)
│   ├── models.py               ← User and GeneratedTests ORM models
│   ├── schemas.py              ← Pydantic models for structured LLM output
│   ├── utilities.py            ← File parsing (PDF/DOCX/PPTX/images) and answer guardrails
│   ├── requirements.txt
│   └── .env                   ← GOOGLE_API_KEY, DATABASE_URL, SECRET_KEY, ALGORITHM (not committed)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Auth/                  ← Sign in / sign up
        │   ├── Shell/                 ← App shell, sidebar nav, topbar
        │   ├── Library/                ← File upload + test generation controls
        │   │   ├── Dropzone.jsx
        │   │   ├── UploadsTable.jsx
        │   │   └── GenerateStrip.jsx   ← Test name/question count/difficulty/style + generate CTA
        │   ├── Practice/               ← Generated Tests history page
        │   ├── Test/                   ← Test-taking UI
        │   │   ├── TestPage.jsx
        │   │   ├── QuestionCard.jsx
        │   │   ├── Composer.jsx
        │   │   ├── ChoiceButton.jsx
        │   │   ├── MathInput.jsx       ← MathLive-backed math answer field
        │   │   ├── MarkdownContent.jsx ← Markdown + KaTeX rendering for questions/explanations
        │   │   ├── TestStatusBar.jsx
        │   │   ├── Pager.jsx
        │   │   └── FinishScreen.jsx
        │   ├── Icons.jsx
        │   ├── Logo.jsx
        │   └── LoadingScreen.jsx
        └── services/
            ├── api.js          ← All backend API calls
            └── authStore.js    ← Session/token storage
```

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Google AI Studio API key (for Gemini)

### Backend

```bash
cd backend
```

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file inside `backend/`:

```env
GOOGLE_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

`DATABASE_URL` can point at a local SQLite file for development or a PostgreSQL connection string in production — `database.py` switches connection args automatically based on the prefix.

4. Start the server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
```

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. Make sure the backend is running first, and that the `BASE` URL in `frontend/src/services/api.js` points at your local backend.

---

## API Endpoints

### Auth (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/` | Register a new user |
| POST | `/auth/token` | Log in, returns a JWT access token |
| POST | `/auth/logout` | Log out |

### Tests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload class files + test config (type, question count, name, difficulty), generates a new test via Gemini and saves it |
| GET | `/tests` | List all tests generated by the current user |
| POST | `/check-answer` | Grade a short-answer/math response via the LLM and return correctness + feedback |
| POST | `/update-answer` | Record a user's answer (and correctness) against a saved test |

### Misc
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns the currently authenticated user |

---

## Known Issues

- Generation quality depends on how cleanly the uploaded file's text can be extracted — scanned/low-quality PDFs and dense slide decks can occasionally produce thinner questions.
- No support for re-generating or editing individual questions within an existing test — a new test must be generated from scratch.

---

## Future Improvements

- Per-question regeneration instead of regenerating an entire test
- Support for more file types beyond PDF/DOCX/PPTX/images
- Spaced-repetition style review of previously missed questions

---

## Development Notes

This project was built with AI-assisted development. Claude was used throughout
for code generation and debugging. Claude was heavily used for design and frontend
applications, to avoid tedious styling. All architecture decisions, feature scoping,
data modeling, and deployment were done independently. The goal was to ship a real,
working product — AI was a tool to do that faster, not a shortcut around
understanding the code.
