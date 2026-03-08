# Resmio.in - Restaurant Reservation & Payment System

A fully functional Next.js application for managing restaurant reservations and processing payments.

## Features

✅ **Reservation Management** - Customers can request table reservations
✅ **Payment Processing** - PayPal, Razorpay, and Stripe integration
✅ **Admin Dashboard** - View reservations and payment history
✅ **Database** - PostgreSQL with Prisma ORM (Vercel Postgres)
✅ **Modern UI** - Built with React, Tailwind CSS, and shadcn/ui components
✅ **Email Notifications** - SMTP email system for reservations
✅ **Authentication** - User signup, login, and session management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **UI**: Tailwind CSS, shadcn/ui components
- **Payments**: PayPal, Razorpay, Stripe
- **Email**: Nodemailer with SMTP

## Setup Instructions

### Prerequisites

- Node.js 18+
- Vercel account
- PostgreSQL database (Vercel Postgres recommended)

### 1. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage
2. Create PostgreSQL database
3. Connect to your project
4. Vercel auto-sets DATABASE_URL

#### Option B: External PostgreSQL
1. Create database (Supabase, Neon, Railway)
2. Get connection string
3. Set DATABASE_URL environment variable

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
# Vercel Postgres (auto-set in Vercel)
DATABASE_URL="postgres://restrobookings:PASSWORD@host:5432/database"

# PayPal (get from developer.paypal.com)
PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_CLIENT_SECRET="your_client_secret"
PAYPAL_MODE="sandbox"  # or 'live'

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Public (safe to expose)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_client_id"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 3. Installation

```bash
npm install
```

### 4. Database Migration

#### For Vercel Postgres:
1. Tables are auto-created on first deployment
2. Or run: `npx prisma db push`

#### For External Database:
```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Deployment

```bash
vercel --prod
```

## Troubleshooting

### Common Issues & Solutions

#### 1. "Failed to load resource" Error
**Cause**: Database tables don't exist
**Solution**: 
- Run `npx prisma db push`
- Or create tables manually in Vercel Dashboard
- Check DATABASE_URL is correct

#### 2. "500 Internal Server Error" on Signup
**Cause**: Database connection issues
**Solutions**:
- Verify DATABASE_URL in Vercel environment variables
- Check Vercel Functions logs for detailed errors
- Ensure database tables exist

#### 3. Prisma Generation Permission Error
**Cause**: File permission issues on Windows
**Solutions**:
- Run as administrator
- Use `npx prisma generate --skip-generate`
- Skip generation in build script

#### 4. Database Connection Issues
**Solutions**:
- Use Vercel Postgres (recommended)
- Check connection string format
- Verify database is running

## Project Structure

```
├── app/                 # Next.js app router
│   ├── api/           # API routes
│   ├── auth/           # Authentication pages
│   ├── owner/          # Admin dashboard
│   └── page.tsx        # Home page
├── components/          # React components
├── lib/               # Utilities and configurations
├── prisma/            # Database schema and migrations
└── public/             # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Reservations
- `GET /api/reservations` - Get user reservations
- `POST /api/reservations` - Create reservation

### Payments
- `POST /api/payments/create` - Create PayPal payment

## Database Schema

### Tables
- **User** - User accounts and profiles
- **Reservation** - Table reservations
- **Session** - User authentication sessions
- **Notification** - System notifications
- **Payment** - Payment records

## Deployment Notes

### Environment Variables Required for Production
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your Vercel domain
- `PAYPAL_CLIENT_ID` - PayPal API credentials
- `PAYPAL_CLIENT_SECRET` - PayPal API secret

### Vercel Configuration
- Build Command: `npm run build`
- Install Command: `npm install`
- Framework: Next.js

## Support

For issues with deployment or setup:
1. Check Vercel Functions logs
2. Verify environment variables
3. Ensure database tables exist
4. Test database connection locally

## License

MIT License - Feel free to use this project for your restaurant!

Or for development (creates migration):
```bash
pnpm prisma migrate dev --name init
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

### 5. Setup PayPal Webhook (Local Testing)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Log in or create an account
3. Create a new app (Merchant or Personal account)
4. Copy **Client ID** and **Client Secret**
5. Set them in `.env`:
```bash
PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_CLIENT_SECRET="your_client_secret"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_client_id"
```

For local webhook testing:
  `https://your-ngrok-url/api/payments/webhook`

