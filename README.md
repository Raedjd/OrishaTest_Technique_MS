# OrishaTest – Warehouse Reception/ Sign in with the demo account(hardcoded): `raed.jaiidi@gmail.com` / `Admin123`


Web application that lets a warehouse operator view a supplier order and validate its reception at three levels: **pallet**, **carton** and **product**.

| Part | Stack |
|---|---|
| Back-end | .NET 10 · Clean Architecture · EF Core · PostgreSQL · MediatR · FluentValidation |
| Front-end | Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui · axios |
| Tooling | Docker Compose · xUnit |

---

## Getting Started

### Everything with Docker (recommended)

From the repository root:

```bash
docker compose up -d --build
```

| Service | URL |
|---|---|
| Front-end | http://localhost:3050 |
| API (Swagger) | http://localhost:5000/swagger |
| PostgreSQL | `localhost:5432` — user `postgres`, password `postgres`, database `orishatest` |

Sign in with the demo account(hardcoded): `raed.jaiidi@gmail.com` / `Admin123`

Migrations and sample data are applied automatically when the API starts.

### Front-end in development mode

Start the API and the database with Docker, then run the client locally:

```bash
docker compose up -d --build orishatest.api postgres
cd OrishaTestClient
npm install
npm run dev
```

Open http://localhost:3000.

The client calls the API at `http://localhost:5000/api/` by default. Override it with the `NEXT_PUBLIC_API_URL` environment variable if needed. The API allows calls from `http://localhost:3000` and `http://localhost:3050` (CORS).

### With Visual Studio

1. Open `OrishaTest.sln`.
2. Right-click **docker-compose** → **Set as Startup Project**.
3. Press **F5**.

### Reset the database

```bash
docker compose down -v
docker compose up -d --build
```

---

## Project Structure

| Folder | Role |
|---|---|
| `OrishaTest.Domain` | Entities |
| `OrishaTest.Application` | Use cases (MediatR), DTOs, validation, status calculation |
| `OrishaTest.Infrastructure` | Database (EF Core), migrations, seed, repositories |
| `OrishaTest.Api` | REST controllers, Swagger, CORS |
| `OrishaTest.Tests` | Unit tests (xUnit) |
| `OrishaTestClient` | Next.js front-end |

---

## Data Model

```
Order (CMD-2026)
 └── Pallet (PAL-01)
      └── Carton (CART-01-A)
           └── Product (TSH-RED-M)
```

| Entity | Main fields |
|---|---|
| **Order** | `Number`, `SupplierName` |
| **Pallet** | `Code`, `OrderId` |
| **Carton** | `Code`, `PalletId` |
| **Product** | `Ref`, `Name`, `Color`, `Size`, `ExpectedQuantity`, `ReceivedQuantity`, `CartonId` |

Every entity has a `Guid Id`. Deleting an order also deletes its pallets, cartons and products.

---

## Sample Data

Two orders are created at startup (only if the database is empty):

| Order | Supplier | Pallets | Cartons | Products |
|---|---|---|---|---|
| `CMD-2026` | Sport Distribution | 2 | 4 | 9 |
| `CMD-2027` | Outdoor Equipements | 1 | 1 | 2 |

All products start with `ReceivedQuantity = 0`.

---

## Reception Status

Each level has a status computed from its quantities:

| Received quantity | Status |
|---|---|
| 0 | `NotReceived` |
| Equal to expected | `Received` |
| In between | `Partial` |

A carton sums its products, a pallet sums its cartons, an order sums its pallets.

**Example:** carton `CART-01-A` contains 50 T-shirts and 10 shoes.
- T-shirts received → carton `Partial` (50/60)
- Shoes received too → carton `Received` (60/60), automatically
- Shoes set back to 0 → carton `Partial` again

---

## Front-end

### Pages

| Route | Description |
|---|---|
| `/dashboard/shops/orders` | Supplier orders with their reception progress (search + pagination) |
| `/dashboard/shops/orders/[id]` | Order reception: pallets → cartons → products, with checkboxes and progress gauge |
| `/dashboard/shops/products` | Find a product by order number or reference and set its received quantity |

### How reception works in the interface

- Each pallet, carton and product has a checkbox:
  - checked: received
  - dash: partially received
  - empty: not received
