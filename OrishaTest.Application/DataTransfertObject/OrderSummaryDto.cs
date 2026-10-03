using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.DataTransfertObject
{
    public class OrderSummaryDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = string.Empty;
        public string? SupplierName { get; set; }
        public ReceptionStatus Status { get; set; }
        public int PalletCount { get; set; }
        public ProgressDto Progress { get; set; } = new();
    }
}