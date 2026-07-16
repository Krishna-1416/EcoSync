# Smart Stadiums - Fan Companion (PromptWars Virtual Challenge)

## 🏆 Challenge Vertical: Smart Stadiums & Tournament Operations
This project addresses **[Challenge 4] Smart Stadiums & Tournament Operations** for the FIFA World Cup 2026. 

Our chosen persona is **Fans and Spectators**. We have built a GenAI-enabled assistant that resolves major pain points for stadium attendees: getting lost, dealing with language barriers, and finding the best transport routes during peak crowd times.

## 🚀 Approach and Logic

We designed a "Billion Dollar" Apple-inspired UI utilizing a **Bento Grid** and a **Monotonic Theme** (deep blacks, bright whites, frosted glass). This ensures the interface is highly tactile, extremely readable in bright or dark environments, and avoids generic UI tropes.

The core logic revolves around a context-aware chat interface:
1. **Context Injection:** The app knows where the user is (e.g., "North Gate") and what the event status is ("Match Day • 50,000+ Fans").
2. **Dynamic Routing:** It simulates processing queries like "Where is my seat?" or "Where is vegan food?" by evaluating the user's location against stadium topology.
3. **Live Transit Integration:** Simulates fetching real-time transport APIs to guide the user to the fastest exit.

## ⚙️ How the Solution Works

- **Frontend:** Built with Next.js 15 (App Router), React, Tailwind CSS v4, and Framer Motion. 
- **GenAI Interface:** The main feature is the central Chat Interface. Users type their queries, and the backend synthesizes real-time navigation instructions, food stall locations, and transit updates.
- **Accessibility:** High-contrast text, large touch targets, semantic HTML elements, and focus states ensure the app is usable by all fans.

## 🧠 Assumptions Made

1. **Connectivity:** We assume cellular networks will be congested. The app is designed to cache maps and critical routes offline, while the AI chat degrades gracefully.
2. **Scale:** We assume 50,000+ concurrent users per stadium. The backend is planned as a serverless, highly concurrent Node.js/Express environment.
3. **GenAI Layer:** For the scope of this hackathon submission, the backend LLM responses are mocked via a context-aware rule engine to simulate how a tuned GenAI model would respond to specific prompts.

## 🛠️ How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Evaluation Focus Areas Addressed

- **Code Quality:** Written in strict TypeScript, utilizing modular components (`BentoCard.tsx`, `ChatInterface.tsx`).
- **Security:** Strict separation of client/server components. Input is validated (or prepared for Zod validation on the backend).
- **Efficiency:** The Bento grid uses native CSS Grid for high-performance layout rendering without heavy JavaScript.
- **Accessibility:** Uses accessible Lucide icons and high-contrast color variables.