- Checking a pallet or a carton marks everything inside it as received. Unchecking resets it to 0.
- Each product also has a quantity field for partial deliveries (from 0 to the expected quantity).
- A gauge shows "X / Y items received" for the whole order.
- To keep the screen light, pallets are collapsed by default (only the first pallet left to check is open), and "Hide received items" shows only what remains to check.

### Client structure

| Folder | Content |
|---|---|
| `src/app` | Routes (App Router) |
| `src/client/components/dashboard/shops/orders` | Order list, reception tree, status badge, checkbox and gauge |
| `src/client/components/dashboard/shops/products` | Product search and received quantity dialog |
| `src/client/hooks` | `useOrders`, `useOrderDetail`, `useProduct` |
| `src/client/services` | API calls (`orders.service.ts`, `products.service.ts`) |
| `src/client/shared/types` | Types matching the API DTOs (`order.ts`, `product.ts`) |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/orders` | List of orders (paginated) |
| `GET` | `/api/orders/{id}` | Order detail with pallets, cartons, products |
| `GET` | `/api/products` | Find products by order number and reference |
| `PUT` | `/api/orders/{orderId}/products/{productId}/reception` | Set the received quantity of a product |
| `PUT` | `/api/orders/{orderId}/cartons/{cartonId}/reception` | Mark a whole carton as received / not received |
| `PUT` | `/api/orders/{orderId}/pallets/{palletId}/reception` | Mark a whole pallet as received / not received |

All `PUT` endpoints return the **updated order**, so the client gets the new statuses and progress in one call.

### GET /api/orders

```
GET /api/orders?pageNumber=1&pageSize=10&search=CMD
```

| Parameter | Default | Description |
|---|---|---|
| `pageNumber` | 1 | Page number |
| `pageSize` | 10 | Items per page (max 100) |
| `search` | — | Order number or supplier |

### GET /api/orders/{id}

Returns the full tree. Each pallet and carton includes `expectedQuantity`, `receivedQuantity` and `status`. The order includes a `progress` block:

```json
"progress": { "receivedQuantity": 50, "expectedQuantity": 294, "percentage": 17 }
```

### GET /api/products

```
GET /api/products?orderNumber=CMD-2026&ref=TSH-RED-M
```

Returns the matching products with their `id` and `orderId`.

### PUT .../products/{productId}/reception

```json
{ "receivedQuantity": 50 }
```

### PUT .../cartons/{cartonId}/reception and .../pallets/{palletId}/reception

```json
{ "received": true }
```

- `true`: all products get `receivedQuantity = expectedQuantity`
- `false`: all products go back to `0`

### Response codes

| Code | Case |
|---|---|
| 200 | Success |
| 400 | Invalid data (negative quantity, quantity above expected, invalid page size) |
| 404 | Order, pallet, carton or product not found (or not in this order) |

---

## Tests

Unit tests are in `OrishaTest.Tests` (xUnit). They cover the business rules without any database:

- status calculation (`NotReceived` / `Partial` / `Received`)
- validating all products of a carton one by one marks the carton as received
- unchecking one product makes the carton and the pallet partial
- validating a carton or a pallet updates all its products
- progress calculation ("X / Y items received")
- request validation (negative quantity)

```bash
dotnet test
```

---

## Choices

- **No order creation:** as allowed by the specification, orders are seeded at startup.
- **Quantity instead of a simple checkbox:** a product stores a received quantity, so partial deliveries are supported. Checking a product fills its expected quantity; checking a carton or pallet fills every product inside it.
- **Statuses are calculated, not stored:** carton, pallet and order statuses are always computed from product quantities, so they can never be inconsistent.
- **No overdelivery:** a received quantity cannot exceed the expected quantity.
- **Save on every action:** each click is saved immediately, so no work is lost if the operator is interrupted. The API returns the updated order, so the interface never recalculates statuses on its own.
- **Light interface:** collapsible tree, only the first pallet to check is open, and an option to hide what is already received.
- **Mock login:** the front-end uses a demo account; authentication is out of the scope of this test.

---

Note:
Last commit for hotfix: HTTP only in docker: the api runs over HTTP(port 5000) inside docker.HTTPS required the ASP.NET developer certificate from the other machine.
Please understand the cause of commit hotfix

## Migrations

Create a migration (from the solution root):

```bash
dotnet ef migrations add <Name> --project OrishaTest.Infrastructure --startup-project OrishaTest.Infrastructure --output-dir Persistance/Migrations

⭐ **Don't forget to star this repo if you found it useful!**
```