-- Greenfield Local Hub (PostgreSQL)
-- Run this once to create tables for the API.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  phone text,
  role text not null check (role in ('customer', 'producer', 'admin')) default 'customer',
  name text not null default '',
  loyalty_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,                -- keep ids aligned with frontend e.g. "1"
  name text not null,
  price_label text not null,          -- e.g. "£10/kg"
  image text not null,                -- path or URL
  stock integer not null default 0,
  seller text not null,
  category text not null default 'other',
  created_at timestamptz not null default now()
);

create table if not exists basket_items (
  user_id uuid not null references users(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  quantity integer not null check (quantity >= 1),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  total_pence integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  name text not null,
  price_label text not null,
  quantity integer not null check (quantity >= 1)
);

