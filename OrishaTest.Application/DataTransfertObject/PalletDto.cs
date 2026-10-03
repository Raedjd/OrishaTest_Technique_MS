using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.DataTransfertObject.Orders
{
    public class PalletDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public int ExpectedQuantity { get; set; }
        public int ReceivedQuantity { get; set; }
        public ReceptionStatus Status { get; set; }
        public List<CartonDto> Cartons { get; set; } = new();
    }
}