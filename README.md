# Saathi — Student Mental Health Companion

Saathi ("companion" in Hindi) is a mental health support platform built for students. It brings together an AI-style chat companion, counselor session booking, a curated multilingual resource hub, an anonymous peer support forum, and an analytics dashboard for monitoring platform-wide wellbeing trends.

## Features

- **Talk to Saathi** — A conversational support chat with keyword-based emotion detection (stress, anxiety, sadness, loneliness), bilingual responses (English/Hindi), mood tracking with an emoji summary, chat history persistence, and chat export to JSON.
- **Book a Counselor Session** — A confidential booking form for scheduling sessions (video, phone, in-person, or text), with urgency levels and privacy messaging.
- **Resource Hub** — A searchable, filterable library of videos, audio sessions, and guides covering anxiety, sleep, academic stress, mindfulness, and more, offered in multiple regional languages (English, Hindi, Tamil, Bengali).
- **Peer Support Forum** — An anonymous community space where students can post, reply, and like posts across categories like academic stress, homesickness, and self-doubt.
- **Analytics Dashboard** — Visualized trends (via Recharts) on stress/anxiety levels, session volume, peak usage hours, and crisis alerts, intended for platform administrators.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) component library
- [React Router](https://reactrouter.com/) for client-side routing
- [Recharts](https://recharts.org/) for data visualization
- [TanStack Query](https://tanstack.com/query) for data fetching

## Getting Started

```sh
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Status

This is currently a **frontend prototype**: the chatbot uses rule-based keyword matching (not a live LLM), and booking requests, forum posts, and dashboard metrics are simulated/in-memory rather than persisted to a real backend. Planned next steps include integrating an LLM-backed chat, a database-backed API, and authentication (particularly for the admin dashboard).

## License

This project is provided as-is for educational and portfolio purposes.
