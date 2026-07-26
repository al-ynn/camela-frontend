# Camela — Premium eCommerce App

A full-stack-ready, production-grade React eCommerce application built with a modern tech stack.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| State | Redux Toolkit + Redux Persist |
| Data Fetching | RTK Query (FakeStore API) |
| Styling | Tailwind CSS v3 + custom design system |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |
| Icons | Lucide React |

## Features

- 🛍 **Full shopping flow** — Browse, filter, sort, product detail, cart, checkout
- 🔐 **Authentication** — Login/Register/Forgot Password with demo credentials
- 💖 **Wishlist** — Toggle, persist, move to cart
- 🛒 **Cart** — Quantity management, coupon codes, totals
- 📦 **Multi-step Checkout** — Contact → Shipping → Delivery → Payment → Review
- 👤 **User Dashboard** — Orders, Profile, Addresses, Wishlist, Settings
- 🌙 **Dark Mode** — System-aware with manual toggle, persisted
- 📱 **Fully Responsive** — Mobile-first, 320px to 1920px+
- ✨ **Animations** — Intersection Observer + Framer Motion throughout
- ♿ **Accessible** — WCAG-compliant focus management and ARIA labels

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

```
Username: johnd
Password: m38rmF$
```

## Project Structure

```
src/
├── components/
│   ├── common/     # ErrorBoundary, ScrollToTop, LazyImage, ThemeProvider
│   ├── home/       # HeroSection, CategorySection, FeaturedProducts, FlashSale, etc.
│   ├── layout/     # Header, Footer, MobileMenu, SearchBar, CartDrawer, Breadcrumb
│   ├── product/    # ProductCard, ProductFilters, ProductSort
│   └── ui/         # Button, Badge, Input, Modal, Drawer, Tabs, Accordion, etc.
├── features/       # Redux slices (auth, cart, wishlist, ui, products, orders)
├── hooks/          # useAuth, useCart, useWishlist, useTheme, useDebounce, etc.
├── layouts/        # MainLayout, AuthLayout, DashboardLayout
├── pages/          # All route pages
├── routes/         # AppRoutes, ProtectedRoute
├── services/       # RTK Query API slices, Axios auth service
├── store/          # Redux store + redux-persist config
├── constants/      # routes.js, config.js
├── data/           # categories.js, brands.js
└── utils/          # formatters.js, helpers.js
```

## Available Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/shop` | All products |
| `/shop/:category` | Products by category |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/wishlist` | Wishlist |
| `/search?q=query` | Search results |
| `/checkout` | Multi-step checkout (protected) |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | User dashboard (protected) |

## Build

```bash
npm run build
npm run preview
```
