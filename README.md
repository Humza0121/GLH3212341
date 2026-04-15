# Greenfield Local Hub

Greenfield Local Hub is a small local farming marketplace web app. It lets customers browse products, add them to a basket, and place orders.

This project has:

- A **frontend** (React + TypeScript)
- A simple **backend API** (Node + Express) with a **PostgreSQL** database

## Tech stack

- **React** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** + **shadcn/ui**
- **React Router**
- **Node + Express** (backend API)
- **PostgreSQL** (database)

## How to run (Frontend)

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser.

Vite will print the URL in the terminal (usually `http://localhost:8080` in this project).

## How to run (Backend)

The backend lives in the `backend/` folder and runs on `http://localhost:5050`.

### 1) Create a PostgreSQL database

You need PostgreSQL installed and running. Create a database called:

- `greenfield_local_hub`

If you’re using pgAdmin, you can create it through the UI.

### 2) Set up backend environment variables

In `backend/`, copy the example env file and fill it in:

- Copy `backend/.env.example` to `backend/.env`
- Make sure `DATABASE_URL` matches your Postgres username/password

Example:

```env
PORT=5050
DATABASE_URL=postgres://postgres:postgres@localhost:5432/greenfield_local_hub
JWT_SECRET=change_me_in_real_use
CORS_ORIGIN=http://localhost:8080
```

### 3) Install backend dependencies

```bash
cd backend
npm install
```

### 4) Create the tables (schema)

This runs the SQL in `backend/src/db/schema.sql`:

```bash
npm run db:schema
```

### 5) Start the backend server

```bash
npm run dev
```

You can check it’s working by opening `http://localhost:5050/health` in your browser.

### Running frontend + backend together

- Terminal 1:

```bash
cd backend
npm run dev
```

- Terminal 2:

```bash
npm run dev
```

## Using the app

### Option A: create your own account

- Go to `/signup`
- Create a user
- Then log in at `/login`

### Option B: load test accounts (quick demo)

If you are using the backend, just sign up normally on `/signup`.

If you are running the older localStorage-only version, you can pre-load some accounts by pasting this into your browser console (DevTools).

```js
localStorage.setItem(
  "glh_users",
  JSON.stringify([
    {
      email: "customer@test.com",
      password: "password123",
      phone: "07700000001",
      role: "customer",
      loyaltyPoints: 50,
      name: "Test Customer",
    },
    {
      email: "producer@test.com",
      password: "password123",
      phone: "07700000002",
      role: "producer",
      loyaltyPoints: 0,
      name: "Green Valley Farm",
    },
    {
      email: "admin@test.com",
      password: "admin123",
      phone: "07700000003",
      role: "admin",
      loyaltyPoints: 0,
      name: "Site Admin",
    },
  ])
);
```

Refresh the page and log in with one of these:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@test.com` | `password123` |
| Producer | `producer@test.com` | `password123` |
| Admin | `admin@test.com` | `admin123` |

### What each role can do

#### Customer

- Browse products (homepage or `/see-all`)
- Add items to the basket
- Go to `/basket` to update quantities / remove items
- Checkout to create an order
- View past orders at `/orders`
- Edit profile at `/account`
- Change preferences at `/settings` (dark mode, text size, notifications)

#### Producer (currently limited)

The producer role exists, but at the moment it behaves the same as a customer. It is included to show how the app could be extended later (e.g. adding a producer dashboard).

#### Admin (currently limited)

The admin role exists, but admin-only features are not implemented yet. It is included to show role-based access could be added later.

## Data saved in localStorage

If you are using the backend, users/basket/orders are stored in PostgreSQL.

If you are using the localStorage-only version, the app stores data under these keys:

| Key | What it stores |
|---|---|
| `glh_users` | All registered users |
| `glh_current_user` | The currently logged-in user |
| `glh_basket` | Basket items |
| `glh_orders` | Past orders |
| `glh_dark_mode` | Dark mode preference |
| `glh_text_size` | Text size preference |
| `glh_notifications` | Notifications preference |
