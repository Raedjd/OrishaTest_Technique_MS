# OrishaTest – Warehouse Reception (.NET 10 Clean Architecture + PostgreSQL + Docker Compose)

## Structure

| Project | Responsibility |
|---|---|
| `OrishaTest.Domain` | Entities and business rules. No dependency on other projects. |
| `OrishaTest.Application` | Use cases (MediatR commands/queries), DTOs, validation (FluentValidation), repository contracts. |
| `OrishaTest.Infrastructure` | EF Core `DbContext`, entity configurations, migrations, seed, repository implementations (PostgreSQL). |
| `OrishaTest.Api` | REST controllers, dependency injection, Swagger, automatic migration and seed at startup. |

## Domain Model

A supplier order follows this logistic hierarchy:

```
Order (CMD-2026)
 └── Pallet (PAL-01)          
      └── Carton (CART-01-A) 
           └── Product 
```

All entities inherit from `BaseEntity`:

### Order
### Pallet
### Carton
### Product

| Field | Type | Constraints | Example |
|---|---|---|---|
| `Ref` | `string` | Required, max 50, **unique per carton** | `TSH-RED-M` |
| `Name` | `string` | Required, max 200 | `T-Shirt Sport` |
| `Color` | `string` | Required, max 50 | `Rouge` |
| `Size` | `string` | Required, max 20 | `M` |
| `ExpectedQuantity` | `int` | Required | `50` |
| `ReceivedQuantity` | `int` | Default `0` | `0` |
| `CartonId` | `Guid` | Foreign key → `Carton` | |

### Database Tables

| Table | Unique index | Relationship |
|---|---|---|
| `Orders` | `Number` | — |
| `Pallets` | (`OrderId`, `Code`) | `OrderId` → `Orders` (cascade delete) |
| `Cartons` | (`PalletId`, `Code`) | `PalletId` → `Pallets` (cascade delete) |
| `Products` | (`CartonId`, `Ref`) | `CartonId` → `Cartons` (cascade delete) |

## Sample Data (Seed)

Sample orders are inserted into PostgreSQL at startup by `DataSeeder` (`OrishaTest.Infrastructure/Persistance/Seed/DataSeeder.cs`), right after the migrations are applied.

The seed only runs when the `Orders` table is empty, so restarting the application never duplicates data and keeps the reception progress.

| Order | Supplier | Pallets | Cartons | Products |
|---|---|---|---|---|
| `CMD-2026` | Sport Distribution | 2 | 4 | 9 |
| `CMD-2027` | Outdoor Equipements | 1 | 1 | 2 |

All products start with `ReceivedQuantity = 0`.


## API Endpoints

Base URL: `http://localhost:5000` — Swagger: `http://localhost:5000/swagger`

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/orders` | Paginated list of orders with reception progress |
| `GET` | `/api/orders/{id}` | Order detail: pallets → cartons → products, with statuses and progress |
| `PUT` | `/api/orders/{orderId}/products/{productId}/reception` | Update the received quantity of a product |

Reception statuses are computed at every level: `NotReceived`, `Partial`, `Received`.

### GET /api/orders

Query parameters: `pageNumber` (default 1), `pageSize` (default 10, max 100), `search` (order number or supplier).

```
GET /api/orders?pageNumber=1&pageSize=10&search=CMD
```

```json
{
  "Items": [
    {
      "id": "…",
      "number": "CMD-2026",
      "supplierName": "Sport Distribution",
      "status": "NotReceived",
      "palletCount": 2,
      "progress": { "receivedQuantity": 0, "expectedQuantity": 294, "percentage": 0 }
    }
  ],
  "TotalCount": 2,
  "PageNumber": 1,
  "PageSize": 10
}
```

### GET /api/orders/{id}

Returns the full hierarchy. Each pallet and carton includes its `expectedQuantity`, `receivedQuantity` and `status`.

| Code | Case |
|---|---|
| 200 | Order found |
| 404 | Order not found |


### GET /api/products

Search product lines by order number and/or reference. Useful to get the `orderId` and product `id` needed by the reception endpoint.

Query parameters (both optional):

| Parameter | Example | Description |
|---|---|---|
| `orderNumber` | `CMD-2026` | Order number |
| `ref` | `TSH-RED-M` | Product reference (SKU) |

```
GET /api/products?orderNumber=CMD-2026&ref=TSH-RED-M
```

```json
[
  {
    "id": "…",
    "ref": "TSH-RED-M",
    "name": "T-Shirt Sport",
    "color": "Rouge",
    "size": "M",
    "cartonCode": "CART-01-A",
    "palletCode": "PAL-01",
    "orderId": "…",
    "orderNumber": "CMD-2026",
    "expectedQuantity": 50,
    "receivedQuantity": 0,
    "status": "NotReceived"
  }
]
```

### PUT /api/orders/{orderId}/products/{productId}/reception

```json
{ "receivedQuantity": 50 }


```bash
docker compose down -v
docker compose up -d --build
```

## Getting Started

### From Visual Studio

1. Open `OrishaTest.sln`.
2. Right-click **docker-compose** → **Set as Startup Project**.
3. Press **F5** → Swagger opens; PostgreSQL starts before the API thanks to the health check.

EF Core migrations and the seed are applied automatically when the application starts.

### From the Command Line

```bash
docker compose up -d --build
```

- Swagger: http://localhost:5000/swagger
- PostgreSQL: `localhost:5432` (`postgres` / `postgres`), database: `orishatest`

## Migrations

Create a new migration (from the solution root):

```bash
dotnet ef migrations add <MigrationName> --project OrishaTest.Infrastructure --startup-project OrishaTest.Infrastructure --output-dir Persistance/Migrations
```

Apply migrations manually (PostgreSQL running on `localhost:5432`):

```bash
dotnet ef database update --project OrishaTest.Infrastructure --startup-project OrishaTest.Infrastructure
```