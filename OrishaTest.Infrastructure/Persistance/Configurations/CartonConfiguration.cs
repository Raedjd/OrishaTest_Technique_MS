using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Configurations
{
    public class CartonConfiguration : IEntityTypeConfiguration<Carton>
    {
        public void Configure(EntityTypeBuilder<Carton> builder)
        {
            builder.ToTable("Cartons");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Code).IsRequired().HasMaxLength(50);
            builder.HasIndex(c => new { c.PalletId, c.Code }).IsUnique();

            builder.HasMany(c => c.Products)
                   .WithOne(p => p.Carton)
                   .HasForeignKey(p => p.CartonId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}