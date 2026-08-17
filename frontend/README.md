# Employee Management Frontend (Next.js)

This project is a Next.js implementation of the Employee Management Frontend.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8085`

## Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:8085
```

## Implementation Details

- **Framework**: Next.js 16.0.8 (App Router)
- **API Client**: Axios 1.13.2
- **Form Handling**: React Hook Form + Zod

### Implemented Features

- **User Authentication**: Full implementation of login and logout functionality.
- **Mockup Pages**: All other pages (Employee List, Detail, Edit, etc.) are implemented as static HTML mockups.
