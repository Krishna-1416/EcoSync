# EcoSync - AI Carbon Footprint Tracker

EcoSync is a modern carbon footprint tracking web application designed to help users monitor, understand, and reduce their environmental impact. By analyzing purchasing and consumption habits, EcoSync provides actionable, AI-driven green nudges to encourage sustainable choices.

## 🚀 Features

- **Real-time Carbon Footprint Estimation:** Automatically calculates CO₂ emissions based on items added to the cart.
- **AI-Powered Green Nudges:** Suggests eco-friendly alternatives to high-carbon items.
- **Interactive Visualizations:** Easy-to-understand charts showing emission trends.
- **Customizable Preferences:** Fine-tune target emission goals and tracking settings.

---

## 📂 Project Structure

The project follows a clean Next.js App Router structure:

```
Virtual Promptwar 3/
├── src/
│   ├── __tests__/           # Unit and integration tests (Jest)
│   ├── app/                 # Next.js pages, API routes, and styles
│   │   ├── api/             # API handlers (AI chat assistance)
│   │   ├── settings/        # User preferences and goals
│   │   ├── tracker/         # Carbon tracking dashboard
│   │   ├── globals.css      # Core Tailwind/CSS styling
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main Landing Page
│   ├── components/          # Reusable UI components
│   │   ├── Cart.tsx         # Shopping cart and emission calculator
│   │   ├── Header.tsx       # Navigation bar
│   │   ├── NudgeDisplay.tsx # Sustainable alternative recommender
│   │   └── Settings.tsx     # Goal & preference controller
│   └── types/               # TypeScript interfaces & types
├── public/                  # Static assets & icons
├── jest.config.js           # Jest configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🛠️ Development

To start the development server:

```bash
npm run dev
```

To run tests:

```bash
npm test
```
