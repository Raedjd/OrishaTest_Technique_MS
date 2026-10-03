using OrishaTest.Domain.Common;

namespace OrishaTest.Domain.Entities
{
    public class Product : BaseEntity
    {
        public Product()
        {
            this.Id = Guid.NewGuid();
        }

        public string Ref { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public int ExpectedQuantity { get; set; }
        public int ReceivedQuantity { get; set; }

        public Guid CartonId { get; set; }
        public Carton Carton { get; set; } = null!;
    }
}