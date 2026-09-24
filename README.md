# Lorana Casa & Obras — Web

Web frontend for **Lorana Casa & Obras**, an e-commerce platform for a Brazilian construction materials store. Built as my final project (TCC) for the Information Systems degree at Toledo Prudente Centro Universitário.

🔗 **Live demo:** https://lorana-web.fly.dev

⚙️ **Backend API:** [Lorana_Casa_E_Obras](https://github.com/PedroFabrin/Lorana_Casa_E_Obras)

## Features

**Storefront**
- Home page with hero carousel and featured products
- Product listing and product detail pages
- Shopping cart with instant feedback
- Checkout with online payment and a payment return page

**Customer area**
- Sign up and login
- Profile data, delivery addresses and order history

**Admin panel**
- Sales dashboard with charts
- Product management (create, edit, images) and categories
- Order management

## Tech stack

| Purpose | Technology |
|---|---|
| UI | React, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS, lucide-react icons |
| State | Zustand |
| Routing | React Router |
| HTTP | Axios |
| Charts | Recharts |
| Deployment | Docker, Nginx, Fly.io |

## Project structure

```
src/
├── pages/        # Storefront, account/ and admin/ pages
├── components/   # Layout, UI, auth and checkout components
├── store/        # Zustand stores (auth, cart)
├── hooks/        # Custom hooks (auth guard, logout, product images)
└── lib/          # API client, types, validation, formatting and payment helpers
```

## Getting started

**Requirements:** Node.js (LTS) and the [backend API](https://github.com/PedroFabrin/Lorana_Casa_E_Obras) running.

1. Install the dependencies:

```bash
npm install
```

2. Create a `.env` file pointing to the API:

```bash
VITE_API_URL=http://localhost:8000
```

3. Start the dev server:

```bash
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Deployment

The production build is served by Nginx in a Docker container (`Dockerfile.prod`) and deployed on **Fly.io**.

## Author

**Pedro Fabrin** — Backend Developer (Python, FastAPI, AI/LLMs)

[LinkedIn](https://www.linkedin.com/in/pedro-henrique-parizoto-fabrin-08765325b) · [GitHub](https://github.com/PedroFabrin)
