using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.DataTransfertObject
{
    public class ProductLookupDto
    {
        public Guid Id { get; set; }
        public string Ref { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string CartonCode { get; set; } = string.Empty;
        public string PalletCode { get; set; } = string.Empty;
        public Guid OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int ExpectedQuantity { get; set; }
        public int ReceivedQuantity { get; set; }
        public ReceptionStatus Status { get; set; }
    }
}