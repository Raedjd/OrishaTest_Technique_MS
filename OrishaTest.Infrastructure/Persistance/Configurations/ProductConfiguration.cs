using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Ref).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
            builder.Property(p => p.Color).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Size).IsRequired().HasMaxLength(20);
            builder.Property(p => p.ExpectedQuantity).IsRequired();
            builder.Property(p => p.ReceivedQuantity).HasDefaultValue(0);
            builder.HasIndex(p => new { p.CartonId, p.Ref }).IsUnique();
        }
    }
}