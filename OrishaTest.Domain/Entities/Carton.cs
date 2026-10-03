using OrishaTest.Domain.Common;

namespace OrishaTest.Domain.Entities
{
    public class Carton : BaseEntity
    {
        public Carton()
        {
            this.Id = Guid.NewGuid();
        }

        public string Code { get; set; } = string.Empty;

        public Guid PalletId { get; set; }
        public Pallet Pallet { get; set; } = null!;

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}