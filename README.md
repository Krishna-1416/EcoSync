# EcoSync — AI Volunteer Co-Pilot for FIFA World Cup 2026

> **Challenge Vertical:** Smart Stadiums & Tournament Operations  
> **Persona:** Volunteers & Venue Staff  
> **Live Demo:** [eco-sync-xyga.vercel.app](https://eco-sync-xyga.vercel.app)

---

## 🏆 Challenge Vertical

This project addresses **[Challenge 4] Smart Stadiums & Tournament Operations** for the FIFA World Cup 2026.

Our chosen persona is **Volunteers and Venue Staff**. Volunteers are the operational backbone of every FIFA World Cup — they guide 50,000+ fans per match in real-time, often across language barriers, and under extreme crowd pressure. A single wrong routing decision can create a crowd crush.

We built the **Volunteer Co-Pilot**: a GenAI-powered assistant that gives stadium volunteers instant, telemetry-aware crowd routing instructions and real-time translated phrases they can speak directly to fans.

---

## 🎯 Problem Statement Alignment

| FIFA 2026 Challenge | Our Solution |
|---|---|
| Crowd management & gate congestion | Live telemetry feeds gate capacity % → AI routes fans to the least congested gate |
| Multilingual fan assistance | Gemma 26B generates translated phrases per fan language on the fly |
| Volunteer decision support | Structured AI response: reasoning for volunteer + exact phrase for fan |
| Accessibility for all fans | Medical emergency routing, wheelchair-aware path guidance |
| Real-time operational intelligence | Telemetry injection panel (`/evaluator`) for live crowd state updates |
| Transportation & transit delays | Transit status cards with real-time departure data |

---

## 🛠️ Project Structure

```
/
├── frontend/          # Next.js 16 (App Router) — deployed on Vercel
│   ├── src/app/
│   │   ├── api/chat/route.ts   # Serverless AI proxy (Gemma 26B)
│   │   ├── hub/               # Volunteer dashboard (Bento Grid)
│   │   ├── navigation/        # Gate-to-seat routing
│   │   ├── transit/           # Real-time transport status
│   │   ├── amenities/         # Stadium amenity directory
│   │   └── evaluator/         # Jury telemetry injection panel
│   └── src/components/
│       ├── ChatInterface.tsx  # AI volunteer co-pilot chat (session-cached)
│       └── Navbar.tsx
│
└── backend/           # Node.js/Express — TypeScript, layered architecture
    └── src/
        ├── controllers/       # ChatController, TelemetryController, TransitController
        ├── services/          # LlmService (Gemma 26B + rule-engine fallback)
        ├── repositories/      # TelemetryRepository (live crowd data store)
        ├── validators/        # Zod schemas — strict input validation
        └── __tests__/         # 15 backend tests (Jest + Supertest)
```

---

## 🚀 Approach & Logic

### GenAI Architecture

The core AI layer uses **Google Gemma 26B** (`gemma-4-26b-a4b-it`) via the `@google/genai` SDK. The model receives:

1. **Live stadium telemetry** — gate capacity percentages, transit status
2. **Volunteer's current zone** — so routing advice is location-aware
3. **Fan's language preference** — so the AI generates a translated phrase

**Output is structured JSON:**
```json
{
  "reasoning": "Gate B is at 95% — direct fan to Gate C (20%)",
  "translatedPhrase": "Por favor use la Puerta C para una salida más rápida.",
  "actionMetadata": { "type": "SHOW_ROUTE", "target": "gate_c" }
}
```

The `actionMetadata` field drives UI map overlays in real time.

### Offline Resilience
The `LlmService` includes a **deterministic rule engine fallback** that activates when the API is unavailable. This ensures the volunteer tool never goes dark during a match — it dynamically reads the same telemetry repository to find the least congested gate even without a live AI call.

### Session Caching
The `ChatInterface` caches AI responses in `sessionStorage` keyed by query. Repeated questions (very common in volunteer shifts) return instantly without additional API calls.

---

## ⚙️ How the Solution Works

### User Flow
1. Volunteer opens the **Hub** → sees live telemetry indicators
2. Types a query: *"Fan needs to exit — Gate B is blocked"*
3. The **AI Co-Pilot** analyses gate telemetry → returns:
   - English reasoning for the volunteer
   - Translated phrase ready to speak to the fan
   - Map routing command (Gate C highlighted)
4. If the volunteer is offline, the rule engine handles the same query deterministically

### Telemetry Injection (Evaluator Panel)
Judges / evaluators can inject custom crowd scenarios at `/evaluator` — paste JSON telemetry and the AI will respond with routing based on the injected state.

---

## 🧠 Assumptions Made

1. **Volunteer persona selected** over fan persona because volunteer routing decisions have higher operational impact (one volunteer guides hundreds of fans per shift).
2. **Cellular congestion at stadiums** is assumed — the offline rule engine ensures the tool works without live API access.
3. **Gate telemetry** is simulated via the `TelemetryRepository`. In production, this would be connected to real sensor feeds from stadium gate scanners.
4. **Translation accuracy** is delegated to the Gemma model, which handles FIFA's expected language set (Arabic, French, Spanish, Portuguese, English, German).

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- A Google AI Studio API key (set as `GEMINI_API_KEY`)

### Frontend (Next.js — includes AI serverless route)
```bash
cd frontend
npm install
# Create a .env.local with:
# GEMINI_API_KEY=your_key_here
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Backend (Optional — standalone API)
```bash
cd backend
npm install
# Edit .env: GEMINI_API_KEY=your_key_here
npm run dev
```
Backend starts at [http://localhost:5000](http://localhost:5000)

### Run Tests
```bash
# Backend (15 tests — deterministic, no API needed)
cd backend && npm test

# Frontend (17 tests)
cd frontend && npm test
```

---

## ✅ Evaluation Focus Areas

### Code Quality *(High Impact)*
- Strict TypeScript across all files
- Layered architecture: `Routes → Controllers → Services → Repositories`
- Full JSDoc documentation on all service and controller methods
- Clean separation between AI logic (`LlmService`), data (`TelemetryRepository`), and HTTP (`ChatController`)

### Security *(High Impact)*
- **API key** is server-side only — never exposed to the browser (Next.js serverless route)
- **Rate limiting** via `express-rate-limit` (100 req/15 min per IP)
- **Input validation** via Zod — message max 2000 chars, type-safe context fields
- **JSON body size limit** (`50kb`) prevents payload injection
- **CORS** locked to known origins

### Efficiency *(Medium Impact)*
- **Session caching** (`sessionStorage`) — repeated queries return instantly
- **Offline fallback** — zero API latency when network is unavailable
- **Bento Grid layout** uses native CSS Grid (no heavy JS layout engine)
- **Serverless deployment** on Vercel — scales to 50,000+ concurrent users with zero infrastructure management

### Testing *(Medium Impact)*
- **32 total tests** across frontend and backend
- Backend: 15 tests — happy path, validation errors, health check, 404 routing, edge cases
- Frontend: 17 tests — component rendering, chat submission, network failure, session cache, accessibility assertions
- All tests are **deterministic** — no live API calls, no flakiness

### Accessibility *(Low Impact)*
- All interactive elements have `aria-label` attributes
- High-contrast monotonic theme (WCAG AA compliant contrast ratios)
- Semantic HTML5 elements throughout (`<main>`, `<header>`, `<nav>`)
- Large touch targets (minimum 44×44px) for stadium/mobile use
- `aria-hidden` on all decorative icons

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Framer Motion, Lucide Icons |
| AI Model | Google Gemma 26B (`gemma-4-26b-a4b-it`) via `@google/genai` |
| Backend | Node.js, Express, TypeScript, Zod, Sentry |
| Testing | Jest, Supertest, React Testing Library |
| Deployment | Vercel (frontend + AI route), GitHub |
| Security | express-rate-limit, CORS, Zod validation |
