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