using OrishaTest.Domain.Common;

namespace OrishaTest.Domain.Entities
{
    public class Pallet : BaseEntity
    {
        public Pallet()
        {
            this.Id = Guid.NewGuid();
        }

        public string Code { get; set; } = string.Empty;

        public Guid OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public ICollection<Carton> Cartons { get; set; } = new List<Carton>();
    }
}