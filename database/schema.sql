
-- Additional entities for stores, products, order_items, deliveries, coupons, driver_documents, ratings

-- Users extra columns
alter table if exists public.users
	add column if not exists password_hash text,
	add column if not exists approval_status text check (approval_status in ('pending','approved','rejected')) default 'pending';

-- Stores (partners)
create table if not exists public.stores (
	id uuid primary key default gen_random_uuid(),
	owner_user_id uuid references public.users(id) on delete set null,
	name text not null,
	description text,
	location jsonb,
	is_approved boolean default false,
	created_at timestamp with time zone default now(),
	updated_at timestamp with time zone default now()
);

-- Products (menu)
create table if not exists public.products (
	id uuid primary key default gen_random_uuid(),
	store_id uuid not null references public.stores(id) on delete cascade,
	name text not null,
	description text,
	photo_url text,
	price_cents integer not null,
	is_available boolean default true,
	created_at timestamp with time zone default now(),
	updated_at timestamp with time zone default now()
);

-- Orders extra columns
alter table if exists public.orders
	add column if not exists store_id uuid references public.stores(id) on delete set null;

-- Order items
create table if not exists public.order_items (
	id uuid primary key default gen_random_uuid(),
	order_id uuid not null references public.orders(id) on delete cascade,
	product_id uuid not null references public.products(id),
	quantity integer not null check (quantity > 0),
	price_cents integer not null
);

-- Deliveries (assignment and tracking)
create table if not exists public.deliveries (
	id uuid primary key default gen_random_uuid(),
	order_id uuid unique not null references public.orders(id) on delete cascade,
	driver_id uuid references public.users(id) on delete set null,
	status text not null check (status in ('pending','assigned','picked_up','enroute','delivered','canceled')) default 'pending',
	driver_location jsonb,
	route jsonb,
	created_at timestamp with time zone default now(),
	updated_at timestamp with time zone default now()
);

-- Coupons
create table if not exists public.coupons (
	id uuid primary key default gen_random_uuid(),
	code text unique not null,
	discount_type text not null check (discount_type in ('percent','fixed')),
	value numeric not null,
	min_amount integer,
	starts_at timestamp with time zone,
	ends_at timestamp with time zone,
	is_active boolean default true,
	created_at timestamp with time zone default now()
);

-- Driver documents for KYC
create table if not exists public.driver_documents (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.users(id) on delete cascade,
	type text not null,
	url text not null,
	status text not null check (status in ('pending','approved','rejected')) default 'pending',
	submitted_at timestamp with time zone default now(),
	reviewed_at timestamp with time zone
);

-- Ratings
create table if not exists public.ratings (
	id uuid primary key default gen_random_uuid(),
	order_id uuid not null references public.orders(id) on delete cascade,
	rater_user_id uuid not null references public.users(id) on delete cascade,
	ratee_user_id uuid not null references public.users(id) on delete cascade,
	type text check (type in ('store','driver')),
	score integer check (score >= 1 and score <= 5),
	comment text,
	created_at timestamp with time zone default now()
);

-- Indexes for new tables
create index if not exists idx_orders_store on public.orders(store_id);
create index if not exists idx_products_store on public.products(store_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_deliveries_driver on public.deliveries(driver_id);
create index if not exists idx_ratings_ratee on public.ratings(ratee_user_id);

-- Enable RLS for new tables
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.coupons enable row level security;
alter table public.driver_documents enable row level security;
alter table public.ratings enable row level security;

-- Example policies (simplified)
create policy if not exists "Public can read approved stores" on public.stores for select using (is_approved = true);
create policy if not exists "Owners manage own stores" on public.stores for all using (auth.uid() = owner_user_id);

create policy if not exists "Public can read available products" on public.products for select using (is_available = true);
create policy if not exists "Store manages own products" on public.products for all using (
	exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
);

create policy if not exists "Users read their deliveries" on public.deliveries for select using (
	exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.driver_id = auth.uid()))
);