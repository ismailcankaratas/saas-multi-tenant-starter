# Multi-Tenant SaaS Starter Kit - Frontend

This is the frontend application for the Multi-Tenant SaaS Starter Kit, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🏠 Landing Page with modern design
- 🔐 Authentication (Login/Register)
- 🏢 Multi-tenant support with tenant selection
- 📊 Dashboard with placeholder content
- 🎨 Modern UI components with dark mode support
- 🔒 Protected routes with JWT authentication
- 🔄 Automatic token refresh

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running (see `/api` directory)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown in terminal) with your browser to see the result.

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   └── app/                # Protected dashboard
├── components/             # React components
│   ├── ui/                 # UI components (Button, Input, Card, etc.)
│   ├── dashboard-layout.tsx # Dashboard layout with sidebar
│   ├── protected-route.tsx # Route protection wrapper
│   └── tenant-selection-modal.tsx
├── contexts/               # React contexts
│   └── auth-context.tsx    # Authentication context
└── lib/                    # Utilities
    ├── api.ts              # API client and functions
    └── utils.ts            # Helper functions
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
