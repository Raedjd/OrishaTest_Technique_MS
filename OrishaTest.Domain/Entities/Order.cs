using OrishaTest.Domain.Common;

namespace OrishaTest.Domain.Entities
{
    public class Order : BaseEntity
    {
        public Order()
        {
            this.Id = Guid.NewGuid();
        }

        public string Number { get; set; } = string.Empty;
        public string? SupplierName { get; set; }

        public ICollection<Pallet> Pallets { get; set; } = new List<Pallet>();
    }
}