# Convoform Frontend

Forms that feel like conversations.

Next.js frontend for the Convoform (Tynoc Tech) Go backend.

## Stack
- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- @dnd-kit (question ordering)
- lucide-react
- recharts (analytics)

## Setup

```bash
cd frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install
npm run dev
```

Backend must be running on port 8080 (or the URL configured in `.env.local`).

## Environment

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── forms/                      # Public forms directory + by-id access
│   ├── (auth)/login, register
│   ├── (dashboard)/dashboard/...   # Protected dashboard
│   └── f/[publicId]                # External public chatbot link
├── components/                     # UI + domain components
├── services/                       # API layer
├── contexts/auth-context.tsx
├── hooks/                          # Reusable hooks
├── types/
└── lib/
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — start production server
