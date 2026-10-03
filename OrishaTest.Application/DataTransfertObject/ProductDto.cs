using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.DataTransfertObject
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Ref { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public int ExpectedQuantity { get; set; }
        public int ReceivedQuantity { get; set; }
        public ReceptionStatus Status { get; set; }
    }
}