# Zorva Monorepo

Multi-app delivery platform (client, driver, admin) with a Node.js backend and Supabase.

## Apps
- client-app: React Native (Expo) client
- driver-app: React Native (Expo) driver
- admin-app: Next.js 14 admin dashboard
- server: Node.js + Express API
- shared: Shared types and utilities

## Tech
- Supabase (Postgres, Auth, Storage, Realtime)
- Google Maps API
- Stripe (test mode)
- FCM (push notifications)

## Development
- Install deps: `npm install`
- Run backend: `npm run dev:server`
- Run admin: `npm run dev:admin`
- Run client: `npm run dev:client`
- Run driver: `npm run dev:driver`

Env templates are in each package's `.env.example`.
