# Saathi — Student Mental Health Companion

Saathi ("companion" in Hindi) is a mental health support platform built for students. It brings together an AI-powered chat companion, counselor session booking, a curated resource hub, and an anonymous peer support forum.

## Features

- **Talk to Saathi** — A conversational support chat with keyword-based emotion detection (stress, anxiety, sadness, loneliness), bilingual responses (English/Hindi), mood tracking with an emoji summary, chat history persistence, and chat export to JSON.
- **Book a Counselor Session** — A confidential booking form for scheduling sessions (video, phone, in-person, or text), with urgency levels and privacy messaging.
- **Resource Hub** — A searchable, filterable library of videos, audio sessions, and guides covering anxiety, sleep, academic stress, mindfulness, and more, offered in English and Hindi.
- **Peer Support Forum** — An anonymous community space where students can post, reply, and like posts across categories like academic stress, homesickness, and self-doubt.


## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) component library
- [React Router](https://reactrouter.com/) for client-side routing
- [Supabase](https://supabase.com/) (PostgreSQL) for the peer support forum and booking database
- [Google Gemini API](https://ai.google.dev/) for AI-powered chat responses, via a Vercel serverless function
- [Vercel](https://vercel.com/) for hosting and deployment

## Getting Started

### Local development

```sh
# Install dependencies
npm install

# Create a .env.local file with:
# VITE_SUPABASE_URL=your-supabase-project-url
# VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Start the dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

### Database setup

This project uses [Supabase](https://supabase.com/) for the peer support forum and booking form. To run it yourself:

1. Create a free Supabase project
2. Create two tables — `posts` and `replies` — for the forum, and one table — `bookings` — for the booking form (see schema below)
3. Enable Row Level Security and add public read/insert policies for `posts` and `replies`, and a public insert-only policy for `bookings`
4. Copy your project URL and publishable key into `.env.local`

### Deployment

The live site is deployed on [Vercel](https://vercel.com/), connected to this GitHub repository. Every push to `main` triggers an automatic redeploy. The Supabase URL/key and Gemini API key are configured as environment variables in the Vercel project settings, not committed to the repo.

## Project Status

The chatbot is powered by the Gemini API with a rule-based fallback for reliability. The peer support forum and booking form are backed by a real Supabase database — posts, replies, likes, and bookings all persist. The resource hub remains a static content library. The forum and booking form are intentionally open to anyone, without requiring an account, to keep the barrier to seeking support as low as possible.

## License

This project is provided as-is for educational and portfolio purposes.
