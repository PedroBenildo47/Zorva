-- Users profile table
create table if not exists public.users (
	id uuid primary key default gen_random_uuid(),
	name text,
	email text unique,
	phone text,
	type text not null check (type in ('client','driver','admin')),
	location jsonb,
	rating numeric,
	avatar_url text,
	created_at timestamp with time zone default now(),
	updated_at timestamp with time zone default now()
);

-- Orders table
create table if not exists public.orders (
	id uuid primary key default gen_random_uuid(),
	customer_id uuid not null references public.users(id) on delete cascade,
		driver_id uuid references public.users(id) on delete set null,
	status text not null check (status in ('pending','accepted','enroute','delivered','canceled')) default 'pending',
	amount integer not null,
	origin jsonb not null,
	destination jsonb not null,
	payment_method text not null check (payment_method in ('card','cash')),
	payment_status text check (payment_status in ('unpaid','requires_action','paid','refunded')),
	distance_km numeric,
	created_at timestamp with time zone default now(),
	updated_at timestamp with time zone default now()
);

-- Messages table
create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	order_id uuid not null references public.orders(id) on delete cascade,
	sender_id uuid not null references public.users(id) on delete cascade,
	text text not null,
	created_at timestamp with time zone default now()
);

-- Device tokens for FCM
create table if not exists public.device_tokens (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.users(id) on delete cascade,
	token text not null,
	platform text check (platform in ('ios','android','web')),
	created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_driver on public.orders(driver_id);
create index if not exists idx_messages_order on public.messages(order_id);

-- RLS
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.device_tokens enable row level security;

-- Policies (basic examples, adjust as needed)
create policy if not exists "Users can view their own profile" on public.users
	for select using (auth.uid() = id);

create policy if not exists "Users can update their own profile" on public.users
	for update using (auth.uid() = id);

create policy if not exists "Insert profile for own user" on public.users
	for insert with check (auth.uid() = id);

create policy if not exists "Users can view related orders" on public.orders
	for select using (
		auth.uid() = customer_id or auth.uid() = driver_id
	);

create policy if not exists "Clients can insert orders" on public.orders
	for insert with check (
		auth.uid() = customer_id
	);

create policy if not exists "Drivers can update accepted orders" on public.orders
	for update using (
		auth.uid() = driver_id or auth.uid() = customer_id
	);

create policy if not exists "Users can read messages of their orders" on public.messages
	for select using (
		exists (
			select 1 from public.orders o
			where o.id = order_id and (o.customer_id = auth.uid() or o.driver_id = auth.uid())
		)
	);

create policy if not exists "Users can write messages for their orders" on public.messages
	for insert with check (
		exists (
			select 1 from public.orders o
			where o.id = order_id and (o.customer_id = auth.uid() or o.driver_id = auth.uid())
		)
	);