# OrishaTest – Client (Next.js)

Front-end of the warehouse reception test. It consumes the .NET API (`OrishaTest`).

**Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui · axios

## Getting Started

1. Start the API first (from the backend repository):

   ```bash
   docker compose up -d --build
   ```

2. Install and run the client:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000 and sign in with the demo account (`raed.jaidi` / `Admin123!`).

The API URL defaults to `http://localhost:5000/api/`. Override it with the `NEXT_PUBLIC_API_URL` environment variable if needed.

## Pages

| Route | Description |
|---|---|
| `/dashboard/shops/orders` | Supplier orders with their reception progress (search + pagination) |
| `/dashboard/shops/orders/[id]` | Order reception: pallets → cartons → products, with checkboxes and progress gauge |
| `/dashboard/shops/products` | Find a product by order number or reference and set its received quantity |

## How reception works

- Each pallet, carton and product has a checkbox:
  - checked: received
  - dash: partially received
  - empty: not received
- Checking a pallet or a carton marks everything inside it as received. Unchecking resets it to 0.
- Each product also has a quantity field for partial deliveries (from 0 to the expected quantity).
- Every action is saved immediately. The API returns the updated order, so statuses and the gauge refresh right away.
- Pallets are collapsed by default (only the first pallet left to check is open), and "Hide received items" shows only what remains to check.

## Project Structure

| Folder | Content |
|---|---|
| `src/app` | Routes (App Router) |
| `src/client/components/dashboard/shops/orders` | Order list, order reception tree, status badge, checkbox and gauge |
| `src/client/components/dashboard/shops/products` | Product search and received quantity dialog |
| `src/client/hooks` | `useOrders`, `useOrderDetail`, `useProduct` |
| `src/client/services` | API calls (`orders.service.ts`, `products.service.ts`) |
| `src/client/shared/types` | Types matching the API DTOs (`order.ts`, `product.ts`) |
