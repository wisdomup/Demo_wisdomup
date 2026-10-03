# WisdomUp Frontend

Customer-facing web application for the WisdomUp E-Commerce platform.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4 + shadcn/ui
- **State Management:** Redux Toolkit + RTK Query
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── account/           # User account pages
│   ├── cart/              # Shopping cart
│   ├── categories/        # Category listing
│   ├── checkout/          # Checkout flow
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── products/          # Product listing & detail
│   └── wishlist/          # User wishlist
├── components/
│   ├── layout/            # Header, Footer
│   ├── providers/         # StoreProvider (Redux)
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── constants.ts       # App constants & config
│   └── utils.ts           # Utility functions (cn, formatPrice, etc.)
├── schemas/               # Zod validation schemas
│   ├── auth.schema.ts
│   ├── address.schema.ts
│   ├── checkout.schema.ts
│   └── profile.schema.ts
├── store/
│   ├── api/               # RTK Query API slices
│   │   ├── baseApi.ts     # Payload CMS API
│   │   ├── expressApi.ts  # Express backend API
│   │   ├── authApi.ts
│   │   ├── productsApi.ts
│   │   ├── categoriesApi.ts
│   │   ├── cartApi.ts
│   │   ├── checkoutApi.ts
│   │   ├── wishlistApi.ts
│   │   └── ordersApi.ts
│   ├── slices/            # Redux state slices
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   └── uiSlice.ts
│   ├── hooks.ts           # Typed useAppSelector/useAppDispatch
│   └── store.ts           # Store configuration
└── types/                 # TypeScript interfaces
    ├── product.ts
    ├── category.ts
    ├── user.ts
    ├── order.ts
    ├── cart.ts
    ├── api.ts
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PAYLOAD_API_URL` | Payload CMS API URL (default: `http://localhost:3001/api`) |
| `NEXT_PUBLIC_EXPRESS_API_URL` | Express backend API URL (default: `http://localhost:3002/api`) |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_NAME` | Site name displayed in UI |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for checkout |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Architecture

### API Integration

The frontend communicates with two backends:

1. **Payload CMS** (`baseApi.ts`) — Authentication, products, categories, orders, media
2. **Express API** (`expressApi.ts`) — Cart, checkout, payments, wishlist, analytics

Both share the same JWT authentication. Payload issues the token, Express verifies it using the shared `PAYLOAD_SECRET`.

### State Management

- **RTK Query** handles server state (caching, refetching, optimistic updates)
- **Redux slices** handle client state (auth session, cart UI, global UI state)

### Forms

All forms use React Hook Form with Zod schema validation via `@hookform/resolvers`.

## Deployment

Optimized for **Vercel**:

```bash
npm run build
```

Set environment variables in Vercel dashboard for production values.

## Related Repositories

- [WisdomUp Backend](https://github.com/wisdom-up/wisdomup_backend) — Express API
- [WisdomUp Admin Panel](https://github.com/wisdom-up/wisdomup_adminpanel) — Payload CMS
