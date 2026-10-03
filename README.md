

# OrishaTest – .NET 10 Clean Architecture + PostgreSQL + Docker Compose (Visual Studio)

## Structure

## From Visual Studio

1. Open `OrishaTest.sln`.
2. Right-click **docker-compose** → **Set as Startup Project**.
3. Press **F5** → Swagger opens; PostgreSQL starts before the API thanks to the health check.

EF Core migrations are applied automatically when the application starts.

## From the Command Line

```bash
docker compose up -d --build
```

- Swagger: http://localhost:5000/swagger
- PostgreSQL: `localhost:5432` (`postgres` / `postgres`), database: `orishatest`