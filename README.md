# DualDiary

A premium, private diary for two. Built with Next.js 14, Supabase, TailwindCSS, and Framer Motion.

## Getting Started

1.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local` (or create it) and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

2.  **Database Setup**:
    Go to your Supabase Dashboard -> SQL Editor and run the contents of `supabase/schema.sql`. This will:
    -   Create necessary tables (profiles, relationships, entries, themes).
    -   Set up Row Level Security (RLS) policies.
    -   Create triggers for user creation.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Features

-   **Authentication**: Email/Password & Google OAuth (via Supabase).
-   **Relationships**: Connect with one partner using a unique invite code.
-   **Private & Shared Entries**: Toggles for privacy per entry.
-   **Theming**: Customize colors, fonts, and radius (persisted to DB).
-   **Animations**: Smooth transitions with Framer Motion and GSAP.
-   **Mobile First**: Fully responsive design.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: TailwindCSS
-   **Database**: Supabase (PostgreSQL)
-   **State**: React Context + Supabase Realtime (optional expansion)

## Deployment

Deploy to Vercel:
1.  Import project.
2.  Add Environment Variables (SUPABASE_URL, SUPABASE_ANON_KEY).
3.  Deploy.
