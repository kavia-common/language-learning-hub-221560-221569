# Language Learning Hub – Frontend

A Vite-based web frontend for interactive language lessons, vocabulary practice, and quizzes.

## Getting started

- Install dependencies
  - npm install
- Run dev server (port 3000, strict)
  - npm run dev
- Build for production
  - npm run build
- Preview production build
  - npm run preview

The app should be available at http://localhost:3000

## Environment variables

This frontend uses the following Vite env variables (already supported by the app):
- VITE_API_BASE: Base URL for the backend REST API (e.g., https://api.example.com)
- VITE_BACKEND_URL: Alternative base URL if VITE_API_BASE is not present

Behavior:
- If neither is defined, the app falls back to mock data for Lessons, Vocabulary, and Quizzes.

Other variables present in the container are not required for this step:
- VITE_FRONTEND_URL, VITE_WS_URL, VITE_NODE_ENV, VITE_NEXT_TELEMETRY_DISABLED, VITE_ENABLE_SOURCE_MAPS, VITE_PORT, VITE_TRUST_PROXY, VITE_LOG_LEVEL, VITE_HEALTHCHECK_PATH, VITE_FEATURE_FLAGS, VITE_EXPERIMENTS_ENABLED

## Features implemented

- Ocean Professional theme with CSS variables (primary #2563EB, secondary #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827)
- App shell layout: sidebar navigation + top bar + main content
- Routing (hash-based) for:
  - Dashboard (/)
  - Lessons (/lessons), Lesson Detail (/lessons/:id)
  - Vocabulary (/vocabulary) with flashcards (Reveal / I knew it / I didn't know)
  - Quizzes (/quizzes) multiple-choice flow with scoring, review, and retake
- Minimal store with localStorage persistence:
  - Lesson progress per lesson
  - Vocabulary known/unknown counters
  - Last quiz result
- API client stub using VITE_API_BASE or VITE_BACKEND_URL with mock fallback

## Accessibility

- Semantic roles and ARIA labels for navigation, buttons, and interactive elements
- Focus-visible outlines on buttons and keyboard interactions for flashcards

## Notes

- No backend is required to run the app; mock data is used if no API base is configured.
- To switch to a real backend, set VITE_API_BASE in your environment and ensure CORS is configured.