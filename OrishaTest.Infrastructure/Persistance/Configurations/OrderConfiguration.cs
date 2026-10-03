using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");
            builder.HasKey(o => o.Id);

            builder.Property(o => o.Number).IsRequired().HasMaxLength(50);
            builder.HasIndex(o => o.Number).IsUnique();

            builder.Property(o => o.SupplierName).HasMaxLength(200);

            builder.HasMany(o => o.Pallets)
                   .WithOne(p => p.Order)
                   .HasForeignKey(p => p.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}