using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Configurations
{
    public class PalletConfiguration : IEntityTypeConfiguration<Pallet>
    {
        public void Configure(EntityTypeBuilder<Pallet> builder)
        {
            builder.ToTable("Pallets");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Code).IsRequired().HasMaxLength(50);
            builder.HasIndex(p => new { p.OrderId, p.Code }).IsUnique();

            builder.HasMany(p => p.Cartons)
                   .WithOne(c => c.Pallet)
                   .HasForeignKey(c => c.PalletId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}