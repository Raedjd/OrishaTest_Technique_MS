using OrishaTest.Application.DataTransfertObject.Orders;
using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.DataTransfertObject
{
    public class OrderDetailDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = string.Empty;
        public string? SupplierName { get; set; }
        public ReceptionStatus Status { get; set; }
        public ProgressDto Progress { get; set; } = new();
        public List<PalletDto> Pallets { get; set; } = new();
    }
}