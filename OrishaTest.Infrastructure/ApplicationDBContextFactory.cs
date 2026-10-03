using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OrishaTest.Infrastructure
{
    /// <summary>
    /// Utilisée uniquement par les outils "dotnet ef" (migrations) en dehors de l'exécution de l'API.
    /// </summary>
    public class ApplicationDBContextFactory : IDesignTimeDbContextFactory<ApplicationDBContext>
    {
        public ApplicationDBContext CreateDbContext(string[] args)
        {
            var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                ?? "Host=localhost;Port=5432;Database=orishatest;Username=postgres;Password=postgres";

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDBContext>();
            optionsBuilder.UseNpgsql(connectionString,
                o => o.MigrationsAssembly(typeof(ApplicationDBContext).Assembly.FullName));

            return new ApplicationDBContext(optionsBuilder.Options);
        }
    }
}
