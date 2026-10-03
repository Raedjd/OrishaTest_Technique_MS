# OrishaTest – Warehouse Reception

Web API that lets a warehouse operator view a supplier order and validate its reception at three levels: **pallet**, **carton** and **product**.

**Stack:** .NET 10 · Clean Architecture · EF Core · PostgreSQL · Docker Compose

---

## Getting Started

### With Visual Studio

1. Open `OrishaTest.sln`.
2. Right-click **docker-compose** → **Set as Startup Project**.
3. Press **F5**. Swagger opens automatically.

### With the command line

```bash
docker compose up -d --build
```

- Swagger: http://localhost:5000/swagger
- PostgreSQL: `localhost:5432` — user `postgres`, password `postgres`, database `orishatest`

Migrations and sample data are applied automatically at startup.

To reset the database:

```bash
docker compose down -v
docker compose up -d --build
```

---

## Project Structure

| Project | Role |
|---|---|
| `OrishaTest.Domain` | Entities |
| `OrishaTest.Application` | Use cases (MediatR), DTOs, validation, status calculation |
| `OrishaTest.Infrastructure` | Database (EF Core), migrations, seed, repositories |
| `OrishaTest.Api` | REST controllers, Swagger |

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

Returns the matching products with their `id` and `orderId`. Useful for testing the `PUT` endpoints.

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

## Choices

- **No order creation:** as allowed by the specification, orders are seeded at startup.
- **Quantity instead of a checkbox:** a product stores a received quantity, so partial deliveries are supported. Checking a carton or pallet fills every product with its expected quantity.
- **Statuses are calculated, not stored:** carton, pallet and order statuses are always computed from product quantities, so they can never be inconsistent.
- **No overdelivery:** a received quantity cannot exceed the expected quantity.
- **Save on every action:** each click is saved immediately, so no work is lost if the operator is interrupted.

---

## Tests

Unit tests are in `OrishaTest.Tests` (xUnit). They cover the business rules without any database:

- status calculation (`NotReceived` / `Partial` / `Received`)
- validating all products of a carton one by one marks the carton as received
- unchecking one product makes the carton and the pallet partial
- validating a carton or a pallet updates all its products
- progress calculation ("X / Y items received")
- request validation (negative quantity)

Run them with:

```bash
dotnet test
```

## Migrations

Create a migration (from the solution root):

```bash
dotnet ef migrations add <Name> --project OrishaTest.Infrastructure --startup-project OrishaTest.Infrastructure --output-dir Persistance/Migrations
```