# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered exam study tool that generates practice questions from uploaded PDF class materials. The LLM reads student classwork and produces new questions of the same type and difficulty (not the same problems verbatim).

## Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS, `lucide-react` for icons
- **Backend**: FastAPI + LangChain (Google Gemini)

## Architecture

**Frontend (`frontend/`)**
- Entry point: `frontend/src/main.jsx` mounts a `<Header>` component.
- Components live in `frontend/src/components/`.

**Backend (`backend/`)**
- FastAPI server backed by LangChain for LLM orchestration.
- API keys must come from `.env` (already in `.gitignore`) — never hardcode in source.
- **Do not modify any backend files without explicit instruction from the user.**

> `test.py` is an early throwaway prototype — ignore it entirely.

## Commands

**Frontend development:**
```sh
cd frontend
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

**Install frontend dependencies (after cloning):**
```sh
cd frontend && npm install
```

## Git Conventions

- Commit after each completed component or feature unit
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- Never commit broken code
- Commit message should reference the component name, e.g. `feat: add PDFUpload dropzone component`