### 6. Create Subscription Plan

PayPal handles recurring billing automatically through the Buttons integration.

## Project Structure

```
app/
├── page.tsx              # Landing page
├── reserve/
│   └── page.tsx          # Reservation form
├── owner/
│   ├── checkout/page.tsx # Stripe checkout
│   ├── success/page.tsx  # Payment success
│   ├── cancel/page.tsx   # Payment cancelled
│   └── dashboard/page.tsx # Admin dashboard
├── api/
│   ├── reservations/route.ts     # List/create reservations
│   └── payments/
│       ├── create/route.ts       # Create checkout session
│       ├── list/route.ts         # List payments
│       └── webhook/route.ts      # Stripe webhooks
components/
├── booking/booking-form.tsx      # Reservation form component
└── ui/                           # shadcn/ui components
lib/
├── prisma.ts                     # Prisma client singleton
└── utils.ts                      # Utility functions
prisma/
└── schema.prisma                 # Data models
```

## Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with features |
| `/reserve` | Customer reservation form |
| `/owner/checkout` | Stripe checkout page |
| `/owner/dashboard` | Admin dashboard (payments & reservations) |
| `/api/reservations` | API - GET/POST reservations |
| `/api/payments/create` | API - Create checkout session |
| `/api/payments/list` | API - List payments |
| `/api/payments/webhook` | Stripe webhook endpoint |

## Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm prisma generate  # Generate Prisma client
pnpm prisma migrate dev --name <name>  # Create & apply migration
pnpm prisma migrate deploy             # Apply migrations (production)
pnpm prisma studio   # Open Prisma Studio GUI
```

## Payment Flow

1. Owner visits `/owner/checkout`
2. Sees PayPal button
3. Clicks PayPal button → approves payment
4. PayPal processes $49 charge
5. Redirected to `/owner/success`
6. Webhook creates payment record in database
7. Owner can view payments in `/owner/dashboard`

## Testing Payments

Use PayPal Sandbox account (created automatically with your developer account):

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub, connect repo to Vercel
# Set environment variables in Vercel dashboard
# Update PayPal webhook in developer.paypal.com:
#   https://your-vercel-app.vercel.app/api/payments/webhook
```

### Deploying to Vercel (step-by-step)

1. Create a GitHub repository and push this project.
2. Go to https://vercel.com and import the repository.
3. During setup, set the following Environment Variables (in Vercel project Settings → Environment Variables):

  - `DATABASE_URL` → your Supabase Postgres connection string
  - `PAYPAL_CLIENT_ID` → your PayPal client ID (live/sandbox as appropriate)
  - `PAYPAL_CLIENT_SECRET` → your PayPal client secret
  - `PAYPAL_MODE` → `live` or `sandbox`
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` → same as `PAYPAL_CLIENT_ID`
  - `NEXT_PUBLIC_APP_URL` → `https://your-vercel-app.vercel.app`

4. Deploy the project from Vercel. After deploy, copy the production URL.
5. In PayPal Developer Dashboard, set a Webhook for your app to:
  `https://<your-vercel-app>.vercel.app/api/payments/webhook`

Notes:

### Other Platforms

Update `NEXT_PUBLIC_APP_URL` and `DATABASE_URL` for your platform. Update Stripe webhook URL to your production domain.

## Troubleshooting

**Port 3000 in use?**
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```

**Database connection error?**

**PayPal webhook not working?**

**Prisma migration issues?**
```bash
# Reset database (warning: deletes all data)
pnpm prisma migrate reset
```

## Support

For issues, check:

## License

MIT

## GitHub Actions (optional)

This project includes a sample GitHub Actions workflow at `.github/workflows/deploy.yml` that will:

- Checkout the repository
- Install dependencies with `pnpm`
- Run `pnpm prisma generate` and `pnpm prisma migrate deploy` using `DATABASE_URL` from GitHub Secrets
- Install the Vercel CLI and run `vercel --prod` (requires `VERCEL_TOKEN` secret)

Required GitHub Secrets to add to your repository (Settings → Secrets):

- `DATABASE_URL` - your Supabase Postgres connection string
- `VERCEL_TOKEN` - a Vercel token (create from https://vercel.com/account/tokens)

Optional but recommended:

- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE`

The workflow automatically runs on push to the `main` branch. If you'd prefer pull-request deployments or custom triggers, edit `.github/workflows/deploy.yml` accordingly.
